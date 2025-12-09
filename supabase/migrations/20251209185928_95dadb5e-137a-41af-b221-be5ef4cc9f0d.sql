-- Create tags table for categorizing hallucinations
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Tags are viewable by everyone
CREATE POLICY "Tags are viewable by everyone"
ON public.tags FOR SELECT USING (true);

-- Create hallucination_reports table
CREATE TABLE public.hallucination_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  model TEXT NOT NULL,
  vendor TEXT NOT NULL,
  prompt TEXT NOT NULL,
  hallucinated_output TEXT NOT NULL,
  corrected_info TEXT,
  sources TEXT[],
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'verified', 'disputed', 'resolved')),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on hallucination_reports
ALTER TABLE public.hallucination_reports ENABLE ROW LEVEL SECURITY;

-- Reports are viewable by everyone
CREATE POLICY "Reports are viewable by everyone"
ON public.hallucination_reports FOR SELECT USING (true);

-- Users can create their own reports
CREATE POLICY "Users can create their own reports"
ON public.hallucination_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update their own reports"
ON public.hallucination_reports FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete their own reports"
ON public.hallucination_reports FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create report_tags junction table
CREATE TABLE public.report_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.hallucination_reports(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (report_id, tag_id)
);

-- Enable RLS on report_tags
ALTER TABLE public.report_tags ENABLE ROW LEVEL SECURITY;

-- Report tags are viewable by everyone
CREATE POLICY "Report tags are viewable by everyone"
ON public.report_tags FOR SELECT USING (true);

-- Users can add tags to their own reports
CREATE POLICY "Users can add tags to their own reports"
ON public.report_tags FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.hallucination_reports
    WHERE id = report_id AND user_id = auth.uid()
  )
);

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_id UUID REFERENCES public.hallucination_reports(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, report_id)
);

-- Enable RLS on ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Ratings are viewable by everyone
CREATE POLICY "Ratings are viewable by everyone"
ON public.ratings FOR SELECT USING (true);

-- Users can create their own ratings
CREATE POLICY "Users can create their own ratings"
ON public.ratings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
ON public.ratings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create vendor_responses table for vendor replies to reports
CREATE TABLE public.vendor_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.hallucination_reports(id) ON DELETE CASCADE NOT NULL,
  vendor_name TEXT NOT NULL,
  response TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'fixed', 'wont_fix')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vendor_responses
ALTER TABLE public.vendor_responses ENABLE ROW LEVEL SECURITY;

-- Vendor responses are viewable by everyone
CREATE POLICY "Vendor responses are viewable by everyone"
ON public.vendor_responses FOR SELECT USING (true);

-- Create bounties table for reward system
CREATE TABLE public.bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  model TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_amount DECIMAL(18, 8) NOT NULL,
  reward_currency TEXT NOT NULL DEFAULT 'ETH',
  severity_required TEXT NOT NULL DEFAULT 'critical' CHECK (severity_required IN ('medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bounties
ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;

-- Bounties are viewable by everyone
CREATE POLICY "Bounties are viewable by everyone"
ON public.bounties FOR SELECT USING (true);

-- Create bounty_claims table
CREATE TABLE public.bounty_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID REFERENCES public.bounties(id) ON DELETE CASCADE NOT NULL,
  report_id UUID REFERENCES public.hallucination_reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (bounty_id, report_id)
);

-- Enable RLS on bounty_claims
ALTER TABLE public.bounty_claims ENABLE ROW LEVEL SECURITY;

-- Claims are viewable by the user who made them
CREATE POLICY "Users can view their own claims"
ON public.bounty_claims FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create claims
CREATE POLICY "Users can create claims"
ON public.bounty_claims FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at on hallucination_reports
CREATE TRIGGER update_hallucination_reports_updated_at
BEFORE UPDATE ON public.hallucination_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default tags
INSERT INTO public.tags (name) VALUES
  ('Factual Error'),
  ('Historical Inaccuracy'),
  ('Scientific Misinformation'),
  ('Legal Misinformation'),
  ('Medical Misinformation'),
  ('Mathematical Error'),
  ('Logical Fallacy'),
  ('Fabricated Citation'),
  ('Outdated Information'),
  ('Bias'),
  ('Hallucinated Entity'),
  ('Code Error');
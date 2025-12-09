import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { PrivacyWarning } from "@/components/PrivacyWarning";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateReport } from "@/hooks/useReports";

const modelsByVendor: Record<string, string[]> = {
  "OpenAI": ["GPT-4o", "GPT-4 Turbo", "GPT-3.5 Turbo", "o1-preview", "o1-mini"],
  "Anthropic": ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude 3 Haiku"],
  "Google DeepMind": ["Gemini 2.5", "Gemini 1.5 Pro", "Gemini 1.5 Flash"],
  "Meta AI": ["Llama 3.1 405B", "Llama 3.1 70B", "Llama 3.1 8B"],
  "Mistral AI": ["Mixtral 8x7B", "Mistral Large", "Mistral Medium"],
  "Other": ["Other"],
};

const severityOptions = [
  { value: "low", label: "Low - Minor inaccuracy" },
  { value: "medium", label: "Medium - Noticeable error" },
  { value: "high", label: "High - Significant misinformation" },
  { value: "critical", label: "Critical - Dangerous/harmful" },
];

export default function ReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createReport = useCreateReport();
  const [formData, setFormData] = useState({
    vendor: "",
    model: "",
    prompt: "",
    hallucination: "",
    correction: "",
    sources: "",
    severity: "medium",
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to submit a report");
      return;
    }

    if (!formData.vendor || !formData.model || !formData.prompt || !formData.hallucination) {
      toast.error("Please fill in all required fields");
      return;
    }

    const sourcesArray = formData.sources
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    await createReport.mutateAsync({
      vendor: formData.vendor,
      model: formData.model,
      prompt: formData.prompt,
      hallucinated_output: formData.hallucination,
      corrected_info: formData.correction || undefined,
      sources: sourcesArray.length > 0 ? sourcesArray : undefined,
      severity: formData.severity,
      is_anonymous: formData.isAnonymous,
    });

    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-md text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to submit a hallucination report.
          </p>
          <Button asChild>
            <Link to="/auth">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In to Continue
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <AlertCircle className="h-8 w-8 text-primary" />
            Report a Hallucination
          </h1>
          <p className="text-muted-foreground">
            Help improve AI accuracy by documenting hallucinations and inaccuracies
          </p>
        </div>

        <div className="mb-6">
          <PrivacyWarning />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hallucination Details</CardTitle>
            <CardDescription>
              Provide as much detail as possible to help the community understand the issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">
                    AI Vendor <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.vendor}
                    onValueChange={(value) => setFormData({ ...formData, vendor: value, model: "" })}
                  >
                    <SelectTrigger id="vendor">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(modelsByVendor).map((vendor) => (
                        <SelectItem key={vendor} value={vendor}>
                          {vendor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">
                    AI Model <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.model}
                    onValueChange={(value) => setFormData({ ...formData, model: value })}
                    disabled={!formData.vendor}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder={formData.vendor ? "Select model" : "Select vendor first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.vendor && modelsByVendor[formData.vendor]?.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">
                  Severity Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger id="severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">
                  Original Prompt <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="What prompt did you give to the AI?"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hallucination">
                  Hallucinated Output <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="hallucination"
                  placeholder="What incorrect information did the AI provide?"
                  value={formData.hallucination}
                  onChange={(e) => setFormData({ ...formData, hallucination: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correction">Corrected Information (Optional)</Label>
                <Textarea
                  id="correction"
                  placeholder="What is the correct information?"
                  value={formData.correction}
                  onChange={(e) => setFormData({ ...formData, correction: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sources">Sources (Optional)</Label>
                <Textarea
                  id="sources"
                  placeholder="One URL or reference per line"
                  value={formData.sources}
                  onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Add links or references that verify the correct information (one per line)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAnonymous: checked === true })
                  }
                />
                <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer">
                  Submit anonymously (hide my username)
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={createReport.isPending} className="flex-1">
                  {createReport.isPending ? "Submitting..." : "Submit Report"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={createReport.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

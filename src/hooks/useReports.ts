import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface HallucinationReport {
  id: string;
  user_id: string;
  model: string;
  vendor: string;
  prompt: string;
  hallucinated_output: string;
  corrected_info: string | null;
  sources: string[] | null;
  severity: string;
  status: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  average_rating?: number;
  rating_count?: number;
}

export interface Tag {
  id: string;
  name: string;
}

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hallucination_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as HallucinationReport[];
    },
  });
}

export function useReportsByUser(userId: string) {
  return useQuery({
    queryKey: ["reports", "user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hallucination_reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as HallucinationReport[];
    },
    enabled: !!userId,
  });
}

export function useReportsByVendor(vendor: string) {
  return useQuery({
    queryKey: ["reports", "vendor", vendor],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hallucination_reports")
        .select("*")
        .eq("vendor", vendor)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as HallucinationReport[];
    },
    enabled: !!vendor,
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hallucination_reports")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as HallucinationReport | null;
    },
    enabled: !!id,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Tag[];
    },
  });
}

interface CreateReportData {
  model: string;
  vendor: string;
  prompt: string;
  hallucinated_output: string;
  corrected_info?: string;
  sources?: string[];
  severity?: string;
  is_anonymous?: boolean;
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateReportData) => {
      if (!user) throw new Error("Must be logged in to create a report");

      const { data: report, error } = await supabase
        .from("hallucination_reports")
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report submitted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to submit report: " + error.message);
    },
  });
}

export function useRateReport() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ reportId, rating }: { reportId: string; rating: number }) => {
      if (!user) throw new Error("Must be logged in to rate");

      const { error } = await supabase
        .from("ratings")
        .upsert({
          user_id: user.id,
          report_id: reportId,
          rating,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Rating submitted!");
    },
    onError: (error) => {
      toast.error("Failed to rate: " + error.message);
    },
  });
}

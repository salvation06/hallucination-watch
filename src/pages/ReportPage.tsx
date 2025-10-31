import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PrivacyWarning } from "@/components/PrivacyWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const availableModels = [
  "GPT-4o",
  "GPT-4 Turbo",
  "GPT-3.5 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Claude 3 Haiku",
  "Gemini 2.5",
  "Gemini 1.5 Pro",
  "Llama 3.1 405B",
  "Mixtral 8x7B",
  "Other",
];

export default function ReportPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    prompt: "",
    hallucination: "",
    correction: "",
    sources: "",
    tags: "",
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model || !formData.prompt || !formData.hallucination) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Report submitted successfully!");
    navigate("/");
  };

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
              <div className="space-y-2">
                <Label htmlFor="model">
                  AI Model <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select the AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
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
                  placeholder="Links or references that verify the correct information"
                  value={formData.sources}
                  onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., medical, finance, code, safety (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Use tags like: #medical, #finance, #code, #safety, #politics, #history
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
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
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

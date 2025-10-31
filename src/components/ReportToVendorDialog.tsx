import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface ReportToVendorDialogProps {
  model: string;
  entryId: string;
}

export function ReportToVendorDialog({ model, entryId }: ReportToVendorDialogProps) {
  const [open, setOpen] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(`Report sent to ${model} vendor successfully!`);
    setOpen(false);
    setAdditionalContext("");
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Send className="h-4 w-4" />
          Report to Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report to {model} Vendor</DialogTitle>
          <DialogDescription>
            This report will be forwarded to the model provider for review and potential correction in future versions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Add any additional context that might help the vendor understand the issue..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              The original prompt, hallucination, and correction will be automatically included.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

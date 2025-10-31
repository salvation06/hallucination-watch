import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PrivacyWarning() {
  return (
    <Alert variant="destructive" className="border-warning bg-warning/10">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning">Privacy & Security Warning</AlertTitle>
      <AlertDescription className="text-warning-foreground">
        <strong>Do not include personal data, secrets, credentials, or any sensitive information.</strong>
        <br />
        All submissions are public and may be shared with vendors, researchers, and the community.
      </AlertDescription>
    </Alert>
  );
}

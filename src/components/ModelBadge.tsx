import { Badge } from "@/components/ui/badge";

interface ModelBadgeProps {
  model: string;
  className?: string;
}

export function ModelBadge({ model, className }: ModelBadgeProps) {
  return (
    <Badge variant="model" className={className}>
      {model}
    </Badge>
  );
}

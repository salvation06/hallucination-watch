import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className }: TagListProps) {
  if (!tags.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <Badge key={tag} variant="tag" className="gap-1">
          <Hash className="h-3 w-3" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}

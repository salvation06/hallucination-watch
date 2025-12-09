import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelBadge } from "./ModelBadge";
import { TagList } from "./TagList";
import { RatingStars } from "./RatingStars";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

interface EntryCardProps {
  id: string;
  model: string;
  prompt: string;
  hallucination: string;
  tags: string[];
  rating: number;
  createdAt: Date;
  isAnonymous: boolean;
  reporterHandle?: string;
}

export function EntryCard({
  id,
  model,
  prompt,
  hallucination,
  tags,
  rating,
  createdAt,
  isAnonymous,
  reporterHandle,
}: EntryCardProps) {
  return (
    <Link to={`/entry/${id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <ModelBadge model={model} />
            <div className="flex items-center gap-1">
              <RatingStars rating={rating} readonly size="sm" />
              <span className="text-xs text-muted-foreground ml-1">({rating.toFixed(1)})</span>
            </div>
          </div>
          <CardTitle className="text-base line-clamp-2 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <span>{prompt.substring(0, 100)}{prompt.length > 100 ? '...' : ''}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription className="line-clamp-3 text-sm">
            <strong className="text-destructive">Hallucination:</strong> {hallucination}
          </CardDescription>
          <TagList tags={tags} />
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            {isAnonymous ? (
              <span>Anonymous</span>
            ) : (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/user/${reporterHandle}`;
                }}
                className="text-primary hover:underline cursor-pointer font-medium"
              >
                @{reporterHandle}
              </span>
            )}
            <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

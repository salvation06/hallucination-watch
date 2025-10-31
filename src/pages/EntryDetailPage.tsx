import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ModelBadge } from "@/components/ModelBadge";
import { TagList } from "@/components/TagList";
import { RatingStars } from "@/components/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, ArrowLeft, CheckCircle, ExternalLink, Flag, MessageSquare } from "lucide-react";

// Mock data - in real app this would come from API
const mockEntry = {
  id: "1",
  model: "GPT-4o",
  prompt: "What is the capital of Australia?",
  hallucination: "The AI stated that Sydney is the capital of Australia, when in fact it is Canberra.",
  correction: "The capital of Australia is Canberra, not Sydney. Sydney is the largest city but not the capital.",
  sources: "https://en.wikipedia.org/wiki/Canberra",
  tags: ["geography", "facts"],
  rating: 4.5,
  totalRatings: 12,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  isAnonymous: false,
  reporterHandle: "accuracyfirst",
  providerComments: [
    {
      id: "1",
      provider: "OpenAI",
      comment: "Thank you for this report. We've added this case to our evaluation dataset to improve future versions.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
};

export default function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRate = (rating: number) => {
    setUserRating(rating);
    toast.success(`Rated ${rating} stars`);
  };

  const handleFlag = () => {
    toast.success("Report flagged for review");
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    toast.success("Comment submitted");
    setComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to reports
        </Button>

        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <ModelBadge model={mockEntry.model} />
                  <Badge variant="outline" className="gap-1">
                    {mockEntry.isAnonymous ? "Anonymous" : `@${mockEntry.reporterHandle}`}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleFlag}>
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-2xl flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
                <span>{mockEntry.prompt}</span>
              </CardTitle>
              <CardDescription>
                Reported {formatDistanceToNow(mockEntry.createdAt, { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Hallucinated Output
                </h3>
                <p className="text-muted-foreground leading-relaxed">{mockEntry.hallucination}</p>
              </div>

              {mockEntry.correction && (
                <div>
                  <h3 className="font-semibold mb-2 text-success flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Corrected Information
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{mockEntry.correction}</p>
                </div>
              )}

              {mockEntry.sources && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Sources
                  </h3>
                  <a
                    href={mockEntry.sources}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {mockEntry.sources}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              <TagList tags={mockEntry.tags} />
            </CardContent>
          </Card>

          {/* Rating Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Rating</CardTitle>
              <CardDescription>
                Help others by rating the quality of this report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <RatingStars rating={mockEntry.rating} readonly size="lg" />
                    <span className="text-2xl font-bold">{mockEntry.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mockEntry.totalRatings} ratings
                  </p>
                </div>
                <Separator orientation="vertical" className="h-16" />
                <div className="flex flex-col">
                  <p className="text-sm font-medium mb-2">Your rating:</p>
                  <RatingStars rating={userRating} onRate={handleRate} size="lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Comments */}
          {mockEntry.providerComments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Official Provider Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockEntry.providerComments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-success pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="provider">{comment.provider}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discussion</CardTitle>
              <CardDescription>
                Share your thoughts or additional context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                Post Comment
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

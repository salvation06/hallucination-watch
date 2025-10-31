import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { TagList } from "@/components/TagList";
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const modelStats = [
  {
    name: "GPT-4o",
    vendor: "OpenAI",
    totalReports: 156,
    avgRating: 4.3,
    topTags: ["code", "facts", "math"],
    recentTrend: "+12",
    trendDirection: "up" as const,
  },
  {
    name: "Claude 3.5 Sonnet",
    vendor: "Anthropic",
    totalReports: 98,
    avgRating: 4.6,
    topTags: ["code", "writing", "analysis"],
    recentTrend: "+8",
    trendDirection: "up" as const,
  },
  {
    name: "Gemini 2.5",
    vendor: "Google",
    totalReports: 142,
    avgRating: 4.1,
    topTags: ["facts", "history", "science"],
    recentTrend: "+15",
    trendDirection: "up" as const,
  },
  {
    name: "GPT-4 Turbo",
    vendor: "OpenAI",
    totalReports: 203,
    avgRating: 4.2,
    topTags: ["code", "creative", "facts"],
    recentTrend: "-3",
    trendDirection: "down" as const,
  },
  {
    name: "Llama 3.1 405B",
    vendor: "Meta",
    totalReports: 67,
    avgRating: 3.9,
    topTags: ["code", "math", "reasoning"],
    recentTrend: "+5",
    trendDirection: "up" as const,
  },
  {
    name: "Claude 3 Opus",
    vendor: "Anthropic",
    totalReports: 134,
    avgRating: 4.5,
    topTags: ["analysis", "writing", "research"],
    recentTrend: "+2",
    trendDirection: "up" as const,
  },
];

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Model Statistics
          </h1>
          <p className="text-muted-foreground">
            Aggregate hallucination data across different AI models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelStats.map((model) => (
            <Card key={model.name} className="hover:shadow-lg transition-all hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>{model.vendor}</CardDescription>
                  </div>
                  <Badge
                    variant={model.trendDirection === "up" ? "warning" : "default"}
                    className="gap-1"
                  >
                    <TrendingUp className={`h-3 w-3 ${model.trendDirection === "down" ? "rotate-180" : ""}`} />
                    {model.recentTrend}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Reports</span>
                  </div>
                  <span className="text-2xl font-bold">{model.totalReports}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Rating</span>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={model.avgRating} readonly size="sm" />
                    <span className="text-sm font-semibold">{model.avgRating.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Top Categories</p>
                  <TagList tags={model.topTags} />
                </div>

                <Link
                  to={`/?model=${encodeURIComponent(model.name)}`}
                  className="block w-full text-center text-sm text-primary hover:underline pt-2 border-t"
                >
                  View all reports →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle>About These Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • <strong>Reports:</strong> Total number of hallucination reports submitted for each model
            </p>
            <p>
              • <strong>Avg. Rating:</strong> Average community rating (1-5 stars) for report quality
            </p>
            <p>
              • <strong>Trend:</strong> Change in report count over the last 7 days
            </p>
            <p>
              • <strong>Top Categories:</strong> Most common tags associated with reports for that model
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

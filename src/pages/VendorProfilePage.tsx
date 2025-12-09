import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CheckCircle, Clock, XCircle, MessageSquare, AlertTriangle, TrendingUp } from "lucide-react";
import { useParams, Link } from "react-router-dom";

// Hardcoded vendor data
const vendorData: Record<string, {
  name: string;
  description: string;
  logo: string;
  models: string[];
  stats: { total: number; resolved: number; pending: number; disputed: number };
}> = {
  openai: {
    name: "OpenAI",
    description: "Creator of GPT-4, ChatGPT, and DALL-E. Leading AI research lab focused on safe and beneficial AI.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    models: ["GPT-4o", "GPT-4 Turbo", "GPT-3.5 Turbo", "o1-preview", "o1-mini"],
    stats: { total: 342, resolved: 189, pending: 98, disputed: 55 },
  },
  anthropic: {
    name: "Anthropic",
    description: "AI safety company building reliable, interpretable, and steerable AI systems.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
    models: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude 3 Haiku"],
    stats: { total: 187, resolved: 112, pending: 52, disputed: 23 },
  },
  google: {
    name: "Google DeepMind",
    description: "Building AI responsibly to benefit humanity through research and products like Gemini.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
    models: ["Gemini 2.5", "Gemini 1.5 Pro", "Gemini 1.5 Flash"],
    stats: { total: 256, resolved: 145, pending: 78, disputed: 33 },
  },
  meta: {
    name: "Meta AI",
    description: "Open-source AI research powering Llama models and advancing AI accessibility.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
    models: ["Llama 3.1 405B", "Llama 3.1 70B", "Llama 3.1 8B"],
    stats: { total: 124, resolved: 67, pending: 41, disputed: 16 },
  },
};

// Hardcoded responses to reports
const vendorResponses = [
  {
    id: "1",
    reportTitle: "GPT-4 incorrectly states Napoleon died in 1815",
    status: "fixed",
    response: "Thank you for this report. We've identified the training data issue and have deployed a fix in our latest model update.",
    respondedAt: "2 days ago",
  },
  {
    id: "2",
    reportTitle: "Claude claims the Great Wall is visible from space",
    status: "acknowledged",
    response: "We appreciate this feedback. Our team is investigating this common misconception in our training data.",
    respondedAt: "5 days ago",
  },
  {
    id: "3",
    reportTitle: "Gemini provides incorrect Python syntax",
    status: "wont_fix",
    response: "After review, we believe this is a context-dependent suggestion. The syntax is valid in Python 2.x which may have been relevant to the conversation context.",
    respondedAt: "1 week ago",
  },
  {
    id: "4",
    reportTitle: "Model fabricates non-existent research paper",
    status: "pending",
    response: null,
    respondedAt: null,
  },
];

const statusIcons = {
  fixed: <CheckCircle className="h-4 w-4 text-green-500" />,
  acknowledged: <Clock className="h-4 w-4 text-amber-500" />,
  wont_fix: <XCircle className="h-4 w-4 text-muted-foreground" />,
  pending: <AlertTriangle className="h-4 w-4 text-orange-500" />,
};

const statusLabels = {
  fixed: "Fixed",
  acknowledged: "Acknowledged",
  wont_fix: "Won't Fix",
  pending: "Pending Response",
};

export default function VendorProfilePage() {
  const { vendor: vendorSlug } = useParams<{ vendor: string }>();
  const vendor = vendorData[vendorSlug || ""] || vendorData.openai;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Vendor Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20 rounded-xl border-2 border-border">
              <AvatarImage src={vendor.logo} className="object-contain p-2" />
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-accent text-white text-2xl">
                {vendor.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{vendor.name}</h1>
                <Badge variant="secondary" className="gap-1">
                  <Building2 className="h-3 w-3" />
                  Verified Vendor
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{vendor.description}</p>
              <div className="flex flex-wrap gap-2">
                {vendor.models.map((model) => (
                  <Badge key={model} variant="outline">{model}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{vendor.stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{vendor.stats.resolved}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-500">{vendor.stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-muted-foreground">{vendor.stats.disputed}</div>
              <p className="text-sm text-muted-foreground">Disputed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="responses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="responses" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Open Reports
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="responses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Vendor Responses</CardTitle>
                <CardDescription>
                  How {vendor.name} has responded to community-reported hallucinations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendorResponses.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.reportTitle}</h4>
                        {item.response && (
                          <p className="text-sm text-muted-foreground mt-2">
                            "{item.response}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcons[item.status as keyof typeof statusIcons]}
                        <Badge variant={item.status === "fixed" ? "default" : "secondary"}>
                          {statusLabels[item.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </div>
                    {item.respondedAt && (
                      <p className="text-xs text-muted-foreground">Responded {item.respondedAt}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Open Hallucination Reports</CardTitle>
                <CardDescription>
                  Reports awaiting vendor acknowledgment or resolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No open reports from the database yet.</p>
                  <p className="text-sm">Reports will appear here once users submit them.</p>
                  <Button asChild className="mt-4">
                    <Link to="/report">Submit a Report</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hallucination Trends</CardTitle>
                <CardDescription>
                  Common patterns in reported issues for {vendor.name} models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Factual Errors</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fabricated Citations</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outdated Information</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "30%" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Code Errors</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "25%" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

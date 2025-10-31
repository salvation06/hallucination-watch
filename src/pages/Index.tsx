import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { EntryCard } from "@/components/EntryCard";
import { FiltersBar } from "@/components/FiltersBar";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

// Mock data for demo
const mockEntries = [
  {
    id: "1",
    model: "GPT-4o",
    prompt: "What is the capital of Australia?",
    hallucination: "The AI stated that Sydney is the capital of Australia, when in fact it is Canberra.",
    correction: "The capital of Australia is Canberra, not Sydney. Sydney is the largest city but not the capital.",
    tags: ["geography", "facts"],
    rating: 4.5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isAnonymous: false,
    reporterHandle: "accuracyfirst",
  },
  {
    id: "2",
    model: "Claude 3.5 Sonnet",
    prompt: "Write Python code to calculate factorial",
    hallucination: "The provided code had an off-by-one error that would fail for n=0, returning incorrect results.",
    correction: "Factorial of 0 should be 1, not 0. The base case needs to handle this.",
    tags: ["code", "python", "math"],
    rating: 4.8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isAnonymous: true,
  },
  {
    id: "3",
    model: "Gemini 2.5",
    prompt: "What medications interact with aspirin?",
    hallucination: "The model failed to mention warfarin, a critical blood thinner that has dangerous interactions with aspirin.",
    correction: "Warfarin and aspirin together significantly increase bleeding risk and should be mentioned prominently.",
    tags: ["medical", "safety", "pharmaceuticals"],
    rating: 5.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    isAnonymous: false,
    reporterHandle: "medprofessional",
  },
  {
    id: "4",
    model: "GPT-4o",
    prompt: "Explain quantum entanglement",
    hallucination: "The explanation incorrectly stated that entanglement allows faster-than-light communication.",
    correction: "Quantum entanglement does NOT enable faster-than-light communication. This is a common misconception.",
    tags: ["physics", "science", "misconceptions"],
    rating: 4.2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isAnonymous: false,
    reporterHandle: "physicsprof",
  },
  {
    id: "5",
    model: "Claude 3.5 Sonnet",
    prompt: "What are the tax implications of crypto trading?",
    hallucination: "Model stated crypto-to-crypto trades are not taxable in the US, which is incorrect.",
    correction: "In the US, crypto-to-crypto trades ARE taxable events. Each trade must be reported to the IRS.",
    tags: ["finance", "tax", "crypto", "legal"],
    rating: 4.9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    isAnonymous: true,
  },
  {
    id: "6",
    model: "Gemini 2.5",
    prompt: "Historical events in 1989",
    hallucination: "The model omitted the Tiananmen Square protests when listing major 1989 events.",
    correction: "The Tiananmen Square protests were a major historical event in 1989 and should be included.",
    tags: ["history", "politics", "censorship"],
    rating: 4.7,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isAnonymous: false,
    reporterHandle: "historian2024",
  },
];

const availableModels = ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5"];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredEntries = mockEntries
    .filter((entry) => {
      const matchesSearch =
        searchQuery === "" ||
        entry.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.hallucination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesModel = selectedModel === "all" || entry.model === selectedModel;
      return matchesSearch && matchesModel;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === "oldest") return a.createdAt.getTime() - b.createdAt.getTime();
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const scrollToReports = () => {
    document.getElementById('reports-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <span>Community-Powered AI Accuracy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Track AI Hallucinations.<br />Build Better Models.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              Crowdsource AI accuracy reports and help model providers improve their systems. 
              Every hallucination documented brings us closer to more reliable AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button 
                size="lg" 
                onClick={scrollToReports}
                className="text-lg px-8 shadow-lg hover:shadow-xl transition-all"
              >
                Explore Reports
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
                className="text-lg px-8 border-2"
              >
                <Link to="/report">Report Hallucination</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,247</div>
                <div className="text-sm text-muted-foreground">Reports Submitted</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">12</div>
                <div className="text-sm text-muted-foreground">AI Models Tracked</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">89%</div>
                <div className="text-sm text-muted-foreground">Vendor Response Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <main id="reports-section" className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Recent Reports</h2>
          <p className="text-muted-foreground">
            Browse community-submitted AI hallucinations and accuracy issues
          </p>
        </div>

        <div className="mb-6">
          <FiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            sortBy={sortBy}
            onSortChange={setSortBy}
            models={availableModels}
          />
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} {...entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { Header } from "@/components/Header";
import { EntryCard } from "@/components/EntryCard";
import { FiltersBar } from "@/components/FiltersBar";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hallucination Reports</h1>
          <p className="text-muted-foreground">
            Community-driven database of AI model hallucinations and inaccuracies
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

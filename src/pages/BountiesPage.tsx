import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins, AlertTriangle, CheckCircle, Clock, Zap, Trophy, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

// Hardcoded bounty data
const activeBounties = [
  {
    id: "1",
    vendor: "OpenAI",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    model: "GPT-4o",
    title: "Critical Medical Misinformation",
    description: "Find instances where GPT-4o provides dangerous or incorrect medical advice that could harm users.",
    rewardAmount: 0.5,
    rewardCurrency: "ETH",
    rewardUsd: "~$1,500",
    severityRequired: "critical",
    claimsCount: 3,
    status: "active",
  },
  {
    id: "2",
    vendor: "Anthropic",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
    model: "Claude 3.5 Sonnet",
    title: "Fabricated Academic Citations",
    description: "Identify cases where Claude creates fake research papers, authors, or publications that don't exist.",
    rewardAmount: 0.25,
    rewardCurrency: "ETH",
    rewardUsd: "~$750",
    severityRequired: "high",
    claimsCount: 7,
    status: "active",
  },
  {
    id: "3",
    vendor: "Google DeepMind",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
    model: "Gemini 2.5",
    title: "Legal Misinformation",
    description: "Report instances of incorrect legal advice or misrepresentation of laws and regulations.",
    rewardAmount: 0.35,
    rewardCurrency: "ETH",
    rewardUsd: "~$1,050",
    severityRequired: "critical",
    claimsCount: 2,
    status: "active",
  },
  {
    id: "4",
    vendor: "Meta AI",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
    model: "Llama 3.1 405B",
    title: "Security Vulnerability Hallucinations",
    description: "Find cases where Llama provides incorrect security advice or creates vulnerable code patterns.",
    rewardAmount: 0.75,
    rewardCurrency: "ETH",
    rewardUsd: "~$2,250",
    severityRequired: "critical",
    claimsCount: 1,
    status: "active",
  },
];

const recentPayouts = [
  {
    id: "1",
    username: "security_researcher",
    bountyTitle: "Critical SQL Injection Pattern",
    amount: 0.5,
    currency: "ETH",
    paidAt: "3 days ago",
  },
  {
    id: "2",
    username: "ai_watchdog",
    bountyTitle: "Medical Dosage Hallucination",
    amount: 0.35,
    currency: "ETH",
    paidAt: "1 week ago",
  },
  {
    id: "3",
    username: "factchecker99",
    bountyTitle: "Historical Date Fabrication",
    amount: 0.15,
    currency: "ETH",
    paidAt: "2 weeks ago",
  },
];

const leaderboard = [
  { rank: 1, username: "security_researcher", earnings: 2.5, reports: 12 },
  { rank: 2, username: "ai_watchdog", earnings: 1.8, reports: 9 },
  { rank: 3, username: "factchecker99", earnings: 1.2, reports: 15 },
  { rank: 4, username: "truth_seeker", earnings: 0.9, reports: 7 },
  { rank: 5, username: "model_debugger", earnings: 0.7, reports: 5 },
];

const severityColors = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default function BountiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2 rounded-full mb-4">
            <Coins className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600">Earn Crypto Rewards</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Bounty Rewards</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vendors pay crypto rewards for finding critical AI hallucinations. 
            Help improve AI safety and earn ETH for your contributions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Coins className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">12.5 ETH</div>
              <p className="text-sm text-muted-foreground">Total Paid Out</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{activeBounties.length}</div>
              <p className="text-sm text-muted-foreground">Active Bounties</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">47</div>
              <p className="text-sm text-muted-foreground">Claims Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">Hunters</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Active Bounties */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Active Bounties
            </h2>
            {activeBounties.map((bounty) => (
              <Card key={bounty.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 rounded-lg border">
                      <AvatarImage src={bounty.vendorLogo} className="object-contain p-1" />
                      <AvatarFallback className="rounded-lg">{bounty.vendor.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{bounty.title}</h3>
                            <Badge className={severityColors[bounty.severityRequired as keyof typeof severityColors]}>
                              {bounty.severityRequired}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {bounty.vendor} • {bounty.model}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xl font-bold text-amber-500">
                            {bounty.rewardAmount} {bounty.rewardCurrency}
                          </div>
                          <p className="text-xs text-muted-foreground">{bounty.rewardUsd}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{bounty.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {bounty.claimsCount} pending claims
                        </span>
                        <Button size="sm" asChild>
                          <Link to="/report">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Submit Report
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Top Hunters
                </CardTitle>
                <CardDescription>All-time earnings leaderboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map((hunter) => (
                  <div key={hunter.rank} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      hunter.rank === 1 ? "bg-amber-500 text-white" :
                      hunter.rank === 2 ? "bg-gray-400 text-white" :
                      hunter.rank === 3 ? "bg-orange-600 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {hunter.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/user/${hunter.username}`} className="font-medium hover:text-primary text-sm truncate block">
                        @{hunter.username}
                      </Link>
                      <p className="text-xs text-muted-foreground">{hunter.reports} reports</p>
                    </div>
                    <div className="text-sm font-bold text-amber-500">{hunter.earnings} ETH</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-500" />
                  Recent Payouts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPayouts.map((payout) => (
                  <div key={payout.id} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/user/${payout.username}`} className="font-medium hover:text-primary">
                        @{payout.username}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">{payout.bountyTitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-green-500">{payout.amount} {payout.currency}</div>
                      <p className="text-xs text-muted-foreground">{payout.paidAt}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">1</div>
                  <p className="text-muted-foreground">Find a critical AI hallucination matching a bounty</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">2</div>
                  <p className="text-muted-foreground">Submit a detailed report with evidence</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">3</div>
                  <p className="text-muted-foreground">Vendor reviews and approves your claim</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">4</div>
                  <p className="text-muted-foreground">Receive crypto payment to your wallet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, BarChart3, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">Hallucination Tracker</span>
              <span className="text-xs text-muted-foreground">Community-driven AI accuracy</span>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/models">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Models</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/report">
                <Plus className="h-4 w-4 mr-2" />
                Report
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

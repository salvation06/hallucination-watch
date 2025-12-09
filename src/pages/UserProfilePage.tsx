import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { EntryCard } from '@/components/EntryCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, AlertCircle, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

// Mock data for demo - will be replaced with real data later
const mockEntries = [
  {
    id: "1",
    model: "GPT-4o",
    prompt: "What is the capital of Australia?",
    hallucination: "The AI stated that Sydney is the capital of Australia, when in fact it is Canberra.",
    correction: "The capital of Australia is Canberra, not Sydney. Sydney is the largest city but not the capital.",
    tags: ["geography", "facts"],
    rating: 4.5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isAnonymous: false,
    reporterHandle: "accuracyfirst",
  },
  {
    id: "4",
    model: "GPT-4o",
    prompt: "Explain quantum entanglement",
    hallucination: "The explanation incorrectly stated that entanglement allows faster-than-light communication.",
    correction: "Quantum entanglement does NOT enable faster-than-light communication. This is a common misconception.",
    tags: ["physics", "science", "misconceptions"],
    rating: 4.2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isAnonymous: false,
    reporterHandle: "accuracyfirst",
  },
];

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      const cleanUsername = username.replace(/^@/, '');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } else if (!data) {
        setError('User not found');
      } else {
        setProfile(data as Profile);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [username]);

  // Filter mock entries by username for demo
  const userEntries = mockEntries.filter(
    (entry) => entry.reporterHandle === username?.replace(/^@/, '')
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center py-16">
            <div className="animate-pulse text-muted-foreground">Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">User not found</h2>
            <p className="text-muted-foreground mb-6">
              The user @{username?.replace(/^@/, '')} doesn't exist or hasn't created a profile yet.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Link>
        </Button>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-1">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-lg text-primary font-medium mb-3">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-muted-foreground mb-4 max-w-xl">
                  {profile.bio}
                </p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {userEntries.length} reports submitted
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User's Reports */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Reports by @{profile.username}</h2>
          <p className="text-muted-foreground">
            All hallucination reports submitted by this user
          </p>
        </div>

        {userEntries.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground">
              @{profile.username} hasn't submitted any hallucination reports yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEntries.map((entry) => (
              <EntryCard key={entry.id} {...entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageBackground } from "@/components/PageBackground";
import { LandingHero } from "@/components/LandingHero";
import { DashboardHome } from "@/components/DashboardHome";
import { useAuth } from "@/contexts/AuthProvider";
import type { Deck } from "@/types";
import { fetchDecks } from "@/lib/decks";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setDecks([]);
      return;
    }

    setLoadingDecks(true);
    fetchDecks(user.uid)
      .then(setDecks)
      .finally(() => setLoadingDecks(false));
  }, [user]);

  if (authLoading) return <LoadingScreen />;

  return (
    <>
      <PageBackground>
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 nav-offset pb-4 sm:pb-6">
          {!user ? (
            <LandingHero onGetStarted={() => setAuthOpen(true)} />
          ) : (
            <DashboardHome
              user={user}
              decks={decks}
              loadingDecks={loadingDecks}
              onDecksChange={setDecks}
            />
          )}
        </div>
      </PageBackground>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

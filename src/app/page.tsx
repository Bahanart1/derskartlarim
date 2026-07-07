"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Brain,
  Layers,
  Loader2,
  LogIn,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { CreateDeckForm } from "@/components/CreateDeckForm";
import { DeckModeSelector, DeckModeHeader } from "@/components/DeckModeSelector";
import { DeckCard } from "@/components/DeckCard";
import { AuthModal } from "@/components/AuthModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageBackground } from "@/components/PageBackground";
import { useAuth } from "@/contexts/AuthProvider";
import type { Deck, DeckMode } from "@/types";
import { deleteDeck, fetchDecks } from "@/lib/decks";
import { getDueCards } from "@/lib/spaced-repetition";

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [createMode, setCreateMode] = useState<DeckMode | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const prevUser = useRef<typeof user | undefined>(undefined);

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0);
  const dueTotal = decks.reduce(
    (sum, d) => sum + getDueCards(d.cards).length,
    0
  );

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

  useEffect(() => {
    if (prevUser.current === undefined) {
      prevUser.current = user;
      return;
    }
    if (user && !prevUser.current) {
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
    prevUser.current = user;
  }, [user]);

  async function handleCreated(deck: Deck) {
    if (!user) return;
    const updated = await fetchDecks(user.uid);
    setDecks(updated);
    router.push(deck.deckMode === "summary" ? `/deck/${deck.id}` : `/study/${deck.id}`);
  }

  async function handleDelete(id: string) {
    await deleteDeck(id);
    if (user) setDecks(await fetchDecks(user.uid));
  }

  if (authLoading) return <LoadingScreen />;

  return (
    <>
      <Header />
      <PageBackground>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {!user ? (
            <>
              <section className="text-center mb-14 sm:mb-16 animate-fade-up">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                  Metninden{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                    ders kartı
                  </span>
                  <br className="hidden sm:block" />
                  saniyeler içinde
                </h1>

                <p className="text-slate-500 mt-5 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                  PDF veya ders notunu yükle, yapay zeka soru-cevap kartları üretsin.
                  SM-2 spaced repetition ile sınavlara kalıcı hazırlan.
                </p>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10">
                  {[
                    { icon: Zap, label: "Hızlı üretim", color: "text-amber-500" },
                    { icon: Brain, label: "SM-2 algoritması", color: "text-indigo-500" },
                    { icon: BookOpen, label: "PDF desteği", color: "text-emerald-500" },
                  ].map(({ icon: Icon, label, color }, i) => (
                    <div
                      key={label}
                      className="glass flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-600 animate-fade-up"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </section>

              <div
                className="max-w-md mx-auto glass-strong rounded-3xl p-10 text-center animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 animate-float">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Öğrenmeye başla
                </h2>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                  Giriş yap, destelerin bulutta saklansın. Her cihazdan kaldığın
                  yerden devam et.
                </p>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="mt-8 w-full py-3.5 rounded-2xl btn-primary text-base"
                >
                  Ücretsiz Başla
                </button>
              </div>
            </>
          ) : (
            <div ref={dashboardRef} id="dashboard" className="scroll-mt-20">
              <section className="mb-6 animate-fade-up">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Merhaba,{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    {user.displayName?.split(" ")[0] || "öğrenci"}
                  </span>
                </h1>
                <p className="text-slate-500 mt-1 text-sm sm:text-base">
                  Yeni deste oluştur veya çalışmaya devam et.
                </p>
              </section>

              {decks.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 animate-fade-up">
                  {[
                    { label: "Deste", value: decks.length },
                    { label: "Toplam kart", value: totalCards },
                    { label: "Tekrar bekleyen", value: dueTotal },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="glass rounded-2xl p-4 sm:p-5 text-center"
                    >
                      <div className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
                <section className="lg:col-span-3 glass-strong rounded-3xl p-6 sm:p-8 animate-fade-up">
                  {!createMode ? (
                    <DeckModeSelector onSelect={setCreateMode} />
                  ) : (
                    <>
                      <DeckModeHeader
                        mode={createMode}
                        onBack={() => setCreateMode(null)}
                      />
                      <CreateDeckForm
                        mode={createMode}
                        onCreated={handleCreated}
                      />
                    </>
                  )}
                </section>

                <section className="lg:col-span-2 animate-fade-up">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-xl font-bold text-slate-900">
                      Destelerim
                    </h2>
                    {decks.length > 0 && (
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        {decks.length}
                      </span>
                    )}
                  </div>

                  {loadingDecks ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                  ) : decks.length === 0 ? (
                    <div className="glass rounded-3xl p-10 text-center border-2 border-dashed border-indigo-100">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Layers className="w-7 h-7 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-600">Henüz deste yok</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Soldan mod seçip ilk desteni oluştur
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {decks.map((deck) => (
                        <DeckCard
                          key={deck.id}
                          deck={deck}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}
        </div>
      </PageBackground>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

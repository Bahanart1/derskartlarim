"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import { Header } from "@/components/Header";
import { StudyCard } from "@/components/StudyCard";
import { SummaryCardView } from "@/components/SummaryCardView";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageBackground } from "@/components/PageBackground";
import { useAuth } from "@/contexts/AuthProvider";
import type { Deck, Flashcard, ReviewQuality } from "@/types";
import { fetchDeck, saveDeck } from "@/lib/decks";
import {
  getDueCards,
  updateCardAfterReview,
} from "@/lib/spaced-repetition";

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    const id = params.id as string;
    fetchDeck(id, user.uid).then((found) => {
      if (!found) {
        router.push("/");
        return;
      }
      setDeck(found);
      const due = getDueCards(found.cards);
      setQueue(due.length > 0 ? due : found.cards);
      setLoading(false);
    });
  }, [params.id, router, user, authLoading]);

  const currentCard = queue[currentIndex];
  const progress = queue.length > 0 ? ((currentIndex + 1) / queue.length) * 100 : 0;
  const isSummaryDeck = deck?.deckMode === "summary";

  const handleNext = useCallback(() => {
    if (!deck || currentIndex + 1 >= queue.length) {
      setFinished(true);
      setReviewed(queue.length);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setReviewed((r) => r + 1);
  }, [deck, currentIndex, queue.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleRate = useCallback(
    async (quality: ReviewQuality) => {
      if (!deck || !currentCard || !user || saving) return;

      setSaving(true);
      const updatedCard = updateCardAfterReview(currentCard, quality);
      const updatedCards = deck.cards.map((c) =>
        c.id === currentCard.id ? updatedCard : c
      );

      const updatedDeck: Deck = {
        ...deck,
        cards: updatedCards,
        updatedAt: Date.now(),
      };

      try {
        const saved = await saveDeck(updatedDeck, user.uid);
        setDeck(saved);
        setReviewed((r) => r + 1);

        if (currentIndex + 1 >= queue.length) {
          setFinished(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      } finally {
        setSaving(false);
      }
    },
    [deck, currentCard, currentIndex, queue.length, user, saving]
  );

  if (authLoading || loading) return <LoadingScreen label="Çalışma modu hazırlanıyor..." />;

  if (!deck) return null;

  if (finished) {
    return (
      <PageBackground>
        <Header />
        <div className="nav-offset flex items-center justify-center min-h-[calc(100vh-7rem)] px-4">
          <div className="text-center max-w-md animate-scale-in">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                <PartyPopper className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-3 rounded-3xl bg-indigo-500/20 blur-2xl" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Harika iş!
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              <span className="font-bold text-indigo-600">{reviewed}</span>{" "}
              {isSummaryDeck ? "özeti" : "kartı"} tamamladın
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <Link
                href="/"
                className="py-3 px-6 rounded-2xl border border-slate-200 bg-white/80 text-slate-600 font-semibold hover:bg-white transition"
              >
                Ana Sayfa
              </Link>
              <button
                onClick={() => {
                  setFinished(false);
                  setCurrentIndex(0);
                  setReviewed(0);
                  const due = getDueCards(deck.cards);
                  setQueue(due.length > 0 ? due : deck.cards);
                }}
                className="py-3 px-6 rounded-2xl btn-primary flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Tekrar {isSummaryDeck ? "Oku" : "Çalış"}
              </button>
            </div>
          </div>
        </div>
      </PageBackground>
    );
  }

  if (!currentCard) {
    return (
      <PageBackground>
        <Header />
        <div className="nav-offset flex items-center justify-center min-h-[calc(100vh-7rem)] px-4">
          <div className="text-center animate-scale-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Bugünlük hedef tamam!
            </h1>
            <p className="text-slate-500 mt-2">Tekrar edilecek kart yok.</p>
            <Link
              href="/"
              className="inline-block mt-8 py-3 px-8 rounded-2xl btn-primary"
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Header />
      <div className="max-w-2xl mx-auto px-4 nav-offset pb-6 sm:pb-10">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition px-3 py-2 rounded-xl hover:bg-white/60"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </Link>
            <div className="text-sm font-semibold text-slate-500 bg-white/60 px-4 py-2 rounded-full">
              <span className="text-indigo-600">{currentIndex + 1}</span>
              <span className="text-slate-300 mx-1">/</span>
              {queue.length}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-600 truncate pr-4">
                {deck.title}
              </p>
              <span className="text-xs font-bold text-indigo-600 shrink-0">
                %{Math.round(progress)}
              </span>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="animate-fade-up" key={currentCard.id}>
            {isSummaryDeck ? (
              <>
                <SummaryCardView card={currentCard} index={currentIndex} />
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex-1 py-3.5 px-4 rounded-2xl border border-slate-200 bg-white/80 text-slate-600 font-semibold hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Önceki
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3.5 px-4 rounded-2xl btn-primary flex items-center justify-center gap-2"
                  >
                    {currentIndex + 1 >= queue.length ? "Bitir" : "Sonraki"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <StudyCard
                card={currentCard}
                onRate={handleRate}
                saving={saving}
              />
            )}
          </div>
        </div>
    </PageBackground>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hash, Play } from "lucide-react";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageBackground } from "@/components/PageBackground";
import { useAuth } from "@/contexts/AuthProvider";
import type { Deck, Flashcard } from "@/types";
import { CARD_FORMAT_LABELS, DECK_MODE_LABELS } from "@/types";
import { SummaryCardView } from "@/components/SummaryCardView";
import { fetchDeck } from "@/lib/decks";
import { getDueCards } from "@/lib/spaced-repetition";

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    const id = params.id as string;
    fetchDeck(id, user.uid).then((found) => {
      if (!found) router.push("/");
      else setDeck(found);
      setLoading(false);
    });
  }, [params.id, router, user, authLoading]);

  if (authLoading || loading) return <LoadingScreen />;

  if (!deck) return null;

  const currentDeck = deck;
  const dueCount = getDueCards(currentDeck.cards).length;
  const deckMode = currentDeck.deckMode ?? "questions";
  const typeLabel =
    deckMode === "summary"
      ? DECK_MODE_LABELS.summary
      : CARD_FORMAT_LABELS[currentDeck.cardFormat ?? "classic"];

  function renderCardPreview(card: Flashcard, index: number) {
    const format = card.format ?? currentDeck.cardFormat ?? "classic";

    if (format === "multiple_choice" && card.options) {
      return (
        <div
          key={card.id}
          className="glass rounded-2xl p-5 sm:p-6 animate-fade-up hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            <Hash className="w-3 h-3" />
            {index + 1} · Şıklı
          </span>
          <p className="font-semibold text-slate-900 mt-3 text-base leading-relaxed">
            {card.front}
          </p>
          <ul className="mt-3 space-y-1.5">
            {card.options.map((option, i) => (
              <li
                key={i}
                className={`text-sm px-3 py-2 rounded-lg ${
                  i === card.correctIndex
                    ? "bg-emerald-50 text-emerald-700 font-medium border border-emerald-100"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                {String.fromCharCode(65 + i)}. {option}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (format === "true_false") {
      return (
        <div
          key={card.id}
          className="glass rounded-2xl p-5 sm:p-6 animate-fade-up hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            <Hash className="w-3 h-3" />
            {index + 1} · Doğru/Yanlış
          </span>
          <p className="font-semibold text-slate-900 mt-3 text-base leading-relaxed">
            {card.front}
          </p>
          <p className="text-sm mt-2 font-medium text-emerald-600">
            Cevap: {card.isTrue ? "Doğru" : "Yanlış"}
          </p>
          {card.back && (
            <p className="text-sm text-slate-500 mt-2 leading-relaxed border-l-2 border-indigo-200 pl-3">
              {card.back}
            </p>
          )}
        </div>
      );
    }

    if (format === "summary" || deckMode === "summary") {
      return (
        <div
          key={card.id}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <SummaryCardView card={card} index={index} compact />
        </div>
      );
    }

    return (
      <div
        key={card.id}
        className="glass rounded-2xl p-5 sm:p-6 animate-fade-up hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
          <Hash className="w-3 h-3" />
          {index + 1}
        </span>
        <p className="font-semibold text-slate-900 mt-3 text-base leading-relaxed">
          {card.front}
        </p>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed border-l-2 border-indigo-200 pl-3">
          {card.back}
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <PageBackground>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8 px-3 py-2 rounded-xl hover:bg-white/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>

          <div className="glass-strong rounded-3xl p-6 sm:p-8 mb-8 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-slate-900">
                  {currentDeck.title}
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                  {currentDeck.cards.length} kart · {typeLabel}
                  {dueCount > 0 && (
                    <span className="ml-2 text-emerald-600">
                      · {dueCount} tekrar bekliyor
                    </span>
                  )}
                </p>
              </div>
              <Link
                href={`/study/${currentDeck.id}`}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl btn-primary shrink-0"
              >
                <Play className="w-4 h-4" />
                {deckMode === "summary" ? "Oku" : "Çalışmaya Başla"}
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {currentDeck.cards.map((card, i) => renderCardPreview(card, i))}
          </div>
        </div>
      </PageBackground>
    </>
  );
}

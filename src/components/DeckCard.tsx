"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Eye, Play, Trash2 } from "lucide-react";
import type { Deck } from "@/types";
import { CARD_FORMAT_LABELS, DECK_MODE_LABELS } from "@/types";
import { getDueCards } from "@/lib/spaced-repetition";

interface DeckCardProps {
  deck: Deck;
  onDelete: (id: string) => void;
}

const GRADIENTS = [
  "from-indigo-500 to-violet-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-600",
];

export function DeckCard({ deck, onDelete }: DeckCardProps) {
  const dueCount = getDueCards(deck.cards).length;
  const progress =
    deck.cards.length > 0
      ? Math.round(((deck.cards.length - dueCount) / deck.cards.length) * 100)
      : 0;
  const gradient = GRADIENTS[deck.title.length % GRADIENTS.length];
  const deckMode = deck.deckMode ?? "questions";
  const typeLabel =
    deckMode === "summary"
      ? DECK_MODE_LABELS.summary
      : CARD_FORMAT_LABELS[deck.cardFormat ?? "classic"];

  return (
    <div className="group glass rounded-2xl p-4 sm:p-5 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300 sm:hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}
        >
          <BookOpen className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate text-base">
                {deck.title}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {deck.cards.length} kart · {typeLabel}
              </p>
            </div>
            <button
              onClick={() => onDelete(deck.id)}
              className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
              title="Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">İlerleme</span>
              <span className="font-semibold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {dueCount > 0 && (
              <p className="text-xs font-semibold text-emerald-600 mt-2">
                {dueCount} kart tekrar bekliyor
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3 sm:mt-4">
        <Link
          href={`/study/${deck.id}`}
          className="flex-1 py-3 sm:py-2.5 px-4 rounded-xl btn-primary text-sm text-center flex items-center justify-center gap-2 min-h-[44px]"
        >
          {deckMode === "summary" ? (
            <>
              <Eye className="w-4 h-4" />
              Oku
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Çalış
            </>
          )}
        </Link>
        <Link
          href={`/deck/${deck.id}`}
          className="py-3 sm:py-2.5 px-4 rounded-xl border border-slate-200/80 bg-white/60 text-slate-600 text-sm font-semibold hover:bg-white hover:border-indigo-200 transition flex items-center gap-1 min-h-[44px]"
        >
          Detay
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

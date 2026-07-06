"use client";

import { FileText } from "lucide-react";
import type { Flashcard } from "@/types";
import { getCardPoints } from "@/types";

interface SummaryCardViewProps {
  card: Flashcard;
  index?: number;
  compact?: boolean;
}

export function SummaryCardView({ card, index, compact }: SummaryCardViewProps) {
  const points = getCardPoints(card);

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-white shadow-2xl shadow-emerald-500/10 ${
        compact ? "" : "w-full max-w-xl mx-auto"
      }`}
    >
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      <div className={compact ? "p-5 sm:p-6" : "p-6 sm:p-8"}>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
          <FileText className="w-3.5 h-3.5" />
          {index !== undefined ? `Özet · ${index + 1}` : "Önemli Noktalar"}
        </span>

        <h3
          className={`font-semibold text-slate-900 leading-relaxed mb-5 ${
            compact ? "text-base" : "text-xl sm:text-2xl"
          }`}
        >
          {card.front}
        </h3>

        <ul className="space-y-3">
          {points.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm sm:text-base text-slate-700 leading-relaxed"
            >
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

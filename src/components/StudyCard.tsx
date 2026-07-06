"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import type { Flashcard } from "@/types";
import { FlashcardFlip } from "@/components/FlashcardFlip";
import { StudyControls } from "@/components/StudyControls";
import type { ReviewQuality } from "@/types";

interface StudyCardProps {
  card: Flashcard;
  onRate: (quality: ReviewQuality) => void;
  saving?: boolean;
}

export function StudyCard({ card, onRate, saving }: StudyCardProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);

  useEffect(() => {
    setAnswered(false);
    setSelectedIndex(null);
    setSelectedTrueFalse(null);
  }, [card.id]);

  const format = card.format ?? "classic";

  if (format === "classic") {
    return (
      <div>
        <FlashcardFlip front={card.front} back={card.back} />
        <div className="mt-10">
          <StudyControls onRate={onRate} disabled={saving} />
        </div>
      </div>
    );
  }

  if (format === "multiple_choice" && card.options) {
    const isCorrect = selectedIndex === card.correctIndex;

    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/15 bg-white">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
          <div className="p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Şıklı Soru
            </span>
            <p className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed mb-6">
              {card.front}
            </p>

            <div className="space-y-2.5">
              {card.options.map((option, i) => {
                let style =
                  "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50";
                if (answered) {
                  if (i === card.correctIndex) {
                    style = "border-emerald-400 bg-emerald-50 text-emerald-800";
                  } else if (i === selectedIndex) {
                    style = "border-rose-400 bg-rose-50 text-rose-800";
                  } else {
                    style = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                  }
                } else if (selectedIndex === i) {
                  style = "border-indigo-400 bg-indigo-50";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={answered || saving}
                    onClick={() => {
                      setSelectedIndex(i);
                      setAnswered(true);
                    }}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all flex items-center gap-3 ${style}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                    {answered && i === card.correctIndex && (
                      <Check className="w-4 h-4 ml-auto text-emerald-600" />
                    )}
                    {answered && i === selectedIndex && i !== card.correctIndex && (
                      <X className="w-4 h-4 ml-auto text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                className={`mt-5 p-4 rounded-2xl text-sm font-medium animate-fade-up ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}
              >
                {isCorrect ? "Doğru!" : "Yanlış."}{" "}
                {card.back && <span className="font-normal">{card.back}</span>}
              </div>
            )}
          </div>
        </div>

        {answered && (
          <div className="mt-10 animate-fade-up">
            <StudyControls onRate={onRate} disabled={saving} />
          </div>
        )}
      </div>
    );
  }

  if (format === "true_false") {
    const isCorrect =
      selectedTrueFalse !== null && selectedTrueFalse === card.isTrue;

    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/15">
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">
              Doğru / Yanlış
            </span>
            <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
              {card.front}
            </p>
          </div>

          {!answered ? (
            <div className="bg-white p-6 sm:p-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setSelectedTrueFalse(true);
                  setAnswered(true);
                }}
                className="py-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 hover:border-emerald-300 transition-all hover:scale-[1.02] active:scale-95"
              >
                Doğru
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setSelectedTrueFalse(false);
                  setAnswered(true);
                }}
                className="py-4 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 hover:border-rose-300 transition-all hover:scale-[1.02] active:scale-95"
              >
                Yanlış
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8">
              <div
                className={`p-4 rounded-2xl text-sm font-medium mb-4 ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}
              >
                {isCorrect ? "Doğru!" : "Yanlış."}{" "}
                Cevap: <strong>{card.isTrue ? "Doğru" : "Yanlış"}</strong>
                {card.back && (
                  <p className="mt-2 font-normal text-slate-600">{card.back}</p>
                )}
              </div>
              <div className="mt-6">
                <StudyControls onRate={onRate} disabled={saving} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <FlashcardFlip front={card.front} back={card.back} />
  );
}

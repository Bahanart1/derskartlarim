"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

interface FlashcardFlipProps {
  front: string;
  back: string;
}

export function FlashcardFlip({ front, back }: FlashcardFlipProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [front, back]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className="perspective-1200 w-full cursor-pointer select-none"
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "Space") {
            e.preventDefault();
            setFlipped(!flipped);
          }
        }}
        aria-label="Kartı çevir"
      >
        <div
          className="relative w-full min-h-[320px] preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative h-full p-8 sm:p-10 flex flex-col items-center justify-center text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-200 uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Soru
              </span>
              <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
                {front}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-indigo-200/80 bg-white/10 px-4 py-2 rounded-full">
                <RotateCcw className="w-3.5 h-3.5" />
                Tıkla veya Space
              </span>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-2xl"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="absolute inset-0 bg-white" />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
            <div className="relative h-full p-8 sm:p-10 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-6">
                Cevap
              </span>
              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                {back}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

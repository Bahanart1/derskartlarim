"use client";

import type { ReviewQuality } from "@/types";
import { Frown, Meh, Smile, Star } from "lucide-react";

interface StudyControlsProps {
  onRate: (quality: ReviewQuality) => void;
  disabled?: boolean;
}

const buttons: {
  quality: ReviewQuality;
  label: string;
  sub: string;
  icon: typeof Frown;
  className: string;
}[] = [
  {
    quality: 1,
    label: "Tekrar",
    sub: "< 1 dk",
    icon: Frown,
    className:
      "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:border-rose-200",
  },
  {
    quality: 2,
    label: "Zor",
    sub: "< 10 dk",
    icon: Meh,
    className:
      "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 hover:border-amber-200",
  },
  {
    quality: 3,
    label: "İyi",
    sub: "1 gün",
    icon: Smile,
    className:
      "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200",
  },
  {
    quality: 4,
    label: "Kolay",
    sub: "4 gün",
    icon: Star,
    className:
      "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200",
  },
];

export function StudyControls({ onRate, disabled }: StudyControlsProps) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-slate-500">
        Ne kadar kolaydı?
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto w-full">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.quality}
              onClick={() => onRate(btn.quality)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1.5 py-3 sm:py-4 px-2 rounded-2xl border-2 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 ${btn.className}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs sm:text-sm">{btn.label}</span>
              <span className="text-[10px] opacity-70 font-medium">{btn.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

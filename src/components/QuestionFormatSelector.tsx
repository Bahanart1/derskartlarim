"use client";

import { CheckCircle2, FlipHorizontal, ListChecks } from "lucide-react";
import type { CardFormat } from "@/types";

interface QuestionFormatSelectorProps {
  value: CardFormat;
  onChange: (format: CardFormat) => void;
  disabled?: boolean;
}

const FORMATS: {
  id: CardFormat;
  label: string;
  desc: string;
  icon: typeof FlipHorizontal;
}[] = [
  {
    id: "classic",
    label: "Klasik",
    desc: "Soru-cevap kartı, çevirerek öğren",
    icon: FlipHorizontal,
  },
  {
    id: "multiple_choice",
    label: "Şıklı",
    desc: "4 seçenekli test soruları",
    icon: ListChecks,
  },
  {
    id: "true_false",
    label: "Doğru / Yanlış",
    desc: "İfade doğru mu yanlış mı?",
    icon: CheckCircle2,
  },
];

export function QuestionFormatSelector({
  value,
  onChange,
  disabled,
}: QuestionFormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        Soru formatı nasıl olsun?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {FORMATS.map(({ id, label, desc, icon: Icon }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(id)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                selected
                  ? "border-indigo-500 bg-indigo-50/80 shadow-md shadow-indigo-500/10"
                  : "border-slate-200 bg-white/60 hover:border-indigo-200 hover:bg-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                  selected
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className={`font-semibold text-sm ${selected ? "text-indigo-900" : "text-slate-800"}`}>
                {label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
              {selected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

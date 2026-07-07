"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  FlipHorizontal,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import type { DeckMode } from "@/types";
import { DECK_MODE_LABELS } from "@/types";

interface DeckModeSelectorProps {
  onSelect: (mode: DeckMode) => void;
  compact?: boolean;
}

const MODES: {
  id: DeckMode;
  label: string;
  desc: string;
  tags: string[];
  icon: typeof HelpCircle;
  accent: string;
  glow: string;
  preview: "questions" | "summary";
}[] = [
  {
    id: "questions",
    label: DECK_MODE_LABELS.questions,
    desc: "PDF'den veya ders notundan sınav tarzı kartlar üret, çalış ve tekrar et",
    tags: ["Klasik", "Şıklı", "Doğru/Yanlış"],
    icon: HelpCircle,
    accent: "from-indigo-500 via-violet-500 to-purple-600",
    glow: "group-hover:shadow-indigo-500/25",
    preview: "questions",
  },
  {
    id: "summary",
    label: DECK_MODE_LABELS.summary,
    desc: "Önemli bilgileri madde madde çıkar, anında oku",
    tags: ["Madde madde", "Hızlı tekrar"],
    icon: FileText,
    accent: "from-emerald-500 via-teal-500 to-cyan-600",
    glow: "group-hover:shadow-emerald-500/25",
    preview: "summary",
  },
];

function QuestionsPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-3 left-6 w-16 h-10 rounded-lg bg-white/30 rotate-[-8deg]" />
        <div className="absolute bottom-4 right-5 w-14 h-9 rounded-lg bg-white/20 rotate-[12deg]" />
      </div>

      <div className="relative w-[148px] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-center">
          <FlipHorizontal className="w-4 h-4 text-indigo-200 mx-auto mb-2" />
          <p className="text-[11px] font-semibold text-white leading-snug">
            Fotosentez nedir?
          </p>
        </div>
        <div className="bg-white px-3 py-2.5 space-y-1.5">
          {["A", "B", "C"].map((letter, i) => (
            <div
              key={letter}
              className={`flex items-center gap-2 text-[9px] px-2 py-1 rounded-md ${
                i === 1
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "bg-slate-50 text-slate-400"
              }`}
            >
              <span className="w-4 h-4 rounded bg-white flex items-center justify-center font-bold text-[8px]">
                {letter}
              </span>
              <span className="truncate">Seçenek {letter.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-2 right-3 flex gap-1">
        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold text-white backdrop-blur-sm">
          <ListChecks className="w-3 h-3 inline -mt-px" />
        </span>
      </div>
    </div>
  );
}

function SummaryPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-8 w-20 h-2 rounded-full bg-white/30" />
        <div className="absolute top-8 right-12 w-14 h-2 rounded-full bg-white/20" />
      </div>

      <div className="relative w-[160px] rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl shadow-black/15 p-3.5 rotate-[2deg] group-hover:rotate-0 transition-transform duration-500">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-2.5 h-2.5 text-white" />
          </div>
          <p className="text-[10px] font-bold text-slate-800">Hücre Bölünmesi</p>
        </div>
        <ul className="space-y-1.5">
          {[
            "Mitoz ve mayoz farkı",
            "Kromozom sayısı sabit",
            "Üreme hücreleri oluşur",
          ].map((item, i) => (
            <li key={item} className="flex gap-2 items-start">
              <span className="w-4 h-4 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-[8px] font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-[9px] text-slate-600 leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <CheckCircle2 className="absolute bottom-3 left-4 w-4 h-4 text-white/40" />
    </div>
  );
}

export function DeckModeSelector({ onSelect, compact = false }: DeckModeSelectorProps) {
  return (
    <div className="space-y-6">
      {!compact && (
        <div className="text-center sm:text-left">
          <h2 className="font-display text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Nasıl öğrenmek istiyorsun?
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-md mx-auto sm:mx-0">
            PDF veya ders notundan yapay zeka sana uygun kartları hazırlasın.
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-4 sm:gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        {MODES.map(({ id, label, desc, tags, icon: Icon, accent, glow, preview }, i) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`group relative text-left rounded-3xl overflow-hidden border border-white/80 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${glow} animate-fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`relative h-36 sm:h-44 bg-gradient-to-br ${accent} overflow-hidden`}>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              {preview === "questions" ? <QuestionsPreview /> : <SummaryPreview />}
            </div>

            <div className="p-5 sm:p-6 bg-white/90">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {label}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-600 flex items-center justify-center shrink-0 transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface DeckModeHeaderProps {
  mode: DeckMode;
  onBack: () => void;
}

export function DeckModeHeader({ mode, onBack }: DeckModeHeaderProps) {
  const current = MODES.find((m) => m.id === mode)!;

  return (
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
      <button
        type="button"
        onClick={onBack}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition"
        title="Mod değiştir"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div
        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${current.accent} flex items-center justify-center shrink-0 shadow-lg`}
      >
        <current.icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
          Seçilen mod
        </p>
        <h2 className="font-display text-lg font-bold text-slate-900 truncate">
          {current.label}
        </h2>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition shrink-0"
      >
        Değiştir
      </button>
    </div>
  );
}

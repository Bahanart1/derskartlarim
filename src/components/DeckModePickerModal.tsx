"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { DeckModeSelector } from "@/components/DeckModeSelector";
import type { DeckMode } from "@/types";

interface DeckModePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mode: DeckMode) => void;
}

export function DeckModePickerModal({
  open,
  onClose,
  onSelect,
}: DeckModePickerModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  function handleSelect(mode: DeckMode) {
    onSelect(mode);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto glass-strong rounded-t-3xl p-5 pb-8 safe-bottom animate-scale-in shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Kart türü seç
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <DeckModeSelector onSelect={handleSelect} compact />
      </div>
    </div>
  );
}

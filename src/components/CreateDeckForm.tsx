"use client";

import { useState, useCallback } from "react";
import { Loader2, Upload, Wand2 } from "lucide-react";
import type { CardFormat, Deck, DeckMode } from "@/types";
import { CARD_FORMAT_LABELS } from "@/types";
import { createFlashcard } from "@/lib/spaced-repetition";
import { saveDeck } from "@/lib/decks";
import { useAuth } from "@/contexts/AuthProvider";
import { QuestionFormatSelector } from "@/components/QuestionFormatSelector";

interface CreateDeckFormProps {
  mode: DeckMode;
  onCreated: (deck: Deck) => void;
}

type LoadingStep = "idle" | "generating" | "saving";

interface GeneratedCard {
  front: string;
  back: string;
  format: CardFormat;
  options?: string[];
  correctIndex?: number;
  isTrue?: boolean;
  points?: string[];
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("AI yanıt vermedi. Daha kısa metin veya daha az kart dene.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function CreateDeckForm({ mode, onCreated }: CreateDeckFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [cardCount, setCardCount] = useState(8);
  const [cardFormat, setCardFormat] = useState<CardFormat>("classic");
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("idle");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const isSummary = mode === "summary";
  const loading = loadingStep !== "idle";
  const contentReady = text.length >= 50;
  const minCards = isSummary ? 4 : 5;
  const maxCards = isSummary ? 12 : 15;

  const processPdf = useCallback(async (file: File) => {
    setPdfLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setText(data.text);
      if (!title) setTitle(file.name.replace(/\.pdf$/i, ""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF yüklenemedi.");
    } finally {
      setPdfLoading(false);
    }
  }, [title]);

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await processPdf(file);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf" || file?.name.endsWith(".pdf")) {
      await processPdf(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !text.trim() || !user) return;

    setLoadingStep("generating");
    setError("");

    try {
      const res = await fetchWithTimeout(
        "/api/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text.trim().slice(0, 8000),
            count: cardCount,
            language: "tr",
            format: cardFormat,
            mode,
          }),
        },
        90000
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const deck: Deck = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: isSummary
          ? `${data.cards.length} özet kartı`
          : `${data.cards.length} kart · ${CARD_FORMAT_LABELS[cardFormat]}`,
        deckMode: mode,
        cardFormat: isSummary ? "summary" : cardFormat,
        cards: (data.cards as GeneratedCard[]).map((c) =>
          createFlashcard({
            ...c,
            format: isSummary ? "summary" : c.format,
          })
        ),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setLoadingStep("saving");
      const saved = await saveDeck(deck, user.uid);
      onCreated(saved);
      setTitle("");
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kartlar oluşturulamadı.");
    } finally {
      setLoadingStep("idle");
    }
  }

  const loadingLabel =
    loadingStep === "generating"
      ? isSummary
        ? "AI özet kartları üretiyor..."
        : "AI kartları üretiyor..."
      : loadingStep === "saving"
        ? "Kaydediliyor..."
        : isSummary
          ? "Özet Kartları Oluştur"
          : "Kartları Çıkart";

  const charPercent = Math.min((text.length / 8000) * 100, 100);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Deste Adı
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="örn. Tarih Sınavı, İngilizce Kelimeler"
          className="input-field"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          İçerik
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
            dragOver
              ? "border-indigo-400 bg-indigo-50/50 scale-[1.01]"
              : "border-slate-200 hover:border-indigo-200"
          }`}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
            isSummary
              ? "Özetlenecek ders notlarını yapıştır veya PDF sürükle..."
              : "Ders notlarını buraya yapıştır veya PDF sürükle..."
          }
            rows={7}
            className="w-full px-4 py-4 bg-transparent resize-none focus:outline-none text-slate-700 placeholder:text-slate-400"
            required
            disabled={loading}
          />

          <div className="flex items-center justify-between px-4 pb-3 border-t border-slate-100/80 pt-3">
            <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
              {pdfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              PDF Yükle
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
                disabled={pdfLoading || loading}
              />
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {text.length} karakter
              {text.length < 50 && " · min. 50"}
            </span>
          </div>
        </div>

        {text.length > 0 && (
          <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${charPercent}%` }}
            />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            {isSummary ? "Özet Kart Sayısı" : "Kart Sayısı"}
          </label>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {cardCount}
          </span>
        </div>
        <input
          type="range"
          min={minCards}
          max={maxCards}
          value={cardCount}
          onChange={(e) => setCardCount(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-indigo-600 cursor-pointer"
          disabled={loading}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
          <span>{minCards}</span>
          <span>{maxCards}</span>
        </div>
      </div>

      {contentReady && !isSummary && (
        <QuestionFormatSelector
          value={cardFormat}
          onChange={setCardFormat}
          disabled={loading}
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !contentReady || !title.trim()}
        className="w-full py-4 px-6 rounded-2xl btn-primary flex items-center justify-center gap-2.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            {isSummary ? "Özet Kartları Oluştur" : "Kartları Çıkart"}
          </>
        )}
      </button>
    </form>
  );
}

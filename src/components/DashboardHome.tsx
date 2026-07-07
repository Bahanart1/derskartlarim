"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Layers,
  Loader2,
  Plus,
  TrendingUp,
} from "lucide-react";
import type { User } from "firebase/auth";
import { CreateDeckForm } from "@/components/CreateDeckForm";
import { DeckModeSelector, DeckModeHeader } from "@/components/DeckModeSelector";
import { DeckCard } from "@/components/DeckCard";
import type { Deck, DeckMode } from "@/types";
import { deleteDeck, fetchDecks } from "@/lib/decks";
import { getDueCards } from "@/lib/spaced-repetition";

interface DashboardHomeProps {
  user: User;
  decks: Deck[];
  loadingDecks: boolean;
  onDecksChange: (decks: Deck[]) => void;
}

export function DashboardHome({
  user,
  decks,
  loadingDecks,
  onDecksChange,
}: DashboardHomeProps) {
  const router = useRouter();
  const [createMode, setCreateMode] = useState<DeckMode | null>(null);

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0);
  const dueTotal = decks.reduce(
    (sum, d) => sum + getDueCards(d.cards).length,
    0
  );
  const firstName = user.displayName?.split(" ")[0] || "öğrenci";

  async function handleCreated(deck: Deck) {
    const updated = await fetchDecks(user.uid);
    onDecksChange(updated);
    router.push(deck.deckMode === "summary" ? `/deck/${deck.id}` : `/study/${deck.id}`);
  }

  async function handleDelete(id: string) {
    await deleteDeck(id);
    onDecksChange(await fetchDecks(user.uid));
  }

  const stats = [
    {
      label: "Kart seti",
      value: decks.length,
      icon: Layers,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Toplam kart",
      value: totalCards,
      icon: BookOpen,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Tekrar bekleyen",
      value: dueTotal,
      icon: Clock,
      color: dueTotal > 0 ? "text-amber-600" : "text-slate-400",
      bg: dueTotal > 0 ? "bg-amber-50" : "bg-slate-50",
    },
  ];

  return (
    <div id="dashboard" className="pb-8">
      <section className="mb-8 animate-fade-up pt-2 sm:pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600 mb-1">Hoş geldin</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Merhaba,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {firstName}
              </span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Yeni kart seti oluştur veya tekrar bekleyen kartları çalış.
            </p>
          </div>

          {!createMode && (
            <button
              onClick={() => setCreateMode("questions")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Yeni kart
            </button>
          )}
        </div>
      </section>

      {decks.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 animate-fade-up">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass-strong rounded-2xl p-4 sm:p-5">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {value}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
        <section className="lg:col-span-3 glass-strong rounded-3xl p-6 sm:p-8 animate-fade-up">
          {!createMode ? (
            <>
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Kart oluştur
                </h2>
              </div>
              <DeckModeSelector onSelect={setCreateMode} />
            </>
          ) : (
            <>
              <DeckModeHeader mode={createMode} onBack={() => setCreateMode(null)} />
              <CreateDeckForm mode={createMode} onCreated={handleCreated} />
            </>
          )}
        </section>

        <section className="lg:col-span-2 animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Kartlarım
            </h2>
            {decks.length > 0 && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {decks.length}
              </span>
            )}
          </div>

          {loadingDecks ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : decks.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center border-2 border-dashed border-indigo-100">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-7 h-7 text-indigo-300" />
              </div>
              <p className="font-medium text-slate-700">Henüz kart seti yok</p>
              <p className="text-sm text-slate-400 mt-1 mb-5">
                Soldan mod seçip ilk kart setini oluştur
              </p>
              <button
                onClick={() => setCreateMode("questions")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" />
                İlk kart setini oluştur
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[41rem] overflow-y-auto overscroll-y-contain pr-1 -mr-1">
              {decks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
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
import { DeckModePickerModal } from "@/components/DeckModePickerModal";
import { DeckCard } from "@/components/DeckCard";
import type { Deck, DeckMode } from "@/types";
import { deleteDeck, fetchDecks } from "@/lib/decks";
import { scrollToElementWithNavOffset } from "@/lib/scroll";
import { getDueCards } from "@/lib/spaced-repetition";

interface DashboardHomeProps {
  user: User;
  decks: Deck[];
  loadingDecks: boolean;
  onDecksChange: (decks: Deck[]) => void;
}

function openModePicker(setOpen: (v: boolean) => void) {
  if (window.matchMedia("(max-width: 1023px)").matches) {
    setOpen(true);
    return;
  }
  scrollToElementWithNavOffset("create-section");
}

export function DashboardHome({
  user,
  decks,
  loadingDecks,
  onDecksChange,
}: DashboardHomeProps) {
  const router = useRouter();
  const [createMode, setCreateMode] = useState<DeckMode | null>(null);
  const [modePickerOpen, setModePickerOpen] = useState(false);

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

  function handleModeSelect(mode: DeckMode) {
    setCreateMode(mode);
  }

  useEffect(() => {
    if (!createMode) return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;

    const timer = window.setTimeout(() => {
      scrollToElementWithNavOffset("create-section");
    }, 150);

    return () => clearTimeout(timer);
  }, [createMode]);

  const stats = [
    {
      label: "Kart seti",
      shortLabel: "Set",
      value: decks.length,
      icon: Layers,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Toplam kart",
      shortLabel: "Kart",
      value: totalCards,
      icon: BookOpen,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Tekrar bekleyen",
      shortLabel: "Tekrar",
      value: dueTotal,
      icon: Clock,
      color: dueTotal > 0 ? "text-amber-600" : "text-slate-400",
      bg: dueTotal > 0 ? "bg-amber-50" : "bg-slate-50",
    },
  ];

  const statsSection =
    decks.length > 0 ? (
      <div className="grid grid-cols-3 gap-2 sm:gap-4 animate-fade-up">
        {stats.map(({ label, shortLabel, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${bg} flex items-center justify-center mb-2 sm:mb-3`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${color}`} />
            </div>
            <div className="font-display text-xl sm:text-3xl font-bold text-slate-900">
              {value}
            </div>
            <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5 font-medium leading-tight">
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          </div>
        ))}
      </div>
    ) : null;

  const kartlarimSection = (
    <section className="animate-fade-up">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
          Kartlarım
        </h2>
        {decks.length > 0 && (
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {decks.length}
          </span>
        )}
      </div>

      {loadingDecks ? (
        <div className="flex justify-center py-12 sm:py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : decks.length === 0 ? (
        <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center border-2 border-dashed border-indigo-100">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-300" />
          </div>
          <p className="font-medium text-slate-700">Henüz kart seti yok</p>
          <p className="text-sm text-slate-400 mt-1 mb-5">
            Mod seçip ilk kart setini oluştur
          </p>
          <button
            onClick={() => openModePicker(setModePickerOpen)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="w-4 h-4" />
            İlk kart setini oluştur
          </button>
        </div>
      ) : (
        <div className="space-y-3 deck-list-scroll pr-1">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );

  const createSection = (
    <section
      id="create-section"
      className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-8 animate-fade-up scroll-mt-28"
    >
      {!createMode ? (
        <>
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Kart oluştur
            </h2>
          </div>

          <div className="hidden lg:block">
            <DeckModeSelector onSelect={setCreateMode} />
          </div>

          <div className="lg:hidden text-center py-6 px-2">
            <p className="text-sm text-slate-500 mb-4">
              Soru kartı veya özet kartı — modunu seçerek başla.
            </p>
            <button
              type="button"
              onClick={() => setModePickerOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl btn-primary text-sm min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              Mod seç ve başla
            </button>
          </div>
        </>
      ) : (
        <>
          <DeckModeHeader
            mode={createMode}
            onBack={() => {
              setCreateMode(null);
              if (window.matchMedia("(max-width: 1023px)").matches) {
                setModePickerOpen(true);
              }
            }}
          />
          <CreateDeckForm mode={createMode} onCreated={handleCreated} />
        </>
      )}
    </section>
  );

  return (
    <div id="dashboard" className="pb-8 safe-bottom">
      <DeckModePickerModal
        open={modePickerOpen}
        onClose={() => setModePickerOpen(false)}
        onSelect={handleModeSelect}
      />

      <section className="mb-6 sm:mb-8 animate-fade-up pt-1 sm:pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600 mb-1">Hoş geldin</p>
            <h1 className="font-display text-xl sm:text-3xl font-bold text-slate-900">
              Merhaba,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {firstName}
              </span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Yeni kart seti oluştur veya tekrar bekleyen kartları çalış.
            </p>
          </div>

          {createMode ? (
            <button
              type="button"
              onClick={() => setCreateMode(null)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 text-sm shrink-0 transition"
            >
              Oluşturmayı iptal et
            </button>
          ) : (
            <button
              onClick={() => openModePicker(setModePickerOpen)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl btn-primary text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Yeni kart
            </button>
          )}
        </div>
      </section>

      {createMode ? (
        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
          {createSection}
          {statsSection}
          {kartlarimSection}
        </div>
      ) : (
        <>
          {statsSection && (
            <div className="mb-6 sm:mb-8">{statsSection}</div>
          )}
          <div className="grid lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8">
            <div className="order-1 lg:order-2 lg:col-span-2">
              {kartlarimSection}
            </div>
            <div className="order-2 lg:order-1 lg:col-span-3">
              {createSection}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

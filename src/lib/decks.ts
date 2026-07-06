import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { runFirestore } from "@/lib/async";
import type { Deck, Flashcard } from "@/types";

const LEGACY_STORAGE_KEY = "flashcards-ai-decks";

interface DeckDoc {
  userId: string;
  title: string;
  description: string;
  deckMode?: string;
  cardFormat?: string;
  cards: Flashcard[];
  createdAt: number;
  updatedAt: number;
}

function removeUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefined(item)) as T;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    ) as T;
  }

  return value;
}

function normalizeDeckMode(value?: string): Deck["deckMode"] {
  return value === "summary" ? "summary" : "questions";
}

function normalizeCardFormat(value?: string): Deck["cardFormat"] {
  if (value === "multiple_choice" || value === "true_false" || value === "summary") {
    return value;
  }
  return "classic";
}

function docToDeck(id: string, data: DeckDoc): Deck {
  const deckMode = normalizeDeckMode(data.deckMode);
  const cardFormat = normalizeCardFormat(data.cardFormat);

  return {
    id,
    title: data.title,
    description: data.description,
    deckMode,
    cardFormat,
    cards: (data.cards ?? []).map((card) => ({
      ...card,
      format: card.format ?? cardFormat,
    })),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function fetchDecks(userId: string): Promise<Deck[]> {
  return runFirestore(async () => {
    const q = query(collection(getFirebaseDb(), "decks"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((d) => docToDeck(d.id, d.data() as DeckDoc))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  });
}

export async function fetchDeck(id: string, userId: string): Promise<Deck | null> {
  const ref = doc(getFirebaseDb(), "decks", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const data = snapshot.data() as DeckDoc;
  if (data.userId !== userId) return null;

  return docToDeck(snapshot.id, data);
}

export async function saveDeck(deck: Deck, userId: string): Promise<Deck> {
  return runFirestore(async () => {
    const now = Date.now();
    const payload: DeckDoc = {
      userId,
      title: deck.title,
      description: deck.description,
      deckMode: deck.deckMode ?? "questions",
      cardFormat: deck.cardFormat ?? "classic",
      cards: deck.cards.map((card) => removeUndefined(card)),
      createdAt: deck.createdAt || now,
      updatedAt: now,
    };

    await setDoc(doc(getFirebaseDb(), "decks", deck.id), removeUndefined(payload));

    return {
      ...deck,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };
  });
}

export async function deleteDeck(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), "decks", id));
}

export async function migrateLocalDecks(userId: string): Promise<number> {
  if (typeof window === "undefined") return 0;

  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return 0;

    const localDecks = JSON.parse(raw) as Deck[];
    if (!localDecks.length) return 0;

    for (const deck of localDecks) {
      await saveDeck(deck, userId);
    }

    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return localDecks.length;
  } catch {
    return 0;
  }
}

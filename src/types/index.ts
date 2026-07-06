export type CardFormat = "classic" | "multiple_choice" | "true_false" | "summary";

export type DeckMode = "questions" | "summary";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  format: CardFormat;
  options?: string[];
  correctIndex?: number;
  isTrue?: boolean;
  points?: string[];
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  deckMode: DeckMode;
  cardFormat: CardFormat;
  cards: Flashcard[];
  createdAt: number;
  updatedAt: number;
}

export type ReviewQuality = 1 | 2 | 3 | 4;

export const DECK_MODE_LABELS: Record<DeckMode, string> = {
  questions: "Soru Kartları",
  summary: "Özet Kartları",
};

export const CARD_FORMAT_LABELS: Record<CardFormat, string> = {
  classic: "Klasik (Soru-Cevap)",
  multiple_choice: "Şıklı",
  true_false: "Doğru / Yanlış",
  summary: "Özet",
};

export function getCardPoints(card: Pick<Flashcard, "points" | "back">): string[] {
  if (card.points?.length) return card.points;
  if (card.back) {
    return card.back
      .split("\n")
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

import type { CardFormat, Flashcard, ReviewQuality } from "@/types";

export function isDue(card: Flashcard): boolean {
  return card.nextReview <= Date.now();
}

export function getDueCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(isDue);
}

export function updateCardAfterReview(
  card: Flashcard,
  quality: ReviewQuality
): Flashcard {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview,
  };
}

interface CreateCardInput {
  front: string;
  back: string;
  format?: CardFormat;
  options?: string[];
  correctIndex?: number;
  isTrue?: boolean;
  points?: string[];
}

export function createFlashcard(input: CreateCardInput): Flashcard {
  const card: Flashcard = {
    id: crypto.randomUUID(),
    front: input.front,
    back: input.back,
    format: input.format ?? "classic",
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
  };

  if (input.format === "multiple_choice" && input.options) {
    card.options = input.options;
    card.correctIndex = input.correctIndex ?? 0;
  }

  if (input.format === "true_false" && typeof input.isTrue === "boolean") {
    card.isTrue = input.isTrue;
  }

  if (input.format === "summary" && input.points?.length) {
    card.points = input.points;
    card.back = input.points.join("\n");
  }

  return card;
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CardFormat } from "@/types";

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapGeminiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("429") || message.includes("Quota exceeded")) {
    return "Ücretsiz günlük kota doldu. Yarın tekrar dene.";
  }
  if (message.includes("API_KEY_INVALID") || message.includes("API key not valid")) {
    return "Gemini API anahtarı geçersiz.";
  }
  return "Kartlar oluşturulurken hata oluştu.";
}

async function generateWithFallback(
  genAI: GoogleGenerativeAI,
  prompt: string
): Promise<string> {
  let lastError: unknown;

  for (const modelName of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("429") && attempt === 0) {
          await sleep(5000);
          continue;
        }
        break;
      }
    }
  }

  throw lastError ?? new Error("Tüm modeller başarısız oldu.");
}

function buildPrompt(format: CardFormat, count: number, language: string, text: string) {
  const lang = language === "tr" ? "Türkçe" : "English";

  if (format === "multiple_choice") {
    return `Metinden ${count} adet çoktan seçmeli soru üret. Dil: ${lang}.
Kurallar:
- Her soruda tam 4 şık olmalı
- correctIndex 0-3 arası (doğru şıkkın indeksi)
- back alanı kısa açıklama olsun
Sadece JSON dizisi döndür:
[{"front":"soru","options":["A şıkkı","B şıkkı","C şıkkı","D şıkkı"],"correctIndex":0,"back":"açıklama"}]

Metin:
${text}`;
  }

  if (format === "true_false") {
    return `Metinden ${count} adet doğru/yanlış ifadesi üret. Dil: ${lang}.
Kurallar:
- front: test edilecek ifade
- isTrue: ifade doğruysa true, yanlışsa false
- back: kısa açıklama
Sadece JSON dizisi döndür:
[{"front":"ifade","isTrue":true,"back":"açıklama"}]

Metin:
${text}`;
  }

  return `Metinden ${count} flashcard üret. Dil: ${lang}.
Sadece JSON dizisi döndür:
[{"front":"soru","back":"cevap"}]

Metin:
${text}`;
}

function buildSummaryPrompt(count: number, language: string, text: string) {
  const lang = language === "tr" ? "Türkçe" : "English";

  return `Metinden ${count} adet özet kartı üret. Dil: ${lang}.
Kurallar:
- Soru sorma, test yapma, cevap gizleme
- Her kart bir konunun önemli bilgilerini madde madde yazsın
- front: konu veya bölüm başlığı (kısa)
- points: o konunun en önemli 3-5 maddesi (sınavda çıkabilecek bilgiler, kısa net cümleler)
Sadece JSON dizisi döndür:
[{"front":"konu başlığı","points":["önemli madde 1","önemli madde 2","önemli madde 3"]}]

Metin:
${text}`;
}

function parseCards(raw: unknown[], format: CardFormat) {
  if (format === "multiple_choice") {
    return raw
      .filter((c) => {
        const card = c as Record<string, unknown>;
        return (
          typeof card.front === "string" &&
          Array.isArray(card.options) &&
          card.options.length === 4 &&
          typeof card.correctIndex === "number" &&
          card.correctIndex >= 0 &&
          card.correctIndex < 4
        );
      })
      .map((c) => {
        const card = c as Record<string, unknown>;
        const options = (card.options as string[]).map((o) => String(o).trim());
        const correctIndex = card.correctIndex as number;
        return {
          front: String(card.front).trim(),
          back: String(card.back ?? options[correctIndex]).trim(),
          format: "multiple_choice" as const,
          options,
          correctIndex,
        };
      });
  }

  if (format === "true_false") {
    return raw
      .filter((c) => {
        const card = c as Record<string, unknown>;
        return typeof card.front === "string" && typeof card.isTrue === "boolean";
      })
      .map((c) => {
        const card = c as Record<string, unknown>;
        return {
          front: String(card.front).trim(),
          back: String(card.back ?? "").trim(),
          format: "true_false" as const,
          isTrue: card.isTrue as boolean,
        };
      });
  }

  if (format === "summary") {
    return raw
      .filter((c) => {
        const card = c as Record<string, unknown>;
        return (
          typeof card.front === "string" &&
          Array.isArray(card.points) &&
          card.points.length > 0
        );
      })
      .map((c) => {
        const card = c as Record<string, unknown>;
        const points = (card.points as unknown[])
          .map((p) => String(p).trim())
          .filter(Boolean);
        return {
          front: String(card.front).trim(),
          back: points.join("\n"),
          format: "summary" as const,
          points,
        };
      });
  }

  return raw
    .filter((c) => {
      const card = c as Record<string, unknown>;
      return typeof card.front === "string" && typeof card.back === "string";
    })
    .map((c) => {
      const card = c as Record<string, unknown>;
      return {
        front: String(card.front).trim(),
        back: String(card.back).trim(),
        format: "classic" as const,
      };
    });
}

export async function POST(request: NextRequest) {
  try {
    const {
      text,
      count = 10,
      language = "tr",
      format = "classic",
      mode = "questions",
    } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json(
        { error: "En az 50 karakterlik metin gerekli." },
        { status: 400 }
      );
    }

    const deckMode = mode === "summary" ? "summary" : "questions";
    const cardFormat =
      deckMode === "summary"
        ? "summary"
        : ["classic", "multiple_choice", "true_false"].includes(format)
          ? (format as CardFormat)
          : "classic";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY tanımlı değil." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const safeCount = Math.min(Math.max(Number(count) || 10, 3), 15);
    const prompt =
      deckMode === "summary"
        ? buildSummaryPrompt(safeCount, language, text.trim().slice(0, 4000))
        : buildPrompt(cardFormat, safeCount, language, text.trim().slice(0, 4000));

    const responseText = await generateWithFallback(genAI, prompt);
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return NextResponse.json({ error: "AI yanıtı ayrıştırılamadı." }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]) as unknown[];
    const validCards = parseCards(parsed, cardFormat);

    if (validCards.length === 0) {
      return NextResponse.json({ error: "Kart oluşturulamadı." }, { status: 500 });
    }

    return NextResponse.json({ cards: validCards, format: cardFormat, mode: deckMode });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: mapGeminiError(error) }, { status: 500 });
  }
}

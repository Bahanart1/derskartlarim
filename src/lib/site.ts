export const siteConfig = {
  name: "Ders Kartlarım",
  title: "Ders Kartlarım — Yapay Zeka ile Ders Kartı Oluştur",
  description:
    "PDF ve ders notlarından yapay zeka ile ders kartı oluştur. SM-2 spaced repetition algoritması ile sınavlara kalıcı hazırlan.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://derskartlarim.com",
  icon: "/ders_kartlarim.png",
  locale: "tr_TR",
  keywords: [
    "ders kartları",
    "ders kartı oluştur",
    "flashcard",
    "öğrenme kartları",
    "pdf'den kart",
    "yapay zeka ders",
    "spaced repetition",
    "sınav hazırlık",
    "SM-2",
    "Gemini AI",
  ],
} as const;

# Ders Kartlarım

AI destekli ders kartı oluşturma ve öğrenme uygulaması — [derskartlarim.com](https://derskartlarim.com)

## Özellikler

- Metin veya PDF'den otomatik kart üretimi (Google Gemini)
- **Soru Kartları** — klasik, şıklı, doğru/yanlış
- **Özet Kartları** — önemli noktalar madde madde, direkt görünür
- Firebase Auth ile giriş / kayıt
- Firestore'da deste saklama
- SM-2 spaced repetition algoritması

## Kurulum

```bash
npm install
cp .env.example .env.local
# .env.local dosyasına API anahtarlarını ekle
npm run dev
```

### Firebase kurulumu

1. [Firebase Console](https://console.firebase.google.com) → Yeni proje oluştur
2. **Authentication** → Email/Password + Google etkinleştir
3. **Firestore Database** → Oluştur
4. **Project Settings** → Web app ekle → config değerlerini `.env.local`'e yapıştır
5. **Firestore Rules** → `firestore.rules` dosyasındaki kuralları yapıştır

### Gemini API

[Gemini API anahtarı al](https://aistudio.google.com/apikey)

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS
- Google Gemini AI
- Firebase Auth + Firestore
- pdf-parse

## Lisans

MIT

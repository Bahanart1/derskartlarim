"use client";

import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Brain,
  FileText,
  Layers,
  LogIn,
  Repeat,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/lib/site";

interface LandingHeroProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Zap,
    title: "Hızlı üretim",
    desc: "Ders notunu yapıştır veya PDF yükle, saniyeler içinde kartlar hazır.",
    iconColor: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Brain,
    title: "Akıllı tekrar",
    desc: "SM-2 algoritması hangi kartı ne zaman çalışacağını senin için planlar.",
    iconColor: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    icon: BookOpen,
    title: "PDF desteği",
    desc: "Slayt, ders notu veya kitap bölümünden doğrudan kart oluştur.",
    iconColor: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

const steps = [
  {
    icon: Upload,
    title: "Notunu ekle",
    desc: "Metin yapıştır veya PDF yükle.",
  },
  {
    icon: Sparkles,
    title: "Kartlar üretilsin",
    desc: "Yapay zeka soru, özet veya şıklı kartlar oluşturur.",
  },
  {
    icon: Repeat,
    title: "Tekrarla & öğren",
    desc: "Spaced repetition ile kalıcı hafızaya yerleştir.",
  },
];

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  function scrollToSteps() {
    document.getElementById("nasil-calisir")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="pb-16 sm:pb-24">
      <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-4 sm:pt-8 mb-20 sm:mb-28 animate-fade-up">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-6">
            <Layers className="w-4 h-4" />
            Sınav hazırlığı için akıllı kartlar
          </p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.08]">
            Metninden{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              ders kartı
            </span>
            <br />
            saniyeler içinde
          </h1>

          <p className="text-slate-500 mt-5 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            PDF veya ders notunu yükle, yapay zeka soru-cevap kartları üretsin.
            Tekrar zamanlaması ile sınavlara kalıcı hazırlan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl btn-primary text-base"
            >
              <LogIn className="w-5 h-5" />
              Ücretsiz Başla
            </button>
            <button
              onClick={scrollToSteps}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass text-slate-700 font-semibold hover:bg-white/90 transition-colors"
            >
              Nasıl çalışır?
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ücretsiz kayıt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Bulutta senkron
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              Mobil uyumlu
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-scale-in" style={{ animationDelay: "0.15s" }}>
          <div className="absolute -inset-4 bg-gradient-to-br from-indigo-200/40 via-violet-100/30 to-emerald-100/40 rounded-[2rem] blur-2xl" aria-hidden />

          <div className="relative glass-strong rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={siteConfig.icon}
                alt={siteConfig.name}
                width={72}
                height={48}
                className="w-[4.5rem] h-12 object-contain"
                priority
              />
              <div>
                <p className="font-display font-bold text-lg text-slate-900">Ders Kartlarım</p>
                <p className="text-sm text-slate-500">Örnek kart önizlemesi</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { q: "Fotosentez nedir?", tag: "Biyoloji", color: "border-l-indigo-500" },
                { q: "Mitokondri fonksiyonu?", tag: "Hücre", color: "border-l-violet-500" },
                { q: "DNA replikasyonu adımları", tag: "Genetik", color: "border-l-emerald-500" },
              ].map((card, i) => (
                <div
                  key={card.q}
                  className={`glass rounded-xl p-4 border-l-4 ${card.color} animate-fade-up`}
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {card.tag}
                  </span>
                  <p className="font-medium text-slate-800 mt-1 text-sm">{card.q}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                12 kart üretildi
              </span>
              <span className="text-indigo-600 font-semibold">Tekrar: 3 kart</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20 sm:mb-28">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {features.map(({ icon: Icon, title, desc, iconColor, bg }, i) => (
            <div
              key={title}
              className="glass-strong rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-500/5 transition-shadow animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="nasil-calisir" className="scroll-mt-24 mb-16 sm:mb-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Nasıl çalışır?
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Üç adımda ders notundan çalışmaya hazır kartlara geç.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 relative">
          <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" aria-hidden />

          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="text-center animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="relative inline-flex">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mx-auto">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-indigo-100 text-xs font-bold text-indigo-600 flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-900 mt-4 mb-1">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-strong rounded-3xl p-8 sm:p-10 text-center animate-fade-up">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Öğrenmeye hazır mısın?
        </h2>
        <p className="text-slate-500 mt-3 max-w-md mx-auto">
          Hesap oluştur, kartların bulutta saklansın. Her cihazdan kaldığın yerden devam et.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-7 inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl btn-primary text-base"
        >
          Hemen başla
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, LogIn, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthModal } from "@/components/AuthModal";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                FlashCards
              </span>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              Gemini AI
            </div>

            {!loading &&
              (user ? (
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {(user.displayName || user.email || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm text-slate-600 max-w-[140px] truncate font-medium">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Çıkış</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white btn-primary px-5 py-2.5 rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  Giriş Yap
                </button>
              ))}
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

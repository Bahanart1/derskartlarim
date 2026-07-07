"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { siteConfig } from "@/lib/site";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[4.5rem] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={siteConfig.icon}
              alt={siteConfig.name}
              width={80}
              height={48}
              className="w-20 h-12 object-contain"
              priority
            />
            <div className="leading-tight">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-slate-900">
                Ders{" "}
              </span>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Kartlarım
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
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

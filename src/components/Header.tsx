"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { siteConfig } from "@/lib/site";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  function openAuth(mode: "login" | "signup") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <>
      <nav className="fixed z-50 top-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-6 sm:w-[85%] max-w-6xl bg-white/50 backdrop-blur-xl border border-slate-200/50 rounded-2xl sm:rounded-full shadow-sm shadow-slate-200/40">
        <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3">
          <Link href="/" className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
            <Image
              src={siteConfig.icon}
              alt={siteConfig.name}
              width={80}
              height={48}
              className="w-10 h-6 sm:w-20 sm:h-12 object-contain shrink-0"
              priority
            />
            <div className="leading-tight min-w-0 truncate">
              <span className="font-display font-bold text-sm sm:text-lg md:text-xl tracking-tight text-slate-900">
                Ders{" "}
              </span>
              <span className="font-display font-bold text-sm sm:text-lg md:text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Kartlarım
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            {!loading &&
              (user ? (
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm">
                      {(user.displayName || user.email || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm text-slate-600 max-w-[140px] truncate font-medium">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center justify-center gap-1 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors px-2.5 sm:px-3 py-1.5 text-sm rounded-lg font-semibold h-9 w-9 sm:w-auto"
                    aria-label="Çıkış yap"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Çıkış</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuth("signup")}
                    className="flex border border-violet-400 text-violet-600 hover:bg-violet-500 hover:text-white transition-colors px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg font-semibold h-9 min-w-[3.5rem] sm:min-w-[80px] items-center justify-center whitespace-nowrap"
                  >
                    Kayıt Ol
                  </button>
                  <button
                    onClick={() => openAuth("login")}
                    className="border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-colors px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg font-semibold h-9 min-w-[3.5rem] sm:min-w-[80px] flex items-center justify-center whitespace-nowrap"
                  >
                    <span className="sm:hidden">Giriş</span>
                    <span className="hidden sm:inline">Giriş Yap</span>
                  </button>
                </>
              ))}
          </div>
        </div>
      </nav>

      <AuthModal
        key={authMode}
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { Loader2, LogIn, UserPlus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function AuthModal({
  open,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError("");
    const err = await signInWithGoogle();
    if (err) {
      setError(err);
      setGoogleLoading(false);
      return;
    }
    onClose();
    setGoogleLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const err =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    onClose();
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-up"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 animate-scale-in mx-auto"
        style={{ animationDuration: "0.3s" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/25">
          <LogIn className="w-6 h-6 text-white" />
        </div>

        <h2 className="font-display text-2xl font-bold text-slate-900">
          {mode === "login" ? "Tekrar hoş geldin" : "Hesap oluştur"}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Kartların bulutta, her cihazda seninle.
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="mt-6 w-full py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Google ile devam et
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">veya</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="flex gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                mode === m
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m === "login" ? "Giriş" : "Kayıt Ol"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="ornek@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="En az 6 karakter"
              minLength={6}
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3.5 rounded-2xl btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === "login" ? (
              <>
                <LogIn className="w-5 h-5" />
                Giriş Yap
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Kayıt Ol
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { migrateLocalDecks } from "@/lib/decks";

function mapAuthError(message: string): string {
  if (message.includes("configuration-not-found") || message.includes("CONFIGURATION_NOT_FOUND")) {
    return "Firebase Authentication henüz açılmamış. Console'da Authentication → Sign-in method → Email/Password'ü etkinleştir.";
  }
  if (message.includes("invalid-credential")) return "E-posta veya şifre hatalı.";
  if (message.includes("email-already-in-use")) return "Bu e-posta zaten kayıtlı.";
  if (message.includes("weak-password")) return "Şifre en az 6 karakter olmalı.";
  if (message.includes("invalid-email")) return "Geçersiz e-posta adresi.";
  if (message.includes("popup-closed-by-user")) {
    return "Google giriş penceresi kapatıldı.";
  }
  if (message.includes("operation-not-allowed")) {
    return "Bu giriş yöntemi kapalı. Firebase Console'dan etkinleştir.";
  }
  return message;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        await migrateLocalDecks(nextUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      return null;
    } catch (err) {
      return mapAuthError(err instanceof Error ? err.message : "Giriş başarısız.");
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      return null;
    } catch (err) {
      return mapAuthError(err instanceof Error ? err.message : "Kayıt başarısız.");
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(getFirebaseAuth(), provider);
      return null;
    } catch (err) {
      return mapAuthError(err instanceof Error ? err.message : "Google girişi başarısız.");
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(getFirebaseAuth());
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

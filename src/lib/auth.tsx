"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { api } from "./api";
import { CURRENT_USER } from "./seed";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  title: string;
  username: string;
  guest: boolean;
}

const GUEST_USER: AuthUser = {
  id: CURRENT_USER.id,
  name: "Dexter",
  email: "dexter@gmail.com",
  title: "Designer",
  username: "dexuser",
  guest: true,
};

const KEY = "tm-auth";
const TOKEN_KEY = "tm-token";

interface AuthCtx {
  user: AuthUser | null;
  ready: boolean;
  loginAsGuest: () => void | Promise<void>;
  loginWithGoogle: () => void | Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  }, []);

  const loginAsGuest = useCallback(async () => {
    try {
      const { token, user } = await api.guest();
      localStorage.setItem(TOKEN_KEY, token);
      persist(user);
    } catch {
      // Backend unreachable — fall back to a local guest session.
      persist(GUEST_USER);
    }
    toast.success("Signed in as guest");
    router.push("/tasks");
  }, [persist, router]);

  const loginWithGoogle = useCallback(async () => {
    // Mock OAuth exchange handled by the NestJS /auth/google endpoint.
    try {
      const { token, user } = await api.google();
      localStorage.setItem(TOKEN_KEY, token);
      persist(user);
    } catch {
      persist({ ...GUEST_USER, guest: false });
    }
    toast.success("Welcome to Taskly");
    router.push("/tasks");
  }, [persist, router]);

  const updateUser = useCallback(
    (patch: Partial<AuthUser>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const nextUser = { ...prev, ...patch };
        localStorage.setItem(KEY, JSON.stringify(nextUser));
        return nextUser;
      });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    persist(null);
    toast.success("Signed out");
    router.push("/login");
  }, [persist, router]);

  return (
    <Ctx.Provider
      value={{ user, ready, loginAsGuest, loginWithGoogle, updateUser, logout }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

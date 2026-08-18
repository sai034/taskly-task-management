"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ColorMode = "light" | "dark";
export type Accent = "amber" | "blue" | "pink" | "rose" | "emerald" | "black";

export const ACCENTS: { key: Accent; label: string; swatch: string }[] = [
  { key: "amber", label: "Amber", swatch: "#f59e0b" },
  { key: "blue", label: "Blue", swatch: "#3b82f6" },
  { key: "pink", label: "Pink", swatch: "#ec4899" },
  { key: "rose", label: "Rose", swatch: "#f43f5e" },
  { key: "emerald", label: "Emerald", swatch: "#10b981" },
  { key: "black", label: "Black", swatch: "#18181b" },
];

const MODE_KEY = "tm-mode";
const ACCENT_KEY = "tm-accent";
const DEFAULT_MODE: ColorMode = "light";
const DEFAULT_ACCENT: Accent = "blue";

interface ThemeCtx {
  mode: ColorMode;
  accent: Accent;
  setMode: (m: ColorMode) => void;
  toggleMode: () => void;
  setAccent: (a: Accent) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function apply(mode: ColorMode, accent: Accent) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.setAttribute("data-accent", accent);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>(DEFAULT_MODE);
  const [accent, setAccentState] = useState<Accent>(DEFAULT_ACCENT);

  // Hydrate from storage (the inline script already painted the correct theme).
  useEffect(() => {
    const m = (localStorage.getItem(MODE_KEY) as ColorMode) || DEFAULT_MODE;
    const a = (localStorage.getItem(ACCENT_KEY) as Accent) || DEFAULT_ACCENT;
    setModeState(m);
    setAccentState(a);
  }, []);

  const setMode = useCallback((m: ColorMode) => {
    setModeState(m);
    localStorage.setItem(MODE_KEY, m);
    apply(m, (localStorage.getItem(ACCENT_KEY) as Accent) || DEFAULT_ACCENT);
  }, []);

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a);
    localStorage.setItem(ACCENT_KEY, a);
    apply((localStorage.getItem(MODE_KEY) as ColorMode) || DEFAULT_MODE, a);
  }, []);

  const toggleMode = useCallback(
    () => setMode(mode === "dark" ? "light" : "dark"),
    [mode, setMode],
  );

  return (
    <Ctx.Provider value={{ mode, accent, setMode, toggleMode, setAccent }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/** Runs before hydration to avoid a theme flash. */
export const themeScript = `(function(){try{var m=localStorage.getItem('${MODE_KEY}')||'${DEFAULT_MODE}';var a=localStorage.getItem('${ACCENT_KEY}')||'${DEFAULT_ACCENT}';var r=document.documentElement;if(m==='dark')r.classList.add('dark');r.setAttribute('data-accent',a);}catch(e){}})();`;

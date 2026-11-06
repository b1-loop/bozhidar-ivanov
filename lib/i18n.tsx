"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { content, defaultLocale, type Content, type Locale } from "./content";

const STORAGE_KEY = "bi-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  c: Content;
};

const LocaleContext = createContext<Ctx | null>(null);

/*
 * The chosen locale lives outside React (localStorage + browser language), so
 * it's read with useSyncExternalStore: the server renders `defaultLocale`, the
 * client switches to the saved/browser locale right after hydration.
 */
const listeners = new Set<() => void>();
// Fallback when storage is unavailable (private mode, blocked site data)
let memoryLocale: Locale | null = null;

function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "sv";
}

function readLocale(): Locale {
  if (memoryLocale) return memoryLocale;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {}
  return navigator.language?.toLowerCase().startsWith("sv") ? "sv" : "en";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getServerLocale(): Locale {
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, getServerLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    memoryLocale = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    listeners.forEach((notify) => notify());
  }, []);

  const value = useMemo(() => ({ locale, setLocale, c: content[locale] }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useContent(): Content {
  return useLocale().c;
}

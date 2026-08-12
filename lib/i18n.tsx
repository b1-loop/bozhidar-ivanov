"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { content, defaultLocale, type Content, type Locale } from "./content";

const STORAGE_KEY = "bi-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  c: Content;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "sv") {
        setLocaleState(saved);
      } else {
        const browser =
          typeof navigator !== "undefined" &&
          navigator.language?.toLowerCase().startsWith("sv")
            ? "sv"
            : "en";
        setLocaleState(browser);
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, c: content[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useContent(): Content {
  return useLocale().c;
}

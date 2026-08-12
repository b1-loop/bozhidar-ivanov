"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { useLocale } from "@/lib/i18n";

type Shortcut = {
  keys: string[];
  label: string;
  action?: () => void;
};

const SEQUENCE_TIMEOUT_MS = 1500;

function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.hash = hash;
}

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLocale();

  const shortcuts: { group: string; items: Shortcut[] }[] = [
    {
      group: "Navigation",
      items: [
        { keys: ["G", "H"], label: "Home / hero" },
        { keys: ["G", "A"], label: "About" },
        { keys: ["G", "J"], label: "Journey" },
        { keys: ["G", "P"], label: "Projects" },
        { keys: ["G", "S"], label: "Skills" },
        { keys: ["G", "E"], label: "Experience" },
        { keys: ["G", "R"], label: "References" },
        { keys: ["G", "C"], label: "Contact" },
      ],
    },
    {
      group: "Actions",
      items: [
        { keys: ["L"], label: "Toggle language (EN ↔ SV)" },
        { keys: ["?"], label: "Show this help" },
        { keys: ["Esc"], label: "Close overlay" },
      ],
    },
  ];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let awaitingSecond = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const routes: Record<string, string> = {
      h: "#top",
      a: "#about",
      j: "#journey",
      p: "#projects",
      s: "#skills",
      e: "#experience",
      r: "#references",
      c: "#contact",
    };

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Escape always closes
      if (e.key === "Escape") {
        setOpen(false);
        awaitingSecond = false;
        return;
      }

      // Show help
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      const key = e.key.toLowerCase();

      // Second key of sequence
      if (awaitingSecond) {
        if (routes[key]) {
          e.preventDefault();
          scrollToHash(routes[key]);
        }
        awaitingSecond = false;
        if (timer) clearTimeout(timer);
        return;
      }

      // First key: "g" starts navigation sequence
      if (key === "g") {
        awaitingSecond = true;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          awaitingSecond = false;
        }, SEQUENCE_TIMEOUT_MS);
        return;
      }

      // Single-key: L toggles language
      if (key === "l") {
        setLocale(locale === "en" ? "sv" : "en");
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (timer) clearTimeout(timer);
    };
  }, [locale, setLocale]);

  return (
    <>
      {/* Floating hint button — bottom-right corner */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Show keyboard shortcuts"
        className="group fixed bottom-6 right-6 z-40 hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:border-white/40 hover:bg-black/80 hover:text-white lg:flex"
      >
        <Keyboard className="h-4 w-4" />
        <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          Press ?
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
              className="fixed inset-0 z-[71] flex items-center justify-center p-4"
              onClick={close}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0e1220] to-[#050710] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/80">
                      <Keyboard className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-lg leading-none text-white">
                        Keyboard shortcuts
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                        Fast-travel the portfolio
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="rounded-md border border-white/10 bg-white/[0.02] p-1.5 text-muted transition-colors hover:border-white/30 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Groups */}
                <div className="max-h-[70vh] overflow-y-auto p-6">
                  <div className="space-y-6">
                    {shortcuts.map((group) => (
                      <div key={group.group}>
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">
                          {group.group}
                        </p>
                        <ul className="space-y-1.5">
                          {group.items.map((s) => (
                            <li
                              key={s.label}
                              className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-white/10 hover:bg-white/[0.02]"
                            >
                              <span className="text-sm text-foreground/90">
                                {s.label}
                              </span>
                              <div className="flex items-center gap-1">
                                {s.keys.map((k, i) => (
                                  <span key={i} className="flex items-center gap-1">
                                    {i > 0 && (
                                      <span className="font-mono text-[9px] text-muted">
                                        then
                                      </span>
                                    )}
                                    <kbd className="rounded-md border border-white/15 bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] font-medium text-foreground shadow-[inset_0_-1px_0_rgba(0,0,0,0.5)]">
                                      {k}
                                    </kbd>
                                  </span>
                                ))}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/5 bg-black/30 px-6 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
                  Press{" "}
                  <kbd className="mx-1 rounded border border-white/15 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                    Esc
                  </kbd>{" "}
                  to close
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

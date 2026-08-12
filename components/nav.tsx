"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Mail, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import { Portrait } from "@/components/portrait";

/**
 * Track which section id is currently active by finding the last section
 * whose top edge has crossed a "sensor line" near the top of the viewport.
 * More reliable than IntersectionObserver for tall sections and works
 * cleanly with smooth-scroll libraries.
 */
function useActiveSection(sectionIds: string[]): string | null {
  const [active, setActive] = useState<string | null>(sectionIds[0] ?? null);
  const key = sectionIds.join(",");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;

    const compute = () => {
      // Sensor line ~28% down from the top of the viewport
      const sensor = window.scrollY + window.innerHeight * 0.28;
      // Also handle bottom-of-page: if we're near the bottom, force last section
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40;

      if (nearBottom) {
        setActive(sectionIds[sectionIds.length - 1] ?? null);
        return;
      }

      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= sensor) current = id;
      }
      setActive(current ?? sectionIds[0] ?? null);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        compute();
        raf = 0;
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key, sectionIds]);

  return active;
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, c } = useLocale();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const links = useMemo(
    () => [
      { href: "#journey", id: "journey", label: c.ui.nav.journey },
      { href: "#about", id: "about", label: c.ui.nav.about },
      { href: "#skills", id: "skills", label: c.ui.nav.skills },
      { href: "#projects", id: "projects", label: c.ui.nav.projects },
      { href: "#experience", id: "experience", label: c.ui.nav.experience },
      { href: "#contact", id: "contact", label: c.ui.nav.contact },
    ],
    [c.ui.nav],
  );

  const sectionIds = useMemo(() => links.map((l) => l.id), [links]);
  const activeId = useActiveSection(sectionIds);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ease-out",
          scrolled
            ? "border-b border-white/5 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-black/25 backdrop-blur-[2px]",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-10">
          <a
            href="#top"
            className="group flex items-center gap-2 font-display text-lg tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-xl"
            onClick={() => setMobileOpen(false)}
          >
            <Portrait
              name={c.personal.name}
              size={26}
              className="transition-transform group-hover:scale-105"
            />
            {c.personal.name.split(" ")[0]}
            <span className="text-white/50">.</span>
          </a>

          <ul className="hidden items-center gap-1 text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] md:flex">
            {links.map((l) => {
              const isActive = activeId === l.id;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-white/75 hover:text-white",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 34,
                        }}
                      />
                    )}
                    <span
                      aria-hidden
                      className={cn(
                        "h-1 w-1 rounded-full transition-all",
                        isActive
                          ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                          : "bg-white/0",
                      )}
                    />
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <LangSwitch locale={locale} setLocale={setLocale} />
            <a
              href={`mailto:${c.personal.email}`}
              className="hidden rounded-full border border-white/25 bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-black/60 sm:inline-block"
            >
              {c.ui.nav.cta}
            </a>
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-black/60 md:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            links={links}
            activeId={activeId}
            close={() => setMobileOpen(false)}
            email={c.personal.email}
            cta={c.ui.nav.cta}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({
  links,
  activeId,
  close,
  email,
  cta,
}: {
  links: { href: string; id: string; label: string }[];
  activeId: string | null;
  close: () => void;
  email: string;
  cta: string;
}) {
  return (
    <>
      <motion.div
        key="mobile-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={close}
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
        aria-hidden
      />
      <motion.div
        key="mobile-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-x-0 top-[64px] z-40 mx-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e1220] to-[#050710] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] md:hidden"
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(125,211,252,0.6) 0%, transparent 70%)",
          }}
        />

        <nav className="relative p-4">
          <ul className="space-y-1">
            {links.map((l, i) => {
              const isActive = activeId === l.id;
              return (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.04 }}
                >
                  <a
                    href={l.href}
                    onClick={close}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group flex items-center justify-between rounded-xl border px-4 py-4 transition-all",
                      isActive
                        ? "border-white/15 bg-white/[0.05]"
                        : "border-transparent hover:border-white/10 hover:bg-white/[0.03]",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-widest",
                          isActive ? "text-white" : "text-muted",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-2xl tracking-tight transition-colors",
                          isActive ? "text-white" : "text-foreground group-hover:text-white",
                        )}
                      >
                        {l.label}
                      </span>
                      {isActive && (
                        <span
                          aria-hidden
                          className="ml-1 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                        />
                      )}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                        isActive ? "text-white" : "text-white/30 group-hover:text-white/80",
                      )}
                    />
                  </a>
                </motion.li>
              );
            })}
          </ul>

          {/* Contact CTA */}
          <motion.a
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + links.length * 0.04 }}
            href={`mailto:${email}`}
            onClick={close}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-sm font-medium text-black transition-transform hover:scale-[1.01]"
          >
            <Mail className="h-4 w-4" />
            {cta}
          </motion.a>
        </nav>
      </motion.div>
    </>
  );
}

function GbFlag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <rect width="20" height="14" fill="#012169" />
      <path
        d="M0 0 L20 14 M20 0 L0 14"
        stroke="#ffffff"
        strokeWidth="2.8"
      />
      <path d="M0 0 L20 14 M20 0 L0 14" stroke="#C8102E" strokeWidth="1.1" />
      <path
        d="M10 0 V14 M0 7 H20"
        stroke="#ffffff"
        strokeWidth="4"
      />
      <path d="M10 0 V14 M0 7 H20" stroke="#C8102E" strokeWidth="2.2" />
    </svg>
  );
}

function SeFlag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <rect width="20" height="14" fill="#006AA7" />
      <rect x="6" width="2.6" height="14" fill="#FECC00" />
      <rect y="5.7" width="20" height="2.6" fill="#FECC00" />
    </svg>
  );
}

function LangSwitch({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  return (
    <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5">
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        className={cn(
          "relative z-10 flex h-7 w-9 items-center justify-center rounded-full transition-all",
          locale === "en" ? "ring-1 ring-white/50" : "opacity-60 hover:opacity-100",
        )}
      >
        <span className="block h-3.5 w-5 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.35)]">
          <GbFlag className="h-full w-full" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => setLocale("sv")}
        aria-label="Byt till svenska"
        aria-pressed={locale === "sv"}
        className={cn(
          "relative z-10 flex h-7 w-9 items-center justify-center rounded-full transition-all",
          locale === "sv" ? "ring-1 ring-white/50" : "opacity-60 hover:opacity-100",
        )}
      >
        <span className="block h-3.5 w-5 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.35)]">
          <SeFlag className="h-full w-full" />
        </span>
      </button>
      <span
        aria-hidden
        className="absolute top-0.5 bottom-0.5 z-0 rounded-full bg-white/10 transition-transform"
        style={{
          width: "calc(50% - 2px)",
          left: "2px",
          transform: locale === "en" ? "translateX(0)" : "translateX(100%)",
        }}
      />
    </div>
  );
}

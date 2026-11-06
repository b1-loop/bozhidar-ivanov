"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useContent, useLocale } from "@/lib/i18n";
import type { Reference } from "@/lib/content";
import { SectionBackdrop } from "@/components/section-backdrop";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function relationFor(role: string, company: string): {
  label: string;
  color: string;
} {
  const s = `${role} ${company}`.toLowerCase();
  if (s.includes("owner") || s.includes("consult") || s.includes("director"))
    return { label: "Employer", color: "#7dd3fc" };
  if (s.includes("manager") || s.includes("lead"))
    return { label: "Manager", color: "#fbbf24" };
  if (s.includes("developer") || s.includes("engineer"))
    return { label: "Colleague", color: "#a78bfa" };
  return { label: "Reference", color: "#94a3b8" };
}

const REF_COPY = {
  en: {
    description: "Words from people I've worked closely with — across engineering, leadership and production.",
    prev: "Previous reference",
    next: "Next reference",
    choose: "Choose a reference",
  },
  sv: {
    description: "Ord från personer jag har jobbat nära — inom utveckling, ledarskap och produktion.",
    prev: "Föregående referens",
    next: "Nästa referens",
    choose: "Välj en referens",
  },
} as const;

const AUTO_MS = 8000;

export function References() {
  const c = useContent();
  const { locale } = useLocale();
  const t = REF_COPY[locale];
  const refs = c.references;
  const reduce = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = useCallback(
    (to: number) => {
      const n = (to + refs.length) % refs.length;
      setDir(to > index || (index === refs.length - 1 && n === 0) ? 1 : -1);
      setIndex(n);
    },
    [index, refs.length],
  );

  // Gentle auto-advance; pauses while the visitor is reading (hover / focus)
  useEffect(() => {
    if (paused || reduce || refs.length < 2) return;
    const id = window.setTimeout(() => go(index + 1), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, reduce, refs.length, go]);

  const r = refs[index];
  const rel = relationFor(r.role, r.company);

  return (
    <section id="references" className="relative overflow-hidden py-24 md:py-32">
      <SectionBackdrop variant="references" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:px-10 lg:grid-cols-12 lg:gap-14">
        {/* ---------------- Heading + people (the tabs) ---------------- */}
        <div className="lg:col-span-5">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">{c.ui.references.section}</p>
          <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl">
            {c.ui.references.title1}
            <br />
            <span className="italic text-muted">{c.ui.references.title2}</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-muted">{t.description}</p>

          <div role="tablist" aria-label={t.choose} className="mt-8 hidden flex-col gap-2 lg:flex">
            {refs.map((p, i) => (
              <PersonTab
                key={p.name}
                person={p}
                active={i === index}
                onSelect={() => go(i)}
                onKey={(k) => {
                  const n = k === "next" ? (i + 1) % refs.length : (i - 1 + refs.length) % refs.length;
                  go(n);
                  tabRefs.current[n]?.focus();
                }}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>

        {/* ---------------- One quote at a time ---------------- */}
        <div
          className="lg:col-span-7 lg:pt-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            role="tabpanel"
            aria-live="polite"
            className="relative touch-pan-y select-none"
            onPointerDown={(e) => {
              swipe.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const s = swipe.current;
              swipe.current = null;
              if (!s) return;
              const dx = e.clientX - s.x;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.3) go(index + (dx < 0 ? 1 : -1));
            }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-7 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl transition-colors duration-500"
                style={{ background: `radial-gradient(circle, ${rel.color} 0%, transparent 70%)` }}
              />
              <span aria-hidden className="pointer-events-none absolute left-6 top-2 font-display text-[120px] leading-none text-white/[0.06] sm:text-[160px]">
                “
              </span>

              <div className="relative min-h-[230px] sm:min-h-[210px]">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.figure
                    key={r.name}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span
                      className="inline-block rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest"
                      style={{ borderColor: `${rel.color}55`, color: rel.color, background: `${rel.color}10` }}
                    >
                      {rel.label}
                    </span>
                    <blockquote className="mt-5 font-display text-2xl italic leading-snug tracking-tight text-white sm:text-3xl md:text-[2.1rem]">
                      {r.quote}
                    </blockquote>
                    <figcaption className="mt-7 flex items-center gap-3">
                      <Avatar name={r.name} color={rel.color} />
                      <span>
                        <span className="block text-sm font-medium text-white">{r.name}</span>
                        <span className="block text-xs text-muted">
                          {r.role} · {r.company}
                        </span>
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              {/* progress / controls */}
              <div className="relative mt-8 flex items-center gap-4">
                <div className="flex flex-1 gap-1.5">
                  {refs.map((p, i) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`${p.name}`}
                      className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10"
                    >
                      {i === index && (
                        <motion.span
                          key={`${index}-${paused}`}
                          className="absolute inset-y-0 left-0 rounded-full bg-white/70"
                          initial={{ width: paused || reduce ? "100%" : "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: paused || reduce ? 0 : AUTO_MS / 1000, ease: "linear" }}
                        />
                      )}
                      {i < index && <span className="absolute inset-0 rounded-full bg-white/35" />}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label={t.prev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label={t.next}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* people row on phones / tablets */}
          <div className="mt-4 flex justify-center gap-3 lg:hidden">
            {refs.map((p, i) => {
              const pr = relationFor(p.role, p.company);
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={p.name}
                  aria-pressed={i === index}
                  className={`rounded-full p-0.5 transition-all ${i === index ? "ring-2 ring-white/70" : "opacity-50"}`}
                >
                  <Avatar name={p.name} color={pr.color} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base text-white"
      style={{ background: `linear-gradient(135deg, ${color}cc, ${color}44)`, boxShadow: `0 0 0 1px ${color}55` }}
    >
      {initials(name)}
    </span>
  );
}

function PersonTab({
  person,
  active,
  onSelect,
  onKey,
  ref,
}: {
  person: Reference;
  active: boolean;
  onSelect: () => void;
  onKey: (k: "next" | "prev") => void;
  ref: (el: HTMLButtonElement | null) => void;
}) {
  const rel = relationFor(person.role, person.company);
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          onKey("next");
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          onKey("prev");
        }
      }}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all ${
        active ? "border-white/20 bg-white/[0.06]" : "border-transparent hover:bg-white/[0.03]"
      }`}
    >
      <Avatar name={person.name} color={rel.color} />
      <span className="min-w-0">
        <span className={`block truncate text-sm font-medium ${active ? "text-white" : "text-white/70"}`}>{person.name}</span>
        <span className="block truncate text-xs text-muted">
          {person.role} · {person.company}
        </span>
      </span>
    </button>
  );
}

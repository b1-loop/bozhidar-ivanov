"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent, useLocale } from "@/lib/i18n";
import { SectionBackdrop } from "@/components/section-backdrop";

const COCKPIT_COPY = {
  en: { avionics: "BI-2026 Avionics", mfd: "MFD", checklist: "Checklist", tools: "items", choose: "Skill systems", complete: "Checklist complete", learning: "In prog", page: "Page" },
  sv: { avionics: "BI-2026 Avionics", mfd: "MFD", checklist: "Checklista", tools: "punkter", choose: "Kompetensområden", complete: "Checklista klar", learning: "Pågår", page: "Sida" },
} as const;

/* A physical bezel key: rubber-capped, backlit when its system is selected */
function BezelKey({
  active,
  onClick,
  label,
  id,
  onKeyDown,
  refCb,
  wide = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  id: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  refCb: (el: HTMLButtonElement | null) => void;
  wide?: boolean;
}) {
  return (
    <button
      ref={refCb}
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls="skill-panel"
      aria-label={label}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`relative shrink-0 rounded-[5px] border border-black/70 bg-[linear-gradient(to_bottom,#3b3f45,#26292e)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_0_#0b0c0e,0_3px_6px_rgba(0,0,0,0.6)] outline-none transition-all active:translate-y-[2px] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_#0b0c0e] focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
        wide ? "h-11 w-full px-1.5" : "h-9 w-12"
      }`}
    >
      {/* backlit bar */}
      <span
        aria-hidden
        className={`absolute left-1/2 top-1.5 h-[3px] w-6 -translate-x-1/2 rounded-full transition-all ${
          active ? "bg-cyan-300 shadow-[0_0_8px_2px_rgba(103,232,249,0.7)]" : "bg-black/50"
        }`}
      />
      {wide && (
        <span className={`relative mt-1.5 block truncate font-mono text-[9px] uppercase tracking-[0.06em] ${active ? "text-cyan-200" : "text-white/65"}`}>
          {label}
        </span>
      )}
    </button>
  );
}

function Screw({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_30%,#8b9097,#3d4146_70%)] shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.08)] ${className}`}
    >
      <span className="absolute left-1/2 top-1/2 h-[1.5px] w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/60" />
    </span>
  );
}

function Knob({ label }: { label: string }) {
  return (
    <span className="flex flex-col items-center gap-1.5" aria-hidden>
      <span className="relative h-9 w-9 rounded-full bg-[conic-gradient(from_0deg,#4a4e54,#2a2d31,#4a4e54,#2a2d31,#4a4e54)] shadow-[0_3px_6px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)]">
        <span className="absolute inset-[5px] rounded-full bg-[radial-gradient(circle_at_40%_35%,#3a3e44,#1d1f22)]" />
        <span className="absolute left-1/2 top-[6px] h-2.5 w-[2px] -translate-x-1/2 rounded bg-white/70" />
      </span>
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">{label}</span>
    </span>
  );
}

export function Skills() {
  const c = useContent();
  const { locale } = useLocale();
  const t = COCKPIT_COPY[locale];
  const groups = c.skills;
  const [selected, setSelected] = useState(0);
  const deskRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = groups[Math.min(selected, groups.length - 1)];
  const half = Math.ceil(groups.length / 2);
  const leftIdx = groups.map((_, i) => i).slice(0, half);
  const rightIdx = groups.map((_, i) => i).slice(half);

  const move = (to: number) => {
    const n = (to + groups.length) % groups.length;
    setSelected(n);
    const el = [deskRefs.current[n], mobRefs.current[n]].find((b) => b && b.offsetParent !== null);
    el?.focus({ preventScroll: true });
  };
  const keyNav = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      move(i + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      move(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(groups.length - 1);
    }
  };

  // Screen-edge label next to a bezel key (line-select style); inverted when selected
  const EdgeLabel = ({ i, side }: { i: number; side: "left" | "right" }) => {
    const active = i === selected;
    return (
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => setSelected(i)}
        className={`flex h-9 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
          side === "left" ? "justify-start pl-1" : "justify-end pr-1"
        } ${active ? "bg-cyan-300 text-black" : "text-cyan-200/80 hover:text-cyan-100"}`}
      >
        {side === "left" && <span className={active ? "" : "text-cyan-300/60"}>◂</span>}
        <span className="truncate">{groups[i].category}</span>
        {side === "right" && <span className={active ? "" : "text-cyan-300/60"}>▸</span>}
      </button>
    );
  };

  return (
    <section id="skills" className="relative overflow-hidden py-24 md:py-32">
      <SectionBackdrop variant="skills" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">{c.ui.skills.section}</p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.skills.title1}
              <br />
              <span className="italic text-muted">{c.ui.skills.title2}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <p className="text-lg text-muted">{c.ui.skills.description}</p>
          </div>
        </div>

        {/* ================= Instrument panel ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[22px] bg-[linear-gradient(170deg,#34383d_0%,#25282c_45%,#1b1d20_100%)] p-3 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-2px_0_rgba(0,0,0,0.5)] sm:p-5"
        >
          <div className="noise rounded-[22px] opacity-30" />
          <Screw className="left-3 top-3" />
          <Screw className="right-3 top-3" />
          <Screw className="bottom-3 left-3" />
          <Screw className="bottom-3 right-3" />

          {/* panel label */}
          <div className="relative mb-3 flex items-center justify-between px-5 sm:px-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/45">{t.avionics}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/45">{t.mfd} · 1</span>
          </div>

          {/* keys row on phones / tablets */}
          <div
            role="tablist"
            aria-label={t.choose}
            className="relative mb-3 grid grid-cols-3 gap-2 px-1 pb-1 pt-0.5 sm:grid-cols-5 lg:hidden"
          >
            {groups.map((g, i) => (
              <BezelKey
                key={g.category}
                wide
                id={`skill-tab-m-${i}`}
                active={i === selected}
                label={g.category}
                onClick={() => setSelected(i)}
                onKeyDown={keyNav(i)}
                refCb={(el) => {
                  mobRefs.current[i] = el;
                }}
              />
            ))}
          </div>

          {/* MFD: bezel keys | screen | bezel keys */}
          <div className="relative grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[56px_1fr_56px]">
            {/* bezel column (keys are pinned to their screen labels below) */}
            <div aria-hidden className="hidden lg:block" />

            {/* the glass */}
            <div className="rounded-xl bg-[#0a0b0d] p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.06)] sm:p-2.5">
              <div
                id="skill-panel"
                role="tabpanel"
                aria-labelledby={`skill-tab-${selected}`}
                className="relative min-h-[380px] rounded-md bg-[radial-gradient(120%_90%_at_50%_0%,#0d1418_0%,#05080a_60%,#030405_100%)] font-mono"
              >
                {/* glass reflection + scanlines */}
                <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(125deg,rgba(255,255,255,0.06)_0%,transparent_28%)]" />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-[0.07] [background:repeating-linear-gradient(to_bottom,#fff_0_1px,transparent_1px_3px)]" />

                {/* screen status bar */}
                <div className="flex items-center justify-between border-b border-cyan-400/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em]">
                  <span className="text-emerald-300">{t.checklist}</span>
                  <span className="text-white/50">
                    {t.page} <span className="text-white">{String(selected + 1).padStart(2, "0")}</span>/{String(groups.length).padStart(2, "0")}
                  </span>
                  <span className="hidden text-fuchsia-300 sm:inline">FL350 · GS 480</span>
                </div>

                <div className="grid lg:grid-cols-[150px_1fr_150px]">
                  {/* left line-select labels */}
                  <div role="tablist" aria-label={t.choose} aria-orientation="vertical" className="hidden flex-col justify-around border-r border-cyan-400/10 py-10 lg:flex">
                    {leftIdx.map((i) => (
                      <div key={i} className="relative">
                        <EdgeLabel i={i} side="left" />
                        {/* the physical key, level with its label: 10px glass + 12px gap + 4px inset */}
                        <span className="absolute top-0 -left-[74px]">
                          <BezelKey
                            id={`skill-tab-${i}`}
                            active={i === selected}
                            label={groups[i].category}
                            onClick={() => setSelected(i)}
                            onKeyDown={keyNav(i)}
                            refCb={(el) => {
                              deskRefs.current[i] = el;
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* checklist */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={group.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="px-4 py-4 sm:px-6"
                    >
                      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
                        <h3 className="text-base uppercase tracking-[0.18em] text-white sm:text-lg">{group.category}</h3>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-cyan-300/80">
                          {group.items.length} {t.tools}
                        </span>
                      </div>
                      <ul className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                        {group.items.map((item, i) => (
                          <li
                            key={item}
                            // CSS stagger (one keyframe) instead of a motion component per row
                            style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}
                            className="mfd-row flex items-baseline gap-2 text-[11px] uppercase tracking-[0.06em] text-white/90 sm:text-xs"
                          >
                            <span className="min-w-0 break-words">{item}</span>
                            <span aria-hidden className="mb-[3px] min-w-4 flex-1 border-b border-dotted border-white/20" />
                            <span className="text-emerald-300">✓</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">■ {t.complete}</p>
                    </motion.div>
                  </AnimatePresence>

                  {/* right line-select labels */}
                  <div role="tablist" aria-label={t.choose} aria-orientation="vertical" className="hidden flex-col justify-around border-l border-cyan-400/10 py-10 lg:flex">
                    {rightIdx.map((i) => (
                      <div key={i} className="relative">
                        <EdgeLabel i={i} side="right" />
                        {/* the physical key, level with its label: 10px glass + 12px gap + 4px inset */}
                        <span className="absolute top-0 -right-[74px]">
                          <BezelKey
                            id={`skill-tab-${i}`}
                            active={i === selected}
                            label={groups[i].category}
                            onClick={() => setSelected(i)}
                            onKeyDown={keyNav(i)}
                            refCb={(el) => {
                              deskRefs.current[i] = el;
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div aria-hidden className="hidden lg:block" />
          </div>

          {/* annunciators (currently learning) + knobs */}
          <div className="relative mt-4 flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/45">{c.ui.skills.learning}</span>
              {c.learning.map((l) => (
                <span
                  key={l}
                  className="rounded-[3px] border border-amber-900/80 bg-[linear-gradient(to_bottom,#3a2a0a,#241a06)] px-2.5 py-1 text-center font-mono text-[9px] uppercase leading-tight tracking-[0.12em] text-amber-300 shadow-[inset_0_0_8px_rgba(251,191,36,0.25),0_0_10px_rgba(251,191,36,0.12)]"
                >
                  {l}
                  <span className="block text-[7px] text-amber-400/70">{t.learning}</span>
                </span>
              ))}
            </div>
            <div className="hidden items-end gap-5 sm:flex">
              <Knob label="Brt" />
              <Knob label="Range" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

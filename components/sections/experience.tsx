"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Plane } from "lucide-react";
import { useContent, useLocale } from "@/lib/i18n";
import type { Experience as ExperienceItem } from "@/lib/content";
import { AnimatedNumber } from "@/components/animated-number";
import { SectionBackdrop } from "@/components/section-backdrop";

function isCurrent(period: string) {
  return /now|nu|present|nuvarande/i.test(period);
}

function inferCategory(role: string, company: string): {
  label: string;
  color: string;
} {
  const s = `${role} ${company}`.toLowerCase();
  if (s.includes("dev") || s.includes("stack") || s.includes("code"))
    return { label: "Development", color: "#7dd3fc" };
  if (s.includes("lead") || s.includes("project") || s.includes("manager"))
    return { label: "Leadership", color: "#a78bfa" };
  if (s.includes("ceo") || s.includes("founder") || s.includes("owner"))
    return { label: "Business", color: "#fbbf24" };
  if (s.includes("board") || s.includes("director") || s.includes("deputy"))
    return { label: "Governance", color: "#f472b6" };
  if (s.includes("operator") || s.includes("volvo") || s.includes("machine"))
    return { label: "Operations", color: "#34d399" };
  return { label: "Experience", color: "#94a3b8" };
}

const BOARD_COPY = {
  en: {
    departures: "Departures",
    time: "Time",
    destination: "Destination",
    flight: "Flight",
    status: "Status",
    active: "Active",
    landed: "Landed",
    boarding: "Boarding",
    training: "Training",
    gate: "Gate info",
    hint: "Select a departure",
  },
  sv: {
    departures: "Avgångar",
    time: "Tid",
    destination: "Destination",
    flight: "Flyg",
    status: "Status",
    active: "Aktiv",
    landed: "Landat",
    boarding: "Boarding",
    training: "Utbildning",
    gate: "Gate-info",
    hint: "Välj en avgång",
  },
} as const;

type Row =
  | { kind: "job"; id: string; time: string; destination: string; flight: string; status: "active" | "landed"; item: ExperienceItem }
  | { kind: "edu"; id: string; time: string; destination: string; flight: string; status: "boarding" };

/* Split-flap text: characters spin through random glyphs, then settle left → right */
const FLAP_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function Flap({ text, start, delay = 0, className }: { text: string; start: boolean; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  // the scrambled frame while animating; null = show the real text
  const [frameText, setFrameText] = useState<string | null>(null);
  useEffect(() => {
    if (!start || reduce) return;
    let frame = 0;
    const settleAt = (i: number) => Math.round(delay / 40) + 6 + i * 1.2;
    const id = window.setInterval(() => {
      frame++;
      let done = true;
      const next = text
        .split("")
        .map((ch, i) => {
          if (ch === " " || frame >= settleAt(i)) return ch;
          done = false;
          return FLAP_GLYPHS[(Math.random() * FLAP_GLYPHS.length) | 0];
        })
        .join("");
      setFrameText(done ? null : next);
      if (done) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [start, text, delay, reduce]);
  return <span className={className}>{frameText ?? text}</span>;
}

function useStockholmClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Experience() {
  const c = useContent();
  const { locale } = useLocale();
  const t = BOARD_COPY[locale];
  const boardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boardRef, { once: true, margin: "-80px" });
  const clock = useStockholmClock();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentRoles = c.experience.filter((e) => isCurrent(e.period)).length;
  const totalRoles = c.experience.length;

  const rows: Row[] = [
    ...c.experience.map((e, i) => ({
      kind: "job" as const,
      id: `job-${i}`,
      time: e.period.toUpperCase(),
      destination: e.company.toUpperCase(),
      flight: e.role.toUpperCase(),
      status: isCurrent(e.period) ? ("active" as const) : ("landed" as const),
      item: e,
    })),
    {
      kind: "edu" as const,
      id: "edu",
      time: t.training.toUpperCase(),
      destination: c.education.school.toUpperCase(),
      flight: c.education.program.toUpperCase(),
      status: "boarding" as const,
    },
  ];

  const [selected, setSelected] = useState(0);
  const row = rows[Math.min(selected, rows.length - 1)];

  const move = (to: number) => {
    const n = (to + rows.length) % rows.length;
    setSelected(n);
    tabRefs.current[n]?.focus();
  };

  const statusLabel = (s: Row["status"]) => (s === "active" ? t.active : s === "landed" ? t.landed : t.boarding);
  const statusClass = (s: Row["status"]) =>
    s === "active" ? "text-emerald-300" : s === "landed" ? "text-white/40" : "text-amber-300";

  return (
    <section id="experience" className="relative overflow-hidden py-32">
      <SectionBackdrop variant="experience" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">{c.ui.experience.section}</p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.experience.title1}
              <br />
              <span className="italic text-muted">{c.ui.experience.title2}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <StatsPanel currentRoles={currentRoles} totalRoles={totalRoles} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ---------------- Departure board (the tabs) ---------------- */}
          <motion.div
            ref={boardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#07090d] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] lg:col-span-7"
          >
            {/* board header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0b0e14] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-400 text-black">
                  <Plane className="h-4 w-4 -rotate-45" />
                </span>
                <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">{t.departures}</span>
              </div>
              <span className="rounded-md bg-black/60 px-2 py-1 font-mono text-sm tabular-nums tracking-widest text-amber-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                {clock}
              </span>
            </div>

            {/* column labels */}
            <div className="grid grid-cols-[92px_1fr_auto] gap-3 border-b border-white/5 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35 sm:grid-cols-[118px_1fr_1fr_96px] sm:px-5">
              <span>{t.time}</span>
              <span>{t.destination}</span>
              <span className="hidden sm:block">{t.flight}</span>
              <span className="text-right">{t.status}</span>
            </div>

            {/* rows */}
            <div role="tablist" aria-orientation="vertical" aria-label={t.departures}>
              {rows.map((r, i) => {
                const active = i === selected;
                return (
                  <button
                    key={r.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`exp-tab-${r.id}`}
                    aria-selected={active}
                    aria-controls="exp-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => setSelected(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        move(i + 1);
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        move(i - 1);
                      } else if (e.key === "Home") {
                        e.preventDefault();
                        move(0);
                      } else if (e.key === "End") {
                        e.preventDefault();
                        move(rows.length - 1);
                      }
                    }}
                    className={`group relative grid w-full grid-cols-[92px_1fr_auto] items-center gap-3 border-b border-white/[0.04] px-4 py-3.5 text-left font-mono outline-none transition-colors last:border-b-0 focus-visible:bg-white/[0.06] sm:grid-cols-[118px_1fr_1fr_96px] sm:px-5 ${
                      active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* selected indicator */}
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-[3px] bg-amber-400 transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
                    />
                    <Flap
                      text={r.time}
                      start={inView}
                      delay={i * 90}
                      className="truncate text-[11px] tabular-nums tracking-[0.12em] text-amber-200/90 sm:text-xs"
                    />
                    <span className="min-w-0">
                      <Flap
                        text={r.destination}
                        start={inView}
                        delay={i * 90 + 60}
                        className="block truncate text-xs tracking-[0.12em] text-white sm:text-[13px]"
                      />
                      {/* on phones the flight sits under the destination */}
                      <span className="mt-0.5 block truncate text-[10px] tracking-[0.12em] text-white/45 sm:hidden">{r.flight}</span>
                    </span>
                    <Flap
                      text={r.flight}
                      start={inView}
                      delay={i * 90 + 120}
                      className="hidden truncate text-xs tracking-[0.1em] text-white/60 sm:block"
                    />
                    <span className={`flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-[0.18em] sm:text-[11px] ${statusClass(r.status)}`}>
                      {r.status !== "landed" && (
                        <span className={`h-1.5 w-1.5 rounded-full ${r.status === "active" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
                      )}
                      {statusLabel(r.status)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ---------------- Gate info (the tab panel) ---------------- */}
          <div
            id="exp-panel"
            role="tabpanel"
            aria-labelledby={`exp-tab-${row.id}`}
            className="lg:col-span-5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {row.kind === "job" ? (
                  <GateInfo item={row.item} gateLabel={t.gate} statusText={statusLabel(row.status)} statusCls={statusClass(row.status)} index={selected} />
                ) : (
                  <EducationCard label={c.ui.experience.educationLabel} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function GateInfo({
  item,
  gateLabel,
  statusText,
  statusCls,
  index,
}: {
  item: ExperienceItem;
  gateLabel: string;
  statusText: string;
  statusCls: string;
  index: number;
}) {
  const cat = inferCategory(item.role, item.company);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, ${cat.color} 0%, transparent 70%)` }}
      />
      <div className="relative">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            ✈ {gateLabel} · BI-{String(index + 1).padStart(2, "0")}
          </span>
          <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${statusCls}`}>● {statusText}</span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">{item.period}</span>
          <span
            className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
            style={{ borderColor: `${cat.color}55`, color: cat.color, background: `${cat.color}10` }}
          >
            {cat.label}
          </span>
        </div>

        <h3 className="font-display text-3xl leading-tight tracking-tight text-white md:text-4xl">{item.role}</h3>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted">
          <span className="h-px w-6 bg-white/20" />
          {item.company}
        </p>

        <ul className="mt-6 space-y-2.5 text-sm text-muted">
          {item.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: cat.color, opacity: 0.8 }} />
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatsPanel({
  currentRoles,
  totalRoles,
}: {
  currentRoles: number;
  totalRoles: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-3 gap-2 sm:gap-3"
    >
      <StatItem value={8} suffix="+" label="Years" hint="in the workforce" />
      <StatItem value={totalRoles} label="Roles" hint="held to date" />
      <StatItem
        value={currentRoles}
        label="Active"
        hint="right now"
        accent
      />
    </motion.div>
  );
}

function StatItem({
  value,
  suffix,
  label,
  hint,
  accent,
}: {
  value: number;
  suffix?: string;
  label: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4 ${
        accent ? "ring-1 ring-emerald-500/20" : ""
      }`}
    >
      {accent && (
        <span className="absolute right-2 top-2 flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      )}
      <div className="font-display text-2xl leading-none tracking-tighter text-foreground sm:text-3xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </div>
      <div className="mt-0.5 hidden text-[10px] text-muted/70 sm:block">
        {hint}
      </div>
    </div>
  );
}

function EducationCard({ label }: { label: string }) {
  const c = useContent();
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-6 md:p-8">
        {/* Accent orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #7dd3fc 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/80"
              >
                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
                <path d="M22 10v6" />
              </svg>
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {label}
            </p>
          </div>

          <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground md:text-3xl">
            {c.education.school}
          </h3>
          <p className="mt-1 text-sm text-muted">{c.education.program}</p>

          {/* Progress hint */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>Program</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: "72%" }}
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              Coursework
            </p>
            <div className="flex flex-wrap gap-1.5">
              {c.education.courses.map((course) => (
                <span
                  key={course}
                  className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-[11px] text-muted"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

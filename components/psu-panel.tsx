"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent, useLocale } from "@/lib/i18n";
import { OPEN_BOT_EVENT } from "@/components/ai-bot";

/**
 * Passenger Service Unit — the overhead panel above an airplane seat, remixed
 * for the portfolio: call button → ask B1, reading lights → CV / projects,
 * the seatbelt sign → "Available for hire", no-smoking → "No bugs", and an
 * air vent that blows fresh ideas.
 */

const COPY = {
  en: {
    panel: "Cabin controls",
    call: "Ask B1",
    callHint: "Call the cabin crew — my AI assistant answers",
    cv: "CV",
    cvHint: "Reading light: open my CV",
    projects: "Work",
    projectsHint: "Reading light: show my projects",
    vent: "Air vent",
    ventHint: "Twist the air vent",
    ventOn: "Fresh ideas: ON",
    ventOff: "Fresh ideas: always on",
    available: "Available for hire",
    noBugs: "No bugs",
  },
  sv: {
    panel: "Kabinpanel",
    call: "Fråga B1",
    callHint: "Ring på kabinpersonalen — min AI-assistent svarar",
    cv: "CV",
    cvHint: "Läslampa: öppna mitt CV",
    projects: "Projekt",
    projectsHint: "Läslampa: visa mina projekt",
    vent: "Luftmunstycke",
    ventHint: "Vrid på luften",
    ventOn: "Friska idéer: PÅ",
    ventOff: "Friska idéer: alltid på",
    available: "Tillgänglig för jobb",
    noBugs: "Inga buggar",
  },
} as const;

/* Two-tone cabin chime, synthesised (no audio file), only ever on a click. */
let audioCtx: AudioContext | null = null;
function chime(high = 1320, low = 990) {
  // Creating an AudioContext is slow (~25 ms on a mid phone). Do it after the
  // click has painted so the button reacts instantly; the user-gesture
  // activation is still valid a frame later.
  window.setTimeout(() => playChime(high, low), 0);
}
function playChime(high: number, low: number) {
  try {
    audioCtx ??= new AudioContext();
    const ctx = audioCtx;
    const now = ctx.currentTime;
    [high, low].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + i * 0.32;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1);
    });
  } catch {}
}

function Tip({ text, show, align = "center" }: { text: string; show: boolean; align?: "center" | "start" | "end" }) {
  const pos =
    align === "end"
      ? "right-0"
      : align === "start"
        ? "left-0"
        : "left-1/2 -translate-x-1/2";
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className={`pointer-events-none absolute top-full z-40 mt-2.5 w-max max-w-[min(70vw,320px)] rounded-md border border-white/10 bg-black/85 px-2.5 py-1 text-center font-mono text-[10px] uppercase leading-snug tracking-[0.15em] text-white/90 shadow-lg ${pos}`}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function PanelButton({
  label,
  hint,
  onClick,
  active,
  children,
  accent = "amber",
  align = "center",
}: {
  label: string;
  hint: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  accent?: "amber" | "sky";
  align?: "center" | "start" | "end";
}) {
  const [hover, setHover] = useState(false);
  const glow =
    accent === "sky"
      ? "shadow-[0_0_14px_2px_rgba(125,211,252,0.55)] border-sky-300/60"
      : "shadow-[0_0_14px_2px_rgba(251,191,36,0.55)] border-amber-300/60";
  return (
    <span className="relative flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={hint}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border bg-gradient-to-b sm:h-8 sm:w-8 from-[#3a3f45] to-[#24282d] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.5)] outline-none transition-all duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 active:translate-y-px active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
          active ? glow : "border-white/10"
        }`}
      >
        {children}
      </button>
      <span className="hidden font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 sm:block">{label}</span>
      <Tip text={hint} show={hover} align={align} />
    </span>
  );
}

export function PsuPanel() {
  const c = useContent();
  const { locale } = useLocale();
  const t = COPY[locale];

  const [signsOn, setSignsOn] = useState(false);
  const [light, setLight] = useState<null | "cv" | "projects">(null);
  const [callLit, setCallLit] = useState(false);
  const [vent, setVent] = useState(0);
  const [ventTip, setVentTip] = useState<string | null>(null);
  const [signTip, setSignTip] = useState<null | "available" | "bugs">(null);
  const timers = useRef<number[]>([]);

  // Signs flicker on shortly after the page "lands"
  useEffect(() => {
    const id = window.setTimeout(() => setSignsOn(true), 1400);
    const pending = timers.current;
    return () => {
      window.clearTimeout(id);
      pending.forEach((x) => window.clearTimeout(x));
    };
  }, []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const readingLight = (which: "cv" | "projects") => {
    chime(1568, 1568);
    setLight(which);
    later(() => {
      if (which === "cv") window.open(c.personal.cv, "_blank", "noopener,noreferrer");
      else document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }, 650);
    later(() => setLight(null), 2200);
  };

  const call = () => {
    chime();
    setCallLit(true);
    later(() => window.dispatchEvent(new Event(OPEN_BOT_EVENT)), 450);
    later(() => setCallLit(false), 3000);
  };

  const flashTip = (which: "available" | "bugs") => {
    setSignTip(which);
    later(() => setSignTip((cur) => (cur === which ? null : cur)), 1800);
  };

  const twistVent = () => {
    const next = vent + 1;
    setVent(next);
    setVentTip(next % 2 ? t.ventOn : t.ventOff);
    later(() => setVentTip(null), 1800);
  };

  return (
    <div className="relative">
      {/* Reading-light cone falling onto the window */}
      <AnimatePresence>
        {light && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`pointer-events-none absolute top-full z-0 h-[70vh] w-[46vw] max-w-[520px] -translate-x-1/2 ${
              light === "cv" ? "left-[64%]" : "left-[76%]"
            }`}
            style={{
              background:
                "radial-gradient(60% 100% at 50% 0%, rgba(255,214,140,0.28) 0%, rgba(255,214,140,0.10) 45%, transparent 75%)",
              clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        role="toolbar"
        aria-label={t.panel}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-b from-[#2b3036]/95 to-[#1a1d21]/95 px-3 py-2 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:gap-4 sm:px-4"
      >
        {/* Air vent */}
        <span className="relative flex flex-col items-center gap-1">
          <button
            type="button"
            aria-label={t.ventHint}
            onClick={twistVent}
            className="relative flex h-10 w-10 items-center justify-center rounded-full sm:h-8 sm:w-8 bg-[radial-gradient(circle_at_35%_30%,#c9ced4,#6b7178_60%,#3a3e43)] shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <motion.span
              animate={{ rotate: vent * 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[radial-gradient(circle,#1a1d21_30%,#4b5056_32%,#2a2e33_60%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
            >
              <span className="h-[3px] w-4 rounded-full bg-[#7d838a]" />
            </motion.span>
          </button>
          <span className="hidden font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 sm:block">{t.vent.split(" ")[0]}</span>
          <Tip text={ventTip ?? ""} show={!!ventTip} align="start" />
        </span>

        <span className="h-7 w-px bg-white/10" />

        {/* Backlit signs — text is hidden on phones, so a tap shows it */}
        <div className="flex items-center gap-2">
          <span className="relative">
          <motion.button
            type="button"
            aria-label={t.available}
            onClick={() => flashTip("available")}
            className={`flex cursor-default items-center gap-1.5 rounded-md border px-2.5 py-2 font-mono sm:px-2 sm:py-1 outline-none focus-visible:ring-2 focus-visible:ring-white/40 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[10px] ${
              signsOn
                ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.35)]"
                : "border-white/10 bg-black/30 text-white/25"
            }`}
            animate={signsOn ? { opacity: [0.3, 1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 0.45, times: [0, 0.3, 0.55, 1] }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
            <span className="hidden sm:inline">{t.available}</span>
          </motion.button>
          <span className="sm:hidden"><Tip text={t.available} show={signTip === "available"} /></span>
          </span>
          <span className="relative">
          <motion.button
            type="button"
            aria-label={t.noBugs}
            onClick={() => flashTip("bugs")}
            className={`flex cursor-default items-center gap-1.5 rounded-md border px-2.5 py-2 font-mono sm:px-2 sm:py-1 outline-none focus-visible:ring-2 focus-visible:ring-white/40 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[10px] ${
              signsOn
                ? "border-amber-300/40 bg-amber-400/15 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.35)]"
                : "border-white/10 bg-black/30 text-white/25"
            }`}
            animate={signsOn ? { opacity: [0.3, 1, 0.6, 1] } : { opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.15, times: [0, 0.3, 0.55, 1] }}
          >
            {/* bug, struck through — the cabin's "no smoking" sign, reimagined */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="8" y="6" width="8" height="12" rx="4" />
              <path d="M12 6V4M8 10H4M16 10h4M8 14H4M16 14h4" />
              <path d="M3 3l18 18" />
            </svg>
            <span className="hidden sm:inline">{t.noBugs}</span>
          </motion.button>
          <span className="sm:hidden"><Tip text={t.noBugs} show={signTip === "bugs"} /></span>
          </span>
        </div>

        <span className="h-7 w-px bg-white/10" />

        {/* Reading lights */}
        <PanelButton label={t.cv} hint={t.cvHint} onClick={() => readingLight("cv")} active={light === "cv"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
          </svg>
        </PanelButton>
        <PanelButton
          label={t.projects}
          hint={t.projectsHint}
          onClick={() => readingLight("projects")}
          active={light === "projects"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
          </svg>
        </PanelButton>

        {/* Cabin-crew call → B1 */}
        <PanelButton label={t.call} hint={t.callHint} onClick={call} active={callLit} accent="sky" align="end">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="5" r="2.5" />
            <path d="M12 9v6M8 12l4-3 4 3M9 21l3-6 3 6" />
          </svg>
        </PanelButton>
      </motion.div>
    </div>
  );
}

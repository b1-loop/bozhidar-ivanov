"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Bell, Plane, X } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { INTRO_DONE_EVENT } from "@/components/boot-intro";

/**
 * The whole page as one flight:
 *  - a small flight instrument (ALT / SPD / phase) that descends as you scroll
 *    and touches down at the contact section — "Landed in Gothenburg"
 *  - PA announcements: the captain's welcome on the first scroll, a landing
 *    message, and "turbulence" when someone scrolls really fast
 */

const COPY = {
  en: {
    captainTitle: "Captain speaking",
    captain:
      "Welcome aboard flight BI-2026. Today we'll be cruising through .NET, AI agents and some very good projects. Sit back and enjoy the flight.",
    turbulenceTitle: "Turbulence",
    turbulence: "Please scroll responsibly and keep your seatbelt fastened.",
    landedTitle: "Landed in Gothenburg",
    landed: "Welcome to your destination — let's work together.",
    phases: { cruise: "Cruise", descent: "Descent", approach: "Approach", landed: "Landed" },
    close: "Close announcement",
  },
  sv: {
    captainTitle: "Kaptenen talar",
    captain:
      "Välkommen ombord på flyg BI-2026. Idag kryssar vi genom .NET, AI-agenter och några riktigt bra projekt. Luta dig tillbaka och njut av resan.",
    turbulenceTitle: "Turbulens",
    turbulence: "Skrolla försiktigt och ha säkerhetsbältet fastspänt.",
    landedTitle: "Landat i Göteborg",
    landed: "Välkommen till din destination — låt oss jobba tillsammans.",
    phases: { cruise: "Marschhöjd", descent: "Nedstigning", approach: "Inflygning", landed: "Landat" },
    close: "Stäng meddelandet",
  },
} as const;

type Kind = "captain" | "turbulence" | "landed";
const TURBULENCE_SPEED = 12000; // px/s — well above a brisk scroll (~7000 with Lenis)
const TURBULENCE_COOLDOWN = 25_000;

const fmt = (n: number) => n.toLocaleString("sv-SE").replace(/ /g, " ");

export function FlightExperience() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(false);
  const [flight, setFlight] = useState({ alt: 10700, spd: 850, p: 0 });
  const [landed, setLanded] = useState(false);
  const [notice, setNotice] = useState<Kind | null>(null);
  const [shaking, setShaking] = useState(false);
  // after touchdown the instrument steps aside so it doesn't cover the contact buttons
  const [parked, setParked] = useState(false);

  // Unknown until measured — Infinity keeps a not-yet-measured page at "cruise"
  // instead of reading every scroll position as "landed"
  const landingTop = useRef(Number.POSITIVE_INFINITY);
  // The flight starts once the boot intro has revealed the page (or right away if it was skipped)
  const ready = useRef(false);
  const announcedCaptain = useRef(false);
  const lastScroll = useRef({ y: 0, t: 0 });
  const lastTurbulence = useRef(-Infinity);
  // only the visitor's own wheel/touch scrolling counts — not nav-link or button jumps
  const lastUserInput = useRef(-Infinity);
  const announcedLanding = useRef(false);
  const hideTimer = useRef<number | undefined>(undefined);
  const parkTimer = useRef<number | undefined>(undefined);

  const announce = useCallback((kind: Kind, ms: number) => {
    setNotice(kind);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setNotice((cur) => (cur === kind ? null : cur)), ms);
  }, []);

  useEffect(() => {
    const start = () => {
      ready.current = true;
    };
    const skipped = document.documentElement.dataset.intro === "skip" || !document.querySelector(".boot-intro");
    let t: number | undefined;
    if (skipped) t = window.setTimeout(start, 300);
    window.addEventListener(INTRO_DONE_EVENT, start);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(INTRO_DONE_EVENT, start);
    };
  }, []);

  useEffect(() => {
    const mark = () => {
      lastUserInput.current = performance.now();
    };
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("touchmove", mark, { passive: true });
    return () => {
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchmove", mark);
    };
  }, []);

  // Where the "runway" is: the contact section
  useEffect(() => {
    const measure = () => {
      const contact = document.getElementById("contact");
      if (contact) landingTop.current = Math.max(1, contact.offsetTop - window.innerHeight * 0.35);
    };
    measure();
    window.addEventListener("resize", measure);
    const late = window.setTimeout(measure, 1500); // after fonts/images settle
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(late);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    // Ignore the browser's scroll restoration / the intro's jump to the top
    if (!ready.current) return;

    // --- flight instrument ---
    const p = Math.min(1, Math.max(0, y / landingTop.current));
    const alt = Math.round((10700 * Math.pow(1 - p, 1.15)) / 10) * 10;
    const spd = Math.round(p < 0.85 ? 850 - 590 * (p / 0.85) : 260 * ((1 - p) / 0.15));
    setFlight((f) => (f.alt === alt && f.spd === spd ? f : { alt, spd, p }));
    setVisible(y > window.innerHeight * 0.6);

    const isLanded = p >= 0.995;
    setLanded(isLanded);
    if (!isLanded) setParked(false);
    if (isLanded && !announcedLanding.current) {
      announcedLanding.current = true;
      announce("landed", 7000);
    }
    if (isLanded && !parkTimer.current) {
      parkTimer.current = window.setTimeout(() => {
        parkTimer.current = undefined;
        setParked(true);
      }, 5000);
    } else if (!isLanded && parkTimer.current) {
      window.clearTimeout(parkTimer.current);
      parkTimer.current = undefined;
    }

    // --- captain's welcome: on the first real scroll of every visit (like the intro) ---
    if (y > 80 && !announcedCaptain.current && !isLanded) {
      announcedCaptain.current = true;
      announce("captain", 9000);
    }

    // --- turbulence on very fast scrolling ---
    const now = performance.now();
    const dt = now - lastScroll.current.t;
    if (dt > 0 && dt < 200) {
      const speed = Math.abs(y - lastScroll.current.y) / (dt / 1000);
      if (
        speed > TURBULENCE_SPEED &&
        now - lastUserInput.current < 250 &&
        now - lastTurbulence.current > TURBULENCE_COOLDOWN &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        lastTurbulence.current = now;
        announce("turbulence", 3800);
        setShaking(true);
        document.documentElement.classList.add("turbulence");
        window.setTimeout(() => {
          setShaking(false);
          document.documentElement.classList.remove("turbulence");
        }, 900);
      }
    }
    lastScroll.current = { y, t: now };
  });

  const phase = landed
    ? t.phases.landed
    : flight.p < 0.55
      ? t.phases.cruise
      : flight.p < 0.85
        ? t.phases.descent
        : t.phases.approach;

  const noticeContent =
    notice === "captain"
      ? { title: t.captainTitle, body: t.captain, tone: "sky" as const }
      : notice === "turbulence"
        ? { title: t.turbulenceTitle, body: t.turbulence, tone: "amber" as const }
        : notice === "landed"
          ? { title: t.landedTitle, body: t.landed, tone: "emerald" as const }
          : null;

  return (
    <>
      {/* ---------------- Flight instrument ---------------- */}
      <AnimatePresence>
        {visible && !parked && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
            aria-hidden
            className={`flight-shake pointer-events-none fixed bottom-4 left-4 z-[34] w-[224px] rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 font-mono text-white/85 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md sm:bottom-6 sm:left-6 sm:w-[236px] ${
              shaking ? "is-shaking" : ""
            }`}
          >
            <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.22em]">
              <span className="flex items-center gap-1.5 text-white/55">
                <Plane className="h-3 w-3 -rotate-45" /> BI-2026
              </span>
              <span className={landed ? "text-emerald-300" : "text-sky-300"}>● {phase}</span>
            </div>

            {landed ? (
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">
                ALT 0 M · {locale === "sv" ? "Göteborg" : "Gothenburg"}
              </p>
            ) : (
              <div className="mt-1.5 flex justify-between gap-2 whitespace-nowrap text-[10px] tabular-nums tracking-[0.08em] sm:text-[11px] sm:tracking-[0.12em]">
                <span>
                  <span className="text-white/45">ALT </span>
                  {fmt(flight.alt)} M
                </span>
                <span>
                  <span className="text-white/45">SPD </span>
                  {flight.spd} KM/H
                </span>
              </div>
            )}

            {/* route progress: GOT ─✈─ YOU */}
            <div className="mt-2 flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/45">
              <span>GOT</span>
              <div className="relative h-px flex-1 bg-white/15">
                <div
                  className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-sky-300 to-emerald-300"
                  style={{ width: "100%", transform: `scaleX(${flight.p})` }}
                />
                <Plane
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 fill-white text-white"
                  style={{ left: `${flight.p * 100}%` }}
                />
              </div>
              <span>YOU</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- PA announcements ---------------- */}
      <AnimatePresence>
        {noticeContent && (
          <motion.div
            key={notice}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-[118px] z-[60] mx-auto max-w-md rounded-2xl border border-white/12 bg-[#0c1018]/92 p-4 pr-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:bottom-8"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  noticeContent.tone === "sky"
                    ? "bg-sky-400/15 text-sky-300"
                    : noticeContent.tone === "amber"
                      ? "bg-amber-400/15 text-amber-300"
                      : "bg-emerald-400/15 text-emerald-300"
                }`}
              >
                <motion.span
                  animate={{ rotate: [0, -18, 14, -8, 0] }}
                  transition={{ duration: 0.7 }}
                  className="flex"
                >
                  {notice === "landed" ? <Plane className="h-4 w-4 rotate-45" /> : <Bell className="h-4 w-4" />}
                </motion.span>
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                  ✈ BI-2026 · {noticeContent.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">{noticeContent.body}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label={t.close}
              className="absolute right-1.5 top-1.5 flex h-10 w-10 items-center sm:right-2.5 sm:top-2.5 sm:h-7 sm:w-7 justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Send, X } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import { botCopy, matchTopic, type BotLink } from "@/lib/bot-content";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  links?: BotLink[];
};

const NUDGE_KEY = "bi-bot-nudged";

/* -------------------------------------------------------------------------- */
/*  Humanoid head — white ceramic shell, glowing gold cores, facing viewer    */
/* -------------------------------------------------------------------------- */

function EarCore({
  cx,
  cy,
  glow,
  core,
  still,
  reverse = false,
}: {
  cx: number;
  cy: number;
  glow: string;
  core: string;
  still: boolean;
  reverse?: boolean;
}) {
  const centered = { transformBox: "fill-box", transformOrigin: "center" } as const;
  return (
    <g data-still={still || undefined}>
      <circle cx={cx} cy={cy} r="7.5" fill="#1a130c" stroke="#b9bfc8" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="7.2" fill={`url(#${glow})`} />
      <g style={centered} className={reverse ? "bot-spin-rev" : "bot-spin"}>
        <circle cx={cx} cy={cy} r="5.3" fill="none" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="9 2.4" />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r="3.2"
        fill={`url(#${core})`}
        style={centered}
        className="bot-pulse"
      />
      <circle cx={cx} cy={cy} r="1" fill="#fffbeb" />
    </g>
  );
}

export function RobotHead({
  lookX,
  lookY,
  size = 72,
  still = false,
}: {
  lookX?: MotionValue<number>;
  lookY?: MotionValue<number>;
  size?: number;
  still?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shell = `${uid}-shell`;
  const core = `${uid}-core`;
  const glow = `${uid}-glow`;
  const centered = { transformBox: "fill-box", transformOrigin: "center" } as const;

  // Face features shift a little (parallax), pupils shift more → reads as the head turning to look at you
  const zero = useMotionValue(0);
  const lx = lookX ?? zero;
  const ly = lookY ?? zero;
  const faceX = useTransform(lx, (v) => v * 1.4);
  const faceY = useTransform(ly, (v) => v * 1);
  const pupilX = useTransform(lx, (v) => v * 1.5);
  const pupilY = useTransform(ly, (v) => v * 0.9);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      aria-hidden
      className="bot-head overflow-visible"
      data-still={still || undefined}
    >
      <defs>
        <radialGradient id={shell} cx="0.38" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e2e5ea" />
          <stop offset="1" stopColor="#8a919b" />
        </radialGradient>
        <radialGradient id={core} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6d5" />
          <stop offset="0.3" stopColor="#fcd34d" />
          <stop offset="0.65" stopColor="#c27c1a" />
          <stop offset="1" stopColor="#24170a" />
        </radialGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fcd34d" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Neck — exposed cables */}
      <g strokeLinecap="round">
        <path d="M34 57 L32 80" stroke="#2f2a24" strokeWidth="3" />
        <path d="M37.5 59 L37 80" stroke="#d6a352" strokeWidth="1.2" />
        <path d="M40 60 L40 80" stroke="#3a332b" strokeWidth="2.6" />
        <path d="M42.5 59 L43 80" stroke="#d6a352" strokeWidth="1.2" />
        <path d="M46 57 L48 80" stroke="#2f2a24" strokeWidth="3" />
        <path d="M33 67 L47 67 M32.5 74 L47.5 74" stroke="#7a6545" strokeWidth="0.9" />
      </g>
      <g className="bot-flicker">
        <circle cx="37.3" cy="70" r="2.4" fill={`url(#${glow})`} />
        <circle cx="42.7" cy="64" r="2.1" fill={`url(#${glow})`} />
        <circle cx="40" cy="77" r="2.1" fill={`url(#${glow})`} />
        <g fill="#fde68a">
          <circle cx="37.3" cy="70" r="0.75" />
          <circle cx="42.7" cy="64" r="0.65" />
          <circle cx="40" cy="77" r="0.65" />
        </g>
      </g>

      {/* Ear cores (sit behind the skull) */}
      <EarCore cx={19.5} cy={35} glow={glow} core={core} still={still} />
      <EarCore cx={60.5} cy={35} glow={glow} core={core} still={still} reverse />

      {/* Skull */}
      <path
        d="M40 8 C53.5 8 60.5 19 60.5 32 C60.5 44 56 53.5 48 59 C45 61 42.5 62 40 62 C37.5 62 35 61 32 59 C24 53.5 19.5 44 19.5 32 C19.5 19 26.5 8 40 8 Z"
        fill={`url(#${shell})`}
      />

      {/* Panel seams */}
      <g fill="none" stroke="#6b7280" strokeWidth="0.55" strokeLinecap="round" opacity="0.65">
        <path d="M40 8 L40 17" />
        <path d="M27 17 C31 14.5 35 14 40 17 C45 14 49 14.5 53 17" />
        <path d="M24 30 C24 42 28 52 34 56.5" />
        <path d="M56 30 C56 42 52 52 46 56.5" />
      </g>
      <g fill="#6b7280" opacity="0.8">
        <circle cx="25" cy="24" r="0.45" />
        <circle cx="55" cy="24" r="0.45" />
        <circle cx="40" cy="12" r="0.45" />
      </g>

      {/* Face features — shift toward the viewer's pointer */}
      <motion.g style={{ x: faceX, y: faceY }}>
        {/* Brows */}
        <path d="M28.5 29 Q32.5 27.4 36.5 28.6" fill="none" stroke="#9aa1ab" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M43.5 28.6 Q47.5 27.4 51.5 29" fill="none" stroke="#9aa1ab" strokeWidth="0.75" strokeLinecap="round" />

        {/* Eyes */}
        <g style={centered} className="bot-blink">
          <path d="M28.5 33.2 Q32.5 30.6 36.5 33 Q32.5 35.2 28.5 33.2 Z" fill="#14171d" />
          <path d="M43.5 33 Q47.5 30.6 51.5 33.2 Q47.5 35.2 43.5 33 Z" fill="#14171d" />
          <motion.g style={{ x: pupilX, y: pupilY }}>
            <circle cx="32.5" cy="33" r="2.6" fill={`url(#${glow})`} />
            <circle cx="47.5" cy="33" r="2.6" fill={`url(#${glow})`} />
            <circle cx="32.5" cy="33" r="1.1" fill="#fde68a" />
            <circle cx="47.5" cy="33" r="1.1" fill="#fde68a" />
          </motion.g>
        </g>

        {/* Nose */}
        <path d="M40 35 L38.8 42 Q40 43 41.2 42" fill="none" stroke="#a3aab3" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />

        {/* Mouth */}
        <path d="M35.8 48 Q40 49.6 44.2 48" fill="none" stroke="#8b929c" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M37.5 50.6 Q40 51.4 42.5 50.6" fill="none" stroke="#c5cad1" strokeWidth="0.6" strokeLinecap="round" />
      </motion.g>

      {/* Crown highlight */}
      <path d="M29 13.5 C33 10.5 37 9.8 41 10" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Glowing "typing" dots — like the reference speech bubble                  */
/* -------------------------------------------------------------------------- */

function GlowDots({ size = 6 }: { size?: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full bg-amber-200"
          style={{
            width: size,
            height: size,
            boxShadow: "0 0 6px 1px rgba(251,191,36,0.85), 0 0 14px 3px rgba(251,191,36,0.35)",
          }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Typewriter for bot replies                                                */
/* -------------------------------------------------------------------------- */

function TypedText({
  text,
  animate,
  onTick,
  onDone,
}: {
  text: string;
  animate: boolean;
  onTick: () => void;
  onDone: () => void;
}) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  const doneRef = useRef(onDone);
  const tickRef = useRef(onTick);
  useEffect(() => {
    doneRef.current = onDone;
    tickRef.current = onTick;
  });

  useEffect(() => {
    if (!animate) {
      doneRef.current();
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(text.length, i + 3);
      setShown(i);
      tickRef.current();
      if (i >= text.length) {
        window.clearInterval(id);
        doneRef.current();
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [text, animate]);

  return (
    <span className="whitespace-pre-line">
      {text.slice(0, shown)}
      {shown < text.length && (
        <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-amber-300" />
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export function AiBot() {
  const { locale } = useLocale();
  // Keyed by locale so switching language restarts the conversation
  return <AiBotInner key={locale} locale={locale} />;
}

function AiBotInner({ locale }: { locale: Locale }) {
  const copy = botCopy[locale];
  const reduce = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [asked, setAsked] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [typingId, setTypingId] = useState<number | null>(null);
  const [input, setInput] = useState("");

  const idRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 1200);
    const pending = timers.current;
    return () => {
      window.clearTimeout(t);
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  /* ---------------- Scroll-driven flight path ---------------- */

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 35, damping: 16, mass: 0.8 });
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 180, damping: 40 });

  // Weaves up and down the right edge as the page scrolls
  const y = useTransform(progress, (p) =>
    reduce ? "62vh" : `calc(${50 + 20 * Math.sin(p * Math.PI * 5 - Math.PI / 4)}vh - 28px)`,
  );
  const x = useTransform(progress, (p) => (reduce ? 0 : -Math.abs(Math.sin(p * Math.PI * 3)) * 22));
  const rotate = useTransform(velocity, [-2500, 0, 2500], reduce ? [0, 0, 0] : [-18, 0, 18], {
    clamp: true,
  });

  // Eyes follow the visitor's mouse; scrolling nudges the gaze up/down
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = launcherRef.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      pointerX.set(Math.max(-1, Math.min(1, dx / 320)));
      pointerY.set(Math.max(-1, Math.min(1, dy / 320)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY]);
  const lookX = useSpring(pointerX, { stiffness: 140, damping: 18 });
  const lookYPointer = useSpring(pointerY, { stiffness: 140, damping: 18 });
  const lookY = useTransform<number, number>([lookYPointer, velocity], ([p, v]) =>
    Math.max(-1, Math.min(1, p + v / 2000)),
  );

  // One gentle nudge per session once the visitor has scrolled past the hero
  useMotionValueEvent(scrollY, "change", (v) => {
    if (nudge || open || v < window.innerHeight * 0.9) return;
    try {
      if (sessionStorage.getItem(NUDGE_KEY)) return;
      sessionStorage.setItem(NUDGE_KEY, "1");
    } catch {
      return;
    }
    setNudge(true);
    timers.current.push(window.setTimeout(() => setNudge(false), 5000));
  });

  /* ---------------- Conversation ---------------- */

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const pushBot = useCallback(
    (text: string, links?: BotLink[], delay = 650) => {
      setThinking(true);
      timers.current.push(
        window.setTimeout(() => {
          const id = ++idRef.current;
          setThinking(false);
          setTypingId(reduce ? null : id);
          setMessages((m) => [...m, { id, role: "bot", text, links }]);
        }, reduce ? 0 : delay),
      );
    },
    [reduce],
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    setNudge(false);
    setHovered(false);
    if (messages.length === 0 && !thinking) pushBot(copy.greeting, undefined, 500);
  }, [messages.length, thinking, pushBot, copy.greeting]);

  const closePanel = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }, []);

  const busy = thinking || typingId !== null;

  const ask = useCallback(
    (question: string, topicId?: string) => {
      if (busy || !question.trim()) return;
      const topic = topicId
        ? copy.topics.find((t) => t.id === topicId) ?? null
        : matchTopic(question, copy.topics);
      setMessages((m) => [...m, { id: ++idRef.current, role: "user", text: question.trim() }]);
      if (topic) {
        setAsked((a) => (a.includes(topic.id) ? a : [...a, topic.id]));
        pushBot(topic.answer, topic.links);
      } else {
        pushBot(copy.fallback, copy.topics.find((t) => t.id === "contact")?.links);
      }
    },
    [busy, copy, pushBot],
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking, typingId, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    const focus = window.setTimeout(() => {
      if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
    }, 350);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focus);
    };
  }, [open, closePanel]);

  const remaining = copy.topics.filter((t) => !asked.includes(t.id));
  const showBubble = !open && (hovered || nudge);

  return (
    <>
      {/* ---------------- Flying launcher ---------------- */}
      <motion.div
        className="pointer-events-none fixed right-0.5 top-0 z-[35] will-change-transform sm:right-5"
        data-paused={!mounted || open || undefined}
        style={{ y }}
        initial={false}
        animate={{ opacity: mounted && !open ? 1 : 0, scale: mounted && !open ? 1 : 0.4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Sideways drift only on larger screens — on phones B1 hugs the edge so it never covers text */}
        <motion.div style={{ x }} className="max-sm:![transform:none]">
        <motion.div style={{ rotate }}>
          <div className="bot-bob relative">
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  key={nudge && !hovered ? "nudge" : "hint"}
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-full top-[38%] mr-1.5 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-[18px] border border-white/10 bg-[#2a2a30]/90 py-1.5 pl-3 pr-3.5 text-[11px] font-medium text-white/90 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8),0_0_30px_-8px_rgba(251,191,36,0.35)] backdrop-blur-md"
                >
                  <GlowDots size={4} />
                  {nudge && !hovered ? copy.nudge : copy.hoverHint}
                  {/* Tail */}
                  <span className="absolute -right-1 bottom-1.5 h-2.5 w-2.5 rotate-45 rounded-sm border-r border-t border-white/10 bg-[#2a2a30]" />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              ref={launcherRef}
              type="button"
              onClick={openPanel}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              aria-label={copy.openLabel}
              aria-expanded={open}
              tabIndex={open ? -1 : 0}
              className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full outline-none transition-transform duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-amber-300/70 active:scale-95 max-sm:[&_svg]:h-[60px] max-sm:[&_svg]:w-[60px] sm:h-[76px] sm:w-[76px]"
            >
              {/* Warm glow behind the core */}
              <span className="absolute -inset-4 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(251,191,36,0.32),rgba(255,255,255,0.06)_45%,transparent_70%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              <RobotHead lookX={lookX} lookY={lookY} size={76} still={!!reduce} />
            </button>
          </div>
        </motion.div>
        </motion.div>
      </motion.div>

      {/* ---------------- Chat panel ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="bot-panel"
            role="dialog"
            aria-label={`${copy.name} — ${copy.status}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-3 z-[65] flex max-h-[min(600px,calc(100dvh-5rem))] flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-[#0e1220]/95 to-[#050710]/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(251,191,36,0.06)] backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[390px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-start justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-[#4a4a52] to-[#1c1c21]">
                  <RobotHead size={46} still={!!reduce} />
                </div>
                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0e1220] bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{copy.name}</p>
                <p className="truncate font-mono text-[10px] uppercase tracking-widest text-white/45">
                  {copy.status}
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label={copy.closeLabel}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              data-lenis-prevent
              aria-live="polite"
              className="flex min-h-[200px] flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {messages.map((m) =>
                m.role === "user" ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-10 self-end rounded-2xl rounded-br-sm bg-gradient-to-br from-[#f3d18a] to-[#c98a2e] px-3.5 py-2 text-[13.5px] font-medium leading-relaxed text-[#1c1206]"
                  >
                    {m.text}
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mr-6 self-start"
                  >
                    <div className="rounded-2xl rounded-bl-sm border border-white/[0.07] bg-white/[0.04] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white/85">
                      <TypedText
                        text={m.text}
                        animate={typingId === m.id}
                        onTick={scrollToBottom}
                        onDone={() => setTypingId((t) => (t === m.id ? null : t))}
                      />
                    </div>
                    {m.links && typingId !== m.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 flex flex-wrap gap-2"
                      >
                        {m.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target={l.external ? "_blank" : undefined}
                            rel={l.external ? "noopener noreferrer" : undefined}
                            onClick={() => {
                              if (l.href.startsWith("#")) setOpen(false);
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/[0.06] px-3 py-1 text-xs text-amber-100 transition-colors hover:border-amber-300/60 hover:bg-amber-300/15"
                          >
                            {l.label}
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ),
              )}

              {thinking && (
                <div className="flex w-fit items-center rounded-[20px] rounded-bl-sm border border-white/10 bg-[#2a2a30]/80 px-4 py-3">
                  <GlowDots />
                </div>
              )}
            </div>

            {/* Suggested questions */}
            {remaining.length > 0 && messages.length > 0 && (
              <div
                data-lenis-prevent
                className="flex gap-2 overflow-x-auto border-t border-white/[0.05] px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {remaining.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={busy}
                    onClick={() => ask(t.question, t.id)}
                    className="shrink-0 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-white/80 transition-all hover:border-amber-300/50 hover:text-white disabled:opacity-40"
                  >
                    {t.question}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (busy) return;
                ask(input);
                setInput("");
              }}
              className="flex items-center gap-2 border-t border-white/[0.06] px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={copy.inputPlaceholder}
                maxLength={200}
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-base text-white placeholder:text-white/35 focus:border-amber-300/50 focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={copy.send}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f3d18a] to-[#c98a2e] text-[#1c1206] transition-opacity disabled:opacity-35"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="pb-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
              {copy.disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

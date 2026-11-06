"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { RobotHead } from "@/components/ai-bot";

/**
 * First-visit boot sequence: a big 000→100% counter with a terminal "building"
 * the portfolio underneath, then the whole screen slides up to reveal the site.
 *
 * Runs on every page load. An inline script in the root layout marks
 * <html data-intro="skip"> for reduced-motion visitors so the overlay is
 * hidden by CSS before first paint (no flash).
 */

export const INTRO_DONE_EVENT = "intro:done";

type Line = { at: number; text: string; kind: "cmd" | "out" | "ok" | "ai" | "agent" | "success" };

const LINES: Line[] = [
  { at: 0, text: "whoami", kind: "cmd" },
  { at: 4, text: "bozhidar-ivanov — fullstack developer & ai agent builder · göteborg", kind: "out" },
  { at: 8, text: "dotnet build ./portfolio -c Release", kind: "cmd" },
  { at: 14, text: "backend     c# · .net 8 · clean architecture", kind: "ok" },
  { at: 19, text: "frontend    react · next.js · tailwind", kind: "ok" },
  { at: 24, text: "Build succeeded — 0 warnings, 0 errors", kind: "success" },
  { at: 28, text: "ollama run b1-agent --tools=63 --local", kind: "cmd" },
  { at: 35, text: "loading model weights… local llm · no cloud", kind: "ai" },
  { at: 41, text: "registering tools: apps · files · system · web · voice", kind: "ai" },
  { at: 47, text: "llm         agent loop · tool calling · structured output", kind: "ok" },
  { at: 52, text: "voice       whisper · wake word · barge-in", kind: "ok" },
  { at: 57, text: "workflow    ai-assisted dev · code review · refactors", kind: "ok" },
  { at: 62, text: "agent ready — 63 tools online", kind: "success" },
  { at: 66, text: "Hi! I'm B1, Bozhidar's AI sidekick. Find me floating on the right 👋", kind: "agent" },
  { at: 88, text: "./launch --open", kind: "cmd" },
];

const TYPE_SPAN = 5; // % of progress it takes to type a command
const AGENT_SPAN = 16; // the agent's reply streams in a bit slower, token-style

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

type Phase = "run" | "glow" | "exit" | "gone";

export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("run");
  const [count, setCount] = useState(0);
  const progress = useMotionValue(0);
  const skipped = useRef(false);
  const termRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest terminal line in view by translating the list (no state, no reflow of siblings)
  useLayoutEffect(() => {
    const box = termRef.current;
    const list = listRef.current;
    if (!box || !list) return;
    const overflow = list.offsetHeight - box.clientHeight;
    list.style.transform = `translateY(${-Math.max(0, overflow)}px)`;
  });
  const timers = useRef<number[]>([]);

  useMotionValueEvent(progress, "change", (v) => setCount(Math.round(v)));

  // B1's head fades in from a dim silhouette and "wakes" while the agent loads
  const headOpacity = useTransform(progress, [20, 62], [0.12, 1], { clamp: true });
  const headScale = useTransform(progress, [20, 62], [0.9, 1], { clamp: true });
  const headFilter = useTransform(progress, [20, 62], ["grayscale(1) brightness(0.5)", "grayscale(0) brightness(1)"], {
    clamp: true,
  });
  // …then glances toward the terminal while it types its greeting
  const headLookX = useTransform(progress, [62, 70, 86, 94], [0, -0.9, -0.9, 0], { clamp: true });

  const reveal = useCallback(() => {
    if (skipped.current) return;
    skipped.current = true;
    setPhase("exit");
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") return;
    // Every load is a fresh take-off: don't let the browser restore the old
    // scroll position underneath the intro
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const controls = animate(progress, [0, 27, 33, 62, 84, 100], {
      duration: 2.2,
      times: [0, 0.22, 0.32, 0.6, 0.86, 1],
      ease: "easeInOut",
      onComplete: () => {
        setPhase("glow");
        timers.current.push(window.setTimeout(reveal, 350));
      },
    });

    const skip = () => {
      controls.stop();
      progress.set(100);
      reveal();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    const pending = timers.current;

    return () => {
      controls.stop();
      pending.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [progress, reveal]);

  if (phase === "gone") return null;

  const done = phase !== "run";
  const visible = LINES.filter((l) => count >= l.at);

  return (
    <motion.div
      className="boot-intro fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden bg-[#06060a] px-6"
      data-state={phase === "exit" ? "exit" : "run"}
      aria-hidden
      onClick={() => {
        progress.set(100);
        reveal();
      }}
      initial={false}
      animate={phase === "exit" ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (phase === "exit") setPhase("gone");
      }}
    >
      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Power-on glow at 100% */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),rgba(168,85,247,0.12)_45%,transparent_70%)] blur-2xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={done ? { opacity: 1, scale: 1 } : { opacity: count / 400, scale: 0.6 + count / 400 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <div className="relative w-full max-w-[560px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          Booting portfolio · AI agent
        </p>

        {/* Big counter */}
        <div className="mt-2 flex items-end font-sans font-semibold leading-[0.85] tracking-[-0.06em] text-white tabular-nums">
          <span className="text-[clamp(96px,22vw,184px)]">{String(count).padStart(3, "0")}</span>
          <span className="mb-[0.18em] ml-1 bg-gradient-to-br from-cyan-300 to-purple-400 bg-clip-text text-[clamp(36px,7vw,64px)] text-transparent">
            %
          </span>

          {/* B1 powers up as the agent loads */}
          <motion.div
            className="relative mb-[0.1em] ml-auto h-[clamp(64px,16vw,128px)] w-[clamp(64px,16vw,128px)] shrink-0 [&_svg]:h-full [&_svg]:w-full"
            style={{ opacity: headOpacity, scale: headScale, filter: headFilter }}
          >
            <motion.span
              className="absolute inset-0 -z-10 rounded-full bg-amber-400/40 blur-2xl"
              animate={{ opacity: count >= 62 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
            <RobotHead lookX={headLookX} size={128} />
            {count >= 62 && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-4 right-0 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] text-amber-200/80"
              >
                ● B1 online
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Progress rail */}
        <div className="relative mt-5 h-px w-full bg-white/10">
          <div
            className="absolute inset-0 origin-left bg-gradient-to-r from-cyan-400 via-white to-purple-400"
            style={{ transform: `scaleX(${count / 100})` }}
          />
          <div className="absolute inset-0" style={{ transform: `translateX(${count}%)` }}>
            <div
              className="absolute -left-[3.5px] -top-[3px] h-[7px] w-[7px] rounded-full bg-white shadow-[0_0_12px_2px_rgba(34,211,238,0.8)] transition-opacity"
              style={{ opacity: done ? 0 : 1 }}
            />
          </div>
        </div>
        <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          <span>Bozhidar Ivanov · GBG</span>
          <span className={done ? "text-emerald-300" : undefined}>{done ? "● Online" : "v2026.11"}</span>
        </div>

        {/* Terminal */}
        <div
          ref={termRef}
          className="relative mt-8 h-[200px] overflow-hidden font-mono text-[11px] leading-[1.75] [mask-image:linear-gradient(to_bottom,transparent,black_30%)] sm:h-[220px] sm:text-[12.5px]"
        >
          {/* Lines stay top-anchored; the list is scrolled with a transform so
              new output never counts as a layout shift */}
          <div ref={listRef} className="absolute inset-x-0 top-0 transition-transform duration-150 ease-out">
          {visible.map((l, i) => {
            const isLast = i === visible.length - 1;
            if (l.kind === "agent") {
              const typed = Math.min(
                l.text.length,
                Math.ceil(((count - l.at) / AGENT_SPAN) * l.text.length),
              );
              return (
                <div
                  key={l.at}
                  className={`text-white/90 ${typed < l.text.length ? "term-cursor [--cursor:var(--color-amber-300)]" : ""}`}
                >
                  <span className="text-amber-300">b1-agent ›</span> {l.text.slice(0, typed)}
                </div>
              );
            }
            if (l.kind === "cmd") {
              const typed = Math.min(
                l.text.length,
                Math.ceil(((count - l.at) / TYPE_SPAN) * l.text.length),
              );
              return (
                <div key={l.at} className={`truncate text-white/85 ${isLast ? "term-cursor" : ""}`}>
                  <span className="text-cyan-300">~/portfolio</span>
                  <span className="text-white/40"> $ </span>
                  {l.text.slice(0, typed)}
                </div>
              );
            }
            return (
              <motion.div
                key={l.at}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={
                  l.kind === "success"
                    ? "truncate text-emerald-300"
                    : l.kind === "ok"
                      ? "overflow-hidden text-ellipsis whitespace-pre text-white/55"
                      : l.kind === "ai"
                        ? "truncate text-purple-300/80"
                        : "truncate text-white/55"
                }
              >
                {l.kind === "ok" && <span className="text-emerald-300">  ✓ </span>}
                {l.kind === "ai" && (
                  <span className="text-purple-300">
                    {"  "}
                    {isLast && !done ? SPINNER[Math.floor(count / 2) % SPINNER.length] : "›"}{" "}
                  </span>
                )}
                {l.text}
              </motion.div>
            );
          })}
          </div>
        </div>

        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          Click or press any key to skip
        </p>
      </div>

      {/* Glowing leading edge while the screen slides up */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80 shadow-[0_0_24px_4px_rgba(34,211,238,0.5)]" />
    </motion.div>
  );
}

/** Remounts its children when the intro finishes so entrance animations play on reveal. */
export function IntroReplay({ children }: { children: React.ReactNode }) {
  const [round, setRound] = useState(0);
  useEffect(() => {
    const onDone = () => setRound(1);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    return () => window.removeEventListener(INTRO_DONE_EVENT, onDone);
  }, []);
  return <div key={round} className="contents">{children}</div>;
}

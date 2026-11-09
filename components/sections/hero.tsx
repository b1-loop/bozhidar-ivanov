"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useContent, useLocale } from "@/lib/i18n";
import { IntroReplay } from "@/components/boot-intro";
import { TWINKLE_STARS, WingTip } from "@/components/night-sky";
import { PsuPanel } from "@/components/psu-panel";

// Aurora borealis — photo by Luke Stackpoole on Unsplash (Unsplash License).
// A landscape crop fills the background, the full portrait frame fills the window.
const AURORA_WIDE = {
  src: "/hero/aurora-wide-1800.jpg",
  srcSet:
    "/hero/aurora-wide-1200.jpg 1200w, /hero/aurora-wide-1800.jpg 1800w, /hero/aurora-wide-2400.jpg 2400w",
  sizes: "100vw",
};
const AURORA_WINDOW = {
  src: "/hero/aurora-window-900.jpg",
  srcSet:
    "/hero/aurora-window-700.jpg 700w, /hero/aurora-window-900.jpg 900w, /hero/aurora-window-1200.jpg 1200w",
  sizes: "(max-width: 640px) 100vw, 640px",
};

type MarqueeItem = { label: string; accent?: boolean; mono?: boolean };
const marqueeItems: MarqueeItem[] = [
  { label: "Fullstack", accent: true },
  { label: ".NET", mono: true },
  { label: "React" },
  { label: "Clean Architecture", accent: true },
  { label: "Blazor" },
  { label: "Azure", mono: true },
  { label: "C#" },
  { label: "TypeScript", mono: true },
  { label: "Docker" },
  { label: "OpenAI", accent: true },
  { label: "SQL", mono: true },
  { label: "CI/CD" },
];

export function Hero() {
  const c = useContent();
  // Start fetching the above-the-fold aurora before any JS runs (<link rel=preload> in <head>)
  preload(AURORA_WIDE.src, { as: "image", imageSrcSet: AURORA_WIDE.srcSet, imageSizes: AURORA_WIDE.sizes, fetchPriority: "high" });
  preload(AURORA_WINDOW.src, { as: "image", imageSrcSet: AURORA_WINDOW.srcSet, imageSizes: AURORA_WINDOW.sizes, fetchPriority: "high" });
  const ref = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const sceneX = useTransform(smx, [-1, 1], [-20, 20]);
  const sceneY = useTransform(smy, [-1, 1], [-12, 12]);

  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(d));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Skip pointer-parallax on touch devices — pointermove fires during
    // touch scroll and causes needless jank.
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w) * 2 - 1);
      my.set((e.clientY / h) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  // Pause the marquee when it scrolls off-screen — the animation runs on the
  // GPU forever otherwise, draining battery on mobile.
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setMarqueePaused(!entry.isIntersecting),
      { rootMargin: "50px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#03050b]"
    >
      {/* Full-bleed aurora sky — we're on a night flight */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={AURORA_WIDE.src}
        srcSet={AURORA_WIDE.srcSet}
        sizes={AURORA_WIDE.sizes}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
      />

      {/* Slight darkening for text contrast and atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,5,12,0.45) 0%, rgba(3,5,12,0.3) 40%, rgba(3,5,12,0.7) 100%)",
        }}
      />

      {/* Aurora-green light halo around where the window sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 50%, rgba(52,211,153,0.16) 0%, rgba(34,211,238,0.06) 40%, transparent 65%)",
        }}
      />

      <div className="noise opacity-30" />

      {/* Entrance animations replay when the boot intro reveals the page. Images
          stay mounted (only text is replayed) so LCP isn't pushed back. */}
      <IntroReplay>
      {/* Corner metadata — with glass panels for readability, hidden on very small screens */}
      <div className="pointer-events-none absolute inset-x-0 top-20 z-30 hidden justify-between px-3 font-mono text-[9px] uppercase tracking-[0.25em] sm:flex md:top-24 md:px-10 md:text-[10px] md:tracking-[0.3em]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-white/85 backdrop-blur-md md:px-3 md:py-2"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
        >
          <div>N 57°42&apos;30&quot;</div>
          <div>E 11°58&apos;05&quot;</div>
          <div className="mt-1 hidden text-white/60 md:block">
            {c.personal.coordsCity}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-right text-white/85 backdrop-blur-md md:px-3 md:py-2"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
        >
          <div>ALT 10 700 M</div>
          <div className="tabular-nums">SPD 850 KM/H</div>
          <div className="mt-1 tabular-nums text-white">{time}</div>
        </motion.div>
      </div>

      {/* Overhead passenger service unit — cabin buttons, remixed for the portfolio */}
      <div className="absolute inset-x-0 top-[82px] z-30 flex justify-center px-3 md:top-[86px]">
        <PsuPanel />
      </div>
      </IntroReplay>

      {/* The airplane window */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full flex-1 items-center justify-center will-change-transform px-3 pt-[150px] pb-6 sm:px-4 sm:pt-[158px] sm:pb-8 md:px-10"
      >
        <motion.div
          // Scale only: an opacity-0 start would hide the window image (the LCP
          // element) until JS hydrates — and the intro covers this anyway.
          initial={{ scale: 0.94 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl"
          style={{ height: "min(78svh, 780px)" }}
        >
          <AirplaneWindow sceneX={sceneX} sceneY={sceneY}>
            <IntroReplay>
              <HeroContent />
            </IntroReplay>
          </AirplaneWindow>
        </motion.div>
      </motion.div>

      {/* Bottom marquee — polished with fade masks and mixed treatments */}
      <motion.div
        ref={marqueeRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="relative z-10 border-y border-white/5 bg-black/70 py-5 backdrop-blur-sm"
      >
        {/* Subtle top and bottom hairlines for depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div
          className="flex overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            className="marquee flex shrink-0 items-center whitespace-nowrap"
            style={{ animationPlayState: marqueePaused ? "paused" : "running" }}
          >
            <MarqueeRow />
          </div>
          <div
            className="marquee flex shrink-0 items-center whitespace-nowrap"
            aria-hidden
            style={{ animationPlayState: marqueePaused ? "paused" : "running" }}
          >
            <MarqueeRow />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function HeroContent() {
  const c = useContent();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center md:px-10">

      <div className="relative">
        <h1
          className="flex flex-col font-display leading-[0.88] tracking-tighter text-white"
          style={{
            textShadow:
              "0 2px 30px rgba(0,0,0,0.9), 0 4px 60px rgba(0,0,0,0.6), 0 0 40px rgba(140,180,220,0.15)",
          }}
        >
          <RevealWord
            text="Bozhidar"
            delay={0.5}
            className="text-[clamp(2.5rem,8vw,6rem)]"
          />
          <RevealWord
            text="Ivanov"
            delay={0.75}
            italic
            className="text-[clamp(3rem,7.5vw,6rem)] text-white/95"
          />
        </h1>

        {/* Subtle decorative underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 h-px w-28 origin-center bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="mt-5 max-w-md font-display text-xl italic text-white md:text-2xl"
        style={{
          textShadow:
            "0 1px 3px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.85), 0 4px 40px rgba(0,0,0,0.5)",
        }}
      >
        {c.personal.tagline}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="mt-3 font-mono text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-white sm:text-[11px] sm:tracking-[0.35em]"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85)" }}
      >
        {c.personal.role.split(" · ").map((part) => (
          <span key={part} className="block">
            {part}
          </span>
        ))}
      </motion.p>

      <motion.a
        href="#journey"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="group mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-6 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:scale-[1.03] hover:border-white/40 hover:bg-black/80"
      >
        {c.ui.hero.followJourney}
        <span className="transition-transform group-hover:translate-x-0.5">↓</span>
      </motion.a>
    </div>
  );
}

function AirplaneWindow({
  children,
  sceneX,
  sceneY,
}: {
  children: React.ReactNode;
  sceneX: ReturnType<typeof useMotionValue<number>>;
  sceneY: ReturnType<typeof useMotionValue<number>>;
}) {
  // Frame depths scale with the viewport so the window keeps its proportions on phones
  const depth = {
    reveal: "clamp(12px, 3.4vw, 22px)", // cabin panel → start of the tunnel
    gasket: "clamp(25px, 6.6vw, 44px)", // rubber seal around the glass
    glass: "clamp(31px, 8vw, 52px)", // inner scratch pane
  };

  return (
    <div className="flight-shake relative mx-auto h-full w-full">
      {/* Halo — aurora light spilling around the window */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 rounded-[42%/32%] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(52,211,153,0.28) 0%, rgba(34,211,238,0.12) 45%, transparent 75%)",
        }}
      />

      {/* 1 — Cabin wall panel: matte light-grey plastic, softly moulded edge */}
      <div
        className="absolute inset-0 rounded-[42%/32%]"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 15%, #e4e2dd 0%, #cfccc6 35%, #b4b1aa 70%, #9d9a93 100%)",
          boxShadow:
            "0 60px 160px -30px rgba(0,0,0,0.85), " +
            "0 0 0 1px rgba(0,0,0,0.35), " +
            "inset 0 3px 2px rgba(255,255,255,0.45), " +
            "inset 0 -4px 6px rgba(0,0,0,0.35)",
        }}
      />
      {/* matte plastic grain */}
      <div className="noise rounded-[42%/32%] opacity-40" />
      {/* night cabin: lights dimmed, cool aurora light on the plastic */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[42%/32%]"
        style={{
          background:
            "linear-gradient(170deg, rgba(10,16,32,0.42) 0%, rgba(10,16,32,0.58) 55%, rgba(4,8,16,0.72) 100%)",
        }}
      />

      {/* 2 — Window reveal: the tunnel narrowing towards the glass.
          Top wall in shadow, bottom sill catching the cabin light. */}
      <div
        className="absolute rounded-[41%/31%]"
        style={{
          inset: depth.reveal,
          background:
            "linear-gradient(to bottom, #1c2024 0%, #2f3439 28%, #4a5056 62%, #6c7278 88%, #80868b 100%)",
          boxShadow:
            "inset 0 16px 26px rgba(0,0,0,0.6), " +
            "inset 0 -3px 8px rgba(255,255,255,0.12), " +
            "inset 0 0 0 1px rgba(0,0,0,0.5), " +
            "0 1px 0 rgba(255,255,255,0.18)",
        }}
      />
      {/* aurora light reflecting off the tunnel walls next to the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-[41%/31%]"
        style={{
          inset: depth.reveal,
          background:
            "radial-gradient(closest-side, transparent 72%, rgba(52,211,153,0.16) 92%, rgba(52,211,153,0.05) 100%)",
        }}
      />

      {/* 3 — Rubber gasket sealing the pane */}
      <div
        className="absolute rounded-[40%/30%]"
        style={{
          inset: depth.gasket,
          background: "linear-gradient(to bottom, #050608 0%, #0d1013 60%, #171b20 100%)",
          boxShadow:
            "inset 0 3px 5px rgba(0,0,0,0.85), " +
            "0 0 0 1px rgba(255,255,255,0.07), " +
            "0 -1px 0 rgba(0,0,0,0.6)",
        }}
      />

      {/* 4 — The glass (inner scratch pane in front of the outer pane) */}
      <div
        className="absolute overflow-hidden rounded-[39%/29%]"
        style={{
          inset: depth.glass,
          boxShadow:
            "inset 0 3px 0 rgba(255,255,255,0.18), " +
            "inset 0 -10px 40px rgba(0,0,0,0.45), " +
            "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Aurora through the window — parallaxed slightly by mouse */}
        <motion.div
          aria-hidden
          style={{ x: sceneX, y: sceneY }}
          className="absolute -inset-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AURORA_WINDOW.src}
            srcSet={AURORA_WINDOW.srcSet}
            sizes={AURORA_WINDOW.sizes}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          {/* the photo already has stars — just add a few that twinkle */}
          <div className="night-twinkle absolute inset-0" style={{ backgroundImage: TWINKLE_STARS }} />
        </motion.div>

        {/* The wing outside, with its blinking navigation light */}
        <WingTip />

        {/* Edge of the outer pane, seen through the scratch pane */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[5%] rounded-[38%/28%]"
          style={{
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), inset 0 0 18px rgba(200,230,255,0.06)",
          }}
        />

        {/* Frost / condensation creeping in from the edges of the pane */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 65% at 50% 48%, transparent 62%, rgba(200,225,255,0.10) 80%, rgba(220,235,255,0.24) 100%)",
          }}
        />

        {/* Very subtle glass tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(160,200,240,0.05) 0%, transparent 40%, rgba(10,20,50,0.12) 100%)",
          }}
        />

        {/* Text readability wash — soft in center where the words sit */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 42% at 50% 50%, rgba(2,6,10,0.62) 0%, rgba(2,6,10,0.32) 55%, transparent 88%)",
          }}
        />

        {/* Cabin reflection on the plastic pane: soft diagonal sheen + a faint second (double-pane) ghost */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(118deg, transparent 18%, rgba(255,255,255,0.07) 24%, transparent 31%), " +
              "linear-gradient(118deg, transparent 33%, rgba(255,255,255,0.035) 37%, transparent 42%), " +
              "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 30%)",
          }}
        />

        {/* Bottom shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
          style={{
            background:
              "radial-gradient(80% 100% at 50% 100%, rgba(0,0,0,0.3) 0%, transparent 65%)",
          }}
        />

        {/* Fine grain */}
        <div className="noise opacity-20" />

        {/* Breather hole — sits in the inner scratch pane, lower centre */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[4.5%] left-1/2 z-20 h-[7px] w-[7px] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 35%, #1b1f24 0%, #050607 70%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 1px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.08)",
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>

        {/* Window shade — drag it up and down */}
        <WindowShade />
      </div>

      {/* Two small screws in the cabin panel */}
      <div
        aria-hidden
        className="absolute h-1.5 w-1.5 rounded-full opacity-70"
        style={{
          top: "12px",
          right: "22%",
          background: "radial-gradient(circle at 30% 30%, #8a8d91, #45484c)",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.15)",
        }}
      />
      <div
        aria-hidden
        className="absolute h-1.5 w-1.5 rounded-full opacity-70"
        style={{
          bottom: "12px",
          left: "22%",
          background: "radial-gradient(circle at 30% 30%, #8a8d91, #45484c)",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.15)",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Draggable window shade                                                    */
/* -------------------------------------------------------------------------- */

const SHADE_MIN = 0.06; // fully up: only the lip peeks out
const SHADE_REST = 0.11; // where it starts
const SHADE_MAX = 0.97; // fully down

function WindowShade() {
  const { locale } = useLocale();
  const shade = useMotionValue(SHADE_REST);
  const height = useTransform(shade, (v) => `${v * 100}%`);
  const [pct, setPct] = useState(Math.round(SHADE_REST * 100));
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const drag = useRef<{ startY: number; start: number; h: number } | null>(null);

  const clamp = (v: number) => Math.min(SHADE_MAX, Math.max(SHADE_MIN, v));
  const set = (v: number) => {
    shade.set(clamp(v));
    setPct(Math.round(clamp(v) * 100));
  };
  const springTo = (v: number) => {
    animate(shade, clamp(v), { type: "spring", stiffness: 180, damping: 22 });
    setPct(Math.round(clamp(v) * 100));
  };

  const hint = locale === "sv" ? "Dra i gardinen ↕" : "Drag the shade ↕";

  return (
    <motion.div
      role="slider"
      tabIndex={0}
      aria-label={locale === "sv" ? "Fönstergardin" : "Window shade"}
      aria-orientation="vertical"
      aria-valuemin={Math.round(SHADE_MIN * 100)}
      aria-valuemax={Math.round(SHADE_MAX * 100)}
      aria-valuenow={pct}
      className={`group/shade absolute inset-x-0 top-0 z-20 touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ height }}
      onPointerDown={(e) => {
        const glass = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
        drag.current = { startY: e.clientY, start: shade.get(), h: glass.height };
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        setTouched(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        set(d.start + (e.clientY - d.startY) / d.h);
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
      onDoubleClick={() => springTo(shade.get() > 0.5 ? SHADE_REST : SHADE_MAX)}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 0.2 : 0.06;
        if (e.key === "ArrowDown") springTo(shade.get() + step);
        else if (e.key === "ArrowUp") springTo(shade.get() - step);
        else if (e.key === "End") springTo(SHADE_MAX);
        else if (e.key === "Home") springTo(SHADE_MIN);
        else return;
        e.preventDefault();
        setTouched(true);
      }}
    >
      {/* shadow the shade casts onto the glass */}
      <div
        className="pointer-events-none absolute inset-x-0 top-full h-6"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }}
      />
      {/* shade body — moulded plastic with fine horizontal ribs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #6f7378 0%, #82868b 55%, #8e9297 85%, #7a7e83 100%), " +
            "repeating-linear-gradient(to bottom, transparent 0 6px, rgba(0,0,0,0.04) 6px 7px)",
          backgroundBlendMode: "multiply",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.18)",
        }}
      />
      {/* rounded lip along the bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-[10px]"
        style={{
          background: "linear-gradient(to bottom, #9a9ea3 0%, #b4b8bc 45%, #6c7075 100%)",
          boxShadow: "0 2px 3px rgba(0,0,0,0.45)",
        }}
      />
      {/* finger grip */}
      <div
        className="absolute bottom-[3px] left-1/2 h-[4px] w-12 -translate-x-1/2 rounded-full transition-[width] duration-200 group-hover/shade:w-16"
        style={{
          background: "linear-gradient(to bottom, #3c4045, #5d6166)",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.25)",
        }}
      />
      {/* "drag me" hint on the shade itself — shows on hover until the visitor has played with it */}
      {!touched && (
        <span className="pointer-events-none absolute bottom-[16px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 opacity-0 transition-opacity duration-300 group-hover/shade:opacity-100">
          {hint}
        </span>
      )}
    </motion.div>
  );
}


function MarqueeRow() {
  return (
    <>
      {marqueeItems.map((item, i) => (
        <span
          key={`${item.label}-${i}`}
          className="flex items-center"
        >
          <span
            className={
              item.mono
                ? "font-mono text-lg uppercase tracking-[0.15em] text-white/50 hover:text-white/90"
                : item.accent
                  ? "font-display text-2xl italic text-white/85 hover:text-white"
                  : "font-display text-2xl italic text-white/45 hover:text-white/80"
            }
            style={{ transition: "color 300ms ease" }}
          >
            {item.label}
          </span>
          <MarqueeDivider index={i} />
        </span>
      ))}
    </>
  );
}

function MarqueeDivider({ index }: { index: number }) {
  const glyphs = ["✦", "·", "◇", "·"];
  const glyph = glyphs[index % glyphs.length];
  return (
    <span
      aria-hidden
      className="mx-8 text-lg text-white/25 md:mx-10"
    >
      {glyph}
    </span>
  );
}

function RevealWord({
  text,
  delay = 0,
  italic = false,
  className = "",
}: {
  text: string;
  delay?: number;
  italic?: boolean;
  className?: string;
}) {
  return (
    <span
      // No overflow clip: it cut the text-shadow off in a hard-edged box.
      // Letters still rise in hidden — they start transparent and blurred.
      className={`${className} ${italic ? "italic" : ""} block`}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ y: "110%", filter: "blur(12px)", opacity: 0 }}
          animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          transition={{
            duration: 1.1,
            delay: delay + i * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block will-change-transform"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

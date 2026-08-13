"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useContent } from "@/lib/i18n";

// One shared Unsplash URL for both the full-bleed background and the window
// scene, so the browser hits the cache instead of downloading twice. srcSet
// serves a much smaller variant on phones (350–450 KB vs ~1 MB at w=2600).
const CLOUD_BASE =
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80";
const CLOUD_SRC = {
  default: `${CLOUD_BASE}&w=1600`,
  srcSet: [
    `${CLOUD_BASE}&w=800 800w`,
    `${CLOUD_BASE}&w=1200 1200w`,
    `${CLOUD_BASE}&w=1800 1800w`,
    `${CLOUD_BASE}&w=2400 2400w`,
  ].join(", "),
} as const;

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
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#1a2540]"
    >
      {/* Full-bleed sky/clouds background — you're floating among the clouds.
          Same URL as SkyCloudScene below so browsers reuse the cache; a srcSet
          serves a much smaller image on phones. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CLOUD_SRC.default}
        srcSet={CLOUD_SRC.srcSet}
        sizes="100vw"
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
            "linear-gradient(to bottom, rgba(10,15,30,0.35) 0%, rgba(10,15,30,0.2) 40%, rgba(10,15,30,0.45) 100%)",
        }}
      />

      {/* Cool light halo around where the window will sit */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 50%, rgba(180,210,240,0.25) 0%, transparent 65%)",
        }}
      />

      <div className="noise opacity-30" />

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

      {/* The airplane window */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full flex-1 items-center justify-center px-3 pt-32 pb-6 sm:px-4 sm:pt-28 sm:pb-8 md:px-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl"
          style={{ height: "min(82svh, 800px)" }}
        >
          <AirplaneWindow sceneX={sceneX} sceneY={sceneY}>
            <HeroContent />
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
      <AvailabilityBadge />

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
            "0 2px 20px rgba(0,0,0,0.85), 0 4px 40px rgba(0,0,0,0.5)",
        }}
      >
        {c.personal.tagline}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/80"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
      >
        {c.personal.role}
        <span className="mx-2 text-white/40">·</span>
        {c.personal.coordsCity.split(",")[0]}
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
  return (
    <div className="relative mx-auto h-full w-full">
      {/* Halo — cool daylight spilling around the window */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 rounded-[42%/32%] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(180,210,240,0.35) 0%, rgba(120,160,200,0.15) 45%, transparent 75%)",
        }}
      />

      {/* Layer 1 — outermost cabin panel (warm cream plastic, real airplane color) */}
      <div
        className="absolute inset-0 rounded-[42%/32%]"
        style={{
          background:
            "linear-gradient(160deg, #e8dccb 0%, #d8ccb8 15%, #c8bca6 32%, #b5a892 50%, #a89a83 70%, #c0b39c 88%, #ddd0bc 100%)",
          boxShadow:
            "0 60px 160px -30px rgba(0,0,0,0.85), " +
            "0 0 0 1px rgba(0,0,0,0.2) inset, " +
            "0 5px 0 rgba(255,255,255,0.4) inset, " +
            "0 -5px 0 rgba(0,0,0,0.4) inset",
        }}
      />

      {/* Subtle panel texture — mold lines / matte plastic grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[42%/32%] opacity-30"
        style={{
          background:
            "repeating-linear-gradient(45deg, transparent 0, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 4px), " +
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 40%)",
        }}
      />

      {/* Layer 2 — recessed ring (subtle inner shadow zone) */}
      <div
        className="absolute inset-[10px] rounded-[41%/31%]"
        style={{
          background:
            "linear-gradient(170deg, #b5a891 0%, #96896f 40%, #877a60 60%, #a4977c 100%)",
          boxShadow:
            "inset 0 3px 6px rgba(0,0,0,0.4), " +
            "inset 0 -2px 3px rgba(255,255,255,0.15), " +
            "0 0 0 1px rgba(0,0,0,0.25)",
        }}
      />

      {/* Layer 3 — top shade retraction slot (subtle horizontal groove) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 h-1 w-24 -translate-x-1/2 rounded-full"
        style={{
          top: "18px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.35)",
        }}
      />

      {/* Layer 4 — inner black rubber/plastic bezel around the glass */}
      <div
        className="absolute inset-[22px] rounded-[40%/30%]"
        style={{
          background:
            "linear-gradient(160deg, #24242a 0%, #101013 30%, #050506 55%, #14141a 80%, #26262c 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.7), " +
            "inset 0 4px 6px rgba(0,0,0,0.75), " +
            "inset 0 -3px 4px rgba(255,255,255,0.08), " +
            "0 0 0 1px rgba(255,255,255,0.18)",
        }}
      />

      {/* Layer 5 — bright bezel highlight ring (chrome/gloss) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[30px] rounded-[39%/29%]"
        style={{
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.3), " +
            "inset 0 0 0 1px rgba(255,255,255,0.15)",
        }}
      />

      {/* Layer 6 — inner glass viewport (double-pane feel) */}
      <div
        className="absolute inset-[34px] overflow-hidden rounded-[38%/28%]"
        style={{
          boxShadow:
            "inset 0 4px 0 rgba(255,255,255,0.28), " +
            "inset 0 -8px 40px rgba(0,0,0,0.4), " +
            "inset 0 0 0 1px rgba(255,255,255,0.1), " +
            "inset 0 0 15px rgba(255,255,255,0.05)",
        }}
      >
        {/* The daytime sky and clouds — parallaxed slightly by mouse */}
        <motion.div
          aria-hidden
          style={{ x: sceneX, y: sceneY }}
          className="absolute -inset-8"
        >
          <SkyCloudScene />
        </motion.div>

        {/* Very subtle glass tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(200,220,240,0.06) 0%, transparent 40%, rgba(20,40,80,0.08) 100%)",
          }}
        />

        {/* Text readability wash — soft in center where the words sit */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 32% at 50% 45%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.12) 60%, transparent 85%)",
          }}
        />

        {/* Diagonal glass reflection (top-left) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 20%, transparent 45%)",
          }}
        />

        {/* Curved top-edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
          style={{
            background:
              "radial-gradient(80% 100% at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 65%)",
          }}
        />

        {/* Bottom shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
          style={{
            background:
              "radial-gradient(80% 100% at 50% 100%, rgba(0,0,0,0.25) 0%, transparent 65%)",
          }}
        />

        {/* Fine grain */}
        <div className="noise opacity-20" />

        {/* Content overlay */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      </div>

      {/* Little breather hole at the bottom center — real airplane windows have this */}
      <div
        aria-hidden
        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
        style={{
          bottom: "10px",
          background:
            "radial-gradient(circle at 30% 30%, #0a0a0a 0%, #030303 55%, #000 100%)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.6), " +
            "0 1px 2px rgba(255,255,255,0.15), " +
            "inset 0 1px 3px rgba(255,255,255,0.25), " +
            "inset 0 -1px 2px rgba(0,0,0,0.8)",
        }}
      />

      {/* Two small hex screws — top-left and bottom-right (subtle) */}
      <div
        aria-hidden
        className="absolute h-1.5 w-1.5 rounded-full opacity-70"
        style={{
          top: "14px",
          right: "36px",
          background: "radial-gradient(circle at 30% 30%, #756a55, #453e30)",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.2)",
        }}
      />
      <div
        aria-hidden
        className="absolute h-1.5 w-1.5 rounded-full opacity-70"
        style={{
          bottom: "14px",
          left: "36px",
          background: "radial-gradient(circle at 30% 30%, #756a55, #453e30)",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.2)",
        }}
      />
    </div>
  );
}

function SkyCloudScene() {
  return (
    <div className="absolute inset-0">
      {/* Sky gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #3d70b5 0%, #5a89c8 20%, #7ba5d6 45%, #a2c1de 70%, #cadae7 100%)",
        }}
      />

      {/* Real cloud photograph — this is the star of the show.
          Same URL as the outer full-bleed image → free browser cache hit. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CLOUD_SRC.default}
        srcSet={CLOUD_SRC.srcSet}
        sizes="(max-width: 640px) 100vw, 640px"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />

      {/* Sun bloom — warm high-right */}
      <div
        aria-hidden
        className="absolute top-[6%] right-[10%] h-28 w-28 rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(circle, rgba(255,245,215,1) 0%, rgba(255,225,170,0.6) 30%, rgba(255,200,130,0.2) 60%, transparent 80%)",
          filter: "blur(4px)",
        }}
      />

      {/* Very slow subtle wisps for gentle motion — low opacity so photo dominates */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
        <div
          className="clouds-b absolute -left-1/2 top-[25%] h-[35%] w-[200%]"
          style={{
            background:
              "radial-gradient(45% 100% at 15% 50%, rgba(255,255,255,0.6), transparent 60%)," +
              "radial-gradient(50% 100% at 55% 50%, rgba(255,255,255,0.7), transparent 60%)," +
              "radial-gradient(40% 100% at 85% 50%, rgba(255,255,255,0.55), transparent 60%)",
            filter: "blur(24px)",
          }}
        />
      </div>

      {/* Warm ambient — enhances the photo like sunset light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,220,180,0.4) 0%, transparent 25%, transparent 70%, rgba(255,200,150,0.3) 100%)",
        }}
      />
    </div>
  );
}

function AvailabilityBadge() {
  const c = useContent();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mb-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-full opacity-60 blur-[6px]"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(52,211,153,0), rgba(52,211,153,0.6), rgba(125,211,252,0.4), rgba(52,211,153,0), rgba(52,211,153,0))",
          animation: "spin 6s linear infinite",
        }}
      />
      <div className="relative flex flex-wrap items-center gap-0 overflow-hidden rounded-full border border-white/15 bg-black/70 backdrop-blur-xl">
        <div className="flex items-center gap-2 py-1.5 pl-3 pr-3">
          <span className="relative flex h-1.5 w-1.5 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </span>
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.25em] text-emerald-400">
            {c.personal.availableLabel}
          </span>
        </div>
        <span className="hidden h-4 w-px bg-white/10 sm:block" />
        <div className="hidden items-center gap-2 py-1.5 pl-3 pr-4 sm:flex">
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/50">
            {c.personal.searchLabel}
          </span>
          <span className="text-[11px] font-medium text-white/95">
            {c.personal.searchValue}
          </span>
        </div>
      </div>
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
      className={`${className} ${italic ? "italic" : ""} block overflow-hidden`}
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

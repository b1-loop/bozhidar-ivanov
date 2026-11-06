"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useContent } from "@/lib/i18n";
import type { JourneyChapter } from "@/lib/content";

export function Journey() {
  const c = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const total = c.journey.length;

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative"
      // svh, not dvh: dvh changes as the mobile URL bar collapses, which would
      // resize this tall section mid-scroll and make the page jump
      style={{ height: `${total * 120}svh` }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {c.journey.map((chapter, i) => (
            <ChapterImage
              key={chapter.id}
              chapter={chapter}
              index={i}
              total={total}
              progress={scrollYProgress}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
          <div className="noise" />
        </div>

        <ProgressLine progress={scrollYProgress} total={total} />
        <FlightRoute progress={scrollYProgress} chapters={c.journey} />
        <ChapterCounter progress={scrollYProgress} total={total} />

        <div className="absolute inset-0">
          {c.journey.map((chapter, i) => (
            <Chapter
              key={chapter.id}
              chapter={chapter}
              index={i}
              total={total}
              progress={scrollYProgress}
              chapterLabel={c.ui.journey.chapter}
            />
          ))}
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/60"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
        >
          {c.ui.journey.hint}
        </div>
      </div>
    </section>
  );
}

function ProgressLine({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex h-[2px] bg-white/5">
      {Array.from({ length: total - 1 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 h-full w-px bg-white/10"
          style={{ left: `${((i + 1) / total) * 100}%` }}
        />
      ))}
      <motion.div
        style={{ width }}
        className="h-full bg-gradient-to-r from-white/60 via-white to-white/60"
      />
    </div>
  );
}

// Vertical offset (px) of the dashed arc at x∈[0,1] — matches the SVG path
// "M0 18 Q50 -10 100 18" drawn in a 40px-tall box, relative to its ends.
const arcOffset = (x: number) => 2 * (18 * (1 - x) ** 2 - 20 * x * (1 - x) + 18 * x ** 2) - 36;

// Each chapter is an "airport" on the flight map
const AIRPORT: Record<string, string> = {
  factory: "VCC",
  founder: "HBL",
  developer: "DEV",
  now: "NXT",
};

/**
 * Seat-back flight map: airports in chronological order left → right, and a
 * plane that flies back in time (right → left) as the chapters scroll by.
 */
function FlightRoute({
  progress,
  chapters,
}: {
  progress: MotionValue<number>;
  chapters: JourneyChapter[];
}) {
  const total = chapters.length;
  // chronological: oldest chapter (last in the list) on the left
  const stops = [...chapters].reverse();
  // progress → position along the route (1 = NXT on the right, 0 = VCC on the left)
  const pos = useTransform(progress, (v) => {
    const local = Math.min(total - 1, Math.max(0, v * total - 0.5));
    return 1 - local / (total - 1);
  });
  const left = useTransform(pos, (x) => `${x * 100}%`);
  const y = useTransform(pos, arcOffset);
  const active = useTransform(pos, (x) => Math.round(x * (total - 1)));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[88px] z-30 w-[min(560px,84vw)] -translate-x-1/2 md:top-auto md:bottom-[calc(env(safe-area-inset-bottom)+4.75rem)]"
    >
      <div className="relative h-10">
        {/* dashed arc */}
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-full w-full overflow-visible">
          <path
            d="M0 18 Q50 -10 100 18"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
            strokeDasharray="2 2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* airports */}
        {stops.map((ch, i) => {
          const x = i / (total - 1);
          const yOff = arcOffset(x);
          return (
            <Airport key={ch.id} x={x} yOff={yOff} index={i} active={active} code={AIRPORT[ch.id] ?? ch.id.slice(0, 3).toUpperCase()} year={ch.year} accent={ch.accent} />
          );
        })}
        {/* the plane — nose pointing left (flying back in time) */}
        <motion.div className="absolute top-[36px] -translate-x-1/2 -translate-y-1/2" style={{ left, y }}>
          <svg width="18" height="18" viewBox="0 0 24 24" className="-scale-x-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
            <path
              fill="white"
              d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              transform="rotate(90 12 12)"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function Airport({
  x,
  yOff,
  index,
  active,
  code,
  year,
  accent,
}: {
  x: number;
  yOff: number;
  index: number;
  active: MotionValue<number>;
  code: string;
  year: string;
  accent: string;
}) {
  const opacity = useTransform(active, (a) => (a === index ? 1 : 0.45));
  const scale = useTransform(active, (a) => (a === index ? 1.15 : 1));
  return (
    <motion.div
      className="absolute top-[36px] flex -translate-x-1/2 flex-col items-center"
      style={{ left: `${x * 100}%`, marginTop: yOff, opacity }}
    >
      <motion.span
        className="-mt-[5px] h-2.5 w-2.5 rounded-full border-2 border-white/80"
        style={{ backgroundColor: accent, scale }}
      />
      <span className="mt-1.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-white">{code}</span>
      <span className="font-mono text-[8px] tracking-[0.2em] text-white/60">{year}</span>
    </motion.div>
  );
}

function ChapterCounter({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const current = useTransform(progress, (v) => {
    const idx = Math.min(total - 1, Math.floor(v * total));
    return String(idx + 1).padStart(2, "0");
  });
  return (
    <div className="absolute top-6 right-6 z-30 font-mono text-xs text-white/60 md:top-10 md:right-10">
      <motion.span>{current}</motion.span>
      <span className="text-white/30"> / {String(total).padStart(2, "0")}</span>
    </div>
  );
}

function ChapterImage({
  chapter,
  index,
  total,
  progress,
}: {
  chapter: JourneyChapter;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (v) => {
    const local = v * total - index;
    if (local <= -0.25) return 0;
    if (local < 0.15) return Math.max(0, (local + 0.25) / 0.4);
    if (local < 0.85) return 1;
    if (local < 1.25) return Math.max(0, (1.25 - local) / 0.4);
    return 0;
  });

  const scale = useTransform(progress, (v) => {
    const local = v * total - index;
    return 1.08 - Math.max(0, Math.min(1, local)) * 0.08;
  });

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="relative h-full w-full">
        <Image
          src={chapter.image}
          alt={chapter.title}
          fill
          // Below the hero: never compete with the hero's LCP image
          fetchPriority="low"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: chapter.imagePosition }}
        />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 80%, ${chapter.accent}25 0%, transparent 50%)`,
        }}
      />
    </motion.div>
  );
}

// Soft dark halo so text stays readable over busy, bright photos
const TEXT_SHADOW = "0 1px 2px rgba(0,0,0,0.8), 0 2px 16px rgba(0,0,0,0.6)";

function Chapter({
  chapter,
  index,
  total,
  progress,
  chapterLabel,
}: {
  chapter: JourneyChapter;
  index: number;
  total: number;
  progress: MotionValue<number>;
  chapterLabel: string;
}) {
  const opacity = useTransform(progress, (v) => {
    const local = v * total - index;
    if (local <= 0) return 0;
    if (local < 0.2) return local / 0.2;
    if (local < 0.8) return 1;
    if (local < 1) return (1 - local) / 0.2;
    return 0;
  });

  const y = useTransform(progress, (v) => {
    const local = v * total - index;
    return 40 - local * 80;
  });

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-end px-6 pb-24 md:items-center md:px-16 md:pb-0"
    >
      <motion.div style={{ y }} className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center gap-4">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: chapter.accent }}
          />
          <span
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: chapter.accent, textShadow: TEXT_SHADOW }}
          >
            {chapterLabel} {String(index + 1).padStart(2, "0")} · {chapter.year}
          </span>
        </div>

        <h2 className="font-display text-[clamp(2.75rem,10vw,4rem)] leading-[0.95] tracking-tighter text-white drop-shadow-2xl md:text-8xl lg:text-9xl">
          {chapter.title}
        </h2>

        <div className="mt-8 max-w-2xl" style={{ textShadow: TEXT_SHADOW }}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
            {chapter.subtitle}
          </p>
          <p className="text-base leading-relaxed text-white/95 md:text-lg">
            {chapter.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
      style={{ height: `${total * 120}dvh` }}
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
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
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
            style={{ color: chapter.accent }}
          >
            {chapterLabel} {String(index + 1).padStart(2, "0")} · {chapter.year}
          </span>
        </div>

        <h2 className="font-display text-[clamp(2.75rem,10vw,4rem)] leading-[0.95] tracking-tighter text-white drop-shadow-2xl md:text-8xl lg:text-9xl">
          {chapter.title}
        </h2>

        <div className="mt-8 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/90">
            {chapter.subtitle}
          </p>
          <p className="text-base leading-relaxed text-white/70 md:text-lg">
            {chapter.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

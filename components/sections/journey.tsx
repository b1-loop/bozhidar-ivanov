"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { journey, type JourneyChapter } from "@/lib/data";

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative"
      style={{ height: `${journey.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ProgressLine progress={scrollYProgress} />

        <div className="absolute inset-0">
          {journey.map((chapter, i) => (
            <Chapter
              key={chapter.id}
              chapter={chapter}
              index={i}
              total={journey.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.3em] text-muted">
          Resan · Scrolla för att fortsätta
        </div>
      </div>
    </section>
  );
}

function ProgressLine({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/5">
      <motion.div
        style={{ width }}
        className="h-full bg-gradient-to-r from-white/40 via-white to-white/40"
      />
    </div>
  );
}

function Chapter({
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
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;

  const opacity = useTransform(
    progress,
    [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [40, -40]);
  const scale = useTransform(progress, [start, mid, end], [0.98, 1, 0.98]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center px-6 md:px-10"
    >
      <motion.div
        style={{ y, scale }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="mb-8 flex items-center gap-4">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: chapter.accent }}
          />
          <span
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: chapter.accent }}
          >
            Kapitel {String(index + 1).padStart(2, "0")} · {chapter.year}
          </span>
        </div>

        <h2 className="font-display text-6xl leading-[1] tracking-tighter text-foreground md:text-8xl lg:text-9xl">
          {chapter.title}
        </h2>

        <div className="mt-8 max-w-2xl">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-wider"
            style={{ color: chapter.accent }}
          >
            {chapter.subtitle}
          </p>
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            {chapter.description}
          </p>
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${chapter.accent}15 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}

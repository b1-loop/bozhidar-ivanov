"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { personal } from "@/lib/data";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div className="noise" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-6xl px-6 text-center md:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-xs text-muted backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {personal.status}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl leading-[0.95] tracking-tighter text-foreground md:text-8xl lg:text-9xl"
        >
          Bozhidar
          <br />
          <span className="italic text-muted">Ivanov</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-xl text-lg text-muted md:text-xl"
        >
          {personal.tagline}
          <br />
          <span className="text-foreground/60">
            {personal.role} · {personal.location}
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#journey"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:scale-[1.02]"
          >
            Följ resan
            <span className="transition-transform group-hover:translate-x-0.5">↓</span>
          </a>
          <a
            href="#projects"
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-foreground/90 transition-all hover:border-white/40 hover:bg-white/5"
          >
            Se projekt
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted"
      >
        <span>SCROLL</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}

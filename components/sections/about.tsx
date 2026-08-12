"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { useContent, useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/content";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const GREETINGS: Record<Locale, Record<TimeOfDay, string>> = {
  en: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Still up?",
  },
  sv: {
    morning: "God morgon",
    afternoon: "God dag",
    evening: "God kväll",
    night: "Uppe sent?",
  },
};

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 23) return "evening";
  return "night";
}

function useTimeOfDay(): TimeOfDay | null {
  const [tod, setTod] = useState<TimeOfDay | null>(null);

  useEffect(() => {
    const compute = () => {
      // Bozhidar's local time (Europe/Stockholm)
      const now = new Date();
      const hour = Number(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Europe/Stockholm",
        }).format(now),
      );
      setTod(getTimeOfDay(hour));
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  return tod;
}

function GreetingBadge() {
  const { locale } = useLocale();
  const tod = useTimeOfDay();

  if (!tod) return null;
  const label = GREETINGS[locale][tod];
  const Icon =
    tod === "morning"
      ? Sunrise
      : tod === "afternoon"
        ? Sun
        : tod === "evening"
          ? Sunset
          : Moon;
  const color =
    tod === "morning"
      ? "#fbbf24"
      : tod === "afternoon"
        ? "#fde047"
        : tod === "evening"
          ? "#fb923c"
          : "#a78bfa";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm"
    >
      <Icon
        className="h-3.5 w-3.5"
        aria-hidden
        style={{
          color,
          filter: `drop-shadow(0 0 6px ${color}80)`,
        }}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">
        {label}
      </span>
    </motion.div>
  );
}

export function About() {
  const c = useContent();
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-white/5 py-32"
    >
      {/* Ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(50% 40% at 15% 0%, rgba(125,211,252,0.08) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 85% 100%, rgba(251,191,36,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <GreetingBadge />
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c.ui.about.section}
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.about.title1}
              <br />
              <span className="italic text-muted">{c.ui.about.title2}</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left rail: facts panel */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6">
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                  Quick facts
                </p>
                <dl className="space-y-4">
                  <FactRow label={c.ui.about.basedIn} value={c.personal.coordsCity.split(",")[0]} />
                  <FactRow label={c.ui.about.focus} value={c.ui.about.focusValue} />
                  <FactRow label={c.ui.about.seeking} value={c.ui.about.seekingValue} />
                </dl>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                    Available for work
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Right: statement + paragraphs */}
          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              &ldquo;
              <span className="italic">{c.ui.about.headline}</span>
              &rdquo;
            </motion.p>

            <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted md:text-xl">
              <AboutParagraph text={c.ui.about.p1} delay={0.2} />
              <AboutParagraph text={c.ui.about.p2} delay={0.28} />
              <AboutParagraph text={c.ui.about.p3} delay={0.36} />
            </div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 flex items-center gap-4"
            >
              <span className="h-px w-16 bg-white/20" />
              <span
                className="font-display text-xl italic text-foreground/70"
                style={{ transform: "rotate(-4deg)" }}
              >
                — {c.personal.name.split(" ")[0]}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutParagraph({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.p>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </dt>
      <dd className="text-right text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

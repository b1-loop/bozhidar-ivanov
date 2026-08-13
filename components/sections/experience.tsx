"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useContent } from "@/lib/i18n";
import type { Experience as ExperienceItem } from "@/lib/content";
import { AnimatedNumber } from "@/components/animated-number";

function isCurrent(period: string) {
  return /now|nu|present|nuvarande/i.test(period);
}

function inferCategory(role: string, company: string): {
  label: string;
  color: string;
} {
  const s = `${role} ${company}`.toLowerCase();
  if (s.includes("dev") || s.includes("stack") || s.includes("code"))
    return { label: "Development", color: "#7dd3fc" };
  if (s.includes("lead") || s.includes("project") || s.includes("manager"))
    return { label: "Leadership", color: "#a78bfa" };
  if (s.includes("ceo") || s.includes("founder") || s.includes("owner"))
    return { label: "Business", color: "#fbbf24" };
  if (s.includes("board") || s.includes("director") || s.includes("deputy"))
    return { label: "Governance", color: "#f472b6" };
  if (s.includes("operator") || s.includes("volvo") || s.includes("machine"))
    return { label: "Operations", color: "#34d399" };
  return { label: "Experience", color: "#94a3b8" };
}

export function Experience() {
  const c = useContent();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
    { stiffness: 100, damping: 30 },
  );

  const currentRoles = c.experience.filter((e) => isCurrent(e.period)).length;
  const totalRoles = c.experience.length;

  return (
    <section
      id="experience"
      className="relative overflow-hidden border-t border-white/5 py-32"
    >
      {/* Ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(50% 40% at 100% 0%, rgba(167,139,250,0.08) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 0% 100%, rgba(52,211,153,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c.ui.experience.section}
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.experience.title1}
              <br />
              <span className="italic text-muted">{c.ui.experience.title2}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <StatsPanel currentRoles={currentRoles} totalRoles={totalRoles} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div ref={timelineRef} className="relative">
              {/* Background line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
              {/* Animated fill line */}
              <motion.div
                style={{ height: lineHeight }}
                className="absolute left-[7px] top-2 w-px bg-gradient-to-b from-white/80 via-white/60 to-white/30"
              />

              <ol className="space-y-10">
                {c.experience.map((e, i) => (
                  <ExperienceCard key={`${e.company}-${e.role}`} item={e} index={i} />
                ))}
              </ol>
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pl-6"
          >
            <EducationCard label={c.ui.experience.educationLabel} />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) {
  const current = isCurrent(item.period);
  const cat = inferCategory(item.role, item.company);

  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-10"
    >
      {/* Timeline node */}
      <span
        aria-hidden
        className="absolute left-0 top-[6px] flex h-4 w-4 items-center justify-center"
      >
        {current ? (
          <>
            <span
              className="absolute h-4 w-4 animate-ping rounded-full opacity-70"
              style={{ background: cat.color }}
            />
            <span
              className="relative h-2.5 w-2.5 rounded-full border-2 border-background"
              style={{ background: cat.color, boxShadow: `0 0 12px ${cat.color}` }}
            />
          </>
        ) : (
          <span
            className="h-3 w-3 rounded-full border-2 border-background bg-white/20"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)" }}
          />
        )}
      </span>

      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 transition-all hover:border-white/25 md:p-7">
        {/* Hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
          style={{
            background: `radial-gradient(50% 60% at 30% 0%, ${cat.color}55 0%, transparent 70%)`,
          }}
        />

        <div className="relative">
          {/* Header row: period + category + current badge */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {item.period}
            </span>
            <span
              className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
              style={{
                borderColor: `${cat.color}55`,
                color: cat.color,
                background: `${cat.color}10`,
              }}
            >
              {cat.label}
            </span>
            {current && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-300">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Now
              </span>
            )}
          </div>

          <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground transition-colors group-hover:text-white md:text-3xl">
            {item.role}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <span className="h-px w-6 bg-white/20" />
            {item.company}
          </p>

          <ul className="mt-5 space-y-2 text-sm text-muted">
            {item.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                  style={{ background: cat.color, opacity: 0.7 }}
                />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.li>
  );
}

function StatsPanel({
  currentRoles,
  totalRoles,
}: {
  currentRoles: number;
  totalRoles: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-3 gap-2 sm:gap-3"
    >
      <StatItem value={8} suffix="+" label="Years" hint="in the workforce" />
      <StatItem value={totalRoles} label="Roles" hint="held to date" />
      <StatItem
        value={currentRoles}
        label="Active"
        hint="right now"
        accent
      />
    </motion.div>
  );
}

function StatItem({
  value,
  suffix,
  label,
  hint,
  accent,
}: {
  value: number;
  suffix?: string;
  label: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4 ${
        accent ? "ring-1 ring-emerald-500/20" : ""
      }`}
    >
      {accent && (
        <span className="absolute right-2 top-2 flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      )}
      <div className="font-display text-2xl leading-none tracking-tighter text-foreground sm:text-3xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </div>
      <div className="mt-0.5 hidden text-[10px] text-muted/70 sm:block">
        {hint}
      </div>
    </div>
  );
}

function EducationCard({ label }: { label: string }) {
  const c = useContent();
  return (
    <div className="sticky top-24 space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-6 md:p-8">
        {/* Accent orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #7dd3fc 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/80"
              >
                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
                <path d="M22 10v6" />
              </svg>
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {label}
            </p>
          </div>

          <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground md:text-3xl">
            {c.education.school}
          </h3>
          <p className="mt-1 text-sm text-muted">{c.education.program}</p>

          {/* Progress hint */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>Program</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: "72%" }}
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              Coursework
            </p>
            <div className="flex flex-wrap gap-1.5">
              {c.education.courses.map((course) => (
                <span
                  key={course}
                  className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-[11px] text-muted"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

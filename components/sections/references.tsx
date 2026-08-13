"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/i18n";
import type { Reference } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function relationFor(role: string, company: string): {
  label: string;
  color: string;
} {
  const s = `${role} ${company}`.toLowerCase();
  if (s.includes("owner") || s.includes("consult") || s.includes("director"))
    return { label: "Employer", color: "#7dd3fc" };
  if (s.includes("manager") || s.includes("lead"))
    return { label: "Manager", color: "#fbbf24" };
  if (s.includes("developer") || s.includes("engineer"))
    return { label: "Colleague", color: "#a78bfa" };
  return { label: "Reference", color: "#94a3b8" };
}

export function References() {
  const c = useContent();
  const [featured, ...rest] = c.references;

  return (
    <section
      id="references"
      className="relative overflow-hidden border-t border-white/5 py-32"
    >
      {/* Ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(50% 40% at 20% 20%, rgba(125,211,252,0.08) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 80% 80%, rgba(251,191,36,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c.ui.references.section}
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.references.title1}
              <br />
              <span className="italic text-muted">{c.ui.references.title2}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <p className="text-lg text-muted">
              Words from people I&apos;ve worked closely with — across
              engineering, leadership and production.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          {featured && (
            <FeaturedQuote
              reference={featured}
              className="md:col-span-6 lg:col-span-8 lg:row-span-2"
            />
          )}
          {rest.map((r, i) => (
            <CompactQuote
              key={r.name}
              reference={r}
              index={i}
              className="md:col-span-6 lg:col-span-4"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedQuote({
  reference,
  className,
}: {
  reference: Reference;
  className?: string;
}) {
  const rel = relationFor(reference.role, reference.company);
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-8 transition-all hover:border-white/25 md:p-10 ${className ?? ""}`}
    >
      {/* Ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-50"
        style={{
          background: `radial-gradient(circle, ${rel.color}88, transparent 70%)`,
        }}
      />

      {/* Giant decorative quote */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 left-4 font-display leading-none text-white/[0.06]"
        style={{ fontSize: "clamp(5rem, 20vw, 16rem)" }}
      >
        &ldquo;
      </div>

      <div className="relative flex flex-1 flex-col">
        <div className="mb-6 flex items-center gap-2">
          <span
            className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{
              borderColor: `${rel.color}55`,
              color: rel.color,
              background: `${rel.color}12`,
            }}
          >
            {rel.label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Featured
          </span>
        </div>

        <blockquote className="flex-1">
          <p className="font-display text-2xl italic leading-snug text-foreground md:text-3xl lg:text-4xl">
            {reference.quote}
          </p>
        </blockquote>

        <figcaption className="mt-10 flex items-center gap-4 border-t border-white/5 pt-6">
          <Avatar name={reference.name} color={rel.color} large />
          <div>
            <p className="text-base font-medium text-foreground">
              {reference.name}
            </p>
            <p className="text-sm text-muted">
              {reference.role} · {reference.company}
            </p>
          </div>
        </figcaption>
      </div>
    </motion.figure>
  );
}

function CompactQuote({
  reference,
  index,
  className,
}: {
  reference: Reference;
  index: number;
  className?: string;
}) {
  const rel = relationFor(reference.role, reference.company);
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 transition-all hover:border-white/25 ${className ?? ""}`}
    >
      {/* Corner accent orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50"
        style={{
          background: `radial-gradient(circle, ${rel.color}, transparent 70%)`,
        }}
      />

      {/* Small quote mark */}
      <div
        aria-hidden
        className="mb-4 font-display text-5xl leading-none text-white/15"
      >
        &ldquo;
      </div>

      <div className="relative">
        <div className="mb-3">
          <span
            className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
            style={{
              borderColor: `${rel.color}55`,
              color: rel.color,
              background: `${rel.color}12`,
            }}
          >
            {rel.label}
          </span>
        </div>

        <blockquote>
          <p className="text-base leading-relaxed text-foreground/90">
            {reference.quote}
          </p>
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
          <Avatar name={reference.name} color={rel.color} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {reference.name}
            </p>
            <p className="truncate text-xs text-muted">
              {reference.role} · {reference.company}
            </p>
          </div>
        </figcaption>
      </div>
    </motion.figure>
  );
}

function Avatar({
  name,
  color,
  large,
}: {
  name: string;
  color: string;
  large?: boolean;
}) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-full font-display font-medium text-white ${
        large ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm"
      }`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}55)`,
        boxShadow: `0 0 0 1px ${color}44, 0 0 20px ${color}33`,
      }}
      aria-hidden
    >
      {initials(name)}
      {/* Subtle inner highlight */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%)",
        }}
      />
    </span>
  );
}

"use client";

import { TransitionLink as Link } from "@/components/transition-link";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { useContent } from "@/lib/i18n";
import type { Project } from "@/lib/content";

// Colored gradient per project — used in the visual header of each card
function accentFor(type: string): string {
  const k = type.toLowerCase();
  if (k.includes("fintech") || k.includes("pay")) return "#7dd3fc"; // cyan
  if (k.includes("ai") || k.includes("assist")) return "#a78bfa"; // purple
  if (k.includes("client") || k.includes("kund")) return "#fbbf24"; // amber
  if (k.includes("web app") || k.includes("web")) return "#34d399"; // emerald
  if (k.includes("portal") || k.includes("dashboard")) return "#f472b6"; // pink
  if (k.includes("finance") || k.includes("salary")) return "#f97316"; // orange
  if (k.includes("database") || k.includes("first")) return "#60a5fa"; // blue
  if (k.includes("api")) return "#22d3ee"; // sky
  if (k.includes("scalable") || k.includes("skalbart")) return "#a3e635"; // lime
  if (k.includes("productiv") || k.includes("produktiv")) return "#fb7185"; // rose
  if (k.includes("logic") || k.includes("logik")) return "#c084fc"; // violet
  return "#94a3b8"; // slate default
}

export function Projects() {
  const c = useContent();
  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-white/5 py-32"
    >
      {/* Ambient background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(50% 40% at 0% 0%, rgba(125,211,252,0.08) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 100% 100%, rgba(251,191,36,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c.ui.projects.section}
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.projects.title1}
              <br />
              <span className="italic text-muted">{c.ui.projects.title2}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <p className="text-lg text-muted">{c.ui.projects.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12">
          {c.projects.map((p, i) => {
            const span = p.featured
              ? "sm:col-span-2 md:col-span-6 lg:col-span-6"
              : "md:col-span-3 lg:col-span-4";
            return (
              <ProjectCard
                key={p.name}
                project={p}
                index={i}
                className={span}
                liveLabel={c.ui.projects.live}
              />
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href={c.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm text-foreground/90 transition-all hover:border-white/40 hover:bg-white/5"
          >
            <GithubIcon className="h-4 w-4" />
            {c.ui.projects.allRepos}
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  className,
  liveLabel,
}: {
  project: Project;
  index: number;
  className?: string;
  liveLabel: string;
}) {
  const accent = accentFor(project.type);
  const hasCaseStudy = !!project.slug && !!project.caseStudy;
  const primaryHref = hasCaseStudy
    ? `/projects/${project.slug}`
    : project.demo || project.github || "#";
  const isInternal = hasCaseStudy;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition-all hover:border-white/25 ${className ?? ""}`}
    >
      {/* Colored header strip / visual */}
      <div
        aria-hidden
        className="relative h-32 overflow-hidden"
        style={{
          background:
            `radial-gradient(120% 100% at 15% 20%, ${accent}55 0%, ${accent}15 45%, transparent 75%), ` +
            "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        }}
      >
        {/* Diagonal grid pattern */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "repeating-linear-gradient(45deg, transparent 0, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)",
          }}
        />
        {/* Accent orb */}
        <div
          className="absolute -top-8 -right-8 h-40 w-40 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
          style={{
            background: `radial-gradient(circle, ${accent}, transparent 70%)`,
          }}
        />
        {/* Number */}
        <div className="absolute top-4 left-5 font-mono text-[10px] uppercase tracking-widest text-white/60">
          {String(index + 1).padStart(2, "0")} · {project.type}
        </div>
        {/* Live badge */}
        {project.live && (
          <div className="absolute top-4 right-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {liveLabel}
          </div>
        )}
        {/* Big open arrow at bottom-right of header */}
        {isInternal ? (
          <Link
            href={primaryHref}
            aria-label={`Read ${project.name} case study`}
            className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all group-hover:scale-110 group-hover:border-white/50 group-hover:bg-white group-hover:text-black"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : (
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name}`}
            className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all group-hover:scale-110 group-hover:border-white/50 group-hover:bg-white group-hover:text-black"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Card body */}
      <div className="p-6">
        <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground transition-colors group-hover:text-white md:text-3xl">
          {project.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted transition-colors group-hover:border-white/25 group-hover:text-foreground/80"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {hasCaseStudy && (
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors"
              style={{
                borderColor: `${accent}55`,
                color: accent,
                background: `${accent}12`,
              }}
              aria-label={`Case study for ${project.name}`}
            >
              Case study
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted transition-colors hover:border-white/30 hover:text-foreground"
              aria-label={`GitHub for ${project.name}`}
            >
              <GithubIcon className="h-3 w-3" />
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted transition-colors hover:border-white/30 hover:text-foreground"
              aria-label={`Live site for ${project.name}`}
            >
              <ExternalLink className="h-3 w-3" />
              Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

"use client";

import { TransitionLink as Link } from "@/components/transition-link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Check,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Nav } from "@/components/nav";
import { useContent } from "@/lib/i18n";
import type { CaseStudy, Project } from "@/lib/content";

export function CaseStudyView({ slug }: { slug: string }) {
  const c = useContent();
  const project = c.projects.find((p) => p.slug === slug);
  if (!project || !project.caseStudy) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest">
            Case study not found
          </p>
          <Link
            href="/#projects"
            className="mt-4 inline-flex items-center gap-2 text-sm text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </main>
    );
  }

  const cs = project.caseStudy;
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <CaseStudyHero project={project} cs={cs} />
      <Overview project={project} cs={cs} />
      <Sections cs={cs} />
      <Outcomes cs={cs} />
      <StackBreakdown cs={cs} />
      <CTA cs={cs} />
      <Footer cs={cs} />
    </main>
  );
}

function CaseStudyHero({
  project,
  cs,
}: {
  project: Project;
  cs: CaseStudy;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(60% 50% at 50% 0%, ${cs.accent}22 0%, transparent 60%), radial-gradient(50% 40% at 20% 100%, ${cs.accent}18 0%, transparent 60%)`,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Link
          href="/#projects"
          className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          {cs.labels.backToProjects}
        </Link>

        <div className="flex items-center gap-3">
          <span
            className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{
              borderColor: `${cs.accent}55`,
              color: cs.accent,
              background: `${cs.accent}12`,
            }}
          >
            {cs.labels.caseStudy}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {project.type}
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-6xl leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl"
        >
          {project.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mt-8 max-w-3xl font-display text-2xl italic leading-snug text-muted md:text-3xl"
        >
          {cs.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
            >
              <ExternalLink className="h-4 w-4" />
              {cs.labels.liveButton}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-5 py-2.5 text-sm text-foreground/90 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/5"
            >
              <GithubIcon className="h-4 w-4" />
              {cs.labels.githubButton}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Overview({ project, cs }: { project: Project; cs: CaseStudy }) {
  return (
    <section className="relative border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {cs.labels.overviewHeading}
            </p>
            <p className="text-xl leading-relaxed text-foreground/90 md:text-2xl">
              {cs.overview}
            </p>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6">
              <dl className="space-y-4">
                <MetaRow label={cs.labels.roleLabel} value={cs.role} />
                <MetaRow label={cs.labels.yearLabel} value={cs.year} />
                <MetaRow label={cs.labels.typeLabel} value={project.type} />
                <MetaRow
                  label={cs.labels.statusLabel}
                  value={project.live ? cs.labels.statusLive : cs.labels.statusDev}
                  status={project.live ? "live" : "dev"}
                />
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Sections({ cs }: { cs: CaseStudy }) {
  return (
    <div className="relative border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="space-y-24">
          {cs.sections.map((s, i) => (
            <motion.section
              key={s.heading}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-10 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 font-display text-3xl leading-[1] tracking-tighter md:text-5xl">
                    {s.heading}
                  </h3>
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-lg leading-relaxed text-muted md:text-xl">
                  {s.body}
                </p>
                {s.bullets && (
                  <ul className="mt-6 space-y-3">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-base text-foreground/90"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: cs.accent }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Outcomes({ cs }: { cs: CaseStudy }) {
  return (
    <section className="relative border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {cs.labels.outcomesHeading}
            </p>
            <h3 className="font-display text-4xl leading-[1] tracking-tighter md:text-6xl">
              What
              <br />
              <span className="italic text-muted">it delivered</span>
            </h3>
          </div>
          <ul className="grid grid-cols-1 gap-4 lg:col-span-8">
            {cs.outcomes.map((o, i) => (
              <motion.li
                key={o}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `${cs.accent}20`,
                    color: cs.accent,
                    boxShadow: `0 0 15px ${cs.accent}22`,
                  }}
                >
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-base leading-relaxed text-foreground/90">
                  {o}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StackBreakdown({ cs }: { cs: CaseStudy }) {
  return (
    <section className="relative border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
            {cs.labels.stackHeading}
          </p>
          <h3 className="font-display text-4xl leading-[1] tracking-tighter md:text-6xl">
            The <span className="italic text-muted">tech</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cs.stack.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5"
            >
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted">
                {group.category}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-[11px] text-foreground/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ cs }: { cs: CaseStudy }) {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, ${cs.accent}15 0%, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <h3 className="font-display text-4xl leading-tight tracking-tighter md:text-6xl">
          {cs.labels.ctaHeading}
        </h3>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          {cs.labels.ctaBody}
        </p>
        <Link
          href="/#contact"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
        >
          {cs.labels.ctaButton}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}

function Footer({ cs }: { cs: CaseStudy }) {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 font-mono text-xs text-muted md:px-10">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          {cs.labels.backToProjects}
        </Link>
        <span>© {new Date().getFullYear()} Bozhidar Ivanov</span>
      </div>
    </footer>
  );
}

function MetaRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "live" | "dev";
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </dt>
      <dd className="flex items-center gap-2 text-right text-sm font-medium text-foreground">
        {status === "live" && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
        )}
        {value}
      </dd>
    </div>
  );
}

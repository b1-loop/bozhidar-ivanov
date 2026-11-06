"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, FileDown, ArrowUpRight, Languages } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Portrait } from "@/components/portrait";
import { CopyButton } from "@/components/copy-button";
import { useContent } from "@/lib/i18n";
import { SectionBackdrop } from "@/components/section-backdrop";
import { BoardingPass } from "@/components/boarding-pass";

export function Contact() {
  const c = useContent();
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-32"
    >
      <SectionBackdrop variant="contact" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-5">
              <Portrait name={c.personal.name} size={80} glow />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                  {c.personal.name}
                </p>
                <p className="mt-1 text-sm text-foreground/80">
                  {c.personal.role}
                </p>
              </div>
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c.ui.contact.section}
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.contact.title1}
              <br />
              <span className="italic text-muted">{c.ui.contact.title2}</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-4">
            <AvailabilityStatus />
            <p className="mt-4 text-lg text-muted">
              {c.ui.contact.description}
            </p>
          </div>
        </div>

        {/* Boarding pass — the flight lands here */}
        <BoardingPass />

        {/* All contact routes in one compact panel (no duplicate CTA row / bento cards) */}
        <ContactBar />

        {/* Built with strip */}
        <BuiltWith />

        {/* Footer */}
        <footer className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {c.personal.name}. {c.ui.contact.footer}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={c.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <span className="text-white/20">/</span>
            <a
              href={c.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <span className="text-white/20">/</span>
            <span className="font-mono">{c.ui.contact.version}</span>
          </div>
        </footer>
      </div>
    </section>
  );
}

/**
 * Every contact route in one panel under the boarding pass, styled like the
 * pass's information strip: labelled columns with hairline dividers, and a
 * footer band with location, languages and the CV.
 */
function ContactBar() {
  const c = useContent();
  const handle = `@${c.personal.github.replace(/\/$/, "").split("/").pop() ?? ""}`;
  const routes = [
    {
      key: "email",
      label: c.ui.contact.email,
      value: c.personal.email,
      href: `mailto:${c.personal.email}`,
      icon: <Mail className="h-4 w-4" />,
      color: "#7dd3fc",
      copy: c.personal.email,
      wide: true,
    },
    {
      key: "phone",
      label: c.ui.contact.phone,
      value: c.personal.phone,
      href: `tel:${c.personal.phone.replace(/\s/g, "")}`,
      icon: <Phone className="h-4 w-4" />,
      color: "#34d399",
      copy: c.personal.phone,
    },
    {
      key: "github",
      label: "GitHub",
      value: handle,
      href: c.personal.github,
      icon: <GithubIcon className="h-4 w-4" />,
      color: "#c084fc",
      external: true,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      value: c.personal.name,
      href: c.personal.linkedin,
      icon: <LinkedinIcon className="h-4 w-4" />,
      color: "#60a5fa",
      external: true,
      // full width on phones so it doesn't sit alone next to an empty cell
      last: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
    >
      {/* same colour stripe as the boarding pass */}
      <div aria-hidden className="h-[3px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 opacity-80" />

      {/* routes */}
      <div className="grid grid-cols-2 divide-white/[0.07] lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:divide-x">
        {routes.map((r) => (
          <a
            key={r.key}
            href={r.href}
            target={r.external ? "_blank" : undefined}
            rel={r.external ? "noopener noreferrer" : undefined}
            className={`group relative flex min-h-[92px] flex-col justify-between gap-3 border-white/[0.07] p-5 transition-colors hover:bg-white/[0.03] max-lg:border-b ${
              r.wide || r.last ? "col-span-2 lg:col-span-1" : r.key === "phone" ? "max-lg:border-r" : ""
            } ${r.last ? "max-lg:border-b-0" : ""}`}
          >
            {/* hover glow in the route's colour */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: `radial-gradient(80% 120% at 0% 0%, ${r.color}14, transparent 60%)` }}
            />
            {/* fixed height so every value lines up, with or without a copy button */}
            <span className="relative flex h-7 items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                <span style={{ color: r.color }}>{r.icon}</span>
                {r.label}
              </span>
              {r.copy ? (
                <CopyButton value={r.copy} className="relative z-10 opacity-60 transition-opacity group-hover:opacity-100 max-lg:opacity-100" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-white/35 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              )}
            </span>
            <span
              className={`relative block truncate text-white transition-colors ${
                r.wide ? "font-display text-2xl tracking-tight sm:text-[1.7rem]" : "text-[15px] font-medium"
              }`}
            >
              {r.value}
            </span>
          </a>
        ))}
      </div>

      {/* footer band: where I am, what I speak, and the CV */}
      <div className="flex flex-col gap-4 border-t border-white/[0.07] bg-black/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4 text-amber-300" />
            {c.personal.location}
          </span>
          <span className="hidden h-4 w-px bg-white/10 sm:block" />
          <span className="flex flex-wrap items-center gap-1.5">
            <Languages className="mr-0.5 h-4 w-4 text-pink-300" />
            {c.personal.languages.map((l) => (
              <span
                key={l.name}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-white/85"
                title={l.level}
              >
                {l.name}
                <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider text-white/40">{l.level}</span>
              </span>
            ))}
          </span>
        </div>
        <a
          href={c.personal.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
        >
          <FileDown className="h-4 w-4" />
          {c.ui.contact.downloadCv}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.div>
  );
}

function AvailabilityStatus() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(d));
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
        Available · GMT+1
      </span>
      <span className="font-mono text-[10px] tabular-nums text-white/50">
        {time}
      </span>
    </div>
  );
}



const BUILT_WITH = [
  { name: "Next.js 16", href: "https://nextjs.org" },
  { name: "React 19", href: "https://react.dev" },
  { name: "TypeScript", href: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS 4", href: "https://tailwindcss.com" },
  { name: "Framer Motion", href: "https://motion.dev" },
  { name: "Lenis", href: "https://github.com/darkroomengineering/lenis" },
  { name: "Vercel", href: "https://vercel.com" },
];

function BuiltWith() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 md:p-7"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/50"
            aria-hidden
          >
            <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.3-2.3 2.6-2.6z" />
          </svg>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Built with
          </p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {BUILT_WITH.map((tech) => (
            <li key={tech.name}>
              <a
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-muted transition-colors hover:border-white/30 hover:bg-white/[0.05] hover:text-foreground"
              >
                {tech.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}


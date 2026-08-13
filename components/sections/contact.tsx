"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, FileDown, ArrowUpRight, Calendar } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Portrait } from "@/components/portrait";
import { CopyButton } from "@/components/copy-button";
import { useContent } from "@/lib/i18n";

export function Contact() {
  const c = useContent();
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/5 py-32"
    >
      {/* Ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(125,211,252,0.10) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 20% 100%, rgba(52,211,153,0.08) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 90% 60%, rgba(167,139,250,0.08) 0%, transparent 60%)",
        }}
      />

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

        {/* Primary CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-6 flex flex-wrap gap-3"
        >
          <a
            href={`mailto:${c.personal.email}`}
            className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
          >
            <Mail className="h-4 w-4" />
            {c.ui.contact.mailMe}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href={c.personal.cal}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 rounded-full border border-emerald-500/40 bg-emerald-500/[0.06] px-7 py-4 text-sm font-medium text-emerald-100 backdrop-blur-md transition-all hover:border-emerald-400/60 hover:bg-emerald-500/[0.12]"
          >
            <Calendar className="h-4 w-4 text-emerald-300" />
            {c.ui.contact.bookCall}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={c.personal.cv}
            download
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-4 text-sm text-foreground/90 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/5"
          >
            <FileDown className="h-4 w-4" />
            {c.ui.contact.downloadCv}
          </a>
        </motion.div>

        {/* Contact bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          {/* Featured: Email — largest */}
          <ContactBigCard
            href={`mailto:${c.personal.email}`}
            icon={<Mail className="h-5 w-5" />}
            label={c.ui.contact.email}
            value={c.personal.email}
            accent="#7dd3fc"
            className="md:col-span-6 lg:col-span-6"
            note="Fastest way to reach me"
            copyValue={c.personal.email}
          />

          {/* Phone */}
          <ContactCard
            href={`tel:${c.personal.phone.replace(/\s/g, "")}`}
            icon={<Phone className="h-5 w-5" />}
            label={c.ui.contact.phone}
            value={c.personal.phone}
            accent="#34d399"
            className="md:col-span-3 lg:col-span-3"
            copyValue={c.personal.phone}
          />

          {/* Location */}
          <ContactCard
            icon={<MapPin className="h-5 w-5" />}
            label={c.ui.contact.location}
            value={c.personal.location}
            accent="#fbbf24"
            className="md:col-span-3 lg:col-span-3"
          />

          {/* GitHub */}
          <ContactCard
            href={c.personal.github}
            icon={<GithubIcon className="h-5 w-5" />}
            label={c.ui.contact.github}
            value={`@${c.personal.github.replace(/\/$/, "").split("/").pop() ?? ""}`}
            accent="#a78bfa"
            className="md:col-span-3 lg:col-span-4"
          />

          {/* LinkedIn */}
          <ContactCard
            href={c.personal.linkedin}
            icon={<LinkedinIcon className="h-5 w-5" />}
            label={c.ui.contact.linkedin}
            value={c.personal.name}
            accent="#60a5fa"
            className="md:col-span-3 lg:col-span-4"
          />

          {/* Languages */}
          <LanguagesCard className="md:col-span-6 lg:col-span-4" />
        </div>

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

function ContactBigCard({
  href,
  icon,
  label,
  value,
  accent,
  className,
  note,
  copyValue,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  className?: string;
  note?: string;
  copyValue?: string;
}) {
  const inner = (
    <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
      {/* Accent orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-50"
        style={{
          background: `radial-gradient(circle, ${accent}, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors group-hover:border-white/25"
              style={{ color: accent }}
            >
              {icon}
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                {label}
              </p>
              {note && (
                <p className="mt-0.5 text-[10px] text-muted/70">{note}</p>
              )}
            </div>
          </div>
          {copyValue && <CopyButton value={copyValue} />}
        </div>

        <p className="font-display text-2xl leading-tight tracking-tight text-foreground transition-colors group-hover:text-white md:text-4xl">
          {value}
        </p>
      </div>

      <div className="relative mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors group-hover:text-foreground/80">
        <span>Get in touch</span>
        <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] transition-all hover:border-white/25 ${className ?? ""}`}
    >
      {href ? (
        <a href={href} className="block h-full">
          {inner}
        </a>
      ) : (
        inner
      )}
    </motion.div>
  );
}

function ContactCard({
  href,
  icon,
  label,
  value,
  accent,
  className,
  copyValue,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  className?: string;
  copyValue?: string;
}) {
  const inner = (
    <div className="relative flex h-full flex-col justify-between p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50"
        style={{
          background: `radial-gradient(circle, ${accent}, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors group-hover:border-white/25"
            style={{ color: accent }}
          >
            {icon}
          </span>
          <div className="flex items-center gap-2">
            {copyValue && <CopyButton value={copyValue} />}
            {href && (
              <ArrowUpRight className="h-4 w-4 text-white/30 transition-colors group-hover:text-white/70" />
            )}
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          {label}
        </p>
        <p className="mt-1 truncate text-base font-medium text-foreground md:text-lg">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] transition-all hover:border-white/25 ${className ?? ""}`}
    >
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="block h-full"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </motion.div>
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
      className="mt-24 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 md:p-7"
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

function LanguagesCard({ className }: { className?: string }) {
  const c = useContent();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{
          background: "radial-gradient(circle, #f472b6, transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-pink-300">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            {c.ui.contact.languages}
          </p>
        </div>

        <ul className="space-y-2.5">
          {c.personal.languages.map((l) => (
            <li
              key={l.name}
              className="flex items-center justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-sm text-foreground">{l.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {l.level}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

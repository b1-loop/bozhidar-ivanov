"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, FileDown } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { personal } from "@/lib/data";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative border-t border-white/5 py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              06 · Kontakt
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl">
              Låt oss<br />
              <span className="italic text-muted">bygga något.</span>
            </h2>
            <p className="mt-8 max-w-md text-lg text-muted">
              Öppen för LIA, juniora fullstack- och .NET-roller. Bor i Göteborg,
              redo att flytta för rätt team. Skriv gärna — jag svarar alltid.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${personal.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:scale-[1.02]"
              >
                <Mail className="h-4 w-4" />
                Maila mig
              </a>
              <a
                href={personal.cv}
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-foreground/90 transition-all hover:border-white/40 hover:bg-white/5"
              >
                <FileDown className="h-4 w-4" />
                Ladda ner CV
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <ContactRow icon={<Mail className="h-4 w-4" />} label="E-post" value={personal.email} href={`mailto:${personal.email}`} />
            <ContactRow icon={<Phone className="h-4 w-4" />} label="Telefon" value={personal.phone} href={`tel:${personal.phone.replace(/\s/g, "")}`} />
            <ContactRow icon={<MapPin className="h-4 w-4" />} label="Plats" value={personal.location} />
            <ContactRow icon={<GithubIcon className="h-4 w-4" />} label="GitHub" value="@b1-loop" href={personal.github} />
            <ContactRow icon={<LinkedinIcon className="h-4 w-4" />} label="LinkedIn" value="Bozhidar Ivanov" href={personal.linkedin} full />
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:col-span-2">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                Språk
              </p>
              <ul className="flex flex-wrap gap-4 text-sm">
                {personal.languages.map((l) => (
                  <li key={l.name} className="flex items-baseline gap-2">
                    <span className="text-foreground">{l.name}</span>
                    <span className="text-muted">— {l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <footer className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {personal.name}. Byggd med Next.js &
            omtanke.
          </p>
          <p className="font-mono">v2 · Göteborg</p>
        </footer>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  full?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
        <p className="truncate text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
  const cls = `rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] ${full ? "sm:col-span-2" : ""}`;
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

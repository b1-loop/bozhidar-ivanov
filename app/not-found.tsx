"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RadioTower } from "lucide-react";
import { Nav } from "@/components/nav";
import { TransitionLink } from "@/components/transition-link";
import { useLocale } from "@/lib/i18n";

const COPY = {
  en: {
    tag: "Signal lost",
    heading1: "Off",
    heading2: "course.",
    body: "This route isn't on the flight plan. The tower has no record of it — likely a mistyped URL or a page that's been re-routed.",
    metaCoords: "Coords",
    metaCoordsValue: "N —°—' / E —°—'",
    metaAlt: "Altitude",
    metaAltValue: "Unknown",
    metaStatus: "Status",
    metaStatusValue: "No signal",
    cta: "Return to base",
    hint: "Or use the top nav — every section is one hop away.",
  },
  sv: {
    tag: "Signalen borta",
    heading1: "Ur",
    heading2: "kurs.",
    body: "Den här rutten finns inte i flygplanen. Tornet har ingen registrering — troligen felstavad URL eller en sida som ändrat plats.",
    metaCoords: "Koord.",
    metaCoordsValue: "N —°—' / E —°—'",
    metaAlt: "Höjd",
    metaAltValue: "Okänd",
    metaStatus: "Status",
    metaStatusValue: "Ingen signal",
    cta: "Tillbaka till basen",
    hint: "Eller använd navet — varje sektion är ett hopp bort.",
  },
} as const;

export default function NotFound() {
  const { locale } = useLocale();
  const t = COPY[locale];

  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(new Date()));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% 50%, #0d1224 0%, #06070f 60%, #000 100%)",
      }}
    >
      <Nav />

      {/* Ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[540px] w-[540px] rounded-full opacity-40 blur-3xl"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#7dd3fc_0%,transparent_60%)]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full opacity-25 blur-3xl"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#a78bfa_0%,transparent_60%)]" />
      </div>

      {/* Beacon pulses (radar-style rings) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.35, 0], scale: [0.2, 1.2, 1.6] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: "easeOut",
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25"
            style={{ width: 480, height: 480, left: 0, top: 0 }}
          />
        ))}
      </div>

      <div className="noise opacity-30" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-32 text-center md:px-10">
        {/* 404 tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 backdrop-blur-xl"
        >
          <RadioTower className="h-3 w-3 text-white/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
            {t.tag} · 404
          </span>
        </motion.div>

        {/* Big heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[0.9] tracking-tighter text-white"
        >
          <span className="block text-[clamp(4rem,14vw,10rem)]">
            {t.heading1}
          </span>
          <span className="block text-[clamp(4rem,14vw,10rem)] italic text-white/80">
            {t.heading2}
          </span>
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-8 max-w-lg text-base text-white/70 md:text-lg"
        >
          {t.body}
        </motion.p>

        {/* HUD metadata */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <HudCell label={t.metaCoords} value={t.metaCoordsValue} />
          <HudCell label={t.metaAlt} value={t.metaAltValue} />
          <HudCell label={t.metaStatus} value={t.metaStatusValue} pulse />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <TransitionLink
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {t.cta}
          </TransitionLink>
          <p className="max-w-md font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {t.hint}
          </p>
        </motion.div>

        {/* Time (bottom-right) */}
        <div className="pointer-events-none absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-widest text-white/40 md:bottom-10 md:right-10">
          <div>SYS TIME · GMT+1</div>
          <div className="tabular-nums text-white/70">{time}</div>
        </div>
      </div>
    </main>
  );
}

function HudCell({
  label,
  value,
  pulse,
}: {
  label: string;
  value: string;
  pulse?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          {label}
        </p>
        {pulse && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-sm tabular-nums text-white/90">
        {value}
      </p>
    </div>
  );
}

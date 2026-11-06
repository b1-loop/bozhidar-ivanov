"use client";

import { motion } from "framer-motion";
import { encode } from "uqr";
import { ArrowUpRight, Plane } from "lucide-react";
import { useContent, useLocale } from "@/lib/i18n";

/**
 * The contact section's boarding pass: passenger Bozhidar Ivanov, from GOT to
 * "your team". The stub carries a real, scannable QR code (LinkedIn) and a
 * "book a call" tear-off.
 */

const COPY = {
  en: {
    pass: "Boarding pass",
    airline: "BI Airways",
    passenger: "Passenger",
    from: "From",
    to: "To",
    gothenburg: "Gothenburg",
    yourTeam: "Your team",
    flight: "Flight",
    date: "Date",
    anyDay: "Any day",
    boarding: "Boarding",
    now: "Now",
    gate: "Gate",
    open: "Open",
    seat: "Seat",
    cls: "Class",
    clsValue: ".NET · AI",
    scan: "Scan · LinkedIn",
    book: "Book a call",
    tear: "Tear here",
  },
  sv: {
    pass: "Boardingkort",
    airline: "BI Airways",
    passenger: "Passagerare",
    from: "Från",
    to: "Till",
    gothenburg: "Göteborg",
    yourTeam: "Ditt team",
    flight: "Flyg",
    date: "Datum",
    anyDay: "Valfri dag",
    boarding: "Boarding",
    now: "Nu",
    gate: "Gate",
    open: "Öppen",
    seat: "Plats",
    cls: "Klass",
    clsValue: ".NET · AI",
    scan: "Skanna · LinkedIn",
    book: "Boka samtal",
    tear: "Riv här",
  },
} as const;

function QrCode({ value, className }: { value: string; className?: string }) {
  const { data, size } = encode(value, { border: 0 });
  let d = "";
  data.forEach((row, y) =>
    row.forEach((on, x) => {
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }),
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} shapeRendering="crispEdges" role="img" aria-label="QR code">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6b6458]">{label}</p>
      <p className={`mt-0.5 font-mono uppercase tracking-wide text-[#16130f] ${strong ? "text-base font-semibold" : "text-sm font-medium"}`}>
        {value}
      </p>
    </div>
  );
}

export function BoardingPass() {
  const c = useContent();
  const { locale } = useLocale();
  const t = COPY[locale];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, rotate: -0.4 }}
      className="relative mb-10 flex flex-col overflow-hidden rounded-2xl bg-[#f3efe6] text-[#16130f] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] md:flex-row"
    >
      {/* paper texture + colour stripe */}
      <div className="noise opacity-[0.25] mix-blend-multiply" />
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500" />

      {/* ---------------- Main part ---------------- */}
      <div className="relative flex-1 p-6 pt-8 sm:p-8 sm:pt-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16130f] text-[#f3efe6]">
              <Plane className="h-3.5 w-3.5 -rotate-45" />
            </span>
            <span className="font-display text-xl tracking-tight">{t.airline}</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6b6458]">{t.pass}</span>
        </div>

        <Field label={t.passenger} value={c.personal.name} strong />

        {/* Route */}
        <div className="my-6 flex items-center gap-3 sm:gap-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6b6458]">{t.from}</p>
            <p className="font-display text-5xl leading-none tracking-tight sm:text-6xl">GOT</p>
            <p className="mt-1 text-xs text-[#6b6458]">{t.gothenburg}</p>
          </div>
          <div className="relative flex flex-1 items-center">
            <div className="w-full border-t-2 border-dashed border-[#16130f]/40" />
            <Plane className="absolute left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 fill-[#16130f] text-[#16130f]" />
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6b6458]">{t.to}</p>
            <p className="font-display text-5xl leading-none tracking-tight sm:text-6xl">YOU</p>
            <p className="mt-1 text-xs text-[#6b6458]">{t.yourTeam}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-4 sm:grid-cols-6">
          <Field label={t.flight} value="BI-2026" />
          <Field label={t.date} value={t.anyDay} />
          <Field label={t.boarding} value={t.now} />
          <Field label={t.gate} value={t.open} />
          <Field label={t.seat} value="1A" />
          <Field label={t.cls} value={t.clsValue} />
        </div>

        {/* decorative barcode */}
        <div
          aria-hidden
          className="mt-6 h-9 w-full max-w-sm opacity-80"
          style={{
            background:
              "repeating-linear-gradient(90deg, #16130f 0 2px, transparent 2px 4px, #16130f 4px 5px, transparent 5px 8px, #16130f 8px 11px, transparent 11px 12px, #16130f 12px 13px, transparent 13px 16px)",
          }}
        />
      </div>

      {/* ---------------- Perforation ---------------- */}
      <div aria-hidden className="relative flex md:w-0 md:flex-col">
        <div className="mx-6 flex-1 border-t-2 border-dashed border-[#16130f]/35 md:mx-0 md:my-6 md:border-l-2 md:border-t-0" />
        {/* notches */}
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0b0d16] md:left-1/2 md:top-0 md:-translate-x-1/2 md:-translate-y-1/2" />
        <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0b0d16] md:bottom-0 md:left-1/2 md:right-auto md:top-auto md:-translate-x-1/2 md:translate-y-1/2" />
      </div>

      {/* ---------------- Stub ---------------- */}
      <div className="relative flex flex-row items-center gap-5 p-6 sm:p-8 md:w-64 md:flex-col md:items-stretch md:justify-between">
        <div className="flex flex-col items-center">
          <a
            href={c.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white p-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] transition-transform hover:scale-[1.03]"
          >
            <QrCode value={c.personal.linkedin} className="h-24 w-24 text-[#16130f] sm:h-28 sm:w-28" />
          </a>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6b6458]">{t.scan}</p>
        </div>

        <div className="flex flex-1 flex-col gap-3 md:flex-none">
          <div className="hidden grid-cols-2 gap-3 md:grid">
            <Field label={t.seat} value="1A" />
            <Field label={t.gate} value={t.open} />
          </div>
          <a
            href={c.personal.cal}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#16130f] px-5 py-3 text-sm font-medium text-[#f3efe6] transition-transform hover:scale-[1.02]"
          >
            {t.book}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.3em] text-[#6b6458]">✂ {t.tear}</p>
        </div>
      </div>
    </motion.div>
  );
}

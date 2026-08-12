"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/i18n";
import type { SkillGroup } from "@/lib/content";

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const key = category.toLowerCase();
  const stroke = "currentColor";
  const props = {
    className,
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (key.startsWith("back")) {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="6" rx="1" />
        <rect x="3" y="14" width="18" height="6" rx="1" />
        <circle cx="7" cy="7" r="0.5" fill={stroke} />
        <circle cx="7" cy="17" r="0.5" fill={stroke} />
      </svg>
    );
  }
  if (key.startsWith("front")) {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="14" rx="1.5" />
        <path d="M3 8h18" />
        <circle cx="6" cy="6" r="0.5" fill={stroke} />
      </svg>
    );
  }
  if (key.startsWith("data")) {
    return (
      <svg {...props}>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </svg>
    );
  }
  if (key.startsWith("tool") || key.startsWith("dev")) {
    return (
      <svg {...props}>
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.3-2.3 2.6-2.6z" />
      </svg>
    );
  }
  if (key.startsWith("test")) {
    return (
      <svg {...props}>
        <path d="M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-5-9V3" />
        <path d="M8 3h8" />
        <path d="M7 15h10" />
      </svg>
    );
  }
  if (key.startsWith("sec") || key.startsWith("säk")) {
    return (
      <svg {...props}>
        <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (key.startsWith("lead") || key.startsWith("ledar")) {
    return (
      <svg {...props}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2" />
        <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
        <path d="M15 20c0-2 2-3.5 4-3.5s2 1 2 3" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

// Bento sizing: 0..6 → span classes
const layout = [
  "sm:col-span-2 md:col-span-6 lg:col-span-4 lg:row-span-2", // Backend (feature)
  "md:col-span-3 lg:col-span-4",                              // Frontend
  "md:col-span-3 lg:col-span-4",                              // Database
  "md:col-span-3 lg:col-span-4",                              // Tools & DevOps
  "md:col-span-3 lg:col-span-4",                              // Testing
  "md:col-span-3 lg:col-span-4",                              // Security
  "sm:col-span-2 md:col-span-6 lg:col-span-12",               // Leadership (wide bottom)
];

export function Skills() {
  const c = useContent();
  return (
    <section
      id="skills"
      className="relative overflow-hidden border-t border-white/5 py-32"
    >
      {/* Subtle gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(125,211,252,0.08) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 100% 100%, rgba(167,139,250,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c.ui.skills.section}
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl lg:text-8xl">
              {c.ui.skills.title1}
              <br />
              <span className="italic text-muted">{c.ui.skills.title2}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <p className="text-lg text-muted">{c.ui.skills.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12">
          {c.skills.map((group, i) => (
            <SkillCard
              key={group.category}
              group={group}
              index={i}
              featured={i === 0 || i === 6}
              className={layout[i] ?? "md:col-span-3 lg:col-span-4"}
            />
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:flex md:items-center md:gap-8">
          <div className="mb-4 md:mb-0">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {c.ui.skills.learning}
            </p>
            <div
              className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              In progress
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {c.learning.map((l) => (
              <span
                key={l}
                className="rounded-full border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-4 py-1.5 text-sm text-foreground/90"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({
  group,
  index,
  featured,
  className,
}: {
  group: SkillGroup;
  index: number;
  featured?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 transition-colors hover:border-white/25 md:p-8 ${className ?? ""}`}
    >
      {/* Hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 20%, rgba(125,211,252,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-foreground/80 transition-colors group-hover:border-white/25 group-hover:text-foreground">
                <CategoryIcon category={group.category} />
              </span>
              <h3
                className={`font-display tracking-tight text-foreground ${featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
              >
                {group.category}
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted transition-colors group-hover:border-white/25 group-hover:text-foreground/90"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

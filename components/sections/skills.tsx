"use client";

import { motion } from "framer-motion";
import { skills, learning } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="relative border-t border-white/5 py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              02 · Skills
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl">
              Verktyg &<br />
              <span className="italic text-muted">tänkesätt</span>
            </h2>
          </div>
          <div className="max-w-md text-muted">
            Från Clean Architecture till Docker — en stack byggd för långsiktig
            underhållbarhet, inte snabba genvägar.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-background p-8 transition-colors hover:bg-white/[0.02]"
            >
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  {group.category}
                </h3>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-muted transition-colors group-hover:border-white/20 group-hover:text-foreground/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 md:flex-row md:items-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Just nu → Lär mig
          </p>
          <div className="flex flex-wrap gap-2">
            {learning.map((l) => (
              <span
                key={l}
                className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-sm text-foreground/90"
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

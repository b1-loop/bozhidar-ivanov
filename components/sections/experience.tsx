"use client";

import { motion } from "framer-motion";
import { experience, education } from "@/lib/data";

export function Experience() {
  return (
    <section
      id="experience"
      className="relative border-t border-white/5 py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
            04 · Erfarenhet
          </p>
          <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl">
            Vart jag<br />
            <span className="italic text-muted">har varit</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ol className="relative border-l border-white/10">
              {experience.map((e, i) => (
                <motion.li
                  key={`${e.company}-${e.role}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="mb-12 pl-8 last:mb-0"
                >
                  <span className="absolute -left-[6px] mt-2 h-3 w-3 rounded-full border border-white/30 bg-background" />
                  <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
                    {e.period}
                  </p>
                  <h3 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
                    {e.role}
                  </h3>
                  <p className="mb-4 text-muted">{e.company}</p>
                  <ul className="space-y-1.5 text-sm text-muted">
                    {e.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-white/30">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pl-8"
          >
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
                Utbildning
              </p>
              <h3 className="font-display text-2xl tracking-tight text-foreground">
                {education.school}
              </h3>
              <p className="mb-6 text-muted">{education.program}</p>
              <ul className="space-y-2 text-sm text-muted">
                {education.courses.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-white/30">›</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

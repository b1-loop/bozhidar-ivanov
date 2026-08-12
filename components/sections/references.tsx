"use client";

import { motion } from "framer-motion";
import { references } from "@/lib/data";

export function References() {
  return (
    <section
      id="references"
      className="relative border-t border-white/5 py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
            05 · Referenser
          </p>
          <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl">
            Vad andra<br />
            <span className="italic text-muted">säger</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {references.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]"
            >
              <blockquote className="mb-8">
                <span
                  className="font-display text-4xl leading-none text-white/20"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="mt-2 text-lg leading-relaxed text-foreground/90">
                  {r.quote}
                </p>
              </blockquote>
              <figcaption>
                <p className="font-medium text-foreground">{r.name}</p>
                <p className="text-sm text-muted">
                  {r.role} · {r.company}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

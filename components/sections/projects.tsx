"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="relative border-t border-white/5 py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              03 · Projekt
            </p>
            <h2 className="font-display text-5xl leading-[1] tracking-tighter md:text-7xl">
              Utvalda<br />
              <span className="italic text-muted">arbeten</span>
            </h2>
          </div>
          <div className="max-w-md text-muted">
            Tio projekt som representerar min resa in i .NET, React och
            fullstack-arkitektur. Kod, koncept och ambition.
          </div>
        </div>

        <div className="divide-y divide-white/5 border-y border-white/5">
          {projects.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.demo || p.github}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              className="group grid grid-cols-12 items-center gap-4 py-8 transition-all hover:bg-white/[0.02]"
            >
              <div className="col-span-1 font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-11 md:col-span-4">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display text-2xl tracking-tight text-foreground transition-colors group-hover:text-white md:text-3xl">
                    {p.name}
                  </h3>
                  {p.live && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{p.type}</p>
              </div>
              <div className="col-span-12 hidden text-sm text-muted md:col-span-4 md:block">
                {p.description}
              </div>
              <div className="col-span-12 hidden flex-wrap gap-1.5 md:col-span-2 md:flex">
                {p.stack.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="col-span-12 flex items-center gap-3 md:col-span-1 md:justify-end">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-all group-hover:border-white/40 group-hover:bg-white group-hover:text-background"
                  aria-hidden
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="https://github.com/b1-loop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-foreground/90 transition-all hover:border-white/40 hover:bg-white/5"
          >
            <GithubIcon className="h-4 w-4" />
            Alla repos på GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

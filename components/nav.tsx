"use client";

import { useEffect, useState } from "react";
import { personal } from "@/lib/data";
import { cn } from "@/lib/utils";

const links = [
  { href: "#journey", label: "Resa" },
  { href: "#projects", label: "Projekt" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Erfarenhet" },
  { href: "#contact", label: "Kontakt" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-display text-xl tracking-tight text-foreground"
        >
          {personal.name.split(" ")[0]}
          <span className="text-muted">.</span>
        </a>
        <ul className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${personal.email}`}
          className="rounded-full border border-white/15 px-4 py-2 text-xs text-foreground/90 transition-all hover:border-white/40 hover:bg-white/5"
        >
          Kontakta
        </a>
      </nav>
    </header>
  );
}

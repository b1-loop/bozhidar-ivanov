"use client";

import { useEffect } from "react";

/**
 * Flags top-level page sections with `data-offscreen` while they're out of
 * view. globals.css pauses every CSS animation inside them (pings, clouds,
 * marquee…), so the browser isn't repainting things nobody can see.
 */
export function OffscreenPause() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = document.querySelectorAll<HTMLElement>("main > section, main > footer, main > div > section");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) delete (e.target as HTMLElement).dataset.offscreen;
          else (e.target as HTMLElement).dataset.offscreen = "";
        }
      },
      { rootMargin: "200px 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return null;
}

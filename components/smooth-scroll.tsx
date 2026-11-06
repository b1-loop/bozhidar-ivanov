"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip Lenis on touch/small devices — native mobile scroll is smoother
    // and Lenis's RAF loop adds unnecessary jank there.
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(max-width: 768px)").matches);
    // Respect "reduce motion": plain native scrolling
    if (isTouch || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // lerp-based smoothing follows the wheel more tightly than a fixed
    // 1.2 s duration — still smooth, but responds immediately to direction
    // changes and small scroll nudges.
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

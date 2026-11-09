"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up to `value` when scrolled into view.
 *
 * The real number is rendered by default (server HTML, reduced motion, or if
 * the in-view observer never fires) — the count-up is only an enhancement, so
 * it can never get stuck showing "0".
 */
export function AnimatedNumber({
  value,
  suffix = "",
  duration = 1.4,
  format,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  /** Optional custom formatter, e.g. for locale-based digit grouping */
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const fmt = (n: number) => (format ? format(n) : String(n));
  // null = show the real value; a number = mid count-up
  const [current, setCurrent] = useState<number | null>(null);
  const armed = useRef(false);

  // Arm the count-up only while the number is still off-screen, so it never
  // flashes the final value and then drops back to 0.
  useEffect(() => {
    if (reduce || armed.current) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const offscreen = r.top > window.innerHeight || r.bottom < 0;
    if (!offscreen) return;
    armed.current = true;
    const id = requestAnimationFrame(() => setCurrent(0));
    return () => cancelAnimationFrame(id);
  }, [reduce]);

  useEffect(() => {
    if (!inView || !armed.current || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
      onComplete: () => setCurrent(null),
    });
    return () => {
      controls.stop();
      setCurrent(null);
    };
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(current ?? value)}
      {suffix}
    </span>
  );
}

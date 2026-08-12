"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue } from "framer-motion";

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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const motion = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const unsub = motion.on("change", (latest) => {
      const rounded = Math.round(latest);
      setDisplay(format ? format(rounded) : rounded.toString());
    });
    return unsub;
  }, [motion, format]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motion, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, motion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Journey has its own top-of-screen progress line. Hide ours while that
  // section is on screen so two lines don't stack on the same row.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const target = document.getElementById("journey");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80% 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      {/* Subtle glow behind the bar */}
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left opacity-70 blur-[3px]"
      >
        <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-white to-purple-400" />
      </motion.div>
      {/* The bar */}
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-white to-purple-400"
      />
    </div>
  );
}

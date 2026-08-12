"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Subtle glow behind the bar */}
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="pointer-events-none fixed top-0 left-0 right-0 z-[59] h-[3px] origin-left opacity-70 blur-[3px]"
      >
        <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-white to-purple-400" />
      </motion.div>
      {/* The bar */}
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-white to-purple-400"
      />
    </>
  );
}

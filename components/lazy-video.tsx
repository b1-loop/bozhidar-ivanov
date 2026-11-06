"use client";

import { useEffect, useRef, useState } from "react";

/**
 * <video> that only attaches its poster (and src) when it comes near the
 * viewport. A plain `poster` attribute is fetched immediately on page load —
 * for demos far down the page that's bandwidth stolen from the hero.
 */
export function LazyVideo({
  src,
  poster,
  className,
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={near ? poster : undefined}
      controls
      playsInline
      preload="none"
      className={className}
      aria-label={label}
    />
  );
}

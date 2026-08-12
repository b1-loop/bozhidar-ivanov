"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const PORTRAIT_SRC = "/portrait.png";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export function Portrait({
  name,
  size = 40,
  className,
  ring = true,
  glow = false,
}: {
  name: string;
  size?: number;
  className?: string;
  ring?: boolean;
  glow?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const px = `${size}px`;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-400/60 to-purple-500/60 font-display font-medium text-white",
        ring && "ring-1 ring-white/20",
        className,
      )}
      style={{
        width: px,
        height: px,
        fontSize: Math.max(10, size * 0.4),
        boxShadow: glow
          ? "0 0 30px rgba(125,211,252,0.35), 0 0 0 1px rgba(255,255,255,0.15)"
          : undefined,
      }}
      aria-hidden
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={PORTRAIT_SRC}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <span className="relative z-10 leading-none">{initials(name)}</span>
      )}
      {/* Subtle inner highlight */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%)",
        }}
      />
    </span>
  );
}

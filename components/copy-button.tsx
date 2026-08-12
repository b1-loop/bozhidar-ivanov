"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className = "",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={`group/copy relative inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-muted transition-all hover:border-white/30 hover:bg-white/[0.05] hover:text-foreground ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center text-emerald-400"
          >
            <Check className="h-3.5 w-3.5" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center"
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2 py-1 font-mono text-[10px] uppercase tracking-widest opacity-0 backdrop-blur transition-opacity group-hover/copy:opacity-100"
        style={{ color: copied ? "#6ee7b7" : "rgba(255,255,255,0.7)" }}
      >
        {copied ? copiedLabel : label}
      </span>
    </button>
  );
}

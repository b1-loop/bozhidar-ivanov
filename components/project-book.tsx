"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { TransitionLink as Link } from "@/components/transition-link";
import { GithubIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";
import { accentFor } from "@/lib/project-accent";
import type { Project } from "@/lib/content";

/**
 * The non-featured projects as a book you leaf through: a two-page spread on
 * desktop, one page on phones. Pages turn in 3D around the spine.
 * Controls: arrow buttons, ←/→ keys, swipe, or click the page corner.
 */

const COPY = {
  en: {
    title: "More projects",
    hint: "Leaf through the book",
    prev: "Previous page",
    next: "Next page",
    page: "Page",
    of: "of",
    turn: "Turn the page",
    caseStudy: "Case study",
  },
  sv: {
    title: "Fler projekt",
    hint: "Bläddra i boken",
    prev: "Föregående sida",
    next: "Nästa sida",
    page: "Sida",
    of: "av",
    turn: "Vänd blad",
    caseStudy: "Case study",
  },
} as const;

const FLIP_EASE = [0.645, 0.045, 0.355, 1] as const;

/* -------------------------- media query hook -------------------------- */
const MQ = "(min-width: 768px)";
function subscribeMq(cb: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useIsWide = () =>
  useSyncExternalStore(
    subscribeMq,
    () => window.matchMedia(MQ).matches,
    () => false,
  );

/* ------------------------------- a page ------------------------------- */
function Page({
  project,
  number,
  total,
  side,
  caseStudyLabel,
}: {
  project?: Project;
  number: number;
  total: number;
  side: "left" | "right";
  caseStudyLabel: string;
}) {
  const spineShadow =
    side === "left"
      ? "linear-gradient(to left, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 6%, transparent 18%)"
      : "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 6%, transparent 18%)";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#151a24_0%,#0f131b_60%,#0b0e15_100%)]">
      {/* paper grain + spine shading */}
      <div className="noise opacity-25" />
      <div className="pointer-events-none absolute inset-0" style={{ background: spineShadow }} />

      {project ? (
        <PageContent project={project} caseStudyLabel={caseStudyLabel} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="font-display text-3xl italic text-white/15">Fin.</span>
        </div>
      )}

      {/* page number */}
      <div
        className={`pointer-events-none absolute bottom-4 font-mono text-[10px] tracking-[0.25em] text-white/35 ${
          side === "left" ? "left-6" : "right-6"
        }`}
      >
        {String(number).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

function PageContent({ project, caseStudyLabel }: { project: Project; caseStudyLabel: string }) {
  const accent = accentFor(project.type);
  const hasCaseStudy = !!project.slug && !!project.caseStudy;
  const linkCls =
    "inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted transition-colors hover:border-white/30 hover:text-foreground sm:px-3 sm:py-1.5 sm:text-[11px]";
  return (
    <div className="relative flex h-full flex-col p-6 pb-12 sm:p-8 sm:pb-12">
      <div className="mb-5 h-1 w-14 rounded-full" style={{ background: accent }} />
      <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: accent }}>
        {project.type}
      </p>
      <h4 className="mt-2 font-display text-3xl leading-tight tracking-tight text-white sm:text-4xl">{project.name}</h4>
      <p className="mt-4 text-sm leading-relaxed text-muted sm:text-[15px]">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {hasCaseStudy && (
          <Link
            href={`/projects/${project.slug}`}
            className={linkCls}
            style={{ borderColor: `${accent}55`, color: accent }}
            aria-label={`Case study for ${project.name}`}
          >
            {caseStudyLabel} <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkCls} aria-label={`GitHub for ${project.name}`}>
            <GithubIcon className="h-3 w-3" /> GitHub
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className={linkCls} aria-label={`Live site for ${project.name}`}>
            <ExternalLink className="h-3 w-3" /> Live
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- turning leaf ---------------------------- */
function Leaf({
  rotate,
  front,
  back,
}: {
  rotate: MotionValue<number>;
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  // light falls on the page as it lifts, the back side brightens as it lands
  const frontShade = useTransform(rotate, [0, -90], [0, 0.55]);
  const backShade = useTransform(rotate, [-90, -180], [0.55, 0]);
  const lift = useTransform(rotate, [0, -90, -180], [0, 1, 0]);
  const shadow = useTransform(lift, (l) => `0 ${20 + l * 30}px ${40 + l * 60}px -20px rgba(0,0,0,${0.5 + l * 0.3})`);

  return (
    <motion.div
      className="absolute inset-y-0 right-0 z-20 w-full md:w-1/2"
      style={{ rotateY: rotate, transformOrigin: "left center", transformStyle: "preserve-3d", boxShadow: shadow }}
    >
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        {front}
        <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: frontShade }} />
      </div>
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
        {back}
        <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: backShade }} />
      </div>
    </motion.div>
  );
}

/* -------------------------------- book -------------------------------- */
export function ProjectBook({ projects }: { projects: Project[] }) {
  const { locale } = useLocale();
  const t = COPY[locale];
  const wide = useIsWide();
  const reduce = useReducedMotion();
  const per = wide ? 2 : 1;
  const total = projects.length;
  const spreads = Math.ceil(total / per);

  const [rawIndex, setIndex] = useState(0);
  const index = Math.min(rawIndex, spreads - 1); // stays valid when the layout switches
  const [flip, setFlip] = useState<null | { dir: 1 | -1; target: number }>(null);
  const rotate = useMotionValue(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (flip) return;
      const target = index + dir;
      if (target < 0 || target >= spreads) return;
      if (reduce) {
        setIndex(target);
        return;
      }
      rotate.set(dir === 1 ? 0 : -180);
      setFlip({ dir, target });
      animate(rotate, dir === 1 ? -180 : 0, {
        duration: 0.85,
        ease: FLIP_EASE,
        onComplete: () => {
          setIndex(target);
          setFlip(null);
          rotate.set(0);
        },
      });
    },
    [flip, index, spreads, reduce, rotate],
  );

  const page = (i: number, side: "left" | "right") => (
    <Page project={projects[i]} number={i + 1} total={total} side={side} caseStudyLabel={t.caseStudy} />
  );

  // which pages lie still underneath, and what the turning leaf shows
  const cur = index;
  const tgt = flip?.target ?? index;
  let left: number | null = null;
  let right: number;
  let leafFront: number | null = null;
  let leafBack: number | null = null;
  if (per === 2) {
    if (!flip) {
      left = cur * 2;
      right = cur * 2 + 1;
    } else if (flip.dir === 1) {
      left = cur * 2;
      right = tgt * 2 + 1;
      leafFront = cur * 2 + 1;
      leafBack = tgt * 2;
    } else {
      left = tgt * 2;
      right = cur * 2 + 1;
      leafFront = tgt * 2 + 1;
      leafBack = cur * 2;
    }
  } else {
    right = flip ? (flip.dir === 1 ? tgt : cur) : cur;
    if (flip) leafFront = flip.dir === 1 ? cur : tgt;
  }

  const first = index * per + 1;
  const last = Math.min(total, index * per + per);

  return (
    <div className="mt-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl tracking-tight md:text-5xl">{t.title}</h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">{t.hint} →</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-white/50">
            {t.page} {first === last ? first : `${first}–${last}`} {t.of} {total}
          </span>
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0 || !!flip}
            aria-label={t.prev}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition-all hover:border-white/40 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === spreads - 1 || !!flip}
            aria-label={t.next}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition-all hover:border-white/40 hover:text-white disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* the book */}
      <div
        role="region"
        aria-roledescription="book"
        aria-label={t.title}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
        }}
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
        }}
        className="relative mx-auto touch-pan-y select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        style={{ perspective: "2200px" }}
      >
        {/* cover edges / page stack behind */}
        <div aria-hidden className="absolute -inset-2 rounded-[20px] bg-[#07090e] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/5" />
        <div aria-hidden className="absolute inset-y-1 -right-1 left-1 rounded-r-xl bg-[repeating-linear-gradient(to_bottom,#1a1f2a_0_1px,#10141c_1px_3px)] md:left-1/2" />

        <div className="relative h-[460px] sm:h-[440px]" style={{ transformStyle: "preserve-3d" }}>
          {per === 2 && left !== null && (
            <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-xl">{page(left, "left")}</div>
          )}
          <div className="absolute inset-y-0 right-0 w-full overflow-hidden rounded-xl md:w-1/2 md:rounded-l-none">
            {page(right, "right")}
          </div>

          {/* spine */}
          {per === 2 && (
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-8 -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.55),transparent)]" />
          )}

          {flip && leafFront !== null && (
            <Leaf
              rotate={rotate}
              front={page(leafFront, "right")}
              back={
                leafBack !== null ? (
                  page(leafBack, "left")
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,#151a24,#0b0e15)]" />
                )
              }
            />
          )}

          {/* clickable page corner */}
          {!flip && index < spreads - 1 && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.turn}
              className="group/corner absolute bottom-0 right-0 z-30 h-16 w-16 overflow-hidden rounded-br-xl"
            >
              <span className="absolute bottom-0 right-0 h-8 w-8 origin-bottom-right bg-[linear-gradient(135deg,transparent_50%,#2a3140_50%,#1b2130_100%)] shadow-[-2px_-2px_6px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover/corner:h-12 group-hover/corner:w-12" />
            </button>
          )}
        </div>
      </div>

      {/* dots */}
      <div className="mt-6 flex justify-center gap-1.5">
        {Array.from({ length: spreads }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-white/70" : "w-1.5 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

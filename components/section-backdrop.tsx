/**
 * Static atmospheric background for a page section: soft colour glows, an
 * optional alternating tone band, a faint grid/dot pattern and film grain.
 * Pure CSS gradients — painted once, costs nothing while scrolling.
 */

type Glow = { color: string; x: string; y: string; w?: string; h?: string; a?: number };

type Variant = {
  glows: Glow[];
  /** Slightly lifted blue-black band so consecutive sections read as separate */
  band?: boolean;
  pattern?: "grid" | "dots";
};

/** Global knob for how strong the section glows are */
const INTENSITY = 1.35;

const C = {
  cyan: "34,211,238",
  sky: "125,211,252",
  purple: "167,139,250",
  amber: "251,191,36",
  emerald: "52,211,153",
};

const VARIANTS = {
  about: {
    glows: [
      { color: C.sky, x: "8%", y: "8%", a: 0.13 },
      { color: C.amber, x: "92%", y: "92%", a: 0.08 },
    ],
  },
  skills: {
    band: true,
    pattern: "grid",
    glows: [
      { color: C.cyan, x: "50%", y: "0%", w: "55%", h: "40%", a: 0.12 },
      { color: C.purple, x: "100%", y: "85%", a: 0.12 },
      { color: C.amber, x: "0%", y: "70%", w: "35%", h: "30%", a: 0.06 },
    ],
  },
  projects: {
    pattern: "dots",
    glows: [
      { color: C.purple, x: "0%", y: "5%", a: 0.13 },
      { color: C.cyan, x: "100%", y: "55%", a: 0.1 },
      { color: C.amber, x: "20%", y: "100%", a: 0.07 },
    ],
  },
  experience: {
    band: true,
    glows: [
      { color: C.purple, x: "100%", y: "0%", a: 0.12 },
      { color: C.emerald, x: "0%", y: "100%", a: 0.09 },
    ],
  },
  references: {
    glows: [
      { color: C.sky, x: "15%", y: "20%", a: 0.11 },
      { color: C.amber, x: "85%", y: "85%", a: 0.08 },
    ],
  },
  contact: {
    band: true,
    glows: [
      { color: C.cyan, x: "50%", y: "0%", w: "60%", h: "40%", a: 0.14 },
      { color: C.emerald, x: "15%", y: "100%", a: 0.1 },
      { color: C.purple, x: "92%", y: "60%", a: 0.11 },
    ],
  },
} satisfies Record<string, Variant>;

export type BackdropVariant = keyof typeof VARIANTS;

const PATTERNS = {
  grid: {
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
    backgroundSize: "56px 56px",
  },
  dots: {
    backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1.2px)",
    backgroundSize: "26px 26px",
  },
} as const;

const EDGE_FADE = {
  maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
} as const;

export function SectionBackdrop({ variant }: { variant: BackdropVariant }) {
  const v: Variant = VARIANTS[variant];
  const glows = v.glows
    .map((g) => {
      const a = (g.a ?? 0.1) * INTENSITY;
      return `radial-gradient(ellipse ${g.w ?? "45%"} ${g.h ?? "38%"} at ${g.x} ${g.y}, rgba(${g.color},${a.toFixed(3)}) 0%, rgba(${g.color},${(a * 0.35).toFixed(3)}) 35%, transparent 70%)`;
    })
    .join(",");

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {v.band && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #0b0d16 25%, #0b0d16 75%, transparent 100%)",
          }}
        />
      )}
      {/* Glows fade out towards the top/bottom edges so sections blend seamlessly */}
      <div className="absolute inset-0" style={{ background: glows, ...EDGE_FADE }} />
      {v.pattern && (
        <div
          className="absolute inset-0"
          style={{
            ...PATTERNS[v.pattern],
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 50%, black 15%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 50%, black 15%, transparent 75%)",
          }}
        />
      )}
      <div className="grain absolute inset-0" />
    </div>
  );
}

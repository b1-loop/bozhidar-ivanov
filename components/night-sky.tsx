/**
 * Night-flight details layered over the aurora photo: a starboard wing with a
 * blinking navigation light, and a few twinkling stars. CSS-only animation.
 */

// Deterministic PRNG so server and client render identical markup
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function starField(seed: number, count: number, maxY: number) {
  const r = rng(seed);
  const layers: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = (r() * 100).toFixed(2);
    const y = (r() * maxY).toFixed(2);
    const size = r() < 0.2 ? 1.6 : 1.1;
    layers.push(`radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,0.9), transparent)`);
  }
  return layers.join(",");
}

/** A handful of brighter stars that twinkle on top of the photo */
export const TWINKLE_STARS = starField(19, 28, 55);

/**
 * Starboard wing seen from a right-side window at night: a dark silhouette
 * reaching in from the lower right, its upper skin faintly lit by the aurora,
 * ending in a winglet with a green nav light and a white strobe.
 */
export function WingTip() {
  return (
    <div aria-hidden className="pointer-events-none absolute bottom-0 -right-2 w-[72%]" style={{ aspectRatio: "2 / 1" }}>
      <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wing-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(150,205,190,0.32)" />
            <stop offset="1" stopColor="rgba(30,44,50,0.9)" />
          </linearGradient>
          <linearGradient id="wing-under" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0b1014" />
            <stop offset="1" stopColor="#030507" />
          </linearGradient>
        </defs>
        {/* upper skin (perspective: wide at the root, thin at the tip) */}
        <path d="M200 40 L74 60 L72 63 L200 72 Z" fill="url(#wing-top)" />
        {/* leading-edge highlight */}
        <path d="M200 40 L74 60" stroke="rgba(170,230,210,0.35)" strokeWidth="0.7" fill="none" />
        {/* underside / trailing edge falling into shadow */}
        <path d="M200 72 L72 63 L80 67 L200 100 Z" fill="url(#wing-under)" />
        {/* winglet */}
        <path d="M74 60 L63 30 L67 29 L78 61 Z" fill="#121a20" />
        <path d="M63 30 L67 29" stroke="rgba(170,230,210,0.3)" strokeWidth="0.6" />
      </svg>
      <span className="wing-nav absolute left-[31%] top-[27%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_10px_3px_rgba(52,211,153,0.75)]" />
      <span className="wing-strobe absolute left-[31%] top-[27%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.85)]" />
    </div>
  );
}

// Colored gradient per project — used in the visual header of each card
export function accentFor(type: string): string {
  const k = type.toLowerCase();
  if (k.includes("saas") || k.includes("edtech")) return "#2dd4bf"; // teal
  if (k.includes("fintech") || k.includes("pay")) return "#7dd3fc"; // cyan
  if (k.includes("ai") || k.includes("assist")) return "#a78bfa"; // purple
  if (k.includes("client") || k.includes("kund")) return "#fbbf24"; // amber
  if (k.includes("web app") || k.includes("web")) return "#34d399"; // emerald
  if (k.includes("portal") || k.includes("dashboard")) return "#f472b6"; // pink
  if (k.includes("finance") || k.includes("salary")) return "#f97316"; // orange
  if (k.includes("database") || k.includes("first")) return "#60a5fa"; // blue
  if (k.includes("api")) return "#22d3ee"; // sky
  if (k.includes("scalable") || k.includes("skalbart")) return "#a3e635"; // lime
  if (k.includes("productiv") || k.includes("produktiv")) return "#fb7185"; // rose
  if (k.includes("logic") || k.includes("logik")) return "#c084fc"; // violet
  return "#94a3b8"; // slate default
}

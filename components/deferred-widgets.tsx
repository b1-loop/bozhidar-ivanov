"use client";

import dynamic from "next/dynamic";

/*
 * Floating extras that aren't needed for first paint. Split into their own
 * chunks and rendered client-only, so their JS doesn't add to the initial
 * hydration work of the page.
 */
const AiBot = dynamic(() => import("@/components/ai-bot").then((m) => m.AiBot), { ssr: false });
const FlightExperience = dynamic(
  () => import("@/components/flight-experience").then((m) => m.FlightExperience),
  { ssr: false },
);

export function DeferredWidgets() {
  return (
    <>
      <AiBot />
      <FlightExperience />
    </>
  );
}

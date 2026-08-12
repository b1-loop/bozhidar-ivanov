import type { MetadataRoute } from "next";
import { content } from "@/lib/content";

const BASE = "https://bozhidar-ivanov.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const caseStudySlugs = new Set<string>();
  for (const locale of ["en", "sv"] as const) {
    for (const p of content[locale].projects) {
      if (p.slug && p.caseStudy) caseStudySlugs.add(p.slug);
    }
  }

  for (const slug of caseStudySlugs) {
    routes.push({
      url: `${BASE}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return routes;
}

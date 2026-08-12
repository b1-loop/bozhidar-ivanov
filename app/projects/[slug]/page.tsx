import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { CaseStudyView } from "@/components/case-study/view";

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const locale of ["en", "sv"] as const) {
    for (const p of content[locale].projects) {
      if (p.slug && p.caseStudy) slugs.add(p.slug);
    }
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export function generateMetadata(props: PageProps<"/projects/[slug]">) {
  const params = (props.params as unknown) as { slug: string };
  const proj = content.en.projects.find((p) => p.slug === params.slug);
  if (!proj?.caseStudy) return {};
  return {
    title: `${proj.name} — Case Study · Bozhidar Ivanov`,
    description: proj.caseStudy.tagline,
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const params = (await props.params) as { slug: string };
  const hasCaseStudy =
    content.en.projects.some((p) => p.slug === params.slug && p.caseStudy) ||
    content.sv.projects.some((p) => p.slug === params.slug && p.caseStudy);
  if (!hasCaseStudy) notFound();
  return <CaseStudyView slug={params.slug} />;
}

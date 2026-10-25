import type { MetadataRoute } from "next";
import { projectSlides } from "@/content/project-slides";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  if (!origin) return [];
  const paths = ["/", "/about", ...projectSlides.filter(project => !project.archived && project.caseStudyUrl).map(project => project.caseStudyUrl!)];
  return paths.map(path => ({ url: new URL(path, origin).href }));
}

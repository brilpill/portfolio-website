import type { Metadata } from "next";
import { AboutSlide } from "@/components/about-slide";
import { CaseStudyFrame } from "@/components/case-study-frame";
import { aboutStatement } from "@/content/portfolio-content";
import "../cases/[slug]/case-study.css";

export const metadata: Metadata = { title: "About me · Oleh Bril", description: aboutStatement, alternates: { canonical: "/about" }, openGraph: { title: "About me · Oleh Bril", description: aboutStatement, images: ["/opengraph-image"] }, twitter: { card: "summary_large_image", images: ["/opengraph-image"] } };

/** About me as its own page, in the case study frame: top bar and the floating Contact button. */
export default function AboutPage() {
  return <CaseStudyFrame back={{ href: "/", label: "Home" }} sections={[]}>
    <AboutSlide />
  </CaseStudyFrame>;
}

import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { EditionsExperiment } from "./editions-experiment";
import "./editions.css";

const grotesk = Inter_Tight({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-editions-grotesk", display: "swap" });

export const metadata: Metadata = { title: "Portfolio · Editions layout experiment", robots: { index: false, follow: false } };

/**
 * Layout study after an editorial "editions" microsite: full-bleed painted backgrounds, a framed index on the
 * first screen, a flat section index pinned bottom-left once you scroll, giant section titles and a torn-paper
 * edge into a cream reading area. Original code, CSS-generated backgrounds, and my own content. The main page is
 * unchanged.
 */
export default function EditionsExperimentPage() {
  return <div className={grotesk.variable}><EditionsExperiment /></div>;
}

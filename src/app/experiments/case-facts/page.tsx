import type { Metadata } from "next";
import { PortfolioHome } from "@/components/portfolio-home";
import "../../card-shell.css";
import "./case-facts.css";

export const metadata: Metadata = { title: "Portfolio · Case details experiment", robots: { index: false, follow: false } };

/** Option B ("quiet facts") for the case details column, on the main card-shell layout. The main page is unchanged. */
export default function CaseFactsExperiment() {
  return <PortfolioHome layout="card-shell" caseSidebar="facts" />;
}

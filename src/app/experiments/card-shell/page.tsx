import type { Metadata } from "next";
import { PortfolioHome } from "@/components/portfolio-home";
import "./card-shell.css";

export const metadata: Metadata = { title: "Portfolio · Card shell experiment", robots: { index: false, follow: false } };

export default function CardShellExperiment() {
  return <PortfolioHome layout="card-shell" />;
}

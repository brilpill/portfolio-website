import type { Metadata } from "next";
import { PortfolioHome } from "@/components/portfolio-home";
import "../../card-shell.css";

export const metadata: Metadata = { title: "Playground file labels · Oleh Bril", robots: { index: false } };

export default function PlaygroundFilesExperiment() {
  return <PortfolioHome layout="card-shell" playgroundExperiment />;
}

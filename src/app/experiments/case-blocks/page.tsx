import type { Metadata } from "next";
import { CaseBlocksLab } from "./case-blocks-lab";
import "../mockups/mockup-lab.css";

export const metadata: Metadata = { title: "Case blocks · Oleh Bril", robots: { index: false } };

/** Unlinked page: the case study blocks beyond mockups (numbers, compare, highlights, cursors), to pick from. */
export default function CaseBlocksPage() {
  return <CaseBlocksLab />;
}

import type { Metadata } from "next";
import { MockupLab } from "./mockup-lab";
import "./mockup-lab.css";

export const metadata: Metadata = { title: "Mockup lab · Oleh Bril", robots: { index: false } };

/** Unlinked comparison page: the LuminAsset screens in several phone and browser mockups, to pick a style. */
export default function MockupLabPage() {
  return <MockupLab />;
}

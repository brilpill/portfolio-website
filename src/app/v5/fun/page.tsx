import type { Metadata } from "next";
import { join } from "node:path";
import sharp from "sharp";
import { PlayStrip, type V5PlayItem } from "@/components/v5/play-strip";
import { v5Fun, v5FunFilters } from "@/content/v5";

export const metadata: Metadata = { title: "Playground" };

/** Each piece's proportions, read from its poster, so the strip lays out at the right widths before anything loads. */
async function withSize(): Promise<V5PlayItem[]> {
  return Promise.all(v5Fun.map(async item => {
    try {
      const { width, height } = await sharp(join(process.cwd(), "public", item.poster)).metadata();
      return { ...item, w: width ?? 4, h: height ?? 3 };
    } catch {
      return { ...item, w: 4, h: 3 };
    }
  }));
}

/** Playground, in the design system: a heading, then the pieces as one sideways strip (Figma Final 1328:33160). */
export default async function V5Fun() {
  const items = await withSize();
  return (
    <div className="v5-play">
      <div className="v5-play-head">
        <h1 className="v5-h2">Playground</h1>
        <p>Interface sketches, motion studies and side projects, {items.length} pieces from Dribbble and Figma.</p>
      </div>
      <PlayStrip items={items} filters={v5FunFilters} />
    </div>
  );
}

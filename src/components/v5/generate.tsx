"use client";

import { useLayoutEffect, useRef } from "react";
import { generate } from "@/lib/transitions/text-image-generation.js";
import "@/lib/transitions/text-image-generation.css";

/* Page content "prints" in with the transitions.dev UI generation skill (auto variant, skeleton mode): as each block
 * scrolls into view, its big titles are traced glyph by glyph in dots, smaller text gets a dotted line, and images
 * come in as a sketch, a halftone of their own pixels, then the photo. Blocks hold hidden until their turn (the CSS
 * holds the page hidden from the first paint until its blocks are marked, so nothing flashes before it's drawn). */

const STAGGER = 260; // ms between blocks that come into view together (the skill's grid spacing)
const LONG_TEXT = 120; // characters; above this a block's text sweeps in along its lines instead of letter by letter

/** The page's blocks: its root's children, split further where one is taller than the screen, so each plays when it's
 * actually seen; the work columns play card by card. */
function blocksOf(root: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  const visit = (el: Element, depth: number) => {
    if (!(el instanceof HTMLElement) || el.matches("canvas, [hidden]")) return;
    const split = el.matches(".v5-work, .v5-work-col") || (depth < 3 && el.children.length > 1 && el.offsetHeight > window.innerHeight * 0.9);
    if (split) for (const child of el.children) visit(child, depth + 1);
    else out.push(el);
  };
  for (const child of root.children) visit(child, 0);
  return out;
}

export function V5Generate() {
  const marker = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const main = marker.current?.parentElement;
    const root = main && [...main.children].find(el => el !== marker.current && !el.classList.contains("v5-selection"));
    // The drawing goes inside the scrolling content, so it moves with the page if someone scrolls mid-build.
    const layer = main?.closest<HTMLElement>(".v5-margin");
    if (!root || !layer) return;
    const blocks = blocksOf(root);
    blocks.forEach(block => { block.dataset.gen = "wait"; });
    // Blocks now hide themselves until their turn, so the page itself can show.
    main.dataset.gen = "ready";
    const runs: { cancel: () => void }[] = [];
    let batch = 0, batchAt = 0;

    const play = async (block: HTMLElement) => {
      const now = performance.now();
      if (now - batchAt > 120) { batch = 0; batchAt = now; }
      const delay = batch++ * STAGGER;
      // Traced in the fonts and pixels the page shows, so wait for both.
      await document.fonts.ready;
      await Promise.all([...block.querySelectorAll("img")].map(img => img.decode().catch(() => undefined)));
      if (block.dataset.gen !== "wait") return;
      block.dataset.gen = "run";
      // The skill's default fades text in a character every 90ms, tuned for headlines; on paragraphs that would take
      // a minute, so longer text follows its dotted line instead, its ink sweeping along each line.
      const long = (block.textContent ?? "").trim().length > LONG_TEXT;
      runs.push(generate(block, { variant: "auto", delay, parent: layer, ...(long && { fadeBy: "gradient", fadeStagger: null }), onDone: () => { block.dataset.gen = "done"; } }));
    };

    const seen = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        seen.unobserve(entry.target);
        play(entry.target as HTMLElement);
      }
    }, { threshold: 0.15 });
    blocks.forEach(block => seen.observe(block));

    return () => {
      seen.disconnect();
      runs.forEach(run => run.cancel());
      blocks.forEach(block => { block.dataset.gen = "done"; });
      delete main.dataset.gen;
    };
  }, []);

  return <span ref={marker} hidden aria-hidden />;
}

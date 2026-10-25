"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * A collaborator cursor over a figure (after user-cursor and drafting-cursor patterns; original code).
 * - cursor: a named pointer glides between points (percent of the figure) and rests at each, with an optional note.
 * - draft: the same pointer drags out a selection box from the first point, as if marking an area in Figma.
 * Loops gently; with reduced motion it stays put at the last point.
 */
export type Annotation = { kind: "cursor" | "draft"; name: string; note?: string; points: [number, number][] };

export function CaseAnnotation({ annotation }: { annotation: Annotation }) {
  const reduced = !!useReducedMotion();
  const { points, kind, name, note } = annotation;
  const left = points.map(([x]) => `${x}%`), top = points.map(([, y]) => `${y}%`);
  // Each point gets a move and a rest; times spread them evenly across the loop.
  const duration = points.length * 2.2;
  const times = points.map((_, i) => i / Math.max(1, points.length - 1));
  const loop = { duration, times, ease: "easeInOut" as const, repeat: Infinity, repeatDelay: 1.2 };
  const last = points[points.length - 1];
  const [x0, y0] = points[0];

  return <div className="case-annotation" aria-hidden>
    {kind === "draft" && <motion.span className="case-annotation-box"
      initial={false}
      animate={reduced ? { left: `${Math.min(x0, last[0])}%`, top: `${Math.min(y0, last[1])}%`, width: `${Math.abs(last[0] - x0)}%`, height: `${Math.abs(last[1] - y0)}%` }
        : { left: points.map(([x]) => `${Math.min(x0, x)}%`), top: points.map(([, y]) => `${Math.min(y0, y)}%`), width: points.map(([x]) => `${Math.abs(x - x0)}%`), height: points.map(([, y]) => `${Math.abs(y - y0)}%`) }}
      transition={reduced ? { duration: 0 } : loop} />}
    {/* Near the right edge the note opens to the left, so it stays inside the figure. */}
    <motion.span className="case-annotation-cursor" data-flip={Math.max(...points.map(([x]) => x)) > 60 || undefined} initial={false}
      animate={reduced ? { left: `${last[0]}%`, top: `${last[1]}%` } : { left, top }}
      transition={reduced ? { duration: 0 } : loop}>
      <svg viewBox="0 0 16 18" width="16" height="18"><path d="M1.5 1.5 L14 8.4 L8.3 9.6 L5.4 15.6 Z" /></svg>
      <span className="case-annotation-name">{name}</span>
      {note && <span className="case-annotation-note">{note}</span>}
    </motion.span>
  </div>;
}

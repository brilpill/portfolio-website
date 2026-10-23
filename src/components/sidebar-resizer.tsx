"use client";

import { useRef } from "react";

type Props = {
  expanded: boolean;
  onResize: (width: number | null) => void;
  onCommit: (expanded: boolean) => void;
};

const RAIL_WIDTH = 60;
/** px/ms; a quick flick snaps in its direction regardless of distance. */
const FLICK_VELOCITY = .11;

/** Drag the boundary and snap to the expanded sidebar or compact rail on release. */
export function SidebarResizer({ expanded, onResize, onCommit }: Props) {
  const drag = useRef<{ x: number; width: number; max: number; current: number; lastX: number; lastT: number; velocity: number } | null>(null);
  const reset = (element: HTMLElement) => { drag.current = null; element.style.left = ""; onResize(null); };
  return <div className="sidebar-resizer" role="separator" tabIndex={0} aria-label="Resize sidebar" aria-orientation="vertical" aria-controls="portfolio-sidebar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={expanded ? 100 : 0} aria-valuetext={expanded ? "Expanded sidebar" : "Collapsed icon rail"}
    onPointerDown={event => {
      if (event.button !== 0 || !event.isPrimary || drag.current) return;
      event.preventDefault();
      event.currentTarget.focus();
      const shell = event.currentTarget.closest<HTMLElement>(".home-screen");
      const max = shell ? parseFloat(getComputedStyle(shell).getPropertyValue("--sidebar-expanded-width")) || 260 : 260;
      const width = expanded ? max : RAIL_WIDTH;
      drag.current = { x: event.clientX, width, max, current: width, lastX: event.clientX, lastT: event.timeStamp, velocity: 0 };
      event.currentTarget.setPointerCapture(event.pointerId);
      onResize(width);
    }}
    onPointerMove={event => {
      const start = drag.current;
      if (!start || !event.isPrimary) return;
      const elapsed = event.timeStamp - start.lastT;
      if (elapsed > 0) start.velocity = (event.clientX - start.lastX) / elapsed;
      start.lastX = event.clientX;
      start.lastT = event.timeStamp;
      start.current = Math.max(RAIL_WIDTH, Math.min(start.max, start.width + event.clientX - start.x));
      event.currentTarget.style.left = `${start.current - 4}px`;
      onResize(start.current);
    }}
    onPointerUp={event => {
      const start = drag.current;
      if (!start) return;
      // A stale velocity from a pause before release should not count as a flick.
      const recent = event.timeStamp - start.lastT < 80;
      const flick = recent && Math.abs(start.velocity) > FLICK_VELOCITY;
      onCommit(flick ? start.velocity > 0 : start.current >= (RAIL_WIDTH + start.max) / 2);
      reset(event.currentTarget);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }}
    onPointerCancel={event => reset(event.currentTarget)}
    onLostPointerCapture={event => { if (drag.current) reset(event.currentTarget); }}
    onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End", "Enter", " "].includes(event.key)) return;
      event.preventDefault();
      onCommit(event.key === "ArrowRight" || event.key === "End" ? true : event.key === "ArrowLeft" || event.key === "Home" ? false : !expanded);
    }}
  ><span aria-hidden /></div>;
}

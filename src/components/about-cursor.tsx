"use client";

import { useEffect, useId, useRef, type RefObject } from "react";

/**
 * The object in About: a large chrome mouse pointer, for "I design and build". It points like a compass:
 * - at your pointer while you move it, turning the shorter way round;
 * - otherwise at the copy, swaying from one side to the other as the page scrolls (`turn`, -1 to 1, written by
 *   the owner; 0 means it has come to rest above the footer, where it points down at the contact links);
 * it bobs a little and now and then "clicks": a quick press and a ring from its tip.
 * It fills the `.about-head` box, so a different object can replace it without touching the flow.
 */
const TIP_ANGLE = -125; // degrees: where the drawn arrow's tip points, seen from the middle of its box
const EASE = .1; // share of the way to the target angle per 60fps frame
const POINTER_HOLD = 2500; // ms the pointer keeps its attention after it stops

export function AboutCursor({ turn, rest, active }: { turn: RefObject<number>; rest: RefObject<number>; active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const live = useRef(active);
  useEffect(() => { live.current = active; }, [active]);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0, at: -Infinity };
    let angle = 0, frame = 0, last = 0, clock = 0, nextClick = 3.5;

    const onMove = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.at = performance.now(); };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (!live.current || document.hidden) { last = 0; return; }
      const dt = last ? Math.min(.05, (time - last) / 1000) : 1 / 60;
      last = time;
      clock += dt;
      const still = reduced.matches;
      const settled = rest.current; // 0 while travelling, 1 once it rests above the footer

      // Where it wants to point, in screen degrees (0 = right, 90 = down).
      const box = element.getBoundingClientRect();
      const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
      const watching = !still && performance.now() - pointer.at < POINTER_HOLD && Math.hypot(pointer.x - cx, pointer.y - cy) > box.width * .3;
      let aim = -90 + turn.current * 55; // up, leaning to the copy on one side or the other
      if (watching) aim = Math.atan2(pointer.y - cy, pointer.x - cx) * 180 / Math.PI;
      if (settled > .5 && !watching) aim = 90; // down at the contact links
      const target = aim - TIP_ANGLE;
      // The shorter way round.
      const delta = ((target - angle) % 360 + 540) % 360 - 180;
      angle += still ? delta : delta * (1 - Math.pow(1 - EASE, dt * 60));

      element.style.setProperty("--angle", `${angle.toFixed(2)}deg`);
      element.style.setProperty("--tilt", `${(still ? 0 : Math.max(-1, Math.min(1, delta / 60)) * 18).toFixed(2)}deg`);
      element.style.setProperty("--bob", still ? "0px" : `${(Math.sin(clock * 1.6) * 3).toFixed(2)}px`);

      // An idle click every 4–6s while nobody is moving the pointer.
      if (!still && !watching && clock > nextClick) {
        element.dataset.click = "";
        window.setTimeout(() => { delete element.dataset.click; }, 520);
        nextClick = clock + 4 + Math.random() * 2;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", onMove); };
  }, [turn, rest]);

  // The arrow is drawn with its tip at the top-left (0, 0); its extruded side sits a little below and right.
  const arrow = "M0 0 L0 22.5 L5.6 17 L9.4 25.6 L13.2 24 L9.5 15.6 L17 15.6 Z";
  return <div ref={root} className="about-cursor">
    <div className="about-cursor-body">
      <svg viewBox="-3 -3 24 32" aria-hidden>
        <defs>
          <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbfbfc" />
            <stop offset=".28" stopColor="#a7a7ae" />
            <stop offset=".5" stopColor="#2a2a2f" />
            <stop offset=".62" stopColor="#5d5d64" />
            <stop offset=".78" stopColor="#e4e4e8" />
            <stop offset="1" stopColor="#3a3a40" />
          </linearGradient>
          <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1c1c20" />
            <stop offset="1" stopColor="#050506" />
          </linearGradient>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".9" />
            <stop offset=".45" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Extrusion: the same outline nudged down-right, in dark metal, reads as the pointer's thickness. */}
        <path d={arrow} transform="translate(1.1 1.5)" fill={`url(#${id}-side)`} />
        <path d={arrow} fill={`url(#${id}-chrome)`} stroke="#fff" strokeWidth=".9" strokeLinejoin="round" />
        <path d={arrow} fill={`url(#${id}-sheen)`} transform="translate(1.6 3) scale(.62)" />
      </svg>
      <span className="about-cursor-ring" />
    </div>
  </div>;
}

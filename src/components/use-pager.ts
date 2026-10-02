"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Paging } from "./settings-store";

export const FLIP_MS = 720;
const FLIP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

/** Wheel distance that counts as "turn the page". */
const WHEEL_THRESHOLD = 12;
/** A pause this long between wheel events starts a new gesture. */
const GESTURE_GAP = 160;

/**
 * Full-screen vertical pager. Every page is exactly one viewport tall; the track slides by
 * one viewport per gesture. The track's `translateY(-n * 100%)` works because the track is
 * as tall as the viewport and the pages overflow it.
 */
export function usePager(count: number, paging: Paging, blocked: boolean) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);
  const blockedRef = useRef(blocked);
  const pagingRef = useRef(paging);

  useLayoutEffect(() => {
    blockedRef.current = blocked;
    pagingRef.current = paging;
  });

  const place = useCallback((i: number, offset = 0, animate = true) => {
    const track = trackRef.current;
    if (!track) return;
    if (pagingRef.current === "scroll") {
      track.style.transition = "none";
      track.style.transform = "none";
      return;
    }
    track.style.transition = animate ? `transform ${FLIP_MS}ms ${FLIP_EASE}` : "none";
    track.style.transform = `translate3d(0, calc(${-i * 100}% + ${offset}px), 0)`;
  }, []);

  const go = useCallback(
    (target: number, instant = false) => {
      const i = Math.max(0, Math.min(count - 1, target));
      const viewport = viewportRef.current;
      if (pagingRef.current === "scroll") {
        viewport?.scrollTo({ top: i * viewport.clientHeight, behavior: instant ? "instant" : "smooth" });
        return;
      }
      if (!instant) lockUntil.current = performance.now() + FLIP_MS;
      place(i, 0, !instant);
      if (i !== indexRef.current) {
        indexRef.current = i;
        setIndex(i);
      }
    },
    [count, place],
  );

  // Switching between flip and free scroll keeps the current page in view.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (paging === "scroll") {
      place(0);
      viewport.scrollTop = indexRef.current * viewport.clientHeight;
    } else {
      viewport.scrollTop = 0;
      place(indexRef.current, 0, false);
    }
  }, [paging, place]);

  // Free-scroll mode: the current page is whichever fills most of the screen.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || paging !== "scroll") return;
    const onScroll = () => {
      const i = Math.round(viewport.scrollTop / viewport.clientHeight);
      if (i !== indexRef.current) {
        indexRef.current = i;
        setIndex(i);
      }
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", onScroll);
  }, [paging]);

  // Flip mode: wheel, touch and a guard against the browser scrolling the hidden overflow.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || paging !== "flip") return;

    // One gesture turns one page. Trackpads keep sending decaying "inertia" deltas for a second
    // or more after the finger lifts; those must not turn more pages. A new gesture is a pause,
    // a fresh push (deltas rising again), or a mouse wheel that keeps turning (steady deltas).
    const gesture = { last: 0, dir: 0, acc: 0, armed: true, recent: [] as number[] };

    const onWheel = (e: WheelEvent) => {
      if (blockedRef.current || e.ctrlKey) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const now = performance.now();
      const dir = Math.sign(e.deltaY);
      if (!dir) return;

      // A panel that can still scroll this way gets the wheel; the page only turns at its edge,
      // and only on a fresh gesture.
      if (scrollableToward(e.target, dir)) {
        gesture.armed = false;
        gesture.last = now;
        return;
      }
      e.preventDefault();

      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewport.clientHeight : 1;
      const delta = e.deltaY * unit;
      const reversed = dir !== gesture.dir;
      const gap = reversed ? Infinity : now - gesture.last;
      gesture.last = now;
      gesture.dir = dir;
      if (gap > GESTURE_GAP) gesture.recent = [];
      gesture.recent.push(Math.abs(delta));
      if (gesture.recent.length > 8) gesture.recent.shift();

      // While a page is turning, the rest of this gesture is spent.
      if (now < lockUntil.current) {
        gesture.armed = false;
        gesture.acc = 0;
        return;
      }
      if (!gesture.armed && (gap > GESTURE_GAP || isNewPush(gesture.recent))) gesture.armed = true;
      if (!gesture.armed) return;

      if (gap > 400 || Math.sign(gesture.acc) === -dir) gesture.acc = 0;
      gesture.acc += delta;
      if (Math.abs(gesture.acc) < WHEEL_THRESHOLD) return;
      gesture.armed = false;
      gesture.acc = 0;
      const target = indexRef.current + dir;
      if (target >= 0 && target < count) go(target);
    };

    // Touch: the page follows the finger, then settles on the nearest page.
    let touch: {
      y0: number;
      x0: number;
      t0: number;
      dy: number;
      mode: "undecided" | "drag" | "native";
    } | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (blockedRef.current || e.touches.length !== 1 || performance.now() < lockUntil.current - 200) {
        touch = null;
        return;
      }
      const t = e.touches[0];
      touch = { y0: t.clientY, x0: t.clientX, t0: performance.now(), dy: 0, mode: "undecided" };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touch || touch.mode === "native") return;
      const t = e.touches[0];
      const dy = t.clientY - touch.y0;
      const dx = t.clientX - touch.x0;
      if (touch.mode === "undecided") {
        if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;
        const swipingDown = dy > 0;
        touch.mode =
          Math.abs(dx) > Math.abs(dy) || scrollableToward(e.target, swipingDown ? -1 : 1) ? "native" : "drag";
        if (touch.mode === "native") return;
        touch.y0 = t.clientY; // start from here so the page doesn't jump by the dead zone
        touch.t0 = performance.now();
      }
      e.preventDefault();
      let offset = t.clientY - touch.y0;
      const atEdge = (indexRef.current === 0 && offset > 0) || (indexRef.current === count - 1 && offset < 0);
      if (atEdge) offset *= 0.3;
      touch.dy = offset;
      place(indexRef.current, offset, false);
    };

    const onTouchEnd = () => {
      if (!touch || touch.mode !== "drag") {
        touch = null;
        return;
      }
      const { dy, t0 } = touch;
      touch = null;
      const velocity = dy / Math.max(1, performance.now() - t0);
      const far = Math.abs(dy) > viewport.clientHeight * 0.18;
      const flick = Math.abs(velocity) > 0.35 && Math.abs(dy) > 24;
      const dir = far || flick ? -Math.sign(dy) : 0;
      const target = indexRef.current + dir;
      if (dir && target >= 0 && target < count) go(target);
      else place(indexRef.current);
    };

    // Focus moving into another page would scroll the hidden overflow and break the layout.
    const onScroll = () => {
      if (viewport.scrollTop !== 0) viewport.scrollTop = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd);
    viewport.addEventListener("touchcancel", onTouchEnd);
    viewport.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, [paging, count, go, place]);

  return { index, go, viewportRef, trackRef };
}

/** Compares the last 4 wheel deltas with the 4 before them. Inertia only ever decays. */
function isNewPush(recent: number[]) {
  if (recent.length < 8) return false;
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const older = avg(recent.slice(0, 4));
  const newer = avg(recent.slice(4));
  const rising = newer > older * 1.2 && newer > 8;
  const steadyWheel = newer >= older * 0.98 && newer >= 30;
  return rising || steadyWheel;
}

/** True when an element between `target` and the page can still scroll in `dir` (1 = down). */
function scrollableToward(target: EventTarget | null, dir: number) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && el.dataset.pager !== undefined) return false;
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) {
      if (dir > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      if (dir < 0 && el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  return false;
}

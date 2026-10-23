"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motionTokens } from "@/lib/motion";
import type { Paging } from "./settings-store";

export const FLIP_MS = motionTokens.duration.slide * 1000;
const FLIP_EASE = `cubic-bezier(${motionTokens.easeOut.join(",")})`;

/** Wheel distance that counts as "turn the page". */
const WHEEL_THRESHOLD = 12;
/** A pause this long between wheel events starts a new gesture. */
const GESTURE_GAP = 220;

/**
 * Full-screen vertical pager. Every page is exactly one viewport tall; the track slides by
 * one viewport per gesture. The track's `translateY(-n * 100%)` works because the track is
 * as tall as the viewport and the pages overflow it.
 */
export function usePager(count: number, paging: Paging, blocked: boolean, elasticSections = false) {
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
      place(i, 0, !instant && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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

    // One gesture turns one page. A trackpad's momentum can last longer than the slide;
    // a steady stream of wheel events remains the same gesture until it pauses or builds
    // from a clear low-delta valley into a new push.
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gesture = { last: 0, dir: 0, acc: 0, armed: true, turned: false, recent: [] as number[] };

    const onWheel = (e: WheelEvent) => {
      if (blockedRef.current || e.ctrlKey) return;
      if (e.target instanceof Node && !viewport.contains(e.target)) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const now = performance.now();
      const dir = Math.sign(e.deltaY);
      if (!dir) return;

      // Protect the destination during the transition and a short settling period.
      // Never extend this deadline as momentum events arrive: that traps fast scrollers.
      const continued = dir === gesture.dir && now - gesture.last <= GESTURE_GAP;
      if (now < lockUntil.current || (gesture.turned && continued && now < lockUntil.current + 100)) {
        e.preventDefault();
        gesture.turned = true;
        gesture.armed = false;
        gesture.acc = 0;
        gesture.last = now;
        gesture.dir = dir;
        return;
      }
      gesture.turned = false;

      // A panel that can still scroll this way gets the wheel; the page only turns at its edge,
      // and only on a fresh gesture.
      if (scrollableToward(e.target, dir)) {
        clearTimeout(settleTimer);
        if (gesture.acc) { place(indexRef.current, 0, !reduced()); gesture.acc = 0; }
        gesture.armed = false;
        gesture.last = now;
        gesture.dir = dir;
        return;
      }
      e.preventDefault();

      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewport.clientHeight : 1;
      const delta = e.deltaY * unit;
      const reversed = dir !== gesture.dir;
      const gap = reversed ? Infinity : now - gesture.last;
      gesture.last = now;
      gesture.dir = dir;
      if (gap > GESTURE_GAP) { gesture.recent = []; gesture.acc = 0; }
      gesture.recent.push(Math.abs(delta));
      if (gesture.recent.length > 8) gesture.recent.shift();

      // Sustained intentional scrolling can continue at an edge after a bounded
      // cooldown; small decaying momentum still cannot trigger another slide.
      const sustainedPush = now >= lockUntil.current + 300 && Math.abs(delta) >= 24;
      if (!gesture.armed && (gap > GESTURE_GAP || isNewPush(gesture.recent) || sustainedPush)) gesture.armed = true;
      if (!gesture.armed) return;

      if (gap > 400 || Math.sign(gesture.acc) === -dir) gesture.acc = 0;
      gesture.acc += delta;
      const threshold = elasticSections ? 110 : WHEEL_THRESHOLD;
      if (Math.abs(gesture.acc) < threshold) {
        if (elasticSections) {
          const target = indexRef.current + dir;
          if (!reduced()) place(indexRef.current, -gesture.acc * (target >= 0 && target < count ? .55 : .18), false);
          clearTimeout(settleTimer);
          settleTimer = setTimeout(() => {
            gesture.acc = 0;
            place(indexRef.current, 0, !reduced());
          }, 140);
        }
        return;
      }
      clearTimeout(settleTimer);
      gesture.armed = false;
      gesture.acc = 0;
      const target = indexRef.current + dir;
      if (target >= 0 && target < count) { gesture.turned = true; go(target); }
      else place(indexRef.current, 0, !reduced());
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
      const flick = Math.abs(velocity) > 0.35 && Math.abs(dy) > (elasticSections ? 64 : 24);
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
      clearTimeout(settleTimer);
      window.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, [paging, count, go, place, elasticSections]);

  return { index, go, viewportRef, trackRef };
}

/** Detects a renewed push after the prior gesture has slowed almost to rest. */
function isNewPush(recent: number[]) {
  if (recent.length < 8) return false;
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const older = avg(recent.slice(0, 4));
  const newer = avg(recent.slice(4));
  return older < 8 && newer > Math.max(18, older * 2.5);
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

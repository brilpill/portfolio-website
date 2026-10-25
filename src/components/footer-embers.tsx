"use client";

import { useEffect, useRef } from "react";

/** Original lightweight glyph fire, inspired by the supplied Glyph Ember preview. */
export function FooterEmbers() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, last = 0, visible = false, time = 0;
    const pointer = { x: -1000, y: -1000 };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textAlign = "center";
      const ramp = ".:;+=x*#@";
      for (let x = 5; x < width; x += 9) {
        const wave = Math.sin(x * .021 + time * .9) * .16 + Math.sin(x * .053 - time * 1.3) * .1;
        const plume = .45 + wave + Math.sin(x * .009 + time * .5) * .12;
        for (let y = height - 6; y > 8; y -= 12) {
          const rise = (height - y) / height;
          const curl = Math.sin(x * .06 + y * .08 + time * 2) * .05;
          let heat = Math.max(0, 1 - rise / Math.max(.12, plume + curl));
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          heat *= Math.min(1, distance / 65);
          if (heat < .045) continue;
          const shimmer = Math.sin(x * 17 + y * 9 + Math.floor(time * 6)) * .12;
          const glyph = ramp[Math.min(ramp.length - 1, Math.max(0, Math.floor((heat + shimmer) * ramp.length)))];
          context.fillStyle = `rgba(0,75,254,${Math.min(.64, heat * .65).toFixed(2)})`;
          context.fillText(glyph, x + Math.sin(rise * 7 + time) * rise * 8, y);
        }
        // Sparse rising embers above the main bed.
        if (Math.sin(x * 3.7) > .94) {
          const rise = ((time * 20 + x * 2.3) % height);
          context.fillStyle = `rgba(0,75,254,${(.3 * (1 - rise / height)).toFixed(2)})`;
          context.fillText("·", x + Math.sin(time + x) * 8, height - rise);
        }
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || reduced.matches) return;
      if (now - last >= 1000 / 24) {
        time += Math.min(.08, (now - last) / 1000);
        last = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; last = performance.now();
      draw();
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const box = element.getBoundingClientRect();
      width = box.width; height = box.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0); sync();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top;
    };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    resize.observe(element); observer.observe(element);
    element.addEventListener("pointermove", move); element.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", sync); document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave);
      reduced.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return <canvas ref={canvas} className="about-footer-embers" aria-hidden="true" />;
}

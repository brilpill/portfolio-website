"use client";

import { useEffect, useRef } from "react";

/** Original falling glyphs inspired by the supplied aiforui.dev reference. */
export function AboutTopArt() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current, context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, last = 0, time = 0, visible = false;
    const glyphs = "0123456789.:+=<>";
    const hash = (n: number) => { const v = Math.sin(n * 127.1) * 43758.5453; return v - Math.floor(v); };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textAlign = "center";
      for (let col = 0, x = 6; x < width; col++, x += 13) {
          const speed = 22 + hash(col + 3) * 28;
          const head = (time * speed + hash(col) * (height + 180)) % (height + 180) - 30;
          for (let trail = 0; trail < 12; trail++) {
            const y = head - trail * 15;
            if (y < 4 || y > height) continue;
            const alpha = (1 - trail / 12) * .34;
            context.fillStyle = `rgba(0,75,254,${alpha})`;
            context.fillText(glyphs[Math.floor(hash(col * 61 + trail + Math.floor(time * 3)) * glyphs.length)], x, y);
          }

      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || reduced.matches || document.hidden) return;
      if (now - last > 1000 / 30) { time += Math.min(.08, (now - last) / 1000); last = now; draw(); }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; last = performance.now(); draw();
      if (visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect(); width = rect.width; height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0); sync();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(element); observer.observe(element);
    reduced.addEventListener("change", sync); document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      reduced.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return <canvas ref={canvas} className="about-top-art" aria-hidden="true" />;
}

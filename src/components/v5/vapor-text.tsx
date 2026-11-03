"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

/* Text that condenses out of vapour the first time it comes into view (our own take on the "Vapor Type" idea from
 * React Bits Pro, not its code). The lettering is drawn on a canvas as one particle per device pixel, gathering from the
 * centre outward out of a blue haze that starts pushed away from the middle; when it has formed, the canvas steps aside and the real text shows, crisp and
 * selectable. Until then the element keeps its place with transparent text; reduced motion shows the plain text.
 *
 * Use for headings: <V5VaporText as="h2" className="…">Title</V5VaporText>. Children are text (and <br />);
 * wrapped lines and nested inline styling are read from the rendered element. */

const SPREAD = 1.2;     // how far the vapour sits from the letters, in font sizes
const RISE = 1;         // upward offset of the vapour
const TURBULENCE = 0.8; // curl of the wisps
const DIFFUSION = 0.35; // scatter of single particles
const STAGGER = 0.8;    // how drawn-out the centre-out sweep is
const CONDENSE = 1.8;   // seconds for a particle to settle

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Any CSS colour as 0–255 channels (the canvas normalises it to #rrggbb or rgba()). */
function rgb(css: string, probe: CanvasRenderingContext2D): [number, number, number] {
  probe.fillStyle = "#000";
  probe.fillStyle = css.trim() || "#000";
  const value = String(probe.fillStyle);
  if (value.startsWith("#")) return [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16)) as [number, number, number];
  return (value.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number) as [number, number, number];
}

type Field = { w: number; h: number; hx: Float32Array; hy: Float32Array; a: Uint8Array; vx: Float32Array; vy: Float32Array; seed: Float32Array; sweep: Float32Array; fs: number };

/** Draws the element's own text (each line where the browser laid it out) and turns its pixels into particles. */
function rasterize(el: HTMLElement, canvas: HTMLCanvasElement): Field | null {
  const fs = parseFloat(getComputedStyle(el).fontSize);
  const pad = Math.ceil(fs * 1.6);
  const box = el.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = box.width + pad * 2, cssH = box.height + pad * 2;
  const w = Math.ceil(cssW * dpr), h = Math.ceil(cssH * dpr);
  if (!box.width || !box.height) return null;
  canvas.width = w; canvas.height = h;
  Object.assign(canvas.style, { left: `${-pad}px`, top: `${-pad}px`, width: `${cssW}px`, height: `${cssH}px` });

  const off = document.createElement("canvas");
  off.width = w; off.height = h;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    if (!text.trim() || !node.parentElement) continue;
    const style = getComputedStyle(node.parentElement);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = style.letterSpacing;
    const ascent = ctx.measureText(text).fontBoundingBoxAscent;
    // Split the run into the lines the browser wrapped it onto: characters that share a line box share a top.
    let start = 0, lineTop = NaN, lineLeft = 0;
    const flush = (end: number) => {
      const part = text.slice(start, end);
      if (part.trim()) ctx.fillText(part, lineLeft - box.left + pad, lineTop - box.top + pad + ascent);
    };
    for (let i = 0; i < text.length; i++) {
      range.setStart(node, i); range.setEnd(node, i + 1);
      const r = range.getClientRects()[0];
      if (!r) continue;
      if (Number.isNaN(lineTop)) { lineTop = r.top; lineLeft = r.left; start = i; continue; }
      if (Math.abs(r.top - lineTop) > 2) { flush(i); start = i; lineTop = r.top; lineLeft = r.left; }
    }
    if (!Number.isNaN(lineTop)) flush(text.length);
  }

  const pixels = ctx.getImageData(0, 0, w, h).data;
  let count = 0;
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 8) count++;
  const f: Field = { w, h, fs: fs * dpr, hx: new Float32Array(count), hy: new Float32Array(count), a: new Uint8Array(count), vx: new Float32Array(count), vy: new Float32Array(count), seed: new Float32Array(count), sweep: new Float32Array(count) };
  // The block's centre and half-size, so each pixel knows how far out from the middle it sits.
  const cx = (pad + box.width / 2) * dpr, cy = (pad + box.height / 2) * dpr;
  const hw = (box.width / 2) * dpr, hh = (box.height / 2) * dpr;
  const grain = fs * dpr * 0.18;
  let k = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const alpha = pixels[(y * w + x) * 4 + 3];
    if (alpha <= 8) continue;
    const r1 = Math.random(), r2 = Math.random(), r3 = Math.random();
    // Letters form in clumps: neighbours in a grain-sized cell share a little of their timing.
    const clump = Math.abs(Math.sin(Math.floor(x / grain) * 12.9898 + Math.floor(y / grain) * 78.233) * 43758.5453) % 1;
    f.hx[k] = x; f.hy[k] = y; f.a[k] = alpha; f.seed[k] = r1;
    // Its distance out from the centre sets its turn (the middle forms first) and which way its vapour is pushed:
    // outward, mostly sideways since the block is wide, with a little rise.
    const dx = (x - cx) / hw, dy = (y - cy) / hh;
    f.sweep[k] = clamp01(Math.hypot(dx, dy * 0.35)) * 0.85 + clump * 0.15;
    f.vx[k] = (dx * (0.25 + r1 * 0.75) * 0.9 * SPREAD + (r3 - 0.5) * DIFFUSION * 1.2) * f.fs;
    f.vy[k] = ((dy * 0.5 - 0.3) * (0.3 + r2 * 0.7) * 0.8 * RISE * SPREAD + (r1 - 0.5) * DIFFUSION * 0.6) * f.fs;
    k++;
  }
  return f;
}

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

export function V5VaporText({ as: As = "h2", className, children, textRef }: { as?: Tag; className?: string; children: ReactNode; textRef?: RefObject<HTMLElement | null> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const own = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = textRef ?? own;

  useEffect(() => {
    const el = text.current, cv = canvas.current, box = wrap.current;
    if (!el || !cv || !box) return;
    const ctx = cv.getContext("2d");
    const finish = () => { box.dataset.vapor = "done"; };
    if (!ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    let frame = 0, alive = true;

    const play = () => {
      const field = rasterize(el, cv);
      if (!field) { finish(); return; }
      // The text keeps its real colour (only its fill is hidden while pending), so the particles land in it.
      const [tr, tg, tb] = rgb(getComputedStyle(el).color, ctx), [vr, vg, vb] = rgb(getComputedStyle(box).getPropertyValue("--v5-blue"), ctx);
      const image = ctx.createImageData(field.w, field.h);
      const { w, h, hx, hy, a, vx, vy, seed, sweep, fs } = field;
      const curl = TURBULENCE * fs;
      const start = performance.now() / 1000;
      const end = STAGGER * CONDENSE * 0.6 + CONDENSE;
      box.dataset.vapor = "on";
      const draw = () => {
        if (!alive) return;
        const t = performance.now() / 1000 - start;
        const data = image.data;
        data.fill(0);
        for (let i = 0; i < hx.length; i++) {
          // Each particle settles in its turn, centre first, losing the vapour's colour and drift as it lands.
          const v = 1 - smooth(clamp01((t - sweep[i] * STAGGER * CONDENSE * 0.6) / CONDENSE));
          let x = hx[i], y = hy[i], alpha = a[i], r = tr, g = tg, b = tb;
          if (v > 0.002) {
            const k = v * v;
            x += vx[i] * k + Math.sin(hy[i] * 0.02 + t * 1.7 + seed[i] * 6.283) * curl * 0.25 * k;
            y += vy[i] * k + Math.cos(hx[i] * 0.015 + t * 1.3 + seed[i] * 6.283) * curl * 0.15 * k;
            alpha *= (1 - v) ** 0.6;
            const m = Math.min(1, v * 1.6);
            r += (vr - r) * m; g += (vg - g) * m; b += (vb - b) * m;
          }
          if (alpha < 2) continue;
          const ix = x | 0, iy = y | 0;
          if (ix < 0 || iy < 0 || ix >= w || iy >= h) continue;
          const o = (iy * w + ix) * 4;
          if (data[o + 3] >= alpha) continue;
          data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = alpha;
        }
        ctx.putImageData(image, 0, 0);
        // Formed: hand back to the real text (crisp, selectable, follows theme and resizes on its own).
        if (t >= end) finish(); else frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    };

    // Play the first time it's on screen, once its font has loaded so the particles match the real glyphs.
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      seen.disconnect();
      document.fonts.ready.then(() => { if (alive) play(); });
    }, { threshold: 0.3 });
    seen.observe(el);
    // A resize mid-sweep would misalign the particles; just show the text.
    const resized = new ResizeObserver(entries => { if (box.dataset.vapor === "on" && entries[0].contentRect.width) { cancelAnimationFrame(frame); finish(); } });
    resized.observe(el);
    return () => { alive = false; cancelAnimationFrame(frame); seen.disconnect(); resized.disconnect(); };
  }, [text]);

  return (
    <div ref={wrap} className="v5-vapor" data-vapor="pending">
      <As ref={text as RefObject<HTMLHeadingElement>} className={className}>{children}</As>
      <canvas ref={canvas} className="v5-vapor-canvas" aria-hidden />
    </div>
  );
}

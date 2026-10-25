"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

/**
 * Activity heatmap in a dither style (after useplanes.com/components/dither-heatmap; original Canvas 2D code,
 * not their component). One cell per day for a year; each cell fills with an ordered 4×4 Bayer pattern whose
 * density follows the value. The data is sample data until the GitHub and timer exports are connected.
 */
const WEEKS = 53;
const DOT = 2; // css px per dither dot
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
const END = new Date(2026, 9, 23); // fixed so the server and client agree on the grid
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const sources = [
  { label: "GitHub", unit: "contributions", seed: 7, scale: 14, weekend: .35 },
  { label: "Design + build hours", unit: "hours", seed: 23, scale: 9, weekend: .2 },
  { label: "Saved and shipped", unit: "items", seed: 41, scale: 6, weekend: .7 },
];

function random(seed: number) {
  return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

/** Day of the cell at (week, weekday), Monday first; the last column ends on END. */
function dayAt(week: number, weekday: number) {
  const endWeekday = (END.getDay() + 6) % 7;
  const date = new Date(END);
  date.setDate(END.getDate() - (WEEKS - 1 - week) * 7 - (endWeekday - weekday));
  return date;
}

function sampleData(source: (typeof sources)[number]) {
  const next = random(source.seed);
  return Array.from({ length: WEEKS * 7 }, (_, i) => {
    const week = Math.floor(i / 7), weekday = i % 7;
    if (dayAt(week, weekday) > END) return -1; // future days stay empty
    // Busy stretches that come and go over the year, quieter weekends, and some empty days.
    const season = .55 + .45 * Math.sin(week / 6.5 + source.seed);
    const base = next() < .14 ? 0 : next() * season * (weekday > 4 ? source.weekend : 1);
    return Math.round(base * source.scale);
  });
}

export function DitherHeatmap() {
  const [sourceIndex, setSourceIndex] = useState(0);
  const source = sources[sourceIndex];
  const data = useMemo(() => sampleData(source), [source]);
  const max = Math.max(...data);
  const total = data.reduce((sum, value) => sum + Math.max(0, value), 0);
  const activeDays = data.filter(value => value > 0).length;
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const shown = useRef<number[]>(data.map(() => 0));
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
  const [cell, setCell] = useState(12);

  // Month labels sit over the first week that starts in that month.
  const months = useMemo(() => Array.from({ length: WEEKS }, (_, week) => {
    const first = dayAt(week, 0), previous = dayAt(week - 1, 0);
    return week === 0 || first.getMonth() !== previous.getMonth() ? MONTHS[first.getMonth()] : "";
  }), []);

  // The cell size follows the available width, in whole dither dots so the pattern stays crisp.
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const fit = Math.floor((entry.contentRect.width - 32 - 3 * (WEEKS - 1)) / WEEKS / DOT) * DOT;
      setCell(Math.max(6, Math.min(16, fit)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Values ease from what is shown to the new data: a dither-in on first view, a crossfade on switching source.
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d")!;
    const gap = 3, ratio = window.devicePixelRatio || 1;
    const width = WEEKS * (cell + gap) - gap, height = 7 * (cell + gap) - gap;
    element.width = width * ratio; element.height = height * ratio;
    element.style.width = `${width}px`; element.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const ink = getComputedStyle(element).color;
    const from = [...shown.current];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let start = 0, raf = 0, observer: IntersectionObserver | undefined;

    const draw = (progress: number) => {
      context.clearRect(0, 0, width, height);
      for (let i = 0; i < data.length; i++) {
        if (data[i] < 0) continue;
        const week = Math.floor(i / 7), weekday = i % 7;
        // Columns arrive left to right, each easing in over the last 40% of its own window.
        const local = Math.min(1, Math.max(0, (progress * 1.4 - week / WEEKS * .4)));
        const eased = 1 - Math.pow(1 - local, 3);
        const value = from[i] + ((max ? data[i] / max : 0) - from[i]) * eased;
        shown.current[i] = value;
        const x = week * (cell + gap), y = weekday * (cell + gap);
        context.globalAlpha = .07;
        context.fillStyle = ink;
        context.fillRect(x, y, cell, cell);
        context.globalAlpha = 1;
        if (value <= 0) continue;
        for (let dy = 0; dy < cell; dy += DOT) for (let dx = 0; dx < cell; dx += DOT) {
          if (BAYER[((dy / DOT) % 4) * 4 + (dx / DOT) % 4] < value * .96 + .04) context.fillRect(x + dx, y + dy, DOT, DOT);
        }
      }
    };
    const run = (time: number) => {
      if (!start) start = time;
      const progress = Math.min(1, (time - start) / 900);
      draw(progress);
      if (progress < 1) raf = requestAnimationFrame(run);
    };

    if (reduced) draw(1);
    else {
      draw(0);
      // The first dither-in waits until the heatmap scrolls into view.
      observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { observer?.disconnect(); raf = requestAnimationFrame(run); } }, { threshold: .4 });
      observer.observe(element);
    }
    return () => { cancelAnimationFrame(raf); observer?.disconnect(); };
  }, [data, max, cell]);

  const pointAt = (clientX: number, clientY: number) => {
    const rect = canvas.current!.getBoundingClientRect();
    const week = Math.floor((clientX - rect.left) / (cell + 3)), weekday = Math.floor((clientY - rect.top) / (cell + 3));
    if (week < 0 || week >= WEEKS || weekday < 0 || weekday > 6) return null;
    const index = week * 7 + weekday;
    if (data[index] < 0) return null;
    return { index, x: week * (cell + 3) + cell / 2, y: weekday * (cell + 3) };
  };
  const hovered = hover && dayAt(Math.floor(hover.index / 7), hover.index % 7);

  return <section className="about-activity" aria-labelledby="about-activity-heading">
    <div className="about-activity-head">
      <div>
        <span className="content-kicker">Activity · sample data</span>
        <h2 id="about-activity-heading">What I’ve been building.</h2>
      </div>
      <div className="about-activity-switch" role="group" aria-label="Data source">
        {sources.map((item, i) => <button key={item.label} type="button" aria-pressed={i === sourceIndex} onClick={() => setSourceIndex(i)}>{item.label}</button>)}
      </div>
    </div>
    <div className="about-activity-body" ref={frame} style={{ "--cell": `${cell}px` } as CSSProperties}>
      <div className="about-activity-months" aria-hidden>{months.map((month, i) => <span key={i}>{month}</span>)}</div>
      <div className="about-activity-grid">
        <div className="about-activity-days" aria-hidden>{DAYS.map((day, i) => <span key={i}>{day}</span>)}</div>
        <div className="about-activity-canvas">
          <canvas ref={canvas} role="img" aria-label={`${total} ${source.unit} over the last year, on ${activeDays} days. Sample data.`}
            onPointerMove={event => setHover(event.pointerType === "mouse" ? pointAt(event.clientX, event.clientY) : null)} onPointerLeave={() => setHover(null)} />
          {hover && hovered && <span className="about-activity-tip" style={{ left: hover.x, top: hover.y }}>
            {hovered.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · {data[hover.index]} {data[hover.index] === 1 ? source.unit.slice(0, -1) : source.unit}
          </span>}
        </div>
      </div>
      <div className="about-activity-foot">
        <span><strong>{total.toLocaleString("en-GB")}</strong> {source.unit} · <strong>{activeDays}</strong> active days</span>
        <span className="about-activity-legend" aria-hidden>0<i /><i /><i /><i />{max}</span>
      </div>
    </div>
    <p className="about-activity-note">Phase 2 swaps the sample for GitHub, and for hours from a timer I built myself.</p>
  </section>;
}

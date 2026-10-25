"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";

export type CaseNumber = { value: string; label: string; from?: string };
/**
 * Numbers row layouts (docs/case-template.md), both on hairlines across the column:
 * - row: the figures (the default).
 * - before-after: each figure as `from → value`, for a change worth showing.
 */
export type NumbersLayout = "row" | "before-after";

/** Counts a plain number up from zero once it scrolls into view; anything else (12 → 7, 6 × 4, 30%+) fades in. */
function Count({ value, run }: { value: string; run: boolean }) {
  const span = useRef<HTMLSpanElement>(null);
  const match = /^(\D*)(\d+(?:\.\d+)?)(\D*)$/.exec(value);
  useEffect(() => {
    const element = span.current;
    if (!run || !match || !element) return;
    const target = Number(match[2]), decimals = match[2].split(".")[1]?.length ?? 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { element.textContent = value; return; }
    let frame = 0; const start = performance.now();
    const tick = (time: number) => {
      const t = Math.min(1, (time - start) / 900), eased = 1 - Math.pow(1 - t, 3);
      element.textContent = `${match[1]}${(target * eased).toFixed(decimals)}${match[3]}`;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps
  return <><span ref={span} className="case-numbers-count" aria-hidden>{match ? `${match[1]}0${match[3]}` : value}</span><span className="home-sr-only">{value}</span></>;
}

export function CaseNumbers({ items, layout = "row" }: { items: CaseNumber[]; layout?: NumbersLayout }) {
  const root = useRef<HTMLDListElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } }, { threshold: .4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // 1–4 figures, one column each.
  return <dl ref={root} className="case-numbers" data-layout={layout} data-seen={seen || undefined} style={{ "--count": Math.min(4, items.length) } as CSSProperties}>
    {items.map((item, i) => <div key={item.label} style={{ "--i": i } as CSSProperties}>
      <dt>{item.label}</dt>
      <dd>
        {layout === "before-after" && item.from && <><span className="case-numbers-from">{item.from}</span><ArrowRightIcon className="case-numbers-arrow" aria-label="to" /></>}
        <Count value={item.value} run={seen} />
      </dd>
    </div>)}
  </dl>;
}

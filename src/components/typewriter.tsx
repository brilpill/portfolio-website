"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

/** A run of text, optionally wrapped (a link, a line break that only shows on wide screens…). */
export type TypePart = { text: string; wrap?: (typed: string) => React.ReactNode };

/**
 * Types its text in once `start` is true. The full text is laid out underneath, invisible,
 * so the block keeps its final size and nothing below it moves while typing. Screen readers
 * get the full text at once; reduced-motion visitors see it immediately.
 */
export function Typewriter({
  parts,
  start = true,
  delay = 0,
  speed = 40,
  onDone,
  className = "",
}: {
  parts: TypePart[];
  start?: boolean;
  delay?: number;
  /** Milliseconds per character */
  speed?: number;
  onDone?: () => void;
  className?: string;
}) {
  const total = parts.reduce((n, p) => n + p.text.length, 0);
  const [count, setCount] = useState(0);
  const [caret, setCaret] = useState(false);
  const totalRef = useRef(total);
  useLayoutEffect(() => {
    totalRef.current = total;
  });

  useEffect(() => {
    if (!start) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => {
        setCount(totalRef.current);
        onDone?.();
      });
      return () => cancelAnimationFrame(id);
    }
    let n = 0;
    let tick: ReturnType<typeof setInterval>;
    let hideCaret: ReturnType<typeof setTimeout>;
    const begin = setTimeout(() => {
      setCaret(true);
      tick = setInterval(() => {
        n += 1;
        setCount(n);
        if (n >= totalRef.current) {
          clearInterval(tick);
          onDone?.();
          hideCaret = setTimeout(() => setCaret(false), 900);
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(begin);
      clearInterval(tick);
      clearTimeout(hideCaret);
    };
    // Types once per mount; later prop changes don't restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  const render = (limit: number) => {
    let left = limit;
    return parts.map((p, i) => {
      const shown = p.text.slice(0, Math.max(0, left));
      left -= p.text.length;
      if (!shown && p.text) return null;
      return <Fragment key={i}>{p.wrap ? p.wrap(shown) : shown}</Fragment>;
    });
  };

  return (
    <span className={`relative inline-grid ${className}`}>
      <span className="sr-only">{parts.map((p) => p.text).join("")}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {render(total)}
      </span>
      <span aria-hidden className="col-start-1 row-start-1">
        {render(count)}
        {caret && <span className="type-caret" />}
      </span>
    </span>
  );
}

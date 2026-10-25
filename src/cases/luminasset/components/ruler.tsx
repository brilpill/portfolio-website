"use client";

import { useRef, useState, type CSSProperties } from "react";
import "./ruler.css";
import { playCue } from "@/components/ui-sound";

/**
 * The system size ruler, from the Figma "slider" component: a strip of ticks under a fixed centre mark, the current
 * value large and white. Drag the strip (it follows the pointer, then settles on a whole step) or use the arrow
 * keys (Shift: five steps). Sized in screen points: the parent sets --u (1/393 of the screen).
 */
const STEP = 42; // points between whole steps

export function Ruler({ value, max, onChange, label, valueText }: { value: number; max: number; onChange: (value: number) => void; label: string; valueText?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ start: number; from: number; at: number } | null>(null);
  const position = drag ? drag.at : value;
  // Each whole step passed ticks, like a detent.
  const set = (next: number) => {
    const clamped = Math.max(0, Math.min(max, Math.round(next)));
    if (clamped !== value) playCue("key");
    onChange(clamped);
  };
  const pointsToPixels = () => (root.current?.offsetWidth ?? 393) / 393;

  return <div ref={root} className="la-ruler" role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-valuetext={valueText}
    data-dragging={drag ? "" : undefined}
    onPointerDown={event => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); setDrag({ start: event.clientX, from: value, at: value }); }}
    onPointerMove={event => {
      if (!drag) return;
      const at = Math.max(0, Math.min(max, drag.from - (event.clientX - drag.start) / (STEP * pointsToPixels())));
      setDrag({ ...drag, at });
      set(at);
    }}
    onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}
    onKeyDown={event => {
      const step = event.shiftKey ? 5 : 1;
      const next = { ArrowRight: value + step, ArrowUp: value + step, ArrowLeft: value - step, ArrowDown: value - step, Home: 0, End: max }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      set(next);
    }}>
    <div className="la-ruler-track" style={{ "--position": position } as CSSProperties}>
      {Array.from({ length: max + 1 }, (_, step) => <span key={step} className="la-ruler-tick" data-current={step === value || undefined} style={{ "--at": step } as CSSProperties}><b>{step}</b></span>)}
    </div>
    <span className="la-ruler-marker" aria-hidden />
  </div>;
}

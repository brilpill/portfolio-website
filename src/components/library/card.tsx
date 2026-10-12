"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Card } from "@/lib/library";
import { Logo, Picture } from "./picture";

/** Hover this long before a clip loads, so sweeping the cursor across the grid fetches nothing. */
const DWELL_MS = 180;

export function LibraryCard({ card }: { card: Card }) {
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const enter = () => {
    if (!card.motion) return;
    timer.current = setTimeout(() => setPlaying(true), DWELL_MS);
  };
  const leave = () => {
    clearTimeout(timer.current);
    setPlaying(false);
  };

  return (
    <Link
      href={`/library/${card.slug}`}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-raised shadow-card transition-[translate] duration-500 ease-out-quint hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-paper">
        <Picture srcs={card.pictures} palette={card.palette} />
        {playing && card.motion && (
          <video
            src={card.motion}
            className="absolute inset-0 size-full object-cover object-top"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        )}
        {card.motion && (
          <span
            className={`label absolute bottom-2 right-2 rounded-md bg-raised/90 px-1.5 py-0.5 backdrop-blur transition-opacity duration-300 ${
              playing ? "opacity-0" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            moves
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center gap-2">
          <Logo src={card.logo} name={card.title} size={16} />
          <span className="truncate text-[14px] font-medium">{card.title}</span>
          {card.status === "active" && (
            <span className="ml-auto size-1.5 shrink-0 rounded-full bg-green-500" title="I use this" />
          )}
        </div>
        {card.summary && <p className="line-clamp-2 text-[13px] leading-snug text-muted">{card.summary}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-1.5">
          <span className="label truncate">{card.kind}</span>
          {card.palette.length > 0 && (
            <span className="flex h-2.5 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-line" aria-hidden>
              {card.palette.map((c, i) => (
                <span key={i} className="flex-1" style={{ background: c }} />
              ))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

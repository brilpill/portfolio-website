"use client";

import { useEffect, useRef, useState } from "react";
import type { V5FunItem } from "@/content/v5";
import { playCue } from "@/components/ui-sound";
import { MediaViewer, originOf } from "@/components/media-viewer";
import { FadeImg, FadeVideo } from "./media";
import { IconChevronEnd } from "./icons";
import { SelFrame } from "./sel-frame";

export type V5PlayItem = V5FunItem & { w: number; h: number };

/** The Playground as one strip (Figma Final, Playground 1328:33160): pieces at one height in their own proportions,
 * 16px apart, scrolling sideways with round arrows at the screen edges. A source filter (Button, ghost / primary) sits
 * above. A piece opens in the media viewer (the main site's, in v5's look), with all its shots and a link to where it
 * was published; hover draws the selection frame with its source on the tag. */
export function PlayStrip({ items, filters }: { items: V5PlayItem[]; filters: string[] }) {
  const [filter, setFilter] = useState("All");
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const shown = items.filter(item => filter === "All" || item.source === filter);
  // The viewer: which piece, which of its shots, and the tile it zooms out of (focus returns there on close).
  const [selected, setSelected] = useState<V5PlayItem | null>(null);
  const [open, setOpen] = useState(false);
  const [shot, setShot] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0, scale: .4 });
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const show = (item: V5PlayItem, tile: HTMLButtonElement) => {
    trigger.current = tile;
    setRoot(tile.closest<HTMLElement>(".v5"));
    setOrigin(originOf(tile, 860));
    setSelected(item); setShot(0); setOpen(true);
    playCue("open");
  };
  const toggle = (next: boolean) => { setOpen(next); if (!next) playCue("close"); };

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const read = () => setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
    read();
    el.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => { el.removeEventListener("scroll", read); window.removeEventListener("resize", read); };
  }, [filter]);

  const page = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    playCue("click");
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const pick = (name: string) => {
    setFilter(name);
    playCue("toggle");
    row.current?.scrollTo({ left: 0 });
  };

  return (
    <>
      <div className="v5-play-filters" role="group" aria-label="Filter by source">
        {filters.map(name => (
          <button key={name} type="button" className="v5-btn" data-style={filter === name ? "primary" : "ghost"} aria-pressed={filter === name} data-sound="off" onClick={() => pick(name)}>
            {name}{name !== "All" && <span className="v5-play-count">{items.filter(item => item.source === name).length}</span>}
          </button>
        ))}
      </div>
      <div className="v5-strip">
        <div ref={row} className="v5-strip-row" tabIndex={0} aria-label="Playground pieces">
          {shown.map(item => (
            <button key={item.id} type="button" className="v5-card v5-strip-card" data-cursor="Open" data-sound="off" aria-label={`Open ${item.title}`} style={{ "--ar": item.w / item.h } as React.CSSProperties} onClick={event => show(item, event.currentTarget)}>
              <div className="v5-card-media">
                {item.video ? <FadeVideo src={item.video} poster={item.poster} label={item.title} /> : <FadeImg src={item.poster} alt={item.title} loading="lazy" />}
                <SelFrame card tag={item.source} />
              </div>
              <div className="v5-card-caption"><span>{item.title}</span><b>{item.meta}</b></div>
            </button>
          ))}
        </div>
        <button type="button" className="v5-strip-arrow" data-dir="back" aria-label="Scroll back" hidden={edge.start} data-sound="off" onClick={() => page(-1)}><IconChevronEnd /></button>
        <button type="button" className="v5-strip-arrow" data-dir="next" aria-label="Scroll on" hidden={edge.end} data-sound="off" onClick={() => page(1)}><IconChevronEnd /></button>
      </div>
      {selected && (
        <MediaViewer open={open} onOpenChange={toggle} variant="v5" container={root} size="narrow" title={selected.title} caption={selected.meta}
          source={{ href: selected.href, label: selected.source }} items={selected.media} index={shot} onIndexChange={setShot} trigger={trigger} origin={origin} />
      )}
    </>
  );
}

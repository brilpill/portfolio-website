"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { ArrowsOutSimpleIcon } from "@phosphor-icons/react";
import { MediaViewer, originOf, type ViewerItem } from "./media-viewer";

type Open = (index: number, from: HTMLElement) => void;
const ViewerContext = createContext<Open | null>(null);

/**
 * Every figure of a case study, in reading order, in one full-screen viewer: open any figure and the
 * pill steps through the rest of the page from there, as on ktz.dk.
 */
export function CaseStudyViewer({ title, items, children }: { title: string; items: ViewerItem[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0, scale: .6 });
  const trigger = useRef<HTMLElement | null>(null);
  const show: Open = (start, from) => { trigger.current = from; setOrigin(originOf(from.closest(".case-study-figure") ?? from, 1200)); setIndex(start); setOpen(true); };
  return (
    <ViewerContext.Provider value={show}>
      {children}
      <MediaViewer open={open} onOpenChange={setOpen} title={title} items={items} index={index} onIndexChange={setIndex} trigger={trigger} origin={origin} />
    </ViewerContext.Provider>
  );
}

/** The expand button in a figure's bottom-right corner. */
export function FigureExpand({ index, label }: { index: number; label: string }) {
  const show = useContext(ViewerContext);
  if (!show) return null;
  return (
    <button type="button" className="case-study-expand" aria-label={label} onClick={event => show(index, event.currentTarget)}>
      <ArrowsOutSimpleIcon size={16} aria-hidden />
    </button>
  );
}

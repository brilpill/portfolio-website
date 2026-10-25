"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { CornersOutIcon } from "@phosphor-icons/react";
import { MediaViewer, originOf, type ViewerItem } from "./media-viewer";

type Open = (items: ViewerItem[], index: number, from: HTMLElement) => void;
const ViewerContext = createContext<Open | null>(null);

/**
 * The full-screen viewer for a case study, as on ktz.dk. Each figure opens its own media only: a block with tabs
 * steps through those tabs, starting on the one showing; a single image stays single.
 */
export function CaseStudyViewer({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ViewerItem[]>([]);
  const [index, setIndex] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0, scale: .6 });
  const trigger = useRef<HTMLElement | null>(null);
  const show: Open = (set, start, from) => { trigger.current = from; setOrigin(originOf(from.closest(".case-study-figure") ?? from, 1200)); setItems(set); setIndex(start); setOpen(true); };
  return (
    <ViewerContext.Provider value={show}>
      {children}
      <MediaViewer open={open} onOpenChange={setOpen} title={title} items={items} index={index} onIndexChange={setIndex} trigger={trigger} origin={origin} />
    </ViewerContext.Provider>
  );
}

/** The step a figure is showing (its active tab or player step), so the viewer opens on the same screen. */
function shownStep(figure: Element | null) {
  const steps = [...(figure?.querySelectorAll(".case-tabs button, .case-player-step") ?? [])];
  return Math.max(0, steps.findIndex(step => step.getAttribute("aria-current") === "step"));
}

/** Opens the case study's viewer from inside a block (a poster strip); null outside a case study page. */
export const useViewer = () => useContext(ViewerContext);

/** The expand button in a figure's bottom-right corner. */
export function FigureExpand({ items, label }: { items: ViewerItem[]; label: string }) {
  const show = useContext(ViewerContext);
  if (!show) return null;
  return (
    <button type="button" className="case-study-expand" aria-label={label} onClick={event => show(items, Math.min(items.length - 1, shownStep(event.currentTarget.closest(".case-study-figure"))), event.currentTarget)}>
      <CornersOutIcon size={16} aria-hidden />
    </button>
  );
}

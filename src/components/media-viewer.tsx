"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type RefObject } from "react";
import { motion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon, TranslateIcon, XIcon } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

export type ViewerItem =
  | { kind?: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; alt: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: ViewerItem[];
  index: number;
  onIndexChange: (index: number) => void;
  /** The element that opened the viewer: it zooms out of it, and focus returns to it. */
  trigger: RefObject<HTMLElement | null>;
  /** Where the trigger sits relative to the window centre, for the zoom in and out. */
  origin?: { x: number; y: number; scale: number };
  /** Slide width: "wide" for case figures, "narrow" for playground shots. */
  size?: "wide" | "narrow";
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** Where an element sits relative to the window centre, and how small it is next to a slide. */
export function originOf(element: Element, slideWidth: number) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2 - innerWidth / 2, y: rect.top + rect.height / 2 - innerHeight / 2, scale: Math.min(.7, rect.width / Math.min(slideWidth, innerWidth - 48)) };
}

/**
 * Full-screen viewer for images and clips, after ktz.dk: a dark, blurred backdrop, the media large and
 * rounded, a round close button, and a bottom bar that steps through the set (‹ 1 / 3 ›) beside Translate. Neighbours peek
 * in at the sides; swipe, arrow keys or the pill move between them. Clicking the backdrop closes it.
 */
export function MediaViewer({ open, onOpenChange, title, items, index, onIndexChange, trigger, origin = { x: 0, y: 0, scale: .6 }, size = "wide" }: Props) {
  const gesture = useRef(false);
  const track = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const last = items.length - 1;
  const go = (next: number) => onIndexChange(clamp(next, 0, last));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="media-viewer" data-size={size} showCloseButton={false} finalFocus={trigger}
        // Start on Close: focusing a neighbour slide would scroll this clipped popup sideways on narrow screens.
        initialFocus={close}
        onScroll={event => { event.currentTarget.scrollLeft = 0; event.currentTarget.scrollTop = 0; }}
        onKeyDown={event => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault(); event.stopPropagation();
          go(index + (event.key === "ArrowRight" ? 1 : -1));
        }}
        onClick={event => { if (event.target === event.currentTarget) onOpenChange(false); }}
        style={{ "--preview-x": `${origin.x}px`, "--preview-y": `${origin.y}px`, "--preview-scale": origin.scale } as CSSProperties}>
        <DialogTitle className="home-sr-only">{title}</DialogTitle>
        <DialogDescription className="home-sr-only">{items.length > 1 ? "Swipe, use the arrow keys or the buttons at the bottom to move between images. " : ""}Press Escape to close.</DialogDescription>
        <motion.div className="media-viewer-stage" onClick={event => { if (event.target === event.currentTarget) onOpenChange(false); }}
          onPanStart={() => { gesture.current = true; track.current?.setAttribute("data-swiping", "true"); }}
          onPan={(_, info) => {
            const atEdge = (index === 0 && info.offset.x > 0) || (index === last && info.offset.x < 0);
            track.current?.style.setProperty("--swipe-x", `${info.offset.x * (atEdge ? .2 : 1)}px`);
          }}
          onPanEnd={(_, info) => {
            track.current?.removeAttribute("data-swiping");
            track.current?.style.setProperty("--swipe-x", "0px");
            const horizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
            if (horizontal && (Math.abs(info.offset.x) > 40 || (Math.abs(info.offset.x) > 10 && Math.abs(info.velocity.x) > 450))) go(index + (info.offset.x < 0 ? 1 : -1));
            setTimeout(() => { gesture.current = false; }, 0);
          }}>
          <div ref={track} className="media-viewer-track" style={{ "--viewer-index": index } as CSSProperties}>
            {items.map((item, itemIndex) => {
              const current = itemIndex === index;
              return (
                <div key={`${item.src}-${itemIndex}`} className="media-viewer-slide" data-current={current}
                  onClick={event => { if (event.target === event.currentTarget) { if (current) onOpenChange(false); else if (!gesture.current) go(itemIndex); } }}>
                  {item.kind === "video"
                    ? <video className="media-viewer-media" src={current ? item.src : undefined} poster={item.poster} aria-label={item.alt} autoPlay muted loop playsInline controls={current} />
                    : <button type="button" className="media-viewer-pick" tabIndex={current ? -1 : 0} aria-label={`Show image ${itemIndex + 1} of ${items.length}: ${item.alt}`} aria-current={current ? "true" : undefined}
                        onClick={() => { if (!gesture.current && !current) go(itemIndex); }}>
                        <Image className="media-viewer-media" src={item.src} alt={item.alt} width={2400} height={1600} draggable={false} sizes="(max-width: 767px) 92vw, 1200px" />
                      </button>}
                </div>
              );
            })}
          </div>
        </motion.div>
        <DialogClose ref={close} className="media-viewer-close" aria-label="Close"><XIcon size={16} aria-hidden /></DialogClose>
        {/* The bar from ktz.dk: step through the set, then Translate (placed now, wired later). */}
        <div className="media-viewer-bar">
          {items.length > 1 && <>
            <button type="button" aria-label="Previous image" disabled={index === 0} onClick={() => go(index - 1)}><CaretLeftIcon size={14} weight="bold" aria-hidden /></button>
            <span className="media-viewer-count" aria-live="polite"><span className="home-sr-only">Image </span>{index + 1}<span aria-hidden> / </span><span className="home-sr-only"> of </span>{items.length}</span>
            <button type="button" aria-label="Next image" disabled={index === last} onClick={() => go(index + 1)}><CaretRightIcon size={14} weight="bold" aria-hidden /></button>
            <span className="media-viewer-divider" aria-hidden />
          </>}
          <button type="button" className="media-viewer-translate">Translate<TranslateIcon size={16} aria-hidden /></button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

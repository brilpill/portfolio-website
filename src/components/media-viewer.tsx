"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { motion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, TranslateIcon, XIcon } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

/** `tall`: a full-length screen (height ÷ width). It opens at phone width from its top, cut off at the bottom, and is
 * explored like a canvas: drag to pan, wheel or buttons to zoom. `web`: a full-length desktop page, which opens wider. */
export type ViewerItem =
  | { kind?: "image"; src: string; alt: string; tall?: number; web?: boolean }
  | { kind: "video"; src: string; poster: string; alt: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  source?: { href: string; label: string };
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
const MAX_ZOOM = 4;
/** The Translate button in the bar: placed, not wired yet, so hidden for now. */
const SHOW_TRANSLATE = false;
type Zoom = { s: number; x: number; y: number };
const NO_ZOOM: Zoom = { s: 1, x: 0, y: 0 };

/** Where an element sits relative to the window centre, and how small it is next to a slide. */
export function originOf(element: Element, slideWidth: number) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2 - innerWidth / 2, y: rect.top + rect.height / 2 - innerHeight / 2, scale: Math.min(.7, rect.width / Math.min(slideWidth, innerWidth - 48)) };
}

/**
 * Full-screen viewer for images and clips, after ktz.dk: a dark, blurred backdrop, the media large and
 * rounded, a round close button, and a bottom bar that steps through the set (‹ 1 / 3 ›) beside Translate. Neighbours peek
 * in at the sides; swipe, arrow keys or the pill move between them. Clicking the backdrop closes it.
 * Images fill the space by their own proportions (not their file size). Zoom: scroll or pinch toward the pointer,
 * double-click to zoom in or out, the +/− buttons in the bar; while zoomed, dragging pans instead of swiping.
 */
export function MediaViewer({ open, onOpenChange, title, source, items, index, onIndexChange, trigger, origin = { x: 0, y: 0, scale: .6 }, size = "wide" }: Props) {
  const gesture = useRef(false);
  const track = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const last = items.length - 1;
  const [zoom, setZoom] = useState<Zoom>(NO_ZOOM);
  const [panning, setPanning] = useState(false);
  const panStart = useRef<Zoom>(NO_ZOOM);
  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  const go = (next: number) => { setZoom(NO_ZOOM); onIndexChange(clamp(next, 0, last)); };
  /** A click that should close: not the end of a drag, and not on the picture itself (it fills a tall slide). */
  const closes = (event: React.MouseEvent) => {
    if (gesture.current) return false;
    const rect = image()?.getBoundingClientRect();
    return !rect || event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  // A tall screen settles at its top once it's laid out (and again when its image has loaded).
  const settle = () => requestAnimationFrame(() => setZoom(resting()));
  const current = items[index];
  const zoomable = !!current && current.kind !== "video";
  // Long images found on load (taller than 1.25× their width), for previews that don't mark them, like the playground.
  // Phone-shaped ones (over 1.8×) open at phone width, taller pages and sheets wider (see img[data-tall] in home.css).
  const [found, setFound] = useState<Record<string, number>>({});
  const tallOf = (item?: ViewerItem) => item && item.kind !== "video" ? item.tall ?? found[item.src] : undefined;
  const tall = !!tallOf(current);

  // The current image (unscaled box) and how far it may pan at a given zoom without showing empty space.
  const image = () => track.current?.querySelector<HTMLElement>('.media-viewer-slide[data-current="true"] .media-viewer-media') ?? null;
  // Pan limits, as in Telegram's photo viewer: a picture bigger than the window may move until its edges come
  // EDGE px inside the window's edges; one that fits stays centred on that axis. A tall screen is bigger than the
  // window even at 1×, so it pans without zooming. Measured from the slide's centre, which sits a touch off the
  // window's centre.
  const EDGE = 48;
  const limits = (element: HTMLElement, s: number) => {
    const slide = (element.closest<HTMLElement>(".media-viewer-slide") ?? element).getBoundingClientRect();
    const cx = slide.left + slide.width / 2, cy = slide.top + slide.height / 2;
    const axis = (size: number, centre: number, view: number) => size <= view ? [0, 0] : [view - centre - size / 2 - EDGE, size / 2 - centre + EDGE];
    return { x: axis(element.offsetWidth * s, cx, innerWidth), y: axis(element.offsetHeight * s, cy, innerHeight) };
  };
  const bounded = (next: Zoom): Zoom => {
    const element = image();
    if (!element) return NO_ZOOM;
    const s = Math.max(1, next.s), { x, y } = limits(element, s);
    return { s, x: clamp(next.x, x[0], x[1]), y: clamp(next.y, y[0], y[1]) };
  };
  /** Where a picture rests: centred, or for a tall screen, its top EDGE px under the top of the window. */
  const resting = (): Zoom => {
    const element = image();
    return element && tall ? { s: 1, x: 0, y: limits(element, 1).y[1] } : NO_ZOOM;
  };
  /** Zoom to `s`, keeping the point under (clientX, clientY) where it is; without a point, around the middle. */
  const zoomTo = (s: number, clientX?: number, clientY?: number) => {
    const element = image();
    if (!element || !zoomable) return;
    const from = zoomRef.current, next = clamp(s, 1, MAX_ZOOM);
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - from.x, cy = rect.top + rect.height / 2 - from.y;
    const px = (clientX ?? cx) - cx, py = (clientY ?? cy) - cy;
    setZoom(bounded({ s: next, x: px - (px - from.x) * next / from.s, y: py - (py - from.y) * next / from.s }));
  };
  // Wheel and trackpad pinch zoom toward the pointer (a listener, so it can stop the page from scrolling).
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = stage.current;
    if (!open || !element) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomTo(zoomRef.current.s * Math.exp(-event.deltaY * (event.ctrlKey ? .01 : .002)), event.clientX, event.clientY);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  });
  useEffect(() => { if (!open) setZoom(NO_ZOOM); }, [open]); // eslint-disable-line react-hooks/set-state-in-effect
  useEffect(() => { if (open && tall) settle(); }, [open, index, tall]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <DialogDescription className="home-sr-only">{items.length > 1 ? "Swipe, use the arrow keys or the buttons at the bottom to move between items. " : ""}Press Escape to close.</DialogDescription>
        <motion.div ref={stage} className="media-viewer-stage" data-zoomed={zoom.s > 1 || undefined} onClick={event => { if (event.target === event.currentTarget && zoom.s === 1 && closes(event)) onOpenChange(false); }}
          onDoubleClick={event => { if (!zoomable) return; if (zoom.s > 1) setZoom(bounded({ ...resting(), y: tall ? zoom.y / zoom.s : 0 })); else zoomTo(2.5, event.clientX, event.clientY); }}
          onPanStart={() => {
            gesture.current = true;
            if (zoom.s > 1 || tall) { panStart.current = zoom; setPanning(true); return; }
            track.current?.setAttribute("data-swiping", "true");
          }}
          onPan={(_, info) => {
            if (zoom.s > 1 || tall) { setZoom(bounded({ s: zoom.s, x: panStart.current.x + info.offset.x, y: panStart.current.y + info.offset.y })); return; }
            const atEdge = (index === 0 && info.offset.x > 0) || (index === last && info.offset.x < 0);
            track.current?.style.setProperty("--swipe-x", `${info.offset.x * (atEdge ? .2 : 1)}px`);
          }}
          onPanEnd={(_, info) => {
            setTimeout(() => { gesture.current = false; }, 0);
            if (panning) { setPanning(false); return; }
            track.current?.removeAttribute("data-swiping");
            track.current?.style.setProperty("--swipe-x", "0px");
            const horizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
            if (horizontal && (Math.abs(info.offset.x) > 40 || (Math.abs(info.offset.x) > 10 && Math.abs(info.velocity.x) > 450))) go(index + (info.offset.x < 0 ? 1 : -1));
          }}>
          <div ref={track} className="media-viewer-track" style={{ "--viewer-index": index } as CSSProperties}>
            {items.map((item, itemIndex) => {
              const current = itemIndex === index;
              return (
                <div key={`${item.src}-${itemIndex}`} className="media-viewer-slide" data-current={current}
                  onClick={event => { if (event.target === event.currentTarget) { if (current) { if (zoom.s === 1 && closes(event)) onOpenChange(false); } else if (!gesture.current) go(itemIndex); } }}>
                  {item.kind === "video"
                    ? <video className="media-viewer-media" src={current ? item.src : undefined} poster={item.poster} aria-label={item.alt}
                        ref={video => { if (video && !current) { video.pause(); video.load(); } }}
                        preload={current ? "metadata" : "none"} autoPlay={current} muted loop playsInline controls={current} />
                    : <button type="button" className="media-viewer-pick" tabIndex={current ? -1 : 0} aria-label={`Show image ${itemIndex + 1} of ${items.length}: ${item.alt}`} aria-current={current ? "true" : undefined}
                        onClick={() => { if (!gesture.current && !current) go(itemIndex); }}>
                        <Image className="media-viewer-media" src={item.src} alt={item.alt} width={2400} height={1600} draggable={false} sizes="(max-width: 767px) 92vw, 1200px"
                          data-tall={tallOf(item) ? (item.web ? "web" : tallOf(item)! > 1.8 ? "phone" : "page") : undefined}
                          // Its own proportions, so CSS can size it to the space whatever the file's pixel size.
                          onLoad={event => { const { naturalWidth: w, naturalHeight: h } = event.currentTarget; if (w && h) event.currentTarget.style.setProperty("--ratio", String(w / h));
                            if (w && h && h / w > 1.25 && !item.tall) setFound(known => known[item.src] ? known : { ...known, [item.src]: h / w });
                            if (current && (item.tall || (w && h && h / w > 1.25))) settle(); }}
                          style={{ ...(item.tall ? { "--ratio": 1 / item.tall } : {}), ...(current ? { transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})`, transition: panning ? "none" : undefined } : {}) } as CSSProperties} />
                      </button>}
                </div>
              );
            })}
          </div>
        </motion.div>
        <DialogClose ref={close} className="media-viewer-close" aria-label="Close"><XIcon size={16} aria-hidden /></DialogClose>
        {/* The bar from ktz.dk: step through the set, zoom, then Translate (hidden until it's wired: SHOW_TRANSLATE). */}
        <div className="media-viewer-bar">
          {[
            items.length > 1 && <Fragment key="steps">
              <button type="button" aria-label="Previous media" disabled={index === 0} onClick={() => go(index - 1)}><CaretLeftIcon size={14} weight="bold" aria-hidden /></button>
              <span className="media-viewer-count" aria-live="polite"><span className="home-sr-only">Item </span>{index + 1}<span aria-hidden> / </span><span className="home-sr-only"> of </span>{items.length}</span>
              <button type="button" aria-label="Next media" disabled={index === last} onClick={() => go(index + 1)}><CaretRightIcon size={14} weight="bold" aria-hidden /></button>
            </Fragment>,
            zoomable && <Fragment key="zoom">
              <button type="button" aria-label="Zoom out" disabled={zoom.s <= 1} onClick={() => zoomTo(zoom.s / 1.5)}><MagnifyingGlassMinusIcon size={16} aria-hidden /></button>
              <button type="button" aria-label="Zoom in" disabled={zoom.s >= MAX_ZOOM} onClick={() => zoomTo(zoom.s * 1.5)}><MagnifyingGlassPlusIcon size={16} aria-hidden /></button>
            </Fragment>,
            source && <a key="source" className="media-viewer-source" href={source.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${title} on ${source.label} (opens in a new tab)`}>{source.label}<span aria-hidden>↗</span></a>,
            SHOW_TRANSLATE && <button key="translate" type="button" className="media-viewer-translate">Translate<TranslateIcon size={16} aria-hidden /></button>,
          ].filter(Boolean).flatMap((group, i) => i ? [<span key={`divider-${i}`} className="media-viewer-divider" aria-hidden />, group] : [group])}
        </div>
      </DialogContent>
    </Dialog>
  );
}

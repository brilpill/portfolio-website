"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { HeroSeedling } from "./hero-seedling";
import { MediaViewer, originOf } from "./media-viewer";
import { playgroundItems, playgroundPoster, type PlaygroundItem } from "@/content/playground";
import { motionTokens } from "@/lib/motion";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** An independent, click-only destination. The board pans; the page never scrolls. */
export function Playground({ onClose }: { onClose: () => void }) {
  const board = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const limits = useRef({ left: 0, right: 0, top: 0, bottom: 0 });
  const [bounds, setBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [selected, setSelected] = useState<PlaygroundItem | null>(null);
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const zoom = useMotionValue(1);
  const zoomCanvas = useRef<(scale: number, clientX?: number, clientY?: number) => void>(() => {});
  const [origin, setOrigin] = useState({ x: 0, y: 0, scale: .4 });
  const suppressClickUntil = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const element = board.current;
    const content = grid.current;
    if (!element || !content) return;
    const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
    let revealFrame = 0;
    let viewportWidth = 0, viewportHeight = 0;
    let pins: { image: HTMLElement; left: number; top: number; width: number; height: number }[] = [];
    function revealEdges() {
      revealFrame = 0;
      const panX = x.get(), panY = y.get();
      for (const pin of pins) {
        const cx = (pin.left + pin.width / 2) * zoom.get() + panX;
        const cy = (pin.top + pin.height / 2) * zoom.get() + panY;
        const visibleX = Math.min(cx + pin.width * zoom.get() / 2, viewportWidth - cx + pin.width * zoom.get() / 2);
        const visibleY = Math.min(cy + pin.height * zoom.get() / 2, viewportHeight - cy + pin.height * zoom.get() / 2);
        const amount = motionPreference.matches ? 1 : clamp(Math.min(visibleX, visibleY) / Math.min(140, pin.width * .55), 0, 1);
        const eased = amount * amount * (3 - 2 * amount);
        pin.image.style.setProperty("--edge-opacity", String(eased));
        pin.image.style.setProperty("--edge-scale", String(.82 + eased * .18));
        pin.image.style.setProperty("--edge-x", `${Math.sign(cx - viewportWidth / 2) * (1 - eased) * 12}px`);
        pin.image.style.setProperty("--edge-y", `${Math.sign(cy - viewportHeight / 2) * (1 - eased) * 12}px`);
      }
    }
    function scheduleReveal() { if (!revealFrame) revealFrame = requestAnimationFrame(revealEdges); }
    const unsubscribeX = x.on("change", scheduleReveal), unsubscribeY = y.on("change", scheduleReveal);
    motionPreference.addEventListener("change", scheduleReveal);
    function updateBounds() {
      const w = element!.clientWidth, h = element!.clientHeight;
      const gw = content!.offsetWidth * zoom.get(), gh = content!.offsetHeight * zoom.get();
      const next = { left: Math.min(0, w - gw) - 100, right: Math.max(0, w - gw) + 100, top: Math.min(0, h - gh) - 80, bottom: Math.max(0, h - gh) + 80 };
      limits.current = next; setBounds(next); scheduleReveal();
    }
    zoomCanvas.current = (next, clientX, clientY) => {
      x.stop(); y.stop();
      const rect = element!.getBoundingClientRect();
      const cx = clientX === undefined ? rect.width / 2 : clientX - rect.left;
      const cy = clientY === undefined ? rect.height / 2 : clientY - rect.top;
      const scale = clamp(next, .4, 3), ratio = scale / zoom.get();
      zoom.set(scale);
      x.set(clamp((x.get() - cx) * ratio + cx, limits.current.left, limits.current.right));
      y.set(clamp((y.get() - cy) * ratio + cy, limits.current.top, limits.current.bottom));
    };
    const unsubscribeZoom = zoom.on("change", updateBounds);
    function fit() {
      const w = element!.clientWidth, h = element!.clientHeight;
      const gw = content!.offsetWidth * zoom.get(), gh = content!.offsetHeight * zoom.get();
      viewportWidth = w; viewportHeight = h;
      pins = Array.from(content!.querySelectorAll<HTMLElement>(".playground-card")).map(card => ({
        image: card.querySelector<HTMLElement>(".playground-card-image")!, left: card.offsetLeft, top: card.offsetTop, width: card.offsetWidth, height: card.offsetHeight,
      }));
      const next = { left: Math.min(0, w - gw) - 100, right: Math.max(0, w - gw) + 100, top: Math.min(0, h - gh) - 80, bottom: Math.max(0, h - gh) + 80 };
      limits.current = next; setBounds(next);
      x.set((w - gw) / 2); y.set((h - gh) / 2);
      scheduleReveal();
    }
    const observer = new ResizeObserver(fit); observer.observe(element); observer.observe(content);
    const preventWheel = (event: WheelEvent) => {
      event.preventDefault(); event.stopPropagation();
      x.stop(); y.stop();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1;
      if (event.ctrlKey || event.metaKey) {
        zoomCanvas.current(zoom.get() * Math.exp(-event.deltaY * unit * .008), event.clientX, event.clientY);
        return;
      }
      x.set(clamp(x.get() - (event.deltaX + (event.shiftKey ? event.deltaY : 0)) * unit, limits.current.left, limits.current.right));
      y.set(clamp(y.get() - (event.shiftKey ? 0 : event.deltaY) * unit, limits.current.top, limits.current.bottom));
    };
    element.addEventListener("wheel", preventWheel, { passive: false });
    let gestureScale = 1;
    const gestureStart = (event: Event) => { event.preventDefault(); gestureScale = zoom.get(); };
    const gestureChange = (event: Event) => {
      event.preventDefault();
      zoomCanvas.current(gestureScale * (event as Event & { scale: number }).scale);
    };
    element.addEventListener("gesturestart", gestureStart, { passive: false });
    element.addEventListener("gesturechange", gestureChange, { passive: false });
    fit();
    return () => {
      element.removeEventListener("gesturestart", gestureStart); element.removeEventListener("gesturechange", gestureChange);
      unsubscribeZoom();
      observer.disconnect(); element.removeEventListener("wheel", preventWheel);
      unsubscribeX(); unsubscribeY(); cancelAnimationFrame(revealFrame);
      motionPreference.removeEventListener("change", scheduleReveal); x.stop(); y.stop();
    };
  }, [x, y, zoom]);

  function reset() {
    if (!board.current || !grid.current) return;
    zoom.set(1);
    const transition = { duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : motionTokens.duration.panel, ease: motionTokens.easeOut };
    animate(x, (board.current.clientWidth - grid.current.offsetWidth) / 2, transition);
    animate(y, (board.current.clientHeight - grid.current.offsetHeight) / 2, transition);
  }
  function preview(item: PlaygroundItem, element: HTMLButtonElement, timestamp: number) {
    if (dragging.current || timestamp < suppressClickUntil.current) return;
    trigger.current = element;
    setOrigin(originOf(element, 860));
    setSelected(item); setImageIndex(0); setOpen(true);
  }

  return <section className="playground-view" aria-labelledby="playground-heading" onKeyDown={event => { if (event.key === "Escape" && !open && !event.defaultPrevented) { event.stopPropagation(); onClose(); } }}>
    <h1 id="playground-heading" ref={heading} tabIndex={-1} className="home-sr-only">Playground</h1>
    <div ref={board} className="playground-board" role="region" aria-label="Draggable image grid" aria-describedby="playground-help" tabIndex={0}
      onKeyDown={event => {
        if (["+", "=", "-", "0"].includes(event.key)) {
          event.preventDefault(); event.stopPropagation();
          if (event.key === "0") reset();
          else zoomCanvas.current(zoom.get() * (event.key === "-" ? 1 / 1.25 : 1.25));
          return;
        }
        if (event.target !== event.currentTarget) return;
        const step = 100;
        const movement: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
        if (event.key === "Home") { event.preventDefault(); reset(); return; }
        if (!movement[event.key]) return;
        event.preventDefault(); event.stopPropagation();
        const [dx, dy] = movement[event.key], b = limits.current;
        const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : motionTokens.duration.fast;
        animate(x, clamp(x.get() + dx, b.left, b.right), { duration }); animate(y, clamp(y.get() + dy, b.top, b.bottom), { duration });
      }}>
      {/* The hero's sonar field without the plant: glyphs part around the cursor; a click on empty space pings. */}
      <HeroSeedling active plant={false} />
      <motion.div ref={grid} className="playground-grid" style={{ x, y, scale: zoom, transformOrigin: "0 0" }} drag dragConstraints={bounds} dragElastic={.12}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 32, power: .18 }}
        onDragStart={() => { dragging.current = true; }} onDragEnd={event => { dragging.current = false; suppressClickUntil.current = event.timeStamp + 180; }}>
        {Array.from({ length: 6 }, (_, column) => <div className="playground-column" key={column}>
        {playgroundItems.filter((_, index) => index % 6 === column).map((item, index) => <button type="button" className="playground-card" data-stack={item.media.length > 1 ? "true" : undefined} key={item.id} style={{ "--pin-order": column + index * 2 } as CSSProperties} aria-label={`Preview ${item.title}${item.media.length > 1 ? `, ${item.media.length} media items` : ""}${item.media.some(media => media.kind === "video") ? ", with video" : ""}`} onClick={event => preview(item, event.currentTarget, event.timeStamp)}
          onFocus={event => {
            if (!event.currentTarget.matches(":focus-visible")) return;
            const b = board.current?.getBoundingClientRect(), c = event.currentTarget.getBoundingClientRect();
            if (!b) return;
            const dx = c.left < b.left + 20 ? b.left + 20 - c.left : c.right > b.right - 20 ? b.right - 20 - c.right : 0;
            const dy = c.top < b.top + 20 ? b.top + 20 - c.top : c.bottom > b.bottom - 20 ? b.bottom - 20 - c.bottom : 0;
            x.set(x.get() + dx); y.set(y.get() + dy);
          }}>
          <span className="playground-card-image">
            {item.media.slice(1, 3).map((image, layer) => <span key={`${image.src}-${layer}`} className="playground-stack-layer" data-layer={layer + 1} aria-hidden="true">
              <Image src={playgroundPoster(image)} alt="" fill draggable={false} sizes="260px" />
            </span>)}
            <span className="playground-stack-cover">
              <Image src={item.image} alt={item.title} fill draggable={false} sizes="300px" priority={column < 3 && index === 2} />
            </span>
          </span>
        </button>)}
        </div>)}
      </motion.div>
    </div>
    <p id="playground-help" className="home-sr-only">Drag or scroll to pan; Shift-scroll moves horizontally. Pinch or press plus/minus to zoom; zero resets. Arrow keys pan when the board is focused; Home resets. Select a shot to preview its images and videos; Escape returns to the previous slide.</p>
    {/* A shot stays one pin, with all its images and videos in the shared viewer. */}
    {selected && <MediaViewer open={open} onOpenChange={setOpen} title={selected.title} source={{ href: selected.sourceUrl, label: "Dribbble" }} items={selected.media} index={imageIndex} onIndexChange={setImageIndex} trigger={trigger} origin={origin} size="narrow" />}
  </section>;
}

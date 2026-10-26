"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowClockwiseIcon, ArrowCircleDownIcon, ArrowsDownUpIcon, CaretLeftIcon, CaretRightIcon, CheckIcon, CopyIcon, HandPointingIcon, ExportIcon, LockSimpleIcon, PauseIcon, PlayIcon, PlusIcon, ShieldIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import type { BrowserFrame, CaseScreen, ProjectSlideMedia } from "@/content/project-slides";
import { motionTokens } from "@/lib/motion";
import { CaseAnnotation } from "./case-annotation";
import { useViewer } from "./case-study-viewer";
import { playCue, type SoundCue } from "./ui-sound";
import { demos } from "@/cases/demos";
import { DemoTabRow } from "@/cases/demo-slot";

/** How long each screen stays in the auto-playing step player (Bencho-style: the dot grows into a bar that fills). */
const PLAYER_PACE = 3600; // ms
const ease = [...motionTokens.easeOut] as [number, number, number, number];
const sizes = "(max-width: 767px) 100vw, calc(100vw - 600px)";

/**
 * One media block of a case overview (Figma 1001:2835 and 1026:1567). Every block sits on the same stage
 * (943 × 882 in Figma) and keeps one caption under it:
 * - device: phone screens inside a drawn phone frame, with a soft reflection
 * - browser: web screens inside a window frame, optionally on a full-bleed background image
 * - image: one image filling the whole stage; on the case slides the stage takes the image's own proportions
 * - video: a video (or its poster until one is supplied) with the Figma pause + seek controls
 * Several screens get previous/next arrows and either labelled step tabs or the auto-playing step player.
 */
export function CaseMedia({ media }: { media: ProjectSlideMedia }) {
  const root = useRef<HTMLElement>(null);
  const locked = useScrollLock(root);
  const centre = useRef<HTMLSpanElement>(null);
  const centred = useCentred(centre);
  return <figure ref={root} className="case-media" data-scroll-lock={locked || undefined} data-centred={centred || undefined} {...sounds}>
    <span ref={centre} className="case-media-centre" aria-hidden />
    {media.annotation && <CaseAnnotation annotation={media.annotation} />}
    {media.kind === "image" ? <ImageStage media={media} />
      : media.kind === "video" ? <VideoStage media={media} />
      : media.kind === "compare" ? <CompareStage media={media} />
      : media.kind === "component" ? <ComponentStage media={media} />
      : media.kind === "components" ? <ComponentsGrid media={media} />
      : media.kind === "images" ? <ImagesStage media={media} />
      : media.kind === "posters" ? <PostersStage media={media} />
      : <ScreensStage media={media} />}
    {media.caption && <figcaption>{media.caption}</figcaption>}
  </figure>;
}

/**
 * Sounds for everything interactive in a block, so every live component gets them without wiring its own: a key
 * typed or deleted in any field, a click on any button, tab, link or option, a switch or choice flipped. An element
 * can name its own cue with data-sound="open" (any SoundCue) or silence the default with data-sound="off" when the
 * component plays a cue of its own (a lookup's success or error, a menu opening). They play only when the visitor
 * has turned sound on (ui-sound.ts).
 */
const cueOf = (element: Element | null) => element?.closest("[data-sound]")?.getAttribute("data-sound") as SoundCue | "off" | undefined;
const sounds = {
  // On input rather than keydown, so pasted, autofilled and on-screen-keyboard text sounds too.
  onInputCapture(event: React.FormEvent) {
    const target = event.target as HTMLElement;
    const type = (event.nativeEvent as InputEvent).inputType ?? "";
    if (!target.matches("input:not([type=checkbox]):not([type=radio]), textarea") || cueOf(target) === "off") return;
    if (type.startsWith("delete")) playCue("erase");
    else if (type.startsWith("insert")) playCue("key");
  },
  onClickCapture(event: React.MouseEvent) {
    const target = event.target as Element;
    const field = target.closest("input, textarea, select");
    if (field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio")) return;
    if (field) { if (cueOf(field) !== "off") playCue("click"); return; }
    const label = target.closest("label");
    if (label instanceof HTMLLabelElement && label.control instanceof HTMLInputElement && (label.control.type === "checkbox" || label.control.type === "radio")) return;
    if (label) { if (cueOf(label) !== "off") playCue("click"); return; }
    const control = target.closest("button:not(:disabled), a, [role=option], [role=tab]");
    if (!control) return;
    const cue = cueOf(control);
    if (cue !== "off") playCue(cue ?? "click");
  },
  onChangeCapture(event: React.ChangeEvent) {
    if ((event.target as Element).matches("input[type=checkbox], input[type=radio], input[type=range], select") && cueOf(event.target as Element) !== "off") playCue("toggle");
  },
};

/** The middle part of the window, as a share of its height, where a block counts as being looked at. */
const CENTRE_BAND = .7;

/**
 * True while the block's middle is inside the central CENTRE_BAND of the window. The figure gets data-centred, and its
 * "Scrollable" and "Interactive" labels show only then (home.css), so they appear on the frame being looked at rather
 * than on every frame passing by. Watches a point at the block's vertical middle.
 */
function useCentred(point: RefObject<HTMLElement | null>) {
  const [centred, setCentred] = useState(false);
  useEffect(() => {
    const element = point.current;
    if (!element) return;
    const edge = `${-Math.round((1 - CENTRE_BAND) / 2 * 100)}%`;
    const observer = new IntersectionObserver(([entry]) => setCentred(entry.isIntersecting), { rootMargin: `${edge} 0px ${edge} 0px` });
    observer.observe(element);
    return () => observer.disconnect();
  }, [point]);
  return centred;
}

/** How much of a block must be on screen before what scrolls inside it (a long screen, a sheet, a list) takes the
 * wheel; until then the wheel scrolls the page, so a block entering from the bottom doesn't start scrolling by itself. */
const SCROLL_READY = .8;

/**
 * True while less than SCROLL_READY of the block is in view (of its height, or of the window's when the block is
 * taller). The figure gets data-scroll-lock, and only the parts of it that actually scroll (overflow auto/scroll)
 * are switched to overflow: hidden, so nothing else gets clipped (like the notes above the phones). Demos with their
 * own wheel handling check for data-scroll-lock too.
 */
function useScrollLock(root: RefObject<HTMLElement | null>) {
  const [locked, setLocked] = useState(true);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      const view = entry.rootBounds?.height ?? window.innerHeight;
      setLocked(entry.intersectionRect.height < SCROLL_READY * Math.min(entry.boundingClientRect.height, view));
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    observer.observe(element);
    return () => observer.disconnect();
  }, [root]);
  useEffect(() => {
    if (!locked || !root.current) return;
    const scrollers = [...root.current.querySelectorAll<HTMLElement>("*")].filter(node => /auto|scroll/.test(getComputedStyle(node).overflowY));
    scrollers.forEach(node => { node.style.overflowY = "hidden"; });
    return () => scrollers.forEach(node => { node.style.overflowY = ""; });
  }, [locked, root]);
  return locked;
}

/** A plain image reports its own proportions once loaded, so on the case slides a tall landing page shows whole and scrolls. */
function ImageStage({ media }: { media: Extract<ProjectSlideMedia, { kind: "image" }> }) {
  const [ratio, setRatio] = useState<number>();
  const show = useViewer();
  if (media.scroll && media.full) return <ScrollImageStage media={media} full={media.full} />;
  return <div className="case-stage case-stage-bleed case-stage-image" style={ratio ? { "--media-ratio": ratio } as CSSProperties : undefined}>
    <Image src={media.src} alt={media.alt} fill sizes={sizes} onLoad={(event) => { const { naturalWidth, naturalHeight } = event.currentTarget; if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight); }} />
    {/* A preview of something much taller: the whole thing opens in the viewer, loaded only then. */}
    {media.full && show && <button type="button" className="case-view-full" onClick={event => show([{ src: media.full!.src, alt: media.alt, tall: media.full!.ratio }], 0, event.currentTarget)}>
      {media.full.label ?? "View full presentation"}<CaretRightIcon size={14} weight="bold" aria-hidden />
    </button>}
  </div>;
}

/**
 * A very tall image (a long-form presentation) as one sheet, narrower than the stage, starting near its top and running
 * off the bottom. Once the block is in view, the wheel (or a mouse drag) over the sheet slides the whole sheet up (its top edge leaves the frame) until
 * its end sits as far from the bottom as its start sat from the top; past either end the page scrolls on.
 */
function ScrollImageStage({ media, full }: { media: Extract<ProjectSlideMedia, { kind: "image" }>; full: NonNullable<Extract<ProjectSlideMedia, { kind: "image" }>["full"]> }) {
  const stage = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  useEffect(() => {
    const frame = stage.current, element = sheet.current;
    if (!frame || !element) return;
    // How far the sheet can travel: its bottom stops at the same gap from the frame's bottom as its top starts at.
    const travel = () => Math.max(0, element.offsetHeight + 2 * element.offsetTop - frame.clientHeight);
    const move = (to: number) => { offset.current = Math.min(travel(), Math.max(0, to)); element.style.transform = `translateY(${-offset.current}px)`; };
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || frame.closest("[data-scroll-lock]")) return;
      const room = event.deltaY > 0 ? travel() - offset.current : offset.current;
      if (room < 1) return;
      event.preventDefault();
      move(offset.current + event.deltaY);
    };
    const keys = (event: KeyboardEvent) => {
      const step = { ArrowDown: 80, ArrowUp: -80, PageDown: frame.clientHeight * .8, PageUp: -frame.clientHeight * .8, Home: -Infinity, End: Infinity }[event.key];
      if (step === undefined) return;
      event.preventDefault();
      move(offset.current + step);
    };
    // A mouse can drag the sheet up and down too.
    let drag: { y: number; from: number } | null = null;
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { y: event.clientY, from: offset.current };
      element.setPointerCapture(event.pointerId);
      element.dataset.dragging = "";
    };
    const drift = (event: PointerEvent) => { if (drag) move(drag.from - (event.clientY - drag.y)); };
    const up = () => { drag = null; delete element.dataset.dragging; };
    const resize = new ResizeObserver(() => move(offset.current));
    resize.observe(frame);
    // Only a wheel over the sheet itself moves it; over the grey around it the page scrolls.
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("keydown", keys);
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", drift);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    return () => {
      resize.disconnect();
      element.removeEventListener("wheel", wheel); element.removeEventListener("keydown", keys);
      element.removeEventListener("pointerdown", down); element.removeEventListener("pointermove", drift);
      element.removeEventListener("pointerup", up); element.removeEventListener("pointercancel", up);
    };
  }, []);
  return <div ref={stage} className="case-stage case-stage-scroll-image" data-phone={media.phone ? "" : undefined}>
    <div ref={sheet} className="case-scroll-sheet" tabIndex={0} role="region" aria-label={`${media.alt}. Scroll or use the arrow keys to move through it.`} style={{ aspectRatio: `1 / ${full.ratio}` }}>
      {/* The light cover shows at once while the long image (over a megabyte) is still loading over it. */}
      <Image className="case-scroll-cover" src={media.src} alt="" width={1400} height={1100} sizes="(max-width: 767px) 90vw, 720px" draggable={false} aria-hidden />
      <Image src={full.src} alt={media.alt} fill sizes="(max-width: 767px) 90vw, 720px" draggable={false} />
    </div>
    {media.phone && <Phone className="case-scroll-phone" scrollable={scrolls(media.phone)}><Swap screen={media.phone} sizes={phoneSizes} /></Phone>}
  </div>;
}

/**
 * Finished posters side by side in a strip that scrolls sideways only (trackpad swipes, a mouse drag, touch, arrow keys when
 * focused), about three and a hint of the next in view, with end-aware arrows. A click opens that poster in the
 * viewer, where the rest can be stepped through.
 */
function PostersStage({ media }: { media: Extract<ProjectSlideMedia, { kind: "posters" }> }) {
  const strip = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const show = useViewer();
  const update = () => {
    const element = strip.current;
    if (element) setEdges({ start: element.scrollLeft < 4, end: element.scrollLeft + element.clientWidth > element.scrollWidth - 4 });
  };
  useEffect(update, []);
  // A mouse can also drag the strip; a drag doesn't count as a click on the poster it ends on.
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const dragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button === 0) drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
  };
  const dragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) < 5) return;
    if (!state.moved) { state.moved = true; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.dataset.dragging = ""; }
    event.currentTarget.scrollLeft = state.left - dx;
  };
  const dragEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    delete event.currentTarget.dataset.dragging;
    // Keep `moved` until the click that follows this pointerup has been swallowed.
    if (drag.current.moved) window.setTimeout(() => { drag.current = null; }); else drag.current = null;
  };
  const page = (direction: number) => {
    const element = strip.current;
    const poster = element?.querySelector<HTMLElement>(".case-poster");
    if (element && poster) element.scrollBy({ left: direction * (poster.offsetWidth + 16), behavior: "smooth" });
  };
  const items = media.images.map(({ src, alt }) => ({ src, alt }));
  return <div className="case-stage case-stage-posters">
    <div ref={strip} className="case-posters" tabIndex={0} role="group" aria-label="Posters" onScroll={update}
      onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd}
      onClickCapture={event => { if (drag.current?.moved) { event.preventDefault(); event.stopPropagation(); } }}
      onDragStart={event => event.preventDefault()}>
      {media.images.map((image, index) => <button key={image.src} type="button" className="case-poster" aria-label={`Open: ${image.alt}`}
        onClick={event => show?.(items, index, event.currentTarget)}>
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 70vw, 280px" draggable={false} />
      </button>)}
    </div>
    {!edges.start && <button type="button" className="case-arrow case-arrow-previous" aria-label="Previous posters" onClick={() => page(-1)}><CaretLeftIcon size={18} /></button>}
    {!edges.end && <button type="button" className="case-arrow case-arrow-next" aria-label="Next posters" onClick={() => page(1)}><CaretRightIcon size={18} /></button>}
  </div>;
}

/**
 * Browser window. `frame` picks the chrome: macOS Safari (dark, the default), after the Apple iOS Browser Mockup
 * community file, with the project's address in the field; window (a minimal bar); bare (no chrome).
 */
function Browser({ url, frame = "dark", className = "", ratio, children }: { url?: string; frame?: BrowserFrame; className?: string; ratio?: string; children: ReactNode }) {
  const safari = frame === "dark";
  return <div className={`case-browser${frame === "bare" ? " case-browser-bare" : ""}${frame === "window" ? " case-browser-window" : ""}${className ? ` ${className}` : ""}`}>
    {safari && <div className="case-browser-bar case-safari" aria-hidden>
      <span className="case-browser-lights"><i /><i /><i /></span>
      <SidebarSimpleIcon className="case-safari-sidebar" />
      <CaretLeftIcon /><CaretRightIcon className="case-safari-muted" />
      <span className="case-safari-field">
        <ShieldIcon className="case-safari-shield" weight="duotone" />
        <span className="case-safari-address"><span className="case-safari-url"><LockSimpleIcon weight="fill" />{url ?? "oleh.design"}</span><ArrowClockwiseIcon className="case-safari-reload" /></span>
      </span>
      <span className="case-safari-tools"><ArrowCircleDownIcon /><ExportIcon /><PlusIcon /><CopyIcon /></span>
    </div>}
    {frame === "window" && <div className="case-browser-bar" aria-hidden><span className="case-browser-lights"><i /><i /><i /></span></div>}
    <div className="case-browser-view" style={ratio ? { aspectRatio: ratio } : undefined}>{children}</div>
  </div>;
}

/** A MacBook: black glass with a thin aluminium rim, on a silver base with the thumb cut-out. */
function Laptop({ children }: { children: ReactNode }) {
  return <div className="case-laptop">
    <div className="case-laptop-lid"><div className="case-browser-view">{children}</div></div>
    <div className="case-laptop-base" aria-hidden />
  </div>;
}

/** Phone, with iPhone proportions (corners scale with its width). Dark (default) or silver with the Dynamic Island. */
function Phone({ silver = false, scrollable = false, interactive = false, className = "", children }: { silver?: boolean; scrollable?: boolean; interactive?: boolean; className?: string; children: ReactNode }) {
  return <div className={`case-phone${silver ? " case-phone-silver" : ""}${className ? ` ${className}` : ""}`}>
    {/* A small grey note above the phone: its screen scrolls inside it, or it's a live component to try. */}
    {scrollable && <span className="case-phone-hint" aria-hidden><ArrowsDownUpIcon weight="bold" />Scrollable</span>}
    {interactive && <span className="case-phone-hint" aria-hidden><HandPointingIcon weight="bold" />Interactive</span>}
    <div className="case-phone-screen">{children}{silver && <span className="case-phone-island" aria-hidden />}</div>
  </div>;
}
/** A screen that scrolls inside its phone (it has a full-length export); its "Scrollable" note always shows. */
const scrolls = (screen?: CaseScreen) => !!screen?.full;

/** Pauses autoplay while the block is off screen (another slide, scrolled away) or the tab is hidden. */
function useInView(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .5), { threshold: [0, .5, 1] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

/**
 * One screen that changes by a dissolve in place: the new screen fades in on top of the old one, settling from a
 * touch larger. No blur: a blurred edge turns see-through and shows a line of the frame's background.
 * `still`: desktop screens just switch, since a big page dissolving reads as a flicker.
 */
function Swap({ screen, sizes: imageSizes, still = false }: { screen: CaseScreen; sizes: string; still?: boolean }) {
  const reduced = !!useReducedMotion();
  if (still) return <div className="case-screen"><Image key={screen.src} src={screen.src} alt={screen.alt} fill sizes={imageSizes} /></div>;
  return <AnimatePresence initial={false}>
    <motion.div key={screen.src} className="case-screen"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: .42, ease } }}
      exit={{ opacity: 0, transition: { duration: .2, delay: reduced ? 0 : .3 } }}>
      {screen.full ? <ScrollableScreen screen={screen} sizes={imageSizes} />
        : <Image src={screen.src} alt={screen.alt} fill sizes={imageSizes} />}
    </motion.div>
  </AnimatePresence>;
}

/**
 * A long screen that scrolls inside the phone: its full-length export, scrolled with the wheel, trackpad or
 * keyboard while the pointer is over it; at either end the page takes over.
 */
function ScrollableScreen({ screen, sizes: imageSizes }: { screen: CaseScreen; sizes: string }) {
  // With a mouse the screen can also be dragged, like a finger on the phone: a grab hand on hover, grabbing while
  // held, and a short glide after letting go.
  const [drag, setDrag] = useState<{ y: number; top: number; at: number; speed: number } | null>(null);
  const glide = useRef(0);
  useEffect(() => () => cancelAnimationFrame(glide.current), []);
  return <div className="case-screen-scroll case-screen-scrollable" tabIndex={0} aria-label={`${screen.alt}, scrollable`} data-dragging={drag ? "" : undefined}
    onPointerDown={event => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      cancelAnimationFrame(glide.current);
      event.currentTarget.setPointerCapture(event.pointerId);
      setDrag({ y: event.clientY, top: event.currentTarget.scrollTop, at: event.timeStamp, speed: 0 });
    }}
    onPointerMove={event => {
      if (!drag) return;
      const element = event.currentTarget;
      const before = element.scrollTop;
      element.scrollTop = drag.top - (event.clientY - drag.y);
      const time = Math.max(1, event.timeStamp - drag.at);
      setDrag({ ...drag, at: event.timeStamp, speed: (element.scrollTop - before) / time });
    }}
    onPointerUp={event => {
      if (!drag) return;
      const element = event.currentTarget;
      let speed = drag.speed * 16; // px per frame
      setDrag(null);
      const step = () => {
        if (Math.abs(speed) < .5) return;
        element.scrollTop += speed;
        speed *= .92;
        glide.current = requestAnimationFrame(step);
      };
      glide.current = requestAnimationFrame(step);
    }}
    onPointerCancel={() => setDrag(null)}>
    <div className="case-screen-long" style={{ aspectRatio: `1 / ${screen.full!.ratio}` }}>
      <Image src={screen.full!.src} alt={screen.alt} fill sizes={imageSizes} draggable={false} />
    </div>
  </div>;
}

const phoneSizes = "(max-width: 767px) 60vw, 340px";

/**
 * Splits a row's screens into pages of at most `perPage` (3 by default) phones, as evenly as possible, so no page is
 * left with a lone phone: 4 screens page as 2 + 2, 5 as 3 + 2, 7 as 3 + 2 + 2. `perPage: 2` pages in pairs.
 */
function rowGroups<T>(items: T[], perPage = 3) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const base = Math.floor(items.length / pages), extra = items.length % pages;
  const groups: T[][] = [];
  for (let page = 0, at = 0; page < pages; page++) {
    const size = base + (page < extra ? 1 : 0);
    groups.push(items.slice(at, at + size));
    at += size;
  }
  return groups;
}

/**
 * Phone, browser and responsive blocks, in the frame the block asks for (the master templates in
 * docs/case-template.md). Several screens get arrows plus step tabs or the step player; a `row` shows two or three
 * phones at once and steps through its screens in balanced groups (see rowGroups).
 */
function ScreensStage({ media }: { media: Extract<ProjectSlideMedia, { kind: "device" | "browser" | "responsive" }> }) {
  const all = media.kind === "responsive" ? media.web : media.screens;
  const row = media.kind === "device" && media.frame === "row";
  // A row's steps are groups of two or three; every other block steps one screen at a time.
  const groups = row ? rowGroups(all, media.kind === "device" ? media.perPage : undefined) : null;
  const screens = groups ? groups.map(group => group[0]) : all;
  const stage = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const visible = useInView(stage);
  const [[step], setStep] = useState<[number, number]>([0, 0]);
  // Kept within range when the content changes under it (fewer screens or pages after an edit).
  const index = Math.min(step, screens.length - 1);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const many = screens.length > 1;
  const player = many && media.control === "player";
  const running = player && playing && visible && !hovered && !reduced;
  const go = (next: number) => setStep(([current]) => [(next + screens.length) % screens.length, next >= current ? 1 : -1]);

  // The step player advances on its own; any manual step restarts the current bar.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep(([current]) => [(current + 1) % screens.length, 1]), PLAYER_PACE);
    return () => window.clearTimeout(timer);
  }, [running, index, screens.length]);

  const at = (offset: number, list = screens) => list[(index + offset) % list.length];
  let body: ReactNode;
  let bothScroll = false;
  if (media.kind === "device") {
    const frame = media.frame ?? "dark";
    if (groups) body = <div className="case-phone-row">{groups[index].map((item, i) => <Phone key={i} scrollable={scrolls(item)}><Swap screen={item} sizes={phoneSizes} /></Phone>)}</div>;
    else if (frame === "pair") body = <div className="case-phone-pair">
      <Phone className="case-phone-pair-back"><Swap screen={at(1)} sizes={phoneSizes} /></Phone>
      <Phone className="case-phone-pair-front" scrollable={scrolls(at(0))}><Swap screen={at(0)} sizes={phoneSizes} /></Phone>
    </div>;
    else body = <Phone silver={frame === "silver"} scrollable={scrolls(at(0))}><Swap screen={at(0)} sizes={phoneSizes} /></Phone>;
  } else if (media.kind === "browser") {
    const frame = media.frame ?? "dark";
    // A laptop screen with a full-length export scrolls inside the lid, like a long phone screen.
    body = frame === "laptop" ? <Laptop><Swap screen={at(0)} sizes={sizes} still={!scrolls(at(0))} /></Laptop> : <Browser url={media.url} frame={frame} ratio={media.ratio}><Swap screen={at(0)} sizes={sizes} still /></Browser>;
  } else {
    const web = <Swap screen={at(0)} sizes={sizes} still={!scrolls(at(0))} />;
    const phone = media.mobile[index % media.mobile.length];
    // When the laptop's page scrolls too, one label at the top of the block covers both screens.
    bothScroll = media.frame === "laptop" && scrolls(at(0));
    body = <div className="case-responsive" data-laptop={media.frame === "laptop" || undefined}>
      {media.frame === "laptop" ? <Laptop>{web}</Laptop> : <Browser url={media.url} frame={media.frame ?? "dark"} ratio={media.ratio}>{web}</Browser>}
      {/* A page without a mobile version (null) shows the laptop alone. */}
      {phone && <Phone className="case-responsive-phone" scrollable={!bothScroll && scrolls(phone)}><Swap screen={phone} sizes={phoneSizes} /></Phone>}
    </div>;
  }

  const bleed = media.kind === "browser" && media.background;
  const figma = media.kind === "browser" && media.frame === "window";
  return <div ref={stage} className={`case-stage${bleed ? " case-stage-bleed" : ""}`} data-ground={figma || undefined} data-frame={media.kind === "responsive" ? "responsive" : media.frame ?? "dark"} data-layout={media.kind === "device" && !groups && media.frame !== "pair" ? "single-phone" : undefined} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
    {bleed && <Image className="case-stage-background" src={media.background!} alt="" fill sizes={sizes} />}
    <div className={`case-stage-body case-stage-${media.kind === "responsive" ? "browser" : media.kind}`} aria-live="polite">{body}</div>
    {bothScroll && <span className="case-demo-hint" aria-hidden><ArrowsDownUpIcon weight="bold" />Scrollable</span>}
    {many && <>
      <StageArrows index={index} count={screens.length} onGo={go} noun="screen" />
      {player
        ? <StepPlayer count={screens.length} index={index} running={running} playing={playing} labels={screens.map((item, i) => item.label ?? `Screen ${i + 1}`)} onSelect={go} onToggle={() => setPlaying(value => !value)} />
        : <StepTabs screens={screens} index={index} onSelect={go} />}
    </>}
  </div>;
}

/**
 * Before / after: one mockup (Safari, or a phone) holding both screens, with the after screen clipped at a divider
 * that runs across the whole frame. With `frame: "row"`, up to three phones stand side by side under the same
 * divider, each screen showing its share of the split. With a mouse the divider follows the pointer, no click
 * needed; on touch it's dragged; the arrow keys move it too. It nudges once when it first comes into view.
 */
function CompareStage({ media }: { media: Extract<ProjectSlideMedia, { kind: "compare" }> }) {
  const stage = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const screens = useRef<(HTMLDivElement | null)[]>([]);
  const visible = useInView(stage);
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const row = media.frame === "row";
  const pairs = [{ before: media.before, after: media.after }, ...(row ? media.more ?? [] : [])];
  // Where each screen sits across the frame, as fractions of its width: [left edge, width].
  const [spans, setSpans] = useState<[number, number][]>(() => pairs.map(() => [0, 1]));
  useLayoutEffect(() => {
    const frame = area.current;
    if (!frame) return;
    const measure = () => {
      const outer = frame.getBoundingClientRect();
      if (!outer.width) return;
      setSpans(screens.current.map(view => {
        const inner = view?.getBoundingClientRect();
        return inner ? [(inner.left - outer.left) / outer.width, inner.width / outer.width] : [0, 1];
      }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    screens.current.forEach(view => view && observer.observe(view));
    return () => observer.disconnect();
  }, [pairs.length]);
  const nudged = useRef(false);
  useEffect(() => {
    if (!visible || nudged.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    nudged.current = true;
    let done = false;
    const timers = [window.setTimeout(() => setSplit(62), 400), window.setTimeout(() => { done = true; setSplit(50); }, 1100)];
    // Scrolled away mid-nudge: settle back to the middle and nudge again next time.
    return () => { timers.forEach(window.clearTimeout); if (!done) { nudged.current = false; setSplit(50); } };
  }, [visible]);
  const moveTo = (clientX: number) => {
    const box = area.current?.getBoundingClientRect();
    if (box) setSplit(Math.max(0, Math.min(100, (clientX - box.left) / box.width * 100)));
  };
  const device = media.frame === "device" || row;
  const screen = (pair: typeof pairs[number], i: number) => {
    const [left, width] = spans[i] ?? [0, 1];
    const local = Math.max(0, Math.min(100, (split / 100 - left) / width * 100));
    return <div ref={element => { screens.current[i] = element; }} className="case-screen">
      <Image src={pair.before.src} alt={pair.before.alt} fill sizes={device ? phoneSizes : sizes} />
      <div className="case-compare-after" style={{ "--local": `${local}%` } as CSSProperties}><Image src={pair.after.src} alt={pair.after.alt} fill sizes={device ? phoneSizes : sizes} /></div>
    </div>;
  };

  return <div ref={stage} className="case-stage" data-frame="compare" data-layout={device && !row ? "single-phone" : undefined}>
    <div ref={area} className="case-compare" data-dragging={dragging || undefined} style={{ "--split": `${split}%` } as CSSProperties}
      onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); moveTo(event.clientX); }}
      onPointerMove={event => { if (dragging || event.pointerType === "mouse") moveTo(event.clientX); }}
      onPointerEnter={event => { if (event.pointerType === "mouse") setDragging(true); }}
      onPointerLeave={event => { if (event.pointerType === "mouse") setDragging(false); }}
      onPointerUp={event => { if (event.pointerType !== "mouse") setDragging(false); }} onPointerCancel={() => setDragging(false)}>
      <div className={`case-stage-body case-stage-${device ? "device" : "browser"}`}>
        {row ? <div className="case-phone-row">{pairs.map((pair, i) => <Phone key={i}>{screen(pair, i)}</Phone>)}</div>
          : device ? <Phone>{screen(pairs[0], 0)}</Phone> : <Browser url={media.url} frame={media.frame === "bare" ? "bare" : "dark"} ratio={media.ratio}>{screen(pairs[0], 0)}</Browser>}
      </div>
      <span className="case-compare-tag case-compare-tag-before" aria-hidden>{media.before.label ?? "Before"}</span>
      <span className="case-compare-tag case-compare-tag-after" aria-hidden>{media.after.label ?? "After"}</span>
      <div className="case-compare-handle" role="slider" tabIndex={0} aria-label="Compare before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(split)}
        onKeyDown={event => {
          const step = event.shiftKey ? 10 : 4;
          if (event.key === "ArrowLeft") { event.preventDefault(); setSplit(value => Math.max(0, value - step)); }
          if (event.key === "ArrowRight") { event.preventDefault(); setSplit(value => Math.min(100, value + step)); }
        }}><span><CaretLeftIcon size={12} weight="bold" /><CaretRightIcon size={12} weight="bold" /></span></div>
    </div>
  </div>;
}

/** Light syntax colouring for the Code tab: comments, strings, keywords, JSX tags and numbers, nothing more. */
const TOKENS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*|\/?>)|\b(import|from|export|const|let|function|return|if|else|type|new|null|undefined|true|false|as|of|in)\b|\b(\d+(?:\.\d+)?)\b/g;
function highlight(code: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKENS)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(code.slice(last, at));
    const kind = match[1] ? "comment" : match[2] ? "string" : match[3] ? "tag" : match[4] ? "keyword" : "number";
    parts.push(<span key={at} className={`case-code-${kind}`}>{match[0]}</span>);
    last = at + match[0].length;
  }
  parts.push(code.slice(last));
  return parts;
}

/** The Code tab is off for now: the demos aren't code to copy yet. Turn it on when a case ships something reusable. */
const SHOW_CODE = false;

/**
 * A live component (src/cases/demos.tsx) in its own frame: in a phone (`device`) or on the stage (`stage`, e.g. one
 * component at real size), always interactive, with its styles or states as tabs along the bottom. A Code tab can
 * show the file that runs it (SHOW_CODE).
 */
/** Live components, each in its own frame, in a grid; `hint` adds one Interactive note above them all (off by default). */
function ComponentsGrid({ media }: { media: Extract<ProjectSlideMedia, { kind: "components" }> }) {
  return <div className="case-demo-grid">
    {media.hint && <span className="case-demo-grid-hint" aria-hidden><HandPointingIcon weight="bold" />Interactive</span>}
    {media.demos.map(demo => <div key={demo} className="case-demo-tile" data-wide={media.wide?.includes(demo) || undefined}>
      <ComponentStage media={{ kind: "component", demo }} hint={false} />
    </div>)}
  </div>;
}

const HOTSPOTS = 'button, a[href], input, select, textarea, label, [role="button"], [role="slider"], [role="tab"], [role="switch"], [role="checkbox"], [tabindex]:not([tabindex="-1"])';
type Hotspot = { left: number; top: number; width: number; height: number };

/**
 * Like a Figma prototype: a tap on a part of the screen that does nothing flashes blue boxes over everything
 * that can be tapped, then they fade. Boxes are measured in the screen's own px, so a scaled phone still lines up.
 */
function HotspotHints({ children }: { children: ReactNode }) {
  const [hint, setHint] = useState<{ key: number; boxes: Hotspot[] } | null>(null);
  const showHints = (event: React.PointerEvent<HTMLDivElement>) => {
    const screen = event.currentTarget;
    if ((event.target as Element).closest(HOTSPOTS)) return;
    const frame = screen.getBoundingClientRect();
    const scale = frame.width / screen.offsetWidth || 1;
    const targets = [...screen.querySelectorAll<HTMLElement>(HOTSPOTS)].filter(element => !element.matches(":disabled") && !element.closest("[aria-hidden='true'], [inert]"));
    // A control inside another control (a slider's ticks) shares its parent's box.
    const outer = targets.filter(element => !targets.some(other => other !== element && other.contains(element)));
    const boxes = outer.flatMap(element => {
      const box = element.getBoundingClientRect();
      // Skip controls scrolled out of their panel or covered by another layer: only what a tap would reach.
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      if (!hit || !(element === hit || element.contains(hit))) return [];
      const left = Math.max(box.left, frame.left), top = Math.max(box.top, frame.top);
      const right = Math.min(box.right, frame.right), bottom = Math.min(box.bottom, frame.bottom);
      if (right - left < 4 || bottom - top < 4) return [];
      return [{ left: (left - frame.left) / scale, top: (top - frame.top) / scale, width: (right - left) / scale, height: (bottom - top) / scale }];
    });
    if (boxes.length) setHint({ key: event.timeStamp, boxes });
  };
  return <div className="case-demo-screen" onPointerDown={showHints}>
    {children}
    {hint && <div key={hint.key} className="case-hotspots" aria-hidden onAnimationEnd={event => { if (event.target === event.currentTarget) setHint(null); }}>
      {hint.boxes.map((box, i) => <span key={i} style={box} />)}
    </div>}
  </div>;
}

/** The width a framed (`window`) stage demo is laid out at before it is scaled into its window. */
const DEMO_WIDTH = 1152;

function ComponentStage({ media, hint = true }: { media: Extract<ProjectSlideMedia, { kind: "component" }>; hint?: boolean }) {
  const demo = demos[media.demo];
  const id = useId();
  const [value, setValue] = useState<string | number>(demo?.initial ?? 0);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  // A framed demo renders at its design width and is scaled to fit its window (the same size as a screenshot frame).
  const win = useRef<HTMLDivElement>(null);
  // The tab row's extra slot, where a demo can render its own control group (InTabRow).
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const framed = !!demo?.window && view === "preview";
  useLayoutEffect(() => {
    const element = win.current;
    if (!framed || !element) return;
    const fit = () => element.style.setProperty("--demo-scale", String(element.clientWidth / DEMO_WIDTH));
    const resize = new ResizeObserver(fit);
    resize.observe(element);
    fit();
    return () => resize.disconnect();
  }, [framed]);
  if (!demo) return <div className="case-stage"><span className="case-control case-video-pending">Demo “{media.demo}” not found</span></div>;
  const { Component } = demo;
  const copy = async () => {
    try { await navigator.clipboard.writeText(media.source ?? ""); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch {}
  };

  return <div className="case-stage case-demo" data-frame={demo.frame} data-view={view} data-window={demo.window || undefined} style={demo.ratio && !demo.window ? { "--demo-ratio": demo.ratio } as CSSProperties : undefined}>
    {view === "preview"
      ? demo.frame === "device"
        ? <div className="case-stage-body case-stage-device"><Phone interactive={demo.badge !== false}><HotspotHints><DemoTabRow.Provider value={slot}><Component value={value} onValueChange={setValue} /></DemoTabRow.Provider></HotspotHints></Phone></div>
        : demo.window
          ? <div ref={win} className="case-demo-window" style={{ aspectRatio: demo.ratio }}><div className="case-demo-stage"><DemoTabRow.Provider value={slot}><Component value={value} onValueChange={setValue} /></DemoTabRow.Provider></div></div>
          : <div className="case-demo-stage"><DemoTabRow.Provider value={slot}><Component value={value} onValueChange={setValue} /></DemoTabRow.Provider></div>
      : <div className="case-code">
          <div className="case-code-bar"><span>{media.file?.split("/").pop()}</span>
            <button type="button" onClick={copy}>{copied ? <CheckIcon size={14} aria-hidden /> : <CopyIcon size={14} aria-hidden />}<span aria-live="polite">{copied ? "Copied" : "Copy"}</span></button>
          </div>
          <pre tabIndex={0}><code>{highlight(media.source ?? "")}</code></pre>
        </div>}
    {hint && demo.badge !== false && demo.frame === "stage" && <span className="case-demo-hint" style={demo.hintTop ? { top: demo.hintTop } : undefined} aria-hidden><HandPointingIcon weight="bold" />Interactive</span>}
    {SHOW_CODE && media.source && <div className="case-demo-views" role="tablist" aria-label="View">
      {(["preview", "code"] as const).map(item => <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)}>
        {view === item && <motion.span layoutId={`${id}-view`} className="case-tabs-thumb" transition={motionTokens.spring} aria-hidden />}
        {item === "preview" ? "Preview" : "Code"}
      </button>)}
    </div>}
    {view === "preview" && demo.presets.length > 1 && <StageArrows index={Math.max(0, demo.presets.findIndex(preset => preset.value === value))} count={demo.presets.length}
      onGo={next => setValue(demo.presets[next].value)} noun={demo.presetsLabel?.toLowerCase().replace(/s$/, "") ?? "state"} />}
    {view === "preview" && demo.presets.length > 1 && <div className="case-control-row">
      <div className="case-control case-tabs" role="group" aria-label={demo.presetsLabel ?? "States"}>
      {demo.presets.map((preset, i) => {
        const active = preset.value === value;
        return <button key={preset.label} type="button" aria-current={active ? "step" : undefined} onClick={() => setValue(preset.value)}>
          {active && <motion.span layoutId={`${id}-preset`} className="case-tabs-thumb" transition={motionTokens.spring} aria-hidden />}
          {/* Keyed on being picked, so the icon's animation plays each time its tab is chosen. */}
          <span className="case-tabs-label">
            {preset.icon && <span key={active ? "on" : "off"} className="case-tabs-icon" data-anim={preset.anim} aria-hidden><preset.icon weight={active ? "fill" : "regular"} /></span>}
            {demo.numbered && <span className="case-tabs-number">{i + 1}</span>}
            {preset.label}
          </span>
        </button>;
      })}
      </div>
      <div ref={setSlot} className="case-control-slot" />
    </div>}
    {view === "preview" && demo.presets.length > 1 && <TabDots count={demo.presets.length} index={Math.max(0, demo.presets.findIndex(preset => preset.value === value))} />}
  </div>;
}

/**
 * Several finished images in one frame (wireframe flows, boards): each fitted whole on the grey, switched by tabs
 * or the arrows. Expand opens the one showing in the viewer, to pan and zoom. `fill` covers the frame edge to edge;
 * `control: "player"` advances on its own like the screens' step player.
 */
function ImagesStage({ media }: { media: Extract<ProjectSlideMedia, { kind: "images" }> }) {
  const [index, setIndex] = useState(0);
  const current = media.images[Math.min(index, media.images.length - 1)];
  const stage = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const visible = useInView(stage);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const player = media.images.length > 1 && media.control === "player";
  const running = player && playing && visible && !hovered && !reduced;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % media.images.length), PLAYER_PACE);
    return () => window.clearTimeout(timer);
  }, [running, index, media.images.length]);

  return <div ref={stage} className="case-stage case-images" data-fill={media.fill || undefined} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
    <div className="case-images-body">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={current.src} className="case-images-picture" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: .3 } }} exit={{ opacity: 0, transition: { duration: .15 } }}>
          <Image src={current.src} alt={current.alt} fill sizes={sizes} />
        </motion.div>
      </AnimatePresence>
    </div>
    {media.images.length > 1 && <>
      <StageArrows index={index} count={media.images.length} onGo={setIndex} noun="image" />
      {player
        ? <StepPlayer count={media.images.length} index={index} running={running} playing={playing} labels={media.images.map((item, i) => item.label ?? `Image ${i + 1}`)} onSelect={setIndex} onToggle={() => setPlaying(value => !value)} />
        : <StepTabs screens={media.images} index={index} onSelect={setIndex} />}
    </>}
  </div>;
}

/**
 * Previous / next arrows for any frame with steps (screens, a component's styles, moodboard directions). They
 * show on hover and don't wrap: the first step has only Next, the last only Previous.
 */
function StageArrows({ index, count, onGo, noun }: { index: number; count: number; onGo: (index: number) => void; noun: string }) {
  return <>
    {index > 0 && <button type="button" className="case-arrow case-arrow-previous" aria-label={`Previous ${noun}`} onClick={() => onGo(index - 1)}><CaretLeftIcon size={18} /></button>}
    {index < count - 1 && <button type="button" className="case-arrow case-arrow-next" aria-label={`Next ${noun}`} onClick={() => onGo(index + 1)}><CaretRightIcon size={18} /></button>}
  </>;
}

/** Figma's step tabs: numbered labels in a segmented control; the white pill slides to the active step. */
function StepTabs({ screens, index, onSelect }: { screens: CaseScreen[]; index: number; onSelect: (index: number) => void }) {
  const id = useId();
  return <>
    <div className="case-control case-tabs" role="group" aria-label="Screens">
      {screens.map((item, i) => <button key={item.src} type="button" aria-current={i === index ? "step" : undefined} onClick={() => onSelect(i)}>
        {i === index && <motion.span layoutId={`${id}-tab`} className="case-tabs-thumb" transition={motionTokens.spring} aria-hidden />}
        <span className="case-tabs-label"><span className="case-tabs-number">{i + 1}</span>{item.label ?? `Screen ${i + 1}`}</span>
      </button>)}
    </div>
    <TabDots count={screens.length} index={index} />
  </>;
}

/**
 * The tabs at rest: a dot per step, the current one darker, in the tabs' place. With a mouse the dots and the tabs
 * crossfade through a soft blur when the pointer enters or leaves the frame (home.css); touch screens keep the tabs.
 */
function TabDots({ count, index }: { count: number; index: number }) {
  return <div className="case-tabs-dots" aria-hidden>{Array.from({ length: count }, (_, i) => <i key={i} data-current={i === index || undefined} />)}</div>;
}

/** Bencho-style step player: dots, the current one stretched into a bar that fills over the pace; play/pause beside it. */
function StepPlayer({ count, index, running, playing, labels, onSelect, onToggle }: { count: number; index: number; running: boolean; playing: boolean; labels: string[]; onSelect: (index: number) => void; onToggle: () => void }) {
  return <div className="case-control case-player">
    <div className="case-player-steps" role="group" aria-label="Screens">
      {Array.from({ length: count }, (_, i) => <button key={i} type="button" className="case-player-step" data-active={i === index || undefined} aria-label={labels[i]} aria-current={i === index ? "step" : undefined} onClick={() => onSelect(i)}>
        {/* The fill restarts with each step (key) and freezes while paused. */}
        {i === index && <span key={index} className="case-player-fill" style={{ animationDuration: `${PLAYER_PACE}ms`, animationPlayState: running ? "running" : "paused" }} />}
      </button>)}
    </div>
    <button type="button" className="case-player-toggle" aria-label={playing ? "Pause slideshow" : "Play slideshow"} onClick={onToggle}>{playing ? <PauseIcon size={12} weight="fill" /> : <PlayIcon size={12} weight="fill" />}</button>
  </div>;
}

/** Figma's video controls: a pause button and a seek bar. Until a video is supplied, the poster shows with a note instead. */
function VideoStage({ media }: { media: Extract<ProjectSlideMedia, { kind: "video" }> }) {
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = !!useReducedMotion();
  const visible = useInView(stage);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Plays muted while on screen, unless the visitor paused it or prefers reduced motion.
  useEffect(() => {
    const element = video.current;
    if (!element || !media.src) return;
    if (visible && !paused && !reduced) void element.play().catch(() => {});
    else element.pause();
  }, [visible, paused, reduced, media.src]);

  const body = media.src
    ? <video ref={video} className="case-video" src={media.src} poster={media.poster} muted loop playsInline preload="metadata" aria-label={media.posterAlt}
        onTimeUpdate={(event) => { const element = event.currentTarget; if (element.duration) setProgress(element.currentTime / element.duration); }} />
    : <Image src={media.poster} alt={media.posterAlt} fill sizes={sizes} />;

  return <div ref={stage} className="case-stage">
    <div className="case-stage-body case-stage-browser">{media.frame === "none" ? <div className="case-video-plain">{body}</div> : <Browser url={media.url}>{body}</Browser>}</div>
    {media.src
      ? <div className="case-control case-video-controls">
          <button type="button" className="case-player-toggle" aria-label={paused ? "Play video" : "Pause video"} onClick={() => setPaused(value => !value)}>{paused ? <PlayIcon size={12} weight="fill" /> : <PauseIcon size={12} weight="fill" />}</button>
          <input type="range" className="case-seek" min={0} max={1000} value={Math.round(progress * 1000)} aria-label="Seek video" style={{ "--progress": `${progress * 100}%` } as CSSProperties}
            onChange={(event) => { const element = video.current; if (element?.duration) element.currentTime = Number(event.target.value) / 1000 * element.duration; }} />
        </div>
      : <span className="case-control case-video-pending">Video coming soon</span>}
  </div>;
}

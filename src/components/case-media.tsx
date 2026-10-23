"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon, LockSimpleIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import type { CaseScreen, ProjectSlideMedia } from "@/content/project-slides";
import { motionTokens } from "@/lib/motion";

/** How long each screen stays in the auto-playing step player (Bencho-style: the dot grows into a bar that fills). */
const PLAYER_PACE = 6000; // ms
const ease = [...motionTokens.easeOut] as [number, number, number, number];
const sizes = "(max-width: 767px) 100vw, calc(100vw - 600px)";

/**
 * One media block of a case overview (Figma 1001:2835 and 1026:1567). Every block sits on the same stage
 * (943 × 882 in Figma) and keeps one caption under it:
 * - device: phone screens inside a drawn phone frame, with a soft reflection
 * - browser: web screens inside a window frame, optionally on a full-bleed background image
 * - image: one image filling the whole stage
 * - video: a video (or its poster until one is supplied) with the Figma pause + seek controls
 * Several screens get previous/next arrows and either labelled step tabs or the auto-playing step player.
 */
export function CaseMedia({ media }: { media: ProjectSlideMedia }) {
  return <figure className="case-media">
    {media.kind === "image" ? <div className="case-stage case-stage-bleed"><Image src={media.src} alt={media.alt} fill sizes={sizes} /></div>
      : media.kind === "video" ? <VideoStage media={media} />
      : <ScreensStage media={media} />}
    {media.caption && <figcaption>{media.caption}</figcaption>}
  </figure>;
}

function Browser({ url, children }: { url?: string; children: ReactNode }) {
  return <div className="case-browser">
    <div className="case-browser-bar" aria-hidden><span className="case-browser-lights"><i /><i /><i /></span>{url && <span className="case-browser-url"><LockSimpleIcon size={10} weight="fill" />{url}</span>}</div>
    <div className="case-browser-view">{children}</div>
  </div>;
}

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

function ScreensStage({ media }: { media: Extract<ProjectSlideMedia, { kind: "device" | "browser" }> }) {
  const { screens } = media;
  const stage = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const visible = useInView(stage);
  const [[index, direction], setStep] = useState<[number, number]>([0, 0]);
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

  const screen = screens[index];
  // A new screen slides in a few px from the side it comes from, through a light blur; the old one leaves faster.
  const content = <AnimatePresence initial={false} custom={direction} mode="popLayout">
    <motion.div key={screen.src} className="case-screen" custom={direction}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: direction * 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: motionTokens.duration.panel, ease } }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction * -12, filter: "blur(4px)", transition: { duration: motionTokens.duration.fast, ease } }}>
      <Image src={screen.src} alt={screen.alt} fill sizes={media.kind === "device" ? "(max-width: 767px) 60vw, 340px" : sizes} />
    </motion.div>
  </AnimatePresence>;

  return <div ref={stage} className={`case-stage${media.kind === "browser" && media.background ? " case-stage-bleed" : ""}`} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
    {media.kind === "browser" && media.background && <Image className="case-stage-background" src={media.background} alt="" fill sizes={sizes} />}
    <div className={`case-stage-body case-stage-${media.kind}`} aria-live="polite">
      {media.kind === "device"
        ? <div className="case-phone"><div className="case-phone-screen">{content}</div></div>
        : <Browser url={media.url}>{content}</Browser>}
    </div>
    {many && <>
      <button type="button" className="case-arrow case-arrow-previous" aria-label="Previous screen" onClick={() => go(index - 1)}><CaretLeftIcon size={18} /></button>
      <button type="button" className="case-arrow case-arrow-next" aria-label="Next screen" onClick={() => go(index + 1)}><CaretRightIcon size={18} /></button>
      {player
        ? <StepPlayer count={screens.length} index={index} running={running} playing={playing} labels={screens.map((item, i) => item.label ?? `Screen ${i + 1}`)} onSelect={go} onToggle={() => setPlaying(value => !value)} />
        : <StepTabs screens={screens} index={index} onSelect={go} />}
    </>}
  </div>;
}

/** Figma's step tabs: numbered labels in a segmented control; the white pill slides to the active step. */
function StepTabs({ screens, index, onSelect }: { screens: CaseScreen[]; index: number; onSelect: (index: number) => void }) {
  const id = useId();
  return <div className="case-control case-tabs" role="group" aria-label="Screens">
    {screens.map((item, i) => <button key={item.src} type="button" aria-current={i === index ? "step" : undefined} onClick={() => onSelect(i)}>
      {i === index && <motion.span layoutId={`${id}-tab`} className="case-tabs-thumb" transition={motionTokens.spring} aria-hidden />}
      <span className="case-tabs-number">{i + 1}</span>{item.label ?? `Screen ${i + 1}`}
    </button>)}
  </div>;
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

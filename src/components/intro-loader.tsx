"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SEEN = "intro-seen";
const MIN_MS = 500; // long enough not to flash
const MAX_MS = 3000; // never hold a visitor longer than this
const WARM_SLIDES = 2; // case slides (or case study figures) past the first screen whose images are decoded up front

/** Runs before first paint: a visitor who already saw the intro this session never sees it flash. */
export const introSeenScript = `try{if(sessionStorage.getItem("${SEEN}"))document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => resolve(null)));
const settle = (task: Promise<unknown>) => task.then(() => undefined, () => undefined);

/** Fetch and decode an image now, even if it is lazy, so scrolling to it later doesn't stall. */
function warm(image: HTMLImageElement) {
  if (image.loading === "lazy") image.loading = "eager";
  return settle(image.decode());
}

/**
 * First-visit intro (once per session, desktop only; phones get the mobile blocker). While it shows,
 * the fonts load, the first screen's images and the hero canvas get ready, and the next case slides'
 * images are fetched and decoded, so the first scroll doesn't stall on decoding. The hero waits under
 * it (html[data-intro]) so the plant still grows in view.
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    // Already seen this session, or a phone: CSS keeps it hidden, so there is nothing to prepare.
    if (root.hasAttribute("data-intro-seen") || matchMedia("(max-width: 767px)").matches) return;
    root.setAttribute("data-intro", "");
    let cancelled = false;
    const started = performance.now();

    async function prepare() {
      await nextFrame();
      const inView = [...document.images].filter(image => { const box = image.getBoundingClientRect(); return box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth; });
      // Home: the next case slides. A case study page: its first figures below the header.
      const homeSlides = [...document.querySelectorAll(".portfolio-page")].slice(1, 1 + WARM_SLIDES);
      const slides = homeSlides.length ? homeSlides : [...document.querySelectorAll(".case-study-figure")].slice(0, WARM_SLIDES + 1);
      const ahead = slides.flatMap(slide => [...slide.querySelectorAll("img")]);
      const hero = document.querySelector<HTMLCanvasElement>(".home-slide canvas");
      const heroReady = hero ? new Promise<void>(resolve => {
        if (hero.dataset.ready) return resolve();
        const watch = new MutationObserver(() => { if (hero.dataset.ready) { watch.disconnect(); resolve(); } });
        watch.observe(hero, { attributes: true, attributeFilter: ["data-ready"] });
      }) : Promise.resolve();
      const tasks = [settle(document.fonts.ready), heroReady, ...inView.map(warm), ...ahead.map(warm)];
      let done = 0;
      await Promise.all(tasks.map(task => task.then(() => { done++; if (!cancelled) setProgress(done / tasks.length); })));
    }

    const timeout = new Promise(resolve => setTimeout(resolve, MAX_MS));
    void Promise.race([prepare(), timeout]).then(async () => {
      const left = MIN_MS - (performance.now() - started);
      if (left > 0) await new Promise(resolve => setTimeout(resolve, left));
      if (cancelled) return;
      setProgress(1);
      setPhase("leaving");
      root.removeAttribute("data-intro");
      try { sessionStorage.setItem(SEEN, "1"); } catch { /* storage can be unavailable */ }
    });
    return () => { cancelled = true; root.removeAttribute("data-intro"); };
  }, []);

  if (phase === "gone") return null;
  return (
    <div className="intro-loader" data-phase={phase} aria-hidden={phase === "leaving"} onTransitionEnd={event => { if (event.target === event.currentTarget && phase === "leaving") setPhase("gone"); }}>
      <div className="intro-loader-mark" role="status" aria-label="Loading">
        <Image src="/figma/avatar.png" alt="" width={44} height={44} priority />
        <span className="intro-loader-name">Oleh Bril</span>
        <span className="intro-loader-track" aria-hidden><span style={{ transform: `scaleX(${Math.max(.08, progress)})` }} /></span>
      </div>
    </div>
  );
}

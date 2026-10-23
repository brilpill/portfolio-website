"use client";

import { useEffect, useRef } from "react";

/** A waveform that reacts to cues actually started by the shared audio player. */
export function SoundWaveform() {
  const icon = useRef<SVGSVGElement>(null);
  useEffect(() => {
    let animations: Animation[] = [];
    const play = () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      animations.forEach(animation => animation.cancel());
      animations = Array.from(icon.current?.querySelectorAll("line") ?? []).map((bar, index) =>
        bar.animate([
          { transform: "scaleY(1)" },
          { transform: `scaleY(${index % 2 ? .25 : 1.5})`, offset: .25 },
          { transform: `scaleY(${index % 2 ? 1.4 : .3})`, offset: .55 },
          { transform: "scaleY(1)" },
        ], { duration: 400, delay: index * 12, easing: "ease-out" }),
      );
    };
    window.addEventListener("portfolio:sound-played", play);
    return () => { window.removeEventListener("portfolio:sound-played", play); animations.forEach(animation => animation.cancel()); };
  }, []);
  return <svg ref={icon} className="sound-playback-waveform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    {[6, 12, 18, 10, 15].map((height, index) => <line key={index} x1={4 + index * 4} x2={4 + index * 4} y1={12 - height / 2} y2={12 + height / 2} style={{ transformOrigin: "center", transformBox: "fill-box" }} />)}
  </svg>;
}

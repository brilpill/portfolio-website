"use client";

import { useState } from "react";
import type { V5Thumb } from "@/content/v5";

/** An image that fades and unblurs in once loaded, as on the reference. */
export function FadeImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} className={`${props.className ?? ""} media-fade`} data-loaded={loaded} ref={img => { if (img?.complete && !loaded) setLoaded(true); }} onLoad={() => setLoaded(true)} />;
}

export function FadeVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const [loaded, setLoaded] = useState(false);
  // A cached clip can finish loading before hydration attaches onLoadedData, so check its state on mount too.
  return <video className="media-fade" data-loaded={loaded} ref={video => { if (video && video.readyState >= 2 && !loaded) setLoaded(true); }} src={src} poster={poster} aria-label={label} autoPlay muted loop playsInline preload="metadata" onLoadedData={() => setLoaded(true)} />;
}

/** A case thumbnail: phone screens rising from a tinted ground, or one web screen set into it. */
export function Thumb({ thumb, title }: { thumb: V5Thumb; title: string }) {
  if (thumb.kind === "phones") {
    return (
      <div className="v5-thumb v5-thumb-phones" style={{ background: thumb.tint, aspectRatio: thumb.ratio ?? "16 / 10" }} role="img" aria-label={`Screens from ${title}`}>
        {thumb.screens.map(screen => <FadeImg key={screen.src} src={screen.src} alt="" loading="lazy" />)}
      </div>
    );
  }
  return (
    <div className="v5-thumb v5-thumb-web" style={{ background: thumb.tint }}>
      <FadeImg src={thumb.src} alt={thumb.alt} loading="lazy" />
    </div>
  );
}

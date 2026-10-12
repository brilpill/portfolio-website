"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The first picture that loads. A saved site usually has a screenshot, a social image and a
 * thumbnail; any of them can be gone, so a failed one hands over to the next, and when none
 * is left the card shows the site's own colours instead of a broken-image glyph.
 */
export function Picture({
  srcs,
  palette,
  className = "",
}: {
  srcs: string[];
  palette: string[];
  className?: string;
}) {
  const [failed, setFailed] = useState(0);
  const src = srcs[failed];
  const ref = useRef<HTMLImageElement>(null);
  // Move past this picture once, however many ways its failure gets reported.
  const skip = (dead: string) => setFailed((n) => (srcs[n] === dead ? n + 1 : n));

  // An image that failed before React hydrated never reports it, so look on mount.
  useEffect(() => {
    const img = ref.current;
    if (src && img?.complete && img.naturalWidth === 0) skip(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!src) return <Swatches palette={palette} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      key={src}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => skip(src)}
      className={`size-full object-cover object-top ${className}`}
    />
  );
}

/** A site's palette as soft bands — what's left when no picture loads. */
export function Swatches({ palette, className = "" }: { palette: string[]; className?: string }) {
  const colours = palette.length ? palette : ["var(--line)", "var(--line-strong)"];
  return (
    <div
      aria-hidden
      className={`size-full ${className}`}
      style={{ background: `linear-gradient(135deg, ${colours.map((c, i) => `${c} ${(i / colours.length) * 100}%`).join(", ")})` }}
    />
  );
}

/** A small site icon, or its first letter when it has none (or it doesn't load). */
export function Logo({ src, name, size = 18 }: { src: string | null; name: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth === 0) setBroken(true);
  }, []);
  if (!src || broken) {
    return (
      <span
        aria-hidden
        className="inline-grid shrink-0 place-items-center rounded-[5px] border border-line-strong font-mono text-muted"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setBroken(true)}
      className="shrink-0 rounded-[5px] bg-raised object-contain"
      style={{ width: size, height: size }}
    />
  );
}

"use client";

import { useState } from "react";

/** The colours a browser read off the site. Click one to copy its hex. */
export function PaletteSwatches({ colours }: { colours: string[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
    } catch {
      // no clipboard (an insecure page, a denied permission): the hex is still on screen
    }
  };

  return (
    <div className="grid grid-cols-6 gap-1.5">
      {colours.map((hex) => (
        <button
          key={hex}
          onClick={() => copy(hex)}
          title={`Copy ${hex}`}
          className="group flex flex-col gap-1 text-left"
        >
          <span
            className="aspect-square w-full rounded-lg ring-1 ring-line transition-transform duration-300 ease-out-quint group-hover:-translate-y-0.5"
            style={{ background: hex }}
          />
          <span className="truncate font-mono text-[10px] text-muted">{copied === hex ? "copied" : hex.slice(1)}</span>
        </button>
      ))}
    </div>
  );
}

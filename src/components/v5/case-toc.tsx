"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/** The case's chapters in the left rail (the shell's slot), with the one in view marked. */
export function CaseToc({ items }: { items: { id: string; label: string }[] }) {
  // The shell renders the slot before any page, so it is there by the time this hydrates.
  const slot = useSyncExternalStore(() => () => {}, () => document.getElementById("v5-toc-slot"), () => null);
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const root = document.querySelector("[data-v5-scroll]");
    if (!root) return;
    const spy = () => {
      // The last chapter whose top has passed a third of the way down the column.
      const line = root.getBoundingClientRect().top + root.clientHeight / 3;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
      // A long rail scrolls on its own; keep the current chapter in sight.
      document.querySelector(`.v5-toc a[href="#${current}"]`)?.scrollIntoView({ block: "nearest" });
    };
    const frame = requestAnimationFrame(spy);
    root.addEventListener("scroll", spy, { passive: true });
    return () => { cancelAnimationFrame(frame); root.removeEventListener("scroll", spy); };
  }, [items]);

  if (!slot) return null;
  const index = items.findIndex(item => item.id === active);
  return createPortal(
    <nav className="v5-toc" aria-label="Chapters">
      {index >= 0 && <span className="v5-nav-dot" aria-hidden style={{ top: 8 + index * 28 }} />}
      {items.map(item => (
        <a key={item.id} className="v5-tap" href={`#${item.id}`} data-active={item.id === active} onClick={event => {
          event.preventDefault();
          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}>{item.label}</a>
      ))}
    </nav>,
    slot,
  );
}

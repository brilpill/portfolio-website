"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A highlighted paragraph (after React Bits' blur-highlight look; original code): the text is still, and as the
 * paragraph comes into view a soft highlight box draws in behind its key phrase, from left to right, once.
 * Children are the paragraph's parts; the phrase is a <mark className="case-mark">.
 */
export function BlurHighlight({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLParagraphElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setOn(true); observer.disconnect(); } }, { threshold: .6, rootMargin: "0px 0px -10% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <p ref={root} className={["case-blur", className].filter(Boolean).join(" ")} data-on={on || undefined}>{children}</p>;
}

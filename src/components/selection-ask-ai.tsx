"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AskAiIcon } from "./ask-ai-icon";
import { motionTokens } from "@/lib/motion";

/** Pass the selected passage into the assistant as temporary question context. */
export function SelectionAskAI({ onAsk, scope }: { onAsk: (selectedText: string) => void; scope: string }) {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame = 0, selecting = false;
    const hide = () => { cancelAnimationFrame(frame); setPosition(null); };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (selecting) return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selection.toString().trim() || !selection.rangeCount) { setPosition(null); return; }
        const range = selection.getRangeAt(0);
        const ancestor = range.commonAncestorContainer;
        const element = ancestor instanceof Element ? ancestor : ancestor.parentElement;
        const container = element?.closest(scope);
        const blocked = "button, input, textarea, select, nav, pre, [contenteditable], [role=dialog], #portfolio-assistant";
        const start = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
        const end = range.endContainer instanceof Element ? range.endContainer : range.endContainer.parentElement;
        if (!container || element?.closest(blocked) || start?.closest(blocked) || end?.closest(blocked) || !container.contains(range.startContainer) || !container.contains(range.endContainer)) { setPosition(null); return; }
        const rect = range.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > innerHeight) { setPosition(null); return; }
        const viewport = window.visualViewport;
        const minX = (viewport?.offsetLeft ?? 0) + 8;
        const maxX = (viewport?.offsetLeft ?? 0) + (viewport?.width ?? innerWidth) - 94;
        setPosition({ left: Math.max(minX, Math.min(maxX, rect.left + rect.width / 2 - 43)), top: Math.max(8, Math.min(innerHeight - 40, rect.top >= 48 ? rect.top - 42 : rect.bottom + 8)) });
      });
    };
    const down = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest?.(".selection-ask-ai")) return;
      selecting = true; hide();
    };
    const up = () => { selecting = false; update(); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); else update(); };
    document.addEventListener("selectionchange", update);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("keyup", key);
    document.addEventListener("scroll", hide, { capture: true, passive: true });
    window.addEventListener("resize", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", update);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("keyup", key);
      document.removeEventListener("scroll", hide, { capture: true });
      window.removeEventListener("resize", hide);
    };
  }, [scope]);
  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence>{position && <motion.button type="button" className="selection-ask-ai ask-ai-trigger" style={position} title="Currently unavailable." aria-label="Ask AI preview — currently unavailable"
    initial={{ opacity: 0, y: reduced ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 2 }}
    transition={{ duration: reduced ? 0 : motionTokens.duration.fast, ease: motionTokens.easeOut }}
    onPointerDown={event => event.preventDefault()} onClick={() => { const selectedText = window.getSelection()?.toString().trim().slice(0, 1000) ?? ""; setPosition(null); window.getSelection()?.removeAllRanges(); if (selectedText) onAsk(selectedText); }}>
    <AskAiIcon size={14} /><span>Ask AI</span>
  </motion.button>}</AnimatePresence>, document.body);
}

"use client";

import { useEffect, useRef, useState } from "react";

type Box = { x: number; y: number; w: number; h: number };

/** The selected text's line boxes, merged per line, with overlapping neighbours split at the midpoint. */
function boxesOf(range: Range, within: Element): Box[] {
  const rects: DOMRect[] = [];
  const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT);
  const part = document.createRange();
  for (let node = walker.currentNode as Node | null; node; node = walker.nextNode()) {
    if (node.nodeType !== Node.TEXT_NODE || !range.intersectsNode(node) || !node.textContent?.trim()) continue;
    if (!within.contains(node)) continue;
    part.selectNodeContents(node);
    if (node === range.startContainer) part.setStart(node, range.startOffset);
    if (node === range.endContainer) part.setEnd(node, range.endOffset);
    rects.push(...[...part.getClientRects()].filter(rect => rect.width > 0));
  }

  // One box per visual line (fragments whose tops sit within a few px of each other).
  const lines: Box[] = [];
  for (const rect of rects.sort((a, b) => a.top - b.top || a.left - b.left)) {
    const line = lines.find(box => Math.abs(box.y - rect.top) < 4 && Math.abs(box.h - rect.height) < 4);
    if (line) {
      const right = Math.max(line.x + line.w, rect.right);
      line.x = Math.min(line.x, rect.left);
      line.w = right - line.x;
    } else lines.push({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
  }

  // Tight leading makes a line's box reach into the next one; share the overlap instead of stacking it.
  lines.sort((a, b) => a.y - b.y);
  for (let i = 1; i < lines.length; i++) {
    const above = lines[i - 1], below = lines[i];
    const overlap = above.y + above.h - below.y;
    if (overlap > 0 && overlap < below.h) {
      above.h -= overlap / 2;
      below.y += overlap / 2;
      below.h -= overlap / 2;
    }
  }

  const origin = within.getBoundingClientRect();
  return lines.map(line => ({ x: line.x - origin.left, y: line.y - origin.top, w: line.w, h: line.h }));
}

/** Paints the selection tint behind the page copy (inside `.v5-main`), so two selected lines never stack or cover
 * each other's letters; the native ::selection there only recolours the text. */
export function V5SelectionPaint() {
  const layer = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const main = layer.current?.parentElement;
        const selection = window.getSelection();
        if (!main || !selection?.rangeCount || selection.isCollapsed) { setBoxes([]); return; }
        setBoxes(boxesOf(selection.getRangeAt(0), main));
      });
    };
    document.addEventListener("selectionchange", paint);
    window.addEventListener("resize", paint);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("selectionchange", paint); window.removeEventListener("resize", paint); };
  }, []);

  return (
    <div ref={layer} className="v5-selection" aria-hidden>
      {boxes.map((box, i) => <span key={i} style={{ left: box.x, top: box.y, width: box.w, height: box.h }} />)}
    </div>
  );
}

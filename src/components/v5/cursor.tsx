"use client";

import { useEffect, useRef, useState } from "react";

const ACTION = "a, button, [role='button'], label, [data-cursor]";
const FIELD = ".v5-ask, textarea, [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']):not([type='file']):not([type='color']):not([type='range'])";

/** Is the pointer on copy? Like rachelchen.tech: the whole text run under the caret counts, with 6px of slack,
 * so the bar holds steady across word gaps and line spacing instead of flickering per glyph. */
function overText(x: number, y: number, target: Element) {
  if (target.closest(ACTION)) return false;
  if (target.closest(FIELD)) return true;
  if (getComputedStyle(target).userSelect === "none") return false;
  const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null };
  const node = document.caretRangeFromPoint?.(x, y)?.startContainer ?? doc.caretPositionFromPoint?.(x, y)?.offsetNode;
  if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return false;
  const range = document.createRange();
  range.selectNodeContents(node);
  const boxes = [...range.getClientRects()].filter(box => box.width > 0);
  return boxes.length === 0 || boxes.some(box => x >= box.left - 6 && x <= box.right + 6 && y >= box.top - 6 && y <= box.bottom + 6);
}

/** The square cursor, after rachelchen.tech: it snaps into a 3 × 20 text bar over copy and eases back to a square,
 * dips to 75% while pressed, and over anything with `data-cursor` shrinks and says what a click does. Buttons
 * (`.v5-btn`) carry no `data-cursor`: their own label already says it, so the cursor stays a plain square there. */
export function V5Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = el.current?.closest<HTMLElement>(".v5");
    root?.setAttribute("data-v5-cursor", "");
    let shown = false;
    let text = false;
    let leaving: number | undefined;

    const place = (x: number, y: number, labelled: boolean) => {
      const cursor = el.current;
      if (!cursor) return;
      // Centred on the pointer at whatever size it currently is.
      const [w, h] = text ? [3, 20] : labelled ? [8, 8] : [14, 14];
      cursor.dataset.mode = text ? "text" : "dot";
      cursor.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px)`;
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target as Element | null;
      const cursor = el.current;
      if (!target || !cursor) return;
      const action = target.closest?.("[data-cursor]");
      if (overText(event.clientX, event.clientY, target)) {
        // Back on copy: cancel any pending exit and snap to the bar.
        window.clearTimeout(leaving); leaving = undefined;
        text = true;
      } else if (text && leaving === undefined) {
        // Leaving copy waits 90ms, so brushing past a gap doesn't flash the square.
        leaving = window.setTimeout(() => { leaving = undefined; text = false; place(event.clientX, event.clientY, !!action); }, 90);
      }
      if (text && target.closest(ACTION)) { window.clearTimeout(leaving); leaving = undefined; text = false; }
      place(event.clientX, event.clientY, !!action);
      if (!shown) { cursor.style.opacity = "1"; shown = true; }
      setLabel(action?.getAttribute("data-cursor") || null);
    };
    const press = () => el.current?.setAttribute("data-pressed", "");
    const release = () => el.current?.removeAttribute("data-pressed");
    const leave = () => { if (el.current) el.current.style.opacity = "0"; shown = false; };

    document.addEventListener("pointermove", move);
    document.addEventListener("mousedown", press);
    document.addEventListener("mouseup", release);
    window.addEventListener("blur", release);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.clearTimeout(leaving);
      root?.removeAttribute("data-v5-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("mousedown", press);
      document.removeEventListener("mouseup", release);
      window.removeEventListener("blur", release);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={el} className="v5-cursor" style={{ opacity: 0 }} data-mode="dot" data-label={label ?? undefined} aria-hidden>
      <div className="v5-cursor-body">
        <span className="v5-cursor-dot" />
        {label && <span className="v5-cursor-label">{label}</span>}
      </div>
    </div>
  );
}

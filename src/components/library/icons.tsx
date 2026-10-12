/** Three spines on a shelf, in the same bordered square as the sidebar's other "More" rows. */
export function LibraryIcon() {
  return (
    <span className="grid size-[18px] place-items-center rounded-[6px] border border-line-strong text-ink-2" aria-hidden>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 1.5v7M4.5 1.5v7M7 2l1.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

const SHELF_GLYPH: Record<string, string> = {
  inspiration: "◐",
  tool: "⌘",
  fragment: "▦",
  plugin: "⊕",
  learn: "¶",
  prompt: "›",
  checklist: "✓",
};

/** A shelf's mark in the rail: the same 18px square as the site's other rows. */
export function ShelfDot({ id }: { id: string }) {
  return (
    <span
      className="grid size-[18px] shrink-0 place-items-center rounded-[6px] border border-line-strong font-mono text-[10px] text-ink-2"
      aria-hidden
    >
      {SHELF_GLYPH[id] ?? "·"}
    </span>
  );
}

export function ArrowOut({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M4 3h5v5M9 3 3 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowBack() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

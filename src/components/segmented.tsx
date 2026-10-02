"use client";

/** Pill switcher: a 3px track with the active segment lifted in white. */
export function Segmented({
  items,
  value,
  onChange,
  numbered = false,
  label,
  className = "",
}: {
  items: string[];
  value: number;
  onChange: (i: number) => void;
  numbered?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`flex max-w-full items-center gap-0.5 overflow-x-auto rounded-[10px] bg-fill p-[3px] no-scrollbar ${className}`}
    >
      {items.map((item, i) => {
        const on = i === value;
        return (
          <button
            key={item}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(i)}
            className={`flex h-[26px] shrink-0 items-center gap-1.5 rounded-[8px] px-2.5 text-[12px] leading-[18px] transition-[color,background-color,box-shadow] duration-150 ${
              on ? "bg-card font-medium text-ink shadow-control" : "text-seg hover:text-ink"
            }`}
          >
            {numbered && <span className="tabular-nums">{i + 1}</span>}
            {item}
          </button>
        );
      })}
    </div>
  );
}

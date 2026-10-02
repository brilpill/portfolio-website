"use client";

import { useEffect } from "react";
import { Segmented } from "./segmented";
import { setPaging, usePaging, type Paging } from "./settings-store";

const pagingOptions: { value: Paging; label: string }[] = [
  { value: "flip", label: "Turn pages" },
  { value: "scroll", label: "Scroll freely" },
];

export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const paging = usePaging();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/15 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="pop-in flex w-full max-w-[380px] flex-col gap-5 rounded-[20px] bg-card p-5 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold leading-[22px]">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="grid size-7 place-items-center rounded-[8px] text-muted transition-colors hover:bg-fill hover:text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="m2.5 2.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium leading-[19.5px]">Scrolling</span>
            <span className="text-[12px] leading-[18px] text-muted">
              {paging === "flip" ? "One scroll turns one page." : "Pages scroll like a normal website."}
            </span>
          </div>
          <Segmented
            className="self-start"
            label="Scrolling"
            items={pagingOptions.map((o) => o.label)}
            value={pagingOptions.findIndex((o) => o.value === paging)}
            onChange={(i) => setPaging(pagingOptions[i].value)}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Segmented } from "./segmented";
import { setPaging, setThemePref, usePaging, useThemePref, type Paging, type ThemePref } from "./settings-store";

const themeOptions: { value: ThemePref; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const pagingOptions: { value: Paging; label: string }[] = [
  { value: "flip", label: "Turn pages" },
  { value: "scroll", label: "Scroll freely" },
];

export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const theme = useThemePref();
  const paging = usePaging();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/15 px-4 dark:bg-black/45" onClick={onClose}>
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

        <Setting title="Theme" hint="System follows your device.">
          <Segmented
            label="Theme"
            items={themeOptions.map((o) => o.label)}
            value={themeOptions.findIndex((o) => o.value === theme)}
            onChange={(i) => setThemePref(themeOptions[i].value)}
          />
        </Setting>

        <Setting
          title="Scrolling"
          hint={paging === "flip" ? "One scroll turns one page." : "Pages scroll like a normal website."}
        >
          <Segmented
            label="Scrolling"
            items={pagingOptions.map((o) => o.label)}
            value={pagingOptions.findIndex((o) => o.value === paging)}
            onChange={(i) => setPaging(pagingOptions[i].value)}
          />
        </Setting>
      </div>
    </div>
  );
}

function Setting({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <span className="text-[13px] font-medium leading-[19.5px]">{title}</span>
        <span className="text-[12px] leading-[18px] text-muted">{hint}</span>
      </div>
      <div className="self-start">{children}</div>
    </div>
  );
}

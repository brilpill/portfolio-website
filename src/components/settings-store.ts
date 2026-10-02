"use client";

import { useSyncExternalStore } from "react";

/** Visitor preferences, kept in localStorage. */
export type Paging = "flip" | "scroll";

const EVENT = "settings-change";

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const pagings = ["flip", "scroll"] as const;

export function usePaging() {
  return useSyncExternalStore(subscribe, () => read("paging", pagings, "flip"), () => "flip" as Paging);
}

export function setPaging(paging: Paging) {
  write("paging", paging === "flip" ? null : paging);
}

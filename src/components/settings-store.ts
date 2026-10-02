"use client";

import { useSyncExternalStore } from "react";

/** Visitor preferences, kept in localStorage. "system" for theme means no stored value. */
export type ThemePref = "system" | "light" | "dark";
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

const themes = ["system", "light", "dark"] as const;
const pagings = ["flip", "scroll"] as const;

export function useThemePref() {
  return useSyncExternalStore(subscribe, () => read("theme", themes, "system"), () => "system" as ThemePref);
}

export function usePaging() {
  return useSyncExternalStore(subscribe, () => read("paging", pagings, "flip"), () => "flip" as Paging);
}

export function applyTheme(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function setThemePref(pref: ThemePref) {
  write("theme", pref === "system" ? null : pref);
  applyTheme(pref);
}

export function setPaging(paging: Paging) {
  write("paging", paging === "flip" ? null : paging);
}

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

const switches = ["on", "off"] as const;
export function useSidebarVisible() {
  return useSyncExternalStore(subscribe, () => read("portfolio-sidebar", switches, "on") === "on", () => true);
}
export function setSidebarVisible(visible: boolean) { write("portfolio-sidebar", visible ? "on" : "off"); }
export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, () => read("portfolio-sound", switches, "off") === "on", () => false);
}
export function setSoundEnabled(enabled: boolean) { write("portfolio-sound", enabled ? "on" : "off"); }
/** Section snapping on the card-shell page: on, each wheel or swipe settles on a whole section; off (the default), the page scrolls freely. */
export function useSectionSnap() {
  return useSyncExternalStore(subscribe, () => read("portfolio-snap", switches, "off") === "on", () => false);
}
export function setSectionSnap(enabled: boolean) { write("portfolio-snap", enabled ? "on" : "off"); }

/** Light and dark appearances for the Playground files experiment. */
const playgroundAppearances = ["light", "dark"] as const;
export type PlaygroundAppearance = (typeof playgroundAppearances)[number];
export function usePlaygroundAppearance() {
  return useSyncExternalStore(subscribe, () => read("playground-files-appearance", playgroundAppearances, "dark"), () => "dark" as PlaygroundAppearance);
}
export function setPlaygroundAppearance(value: PlaygroundAppearance) { write("playground-files-appearance", value === "dark" ? null : value); }

/** The main portfolio keeps its original light appearance until the visitor chooses dark. */
export function usePortfolioAppearance() {
  return useSyncExternalStore(subscribe, () => read("portfolio-appearance", playgroundAppearances, "light"), () => "light" as PlaygroundAppearance);
}
export function setPortfolioAppearance(value: PlaygroundAppearance) { write("portfolio-appearance", value === "light" ? null : value); }

"use client";

import { useSyncExternalStore } from "react";

/** How v5 content appears, for comparing two takes:
 *  - "reveal" (option 1, default): the hero title condenses from vapour and page blocks rise in (Texts reveal);
 *  - "generate" (option 2): blocks "print" in with the transitions.dev UI generation skill.
 * Pick with ?enter=generate or ?enter=reveal; the choice is kept for the rest of the browser session, so it holds
 * across in-site links (which drop the query). */
export type EnterMode = "reveal" | "generate";
const KEY = "v5-enter";

function read(): EnterMode {
  const asked = new URLSearchParams(window.location.search).get("enter");
  try {
    if (asked === "generate" || asked === "reveal") sessionStorage.setItem(KEY, asked);
    return sessionStorage.getItem(KEY) === "generate" ? "generate" : "reveal";
  } catch {
    return asked === "generate" ? "generate" : "reveal";
  }
}

const subscribe = (change: () => void) => {
  window.addEventListener("popstate", change);
  return () => window.removeEventListener("popstate", change);
};

export function useEnterMode(): EnterMode {
  return useSyncExternalStore(subscribe, read, () => "reveal");
}

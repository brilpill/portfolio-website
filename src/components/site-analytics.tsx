"use client";

import { useEffect } from "react";

/** Optional Plausible integration. The per-site script URL comes from its installation screen. */
export function SiteAnalytics({ scriptUrl }: { scriptUrl: string | null }) {
  useEffect(() => {
    if (!scriptUrl || !/^https:\/\/plausible\.io\/js\/pa-[a-zA-Z0-9_-]+\.js$/.test(scriptUrl)) return;
    if (document.getElementById("plausible-tracker")) return;
    type Plausible = ((...args: unknown[]) => void) & { q?: unknown[][]; init?: (options: { hashBasedRouting: boolean }) => void; o?: { hashBasedRouting: boolean } };
    const host = window as typeof window & { plausible?: Plausible };
    const plausible = ((...args: unknown[]) => { (plausible.q ??= []).push(args); }) as Plausible;
    plausible.init = options => { plausible.o = options; };
    host.plausible = plausible;
    plausible.init({ hashBasedRouting: true });
    const script = document.createElement("script");
    script.id = "plausible-tracker";
    script.src = scriptUrl;
    script.async = true;
    document.head.append(script);
  }, [scriptUrl]);
  return null;
}

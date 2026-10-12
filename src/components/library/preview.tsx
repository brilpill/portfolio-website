"use client";

import { useCallback, useState } from "react";
import { ArrowOut } from "./icons";
import { Picture } from "./picture";

type View = "motion" | "screenshot" | "og" | "live";

const LABEL: Record<View, string> = { motion: "Moving", screenshot: "Screenshot", og: "Social image", live: "Live" };

/** The site's own desktop layout, scaled to fit — a frame as wide as its column would show the tablet one. */
const LIVE_W = 1440;
const LIVE_H = 900;

/**
 * The item's pictures in one frame, like a project's stage on the home page. It opens on the
 * recorded clip when there is one (with the screenshot as its poster, so the first paint is
 * instant); the live page loads only when asked for, since it fetches someone else's site.
 */
export function Preview({
  url,
  domain,
  screenshot,
  og,
  motion,
  embeddable,
  accent,
  palette,
}: {
  url: string;
  domain: string;
  screenshot: string | null;
  og: string | null;
  motion: string | null;
  embeddable: boolean;
  accent: string;
  palette: string[];
}) {
  const views = ([
    motion && "motion",
    screenshot && "screenshot",
    og && og !== screenshot && "og",
    embeddable && "live",
  ].filter(Boolean) as View[]);
  const [view, setView] = useState<View | undefined>(views[0]);

  return (
    <div className="dot-grid relative flex h-full min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[14px] border border-line bg-panel p-4 sm:p-6 lg:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          background: `radial-gradient(60% 50% at 50% 55%, color-mix(in oklab, ${accent} 22%, transparent), transparent 70%)`,
        }}
      />

      <div className="relative flex w-full flex-1 items-center justify-center">
        <div className="w-full max-w-[880px] overflow-hidden rounded-[12px] border border-line-strong bg-raised shadow-card">
          <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2.5 rounded-full bg-line-strong" />
              ))}
            </div>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mx-auto flex max-w-[60%] items-center gap-1.5 truncate rounded-md bg-paper px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:text-ink"
            >
              <span className="truncate">{domain}</span>
              <ArrowOut size={10} />
            </a>
            <div className="w-[42px]" />
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper">
            {view === "motion" && motion && (
              <video
                key={motion}
                src={motion}
                poster={screenshot ?? undefined}
                className="size-full object-cover object-top"
                autoPlay
                muted
                loop
                playsInline
              />
            )}
            {view === "screenshot" && <Picture srcs={screenshot ? [screenshot] : []} palette={palette} />}
            {view === "og" && og && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={og} alt="" className="size-full object-contain" />
            )}
            {view === "live" && <LiveFrame url={url} />}
            {!view && <Picture srcs={[]} palette={palette} />}
          </div>
        </div>
      </div>

      {views.length > 1 && (
        <div className="relative mt-6 flex gap-1 rounded-full border border-line bg-raised p-1 shadow-card">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={v === view}
              className={`rounded-full px-3 py-1 text-[13px] transition-colors ${
                v === view ? "bg-ink text-paper" : "text-muted hover:text-ink"
              }`}
            >
              {LABEL[v]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LiveFrame({ url }: { url: string }) {
  const [scale, setScale] = useState(0);
  const measure = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / LIVE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={measure} className="absolute inset-0">
      {scale > 0 && (
        <iframe
          src={url}
          title="Live page"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
          className="origin-top-left border-0 bg-white"
          style={{ width: LIVE_W, height: LIVE_H, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

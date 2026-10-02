"use client";

import { useState } from "react";
import type { Layout, Media, Project, View } from "@/content/projects";
import { Segmented } from "./segmented";

const tint = (accent: string, pct: number) => `color-mix(in oklab, ${accent} ${pct}%, transparent)`;

/** The left panel of a project page: the work itself, framed, with a switcher under it. */
export function Stage({ project }: { project: Project }) {
  const media = project.media ?? [];
  const views: View[] = project.views ?? [];
  const [index, setIndex] = useState(project.viewStyle === "compare" ? views.length - 1 : 0);
  const view = views[index];
  const layout = view?.layout ?? project.layout ?? "landing";
  const current = media[index];

  const switcher = media.length > 1 ? media.map((m) => m.label) : views.map((v) => v.label);

  return (
    <div className="relative isolate h-full overflow-hidden rounded-[16px] bg-stage shadow-stage [container-type:size]">
      <Glow accent={project.accent} />

      {media.length === 0 && (
        <p className="absolute inset-x-0 top-6 text-center text-[13px] leading-[19.5px] text-muted">{statusLine(project)}</p>
      )}

      <div className="absolute inset-0 flex items-center justify-center pb-[52px] pt-[44px] lg:pb-[60px]">
        {project.frame === "phone" ? (
          <PhoneFrame>
            {current ? <MediaView media={current} /> : <PhoneScreen key={index} layout={layout} accent={project.accent} />}
          </PhoneFrame>
        ) : project.frame === "browser" ? (
          <BrowserFrame url={project.url ?? project.slug}>
            {current ? (
              <MediaView media={current} />
            ) : (
              <BrowserScreen key={index} layout={layout} accent={project.accent} dated={view?.dated} />
            )}
          </BrowserFrame>
        ) : (
          <CodeCard />
        )}
      </div>

      {switcher.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center lg:bottom-7">
          <Segmented
            items={switcher}
            value={index}
            onChange={setIndex}
            numbered={project.viewStyle === "steps"}
            label={`${project.title} screens`}
          />
        </div>
      )}
    </div>
  );
}

function Glow({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-90 dark:opacity-50"
      style={{
        background: `radial-gradient(42% 46% at 26% 30%, ${tint(accent, 34)}, transparent 72%), radial-gradient(40% 44% at 78% 76%, ${tint(accent, 26)}, transparent 72%)`,
        filter: "blur(24px)",
      }}
    />
  );
}

function statusLine(project: Project) {
  if (project.status === "in progress") return "In progress · screens coming soon";
  if (project.status === "unreleased") return "Unreleased · screens coming soon";
  if (project.status === "concept") return "Concept · screens coming soon";
  if (project.frame === "none") return "You're looking at it";
  return "Screens coming soon";
}

function MediaView({ media }: { media: Media }) {
  if (media.kind === "video") {
    return <video src={media.src} className="h-full w-full object-cover" autoPlay muted loop playsInline />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.src} alt={media.label} className="h-full w-full object-cover object-top" />;
}

/* ---------- Frames ---------- */

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-[12px] bg-card shadow-media"
      style={{ width: "min(874px, calc(100cqw - 32px), calc((100cqh - 112px) * 1.48))" }}
    >
      <div className="flex h-9 items-center gap-3 border-b border-line px-3.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[9px] rounded-full bg-[var(--skeleton)]" />
          ))}
        </div>
        <div className="mx-auto max-w-[60%] truncate rounded-md bg-fill px-3 py-[3px] text-[11px] text-muted">{url}</div>
        <div className="w-[39px]" />
      </div>
      <div className="aspect-[16/10] w-full overflow-hidden bg-card">{children}</div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative aspect-[9/19] rounded-[44px] bg-[#121217] p-[7px] shadow-media"
      style={{ height: "min(705px, calc(100cqh - 112px))" }}
    >
      <div className="absolute left-1/2 top-[15px] z-10 h-[22px] w-[72px] -translate-x-1/2 rounded-full bg-[#121217]" />
      <div className="h-full w-full overflow-hidden rounded-[37px] bg-card">{children}</div>
    </div>
  );
}

/* ---------- Placeholder screens ---------- */

function Bar({ w, h = 7, color, className = "" }: { w: string | number; h?: number; color?: string; className?: string }) {
  return (
    <div
      className={`shrink-0 rounded-full ${className}`}
      style={{ width: w, height: h, background: color ?? "var(--skeleton)" }}
    />
  );
}

function Box({ className = "", color, children }: { className?: string; color?: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-[10px] ${className}`} style={{ background: color ?? "var(--skeleton)" }}>
      {children}
    </div>
  );
}

function Nav({ a, dated }: { a: string; dated?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-[5%] py-[2.4%]"
      style={dated ? { background: a } : undefined}
    >
      <Bar w="12%" h={10} color={dated ? "rgba(255,255,255,.9)" : tint(a, 80)} />
      <div className="flex gap-[6%]" style={{ width: "34%" }}>
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} w="25%" h={6} color={dated ? "rgba(255,255,255,.55)" : undefined} />
        ))}
      </div>
      <div
        className={dated ? "rounded-none" : "rounded-full"}
        style={{ width: "10%", height: 18, background: dated ? "#fff" : "var(--ink)" }}
      />
    </div>
  );
}

function BrowserScreen({ layout, accent: a, dated }: { layout: Layout; accent: string; dated?: boolean }) {
  return (
    <div className="fade-in h-full w-full text-[0px]">
      {layout === "dashboard" && (
        <div className="grid h-full grid-cols-[7%_1fr]">
          <div className="flex flex-col items-center gap-3 border-r border-line py-4">
            <div className="size-4 rounded-[5px]" style={{ background: a }} />
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="size-3 rounded-[4px]" style={{ background: i === 0 ? tint(a, 35) : "var(--skeleton)" }} />
            ))}
          </div>
          <div className="flex flex-col gap-[3.2%] p-[3.5%]">
            <div className="flex items-center justify-between">
              <Bar w="22%" h={11} />
              <div className="size-5 rounded-full bg-[var(--skeleton)]" />
            </div>
            <div className="grid grid-cols-3 gap-[2.5%]">
              {[60, 35, 20].map((p) => (
                <div key={p} className="flex flex-col gap-2 rounded-[10px] border border-line p-[7%]">
                  <Bar w="45%" h={5} />
                  <Bar w="65%" h={12} color={tint(a, p + 30)} />
                </div>
              ))}
            </div>
            <div className="relative flex-1 rounded-[10px] border border-line">
              <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-[8%] h-[84%] w-[84%]">
                <path d="M0 80 C 40 70, 60 30, 100 45 S 170 85, 210 40 S 270 20, 300 10" fill="none" stroke={a} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <path d="M0 80 C 40 70, 60 30, 100 45 S 170 85, 210 40 S 270 20, 300 10 V 100 H 0 Z" fill={tint(a, 12)} />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-4 rounded-full bg-[var(--skeleton)]" />
                  <Bar w="30%" h={6} />
                  <Bar w="14%" h={6} className="ml-auto" color={tint(a, 30)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {layout === "table" && (
        <div className="flex h-full flex-col gap-[3%] p-[4%]">
          <div className="flex items-center justify-between">
            <Bar w="24%" h={11} />
            <div className="h-[18px] w-[12%] rounded-full" style={{ background: a }} />
          </div>
          <div className="flex gap-2">
            {[14, 10, 12, 9].map((w, i) => (
              <Bar key={i} w={`${w}%`} h={16} color={i === 0 ? tint(a, 22) : undefined} />
            ))}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden rounded-[10px] border border-line">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-1 items-center gap-[3%] border-b border-line px-[3%] last:border-0">
                <div className="size-4 shrink-0 rounded-full bg-[var(--skeleton)]" />
                <Bar w="20%" h={6} />
                <Bar w="16%" h={6} />
                <Bar w="12%" h={6} />
                <Bar w="10%" h={12} className="ml-auto" color={tint(a, i % 3 === 0 ? 35 : 14)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === "lesson" && (
        <div className="grid h-full grid-cols-[1fr_30%] gap-[3%] p-[3.5%]">
          <div className="flex flex-col gap-[4%]">
            <Box className="relative flex flex-1 items-center justify-center" color={tint(a, 18)}>
              <div className="grid size-10 place-items-center rounded-full bg-card shadow-card">
                <div className="ml-0.5 size-0 border-y-[6px] border-l-[10px] border-y-transparent" style={{ borderLeftColor: a }} />
              </div>
            </Box>
            <div className="flex items-center gap-3">
              <Bar w="40%" h={9} />
              <Bar w="18%" h={6} className="ml-auto" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[10px] border border-line p-[8%]">
            {[70, 55, 80, 45].map((w, i) => (
              <div key={i} className={`flex ${i % 2 ? "justify-end" : ""}`}>
                <div className="rounded-[8px] px-2 py-1.5" style={{ width: `${w}%`, background: i % 2 ? tint(a, 25) : "var(--skeleton)" }}>
                  <Bar w="80%" h={4} color="rgba(255,255,255,.6)" />
                </div>
              </div>
            ))}
            <Bar w="100%" h={18} className="mt-auto" />
          </div>
        </div>
      )}

      {layout === "landing" && (
        <div className="flex h-full flex-col">
          <Nav a={a} dated={dated} />
          {dated ? (
            <div className="flex flex-1 flex-col gap-[4%] px-[5%] pt-[4%]">
              <div className="flex items-center gap-[5%]">
                <div className="flex flex-1 flex-col gap-2.5">
                  <Bar w="85%" h={16} color={tint(a, 80)} className="rounded-none" />
                  <Bar w="60%" h={16} color={tint(a, 80)} className="rounded-none" />
                  <Bar w="70%" h={6} />
                  <div className="mt-2 h-[22px] w-[34%]" style={{ background: a }} />
                </div>
                <div className="aspect-[4/3] w-[42%]" style={{ background: tint(a, 30) }} />
              </div>
              <div className="grid grid-cols-4 gap-[2%]">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square border border-line" style={{ background: i % 2 ? tint(a, 12) : undefined }} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center gap-[3.5%] px-[8%] pt-[5%]">
              <Bar w={84} h={14} color={tint(a, 20)} />
              <Bar w="58%" h={22} color="var(--ink)" className="opacity-85" />
              <Bar w="40%" h={22} color="var(--ink)" className="opacity-85" />
              <Bar w="46%" h={6} />
              <div className="flex gap-2">
                <div className="h-[22px] w-[86px] rounded-full" style={{ background: a }} />
                <div className="h-[22px] w-[86px] rounded-full border border-line" />
              </div>
              <div className="mt-auto grid w-full grid-cols-3 gap-[2.5%]">
                {[30, 18, 10].map((p) => (
                  <div key={p} className="aspect-[4/3] rounded-t-[12px]" style={{ background: tint(a, p) }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {layout === "shop" && (
        <div className="flex h-full flex-col">
          <Nav a={a} dated={dated} />
          {dated && <div className="mx-[5%] mt-[2%] h-[16%]" style={{ background: `linear-gradient(90deg, ${a}, ${tint(a, 40)})` }} />}
          <div className="flex gap-2 px-[5%] py-[2.5%]">
            {[11, 9, 13, 8, 10].map((w, i) => (
              <Bar key={i} w={`${w}%`} h={dated ? 12 : 16} color={i === 0 ? tint(a, dated ? 60 : 22) : undefined} className={dated ? "rounded-none" : ""} />
            ))}
          </div>
          <div className={`grid flex-1 gap-[2%] px-[5%] pb-[4%] ${dated ? "grid-cols-3" : "grid-cols-4"}`}>
            {Array.from({ length: dated ? 3 : 8 }, (_, i) => (
              <div key={i} className={`flex flex-col gap-1.5 ${dated ? "border border-line p-[5%]" : ""}`}>
                <div
                  className={`flex-1 ${dated ? "" : "rounded-[10px]"}`}
                  style={{ background: tint(a, [22, 12, 30, 16][i % 4]) }}
                />
                <Bar w="70%" h={5} />
                <Bar w="30%" h={dated ? 10 : 6} color={dated ? a : "var(--ink)"} className={dated ? "rounded-none" : "opacity-70"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === "report" && (
        <div className="flex h-full justify-center bg-fill pt-[4%]">
          <div className="flex w-[68%] flex-col gap-[3%] rounded-t-[8px] bg-card p-[5%] shadow-card">
            <Bar w={60} h={6} color={tint(a, 50)} />
            <Bar w="70%" h={16} />
            <div className="flex flex-col gap-1.5">
              {["100%", "96%", "88%"].map((w) => (
                <Bar key={w} w={w} h={5} />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-[3%]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="aspect-[9/16] rounded-[8px] border border-line p-[10%]">
                    <Bar w="60%" h={4} />
                    <div className="mt-[20%] aspect-[4/3] rounded-[4px]" style={{ background: tint(a, 18 + i * 6) }} />
                  </div>
                  <Bar w="70%" h={4} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              {["94%", "100%", "62%"].map((w) => (
                <Bar key={w} w={w} h={5} />
              ))}
            </div>
          </div>
        </div>
      )}

      {layout === "archive" && (
        <div className="flex h-full flex-col gap-[3%] p-[4%]" style={{ background: tint(a, 6) }}>
          <div className="flex items-center justify-between border-b border-line pb-[2%]">
            {["1991", "1999", "2004", "2014", "2022", "2024"].map((y, i) => (
              <span key={y} className="text-[11px] tabular-nums" style={{ color: i === 3 ? a : "var(--muted)" }}>
                {y}
              </span>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-4 grid-rows-2 gap-[2%]">
            {[35, 18, 26, 12, 22, 40, 15, 28].map((p, i) => (
              <div
                key={i}
                className={`rounded-[6px] ${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 5 ? "row-span-1" : ""}`}
                style={{ background: tint(a, p), filter: "saturate(.6)" }}
              />
            ))}
          </div>
        </div>
      )}

      {layout === "search" && (
        <div className="flex h-full flex-col gap-[3%] p-[4%]">
          <div className="flex items-center gap-2 rounded-[12px] border border-line px-3 py-2.5 shadow-card">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="4.75" stroke="var(--muted)" strokeWidth="1.6" />
              <path d="m10.5 10.5 3 3" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] text-ink">free icons</span>
            <span className="h-3 w-px animate-pulse bg-ink" />
          </div>
          <div className="flex gap-1.5">
            {["icons", "free", "open source"].map((c, i) => (
              <span key={c} className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: i ? "var(--fill)" : tint(a, 20), color: i ? "var(--muted)" : a }}>
                {c}
              </span>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-3 gap-[2.5%]">
            {[24, 14, 30, 12, 20, 16].map((p, i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-[10px] border border-line p-[5%]">
                <div className="flex-1 rounded-[6px]" style={{ background: tint(a, p) }} />
                <Bar w="60%" h={5} />
                <Bar w="85%" h={4} />
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === "chat" && (
        <div className="flex h-full flex-col gap-2.5 px-[18%] py-[4%]" style={{ background: tint(a, 6) }}>
          {[
            { me: true, w: 46 },
            { me: false, w: 62, card: true },
            { me: true, w: 34 },
            { me: false, w: 52 },
          ].map((m, i) => (
            <div key={i} className={`flex ${m.me ? "justify-end" : ""}`}>
              <div
                className="flex flex-col gap-1.5 rounded-[12px] px-2.5 py-2 shadow-card"
                style={{ width: `${m.w}%`, background: m.me ? tint(a, 30) : "var(--card)" }}
              >
                <Bar w="85%" h={5} color={m.me ? "rgba(255,255,255,.75)" : undefined} />
                <Bar w="55%" h={5} color={m.me ? "rgba(255,255,255,.75)" : undefined} />
                {m.card && (
                  <div className="mt-1 flex gap-1">
                    {[22, 14, 10].map((p) => (
                      <span key={p} className="h-3 w-[22%] rounded-full" style={{ background: tint(a, p + 10) }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="mt-auto h-6 rounded-full bg-card shadow-card" />
        </div>
      )}

      {layout === "extension" && (
        <div className="relative h-full">
          <div className="flex flex-col gap-[3%] p-[5%] opacity-60">
            <Bar w="40%" h={16} />
            <Bar w="70%" h={6} />
            <Bar w="62%" h={6} />
            <Box className="mt-2 aspect-[16/6] w-[60%]" />
          </div>
          <div className="absolute right-[3%] top-[3%] flex w-[34%] flex-col gap-2 rounded-[12px] bg-card p-[3%] shadow-media">
            <div className="flex items-center gap-2">
              <div className="size-3.5 rounded-[4px]" style={{ background: a }} />
              <Bar w="40%" h={7} />
            </div>
            <Box className="aspect-[16/9]" color={tint(a, 16)} />
            <Bar w="80%" h={5} />
            <div className="flex flex-wrap gap-1">
              {[18, 12, 24].map((p) => (
                <span key={p} className="h-3 w-[26%] rounded-full" style={{ background: tint(a, p) }} />
              ))}
            </div>
            <div className="h-5 rounded-[8px]" style={{ background: a }} />
          </div>
        </div>
      )}

      {layout === "library" && (
        <div className="grid h-full grid-cols-[22%_1fr]">
          <div className="flex flex-col gap-2.5 border-r border-line p-[12%]">
            <Bar w="60%" h={10} color={tint(a, 70)} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Bar key={i} w={`${50 + ((i * 17) % 40)}%`} h={6} color={i === 1 ? tint(a, 35) : undefined} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[2.5%] p-[3.5%]">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-[10px] border border-line p-[7%]">
                <Bar w="55%" h={7} />
                <Bar w="95%" h={4} />
                <Bar w="85%" h={4} />
                <Bar w="70%" h={4} />
                <span className="mt-auto h-3 w-[38%] rounded-full" style={{ background: tint(a, 14 + (i % 3) * 8) }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneScreen({ layout, accent: a }: { layout: Layout; accent: string }) {
  return (
    <div className="fade-in flex h-full flex-col gap-4 px-5 pb-6 pt-14">
      {layout === "app" && (
        <>
          <div className="flex items-center justify-between">
            <Bar w="45%" h={12} />
            <div className="size-7 rounded-full bg-[var(--skeleton)]" />
          </div>
          <Box className="grid aspect-[4/3] grid-cols-4 grid-rows-3 gap-1 p-3" color={tint(a, 14)}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="rounded-[3px]" style={{ background: i < 7 ? tint(a, 70) : "var(--card)" }} />
            ))}
          </Box>
          <div className="flex flex-col gap-3">
            {[true, true, false, false].map((done, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="grid size-4 place-items-center rounded-full" style={{ background: done ? a : "var(--skeleton)" }} />
                <Bar w={`${55 - i * 6}%`} h={6} />
              </div>
            ))}
          </div>
          <div className="mt-auto h-11 rounded-[14px]" style={{ background: a }} />
        </>
      )}

      {layout === "wallet" && (
        <>
          <Bar w="35%" h={6} />
          <Bar w="62%" h={20} color="var(--ink)" className="opacity-85" />
          <div
            className="aspect-[1.6] rounded-[16px] p-4"
            style={{ background: `linear-gradient(135deg, ${a}, color-mix(in oklab, ${a} 55%, black))` }}
          >
            <Bar w="30%" h={6} color="rgba(255,255,255,.7)" />
          </div>
          <div className="flex justify-between px-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="size-10 rounded-full" style={{ background: i === 0 ? tint(a, 25) : "var(--skeleton)" }} />
            ))}
          </div>
          <div className="flex flex-col gap-3.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-8 rounded-[10px] bg-[var(--skeleton)]" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Bar w="60%" h={6} />
                  <Bar w="35%" h={5} />
                </div>
                <Bar w="18%" h={6} />
              </div>
            ))}
          </div>
        </>
      )}

      {layout === "tracker" && (
        <>
          <Bar w="50%" h={12} />
          <div className="flex justify-center py-2">
            <svg viewBox="0 0 120 120" className="w-[64%]">
              {[50, 38, 26].map((r, i) => (
                <g key={r}>
                  <circle cx="60" cy="60" r={r} fill="none" stroke="var(--skeleton)" strokeWidth="9" />
                  <circle
                    cx="60"
                    cy="60"
                    r={r}
                    fill="none"
                    stroke={i === 0 ? a : tint(a, 70 - i * 20)}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * r * [0.72, 0.55, 0.85][i]} 999`}
                    transform="rotate(-90 60 60)"
                  />
                </g>
              ))}
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[22, 12, 12, 22].map((p, i) => (
              <Box key={i} className="flex aspect-[1.4] flex-col justify-end gap-1.5 p-3" color={tint(a, p)}>
                <Bar w="40%" h={10} color="var(--card)" />
                <Bar w="65%" h={5} color="var(--card)" />
              </Box>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CodeCard() {
  const lines = [
    ["const", " site = {"],
    ["  design", ': "Figma",'],
    ["  build", ': ["Next.js", "Tailwind"],'],
    ["  content", ': "my knowledge base",'],
    ["  pair", ': "Claude Code",'],
    ["  pages", ': "one screen each",'],
    ["", "};"],
  ];
  return (
    <div className="w-[min(520px,calc(100cqw-32px))] rounded-[12px] bg-card p-6 font-mono text-[13px] leading-7 shadow-media">
      {lines.map(([k, v], i) => (
        <div key={i} className="whitespace-pre">
          <span className="text-faint">{String(i + 1).padStart(2, " ")} </span>
          <span className="text-ink">{k}</span>
          <span className="text-muted">{v}</span>
        </div>
      ))}
    </div>
  );
}

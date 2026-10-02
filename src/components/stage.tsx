"use client";

import { useState } from "react";
import type { Project } from "@/content/projects";

/** The centre panel: real media when the project has it, a framed placeholder otherwise. */
export function Stage({ project }: { project: Project }) {
  const media = project.media ?? [];
  const [index, setIndex] = useState(0);
  const current = media[index];

  return (
    <div className="dot-grid relative flex h-full min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[14px] border border-line bg-panel p-6 lg:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          background: `radial-gradient(60% 50% at 50% 55%, color-mix(in oklab, ${project.accent} 22%, transparent), transparent 70%)`,
        }}
      />

      <div className="relative flex w-full flex-1 items-center justify-center">
        {project.frame === "phone" ? (
          <PhoneFrame project={project}>{current && <MediaView media={current} />}</PhoneFrame>
        ) : project.frame === "browser" ? (
          <BrowserFrame project={project}>{current && <MediaView media={current} />}</BrowserFrame>
        ) : (
          <CodeCard />
        )}
      </div>

      {media.length > 1 && (
        <div className="relative mt-6 flex gap-1 rounded-full border border-line bg-raised p-1 shadow-card">
          {media.map((m, i) => (
            <button
              key={m.src}
              onClick={() => setIndex(i)}
              className={`rounded-full px-3 py-1 text-[13px] transition-colors ${
                i === index ? "bg-ink text-paper" : "text-muted hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MediaView({ media }: { media: NonNullable<Project["media"]>[number] }) {
  if (media.kind === "video") {
    return <video src={media.src} className="h-full w-full object-cover" autoPlay muted loop playsInline />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.src} alt={media.label} className="h-full w-full object-cover object-top" />;
}

function BrowserFrame({ project, children }: { project: Project; children?: React.ReactNode }) {
  return (
    <div className="w-full max-w-[780px] overflow-hidden rounded-[12px] border border-line-strong bg-raised shadow-card">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-line-strong" />
          ))}
        </div>
        <div className="mx-auto rounded-md bg-paper px-3 py-1 font-mono text-[11px] text-muted">
          {project.url ?? project.slug}
        </div>
        <div className="w-[42px]" />
      </div>
      <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">{children ?? <BrowserSkeleton project={project} />}</div>
    </div>
  );
}

function PhoneFrame({ project, children }: { project: Project; children?: React.ReactNode }) {
  return (
    <div className="relative aspect-[9/19] h-[min(560px,62svh)] rounded-[44px] border border-line-strong bg-raised p-2.5 shadow-card">
      <div className="absolute left-1/2 top-4 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div className="h-full w-full overflow-hidden rounded-[34px] bg-paper">
        {children ?? <PhoneSkeleton project={project} />}
      </div>
    </div>
  );
}

const tint = (accent: string, pct: number) => `color-mix(in oklab, ${accent} ${pct}%, transparent)`;

function Bar({ w, h = 8, accent, pct = 0 }: { w: string; h?: number; accent?: string; pct?: number }) {
  return (
    <div
      className="rounded-full"
      style={{ width: w, height: h, background: accent && pct ? tint(accent, pct) : "var(--line-strong)" }}
    />
  );
}

function BrowserSkeleton({ project }: { project: Project }) {
  const a = project.accent;
  return (
    <div className="flex h-full flex-col gap-3 p-[6%] sm:gap-5">
      <div className="flex items-center justify-between">
        <Bar w="18%" h={10} accent={a} pct={70} />
        <div className="flex gap-3">
          <Bar w="44px" />
          <Bar w="44px" />
          <Bar w="44px" />
        </div>
      </div>
      <div className="mt-[4%] flex flex-col gap-3">
        <Bar w="62%" h={18} />
        <Bar w="44%" h={18} />
        <Bar w="36%" h={8} />
      </div>
      <div className="mt-auto grid grid-cols-3 gap-3">
        {[40, 25, 15].map((p) => (
          <div key={p} className="aspect-[4/3] rounded-lg" style={{ background: tint(a, p) }} />
        ))}
      </div>
      <p className="label text-center">{statusLine(project)}</p>
    </div>
  );
}

function PhoneSkeleton({ project }: { project: Project }) {
  const a = project.accent;
  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-6 pt-14">
      <Bar w="50%" h={14} />
      <div className="aspect-[4/3] rounded-2xl" style={{ background: tint(a, 35) }} />
      <div className="flex flex-col gap-2.5">
        <Bar w="80%" />
        <Bar w="60%" />
      </div>
      {[22, 14].map((p) => (
        <div key={p} className="h-14 rounded-xl" style={{ background: tint(a, p) }} />
      ))}
      <p className="label mt-auto text-center">{statusLine(project)}</p>
    </div>
  );
}

function statusLine(project: Project) {
  if (project.status === "in progress") return "In progress";
  if (project.status === "unreleased") return "Unreleased · screens soon";
  return "Screens soon";
}

function CodeCard() {
  const lines = [
    ["const", " site = {"],
    ["  design", ': "Figma",'],
    ["  build", ': ["Next.js", "Tailwind"],'],
    ["  content", ': "my knowledge base",'],
    ["  pair", ': "Claude Code",'],
    ["", "};"],
  ];
  return (
    <div className="w-full max-w-[520px] rounded-[12px] border border-line-strong bg-raised p-6 font-mono text-[13px] leading-7 shadow-card">
      {lines.map(([k, v], i) => (
        <div key={i}>
          <span className="text-muted">{String(i + 1).padStart(2, " ")} </span>
          <span className="text-signal">{k}</span>
          <span className="text-ink-2">{v}</span>
        </div>
      ))}
    </div>
  );
}

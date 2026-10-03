"use client";

import { useEffect, useRef, useState } from "react";
import { groups, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { Avatar, Monogram, ProjectIcon } from "./project-icon";

type Props = {
  active: string;
  onJump: (id: string) => void;
  className?: string;
};

const tabClass = (on: boolean) =>
  `flex h-[35px] w-full items-center gap-2.5 rounded-[12px] px-2.5 text-left text-[14px] leading-[21px] text-ink transition-[background-color,box-shadow] duration-150 ${
    on ? "bg-card shadow-control" : "hover:bg-fill-hover"
  }`;

/** Projects as tabs, grouped by who they were for. */
export function Sidebar({ active, onJump, className = "" }: Props) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const navRef = useRef<HTMLElement>(null);

  // Keep the current tab in view when the list is taller than the screen.
  useEffect(() => {
    navRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Load-in order for the roll-up animation.
  let order = 0;
  const reel = () => ({ className: "reel", style: { "--i": order++ } as React.CSSProperties });

  return (
    <aside className={`flex h-full w-[240px] flex-col p-2 ${className}`}>
      <nav ref={navRef} aria-label="Projects" className="flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar">
        <div {...reel()} className="reel pb-3">
          <button
            data-tab="home"
            aria-current={active === "home" ? "page" : undefined}
            className={tabClass(active === "home")}
            onClick={() => onJump("home")}
          >
            <Monogram size={18} />
            Home
          </button>
        </div>

        {groups.map((g, gi) => {
          const items = projects.filter((p) => p.group === g.id);
          const isClosed = closed[g.id];
          return (
            <div key={g.id} className={gi ? "pt-3" : ""}>
              <button
                {...reel()}
                onClick={() => setClosed((c) => ({ ...c, [g.id]: !c[g.id] }))}
                className="reel flex w-full items-center justify-between rounded-[8px] px-2.5 py-[5px] text-[12px] font-medium leading-[18px] text-muted transition-colors hover:text-ink"
                aria-expanded={!isClosed}
              >
                {g.label}
                <Chevron className={`transition-transform duration-200 ${isClosed ? "-rotate-90" : ""}`} />
              </button>
              {!isClosed &&
                items.map((p) => (
                  <div key={p.slug} {...reel()} className="reel pt-1">
                    <button
                      data-tab={p.slug}
                      aria-current={active === p.slug ? "page" : undefined}
                      className={tabClass(active === p.slug)}
                      onClick={() => onJump(p.slug)}
                    >
                      <ProjectIcon project={p} size={18} />
                      <span className="min-w-0 flex-1 truncate">{p.title}</span>
                      {p.status === "in progress" && (
                        <span className="size-1.5 rounded-full bg-[#f97316]" title="In progress" />
                      )}
                    </button>
                  </div>
                ))}
            </div>
          );
        })}
        <div className="h-6 shrink-0" />
      </nav>

      <button
        {...reel()}
        onClick={() => onJump("about")}
        aria-current={active === "about" ? "page" : undefined}
        className={`reel flex h-[52px] w-full shrink-0 items-center gap-3 rounded-[14px] p-2 text-left transition-[background-color,box-shadow] duration-150 ${
          active === "about" ? "bg-card shadow-control" : "hover:bg-fill-hover"
        }`}
      >
        <Avatar size={36} />
        <span className="flex flex-col gap-1">
          <span className="text-[14px] font-medium leading-[14px]">{profile.name}</span>
          <span className="text-[12px] leading-[12px] text-ink-3">{profile.role}</span>
        </span>
      </button>
    </aside>
  );
}

export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="m4 5.5 3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

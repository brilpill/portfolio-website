"use client";

import Link from "next/link";
import { useState } from "react";
import { groups, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { LibraryIcon } from "./library/icons";
import { itemClass } from "./nav-item";
import { Monogram, ProjectIcon } from "./project-icon";
import { SearchIcon } from "./sections";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  active: string;
  onJump: (id: string) => void;
  onSearch: () => void;
};

export function Sidebar({ active, onJump, onSearch }: Props) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col p-2 lg:flex">
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto no-scrollbar">
        <button className={itemClass(active === "home")} onClick={() => onJump("home")}>
          <Monogram size={14} />
          Home
        </button>
        <button className={itemClass(false)} onClick={onSearch}>
          <span className="grid w-[22px] place-items-center">
            <SearchIcon />
          </span>
          <span className="flex-1">Search</span>
          <kbd className="font-mono text-[11px] text-muted">⌘K</kbd>
        </button>

        {groups.map((g) => {
          const items = projects.filter((p) => p.group === g.id);
          const isClosed = closed[g.id];
          return (
            <div key={g.id} className="mt-3 flex flex-col gap-0.5">
              <button
                onClick={() => setClosed((c) => ({ ...c, [g.id]: !c[g.id] }))}
                className="group flex items-center justify-between px-2.5 py-1.5"
                aria-expanded={!isClosed}
              >
                <span className="label">{g.label}</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className={`text-muted opacity-0 transition-[opacity,rotate] duration-200 group-hover:opacity-100 ${isClosed ? "-rotate-90" : ""}`}
                  aria-hidden
                >
                  <path d="m2 3.5 3 3 3-3" stroke="currentColor" strokeWidth="1.3" fill="none" />
                </svg>
              </button>
              {!isClosed &&
                items.map((p) => (
                  <button key={p.slug} className={itemClass(active === p.slug)} onClick={() => onJump(p.slug)}>
                    <ProjectIcon project={p} size={18} />
                    <span className="flex-1 truncate">{p.title}</span>
                    {p.status === "in progress" && <span className="size-1.5 rounded-full bg-signal" title="In progress" />}
                  </button>
                ))}
            </div>
          );
        })}

        <div className="mt-3 flex flex-col gap-0.5">
          <span className="label px-2.5 py-1.5">More</span>
          <button className={itemClass(active === "about")} onClick={() => onJump("about")}>
            <span className="grid size-[18px] place-items-center rounded-[6px] border border-line-strong font-mono text-[10px]">
              i
            </span>
            About & CV
          </button>
          <Link href="/library" className={itemClass(false)}>
            <LibraryIcon />
            Library
          </Link>
        </div>
      </nav>

      <div className="flex items-center gap-2.5 px-2 pt-3">
        <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-[12px] font-semibold text-paper">
          OB
        </span>
        <div className="flex-1 leading-tight">
          <div className="text-[14px] font-medium">{profile.name}</div>
          <div className="text-[12px] text-muted">{profile.role}</div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

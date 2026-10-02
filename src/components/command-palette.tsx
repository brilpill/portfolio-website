"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { groupLabel, projects, type Project } from "@/content/projects";
import { profile } from "@/content/profile";
import { Avatar, Monogram, ProjectIcon } from "./project-icon";
import { SearchIcon } from "./sections";

type Entry = {
  id: string;
  title: string;
  hint: string;
  section: "Pages" | "Actions";
  project?: Project;
  icon?: React.ReactNode;
};

const entries: Entry[] = [
  { id: "home", title: "Home", hint: "Start here", section: "Pages", icon: <Monogram size={22} /> },
  ...projects.map<Entry>((p) => ({
    id: p.slug,
    title: p.title,
    hint: `${groupLabel(p.group)} · ${p.tagline}`,
    section: "Pages",
    project: p,
  })),
  { id: "about", title: "About & CV", hint: "Experience, education, tools", section: "Pages", icon: <Avatar size={22} /> },
  { id: "action:settings", title: "Settings", hint: "Turn pages or scroll freely", section: "Actions", icon: <Glyph>⚙︎</Glyph> },
  { id: "action:email", title: "Copy email address", hint: profile.email, section: "Actions", icon: <Glyph>@</Glyph> },
];

export function CommandPalette({
  onClose,
  onJump,
  onSettings,
}: {
  onClose: () => void;
  onJump: (id: string) => void;
  onSettings: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => `${e.title} ${e.hint} ${e.project?.client ?? ""}`.toLowerCase().includes(q));
  }, [query]);

  // The palette is mounted only while open, so state starts fresh each time.
  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const choose = (e?: Entry) => {
    if (!e) return;
    onClose();
    if (e.id === "action:settings") onSettings();
    else if (e.id === "action:email") navigator.clipboard?.writeText(profile.email).catch(() => {});
    else onJump(e.id);
  };

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/15 px-4 pt-[14vh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="pop-in w-full max-w-[560px] overflow-hidden rounded-[20px] bg-card shadow-pop"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setCursor((c) => Math.min(c + 1, results.length - 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
          }
          if (e.key === "Enter") choose(results[cursor]);
        }}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3.5">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Find a project, client or industry…"
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="rounded-[6px] bg-fill px-1.5 py-0.5 font-sans text-[11px] font-medium text-faint">esc</kbd>
        </div>
        <ul ref={listRef} className="max-h-[min(420px,60vh)] overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-8 text-center text-[14px] text-muted">Nothing matches.</li>}
          {results.map((e, i) => (
            <li key={e.id}>
              {(i === 0 || results[i - 1].section !== e.section) && (
                <div className="px-3 pb-1 pt-2.5 text-[12px] font-medium text-muted">{e.section}</div>
              )}
              <button
                data-index={i}
                onMouseMove={() => setCursor(i)}
                onClick={() => choose(e)}
                className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left ${i === cursor ? "bg-fill" : ""}`}
              >
                {e.project ? <ProjectIcon project={e.project} size={22} /> : e.icon}
                <span className="shrink-0 text-[14px] text-ink">{e.title}</span>
                <span className="ml-auto truncate pl-4 text-[12px] text-muted">{e.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 border-t border-line px-4 py-2.5 text-[12px] text-muted">
          <span>↑ ↓ to move</span>
          <span>↵ to open</span>
        </div>
      </div>
    </div>
  );
}

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className="grid size-[22px] shrink-0 place-items-center rounded-[5px] bg-fill text-[12px] text-ink-3">
      {children}
    </span>
  );
}

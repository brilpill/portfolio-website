"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { groups, projects } from "@/content/projects";
import { ProjectIcon } from "./project-icon";
import { SearchIcon } from "./sections";

/** A section on this page, or (with `href`) another page. */
type Entry = { id: string; title: string; hint: string; href?: string; project?: (typeof projects)[number] };

const entries: Entry[] = [
  { id: "home", title: "Home", hint: "Start" },
  ...projects.map((p) => ({
    id: p.slug,
    title: p.title,
    hint: `${groups.find((g) => g.id === p.group)?.label} · ${p.tagline}`,
    project: p,
  })),
  { id: "about", title: "About & CV", hint: "Experience, education, tools" },
  { id: "library", title: "Library", hint: "Tools, references and kits I keep", href: "/library" },
];

export function CommandPalette({
  onClose,
  onJump,
}: {
  onClose: () => void;
  onJump: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => `${e.title} ${e.hint} ${e.project?.client ?? ""}`.toLowerCase().includes(q));
  }, [query]);

  // The palette is mounted only while open, so state starts fresh each time.
  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const router = useRouter();
  const choose = (e?: Entry) => {
    if (!e) return;
    if (e.href) router.push(e.href);
    else onJump(e.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 px-4 pt-[14vh] backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Jump to a project"
        className="rise w-full max-w-[520px] overflow-hidden rounded-2xl border border-line-strong bg-raised shadow-card"
        style={{ animationDuration: "0.35s" }}
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
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Search projects…"
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">esc</kbd>
        </div>
        <ul className="max-h-[360px] overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-6 text-center text-[14px] text-muted">Nothing matches.</li>}
          {results.map((e, i) => (
            <li key={e.id}>
              <button
                onMouseMove={() => setCursor(i)}
                onClick={() => choose(e)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${i === cursor ? "bg-line" : ""}`}
              >
                {e.project ? (
                  <ProjectIcon project={e.project} size={22} />
                ) : (
                  <span className="grid size-[22px] place-items-center rounded-[6px] border border-line-strong font-mono text-[10px] text-muted">
                    {e.title.charAt(0)}
                  </span>
                )}
                <span className="text-[14px]">{e.title}</span>
                <span className="ml-auto truncate pl-4 text-[12px] text-muted">{e.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

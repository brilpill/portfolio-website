"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { HUES, SHELVES, searchText, subjectLabel, type Card } from "@/lib/library";
import { itemClass } from "../nav-item";
import { SearchIcon } from "../sections";
import { LibraryCard } from "./card";
import { Count, MobileBar, RailGroup, SidebarFrame } from "./frame";
import { LibraryIcon, ShelfDot } from "./icons";

type Theme = "any" | "light" | "dark";
type Filters = {
  shelf: string | null;
  subject: string | null;
  colour: string | null;
  theme: Theme;
  using: boolean;
  q: string;
};
type Facet = Exclude<keyof Filters, "q">;

const EMPTY: Filters = { shelf: null, subject: null, colour: null, theme: "any", using: false, q: "" };

/** Cards are added in pages as you scroll, so the first paint is ~36 pictures, not 600. */
const PAGE = 36;
const SUBJECTS_SHOWN = 12;

function read(search: string): Filters {
  const p = new URLSearchParams(search);
  const theme = p.get("theme");
  return {
    shelf: p.get("shelf"),
    subject: p.get("subject"),
    colour: p.get("colour"),
    theme: theme === "light" || theme === "dark" ? theme : "any",
    using: p.get("using") === "1",
    q: p.get("q") ?? "",
  };
}

function write(f: Filters): string {
  const p = new URLSearchParams();
  if (f.shelf) p.set("shelf", f.shelf);
  if (f.subject) p.set("subject", f.subject);
  if (f.colour) p.set("colour", f.colour);
  if (f.theme !== "any") p.set("theme", f.theme);
  if (f.using) p.set("using", "1");
  // untrimmed: the box reads back from the URL, so trimming would eat the space between words as you type
  if (f.q.trim()) p.set("q", f.q);
  const s = p.toString();
  return s ? `?${s}` : location.pathname;
}

/*
 * The URL is the filter state, so any filtered view can be shared or bookmarked. It's read
 * through useSyncExternalStore: the server and the first client render see no filters (the
 * page is static), then React re-renders with the real query — no mismatch, no effect.
 */
const listeners = new Set<() => void>();
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}
const currentSearch = () => location.search;
const serverSearch = () => "";
function replaceSearch(next: string) {
  history.replaceState(null, "", next);
  listeners.forEach((l) => l());
}

/**
 * Does a card pass every filter — except `skip`? Each group counts against all the
 * others but not itself, so picking a shelf doesn't zero the other shelves' counts.
 */
type Indexed = Card & { text: string };

function passes(c: Indexed, f: Filters, words: string[], skip?: Facet) {
  if (skip !== "shelf" && f.shelf && c.type !== f.shelf) return false;
  if (skip !== "subject" && f.subject && c.category !== f.subject) return false;
  if (skip !== "colour" && f.colour && !c.hues.includes(f.colour)) return false;
  if (skip !== "theme" && f.theme !== "any" && c.dark !== (f.theme === "dark")) return false;
  if (skip !== "using" && f.using && c.status !== "active") return false;
  return words.every((w) => c.text.includes(w));
}

function tally(cards: Indexed[], key: (c: Indexed) => (string | null)[]) {
  const m = new Map<string, number>();
  for (const c of cards) for (const k of key(c)) if (k) m.set(k, (m.get(k) ?? 0) + 1);
  return m;
}

export function LibraryBrowser({ cards: given, how }: { cards: Card[]; how: React.ReactNode }) {
  const cards = useMemo<Indexed[]>(() => given.map((c) => ({ ...c, text: searchText(c) })), [given]);
  const query = useSyncExternalStore(subscribe, currentSearch, serverSearch);
  const f = useMemo(() => read(query), [query]);
  const [shown, setShown] = useState(PAGE);
  const search = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<Filters>) => {
    replaceSearch(write({ ...f, ...patch }));
    setShown(PAGE);
  };
  const toggle = <K extends "shelf" | "subject" | "colour">(key: K, value: string) =>
    set({ [key]: f[key] === value ? null : value } as Partial<Filters>);

  const words = useMemo(() => f.q.toLowerCase().split(/\s+/).filter(Boolean), [f.q]);
  const results = useMemo(() => cards.filter((c) => passes(c, f, words)), [cards, f, words]);

  const counts = useMemo(() => {
    const not = (skip: Facet) => cards.filter((c) => passes(c, f, words, skip));
    return {
      shelf: tally(not("shelf"), (c) => [c.type]),
      allShelves: not("shelf").length,
      subject: tally(not("subject"), (c) => [c.category]),
      colour: tally(not("colour"), (c) => c.hues),
      using: not("using").filter((c) => c.status === "active").length,
    };
  }, [cards, f, words]);

  const subjects = useMemo(() => {
    const top = [...counts.subject.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const list = top.slice(0, SUBJECTS_SHOWN);
    // a picked subject stays visible even when the other filters push it out of the top
    if (f.subject && !list.some(([s]) => s === f.subject)) list.push([f.subject, counts.subject.get(f.subject) ?? 0]);
    return list;
  }, [counts.subject, f.subject]);

  // More cards as the end of the grid comes near. The marker remounts with every page
  // (keyed on `shown`), so a screen tall enough to still see it keeps loading.
  const more = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setShown((n) => n + PAGE), {
      rootMargin: "800px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // "/" jumps to the search box from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || (e.target as HTMLElement).closest("input, textarea")) return;
      e.preventDefault();
      search.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = f.shelf || f.subject || f.colour || f.theme !== "any" || f.using || words.length > 0;
  const shelves = SHELVES.filter((s) => cards.some((c) => c.type === s.id));
  const shelfLabel = shelves.find((s) => s.id === f.shelf)?.label;

  return (
    <>
      <SidebarFrame>
        <button className={itemClass(false)} onClick={() => search.current?.focus()}>
          <span className="grid w-[22px] place-items-center">
            <SearchIcon />
          </span>
          <span className="flex-1">Search</span>
          <kbd className="font-mono text-[11px] text-muted">/</kbd>
        </button>
        <RailGroup label="Library">
          <button className={itemClass(!f.shelf)} onClick={() => set({ shelf: null })} aria-pressed={!f.shelf}>
            <LibraryIcon />
            <span className="flex-1">Everything</span>
            <Count n={counts.allShelves} />
          </button>
          {shelves.map((s) => (
            <button
              key={s.id}
              className={itemClass(f.shelf === s.id)}
              onClick={() => toggle("shelf", s.id)}
              aria-pressed={f.shelf === s.id}
              title={s.blurb}
            >
              <ShelfDot id={s.id} />
              <span className="flex-1 truncate">{s.label}</span>
              <Count n={counts.shelf.get(s.id) ?? 0} />
            </button>
          ))}
        </RailGroup>
      </SidebarFrame>

      <MobileBar title="Library" />

      <main className="px-2 py-4 lg:ml-[240px] lg:py-2 lg:pr-2">
        <div className="min-h-[calc(100svh-16px)] rounded-[14px] border border-line bg-panel">
          <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
            <span className="label">Library{shelfLabel ? ` · ${shelfLabel}` : ""}</span>
            <a href="#how" className="label transition-colors hover:text-ink">
              How it&apos;s made ↓
            </a>
          </div>

          <div className="flex max-w-[640px] flex-col gap-3 px-5 pb-6 pt-8 sm:px-6">
            <h1 className="rise text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.04] tracking-[-0.035em]">
              Things I keep
              <br />
              <span className="text-muted">coming back to.</span>
            </h1>
            <p className="rise max-w-[540px] text-[15px] leading-[1.6] text-ink-2" style={{ animationDelay: "80ms" }}>
              {cards.length} tools, references and kits from my knowledge base. Claude filed each one when I
              saved it; I reviewed what stayed.
              <span className="hidden sm:inline"> Hover a card to see the site move.</span>
            </p>
          </div>

          {/* On a wide screen the filters stay in reach while the grid scrolls; on a phone they'd cover a quarter of it. */}
          <div className="z-20 flex flex-col gap-3 border-y border-line bg-panel/90 px-5 py-3 backdrop-blur sm:px-6 lg:sticky lg:top-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <label className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-xl border border-line-strong bg-raised px-3 py-2 shadow-card sm:max-w-[360px]">
                <SearchIcon />
                <input
                  ref={search}
                  value={f.q}
                  onChange={(e) => set({ q: e.target.value })}
                  onKeyDown={(e) => e.key === "Escape" && set({ q: "" })}
                  placeholder="Search by name, use or typeface…"
                  aria-label="Search the library"
                  className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted"
                />
                <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted sm:block">
                  /
                </kbd>
              </label>

              <div className="flex items-center gap-1 rounded-full border border-line bg-raised p-1 shadow-card" role="group" aria-label="Colour">
                {HUES.map((h) => {
                  const n = counts.colour.get(h.id) ?? 0;
                  const on = f.colour === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => toggle("colour", h.id)}
                      disabled={!n && !on}
                      aria-pressed={on}
                      title={`${h.id} · ${n}`}
                      className={`grid size-6 place-items-center rounded-full transition-[opacity,box-shadow] disabled:opacity-25 ${
                        on ? "ring-2 ring-ink ring-offset-1 ring-offset-raised" : "hover:ring-1 hover:ring-line-strong"
                      }`}
                    >
                      <span className="size-3.5 rounded-full" style={{ background: h.swatch }} />
                      <span className="sr-only">{h.id}</span>
                    </button>
                  );
                })}
              </div>

              <Segmented
                value={f.theme}
                onChange={(theme) => set({ theme })}
                options={[
                  ["any", "Any"],
                  ["light", "Light"],
                  ["dark", "Dark"],
                ]}
                label="Page theme"
              />

              <button
                onClick={() => set({ using: !f.using })}
                aria-pressed={f.using}
                disabled={!counts.using && !f.using}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] shadow-card transition-colors disabled:opacity-40 ${
                  f.using ? "border-ink bg-ink text-paper" : "border-line bg-raised text-ink-2 hover:text-ink"
                }`}
              >
                <span className="size-1.5 rounded-full bg-green-500" />
                In use
                <span className={`font-mono text-[11px] ${f.using ? "text-paper/70" : "text-muted"}`}>{counts.using}</span>
              </button>
            </div>

            {/* Shelves live in the rail on a wide screen; on a phone they're this row. */}
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 no-scrollbar lg:hidden">
              <Chip on={!f.shelf} onClick={() => set({ shelf: null })} n={counts.allShelves}>
                Everything
              </Chip>
              {shelves.map((s) => (
                <Chip key={s.id} on={f.shelf === s.id} onClick={() => toggle("shelf", s.id)} n={counts.shelf.get(s.id) ?? 0}>
                  {s.label}
                </Chip>
              ))}
            </div>

            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
              {subjects.map(([s, n]) => (
                <Chip key={s} on={f.subject === s} onClick={() => toggle("subject", s)} n={n} quiet>
                  {subjectLabel(s)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-5 pb-3 pt-4 sm:px-6">
            <span className="label">
              {results.length === cards.length ? `${cards.length} items` : `${results.length} of ${cards.length}`}
            </span>
            {filtered && (
              <button onClick={() => set(EMPTY)} className="label transition-colors hover:text-ink">
                Clear filters
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 px-5 pb-6 sm:px-6">
              {results.slice(0, shown).map((c) => (
                <LibraryCard key={c.slug} card={c} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
              <p className="text-[15px] text-ink-2">Nothing here matches all of that.</p>
              <button onClick={() => set(EMPTY)} className="text-[14px] text-ink underline decoration-line-strong underline-offset-4">
                Clear filters
              </button>
            </div>
          )}
          {shown < results.length && <div key={shown} ref={more} className="h-px" aria-hidden />}

          {how}
        </div>
      </main>
    </>
  );
}

function Chip({
  on,
  onClick,
  n,
  quiet = false,
  children,
}: {
  on: boolean;
  onClick: () => void;
  n: number;
  quiet?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] transition-colors ${
        on
          ? "border-ink bg-ink text-paper"
          : `border-line ${quiet ? "text-ink-2" : "bg-raised text-ink-2 shadow-card"} hover:border-line-strong hover:text-ink`
      }`}
    >
      {children}
      <span className={`font-mono text-[11px] ${on ? "text-paper/70" : "text-muted"}`}>{n}</span>
    </button>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
  label: string;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-line bg-raised p-1 shadow-card" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`rounded-full px-3 py-1 text-[13px] transition-colors ${
            value === v ? "bg-ink text-paper" : "text-muted hover:text-ink"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

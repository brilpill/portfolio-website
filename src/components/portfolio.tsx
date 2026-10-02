"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { pageIds, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { CommandPalette } from "./command-palette";
import { Avatar, Monogram, ProjectIcon } from "./project-icon";
import { AboutSection, HomeSection, ProjectSection, SearchIcon } from "./sections";
import { SettingsDialog } from "./settings-dialog";
import { usePaging } from "./settings-store";
import { Sidebar } from "./sidebar";
import { usePager } from "./use-pager";

// Before paint on a deep link (/#licoglass), put the track on that page so Home never flashes.
const deepLinkScript = `(function(){try{var ids=${JSON.stringify(pageIds)};var i=ids.indexOf(location.hash.slice(1));if(i<1)return;var v=document.getElementById("pager"),t=document.getElementById("track");if(localStorage.getItem("paging")==="scroll"){v.scrollTop=i*v.clientHeight}else{t.style.transform="translate3d(0,"+(-i*100)+"%,0)"}}catch(e){}})()`;

export function Portfolio() {
  const paging = usePaging();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const blocked = paletteOpen || settingsOpen || menuOpen;

  const { index, go, viewportRef, trackRef } = usePager(pageIds.length, paging, blocked);
  const active = pageIds[index];
  const activeProject = projects.find((p) => p.slug === active);

  const jump = useCallback(
    (id: string) => {
      const i = pageIds.indexOf(id);
      if (i >= 0) go(i);
      setMenuOpen(false);
    },
    [go],
  );
  const openSearch = useCallback(() => setPaletteOpen(true), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);

  // Open on a deep link, and follow hash links.
  useLayoutEffect(() => {
    const open = () => {
      const i = pageIds.indexOf(location.hash.slice(1));
      if (i >= 0) go(i, true);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [go]);

  // Keep the URL on the current page without adding history entries.
  useEffect(() => {
    const hash = active === "home" ? "" : `#${active}`;
    if (location.hash !== hash) history.replaceState(null, "", hash || location.pathname);
  }, [active]);

  // Keyboard: ⌘K searches, arrows / page keys / space turn pages.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSettingsOpen(false);
        setPaletteOpen((o) => !o);
        return;
      }
      if (blocked || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (e.key === " " && target.closest("button, a")) return;
      const step =
        e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j" || (e.key === " " && !e.shiftKey)
          ? 1
          : e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k" || (e.key === " " && e.shiftKey)
            ? -1
            : 0;
      if (step) {
        e.preventDefault();
        go(index + step);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        go(e.key === "Home" ? 0 : pageIds.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [blocked, go, index]);

  return (
    <>
      <div aria-hidden className="backdrop fixed inset-0 -z-20" />
      <div
        aria-hidden
        className="glow pointer-events-none fixed inset-0 -z-10"
        style={{ "--glow": activeProject ? `color-mix(in oklab, ${activeProject.accent} 16%, transparent)` : "transparent" } as React.CSSProperties}
      />

      <Sidebar active={active} onJump={jump} className="fixed inset-y-0 left-0 z-30 hidden lg:flex" />

      {/* Mobile: the current page in the bar, the sidebar in a drawer. */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-1 px-2 lg:hidden">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left active:bg-fill"
        >
          <MenuIcon />
          {activeProject ? (
            <ProjectIcon project={activeProject} size={20} />
          ) : active === "about" ? (
            <Avatar size={20} />
          ) : (
            <Monogram size={20} />
          )}
          <span className="truncate text-[15px] font-medium">
            {activeProject?.title ?? (active === "about" ? "About & CV" : profile.name)}
          </span>
          <span className="shrink-0 text-[12px] tabular-nums text-muted">
            {index + 1}/{pageIds.length}
          </span>
        </button>
        <button
          onClick={openSearch}
          aria-label="Search"
          className="grid size-10 place-items-center rounded-[12px] text-ink active:bg-fill"
        >
          <SearchIcon className="text-ink" />
        </button>
      </header>

      <div
        ref={viewportRef}
        id="pager"
        data-pager
        className={`fixed inset-x-0 bottom-0 top-14 lg:left-[240px] lg:top-0 ${
          paging === "flip" ? "overflow-hidden" : "overflow-y-auto no-scrollbar"
        }`}
      >
        <div ref={trackRef} id="track" className="h-full will-change-transform" suppressHydrationWarning>
          {pageIds.map((id, i) => {
            const project = projects.find((p) => p.slug === id);
            return (
              <div key={id} className="h-full" inert={paging === "flip" && i !== index}>
                {id === "home" ? (
                  <HomeSection onJump={jump} onSearch={openSearch} onSettings={openSettings} />
                ) : id === "about" ? (
                  <AboutSection onSettings={openSettings} />
                ) : project ? (
                  <ProjectSection project={project} />
                ) : null}
              </div>
            );
          })}
        </div>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: deepLinkScript }}
        />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fade-in absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
          <div className="drawer-in backdrop absolute inset-y-0 left-0 shadow-pop">
            <Sidebar active={active} onJump={jump} />
          </div>
        </div>
      )}

      {paletteOpen && (
        <CommandPalette onClose={() => setPaletteOpen(false)} onJump={jump} onSettings={openSettings} />
      )}
      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-ink">
      <path d="M2.5 5.5h11M2.5 10.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

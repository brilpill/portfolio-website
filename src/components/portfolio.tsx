"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { CommandPalette } from "./command-palette";
import { Monogram } from "./project-icon";
import { AboutSection, HomeSection, ProjectSection, SearchIcon } from "./sections";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

export function Portfolio() {
  const [active, setActive] = useState("home");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // The active section is the last one whose top has passed the upper third of the screen.
  useEffect(() => {
    const main = mainRef.current;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sections = document.querySelectorAll<HTMLElement>("[data-section]");
        const line = window.innerHeight / 3;
        let current = sections[0]?.id ?? "home";
        sections.forEach((s) => {
          if (s.getBoundingClientRect().top <= line) current = s.id;
        });
        setActive(current);
      });
    };
    measure();
    main?.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      main?.removeEventListener("scroll", measure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Keep the URL hash in sync without adding history entries.
  useEffect(() => {
    history.replaceState(null, "", active === "home" ? location.pathname : `#${active}`);
  }, [active]);

  const jump = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Open on a deep link.
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);

  // ⌘K / Ctrl+K, and arrow keys to flip pages.
  useEffect(() => {
    const ids = ["home", ...projects.map((p) => p.slug), "about"];
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (paletteOpen || (e.target as HTMLElement).closest("input, textarea")) return;
      const i = ids.indexOf(active);
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        jump(ids[Math.min(i + 1, ids.length - 1)]);
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        jump(ids[Math.max(i - 1, 0)]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, jump, paletteOpen]);

  return (
    <>
      <Sidebar active={active} onJump={jump} onSearch={() => setPaletteOpen(true)} />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/85 px-4 py-3 backdrop-blur lg:hidden">
        <Monogram size={16} />
        <span className="text-[14px] font-medium">{profile.name}</span>
        <button
          onClick={() => setPaletteOpen(true)}
          className="ml-auto flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-[13px] text-muted"
        >
          <SearchIcon /> Projects
        </button>
        <ThemeToggle />
      </header>

      <main
        ref={mainRef}
        className="flex flex-col gap-10 px-2 py-4 lg:ml-[240px] lg:h-svh lg:snap-y lg:snap-mandatory lg:gap-4 lg:overflow-y-auto lg:py-2 lg:pr-2 no-scrollbar"
      >
        <HomeSection onJump={jump} onSearch={() => setPaletteOpen(true)} />
        {projects.map((p) => (
          <ProjectSection key={p.slug} project={p} />
        ))}
        <AboutSection />
      </main>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onJump={jump} />}
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUUpLeftIcon } from "@phosphor-icons/react";
import { AskAiIcon } from "./ask-ai-icon";
import { AssistantPanel } from "./assistant-panel";
import { HeroActions } from "./hero-actions";

type Section = { id: string; label: string; title: string };
type Props = { back: { href: string; label: string }; sections: Section[]; children: ReactNode };

const TICK_GAP = 12; // px between ticks
const REACH = 22; // px: how far from the pointer a tick still grows

/** The chapter whose top last crossed the upper third of the window; at the very end, the last one. */
function useReadingSection(sections: Section[]) {
  const [current, setCurrent] = useState(sections[0]?.id);
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight / 3;
      let reading = sections[0]?.id;
      for (const { id } of sections) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) reading = id;
      }
      // A short last chapter never reaches the line, so the end of the page counts as reading it.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) reading = sections.at(-1)?.id ?? reading;
      setCurrent(reading);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [sections]);
  return current;
}

/**
 * Chapter ticks on the left edge, after ktz.dk: the pointer works like a dock, so ticks near it grow
 * longer and darker, and a small card beside it names the nearest chapter. Clicking anywhere on the strip
 * goes to that chapter. The chapter being read keeps the longest, darkest tick.
 */
function ChapterTicks({ sections, current }: { sections: Section[]; current?: string }) {
  const list = useRef<HTMLUListElement>(null);
  const [pointer, setPointer] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const nearest = pointer === null ? focused : Math.max(0, Math.min(sections.length - 1, Math.round((pointer - TICK_GAP / 2) / TICK_GAP)));
  const shown = nearest === null ? null : sections[nearest];

  const track = (event: React.PointerEvent) => {
    if (event.pointerType === "touch" || !list.current) return;
    setPointer(event.clientY - list.current.getBoundingClientRect().top);
  };

  return (
    <nav className="case-study-ticks" aria-label="Chapters" onPointerMove={track} onPointerLeave={() => setPointer(null)}
      onClick={event => {
        // The whole strip is a target: a click between ticks goes to the nearest chapter.
        if (nearest === null || (event.target as Element).closest("a")) return;
        document.getElementById(sections[nearest].id)?.scrollIntoView();
        history.replaceState(null, "", `#${sections[nearest].id}`);
      }}>
      <ul ref={list}>
        {sections.map(({ id, label }, index) => {
          const pull = pointer === null ? (focused === index ? 1 : 0) : Math.exp(-(((pointer - (index + .5) * TICK_GAP) / REACH) ** 2));
          const reading = current === id;
          return (
            <li key={id}>
              <a href={`#${id}`} aria-label={label} aria-current={reading ? "location" : undefined}
                onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setFocused(index); }} onBlur={() => setFocused(null)}>
                <span className="case-study-tick" style={reading ? undefined : { width: 12 + 16 * pull, opacity: .3 + .55 * pull }} aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
      {shown && nearest !== null && (
        <span className="case-study-tick-card" style={{ top: nearest * TICK_GAP }} aria-hidden>
          <span>{shown.label}</span>
          <span>{shown.title}</span>
        </span>
      )}
    </nav>
  );
}

/**
 * Case study frame, after ktz.dk/work/nm-skills: no sidebar. A top bar in line with the content (my avatar,
 * Back and Ask AI), chapter ticks along the left edge, and the hero's Contact button floating at the bottom.
 * Ask AI opens the same assistant panel as the portfolio.
 */
export function CaseStudyFrame({ back, sections, children }: Props) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const askButton = useRef<HTMLButtonElement>(null);
  // Closing from the panel hands focus back to Ask AI.
  const closeAssistant = useCallback(() => { setAssistantOpen(false); requestAnimationFrame(() => askButton.current?.focus()); }, []);
  const current = useReadingSection(sections);

  return (
    <div className="case-study-shell" data-assistant={assistantOpen ? "open" : "closed"}>
      <ChapterTicks sections={sections} current={current} />

      <main className="case-study-main">
        <header className="case-study-topbar">
          <div className="case-study-topbar-start">
            <Link className="case-study-avatar" href="/" aria-label="Home"><Image src="/figma/avatar.png" alt="" width={28} height={28} /></Link>
            <span className="case-study-topbar-divider" aria-hidden />
            <Link className="case-study-back" href={back.href} aria-label={`Back to ${back.label}`}>
              <ArrowUUpLeftIcon size={16} aria-hidden />
              <span>Back</span>
            </Link>
          </div>
          <button ref={askButton} type="button" className="case-study-ask ask-ai-trigger" data-open={assistantOpen || undefined} aria-expanded={assistantOpen} aria-controls="portfolio-assistant"
            aria-label={assistantOpen ? "Close Ask AI" : "Ask AI"} onClick={() => setAssistantOpen(open => !open)}>
            <AskAiIcon />
            <span className="case-study-ask-label" aria-hidden><span>Ask AI</span><span>Close</span></span>
          </button>
        </header>
        {children}
      </main>

      {/* Shared Contact expansion, anchored above the floating button. */}
      <div className="case-study-contact">
        <HeroActions contactOnly direction="up" />
      </div>

      <AssistantPanel open={assistantOpen} onClose={closeAssistant} />
    </div>
  );
}

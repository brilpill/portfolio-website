"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { coverOf, visibleProjectSlides } from "@/content/project-slides";
import { profile } from "@/content/profile";
import { AskAiIcon } from "@/components/ask-ai-icon";
import { AssistantPanel } from "@/components/assistant-panel";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Each project's "painting": two glows over a dark base, in CSS, so no artwork has to be borrowed. */
const SKIES: [string, string, string][] = [
  ["#1b2140", "#7b5cff", "#f2a65a"],
  ["#13241d", "#5fae8a", "#e9d8a6"],
  ["#1d1530", "#c06c84", "#6c5b7b"],
  ["#2a1a12", "#e07a5f", "#f2cc8f"],
  ["#0f1d2e", "#3d85c6", "#9fd3ff"],
  ["#221a2e", "#b388eb", "#ffd6a5"],
];

const projects = visibleProjectSlides.filter(project => project.placement !== "more");
const sections = [
  ...projects.map(project => ({ id: project.slug, label: project.title })),
  { id: "ask", label: "Ask AI" },
  { id: "contact", label: "Contact" },
];

/** A torn-paper edge from a seeded walk, so it is the same on every render. */
function tornPath(seed: number) {
  let x = 0, value = seed;
  const random = () => { value = (value * 9301 + 49297) % 233280; return value / 233280; };
  const points: string[] = ["0,40"];
  while (x < 100) {
    x = Math.min(100, x + 1.2 + random() * 2.4);
    points.push(`${x.toFixed(2)},${(14 + random() * 22).toFixed(2)}`);
  }
  return `M0,40 L${points.join(" L")} L100,40 Z`;
}

function TornEdge({ seed }: { seed: number }) {
  return <svg className="editions-torn" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden><path d={tornPath(seed)} /></svg>;
}

/** The section whose top last passed the middle of the window. */
function useCurrentSection() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const update = () => {
      let reading: string | null = null;
      for (const { id } of sections) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= window.innerHeight / 2) reading = id;
      }
      setCurrent(reading);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return current;
}

function SectionIndex({ current, className }: { current: string | null; className: string }) {
  return <ol className={className}>
    {sections.map(({ id, label }, index) => <li key={id}>
      <a href={`#${id}`} aria-current={current === id ? "location" : undefined}><span>{label}</span><small>{NUMERALS[index]}</small></a>
    </li>)}
  </ol>;
}

export function EditionsExperiment() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const askButton = useRef<HTMLButtonElement>(null);
  const closeAssistant = useCallback(() => { setAssistantOpen(false); requestAnimationFrame(() => askButton.current?.focus()); }, []);
  const current = useCurrentSection();

  return (
    <div className="editions-shell" data-assistant={assistantOpen ? "open" : "closed"} data-past-hero={current ? "true" : undefined}>
      <header className="editions-topbar">
        <div className="editions-topbar-start">
          <Link href="/" className="editions-wordmark"><Image src="/figma/avatar.png" alt="" width={20} height={20} />{profile.name}<span>Portfolio ’26</span></Link>
          <a href="#luminasset">Work</a>
          <button type="button" onClick={() => setAssistantOpen(true)}><MagnifyingGlassIcon size={14} aria-hidden />Search</button>
        </div>
        <div className="editions-topbar-end">
          <Link href="/">Classic site</Link>
          <button ref={askButton} type="button" className="editions-pill ask-ai-trigger" aria-expanded={assistantOpen} aria-controls="portfolio-assistant" onClick={() => setAssistantOpen(open => !open)}><AskAiIcon />{assistantOpen ? "Close" : "Ask AI"}</button>
        </div>
      </header>

      <main className="editions-main">
        <section className="editions-hero" aria-labelledby="editions-title">
          <div className="editions-frame">
            <h1 id="editions-title">The Design <em>+</em> Code Edition</h1>
            <p>UX/UI design and the code behind it. Six cases, one assistant.</p>
            <SectionIndex current={current} className="editions-index" />
          </div>
        </section>

        {projects.map((project, index) => {
          const [base, glow, light] = SKIES[index % SKIES.length];
          const cover = coverOf(project.media);
          return <section key={project.slug} id={project.slug} className="editions-section" style={{ "--sky-base": base, "--sky-glow": glow, "--sky-light": light } as CSSProperties}>
            <div className="editions-sky" aria-hidden />
            <h2>{project.title}</h2>
            <p className="editions-statement"><span className="editions-drop">{(project.headline ?? project.format).charAt(0)}</span>{(project.headline ?? project.format).slice(1)}</p>
            {cover && <div className="editions-media"><Image src={cover} alt="" fill sizes="(max-width: 767px) 90vw, 520px" /></div>}
            <TornEdge seed={index * 97 + 13} />
            <div className="editions-paper">
              <p>{project.overview}</p>
              <dl>
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Timeline</dt><dd>{project.timeline}</dd></div>
                <div><dt>Format</dt><dd>{project.format}</dd></div>
              </dl>
              {project.caseStudyUrl && <Link className="editions-pill editions-pill-dark" href={project.caseStudyUrl}>Read the case study<ArrowUpRightIcon size={14} aria-hidden /></Link>}
            </div>
          </section>;
        })}

        <section id="ask" className="editions-section editions-ask" style={{ "--sky-base": "#0c0c14", "--sky-glow": "#004bfe", "--sky-light": "#9fb8ff" } as CSSProperties}>
          <div className="editions-sky" aria-hidden />
          <h2>Ask AI</h2>
          <p className="editions-statement"><span className="editions-drop">A</span>n assistant that knows my work, how I work, and whether I’m free.</p>
          <button type="button" className="editions-pill" onClick={() => setAssistantOpen(true)}><AskAiIcon />Start a conversation</button>
        </section>

        <section id="contact" className="editions-contact">
          <h2>Contact</h2>
          <p>Based in {profile.location}. Open to full-time, freelance and contract work.</p>
          <a className="editions-pill editions-pill-dark" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRightIcon size={14} aria-hidden /></a>
        </section>
      </main>

      {/* After the hero, the same index pins bottom-left as a flat list: the current section reads bright. */}
      <aside className="editions-rail" aria-label="Sections">
        <p className="editions-rail-title">The Design <em>+</em> Code Edition</p>
        <SectionIndex current={current} className="editions-rail-index" />
      </aside>

      <AssistantPanel open={assistantOpen} onClose={closeAssistant} />
    </div>
  );
}

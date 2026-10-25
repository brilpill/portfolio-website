"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRightIcon, FigmaLogoIcon, GithubLogoIcon, NotionLogoIcon, OpenAiLogoIcon, SlackLogoIcon, type Icon } from "@phosphor-icons/react";
import { experienceJobs, stackTools, timelineItems, timelineNow, timelineStart } from "@/content/portfolio-content";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthIndex = (year: number, month: number) => (year - timelineStart.year) * 12 + month - timelineStart.month;
const parseMonth = (value: string) => { const [year, month] = value.split("-").map(Number); return monthIndex(year, month); };
const TOTAL = monthIndex(timelineNow.year, timelineNow.month) + 1;
/** "Dec 2025 – Sep 2026" → months, counting both ends. */
function duration(dates: string) {
  const [from, to] = dates.split("–").map(part => part.trim().split(" "));
  const months = (to[1] ? Number(to[1]) : timelineNow.year) * 12 + (MONTHS.indexOf(to[0]) + 1 || timelineNow.month) - (Number(from[1]) * 12 + MONTHS.indexOf(from[0]) + 1) + 1;
  return months >= 12 ? `${Math.floor(months / 12)} yr${months % 12 ? ` ${months % 12} mos` : ""}` : `${months} mos`;
}

export function ExperienceSlide() {
  return <section className="content-slide experience-slide" aria-labelledby="experience-heading">
    <header className="content-heading">
      <span className="content-kicker">02 / Experience</span>
      <h1 id="experience-heading" tabIndex={-1} data-slide-heading>A few places I’ve worked.</h1>
      <p>Web and mobile products, studios and product teams.</p>
    </header>

    <Timeline />

    <ol className="experience-rows">
      {experienceJobs.map(job => <li key={job.company}>
        <span className="experience-rows-kind"><i aria-hidden />Experience <strong>{duration(job.dates)}</strong></span>
        <div>
          <h2>{job.company}</h2>
          <span className="experience-rows-role">{job.role}</span>
          <p>{job.detail}</p>
          {(job.projects || job.website) && <div className="experience-rows-links">
            {job.projects?.map(project => <a key={project.slug} href={`#${project.slug}`}>Case · {project.label}</a>)}
            {job.website && <a href={job.website} target="_blank" rel="noreferrer">{job.website.replace(/^https?:\/\/(www\.)?/, "")}<ArrowUpRightIcon size={12} aria-hidden /></a>}
          </div>}
        </div>
        <span className="experience-rows-dates">{job.dates}</span>
      </li>)}
    </ol>

    <section className="experience-stack" aria-labelledby="experience-stack-heading">
      <span className="content-kicker">Stack</span>
      <h2 id="experience-stack-heading">What I work with every day.</h2>
      <StackRow />
    </section>
  </section>;
}

/**
 * Timeline after thakursameershetty.com: one month grid from Sep 2018 to now, a lane per track. When it scrolls
 * into view a playhead sweeps from the start to Now and each bar grows as the sweep reaches it (pure CSS: the
 * registered --sweep property transitions from 0 to 1, see home.css).
 */
function Timeline() {
  const root = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    // On phones the timeline scrolls sideways; start at the recent end, where Now is.
    element.scrollLeft = element.scrollWidth;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } }, { threshold: .5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const years = Array.from({ length: timelineNow.year - timelineStart.year }, (_, i) => timelineStart.year + 1 + i);
  const lanes = Math.max(...timelineItems.map(item => item.lane)) + 1;

  return <div ref={root} className="experience-timeline" data-seen={seen || undefined} style={{ "--lanes": lanes } as CSSProperties}
    role="img" aria-label={`Timeline from ${timelineStart.year} to now: ${timelineItems.filter(item => item.label).map(item => item.label).join(", ")}.`}>
    <div className="experience-timeline-track">
      <div className="experience-timeline-lanes">
        {timelineItems.map((item, i) => {
          const from = parseMonth(item.from);
          const to = item.to ? parseMonth(item.to) + 1 : TOTAL;
          const style = { "--from": from / TOTAL, "--len": (to - from) / TOTAL, "--lane": item.lane, left: `${from / TOTAL * 100}%`, width: item.kind === "course" ? undefined : `${(to - from) / TOTAL * 100}%` } as CSSProperties;
          return <div key={i} className="experience-timeline-item" data-kind={item.kind} data-ongoing={!item.to || undefined} data-label-end={(!item.to && from / TOTAL > .8) || undefined} style={style}>
            {item.label && <span className="experience-timeline-label">{item.label}{item.kind === "practice" && " →"}</span>}
            {item.kind === "practice" && <svg className="experience-timeline-wave" viewBox="0 0 36 6" aria-hidden><path d="M0 3 q 3 -4 6 0 t 6 0 t 6 0 t 6 0 t 6 0 t 6 0" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>}
          </div>;
        })}
      </div>
      <div className="experience-timeline-axis" aria-hidden>
        {Array.from({ length: Math.ceil(TOTAL / 3) }, (_, i) => <i key={i} style={{ left: `${i * 3 / TOTAL * 100}%` }} />)}
        {years.map(year => <span key={year} style={{ left: `${monthIndex(year, 1) / TOTAL * 100}%` }}>{year}</span>)}
      </div>
      <div className="experience-timeline-now" aria-hidden><span>Now · Open for work</span></div>
    </div>
  </div>;
}

const logos: Record<string, Icon> = { Figma: FigmaLogoIcon, ChatGPT: OpenAiLogoIcon, Notion: NotionLogoIcon, Slack: SlackLogoIcon, GitHub: GithubLogoIcon };

/**
 * Stack row after granola.ai: white tiles drift left on their own and shrink towards the edges; hovering or
 * focusing pauses the row and the tile names its job. It is a real scroller, so a trackpad or swipe moves it too.
 * Tools without a Phosphor logo show a wordmark until real logo files are added.
 */
function StackRow() {
  const row = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  useEffect(() => {
    const element = row.current;
    if (!element) return;
    const tiles = [...element.querySelectorAll<HTMLElement>(".stack-tile")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = 0, visible = false, position = element.scrollLeft;
    const setWidth = () => element.scrollWidth / 3;

    const scale = () => {
      const box = element.getBoundingClientRect();
      const centre = box.left + box.width / 2, reach = box.width * .45;
      for (const tile of tiles) {
        const rect = tile.parentElement!.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - centre) / reach;
        tile.style.scale = String(Math.max(.6, 1 - .4 * Math.min(1, distance) ** 2));
      }
    };
    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      const delta = last ? Math.min(64, time - last) : 0;
      last = time;
      if (!paused.current && !reduced) {
        position += delta * .03; // 30px a second
        // Three copies of the set: jump back by one set so the drift never runs out.
        if (position >= setWidth() * 2) position -= setWidth();
        element.scrollLeft = position;
      } else position = element.scrollLeft;
      scale();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf); last = 0;
      if (visible) raf = requestAnimationFrame(tick);
    });
    element.scrollLeft = position = setWidth();
    scale();
    observer.observe(element);
    const onScroll = () => { if (reduced || paused.current) scale(); };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); cancelAnimationFrame(raf); element.removeEventListener("scroll", onScroll); };
  }, []);

  return <div ref={row} className="stack-row" onPointerEnter={() => { paused.current = true; }} onPointerLeave={() => { paused.current = false; }}
    onFocus={() => { paused.current = true; }} onBlur={() => { paused.current = false; }}>
    {[0, 1, 2].map(copy => stackTools.map(tool => {
      const Logo = logos[tool.name];
      return <div key={`${copy}-${tool.name}`} className="stack-cell" aria-hidden={copy !== 1 || undefined}>
        <a className="stack-tile" href={tool.href} target="_blank" rel="noreferrer" tabIndex={copy === 1 ? 0 : -1} aria-label={`${tool.name}: ${tool.note}`}>
          <span className="stack-tile-mark">{Logo ? <Logo size={40} weight="fill" /> : <span className="stack-tile-word">{tool.name}</span>}</span>
          <span className="stack-tile-note"><strong>{tool.name}</strong>{tool.note}</span>
        </a>
      </div>;
    }))}
  </div>;
}

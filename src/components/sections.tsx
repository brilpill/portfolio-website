"use client";

import { useState } from "react";
import { featured, groupLabel, projects, type Project } from "@/content/projects";
import { education, experience, offScreen, profile, skills, tools } from "@/content/profile";
import { Clock, ClockScript, Greeting } from "./clock";
import { Avatar, Monogram, ProjectIcon } from "./project-icon";
import { Stage } from "./stage";

/** One page of the pager: the stage on the left, the info panel on the right. */
const pageClass = "flex h-full flex-col gap-3 p-2 pt-0 lg:flex-row lg:gap-6 lg:py-2 lg:pl-0 lg:pr-2";

type Nav = { onJump: (id: string) => void; onSearch: () => void; onSettings: () => void };

/* ---------- Shared right-hand panel ---------- */

function InfoPanel({
  icon,
  title,
  subtitle,
  children,
  rows,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  rows?: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <aside
      className={`flex min-h-0 shrink-0 flex-col gap-4 overflow-y-auto px-2 pb-2 no-scrollbar lg:w-[280px] lg:px-0 lg:pb-4 lg:pr-2 ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2.5 self-start rounded-[16px] bg-fill py-2 pl-3 pr-4">
        {icon}
        <div className="flex flex-col">
          <span className="text-[13px] font-medium leading-[19.5px]">{title}</span>
          <span className="text-[12px] leading-[18px] text-muted">{subtitle}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3.5 text-[14px] leading-[23.1px] text-ink-2">{children}</div>
      {rows && rows.length > 0 && <Rows rows={rows} className="mt-auto" />}
    </aside>
  );
}

function Rows({ rows, className = "" }: { rows: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={`flex shrink-0 flex-col text-[13px] leading-[19.5px] ${className}`}>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`flex items-center justify-between gap-4 py-3 ${i < rows.length - 1 ? "border-b border-line" : ""}`}
        >
          <dt className="text-muted">{r.label}</dt>
          <dd className="text-right text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TextButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="link">
      {children}
    </button>
  );
}

/* ---------- Home ---------- */

export function HomeSection({ onJump, onSearch, onSettings }: Nav) {
  const cards = featured.map((s) => projects.find((p) => p.slug === s)).filter((p): p is Project => !!p);
  const [first, second] = profile.intro;
  const [before, after] = first.split("{link}");

  return (
    <section id="home" aria-label="Home" className={pageClass}>
      <div className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden rounded-[16px] bg-stage shadow-stage">
        <Clock className="shrink-0 px-6 pt-6 text-center text-[13px] leading-[19.5px] text-muted" />

        <div className="flex w-full max-w-[560px] flex-1 flex-col items-center justify-center gap-7 px-5 py-6 sm:gap-8 sm:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="flex items-center gap-2.5 text-balance text-[clamp(23px,6.2vw,32px)] font-semibold leading-[1.15] tracking-[-0.0073em] text-ink">
              <Monogram size={28} />
              <span>
                <Greeting />, I&apos;m {profile.firstName}
              </span>
            </h1>
            <p className="text-[15px] leading-[24px] text-ink-3">
              {before}
              <TextButton onClick={() => onJump(profile.homeLink.slug)}>{profile.homeLink.label}</TextButton>
              {after}
              <br className="hidden sm:block" /> {second}
            </p>
          </div>

          <button
            onClick={onSearch}
            className="flex w-full items-center gap-2.5 rounded-[16px] bg-card px-4 py-[13px] text-left shadow-control transition-shadow duration-200 hover:shadow-card"
          >
            <SearchIcon />
            <span className="flex-1 text-[14px] text-faint">Find a project, client or industry…</span>
            <kbd className="hidden rounded-[6px] bg-fill px-1.5 py-0.5 font-sans text-[11px] font-medium leading-[16.5px] text-faint sm:block">
              ⌘ K
            </kbd>
          </button>

          <div className="flex w-full flex-col gap-2.5">
            <span className="px-0.5 text-[13px] font-medium leading-[19.5px] text-muted">Good places to start</span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {cards.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onJump(p.slug)}
                  className="group flex items-center gap-3 rounded-[16px] bg-card p-3 text-left shadow-card transition-[translate,box-shadow] duration-300 ease-out-quint hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.16),0_0_1px_rgba(0,0,0,0.08)] sm:flex-col sm:items-start sm:gap-2.5 sm:p-3.5"
                >
                  <ProjectIcon project={p} size={28} />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[14px] font-medium leading-[21px] text-ink">{p.title}</span>
                    <span className="line-clamp-1 text-[12px] leading-[16.8px] text-muted sm:hidden">{p.tagline}</span>
                    <span className="hidden h-[34px] text-[12px] leading-[16.8px] text-muted sm:line-clamp-2">
                      {p.short ?? p.tagline}
                    </span>
                    <span className="hidden pt-2 text-[11px] leading-[16.5px] text-muted sm:block">
                      {groupLabel(p.group)} · {p.year.split("–").pop()}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <FooterLinks onJump={onJump} />
        <ClockScript />
      </div>

      <InfoPanel
        className="hidden lg:flex"
        icon={<Monogram size={24} />}
        title="Home"
        subtitle={`@${profile.handle}`}
        rows={[
          { label: "Tabs on the left", value: "Open a project" },
          { label: "Scroll or ↑ ↓", value: "Turns the page" },
          { label: "⌘ K", value: "Finds anything" },
        ]}
      >
        <p>I set this site up like the apps I work in all day: a sidebar of tabs and one thing open at a time.</p>
        <p>
          Each project has its own page. Pick one on the left, or scroll and the pages turn one by one.{" "}
          <TextButton onClick={onSearch}>Search</TextButton> finds anything by name, client or industry.
        </p>
        <p>
          Rather scroll the usual way, or read in the dark? <TextButton onClick={onSettings}>Settings</TextButton>.
        </p>
        <p>
          Jobs, education and tools are in <TextButton onClick={() => onJump("about")}>About & CV</TextButton>.
        </p>
        <p>
          {profile.status}: {profile.statusDetail.charAt(0).toLowerCase() + profile.statusDetail.slice(1)}
        </p>
      </InfoPanel>
    </section>
  );
}

function FooterLinks({ onJump }: { onJump: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  };
  const linkClass = "text-[13px] leading-[19.5px] text-muted transition-colors hover:text-ink";

  return (
    <nav aria-label="Contact" className="flex shrink-0 flex-wrap justify-center gap-x-4 gap-y-1 px-6 pb-6">
      <button className={linkClass} onClick={() => onJump("about")}>
        CV
      </button>
      <button className={`${linkClass} grid`} onClick={copy} aria-label="Copy email address">
        <span className={`col-start-1 row-start-1 transition-opacity ${copied ? "opacity-0" : ""}`}>Email</span>
        <span className={`col-start-1 row-start-1 text-ink transition-opacity ${copied ? "" : "opacity-0"}`}>Copied</span>
      </button>
      {profile.links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}

/* ---------- Project ---------- */

export function ProjectSection({ project }: { project: Project }) {
  return (
    <section id={project.slug} aria-label={project.title} className={pageClass}>
      <div className="min-h-0 flex-[1.3] lg:flex-1">
        <Stage project={project} />
      </div>
      <InfoPanel
        className="flex-1 lg:flex-none"
        icon={<ProjectIcon project={project} size={24} />}
        title={project.title}
        subtitle={project.client}
        rows={project.facts}
      >
        {project.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {project.link && (
          <p>
            <a className="link" href={project.link.href} target="_blank" rel="noreferrer">
              {project.link.label} ↗
            </a>
          </p>
        )}
      </InfoPanel>
    </section>
  );
}

/* ---------- About ---------- */

export function AboutSection({ onSettings }: { onSettings: () => void }) {
  return (
    <section id="about" aria-label="About and CV" className={pageClass}>
      <div className="relative min-h-0 flex-[1.3] overflow-y-auto rounded-[16px] bg-stage shadow-stage no-scrollbar lg:flex-1">
        <div className="mx-auto flex max-w-[560px] flex-col gap-9 px-5 py-8 sm:px-8 lg:py-14">
          <div className="flex items-center gap-3">
            <Avatar size={44} />
            <div className="flex flex-col">
              <h2 className="text-[20px] font-semibold leading-[26px] tracking-[-0.01em]">{profile.name}</h2>
              <span className="text-[13px] leading-[19.5px] text-muted">
                {profile.role} · {profile.location}
              </span>
            </div>
          </div>

          <Block title="Experience">
            {experience.map((e) => (
              <li key={e.company} className="grid grid-cols-[84px_1fr] gap-4 border-b border-line py-3.5 last:border-0">
                <span className="text-[12px] leading-[21px] tabular-nums text-muted">{e.years}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-medium leading-[21px]">{e.company}</span>
                  <span className="text-[12px] leading-[18px] text-muted">{e.role}</span>
                  <span className="pt-1 text-[14px] leading-[21px] text-ink-2">{e.work}</span>
                </div>
              </li>
            ))}
          </Block>

          <Block title="Education">
            {education.map((e) => (
              <li key={e.what} className="grid grid-cols-[84px_1fr] gap-4 border-b border-line py-3 last:border-0">
                <span className="text-[12px] leading-[21px] tabular-nums text-muted">{e.years}</span>
                <div className="flex flex-col">
                  <span className="text-[14px] leading-[21px]">{e.what}</span>
                  <span className="text-[12px] leading-[18px] text-muted">{e.where}</span>
                </div>
              </li>
            ))}
          </Block>

          <Block title="Tools">
            {tools.map((t) => (
              <li key={t.group} className="grid grid-cols-[84px_1fr] gap-4 border-b border-line py-3 last:border-0">
                <span className="text-[12px] leading-[21px] text-muted">{t.group}</span>
                <span className="text-[14px] leading-[21px] text-ink-2">{t.items}</span>
              </li>
            ))}
          </Block>
        </div>
      </div>

      <InfoPanel
        className="flex-1 lg:flex-none"
        icon={<Avatar size={24} />}
        title="About & CV"
        subtitle="Experience, education, tools"
        rows={[
          { label: "Based in", value: profile.location },
          { label: "Languages", value: "UA, EN, RU, PL" },
          {
            label: "Email",
            value: (
              <a className="link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            ),
          },
        ]}
      >
        <p>What I&apos;m good at:</p>
        <ul className="-mt-2 flex flex-col gap-1">
          {skills.map((s) => (
            <li key={s} className="flex gap-2">
              <span className="text-faint">–</span>
              {s}
            </li>
          ))}
        </ul>
        {offScreen.map((s) => (
          <p key={s}>{s}</p>
        ))}
        <p>
          A{" "}
          <a className="link" href={profile.calendly} target="_blank" rel="noreferrer">
            30-minute call
          </a>{" "}
          is the fastest way to talk. Page turning bothering you? <TextButton onClick={onSettings}>Settings</TextButton>.
        </p>
      </InfoPanel>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="px-0.5 text-[13px] font-medium leading-[19.5px] text-muted">{title}</h3>
      <ol className="flex flex-col rounded-[16px] bg-card px-4 shadow-card">{children}</ol>
    </div>
  );
}

export function SearchIcon({ className = "text-faint" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { featured, projects, type Project } from "@/content/projects";
import { education, experience, offScreen, profile, skills, tools } from "@/content/profile";
import { Monogram, ProjectIcon } from "./project-icon";
import { Stage } from "./stage";

const sectionClass =
  "flex flex-col gap-4 lg:h-[calc(100svh-16px)] lg:snap-start lg:scroll-mt-2 lg:flex-row lg:gap-6";

/* ---------- Shared right-hand panel ---------- */

function InfoPanel({
  header,
  children,
  facts,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  facts?: { label: string; value: string }[];
}) {
  return (
    <aside className="flex shrink-0 flex-col gap-5 px-2 pb-4 lg:w-[300px] lg:overflow-y-auto lg:px-0 lg:pr-2 no-scrollbar">
      <div className="self-start rounded-xl border border-line bg-raised px-3 py-2 shadow-card">{header}</div>
      <div className="flex flex-col gap-4 text-[15px] leading-[1.6] text-ink-2">{children}</div>
      {facts && facts.length > 0 && (
        <dl className="mt-auto flex flex-col">
          {facts.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-4 border-t border-line py-3">
              <dt className="label">{f.label}</dt>
              <dd className="text-right text-[14px] text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}

/* ---------- Project ---------- */

export function ProjectSection({ project }: { project: Project }) {
  return (
    <section id={project.slug} data-section className={sectionClass}>
      <div className="min-w-0 flex-1">
        <Stage project={project} />
      </div>
      <InfoPanel
        facts={project.facts}
        header={
          <div className="flex items-center gap-2.5">
            <ProjectIcon project={project} size={28} />
            <div className="leading-tight">
              <div className="text-[14px] font-medium">{project.title}</div>
              <div className="text-[12px] text-muted">{project.client}</div>
            </div>
          </div>
        }
      >
        {project.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </InfoPanel>
    </section>
  );
}

/* ---------- Home ---------- */

const formatTime = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone }).format(
    new Date(),
  );

function subscribeMinute(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

/** Local time where I live; empty on the server so it never mismatches. */
function useLocalTime() {
  return useSyncExternalStore(subscribeMinute, formatTime, () => null);
}

export function HomeSection({ onJump, onSearch }: { onJump: (slug: string) => void; onSearch: () => void }) {
  const time = useLocalTime();
  const cards = featured.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <section id="home" data-section className={sectionClass}>
      <div className="dot-grid relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-panel">
        <div className="flex items-center justify-between px-6 pt-5">
          <span className="flex items-center gap-2 text-[13px] text-ink-2">
            <span
              className="size-2 rounded-full bg-green-500"
              style={{ animation: "pulse-dot 2.4s ease-in-out infinite" }}
            />
            {profile.status}
          </span>
          <span className="label">
            {profile.location.split(",")[0]} {time ? `· ${time}` : ""}
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center gap-8 px-6 py-12">
          <div className="rise flex flex-col gap-4">
            <h1 className="text-[clamp(34px,4.4vw,52px)] font-semibold leading-[1.02] tracking-[-0.035em]">
              {profile.oneLiner.split(". ")[0]}.
              <br />
              <span className="text-muted">{profile.oneLiner.split(". ")[1]}</span>
            </h1>
            <p className="max-w-[460px] text-[16px] leading-[1.6] text-ink-2">{profile.intro}</p>
          </div>

          <button
            onClick={onSearch}
            className="rise group flex items-center gap-3 rounded-xl border border-line-strong bg-raised px-4 py-3 text-left shadow-card transition-[box-shadow,translate] duration-500 ease-out-quint hover:-translate-y-0.5"
            style={{ animationDelay: "80ms" }}
          >
            <SearchIcon />
            <span className="flex-1 text-[15px] text-muted">Jump to a project…</span>
            <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">⌘K</kbd>
          </button>

          <div className="rise flex flex-col gap-3" style={{ animationDelay: "160ms" }}>
            <span className="label">Selected</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {cards.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onJump(p.slug)}
                  className="flex flex-col gap-2 rounded-xl border border-line bg-raised p-3.5 text-left shadow-card transition-[box-shadow,translate] duration-500 ease-out-quint hover:-translate-y-1"
                >
                  <ProjectIcon project={p} size={26} />
                  <span className="mt-1 text-[14px] font-medium">{p.title}</span>
                  <span className="text-[13px] leading-snug text-muted">{p.tagline}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-6 pb-5">
          {profile.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-[13px] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <InfoPanel
        header={
          <div className="flex items-center gap-2.5">
            <Monogram size={22} />
            <div className="leading-tight">
              <div className="text-[14px] font-medium">{profile.name}</div>
              <div className="text-[12px] text-muted">{profile.location}</div>
            </div>
          </div>
        }
        facts={profile.numbers.map((n) => ({ label: n.label, value: n.value }))}
      >
        <p>
          Every project here is a tab on the left. Scroll and the pages turn; press{" "}
          <kbd className="font-mono text-[13px]">⌘K</kbd> to jump.
        </p>
        <p>{profile.statusDetail}</p>
        <p>
          Fastest way to talk:{" "}
          <a className="text-ink underline decoration-line-strong underline-offset-4" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>{" "}
          or a{" "}
          <a
            className="text-ink underline decoration-line-strong underline-offset-4"
            href={profile.calendly}
            target="_blank"
            rel="noreferrer"
          >
            30-minute call
          </a>
          .
        </p>
      </InfoPanel>
    </section>
  );
}

/* ---------- About ---------- */

export function AboutSection() {
  return (
    <section id="about" data-section className={sectionClass}>
      <div className="min-w-0 flex-1 overflow-y-auto rounded-[14px] border border-line bg-panel no-scrollbar">
        <div className="mx-auto flex max-w-[640px] flex-col gap-10 px-6 py-12">
          <div className="flex flex-col gap-3">
            <span className="label">Experience</span>
            <ol className="flex flex-col">
              {experience.map((e) => (
                <li key={e.company} className="grid grid-cols-[96px_1fr] gap-4 border-t border-line py-4">
                  <span className="font-mono text-[12px] text-muted">{e.years}</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-medium">{e.company}</span>
                    <span className="text-[13px] text-muted">{e.role}</span>
                    <span className="text-[14px] leading-relaxed text-ink-2">{e.work}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <span className="label">Education</span>
            <ol className="flex flex-col">
              {education.map((e) => (
                <li key={e.what} className="grid grid-cols-[96px_1fr] gap-4 border-t border-line py-3">
                  <span className="font-mono text-[12px] text-muted">{e.years}</span>
                  <div className="flex flex-col">
                    <span className="text-[14px]">{e.what}</span>
                    <span className="text-[13px] text-muted">{e.where}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <span className="label">Tools</span>
            <dl className="flex flex-col">
              {tools.map((t) => (
                <div key={t.group} className="grid grid-cols-[96px_1fr] gap-4 border-t border-line py-3">
                  <dt className="font-mono text-[12px] text-muted">{t.group}</dt>
                  <dd className="text-[14px] text-ink-2">{t.items}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <InfoPanel
        header={
          <div className="leading-tight">
            <div className="text-[14px] font-medium">About</div>
            <div className="text-[12px] text-muted">Experience & CV</div>
          </div>
        }
        facts={[{ label: "Languages", value: "UA, EN, RU, PL" }]}
      >
        <p>What I&apos;m good at:</p>
        <ul className="-mt-2 flex flex-col gap-1.5">
          {skills.map((s) => (
            <li key={s} className="flex gap-2">
              <span className="text-signal">—</span>
              {s}
            </li>
          ))}
        </ul>
        <p className="label mt-2">Off-screen</p>
        {offScreen.map((s) => (
          <p key={s} className="-mt-2">
            {s}
          </p>
        ))}
      </InfoPanel>
    </section>
  );
}

export function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted" aria-hidden>
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

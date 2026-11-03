/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { IconCursor } from "@/components/v5/icons";
import { v5, v5About, v5Work } from "@/content/v5";

export const metadata: Metadata = { title: "About" };

/** About, in the design system (no final Figma frame yet; laid out after the kirill.si About kept in the file's
 * archive): one narrow column, the story set large, Oleh's photo as a print, then titled lists, then a way to write. */
export default function V5About() {
  const [lead, ...rest] = v5About.intro;
  return (
    <div className="v5-about">
      <div className="v5-about-lead">
        <h1 className="v5-sr">About {v5.name}</h1>
        <p className="v5-about-big">{lead}</p>
        {rest.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>

      <figure className="v5-about-print" data-cursor="Hi">
        <img src="/v5/sprite/intro.png" alt={v5.name} width={1344} height={768} />
      </figure>

      <Section title="Experience">
        {v5About.jobs.map(job => (
          <li key={job.company} className="v5-about-row">
            <b>{job.href ? <a href={job.href} target="_blank" rel="noopener noreferrer" data-cursor="Visit site">{job.company}</a> : job.company}</b>
            <span>{job.role}</span>
            <time>{job.dates}</time>
          </li>
        ))}
      </Section>

      <Section title="How I work">
        {v5About.principles.map(([term, line]) => (
          <li key={term} className="v5-about-row"><b>{term.replace(/\.$/, "")}</b><span>{line}</span></li>
        ))}
      </Section>

      <Section title="Skills">
        {v5About.skills.map(skill => <li key={skill} className="v5-about-row"><b>{skill}</b></li>)}
      </Section>

      <Section title="Tools">
        {v5About.tools.map(group => (
          <li key={group.label} className="v5-about-row"><b>{group.items.join(", ")}</b><span>{group.label}</span></li>
        ))}
      </Section>

      <Section title="Selected work">
        {v5Work.map(work => (
          <li key={work.slug} className="v5-about-row">
            <b>{work.external
              ? <a href={work.href} target="_blank" rel="noopener noreferrer" data-cursor="Visit site">{work.title}</a>
              : <Link href={work.href} data-cursor="View project">{work.title}</Link>}</b>
            <span>{work.meta}</span>
          </li>
        ))}
      </Section>

      <Section title="Education and languages">
        {v5About.education.map(item => (
          <li key={item.what} className="v5-about-row"><b>{item.what}</b><span>{item.where}</span><time>{item.years}</time></li>
        ))}
        <li className="v5-about-row"><b>Languages</b><span>{v5About.languages.map(language => `${language.name}, ${language.level}`).join(" · ")}</span></li>
      </Section>

      <div className="v5-about-cta">
        <a className="v5-btn" data-style="primary" data-size="lg" href={`mailto:${v5.email}`}><IconCursor />Contact Me</a>
        <a className="v5-btn" data-style="secondary" data-size="lg" href={v5About.calendly} target="_blank" rel="noopener noreferrer">Book a call</a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="v5-about-section" aria-label={title}>
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
}

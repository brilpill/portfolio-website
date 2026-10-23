"use client";

import { ArrowUpRightIcon, EnvelopeSimpleIcon, GithubLogoIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { aboutIntro, principles, skillChips, contentJobs } from "@/content/portfolio-content";

function Heading({ id, eyebrow, title, description, draft = false }: { id: string; eyebrow: string; title: string; description?: string; draft?: boolean }) {
  return <header className="content-heading"><span className="content-kicker">{eyebrow}</span><h1 id={id} tabIndex={-1} data-slide-heading>{title}</h1>{description && <p>{description}</p>}{draft && <Badge variant="outline">Working draft</Badge>}</header>;
}

export function AboutSlide() {
  return <section className="content-slide about-slide" aria-labelledby="about-heading">
    <Heading id="about-heading" eyebrow="01 / About me" title="A little more about me." draft />
    <div className="about-copy">{aboutIntro.map(text => <p key={text}>{text}</p>)}</div>
    <section className="content-section"><span className="content-kicker">How I think</span><h2>Principles I work by.</h2><div className="principle-list">{principles.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
    <section className="content-section"><span className="content-kicker">What I work on</span><h2>From first flow to final feel.</h2><div className="content-chips">{skillChips.map(skill => <Badge variant="secondary" key={skill}>{skill}</Badge>)}</div></section>
    <section className="content-section"><span className="content-kicker">Activity</span><h2>What I’ve been building.</h2><p>Code, experiments and personal projects.</p><a className="content-text-link" href="https://github.com/brilpill" target="_blank" rel="noreferrer"><GithubLogoIcon size={18} aria-hidden />View GitHub activity<ArrowUpRightIcon size={16} aria-hidden /></a></section>
  </section>;
}

export function ExperienceSlide() {
  return <section className="content-slide" aria-labelledby="experience-heading"><Heading id="experience-heading" eyebrow="02 / Experience" title="A few places I’ve worked." description="Web and mobile products, studios and product teams." draft /><div className="experience-list">{contentJobs.map(job => <article key={job.company}><span className="experience-dates">{job.dates}</span><div><h2>{job.company}</h2><span className="experience-role">{job.role}</span><p>{job.detail}</p></div></article>)}</div></section>;
}

export function ContactSlide() {
  return <section className="content-slide contact-slide" aria-labelledby="contact-heading"><Heading id="contact-heading" eyebrow="04 / Contact" title="Let’s talk about your project." description="Hiring, or have a product to design? Tell me a bit about it." /><div className="contact-doors"><a href="mailto:briloleh@gmail.com"><EnvelopeSimpleIcon size={24} aria-hidden /><span><span>Email me</span><strong>briloleh@gmail.com</strong></span><ArrowUpRightIcon size={20} aria-hidden /></a><a href="https://t.me/brilpill" target="_blank" rel="noreferrer"><PaperPlaneTiltIcon size={24} aria-hidden /><span><span>Message me on Telegram</span><strong>@brilpill</strong></span><ArrowUpRightIcon size={20} aria-hidden /></a></div><footer className="content-footer"><h2>I design how products look, move and feel, and I build them that way.</h2><div>{[["LinkedIn", "https://www.linkedin.com/in/olehbril/"], ["GitHub", "https://github.com/brilpill"], ["Pinterest", "https://www.pinterest.com/brilpill/"]].map(([label, href]) => <a href={href} key={label} target="_blank" rel="noreferrer">{label}<ArrowUpRightIcon size={14} aria-hidden /></a>)}</div><p>© 2026 Oleh Bril · Warsaw</p></footer></section>;
}

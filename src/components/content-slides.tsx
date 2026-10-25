"use client";

import { ArrowUpRightIcon, EnvelopeSimpleIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
export { AboutSlide } from "./about-slide";
export { ExperienceSlide } from "./experience-slide";

function Heading({ id, eyebrow, title, description, draft = false }: { id: string; eyebrow: string; title: string; description?: string; draft?: boolean }) {
  return <header className="content-heading"><span className="content-kicker">{eyebrow}</span><h1 id={id} tabIndex={-1} data-slide-heading>{title}</h1>{description && <p>{description}</p>}{draft && <Badge variant="outline">Working draft</Badge>}</header>;
}

export function ContactSlide() {
  return <section className="content-slide contact-slide" aria-labelledby="contact-heading"><Heading id="contact-heading" eyebrow="04 / Contact" title="Let’s talk about your project." description="Hiring, or have a product to design? Tell me a bit about it." /><div className="contact-doors"><a href="mailto:briloleh@gmail.com"><EnvelopeSimpleIcon size={24} aria-hidden /><span><span>Email me</span><strong>briloleh@gmail.com</strong></span><ArrowUpRightIcon size={20} aria-hidden /></a><a href="https://t.me/brilpill" target="_blank" rel="noreferrer"><PaperPlaneTiltIcon size={24} aria-hidden /><span><span>Message me on Telegram</span><strong>@brilpill</strong></span><ArrowUpRightIcon size={20} aria-hidden /></a></div><footer className="content-footer"><h2>I design how products look, move and feel, and I build them that way.</h2><div>{[["LinkedIn", "https://www.linkedin.com/in/olehbril/"], ["GitHub", "https://github.com/brilpill"], ["Pinterest", "https://www.pinterest.com/brilpill/"]].map(([label, href]) => <a href={href} key={label} target="_blank" rel="noreferrer">{label}<ArrowUpRightIcon size={14} aria-hidden /></a>)}</div><p>© 2026 Oleh Bril · Warsaw</p></footer></section>;
}

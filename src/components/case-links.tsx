"use client";

import { useId } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { AppleLogoIcon, ArrowRightIcon, ArrowUpRightIcon, FigmaLogoIcon, GlobeSimpleIcon, GooglePlayLogoIcon, LinkSimpleIcon, type Icon } from "@phosphor-icons/react";
import type { ProjectSlideContent } from "@/content/project-slides";
import { motionTokens } from "@/lib/motion";
import { playCue } from "./ui-sound";

type Props = { project: ProjectSlideContent };

/**
 * Case links at the foot of the details column. Outside links are rows like the assistant's suggested
 * questions: a grey fill on hover and thin dividers between them; the full case study, when there is one,
 * is the single filled button underneath. Only links that have been added are shown; with none, nothing is.
 */
export function CaseLinks({ project }: Props) {
  const links: { label: string; href?: string; icon: Icon }[] = [
    { label: "Website", href: project.webUrl, icon: GlobeSimpleIcon },
    { label: "App Store", href: project.appStoreUrl, icon: AppleLogoIcon },
    { label: "Google Play", href: project.googlePlayUrl, icon: GooglePlayLogoIcon },
    { label: "Figma", href: project.figmaUrl, icon: FigmaLogoIcon },
    { label: "Other link", href: project.otherUrl, icon: LinkSimpleIcon },
  ];
  const shown = links.filter((link): link is typeof link & { href: string } => Boolean(link.href));
  if (!shown.length && !project.caseStudyUrl) return null;

  return (
    <div className="case-links" role="group" aria-label={`${project.title} links`}>
      {shown.length > 0 && (
        <ul className="case-link-list">
          {shown.map(({ label, href, icon: LinkIcon }) => (
            <li key={label}>
              <a className="case-link" href={href} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="case-link-icon" size={16} aria-hidden />
                <span className="case-link-label">{label}</span>
                <ArrowUpRightIcon className="case-link-arrow" size={14} aria-hidden />
                <span className="home-sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {project.caseStudyUrl && (project.caseStudyDraft ? <CaseStudyDraft /> : <CaseStudyLink href={project.caseStudyUrl} />)}
    </div>
  );
}

/**
 * The one emphasised link. It leans a few px toward the pointer on the shared spring, and the arrow
 * leans further, so the button feels like it answers the cursor. Touch and reduced motion keep it still.
 */
function CaseStudyLink({ href }: { href: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0), arrow = useMotionValue(0);
  const springX = useSpring(x, motionTokens.spring), springY = useSpring(y, motionTokens.spring), springArrow = useSpring(arrow, motionTokens.spring);
  const pull = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce || event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - box.left - box.width / 2) / (box.width / 2);
    const dy = (event.clientY - box.top - box.height / 2) / (box.height / 2);
    x.set(dx * 4); y.set(dy * 3); arrow.set(3 + dx * 3);
  };
  const release = () => { x.set(0); y.set(0); arrow.set(0); };
  return (
    <motion.a className="case-study-link" href={href} style={{ x: springX, y: springY }} whileTap={reduce ? undefined : { scale: .98 }} onPointerMove={pull} onPointerLeave={release}>
      <span>Read the case study</span>
      <motion.span className="case-study-arrow" style={{ x: springArrow }} aria-hidden><ArrowRightIcon size={16} /></motion.span>
    </motion.a>
  );
}

/**
 * A case study still being written: the same button, dimmed and inert, with a small note above it on hover or
 * keyboard focus. Pressing it plays the error cue instead of navigating.
 */
function CaseStudyDraft() {
  const note = useId();
  return (
    <span className="case-study-link" data-draft role="link" aria-disabled="true" aria-describedby={note} tabIndex={0}
      onClick={() => playCue("error")} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); playCue("error"); } }}>
      <span>Read the case study</span>
      <span className="case-study-arrow" aria-hidden><ArrowRightIcon size={16} /></span>
      <span id={note} role="tooltip" className="case-study-note">Case study under development</span>
    </span>
  );
}

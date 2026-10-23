import Image from "next/image";
import { ArrowRightIcon, ArrowUpRightIcon, type Icon } from "@phosphor-icons/react";
import type { ProjectSlideContent } from "@/content/project-slides";
import { Button } from "@/components/ui/button";
import { CaseMedia } from "./case-media";

type Props = {
  project: ProjectSlideContent;
  icon: Icon;
  overviewHidden?: boolean;
  /** "facts": the quiet-facts details column (option B, experiment). */
  sidebar?: "classic" | "facts";
};

/** Shared project layout. Copy and media are deliberately supplied through content data. */
export function ProjectSlide({ project, icon: ProjectIcon, overviewHidden = false, sidebar = "classic" }: Props) {
  const links = [
    { label: "Figma", href: project.figmaUrl },
    { label: "Weblink", href: project.webUrl },
    { label: "Other link", href: project.otherUrl },
  ];
  return (
    <section className="project-slide" aria-labelledby={`project-${project.slug}`}>
      <div className="project-layout" data-overview-hidden={overviewHidden || undefined}>
        {overviewHidden && <h1 id={`project-${project.slug}`} className="home-sr-only" tabIndex={-1} data-slide-heading>{project.title}: {project.format}</h1>}
        <div className="project-media" aria-label={`${project.title} visuals`}>
          {project.media.map((media, index) => <CaseMedia key={index} media={media} />)}
        </div>
        {sidebar === "facts" ? <CaseFacts project={project} icon={ProjectIcon} hidden={overviewHidden} /> :
        <aside hidden={overviewHidden} className="project-info" aria-label={`${project.title} details`}>
          <div className="project-badge">
            <span className={`project-badge-icon${project.logo ? " has-logo" : ""}`}>
              {project.logo ? <Image src={project.logo} alt="" width={16} height={16} /> : <ProjectIcon size={18} aria-hidden />}
            </span>
            <span className="project-badge-text"><span>{project.title}</span><span>{project.website || project.format}</span></span>
          </div>
          <div className="project-story"><span className="project-draft-label">Sample content · project facts pending</span>
            <div className="project-overview">
              <h1 id={overviewHidden ? undefined : `project-${project.slug}`} tabIndex={-1} data-slide-heading>{project.title}: {project.format}</h1>
              {project.overview ? <p>{project.overview}</p> : <div className="project-overview-space" aria-label="Overview not added yet" />}
            </div>
            <dl className="project-facts">
              <div><dt>My role</dt><dd>{project.role || "—"}</dd></div>
              <div><dt>Timeline - Year</dt><dd>{project.timeline || "—"}</dd></div>
              <div><dt>Industry</dt><dd>{project.industry || "—"}</dd></div>
            </dl>
            <div className="project-resource-links" role="group" aria-label={`${project.title} links`}>
              {links.map(({ label, href }) => {
                const content = <><span className="project-resource-label">{label}</span><span className="project-resource-open">Open<Image src="/figma/project-links/arrow-up-right.svg" alt="" width={14} height={14} /></span></>;
                return href ? (
                  <Button key={label} variant="quiet" className="project-resource-row" nativeButton={false} role="link" render={<a href={href} target="_blank" rel="noopener noreferrer" />} aria-label={`Open ${project.title} ${label}`}>{content}</Button>
                ) : (
                  <div key={label} className="project-resource-unavailable" title={`${label} link has not been added yet`}>
                    <Button variant="quiet" className="project-resource-row" disabled aria-label={`Open ${project.title} ${label}`}>{content}</Button>
                  </div>
                );
              })}
            </div>
          </div>

        </aside>}
      </div>
    </section>
  );
}

/**
 * Option B, "quiet facts": identity (logo or tinted icon), one title, a short summary, four facts and thin
 * actions. "Open case study" appears only for cases that have one; external links show only when filled in.
 */
function CaseFacts({ project, icon: ProjectIcon, hidden }: { project: ProjectSlideContent; icon: Icon; hidden: boolean }) {
  const facts: [string, string | undefined][] = [
    ["Role", project.role],
    ["Year", project.timeline],
    ["Platform", project.platform ?? (project.group === "Mobile" ? "iOS, Android" : "Web")],
    ["Status", project.status],
  ];
  const links = [
    { label: "Figma", href: project.figmaUrl },
    { label: "Live", href: project.webUrl },
    { label: "App Store", href: project.appStoreUrl },
    { label: "Google Play", href: project.playStoreUrl },
    { label: "More", href: project.otherUrl },
  ].filter(link => link.href);
  return <aside hidden={hidden} className="project-info case-facts" aria-label={`${project.title} details`}>
    <div className="case-facts-id">
      <span className="case-facts-tile" style={project.tint ? { background: project.tint } : undefined}>
        {project.logo ? <Image src={project.logo} alt="" width={24} height={24} /> : <ProjectIcon aria-hidden />}
      </span>
      <span><span className="case-facts-name">{project.title}</span><span className="case-facts-line">{project.oneLiner ?? project.format}</span></span>
    </div>
    <h1 id={hidden ? undefined : `project-${project.slug}`} className="case-facts-title" tabIndex={-1} data-slide-heading>{project.headline ?? `${project.title}: ${project.format}`}</h1>
    {project.summary && <p className="case-facts-summary">{project.summary}</p>}
    <dl className="case-facts-list">
      {facts.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd data-status={label === "Status" ? value : undefined}>{value}</dd></div>)}
    </dl>
    {(project.caseStudyUrl || links.length > 0) && <div className="case-facts-actions">
      {project.caseStudyUrl && <Button variant="outline" size="sm" className="case-facts-open" nativeButton={false} render={<a href={project.caseStudyUrl} />}>Open case study<ArrowRightIcon data-icon="inline-end" aria-hidden /></Button>}
      {links.map(({ label, href }) => <a key={label} className="case-facts-link" href={href} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRightIcon size={12} aria-hidden /></a>)}
    </div>}
  </aside>;
}

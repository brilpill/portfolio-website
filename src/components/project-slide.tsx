import Image from "next/image";
import { type Icon } from "@phosphor-icons/react";
import type { ProjectSlideContent } from "@/content/project-slides";
import { CaseLinks } from "./case-links";
import { CaseMedia } from "./case-media";

type Props = {
  project: ProjectSlideContent;
  icon: Icon;
  overviewHidden?: boolean;
};

/** Shared project layout. Copy and media are deliberately supplied through content data. */
export function ProjectSlide({ project, icon: ProjectIcon, overviewHidden = false }: Props) {
  return (
    <section className="project-slide" aria-labelledby={`project-${project.slug}`}>
      <div className="project-layout" data-overview-hidden={overviewHidden || undefined}>
        {overviewHidden && <h1 id={`project-${project.slug}`} className="home-sr-only" tabIndex={-1} data-slide-heading>{project.title}: {project.format}</h1>}
        <div className="project-media" aria-label={`${project.title} visuals`}>
          {project.media.map((media, index) => <CaseMedia key={index} media={media} />)}
        </div>
        <aside hidden={overviewHidden} className="project-info" aria-label={`${project.title} details`}>
          <div className="project-badge">
            <span className={`project-badge-icon${project.logo ? " has-logo" : ""}`} style={project.tint && !project.logo ? { background: project.tint } : undefined}>
              {project.logo ? <Image src={project.logo} alt="" width={16} height={16} /> : <ProjectIcon size={18} aria-hidden />}
            </span>
            <span className="project-badge-text"><span>{project.title}</span><span>{project.website || project.format}</span></span>
          </div>
          <div className="project-story"><span className="project-draft-label">Sample content · project facts pending</span>
            <div className="project-overview">
              <h1 id={overviewHidden ? undefined : `project-${project.slug}`} tabIndex={-1} data-slide-heading>{project.headline ?? `${project.title}: ${project.format}`}</h1>
              {project.overview ? <p>{project.overview}</p> : <div className="project-overview-space" aria-label="Overview not added yet" />}
            </div>
            <dl className="project-facts">
              <div><dt>My role</dt><dd>{project.role || "—"}</dd></div>
              <div><dt>Timeline - Year</dt><dd>{project.timeline || "—"}</dd></div>
              <div><dt>Industry</dt><dd>{project.industry || "—"}</dd></div>
            </dl>
            <CaseLinks project={project} />
          </div>

        </aside>
      </div>
    </section>
  );
}


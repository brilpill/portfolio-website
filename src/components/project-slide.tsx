import type { ProjectSlideContent } from "@/content/project-slides";
import { CaseLinks } from "./case-links";
import { CaseMedia } from "./case-media";

type Props = {
  project: ProjectSlideContent;
  overviewHidden?: boolean;
};

/** Shared project layout. Copy and media are deliberately supplied through content data. */
export function ProjectSlide({ project, overviewHidden = false }: Props) {
  return (
    <section className="project-slide" aria-labelledby={`project-${project.slug}`}>
      <div className="project-layout" data-overview-hidden={overviewHidden || undefined}>
        {overviewHidden && <h2 id={`project-${project.slug}`} className="home-sr-only" tabIndex={-1} data-slide-heading>{project.title}: {project.format}</h2>}
        <div className="project-media" aria-label={`${project.title} visuals`}>
          {project.media.map((media, index) => <CaseMedia key={index} media={media} />)}
        </div>
        {/* With the assistant open the column slides shut (CSS) and is taken out of focus and the reading order. */}
        <aside inert={overviewHidden || undefined} className="project-info" aria-label={`${project.title} details`}>
          <div className="project-story"><span className="project-draft-label">Sample content · project facts pending</span>
            <div className="project-overview">
              <h2 id={overviewHidden ? undefined : `project-${project.slug}`} tabIndex={-1} data-slide-heading>{project.headline ?? `${project.title}: ${project.format}`}</h2>
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


import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseMedia } from "@/components/case-media";
import { CaseNumbers } from "@/components/case-numbers";
import { CaseStudyViewer, FigureExpand } from "@/components/case-study-viewer";
import { CaseToc } from "@/components/v5/case-toc";
import { IconChevronEnd } from "@/components/v5/icons";
import { caseStudyOf, type CaseStudyChapter, type CaseStudyFigure } from "@/content/case-studies";
import { projectSlides } from "@/content/project-slides";
import { v5Featured, v5Work } from "@/content/v5";
import { viewerItems, withSource } from "@/lib/case-figures";
import "../../../cases/[slug]/case-study.css";

export function generateStaticParams() {
  return v5Work.filter(item => !item.external && caseStudyOf(item.slug)).map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v5/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectSlides.find(item => item.slug === slug);
  return { title: project?.title ?? "Project" };
}

/** A figure: the main site's case media (drawn devices, comparisons, live demos) on the design system's surface, with
 * the expand button that opens it in the v5 viewer. */
function Figure({ media }: { media: CaseStudyFigure }) {
  const items = viewerItems(media);
  return (
    <div className="case-study-figure v5-case-figure" data-framed={(media.kind === "image" && !media.scroll) || undefined} data-grid={media.kind === "components" || undefined}>
      <CaseMedia media={{ ...withSource(media), caption: undefined }} />
      {items.length > 0 && <FigureExpand items={items} label={media.kind === "video" ? "Play larger" : "Expand image"} />}
    </div>
  );
}

/** A paragraph in text/secondary: `strong` lifts a phrase to text/primary, `highlight` marks one in the selection
 * colours (selection/bg behind selection/text), so it reads like text someone selected. */
function Paragraph({ body, strong, highlight, className }: { body: string; strong?: string; highlight?: { text: string }; className?: string }) {
  const marks = [
    ...(strong && body.includes(strong) ? [{ text: strong, kind: "strong" as const }] : []),
    ...(highlight && body.includes(highlight.text) ? [{ text: highlight.text, kind: "mark" as const }] : []),
  ].sort((a, b) => body.indexOf(a.text) - body.indexOf(b.text));
  const parts: ReactNode[] = [];
  let rest = body;
  for (const mark of marks) {
    const at = rest.indexOf(mark.text);
    if (at < 0) continue;
    parts.push(rest.slice(0, at));
    parts.push(mark.kind === "strong" ? <strong key={mark.text}>{mark.text}</strong> : <mark key={mark.text}>{mark.text}</mark>);
    rest = rest.slice(at + mark.text.length);
  }
  parts.push(rest);
  return <p className={className}>{parts}</p>;
}

function Chapter({ chapter }: { chapter: CaseStudyChapter }) {
  return (
    <section id={chapter.id} className="v5-chapter" aria-labelledby={`${chapter.id}-title`}>
      <div className="v5-chapter-copy">
        <p className="v5-chapter-label">{chapter.label}</p>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <Paragraph className="v5-chapter-body" body={chapter.body} strong={chapter.strong} highlight={chapter.highlight} />
        {chapter.lesson && <p className="v5-chapter-lesson"><span>Lesson</span>{chapter.lesson}</p>}
      </div>
      {chapter.numbers && <div className="v5-chapter-numbers"><CaseNumbers items={chapter.numbers} layout={chapter.numbersLayout} /></div>}
      {chapter.figures?.map((media, index) => <Figure key={index} media={media} />)}
      {chapter.pair && (
        <div className="v5-pair">
          {chapter.pair.map((item, index) => (
            <div key={index}>
              {(item.label || item.title || item.body) && (
                <div className="v5-pair-copy">
                  {item.label && <p className="v5-chapter-label">{item.label}</p>}
                  {item.title && <h3>{item.title}</h3>}
                  {item.body && <p>{item.body}</p>}
                </div>
              )}
              <Figure media={item.media} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** A case study in the v5 design system: the story's header (project and year, h1 title, intro, details), the hero
 * figure, then each chapter (label, h3-sized title, body, lesson, numbers, figures), and the next case. */
export default async function V5Project({ params }: PageProps<"/v5/projects/[slug]">) {
  const { slug } = await params;
  const project = projectSlides.find(item => item.slug === slug);
  const study = caseStudyOf(slug);
  const work = v5Work.find(item => item.slug === slug);
  if (!project || project.archived || !study || !work) notFound();

  const toc = [{ id: "overview", label: "Overview" }, ...study.chapters.map(chapter => ({ id: chapter.id, label: chapter.label }))];
  // Next case: the one after this in the home grid's order, among those with a v5 case page (wrapping round).
  const cases = v5Featured.filter(item => item.href?.startsWith("/v5/projects/"));
  const here = cases.findIndex(item => item.href === `/v5/projects/${slug}`);
  const next = cases.length > 1 ? cases[(here + 1) % cases.length] : undefined;
  const details = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: [study.duration, study.year].filter(Boolean).join(", ") || project.timeline },
    { label: "Industry", value: project.industry },
  ].filter(item => item.value);

  return (
    <CaseStudyViewer title={`${project.title} case study images`} variant="v5">
      <article className="v5-case">
        <CaseToc items={toc} />

        <header id="overview" className="v5-case-head">
          <p className="v5-case-kicker">{project.title}{study.year && <span>{study.year}</span>}</p>
          <h1 className="v5-case-title">{study.title}</h1>
          <Paragraph className="v5-case-intro" body={study.intro} highlight={study.introHighlight} />
          {details.length > 0 && (
            <dl className="v5-case-meta">
              {details.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
            </dl>
          )}
        </header>

        <div className="v5-case-hero"><Figure media={study.hero} /></div>

        {study.chapters.map(chapter => <Chapter key={chapter.id} chapter={chapter} />)}

        {next && (
          <Link className="v5-case-next" href={next.href!} data-cursor="Next case">
            <span className="v5-chapter-label">Next case</span>
            <b>{next.client}</b>
            <em>{next.type}</em>
            <span className="v5-btn" data-style="primary" aria-hidden>Open case<IconChevronEnd /></span>
          </Link>
        )}
      </article>
    </CaseStudyViewer>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CalendarBlankIcon, ChargingStationIcon, ClockIcon, LockSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { CaseMedia } from "@/components/case-media";
import { CaseStudyFrame } from "@/components/case-study-frame";
import { CaseStudyViewer, FigureExpand } from "@/components/case-study-viewer";
import type { ViewerItem } from "@/components/media-viewer";
import { caseStudies, caseStudyOf, type CaseStudy, type CaseStudyChapter, type CaseStudyFigure } from "@/content/case-studies";
import { projectSlides } from "@/content/project-slides";
import "./case-study.css";

// The sidebar icon of each case that has a study; it matches the icon in the portfolio sidebar.
const icons: Record<string, Icon> = { luminasset: ChargingStationIcon };

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectSlides.find(item => item.slug === slug);
  const study = caseStudyOf(slug);
  return project && study ? { title: `${project.title} case study · Oleh Bril`, description: study.intro } : {};
}

/** Every figure's media in reading order, for the full-screen viewer, and where each figure starts in it. */
function viewerSet(study: CaseStudy) {
  const items: ViewerItem[] = [];
  const starts = new Map<CaseStudyFigure, number>();
  const add = (media: CaseStudyFigure) => {
    starts.set(media, items.length);
    if (media.kind === "image") items.push({ src: media.src, alt: media.alt });
    else if (media.kind === "video") items.push(media.src ? { kind: "video", src: media.src, poster: media.poster, alt: media.posterAlt } : { src: media.poster, alt: media.posterAlt });
    else items.push(...media.screens.map(({ src, alt }) => ({ src, alt })));
  };
  add(study.hero);
  for (const chapter of study.chapters) {
    chapter.figures?.forEach(add);
    chapter.pair?.forEach(item => add(item.media));
  }
  return { items, starts };
}

function Figure({ media, start }: { media: CaseStudyFigure; start?: number }) {
  // Images sit framed inside the grey; mockups and clips use the whole frame, as on the case slides.
  return (
    <div className="case-study-figure" data-framed={media.kind === "image" || undefined}>
      <CaseMedia media={{ ...media, caption: undefined }} />
      {start !== undefined && <FigureExpand index={start} label={media.kind === "video" ? "Play larger" : "Expand image"} />}
    </div>
  );
}

function Paragraph({ body, strong }: { body: string; strong?: string }) {
  const at = strong ? body.indexOf(strong) : -1;
  if (!strong || at < 0) return <p>{body}</p>;
  return <p>{body.slice(0, at)}<strong>{strong}</strong>{body.slice(at + strong.length)}</p>;
}

function Chapter({ chapter, starts }: { chapter: CaseStudyChapter; starts: Map<CaseStudyFigure, number> }) {
  return (
    <section id={chapter.id} className="case-study-chapter" aria-labelledby={`${chapter.id}-title`}>
      <div className="case-study-copy">
        <p className="case-study-label">{chapter.label}</p>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <Paragraph body={chapter.body} strong={chapter.strong} />
      </div>
      {chapter.figures?.map((media, index) => <Figure key={index} media={media} start={starts.get(media)} />)}
      {chapter.pair && (
        <div className="case-study-pair">
          {chapter.pair.map(item => (
            <div key={item.title}>
              <div className="case-study-copy">
                <p className="case-study-label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <Figure media={item.media} start={starts.get(item.media)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** A full case study (Figma 1001:1859): header, a large figure, chapters with their figures, and the next case. */
export default async function CaseStudyPage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const study = caseStudyOf(slug);
  const project = projectSlides.find(item => item.slug === slug);
  if (!study || !project) notFound();
  const ProjectIcon = icons[slug] ?? ChargingStationIcon;
  const back = { href: `/#${slug}`, label: project.title };
  const { items, starts } = viewerSet(study);

  return (
    <CaseStudyFrame back={back} sections={[{ id: "overview", label: "Overview", title: study.title }, ...study.chapters.map(({ id, label, title }) => ({ id, label, title }))]}>
      <CaseStudyViewer title={`${project.title} case study images`} items={items}>
      <article className="case-study">
        <header id="overview" className="case-study-header">
          <ul className="case-study-chips" aria-label="Project">
            <li>
              <Link className="case-study-chip-link" href={back.href} aria-label={`${project.title}, open the case slide`}>
                {project.logo ? <Image className="case-study-chip-icon" src={project.logo} alt="" width={16} height={16} /> : <ProjectIcon className="case-study-chip-icon" size={16} aria-hidden />}
                {project.title}
              </Link>
            </li>
            <li><CalendarBlankIcon size={16} aria-hidden />{study.year}</li>
          </ul>
          <h1>{study.title}</h1>
          <p className="case-study-intro">{study.intro}</p>
          {(study.status || study.duration) && (
            <ul className="case-study-meta" aria-label="Details">
              {study.status && <li><LockSimpleIcon size={16} aria-hidden />{study.status}</li>}
              {study.duration && <li><ClockIcon size={16} aria-hidden />{study.duration}</li>}
            </ul>
          )}
        </header>
        <div className="case-study-hero"><Figure media={study.hero} start={starts.get(study.hero)} /></div>
        {study.chapters.map(chapter => <Chapter key={chapter.id} chapter={chapter} starts={starts} />)}
        {study.next && (
          <footer className="case-study-next">
            <Link href={`/#${study.next.slug}`}>
              <span className="case-study-label">Next project</span>
              <span className="case-study-next-title">{study.next.title}<ArrowRightIcon size={16} aria-hidden /></span>
              <span className="case-study-next-summary">{study.next.summary}</span>
            </Link>
          </footer>
        )}
      </article>
      </CaseStudyViewer>
    </CaseStudyFrame>
  );
}

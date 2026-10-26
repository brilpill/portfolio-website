import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, BowlFoodIcon, CalendarBlankIcon, ChargingStationIcon, ClockIcon, FlowArrowIcon, FlowerLotusIcon, GraduationCapIcon, HeartbeatIcon, HouseLineIcon, MoonIcon, PackageIcon, SolarPanelIcon, SquaresFourIcon, UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { CaseMedia } from "@/components/case-media";
import { CaseNumbers } from "@/components/case-numbers";
import { BlurHighlight } from "@/components/case-highlight";
import { CaseStudyFrame } from "@/components/case-study-frame";
import { CaseStudyViewer, FigureExpand } from "@/components/case-study-viewer";
import { CaseFooter } from "@/components/site-footer";
import { LikeButton } from "@/components/like-button";
import type { ViewerItem } from "@/components/media-viewer";
import { caseStudies, caseStudyOf, type CaseStudyChapter, type CaseStudyFigure } from "@/content/case-studies";
import { portfolioSlideIds, projectSlides, type CaseScreen } from "@/content/project-slides";
import { demoFiles } from "@/cases/demo-files";
import "./case-study.css";

// The sidebar icon of each case that has a study; it matches the icon in the portfolio sidebar.
const icons: Record<string, Icon> = { luminasset: SolarPanelIcon, "quantum-body": FlowerLotusIcon, snoozeband: MoonIcon, nearbor: UsersThreeIcon, askflow: FlowArrowIcon, smarthost: HouseLineIcon, sellergenius: PackageIcon, "tutor-iq": GraduationCapIcon, "peach-health": HeartbeatIcon, dangdi: BowlFoodIcon, showcase: SquaresFourIcon };

export function generateStaticParams() {
  return caseStudies.filter(({ slug }) => !projectSlides.some(project => project.slug === slug && project.archived)).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectSlides.find(item => item.slug === slug);
  if (project?.archived) return { robots: { index: false, follow: false } };
  const study = caseStudyOf(slug);
  const name = project?.title ?? study?.name;
  // A study without a slide (the showcase) is unlisted, so search engines skip it too.
  return name && study ? {
    title: `${name} case study · Oleh Bril`, description: study.intro,
    ...(!project && { robots: { index: false } }),
    ...(project && { alternates: { canonical: `/cases/${slug}` } }),
    openGraph: { title: `${name} case study · Oleh Bril`, description: study.intro, type: "article", images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  } : {};
}

/** A figure's own media for the full-screen viewer: it steps through this block only (its tabs or screens). */
function viewerItems(media: CaseStudyFigure): ViewerItem[] {
  // Long screens open at full length, to scroll through; desktop pages and boards open wider than phone screens.
  const long = (web: boolean) => ({ src, alt, full }: CaseScreen): ViewerItem => full ? { src: full.src, alt, tall: full.ratio, web } : { src, alt };
  if (media.kind === "image") return [long(true)(media)];
  if (media.kind === "posters") return media.images.map(({ src, alt }) => ({ src, alt }));
  if (media.kind === "images") return media.images.map(long(true));
  if (media.kind === "video") return [media.src ? { kind: "video", src: media.src, poster: media.poster, alt: media.posterAlt } : { src: media.poster, alt: media.posterAlt }];
  if (media.kind === "responsive") return [...media.web.map(long(true)), ...media.mobile.filter(screen => screen !== null).map(long(false))];
  if (media.kind === "compare") return [{ before: media.before, after: media.after }, ...(media.more ?? [])].flatMap(pair => [pair.before, pair.after]).map(({ src, alt }) => ({ src, alt }));
  if (media.kind === "component" || media.kind === "components") return [];
  return media.screens.map(long(media.kind === "browser"));
}

/** A live component's source, read while the page builds, so its Code tab shows exactly the file that runs. */
function withSource(media: CaseStudyFigure): CaseStudyFigure {
  if (media.kind !== "component" || !demoFiles[media.demo]) return media;
  const file = demoFiles[media.demo];
  return { ...media, file: `src/cases/${file}`, source: readFileSync(join(process.cwd(), "src/cases", file), "utf8") };
}

function Figure({ media }: { media: CaseStudyFigure }) {
  // Images sit framed inside the grey; mockups and clips use the whole frame, as on the case slides.
  const items = viewerItems(media);
  return (
    <div className="case-study-figure" data-framed={(media.kind === "image" && !media.scroll) || undefined} data-grid={media.kind === "components" || undefined}>
      <CaseMedia media={{ ...withSource(media), caption: undefined }} />
      {items.length > 0 && <FigureExpand items={items} label={media.kind === "video" ? "Play larger" : "Expand image"} />}
    </div>
  );
}

/** A chapter's paragraph: `strong` sets a phrase in the ink colour and `highlight` marks one; both get the highlight box drawn in behind them (case-highlight.tsx). */
function Paragraph({ body, strong, highlight, className }: { body: string; strong?: string; highlight?: CaseStudyChapter["highlight"]; className?: string }) {
  const marks = [
    ...(strong && body.includes(strong) ? [{ text: strong, kind: "strong" as const }] : []),
    ...(highlight && body.includes(highlight.text) ? [{ text: highlight.text, kind: "highlight" as const }] : []),
  ].sort((a, b) => body.indexOf(a.text) - body.indexOf(b.text));
  const parts: ReactNode[] = [];
  let rest = body;
  for (const mark of marks) {
    const at = rest.indexOf(mark.text);
    if (at < 0) continue;
    parts.push(rest.slice(0, at));
    parts.push(mark.kind === "strong" ? <strong key={mark.text} className="case-mark">{mark.text}</strong> : <mark key={mark.text} className="case-mark">{mark.text}</mark>);
    rest = rest.slice(at + mark.text.length);
  }
  parts.push(rest);
  return marks.length ? <BlurHighlight className={className}>{parts}</BlurHighlight> : <p className={className}>{parts}</p>;
}

function Chapter({ chapter }: { chapter: CaseStudyChapter }) {
  return (
    <section id={chapter.id} className="case-study-chapter" aria-labelledby={`${chapter.id}-title`}>
      <div className="case-study-copy">
        <p className="case-study-label">{chapter.label}</p>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <Paragraph body={chapter.body} strong={chapter.strong} highlight={chapter.highlight} />
        {chapter.lesson && <p className="case-study-lesson"><span>Lesson</span>{chapter.lesson}</p>}
      </div>
      {chapter.numbers && <div className="case-study-numbers"><CaseNumbers items={chapter.numbers} layout={chapter.numbersLayout} /></div>}
      {chapter.figures?.map((media, index) => <Figure key={index} media={media} />)}
      {chapter.pair && (
        <div className="case-study-pair">
          {chapter.pair.map((item, index) => (
            <div key={index}>
              {(item.label || item.title || item.body) && <div className="case-study-copy">
                {item.label && <p className="case-study-label">{item.label}</p>}
                {item.title && <h3>{item.title}</h3>}
                {item.body && <p>{item.body}</p>}
              </div>}
              <Figure media={item.media} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** A full case study (Figma 1001:1859): header, a large figure, chapters with their figures, and case navigation. */
export default async function CaseStudyPage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const study = caseStudyOf(slug);
  const project = projectSlides.find(item => item.slug === slug);
  if (project?.archived) notFound();
  const name = project?.title ?? study?.name;
  if (!study || !name) notFound();
  const ProjectIcon = icons[slug] ?? ChargingStationIcon;
  const back = project ? { href: `/#${slug}`, label: name } : { href: "/", label: "Home" };
  // Follow the same sequence as the sidebar, skipping projects without a published case-study page (or still in draft).
  const caseSequence = portfolioSlideIds.flatMap(id => {
    const item = projectSlides.find(project => project.slug === id);
    return item?.caseStudyUrl === `/cases/${id}` && !item.caseStudyDraft ? [item] : [];
  });
  const caseIndex = caseSequence.findIndex(item => item.slug === slug);
  const previousCase = caseIndex > 0 ? caseSequence[caseIndex - 1] : undefined;
  const nextCase = caseIndex >= 0 ? caseSequence[caseIndex + 1] : undefined;

  return (
    <CaseStudyFrame back={back} sections={[{ id: "overview", label: "Overview", title: study.title }, ...study.chapters.map(({ id, label, title }) => ({ id, label, title }))]}>
      <CaseStudyViewer title={`${name} case study images`}>
      <article className="case-study">
        <header id="overview" className="case-study-header">
          <ul className="case-study-chips" aria-label="Project">
            <li>
              <Link className="case-study-chip-link" href={back.href} aria-label={project ? `${name}, open the case slide` : "Home"}>
                {project?.logo ? <Image className="case-study-chip-icon" src={project.logo} alt="" width={16} height={16} /> : <ProjectIcon className="case-study-chip-icon" size={16} aria-hidden />}
                {name}
              </Link>
            </li>
            {study.year && <li><CalendarBlankIcon size={16} aria-hidden />{study.year}</li>}
          </ul>
          <h1>{study.title}</h1>
          <Paragraph className="case-study-intro" body={study.intro} highlight={study.introHighlight} />
          <ul className="case-study-meta" aria-label="Details">
            {study.duration && <li><ClockIcon size={16} aria-hidden />{study.duration}</li>}
            <li><LikeButton slug={slug} /></li>
          </ul>
        </header>
        <div className="case-study-hero"><Figure media={study.hero} /></div>
        {study.chapters.map(chapter => <Chapter key={chapter.id} chapter={chapter} />)}
        {(previousCase || nextCase) && <nav className="case-study-navigation" aria-label="Case studies">
          {previousCase && <Link className="case-study-navigation-link case-study-navigation-previous" href={previousCase.caseStudyUrl!} aria-label={`Previous case: ${previousCase.title}`}>
            <ArrowLeftIcon size={22} aria-hidden />
            <span><small>Previous case</small><strong>{previousCase.title}</strong></span>
          </Link>}
          {nextCase && <Link className="case-study-navigation-link case-study-navigation-next" href={nextCase.caseStudyUrl!} aria-label={`Next case: ${nextCase.title}`}>
            <span><small>Next case</small><strong>{nextCase.title}</strong></span>
            <ArrowRightIcon size={22} aria-hidden />
          </Link>}
        </nav>}
      </article>
      </CaseStudyViewer>
      <CaseFooter />
    </CaseStudyFrame>
  );
}

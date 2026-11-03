/** Copy for the v5 preview (/v5): a layout after rachelchen.tech, filled only with what the main site already says.
 * Anything Oleh hasn't written yet (photos, a "Fun" category list) shows as a plain placeholder, never invented. */
import { facts, caseFacts } from "./facts";
import { aboutIntro, contentJobs, principles } from "./portfolio-content";
import { visibleProjectSlides, type CaseScreen, type ProjectSlideMedia } from "./project-slides";
import { caseStudyOf } from "./case-studies";
import { playgroundItems, playgroundPoster, type PlaygroundMedia } from "./playground";

export const v5 = {
  name: facts.name,
  /** Figma: brilpill · Final (1316:22530). */
  hero: ["Designer & builder", `based in ${facts.location.city}`],
  askPlaceholder: `Which apps has ${facts.name.split(" ")[0]} shipped?`,
  /** Figma: Active Input (1402:12830). Pills under the focused hero field; each asks a question with a prepared answer. */
  askChips: [
    { label: "Experience", question: "Tell me about your design + code background." },
    { label: "Shipped apps", question: `Which apps has ${facts.name.split(" ")[0]} shipped?` },
    { label: "How I use AI", question: "How do you use AI?" },
    { label: "Availability", question: "Are you available for work?" },
  ],
  currently: { label: "Currently", lines: [`${facts.availability.status} in`, `${facts.location.city}, ${facts.location.country} / Remotely`] },
  previously: {
    label: "Previously",
    lead: "Design at",
    links: [
      { name: "@HotShotsLabs", href: "https://hotshotslabs.com/" },
      { name: "@BASA", href: "https://www.basa.solutions/" },
      { name: "@Fourmeta", href: "https://www.fourmeta.com/" },
    ],
    tail: "across Fintech, Edtech and more.",
  },
  email: facts.email,
  links: facts.links.filter(link => ["LinkedIn", "Behance", "Dribbble", "GitHub", "Telegram"].includes(link.label)),
};

/** Default thumbnail tints, one per case, softened to sit on the warm grey ground. */
const tints: Record<string, string> = {
  luminasset: "#F4D27A", dangdi: "#2B2B2B", snoozeband: "#3B3F6B", "ihide-vpn": "#1F3B57", "quantum-body": "#D9C7EE",
  "peach-health": "#F6C9B2", nearbor: "#BFD8C2", sellergenius: "#DCE3EC", askflow: "#C9D7F5", draupnir: "#1C1C22",
  "tutor-iq": "#CFE0FF", smarthost: "#E8DCCB",
};

export type V5Thumb =
  | { kind: "phones"; screens: CaseScreen[]; tint: string; ratio?: string }
  | { kind: "image"; src: string; alt: string; tint: string };

const yearOf = (timeline: string) => timeline.match(/20\d\d/g)?.at(-1) ?? "";

/** The first block that gives a still: phones from a device block, otherwise one web screen. */
function thumbOf(slug: string, media: ProjectSlideMedia[], tint?: string): V5Thumb | undefined {
  const bg = tint ?? tints[slug] ?? "#E6E8EB";
  for (const block of media) {
    if (block.kind === "device" && block.screens.length) return { kind: "phones", screens: block.screens.slice(0, 3), tint: bg };
    if (block.kind === "browser" && block.screens[0]) return { kind: "image", ...block.screens[0], tint: bg };
    if (block.kind === "responsive" && block.web[0]) return { kind: "image", ...block.web[0], tint: bg };
    if ((block.kind === "images" || block.kind === "posters") && block.images[0]) return { kind: "image", ...block.images[0], tint: bg };
    if (block.kind === "image") return { kind: "image", src: block.src, alt: block.alt, tint: bg };
    if (block.kind === "compare") return { kind: "image", ...block.after, tint: bg };
  }
}

export type V5Work = { slug: string; title: string; meta: string; year: string; href: string; external: boolean; thumb?: V5Thumb };

export const v5Work: V5Work[] = visibleProjectSlides
  .filter(project => project.placement !== "more")
  .map(project => {
    const study = caseStudyOf(project.slug);
    const fact = caseFacts.find(item => item.slug === project.slug);
    const year = study?.year ?? yearOf(project.timeline);
    const hasStudy = Boolean(study) && !project.caseStudyDraft;
    return {
      slug: project.slug,
      title: project.title,
      meta: [project.format, year].filter(Boolean).join(" "),
      year,
      href: hasStudy ? `/v5/projects/${project.slug}` : project.webUrl ?? fact?.links[0]?.href ?? `/v5/projects/${project.slug}`,
      external: !hasStudy && Boolean(project.webUrl),
      thumb: thumbOf(project.slug, project.media, project.tint),
    };
  })
  .filter(item => item.thumb)
  // Every third phone card stands taller, so the two columns stagger like the reference's mixed media.
  .map((item, i) => item.thumb?.kind === "phones" && i % 3 === 1 ? { ...item, thumb: { ...item.thumb, ratio: "4 / 3" } } : item);

/** What sits in a home card's 477 × 269 frame, in the Figma's own units. */
export type V5Mock =
  | { kind: "phones"; screens: string[][] }
  | { kind: "laptop"; screen: string }
  | { kind: "hotshots" }
  | { kind: "blank" };

/** `year` is the tag over a card's hover frame (Figma 1308:15087); left out where there's no year to give. */
export type V5Featured = { id: string; client: string; type: string; year?: string; href?: string; external?: boolean; mock: V5Mock };

const workOf = (slug: string) => v5Work.find(item => item.slug === slug);
const linkOf = (slug: string) => { const item = workOf(slug); return item ? { href: item.href, external: item.external, year: item.year || undefined } : {}; };
/** Cards the Figma leaves grey get the same treatment from the case's own screens: phones for apps, a laptop for the web. */
function mockOf(slug: string): V5Mock {
  const thumb = workOf(slug)?.thumb;
  if (thumb?.kind === "phones") return { kind: "phones", screens: thumb.screens.slice(0, 2).map(screen => [screen.src]) };
  if (thumb?.kind === "image") return { kind: "laptop", screen: thumb.src };
  return { kind: "blank" };
}

/** The home grid, in the Figma's order and words. */
export const v5Featured: V5Featured[] = [
  { id: "luminasset", client: "LuminAsset", type: "Cleantech App", ...linkOf("luminasset"), mock: { kind: "phones", screens: [["/v5/sprite/lumin-screen-1.png"], ["/v5/sprite/lumin-screen-2a.png", "/v5/sprite/lumin-screen-2b.png"]] } },
  { id: "tutor-iq", client: "TutorIQ", type: "Crypto Card", ...linkOf("tutor-iq"), mock: { kind: "laptop", screen: "/v5/sprite/mac-screen.png" } },
  { id: "hotshots", client: "HotShots Labs", type: "Flutter Agency Website", year: yearOf(contentJobs.find(job => job.company === "HotShots Labs")?.dates ?? "") || undefined, href: "https://hotshotslabs.com/", external: true, mock: { kind: "hotshots" } },
  { id: "draupnir", client: "Draupnir", type: "Crypto Card", ...linkOf("draupnir"), mock: mockOf("draupnir") },
  { id: "bomo", client: "BOMO", type: "Mem Coin", mock: { kind: "blank" } },
  { id: "ihide-vpn", client: "iHideVPN", type: "VPN App", ...linkOf("ihide-vpn"), mock: mockOf("ihide-vpn") },
  { id: "askflow", client: "AskFlow", type: "FLow", ...linkOf("askflow"), mock: mockOf("askflow") },
];

export type V5FunItem = { id: string; title: string; meta: string; source: string; href: string; poster: string; video?: string; media: PlaygroundMedia[] };

export const v5Fun: V5FunItem[] = playgroundItems.map(item => {
  const first = item.media[0];
  return {
    id: item.id,
    title: item.title,
    meta: [item.sourceLabel ?? "Dribbble", item.publishedAt?.match(/20\d\d/)?.[0]].filter(Boolean).join(" · "),
    source: item.sourceLabel ?? "Dribbble",
    href: item.sourceUrl,
    poster: first ? playgroundPoster(first) : item.image,
    video: first?.kind === "video" ? first.src : undefined,
    media: item.media,
  };
});

export const v5FunFilters = ["All", ...Array.from(new Set(v5Fun.map(item => item.source)))];

export const v5About = {
  intro: [...aboutIntro, `${facts.availability.detail} Reach out if you want to work together or just say hi.`],
  jobs: [
    { year: "Now", dates: "Now", company: facts.availability.status, role: facts.title, href: undefined as string | undefined },
    ...contentJobs.map(job => ({
      year: job.dates.match(/20\d\d/)?.[0] ?? "",
      dates: job.dates,
      company: job.company,
      role: job.role,
      href: ({ "HotShots Labs": "https://hotshotslabs.com/", BASA: "https://www.basa.solutions/", "Fourmeta Agency": "https://www.fourmeta.com/", "AskFlow AI": "https://www.askflow.ai/" } as Record<string, string>)[job.company],
    })),
  ],
  principles,
  skills: facts.skills,
  tools: [
    { label: "Design", items: facts.tools.design },
    { label: "Build", items: facts.tools.build },
    { label: "Web builders", items: facts.tools.web },
  ],
  education: facts.education,
  languages: facts.languages,
  calendly: facts.calendly,
};

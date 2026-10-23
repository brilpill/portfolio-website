/** Project content for the current Figma slide layout.
 * Paste final copy, links, and /public image or video paths into each entry.
 * Shared sample copy is fictional and used to preview the layout.
 * Replace the shared values per project when final content is ready.
 */
/** One screen inside a device or browser frame. `label` names it in the step tabs. */
export type CaseScreen = { src: string; alt: string; label?: string };

/**
 * One block of a case overview, each with a one-line caption:
 * - device: phone screens in a drawn phone frame. Several screens get arrows plus step tabs, or the
 *   auto-playing step player with `control: "player"`.
 * - browser: web screens in a window frame; `background` puts the window on a full-bleed image.
 * - image: one image filling the whole stage (a finished composition, not a mockup).
 * - video: muted, looping, with pause and seek. Without `src` the poster shows with "Video coming soon".
 */
export type ProjectSlideMedia =
  | { kind: "device"; screens: CaseScreen[]; control?: "tabs" | "player"; caption?: string }
  | { kind: "browser"; screens: CaseScreen[]; url?: string; background?: string; control?: "tabs" | "player"; caption?: string }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; poster: string; posterAlt: string; src?: string; url?: string; frame?: "browser" | "none"; caption?: string };

/**
 * Layout samples taken from the Figma case frames (1001:2835, 1026:1567). The loan screens appear to come from
 * another designer's portfolio capture in that file, so they stay sample-only and must be replaced before launch.
 */
/** The first still image of a project, for gallery covers. */
export const coverOf = (media: ProjectSlideMedia[]) => { const first = media[0]; return !first ? undefined : first.kind === "image" ? first.src : first.kind === "video" ? first.poster : first.screens[0]?.src; };

const loanScreens: CaseScreen[] = [
  { src: "/cases/samples/loan-term.png", alt: "Loan term step: a slider for the number of months and the monthly payment", label: "Term" },
  { src: "/cases/samples/loan-signed.png", alt: "Final step: the loan is on its way", label: "Signed" },
];
const sampleMedia: ProjectSlideMedia[] = [
  { kind: "device", screens: loanScreens, caption: "Device with step tabs. Sample screens from the Figma file." },
  { kind: "image", src: "/cases/samples/promptly-fullscreen.png", alt: "Promptly library in a browser window over a landscape painting", caption: "Full-screen image: a finished composition, not a mockup." },
  // The clip is a generated zoom over the Promptly screen, standing in for a real screen recording.
  { kind: "video", src: "/cases/samples/promptly-library.mp4", poster: "/cases/samples/promptly-library.png", posterAlt: "Promptly prompt library", url: "promptly.com", caption: "Video in a browser window: plays muted on loop, with pause and seek." },
  { kind: "device", screens: loanScreens, control: "player", caption: "Device with the auto-playing step player." },
  { kind: "browser", screens: [{ src: "/cases/samples/promptly-library.png", alt: "Promptly prompt library", label: "Library" }], url: "promptly.com", caption: "A single web screen in a browser window." },
];

export type ProjectSlideContent = {
  slug: string;
  title: string;
  group: "Mobile" | "Web";
  format: string;
  placement?: "major" | "more";
  website?: string;
  logo?: string;
  overview: string;
  role: string;
  timeline: string;
  industry: string;
  figmaUrl: string;
  webUrl?: string;
  otherUrl?: string;
  media: ProjectSlideMedia[];
};

/** Fictional placeholder copy shared by every project slide. */
const sampleProjectCopy = {
  overview: "A digital product that brings everyday tasks into one simple, connected experience. I explored the core flows and created a design concept for the client, focusing on clear content hierarchy, a consistent visual language, and thoughtful interactions. From the first screen to the smallest detail, the goal was to make the product feel straightforward and easy to use.",
  role: "UX Review / UI Design / Visual Direction",
  timeline: "6 weeks · 2026",
  industry: "Digital Products",
};

export const projectSlides: ProjectSlideContent[] = [
  {
    slug: "luminasset", title: "LuminAsset", group: "Mobile",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: sampleMedia,
  },
  {
    slug: "quantum-body", title: "Quantum Body", group: "Mobile",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [
      { kind: "image", src: "/cases/placeholders/quantum-body-1.svg", alt: "Quantum Body temporary layout study 1; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/quantum-body-2.svg", alt: "Quantum Body temporary layout study 2; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/quantum-body-3.svg", alt: "Quantum Body temporary layout study 3; placeholder artwork" },
    ],
  },
  {
    slug: "snooze-band", title: "Snooze Band", group: "Mobile",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [
      { kind: "image", src: "/cases/placeholders/snooze-band-1.svg", alt: "Snooze Band temporary layout study 1; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/snooze-band-2.svg", alt: "Snooze Band temporary layout study 2; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/snooze-band-3.svg", alt: "Snooze Band temporary layout study 3; placeholder artwork" },
    ],
  },
  {
    slug: "ihidevpn", title: "iHideVPN", group: "Mobile", placement: "more",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [],
  },
  {
    slug: "imo-car-wash", title: "IMO Car Wash", group: "Mobile", placement: "more",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [],
  },
  {
    slug: "peach-health", title: "Peach Health", group: "Mobile", placement: "more",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [],
  },
  {
    slug: "nearbor", title: "Nearbor", group: "Mobile", placement: "more",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [],
  },
  {
    slug: "tutoriq", title: "TutorIQ", group: "Web",
    format: "Web Project",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [
      { kind: "image", src: "/cases/placeholders/tutoriq-1.svg", alt: "TutorIQ temporary layout study 1; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/tutoriq-2.svg", alt: "TutorIQ temporary layout study 2; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/tutoriq-3.svg", alt: "TutorIQ temporary layout study 3; placeholder artwork" },
    ],
  },
  {
    slug: "hotshots-labs", title: "HotShots Labs", group: "Web",
    format: "Web Project",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [
      { kind: "image", src: "/cases/placeholders/hotshots-labs-1.svg", alt: "HotShots Labs temporary layout study 1; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/hotshots-labs-2.svg", alt: "HotShots Labs temporary layout study 2; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/hotshots-labs-3.svg", alt: "HotShots Labs temporary layout study 3; placeholder artwork" },
    ],
  },
  {
    slug: "smarthost", title: "SmartHost", group: "Web",
    format: "Web Project",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [
      { kind: "image", src: "/cases/placeholders/smarthost-1.svg", alt: "SmartHost temporary layout study 1; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/smarthost-2.svg", alt: "SmartHost temporary layout study 2; placeholder artwork" },
      { kind: "image", src: "/cases/placeholders/smarthost-3.svg", alt: "SmartHost temporary layout study 3; placeholder artwork" },
    ],
  },
  {
    slug: "draupnir", title: "Draupnir", group: "Web", placement: "more",
    format: "Web Project",
    website: "draupnir.com", webUrl: "https://draupnir.com", logo: "/figma/draupnir-logo.svg",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [],
  },
  {
    slug: "knowledge-base", title: "Knowledge Base", group: "Web", placement: "more",
    format: "Web Project",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [],
  },
];

export const portfolioSlideIds = [
  "home",
  ...projectSlides.filter(project => project.group === "Mobile" && project.placement !== "more").map(project => project.slug),
  "mobile-more",
  ...projectSlides.filter(project => project.group === "Web" && project.placement !== "more").map(project => project.slug),
  "web-more", "about", "experience", "process", "contact",
];

export const sectionTitles: Record<string, string> = {
  home: "Home", playground: "Playground", "mobile-more": "More mobile projects",
  "web-more": "More web projects", about: "About me", experience: "Experience",
  process: "My process", contact: "Contact",
};

/** More projects resolve to their gallery rather than entering the main slide sequence. */
export function projectDestination(slug: string) {
  const project = projectSlides.find(item => item.slug === slug);
  return project?.placement === "more" ? `${project.group.toLowerCase()}-more` : slug;
}

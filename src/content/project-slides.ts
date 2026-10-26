import { lumin } from "./luminasset-media";
import { AF_RATIO, af, as } from "./askflow-media";
import { qb } from "./quantum-body-media";
import { snooze } from "./snoozeband-media";
import { ihide } from "./ihide-vpn-media";
import { nb } from "./nearbor-media";
import { SH_RATIO, sh } from "./smarthost-media";
import { SG_RATIO, sg } from "./sellergenius-media";
import { TQ_RATIO, tq } from "./tutor-iq-media";
import { ph } from "./peach-health-media";
import { dd } from "./dangdi-media";

/** Project content for the current Figma slide layout.
 * Paste final copy, links, and /public image or video paths into each entry.
 * Shared sample copy is fictional and used to preview the layout.
 * Replace the shared values per project when final content is ready.
 */
/** One screen inside a device or browser frame. `label` names it in the step tabs. */
/** `full`: the screen's full length (a tall scrolling page) and its height ÷ width; in a phone it scrolls inside
 * the screen, with a "Scrollable" note above. */
export type CaseScreen = { src: string; alt: string; label?: string; full?: { src: string; ratio: number } };

/**
 * One block of a case overview, each with a one-line caption:
 * - device: phone screens in a drawn phone frame. Several screens get arrows plus step tabs, or the
 *   auto-playing step player with `control: "player"`.
 * - browser: web screens in a window frame; `background` puts the window on a full-bleed image.
 * - image: one image filling the whole stage (a finished composition, not a mockup). The card takes the
 *   image's own proportions, so a full landing page can go in as one tall image.
 * - video: muted, looping, with pause and seek. Without `src` the poster shows with "Video coming soon".
 */
/** Phone frames (master templates, see docs/case-template.md): dark is the default; silver suits screens that
 * read better with a light outline; pair shows the next screen behind the current one; row stands three phones
 * side by side (more than three screens page through in threes, with tabs). */
export type PhoneFrame = "dark" | "silver" | "pair" | "row";
/** Browser frames: macOS Safari (dark, the default) with the project's address; bare window (no chrome); laptop;
 * window (one whole window with a minimal bar on a light grey ground, from the Figma mockups page). */
export type BrowserFrame = "dark" | "bare" | "laptop" | "window";

/** An optional collaborator cursor over any block: `cursor` glides between points (percent of the figure), `draft`
 * drags out a selection box from the first point. See case-annotation.tsx. */
export type MediaAnnotation = { kind: "cursor" | "draft"; name: string; note?: string; points: [number, number][] };

export type ProjectSlideMedia = { annotation?: MediaAnnotation } & (
  | { kind: "device"; screens: CaseScreen[]; frame?: PhoneFrame; control?: "tabs" | "player"; caption?: string }
  /** `ratio`: the page's proportions (width / height) when they aren't the default 1728 / 1064, so wide screens aren't cropped. */
  | { kind: "browser"; screens: CaseScreen[]; frame?: BrowserFrame; url?: string; ratio?: string; background?: string; control?: "tabs" | "player"; caption?: string }
  /** Before / after: two screens in one mockup (Safari by default, a bare window, or a phone) with a divider across the
   * whole frame that you drag to compare them. `frame: "row"` with `more` pairs puts up to three phones side by side
   * under the same divider. */
  | { kind: "compare"; before: CaseScreen; after: CaseScreen; more?: { before: CaseScreen; after: CaseScreen }[]; frame?: "browser" | "bare" | "device" | "row"; url?: string; ratio?: string; caption?: string }
  /** A website and its mobile version side by side: `web[i]` and `mobile[i]` step together. */
  | { kind: "responsive"; web: CaseScreen[]; mobile: CaseScreen[]; frame?: "dark" | "bare"; url?: string; ratio?: string; control?: "tabs" | "player"; caption?: string }
  /** One image. `full`: a much taller original (a long presentation) that the stage previews from its top; the viewer
   * opens it at full length, and a "View full presentation" button sits on the stage. */
  /** `scroll`: instead of the cropped preview, the whole `full` image is one narrower sheet that runs off the bottom
   * of the frame and slides up through it with the wheel or a mouse drag over it (case studies only). */
  | { kind: "image"; src: string; alt: string; caption?: string; full?: { src: string; ratio: number; label?: string }; scroll?: true }
  /** Finished posters (App Store screenshots) in a horizontal strip, about three in view, each opening in the viewer. */
  | { kind: "posters"; images: CaseScreen[]; caption?: string }
  /** Several finished images (flows, boards) in one frame, each fitted whole, switched by tabs. */
  | { kind: "images"; images: CaseScreen[]; caption?: string }
  /** A live, rebuilt component to try (src/cases/demos.tsx), with its state tabs and a Code tab. `source` and `file`
   * are filled in by the case page from src/cases/demo-files.ts; leave them out in content. */
  | { kind: "component"; demo: string; caption?: string; source?: string; file?: string }
  /** Several live components, each in its own frame, in a two-column grid; a demo listed in `wide` takes the full row,
   * and `hint` puts one Interactive note above (off by default). Takes less scrolling than one block per component. */
  | { kind: "components"; demos: string[]; wide?: string[]; hint?: boolean; caption?: string }
  | { kind: "video"; poster: string; posterAlt: string; src?: string; url?: string; frame?: "browser" | "none"; caption?: string }
);

/** The first still image of a project, for gallery covers. */
export const coverOf = (media: ProjectSlideMedia[]) => { const first = media[0]; return !first ? undefined : first.kind === "image" ? first.src : first.kind === "images" || first.kind === "posters" ? first.images[0]?.src : first.kind === "video" ? first.poster : first.kind === "responsive" ? first.web[0]?.src : first.kind === "compare" ? first.after.src : first.kind === "component" || first.kind === "components" ? undefined : first.screens[0]?.src; };

export type ProjectSlideContent = {
  slug: string;
  title: string;
  group: "Mobile" | "Web";
  format: string;
  placement?: "major" | "more";
  /** Keep the case in source without publishing its slide, navigation, or study route. */
  archived?: boolean;
  website?: string;
  logo?: string;
  overview: string;
  role: string;
  timeline: string;
  industry: string;
  figmaUrl: string;
  webUrl?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  otherUrl?: string;
  /** The full case study page; shown as the one emphasised link. */
  caseStudyUrl?: string;
  media: ProjectSlideMedia[];
  /** The one title of the case details; falls back to "Title: Format". */
  headline?: string;
  /** Tile colour behind the project icon; defaults to the soft peach. Logos keep their own colours. */
  tint?: string;
};

/** Fictional placeholder copy shared by every project slide. */
const sampleProjectCopy = {
  overview: "A digital product that brings everyday tasks into one simple, connected experience. I explored the core flows and created a design concept for the client, focusing on clear content hierarchy, a consistent visual language, and thoughtful interactions. From the first screen to the smallest detail, the goal was to make the product feel straightforward and easy to use.",
  role: "UX Review / UI Design / Visual Direction",
  timeline: "6 weeks · 2026",
  industry: "Digital Products",
  headline: "Making a complex flow feel simple.",
};

export const projectSlides: ProjectSlideContent[] = [
  {
    // Filled from luminasset.md (24 Oct 2026). All screens are sample until public use is cleared. The chip keeps the
    // icon rather than logo.svg, as asked on 24 Oct.
    slug: "luminasset", title: "LuminAsset", group: "Mobile",
    format: "Mobile App",
    headline: "A months-long install, one clear step at a time.",
    overview: "A UK solar app that takes a homeowner from a postcode to panels producing power. It shows panels on their own roof using the Google Solar API, then guides them through a survey, the council, the grid connection and staged payments over several months. As UX lead I designed the customer app and the logic behind the admin panel.",
    role: "UX Lead / Product Design / Design System",
    timeline: "2 months · 2026",
    industry: "Cleantech",
    figmaUrl: "", // the Figma file is private
    webUrl: "https://luminasset.co.uk/",
    caseStudyUrl: "/cases/luminasset",
    media: [
      { kind: "device", screens: [lumin.start, lumin.estimateFetched, lumin.myOrders, { ...lumin.trackerDirect, label: "Tracker" }, { ...lumin.monitoring, label: "Live" }, lumin.notifications], caption: "From the first screen to panels producing power." },
      { kind: "device", frame: "row", screens: [lumin.start, lumin.postcode, lumin.calculating, { ...lumin.estimate0, label: "Estimate" }, lumin.estimateFetched, lumin.estimateSheet], caption: "Postcode to a priced system on your own roof." },
    ],
  },
  {
    // A small UI case from the "Finish: Design Concepts" page of the Dangdi design file (25 Oct 2026), made the same way
    // as Peach Health. A client project (confirmed by Oleh); role and timeline still to come (a dash). All content is sample.
    slug: "dangdi", title: "Dangdi", group: "Mobile",
    format: "Mobile App",
    headline: "A local feed for a new city.",
    overview: "Dangdi (当地, \"local\") is a community app for Chinese newcomers in Copenhagen. Its home screen brings people, articles, events, places to eat and local offers into one scrolling feed, with Dangdi AI as the app's own local guide. This case focuses on the interface: a Simplified Chinese version, a photo-led concept that changes with the time of day, and custom 3D details.",
    role: "",
    timeline: "",
    industry: "Community / Lifestyle",
    figmaUrl: "", // the Figma file is private
    caseStudyUrl: "/cases/dangdi",
    media: [
      { kind: "device", frame: "row", screens: [dd.black, dd.photoDay, dd.chinese], caption: "The home feed, the photo-led concept and the Chinese version. Sample design." },
      { kind: "device", screens: [{ ...dd.photoDay, label: "Day" }, { ...dd.photoEvening, label: "Evening" }, { ...dd.photoNight, label: "Night" }], caption: "The photo-led home screen follows the time of day. Sample design." },
    ],
  },
  {
    // From the revised snoozeband.md (24 Oct 2026). All screens are sample until permission.
    // Role and timeline are left empty (shown as a dash) until confirmed.
    slug: "snoozeband", title: "Snoozeband", group: "Mobile",
    format: "Mobile App",
    headline: "Bedtime listening, from setup to replay.",
    overview: "A mobile app design for sleep flows, ambient sounds, stories, and meditations. The experience connects guided setup, audio discovery, playback, saved listening, and activity summaries.",
    role: "",
    timeline: "",
    industry: "Wellness / Audio",
    figmaUrl: "", // the Figma file is private
    webUrl: "https://www.snoozeband.eu/",
    appStoreUrl: "https://apps.apple.com/app/snoozeband/id6749370010",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.snoozeband",
    caseStudyUrl: "/cases/snoozeband",
    media: [
      { kind: "device", screens: [snooze.home, snooze.player, snooze.library, snooze.insights], caption: "Discover audio, listen, save tracks, and review activity. Sample designs." },
      { kind: "device", frame: "row", screens: [snooze.welcome, snooze.onboardingGoals, snooze.onboardingPersonalising], caption: "Welcome, choose sleep goals, and prepare a listening journey. Sample designs." },
    ],
  },
  {
    // From ihide-vpn.md (25 Oct 2026). Overview only: no case study page. Screens are sample until publication clearance.
    // Role and timeline aren't confirmed, so they're empty (shown as a dash). Replaces the earlier "ihidevpn" placeholder.
    slug: "ihide-vpn", title: "iHide VPN", group: "Mobile",
    format: "Mobile App",
    headline: "A clear path to a private connection.",
    overview: "iHide VPN brings connection controls, server selection, and onboarding into a focused mobile interface. This overview showcases the connection states, browsing and searching locations, and the introductory screens that explain the app.",
    role: "",
    timeline: "",
    industry: "Privacy / Utilities",
    figmaUrl: "", // the Figma file is private
    appStoreUrl: "https://apps.apple.com/app/ihide-vpn-secure-private/id6737909085",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.ihidevpn",
    media: [
      { kind: "device", frame: "row", screens: [ihide.disconnected, ihide.connecting, ihide.connected], caption: "The connection journey, from idle to connected." },
      { kind: "device", screens: [ihide.locations, ihide.searchActive, ihide.search], caption: "Browse server locations, or search and pick a destination." },
      { kind: "device", screens: [ihide.onboardingTrial, ihide.onboardingPrivacy, ihide.onboardingConnection, ihide.onboardingData], caption: "Onboarding introduces the free trial, privacy, connection speed and encryption." },
    ],
  },
  {
    // From the revised quantum-body.md (24 Oct 2026). All visuals are sample until permission. Role and timeline are left
    // empty (shown as a dash) until confirmed.
    slug: "quantum-body", title: "Quantum Body", group: "Mobile",
    format: "Mobile App",
    headline: "A place to capture a thought and come back to it.",
    overview: "Quantum Body brings five journaling practices into one mobile experience: manifestations, gratitude, synchronicities, dreams, and intentions. The designs connect choosing a practice, creating an entry, and returning to it through a searchable journal, reminders, and in-app guidance.",
    role: "",
    timeline: "",
    industry: "Journaling / Personal wellbeing",
    figmaUrl: "", // the Figma files are private
    webUrl: "https://www.quantumbody.io/",
    appStoreUrl: "https://apps.apple.com/app/quantum-body/id6752645253",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.quantumbody.io.quantumbody",
    caseStudyUrl: "/cases/quantum-body",
    media: [
      { kind: "device", screens: [{ ...qb.newEntry, label: "Choose a practice" }, { ...qb.manifestationForm, label: "Write" }, qb.alignmentLog, { ...qb.filters, label: "Filter" }, { ...qb.reminders, label: "Reminders" }], caption: "Five practices connected through a shared journaling experience. Sample designs." },
      { kind: "device", frame: "row", screens: [qb.gratitudeForm, qb.synchronicityForm, qb.dreamForm], caption: "One form, five practices: each gets its own colour and symbol. Sample designs." },
    ],
  },
  {
    // A small UI case from the Peach Health section of Oleh's Figma portfolio file (25 Oct 2026): a personal concept, Oleh
    // as Product Designer. All 26 screens are on the case page; two blocks here. Timeline isn't confirmed (a dash).
    slug: "peach-health", title: "Peach Health", group: "Mobile",
    format: "Mobile App",
    headline: "Health made simple, care made personal.",
    overview: "Peach Health is a personal concept for a mobile app that brings daily health tasks, medication reminders and AI health agents together in one calm place. This case focuses on the interface: a soft visual language, onboarding in short steps, one-question check-ins, a visual medication kit, and light and dark accessibility settings.",
    role: "Product Designer · Personal concept",
    timeline: "",
    industry: "Healthcare / AI",
    figmaUrl: "", // the Figma file is private
    caseStudyUrl: "/cases/peach-health",
    media: [
      { kind: "device", frame: "row", screens: [ph.home, ph.agents, ph.medsKit], caption: "Today's tasks, AI health agents and the medication kit. Sample design." },
      { kind: "device", screens: [ph.moodCheck, ph.pillCheck, ph.medsCheck, ph.lockScreen], caption: "Daily check-ins, one question at a time, and the reminder that starts them. Sample design." },
    ],
  },
  {
    // From nearbor.md (25 Oct 2026). Oleh improved an existing app and designed most screens within the previous
    // designer's design system: not a redesign or his own system. All screens sample. Timeline isn't confirmed (a dash).
    slug: "nearbor", title: "Nearbor", group: "Mobile",
    format: "Community App",
    headline: "Making an existing community app easier to use.",
    overview: "Nearbor helps people organise gatherings, coordinate care, and keep trusted services close. I took over UX/UI work on an existing app and designed most of its screens within the previous designer's design system. My focus was clearer flows, practical improvements, and readability for a broad range of ages and digital confidence—including older adults.",
    role: "UX/UI Design / Existing-product improvements",
    timeline: "",
    industry: "Community / Social networking",
    figmaUrl: "", // the Figma file is private
    webUrl: "https://www.nearbor.net/",
    appStoreUrl: "https://apps.apple.com/app/nearbor/id6799039544",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.nearbor",
    caseStudyUrl: "/cases/nearbor",
    media: [
      { kind: "device", frame: "row", screens: [{ ...nb.home, label: "Community calendar" }, { ...nb.careOverview, label: "Helping others" }, { ...nb.serviceHistory, label: "Provider history" }], caption: "The everyday tasks behind Nearbor: getting together, helping, and keeping useful information." },
      { kind: "compare", frame: "device", before: { ...nb.textSizeDefault, label: "Default text" }, after: { ...nb.textSizeLarge, label: "Large text" }, caption: "A text-size preview gives users a visible way to choose what is comfortable to read. These are two settings, not an old/new redesign comparison." },
    ],
  },
  {
    slug: "imo-car-wash", title: "IMO Car Wash", group: "Mobile", placement: "more",
    format: "Mobile App",
    ...sampleProjectCopy,
    figmaUrl: "",
    media: [],
  },
  {
    // From Oleh's brief (25 Oct 2026) and the SellerGenius Figma file. A small case: two overview blocks and a short case
    // study. All screens sample; no outcomes are claimed. Notes and Figma links: docs/cases/sellergenius.md.
    slug: "sellergenius", title: "SellerGenius", group: "Web",
    format: "Web App",
    headline: "Profit, ads and operations in one dashboard.",
    overview: "A 0>1 analytics platform for Amazon sellers and agencies, bringing financial metrics, advertising performance, and operational data into one dashboard for clearer profitability tracking and multi-brand management.",
    role: "Product Designer / UX&UI / Design System / Branding",
    timeline: "3–4 mo · 2025",
    industry: "E-commerce / Analytics SaaS",
    figmaUrl: "", // the Figma file is private
    webUrl: "https://seller-genius.com/",
    caseStudyUrl: "/cases/sellergenius",
    media: [
      { kind: "browser", frame: "bare", ratio: SG_RATIO, screens: [sg.dashboard, sg.profit, sg.advertising, sg.brands, sg.aiChat], caption: "From the main dashboard to profit, advertising, brands and the AI assistant. Sample designs." },
      { kind: "compare", frame: "bare", ratio: SG_RATIO, before: { ...sg.dashboard, label: "Light" }, after: sg.dashboardDark, caption: "Every screen was designed in a light and a dark theme. Sample design." },
    ],
  },
  {
    // From the revised askflow.md (25 Oct 2026). All screens are sample until permission. Oleh co-designed new app
    // features (never the sole app designer) and designed the website. Timeline is left empty until confirmed.
    slug: "askflow", title: "AskFlow", group: "Web",
    format: "Web App & Website",
    headline: "Building the tools behind a more personal shopping experience.",
    overview: "AskFlow gives merchants tools to create product quizzes and configure AI shopping assistance. I co-designed new app features and designed the marketing website. This case connects the visual builder, recommendation settings, shopper experience, publishing tools, and reporting that surround those features.",
    role: "Product Design (co-designer) / Website Design",
    timeline: "",
    industry: "eCommerce / SaaS",
    figmaUrl: "", // the Figma files are private
    webUrl: "https://www.askflow.ai/",
    caseStudyUrl: "/cases/askflow",
    media: [
      { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.builder, "Quiz builder"), as(af.productMatch, "Product matching"), as(af.chatWorkspace, "AI assistant"), as(af.insightsMap, "Flow insights")], caption: "The product from creation to configuration and review. Sample designs." },
      { kind: "image", src: af.articleAssistant.src, alt: af.articleAssistant.alt, caption: "A finished presentation of AskFlow's shopping-assistant experience. Sample design." },
      { kind: "device", screens: [as(af.shopperChoiceMobile, "Choice"), as(af.shopperImageMobile, "Image choices"), as(af.shopperFormMobile, "Form")], caption: "Three examples of the shopper-facing experience on mobile. Sample designs." },
    ],
  },
  {
    // From tutor-iq.md (25 Oct 2026). Oleh was the sole designer of discovery, platform, website and design system,
    // working with the PM and client; never the sole developer. Timeline, launch and outcomes aren't confirmed (a dash).
    // All screens sample. Replaces the earlier "tutoriq" placeholder slide.
    slug: "tutor-iq", title: "Tutor IQ", group: "Web",
    format: "Learning Platform and Website",
    headline: "Designing the journey from finding a tutor to making progress.",
    overview: "Tutor IQ connects families, students and tutors across discovery, booking, live lessons, homework and progress. I was the sole designer for the platform, website, discovery work and design system, collaborating with the PM and client. The product also includes an admin panel for the operational work that keeps this multi-role experience running.",
    role: "Product Design / UX / UI / Website Design / Design System",
    timeline: "",
    industry: "Education / Tutoring",
    figmaUrl: "", // the Figma files are private
    caseStudyUrl: "/cases/tutor-iq",
    media: [
      { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.parentHome, tq.studentHome, tq.tutorHome, tq.adminDashboard], caption: "Four roles, each with a distinct view of the same learning journey." },
      { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorSearch, tq.bookingTime, tq.classroomActive, tq.homeworkFeedback], caption: "Find, book, learn and respond to feedback." },
      { kind: "image", src: tq.websiteHome.src, alt: tq.websiteHome.alt, full: { ...tq.websiteHome.full!, label: "View full homepage" }, caption: "The complete website homepage introduces the service and leads visitors into the platform." },
    ],
  },
  {
    // From smarthost.md (25 Oct 2026). Exactly two overview blocks, bare browser frames (the old domain now redirects).
    // Personal contribution, dates and outcomes aren't confirmed, so role and timeline are empty. All screens sample;
    // figures in the designs are illustrative.
    slug: "smarthost", title: "SmartHost", group: "Web",
    format: "Website",
    headline: "From property management to a clear next step.",
    overview: "SmartHost's website introduces its property management services and gives owners a route to a rental estimate. The design connects service explanations, a guided property questionnaire, and a detailed estimate, with layouts adapted for desktop and mobile.",
    role: "",
    timeline: "",
    industry: "Property management / Hospitality",
    figmaUrl: "", // the Figma file is private
    webUrl: "https://www.staymo.com/",
    caseStudyUrl: "/cases/smarthost",
    media: [
      { kind: "responsive", frame: "bare", ratio: SH_RATIO.page, web: [sh.home], mobile: [sh.homeMobile], caption: "A shared visual language across the desktop and mobile homepage. Sample design." },
      { kind: "browser", frame: "bare", ratio: SH_RATIO.form, screens: [sh.estimateGoal, sh.estimateDetails, { ...sh.estimateResult, label: "Estimate" }, { ...sh.services, label: "Services" }], caption: "From understanding the service to exploring a property's potential. Sample design; figures are illustrative." },
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

/** Phase two: keep More content available in source, hidden from the live portfolio. */
export const moreProjectsEnabled = false;

/** Only these projects may appear in public navigation and galleries. */
export const visibleProjectSlides = projectSlides.filter(project => !project.archived);

export const portfolioSlideIds = [
  "home",
  ...visibleProjectSlides.filter(project => project.group === "Mobile" && project.placement !== "more").map(project => project.slug),
  "mobile-more",
  ...visibleProjectSlides.filter(project => project.group === "Web" && project.placement !== "more").map(project => project.slug),
  "web-more",
];

export const sectionTitles: Record<string, string> = {
  home: "Home", playground: "Playground", "mobile-more": "More mobile projects",
  "web-more": "More web projects",
};

/** More projects resolve to their gallery rather than entering the main slide sequence. */
export function projectDestination(slug: string) {
  const project = projectSlides.find(item => item.slug === slug);
  if (!project && slug !== "home" && slug !== "mobile-more" && slug !== "web-more") return "home";
  if (project?.archived) return "home";
  if (!moreProjectsEnabled && (project?.placement === "more" || slug === "mobile-more" || slug === "web-more")) return "home";
  return project?.placement === "more" ? `${project.group.toLowerCase()}-more` : slug;
}

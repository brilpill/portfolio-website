/** Working copy from the user's Portfolio content.md, Oct 22 2026.
 * Drafts remain drafts. Metrics, unconfirmed links, photos and live data are omitted.
 */
export const aboutIntro = [
  "I’m Oleh, a product designer from Ukraine, living in Warsaw. For 5+ years I’ve designed web and mobile products for different clients: fintech, crypto, edtech, AI and SaaS.",
  "Most of that time was in agencies and studios, with a new project every few months. It taught me to understand a product fast, work with whoever is in the room, and still care about the small things.",
  "I studied computer engineering before design, so code never felt foreign. Today I also build what I design with coding agents: components, animations and micro-interactions, so what ships looks and feels the way it was designed.",
];
export const principles = [
  ["Feel is the product.", "People judge an interface in the first few taps, long before they read it."],
  ["Details start at the first flow.", "Spacing, states and transitions are design decisions, not cleanup."],
  ["Design it, then build it.", "The biggest losses happen in handoff, so I own both sides."],
  ["The audience decides, not my taste.", "Clarity over the look I’d have wanted, when users need it."],
  ["Propose and test, don’t defend.", "Bring a decision and its reason; change it when evidence says so."],
  ["Agents do the work, I make the calls.", "Every important step passes my judgement."],
  ["Plain beats clever.", "In copy, UI and code."],
  ["Say what you can’t do yet.", "An honest gap beats a polished pitch."],
];
export const skillChips = ["Product Design", "UX/UI Design", "Mobile App Design", "Interaction Design and Motion", "Design Systems", "Design Engineering", "UX Research", "Applied AI"];
export const contentJobs = [
  { company: "HotShots Labs", role: "Senior UI/UX Designer · part-time", dates: "Dec 2025 – Sep 2026", detail: "Studio website, partner pages, an AI estimator questionnaire and marketing pages. Client iOS and Android apps, flows and accessibility." },
  { company: "BASA", role: "Senior UI/UX Designer", dates: "Dec 2025 – Aug 2026", detail: "Edtech platform for tutors, parents, children and admins. Product logic, flows, wireframes, full UI and a shadcn design system." },
  { company: "Fourmeta Agency", role: "UI/UX Designer", dates: "Feb 2024 – Aug 2025", detail: "End-to-end UX/UI for web and mobile, scalable design systems and high-fidelity prototypes for stakeholders and founders." },
  { company: "AskFlow AI", role: "UI/UX Designer · part-time", dates: "Feb 2024 – Aug 2025", detail: "Marketing website redesign and reusable layouts and components for campaign pages." },
  { company: "Come Back Agency", role: "UI/UX Designer · contract", dates: "Jul 2022 – Dec 2023", detail: "Landing and multi-page sites for e-commerce and service clients, with responsive layouts and developer collaboration." },
  { company: "Ovitta Training Company", role: "Brand Designer", dates: "Apr 2021 – Jun 2022", detail: "Brand identity across digital channels, content and visual systems." },
  { company: "MediaTor", role: "Visual Designer", dates: "Jul 2020 – Feb 2021", detail: "Brand identity, social media asset systems and a homepage redesign." },
];
export const services = [
  ["Mobile app design", "Flows, screens and states for iOS and Android, including motion and haptics. Delivered with a component set developers can build from."],
  ["Web design", "Marketing sites and web apps, shaped around what the site needs to achieve, its structure and navigation."],
  ["Front-end build", "Interfaces built in Next.js with coding agents, down to the small interactions."],
  ["Design systems", "Tokens, components and documentation in Figma, matched to code."],
  ["Motion and micro-interactions", "A polish pass on an existing product: transitions, states and feedback."],
];

/** About, after gionatannese.com/about: one statement, then chapters set either side of the head. Working copy;
 * the final text replaces it later. */
export const aboutStatement = "I design how products look, move and feel, and I build them that way.";

export type ExperiencePreview = { title: string; href: string; image: string; crop: [number, number, number, number, number, number] };
export type FlowLink = { label: string; href: string; external?: boolean };
/** One block of a chapter. Blocks alternate sides; each starts on the last line of the one before. `kicker` is a
 * small label above the block that opens a part of the chapter (Intro, Skills…). Text can hold several
 * paragraphs, separated by a blank line. */
export type FlowBlock = { side: "left" | "right"; kicker?: string } & (
  | { kind: "text"; text: string }
  | { kind: "list"; title?: string; items: string[] }
  | { kind: "entry"; meta?: string; title: string; website?: string; subtitle?: string; text?: string; links?: FlowLink[]; previews?: ExperiencePreview[]; art?: ServiceArt }
);
export type ServiceArt = "mobile" | "web" | "landing" | "ai" | "code" | "system" | "motion";
export type AboutChapter = { id: string; title: string; blocks: FlowBlock[] };
/** Services in About, from about-me-content.md (23 Oct 2026); `art` picks the small drawing in about-slide.tsx. */
export const aboutServices: { title: string; text: string; art: ServiceArt }[] = [
  { art: "mobile", title: "Mobile app design", text: "Flows, screens and states for iOS and Android, including the motion and haptics most apps skip, delivered with a component set developers can build from." },
  { art: "web", title: "Web design", text: "Web apps and platforms shaped around what they need to achieve: structure, navigation and every element around them." },
  { art: "landing", title: "Landing pages and marketing websites", text: "Pages built around one job: getting the right visitor to act. On one AI product, demo requests and trial sign-ups grew 30%+." },
  { art: "ai", title: "AI product design", text: "Interfaces for AI features, from chats to agents. Clear states for when the model is thinking, unsure or wrong, so people stay in control." },
  { art: "code", title: "Front-end build", text: "Interfaces built in Next.js with coding agents, down to the small interactions that make a product feel alive without pulling focus." },
  { art: "system", title: "Design systems", text: "Tokens, components and documentation in Figma, matched to code, so what the team ships later still holds together." },
  { art: "motion", title: "Motion and micro-interactions", text: "A polish pass on an existing product: transitions, states and feedback, timed and eased so they feel physical rather than decorative." },
];

/** Experience timeline (after thakursameershetty.com). Months count from Sep 2018; "now" is Oct 2026. */
export const timelineStart = { year: 2018, month: 9 };
export const timelineNow = { year: 2026, month: 10 };
export type TimelineItem = { label: string; from: string; to?: string; kind: "work" | "study" | "course" | "practice"; lane: number };
export const timelineItems: TimelineItem[] = [
  { label: "HotShots Labs", from: "2025-12", to: "2026-09", kind: "work", lane: 0 },
  { label: "BASA", from: "2025-12", to: "2026-08", kind: "work", lane: 1 },
  { label: "Fourmeta", from: "2024-02", to: "2025-08", kind: "work", lane: 0 },
  { label: "AskFlow AI", from: "2024-02", to: "2025-08", kind: "work", lane: 1 },
  { label: "Come Back", from: "2022-07", to: "2023-12", kind: "work", lane: 0 },
  { label: "Ovitta", from: "2021-04", to: "2022-06", kind: "work", lane: 0 },
  { label: "MediaTor", from: "2020-07", to: "2021-02", kind: "work", lane: 0 },
  { label: "Computer Engineering", from: "2018-09", to: "2022-06", kind: "study", lane: 2 },
  { label: "BA Graphic Design", from: "2022-09", to: "2025-06", kind: "study", lane: 2 },
  { label: "Courses", from: "2023-10", kind: "course", lane: 3 },
  { label: "", from: "2025-03", kind: "course", lane: 3 },
  { label: "", from: "2025-07", kind: "course", lane: 3 },
  { label: "Figma practice", from: "2020-03", kind: "practice", lane: 4 },
  { label: "Building with agents", from: "2025-10", kind: "practice", lane: 5 },
];

/** Jobs under the timeline: the copy currently on the site, plus attached cases (slide slugs) and the company site. */
export const experienceJobs = contentJobs.map(job => ({
  ...job,
  ...({
    "HotShots Labs": { website: "https://hotshotslabs.com", projects: [{ label: "HotShots Labs", slug: "hotshots-labs" }] },
    "Fourmeta Agency": { projects: [{ label: "SmartHost", slug: "smarthost" }] },
  } as Record<string, { website?: string; projects?: { label: string; slug: string }[] }>)[job.company],
}));

/** Stack row (after granola.ai): white tiles that drift past; hover pauses and names the job, click opens the tool. */
export const stackTools = [
  { name: "Figma", note: "Where every screen starts", href: "https://www.figma.com" },
  { name: "Claude Code", note: "Builds what I design", href: "https://claude.com/claude-code" },
  { name: "Cursor", note: "Reading and editing code", href: "https://cursor.com" },
  { name: "Next.js", note: "The framework of this site", href: "https://nextjs.org" },
  { name: "Tailwind", note: "Styling, close to the tokens", href: "https://tailwindcss.com" },
  { name: "shadcn", note: "Component starting points", href: "https://ui.shadcn.com" },
  { name: "Vercel", note: "Hosting and previews", href: "https://vercel.com" },
  { name: "Supabase", note: "Data for prototypes", href: "https://supabase.com" },
  { name: "ChatGPT", note: "Research and second opinions", href: "https://chatgpt.com" },
  { name: "Gemini", note: "Research and visuals", href: "https://gemini.google.com" },
  { name: "Spline", note: "3D for the web", href: "https://spline.design" },
  { name: "Motion", note: "Animation in React", href: "https://motion.dev" },
  { name: "Mobbin", note: "Pattern references", href: "https://mobbin.com" },
  { name: "Notion", note: "Notes and briefs", href: "https://www.notion.so" },
  { name: "Slack", note: "Talking with the team", href: "https://slack.com" },
  { name: "GitHub", note: "Code and history", href: "https://github.com/brilpill" },
];

/** Where I've worked, from about-me-content.md. TutorIQ publication under BASA remains unconfirmed.
 * Experience media URLs were supplied directly by the user on 24 October 2026. */
const aboutJobs: { dates: string; company: string; website?: string; role: string; text: string; links?: FlowLink[]; previews?: ExperiencePreview[] }[] = [
  { dates: "Dec 2025 – Sep 2026", company: "HotShots Labs", website: "https://hotshotslabs.com/", role: "Senior UI/UX Designer · part-time", text: "The studio's whole website, partner pages, an AI estimator questionnaire and marketing pages. Features and flows for client iOS and Android apps, redesigned from user feedback, with accessibility built in.", previews: [{"title": "Flutter App Development Agency | HotShots Labs", "href": "https://hotshotslabs.com/", "image": "/experience/hotshots-linkedin.png", "crop": [132, 311, 216, 110, 1212, 508]}] },
  { dates: "Dec 2025 – Aug 2026", company: "BASA", website: "https://www.basa.solutions/", role: "Senior UI/UX Designer", text: "An edtech platform for tutors, parents, children and admins: product logic, flows, wireframes, the full UI and a shadcn design system developers built from. Plus a large marketing site." },
  { dates: "Feb 2024 – Aug 2025", company: "Fourmeta Agency", website: "https://www.fourmeta.com/", role: "UI/UX Designer", text: "End-to-end UX/UI for web and mobile in a 50+ person international team. A Figma design system used across 20+ products, and high-fidelity prototypes for stakeholders and founders.", previews: [{"title": "Fourmeta — agency website & branding", "href": "https://www.behance.net/gallery/232380201/fourmeta-agency-website-branding", "image": "/experience/fourmeta-linkedin.png", "crop": [142, 305, 216, 112, 1212, 508]}, {"title": "UltraLight — Shopify eCommerce", "href": "https://www.behance.net/gallery/207744003/UltraLight-Shopify-eCommerce", "image": "/experience/fourmeta-linkedin.png", "crop": [374, 305, 216, 112, 1212, 508]}, {"title": "Staymo", "href": "https://www.staymo.com/", "image": "/experience/fourmeta-linkedin.png", "crop": [606, 305, 216, 112, 1212, 508]}] },
  { dates: "Feb 2024 – Aug 2025", company: "AskFlow AI", website: "https://www.askflow.ai/", role: "UI/UX Designer · part-time", text: "Redesigned the marketing website of an AI chatbot product: demo requests and trial sign-ups grew 30%+. Reusable layouts so the team could launch campaign pages on their own.", previews: [{"title": "AI Chatbots for eCommerce Upsell & Conversion | Askflow AI", "href": "https://www.askflow.ai/", "image": "/experience/askflow-linkedin.png", "crop": [122, 314, 216, 112, 1192, 526]}] },
  { dates: "Jul 2022 – Dec 2023", company: "Come Back Agency", role: "UI/UX Designer · contract", text: "Landing and multi-page sites for 10+ e-commerce and service clients, with on-site conversion up about 10% on average." },
  { dates: "Apr 2021 – Jun 2022", company: "Ovitta Training Company", role: "Brand Designer", text: "Brand identity across digital channels, and the content system for an Instagram account with 300k+ followers." },
  { dates: "Jul 2020 – Feb 2021", company: "MediaTor", role: "Visual Designer", text: "Brand identity, social media asset systems and a homepage redesign." },
];

const side = (i: number): FlowBlock["side"] => i % 2 ? "right" : "left";

/** The About chapters, from about-me-content.md (23 Oct 2026). Sides alternate so the copy weaves past the cursor. */
export const aboutChapters: AboutChapter[] = [
  { id: "about-me", title: "About me", blocks: [
    { side: "left", kicker: "Intro", kind: "text", text: "I'm Oleh, a UX/UI designer and engineer from Ukraine, based in Warsaw and open to remote, hybrid or on-site roles." },
    { side: "right", kind: "text", text: "For the last 5 years I've designed web and mobile products across fintech, crypto, edtech, AI and SaaS. I've taken products end to end on my own, and I've worked inside big teams with developers, marketing and stakeholders." },
    { side: "left", kind: "text", text: "I also brought engineering into my process. I build what I design, so the motion, micro-interactions and haptics that make a product feel right actually ship." },
    { side: "right", kicker: "What I believe", kind: "entry", title: "Quality", text: "I don't do work just to fill a slot or hit a date. Every feature deserves time and attention, because that's where something useful takes shape. I once stopped a daily UI challenge on day 16: the screens looked fine, but they weren't for anyone.\n\nQuality isn't something I add at the end. It's a habit that runs through every step, from the first flow to the last state nobody asked for." },
    { side: "left", kind: "entry", title: "Feel", text: "People judge a product in the first few taps, long before they read a word. Design isn't only how something looks. It's how it sits in your hand, where it leads your eye, and how naturally it answers when you touch it.\n\nThat's why I care about the layer most products skip: transitions, states, micro-interactions and haptics. Done right, nobody notices them. They only notice that everything feels easy." },
    { side: "right", kind: "entry", title: "Design and build", text: "Most of what gets lost between a design and a product gets lost in handoff. So I own both sides: I design in Figma, then build the front-end with coding agents and check every detail myself.\n\nThe agents do the repetitive work. The decisions stay with me, and every important step passes my judgement before it ships." },
    { side: "left", kind: "entry", title: "Honesty", text: "Good design comes from the audience, not from my taste. If the people using it need clarity, I choose clarity over the look I'd have wanted. I bring a decision and the reason behind it, test it, and change it when the evidence says I'm wrong.\n\nThe same goes for what I say about myself. An honest gap beats a polished pitch, so I'd rather tell you what I can't do yet than promise it." },
  ] },
  { id: "what-i-do", title: "What I do", blocks: [
    { side: "left", kind: "text", text: "I design and build interfaces for web and mobile, from the first flow to the last haptic. Years in agencies meant a new product every few months, so I learn a domain fast and design for the people who use it, not for my own taste." },
    { side: "right", kicker: "Skills", kind: "list", title: "Design", items: ["Product Design", "UX/UI Design", "Mobile Apps (iOS, Android)", "Design Systems", "UX Research"] },
    { side: "left", kind: "list", title: "Build", items: ["Design Engineering", "Interaction and Motion", "Next.js and Tailwind", "Coding agents", "Applied AI"] },
    { side: "right", kicker: "Tools", kind: "list", title: "Design", items: ["Figma", "Mobbin", "Spline"] },
    { side: "left", kind: "list", title: "Build", items: ["Claude Code", "Codex", "Cursor", "Next.js", "Tailwind", "shadcn", "Vercel", "Supabase"] },
    { side: "right", kind: "list", title: "AI and everyday", items: ["Claude", "Gemini", "Higgsfield", "Wispr Flow", "Arc", "Notion"] },
    ...aboutServices.map((service, i): FlowBlock => ({ side: side(i), ...(i === 0 ? { kicker: "Services" } : {}), kind: "entry", art: service.art, title: service.title, text: service.text })),
  ] },
  { id: "experience", title: "Experience", blocks: [
    ...aboutJobs.map((job, i): FlowBlock => ({ side: side(i), ...(i === 0 ? { kicker: "Where I've worked" } : {}), kind: "entry", meta: job.dates, title: job.company, website: job.website, subtitle: job.role, text: job.text, links: job.links, previews: job.previews })),
    { side: "right", kicker: "How I can help", kind: "entry", title: "Product companies", text: "I design features from first flows to release, working in line with developers so what ships matches the design." },
    { side: "left", kind: "entry", title: "Studios and agencies", text: "I join client projects fast and take them from discovery to handoff, with a design system developers can build from." },
    { side: "right", kind: "entry", title: "Startups", text: "I take an idea to a working MVP: product logic, interface, and a front-end I build with coding agents." },
    { side: "left", kind: "entry", title: "Clients", text: "Websites and apps designed and shipped, with the motion included." },
  ] },
];

/** My process sidebar: one line per step for each format, in the order of the sticker's layers (top first).
 * Working copy; the final text replaces it later. */
export const processIntro = {
  web: "How I take a website or web app from the first question to a shipped interface.",
  mobile: "How I take an iOS or Android app from the first question to the release.",
};
export const processSteps: { name: string; web: string; mobile: string }[] = [
  { name: "Understand", web: "Who visits, what they came for and what the site has to achieve. I map the pages and the paths between them.", mobile: "Who opens the app, how often and where. I map the tasks people repeat and the moments they are in a hurry." },
  { name: "Structure", web: "Sitemap, navigation and wireframes for the key pages, checked at desktop and phone widths before any styling.", mobile: "Flows screen by screen with every state: empty, loading, error and offline. Thumb reach and gestures shape the layout." },
  { name: "Explore", web: "Type, colour, grid and motion explored together in a few directions, judged on real content.", mobile: "Directions tried on the device itself, against iOS and Android patterns, so it feels native before it feels new." },
  { name: "Refine", web: "A component set with responsive variants and states, so every page is built from the same parts.", mobile: "Components, states and transitions tuned for touch: tap targets, haptics and system text sizes." },
  { name: "Build", web: "Built in Next.js with coding agents, then checked in the browser: breakpoints, interactions and speed.", mobile: "Specs and a component library developers build from, plus prototypes that show motion and gestures." },
];

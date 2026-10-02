// Source of truth: Knowledge Base → Context → "About me".
// Edit facts there first, then mirror them here.

export const profile = {
  name: "Oleh Bril",
  firstName: "Oleh",
  handle: "brilpill",
  role: "Product designer",
  oneLiner: "Product designer. I design interfaces and build them.",
  /** Under the greeting on the home screen. `{link}` is replaced by `homeLink`. */
  intro: ["Product designer in Warsaw, now working on a {link}.", "I design interfaces and build them, in Figma and in code."],
  homeLink: { label: "crypto card website", slug: "crypto-card-site" },
  city: "Warsaw",
  location: "Warsaw, Poland",
  timezone: "Europe/Warsaw",
  status: "Open to work",
  statusDetail: "Full-time, freelance or contract. Remote, hybrid or on-site in Warsaw.",
  email: "briloleh@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/olehbril" },
    { label: "Behance", href: "https://www.behance.net/brilpill" },
    { label: "Dribbble", href: "https://dribbble.com/brilpill" },
    { label: "GitHub", href: "https://github.com/brilpill" },
    { label: "Telegram", href: "https://t.me/brilpill" },
  ],
  calendly: "https://calendly.com/briloleh/30min",
  numbers: [
    { value: "5+", label: "Years designing products" },
    { value: "20+", label: "Products on one design system" },
    { value: "21.4k", label: "Views on Behance" },
  ],
  languages: "Ukrainian (native), English (B2), Russian (fluent), Polish (A1)",
};

export const experience = [
  {
    years: "2025–2026",
    company: "HotShots Labs",
    role: "Senior UI/UX Designer · part-time",
    work: "The studio website, product flows, partner pages and fintech onboarding research.",
  },
  {
    years: "2025–2026",
    company: "BASA",
    role: "Senior UI/UX Designer",
    work: "An edtech platform for four roles, a design system on shadcn and a ~10-page website.",
  },
  {
    years: "2024–2025",
    company: "Fourmeta Agency, London",
    role: "Middle UI/UX Designer",
    work: "End-to-end UX/UI in a 50+ person team; one design system across 20+ products.",
  },
  {
    years: "2024–2025",
    company: "AskFlow AI, London",
    role: "UI/UX Designer · part-time",
    work: "Marketing website redesign, campaign layouts and a component system.",
  },
  {
    years: "2022–2023",
    company: "Come Back Agency, US",
    role: "UI/UX Designer · contract",
    work: "Landing pages and multi-page sites for 10+ clients.",
  },
  {
    years: "2021–2022",
    company: "Ovitta Training Company, Kyiv",
    role: "Brand Designer",
    work: "Brand identity and visuals for an Instagram with 300k+ followers.",
  },
  {
    years: "2020–2021",
    company: "MediaTor, Ternopil",
    role: "Visual Designer",
    work: "Brand identity, social media systems and a homepage redesign.",
  },
];

export const skills = [
  "Product design end to end — flows, IA, wireframes, UI",
  "Design systems — tokens, components, docs",
  "Marketing and multi-page websites",
  "UX research — interviews, usability tests, audits",
  "Building with AI — Claude Code, Cursor",
  "Brand and visual systems",
];

export const tools = [
  { group: "Design", items: "Figma, FigJam, ProtoPie, Miro" },
  { group: "Web", items: "Framer, Webflow, Shopify, Unicorn Studio" },
  { group: "Code", items: "HTML/CSS, Next.js, Tailwind, shadcn" },
  { group: "AI", items: "Claude Code, Cursor, v0, Lovable, Figma Make" },
];

export const education = [
  { years: "2022–2025", what: "BA, Graphic Design", where: "Ternopil Academy of National Economy" },
  { years: "2025", what: "Google UX Design Professional Certificate", where: "Google" },
  { years: "2025", what: "Figma UI Bootcamp", where: "Memorisely" },
  { years: "2018–2022", what: "Associate degree, Computer Engineering", where: "Ternopil National Technical University" },
];

export const offScreen = [
  "I photograph old cars — mostly on Instagram.",
  "I tried Notion, Raindrop, Obsidian, mymind and Fabric for my notes, then built my own knowledge base.",
  "I stopped #DailyUI at day 16. Designing for the sake of it didn't feel right.",
];

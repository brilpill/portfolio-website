// Source of truth: Knowledge Base → Context → "My projects".
// Projects marked `confirm` still need a yes from the client before going public —
// keep names anonymised until then (see the note on each).

export type Frame = "browser" | "phone" | "none";

export type Media = {
  /** Path under /public, e.g. "/projects/tutoriq/01.png" */
  src: string;
  label: string;
  kind?: "image" | "video";
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  group: GroupId;
  /** One line for cards and search */
  tagline: string;
  body: string[];
  facts: { label: string; value: string }[];
  frame: Frame;
  /** Accent used for the icon and the stage glow */
  accent: string;
  /** Text on the browser bar / placeholder */
  url?: string;
  media?: Media[];
  status?: "in progress" | "unreleased" | "concept";
  /** Needs client approval before the real name/screens go public */
  confirm?: string;
};

export type GroupId = "case-studies" | "client-work" | "concepts" | "lab";

export const groups: { id: GroupId; label: string }[] = [
  { id: "case-studies", label: "Case studies" },
  { id: "client-work", label: "Client work" },
  { id: "concepts", label: "Concepts" },
  { id: "lab", label: "Lab" },
];

export const projects: Project[] = [
  {
    slug: "edtech-platform",
    title: "Tutoring Platform",
    client: "EdTech · via BASA",
    group: "case-studies",
    tagline: "One product for tutors, parents, kids and admins",
    body: [
      "A learning platform where four people meet in one product: the tutor, the parent who pays, the child who learns and the admin who keeps it running. Each needs a different app, and they all share the same lessons.",
      "I started with the relations between the roles before drawing any screens — who sees what, who can change what, who gets told when something moves. That map became the sitemap, then wireframes, then the full UI.",
      "Underneath sits a design system built on shadcn, so the developers worked with components they already knew. I also designed the ~10-page marketing website that sells it.",
    ],
    facts: [
      { label: "Roles in one product", value: "4" },
      { label: "Role", value: "Senior UI/UX Designer" },
      { label: "Year", value: "2025–2026" },
    ],
    frame: "browser",
    accent: "#3B82F6",
    url: "app.tutoring-platform",
    confirm: "Ask BASA whether the TutorIQ name and logo can appear.",
  },
  {
    slug: "hotshots-labs",
    title: "HotShots Labs",
    client: "Design studio",
    group: "case-studies",
    tagline: "The studio's whole web presence, end to end",
    body: [
      "HotShots Labs is a design studio I work with part-time. I designed their whole website, plus the pages they make for partner companies.",
      "Beyond the site I design product flows for the studio's clients. The deepest piece was a large fintech and banking onboarding research report, built by pulling real flows from Mobbin through Claude.",
      "The site is live at hotshotslabs.com.",
    ],
    facts: [
      { label: "Figma files", value: "22" },
      { label: "Role", value: "Senior UI/UX Designer" },
      { label: "Year", value: "2025–2026" },
    ],
    frame: "browser",
    accent: "#F97316",
    url: "hotshotslabs.com",
    status: "in progress",
    confirm: "Keep the AI estimator out until it launches.",
  },
  {
    slug: "solar-install-app",
    title: "Solar Install App",
    client: "Energy · client project",
    group: "case-studies",
    tagline: "A mobile app for installing solar panels",
    body: [
      "A mobile app for the crews who install solar panels — the whole process in a compact project.",
      "I scoped it and wrote the estimate, prepared the client calls, then went from wireframes to the final UI.",
      "Small enough to show every step, which is why it's the template for the rest of these case studies.",
    ],
    facts: [
      { label: "Platform", value: "Mobile" },
      { label: "Role", value: "Scoping, UX, UI" },
      { label: "Year", value: "2026" },
    ],
    frame: "phone",
    accent: "#EAB308",
    status: "unreleased",
    confirm: "Check whether the client name (LuminAsset) can be public.",
  },
  {
    slug: "knowledge-base",
    title: "Knowledge Base",
    client: "Own product",
    group: "case-studies",
    tagline: "Everything I save, filed by AI and found by meaning",
    body: [
      "I tried Notion, Raindrop, Obsidian, mymind and Fabric. None of them found things the way I remember them, so I built my own.",
      "Anything I save — from the app, a Telegram bot or a Chrome extension — gets filed by Claude: what it is, what it's for, how it looks. Search mixes full text with meaning, so \"free icons\" finds Lucide even though the word never appears.",
      "I made every decision and wrote the code: Next.js, Tailwind, shadcn, Supabase and Claude. It's also where the text on this page came from.",
    ],
    facts: [
      { label: "Curated items", value: "~560" },
      { label: "Role", value: "Design, Development" },
      { label: "Year", value: "2026" },
    ],
    frame: "browser",
    accent: "#10B981",
    url: "localhost:3939",
  },
  {
    slug: "crypto-card-site",
    title: "Crypto Card Website",
    client: "Crypto · client project",
    group: "client-work",
    tagline: "A large multi-page site for a crypto card",
    body: [
      "A multi-page website for a crypto card, designed from the first wireframe.",
      "It's in progress and lands around mid-October 2026. The full case goes up after launch.",
    ],
    facts: [
      { label: "Status", value: "In progress" },
      { label: "Role", value: "Web design" },
      { label: "Year", value: "2026" },
    ],
    frame: "browser",
    accent: "#8B5CF6",
    status: "in progress",
    confirm: "Ask before naming Draupnir.",
  },
  {
    slug: "licoglass",
    title: "LicoGlass",
    client: "E-commerce",
    group: "client-work",
    tagline: "A big shop, then and now",
    body: [
      "A large Ukrainian e-commerce site I designed about three years ago. It shipped with a strong vibe and visuals that have aged.",
      "Here it sits next to a redesign I made for this portfolio — same products, same structure, what I'd do differently today.",
    ],
    facts: [
      { label: "Format", value: "Then vs now" },
      { label: "Role", value: "Web design" },
      { label: "Year", value: "~2023" },
    ],
    frame: "browser",
    accent: "#06B6D4",
    url: "licoglass",
  },
  {
    slug: "bomo",
    title: "BOMO",
    client: "Website",
    group: "client-work",
    tagline: "A multi-page site in the style I like most",
    body: [
      "A multi-page website in the visual style I like most. It hasn't launched, so it lives here as a small case.",
    ],
    facts: [
      { label: "Status", value: "Unreleased" },
      { label: "Role", value: "Web design" },
    ],
    frame: "browser",
    accent: "#EC4899",
    status: "unreleased",
  },
  {
    slug: "ternopil-archive",
    title: "Ternopil Archive",
    client: "Art & culture",
    group: "client-work",
    tagline: "An interactive archive of the city, 1991–2024",
    body: [
      "An interactive multimedia archive of Ternopil from 1991 to 2024 — the city I'm from.",
      "A creative project rather than a product: unreleased, shown here as a short case.",
    ],
    facts: [
      { label: "Status", value: "Unreleased" },
      { label: "Years covered", value: "1991–2024" },
    ],
    frame: "browser",
    accent: "#A16207",
    status: "unreleased",
  },
  {
    slug: "york-bank",
    title: "York Bank",
    client: "Fintech · concept",
    group: "concepts",
    tagline: "A banking app concept",
    body: [
      "A banking app concept and still my most viewed piece on Behance.",
    ],
    facts: [
      { label: "Behance views", value: "10.1k" },
      { label: "Appreciations", value: "745" },
      { label: "Year", value: "~2022" },
    ],
    frame: "phone",
    accent: "#0EA5E9",
    status: "concept",
  },
  {
    slug: "splurge",
    title: "Splurge",
    client: "Crypto · concept",
    group: "concepts",
    tagline: "A crypto wishlist for creators and fans",
    body: ["A crypto wishlist platform for creators and their fans. A concept from my Dribbble."],
    facts: [
      { label: "Format", value: "Concept" },
      { label: "Year", value: "2025" },
    ],
    frame: "browser",
    accent: "#F43F5E",
    status: "concept",
  },
  {
    slug: "peachhealth",
    title: "PeachHealth",
    client: "Health · concept",
    group: "concepts",
    tagline: "AI health tracking",
    body: ["An AI health tracking app. A concept from my Dribbble."],
    facts: [
      { label: "Format", value: "Concept" },
      { label: "Year", value: "2025" },
    ],
    frame: "phone",
    accent: "#FB923C",
    status: "concept",
  },
  {
    slug: "ramp-up",
    title: "Ramp Up",
    client: "Crypto · concept",
    group: "concepts",
    tagline: "A crypto dashboard",
    body: ["A crypto dashboard. A concept from my Dribbble."],
    facts: [
      { label: "Format", value: "Concept" },
      { label: "Year", value: "2025" },
    ],
    frame: "browser",
    accent: "#22C55E",
    status: "concept",
  },
  {
    slug: "promptly",
    title: "Promptly",
    client: "Own product",
    group: "lab",
    tagline: "A library of AI prompts",
    body: [
      "An AI prompt library I founded. I led the idea, the research and the UI, and worked with a developer and an AI expert to build it.",
    ],
    facts: [
      { label: "Role", value: "Founder, Design" },
      { label: "Year", value: "2025" },
    ],
    frame: "browser",
    accent: "#6366F1",
  },
  {
    slug: "this-site",
    title: "This Website",
    client: "Lab",
    group: "lab",
    tagline: "Designed in Figma, built with Claude Code",
    body: [
      "The site you're on. Content comes straight from my knowledge base; the build is Next.js and Tailwind, written with Claude Code.",
      "Press ⌘K to jump anywhere.",
    ],
    facts: [
      { label: "Stack", value: "Next.js, Tailwind" },
      { label: "Year", value: "2026" },
    ],
    frame: "none",
    accent: "#16161A",
    status: "in progress",
  },
];

export const featured = ["edtech-platform", "hotshots-labs", "knowledge-base"];

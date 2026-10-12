// The public slice of my knowledge base. `src/content/library.json` is written by
// `pnpm export:public -- --out <this repo>/src/content/library.json` in the knowledge-base
// worker; the rules for what may leave the base live there (lib/public-export.ts), and
// this file only reads what came out. Keep the types below in step with `PublicItem`.
//
// Client components import this file, so it must never import the data itself — that
// lives in ./library-data, which only server pages use.

export type LibraryItem = {
  slug: string;
  title: string;
  summary: string | null;
  url: string;
  domain: string | null;
  type: string;
  subtype: string | null;
  lane: string | null;
  category: string | null;
  tags: string[];
  status: string;
  rating: number | null;
  savedOn: string;
  tool?: { pricing: string | null; platforms: string[]; openSource: boolean | null };
  github?: { repo: string | null; stars: number | null; language: string | null };
  installed?: boolean;
  look?: {
    dark: boolean | null;
    bg: string | null;
    text: string | null;
    accent: string | null;
    palette: string[];
    hues: string[];
    heading: string | null;
    body: string | null;
    animated: boolean | null;
  };
  media: {
    logo: string | null;
    og: string | null;
    screenshot: string | null;
    thumb: string | null;
    motion: string | null;
    width: number | null;
    height: number | null;
    embeddable: boolean | null;
  };
  pages?: { kind: string | null; url: string; screenshot: string | null; motion: string | null }[];
  credit?: string | null;
  similar: { meaning: string[]; look: string[] };
};

/* ---------- Words ---------- */

/** Shelves in the order a visitor reads them. */
export const SHELVES = [
  { id: "inspiration", label: "Inspiration", blurb: "Sites I go back to for how they look" },
  { id: "tool", label: "Tools", blurb: "Apps and services for the work" },
  { id: "fragment", label: "UI kits", blurb: "Component libraries, design systems, icon sets" },
  { id: "plugin", label: "Plugins & skills", blurb: "Things that extend Figma or an AI agent" },
  { id: "learn", label: "Learning", blurb: "Courses, books and articles" },
  { id: "prompt", label: "Prompts", blurb: "Prompt libraries" },
  { id: "checklist", label: "Checklists", blurb: "Lists to check work against" },
] as const;

const KIND: Record<string, string> = {
  "fragment/component-lib": "Component library",
  "fragment/design-system": "Design system",
  "fragment/icon-set": "Icon set",
  "fragment/template": "Template",
  "fragment/theme": "Theme",
  "fragment/font": "Font",
  "tool/library": "Directory",
  "tool/multitool": "Multi-tool",
  "learn/course": "Course",
  "learn/book": "Book",
  "learn/article": "Article",
  "learn/mentorship": "Mentorship",
  "learn/case-study": "Case study",
  "learn/gamified": "Game",
  "learn/language": "Language",
  "plugin/skill": "Agent skill",
  "plugin/mcp": "MCP server",
  "plugin/plugin": "Plugin",
  "prompt/library": "Prompt library",
  "checklist/library": "Checklist library",
  "checklist/photo": "Checklist",
};

const LANE: Record<string, string> = { library: "Gallery", reference: "Reference", pin: "Pin" };

/** What a thing is, in one or two words: "Icon set", "Reference", "Tool". */
export function kindOf(item: Pick<LibraryItem, "type" | "subtype" | "lane">): string {
  if (item.subtype && KIND[`${item.type}/${item.subtype}`]) return KIND[`${item.type}/${item.subtype}`];
  if (item.type === "inspiration") return LANE[item.lane ?? ""] ?? "Inspiration";
  const shelf = SHELVES.find((s) => s.id === item.type)?.label ?? item.type;
  return item.type === "tool" ? "Tool" : shelf;
}

const SUBJECT: Record<string, string> = {
  ai: "AI",
  "3d": "3D",
  saas: "SaaS",
  web3: "Web3",
  "ux-principles": "UX principles",
  "ux-research": "UX research",
  "component-lib": "Component libraries",
};

/** A subject as a person would write it: "ux-principles" → "UX principles". */
export function subjectLabel(s: string): string {
  if (SUBJECT[s]) return SUBJECT[s];
  const words = s.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const PLATFORM: Record<string, string> = {
  web: "Web",
  api: "API",
  mac: "Mac",
  ios: "iOS",
  vscode: "VS Code",
  "claude-code": "Claude Code",
  npm: "npm",
  cli: "CLI",
  "self-hosted": "Self-hosted",
  agent: "Any agent",
};

export const platformLabel = (p: string) => PLATFORM[p] ?? p.charAt(0).toUpperCase() + p.slice(1);

/** Free / Freemium / Paid; nothing for "unknown", which is an honest gap rather than a fact to show. */
export const pricingLabel = (p: string | null | undefined) =>
  p && p !== "unknown" ? p.charAt(0).toUpperCase() + p.slice(1) : null;

export const STATUS: Record<string, string | undefined> = { active: "I use it", to_try: "On my list to try" };

/**
 * A page title without the part that repeats the site's tagline:
 * "ColorBox – Color Palette Generator" → "ColorBox". The full title stays on the item page.
 */
export function shortTitle(title: string): string {
  const clean = title.replace(/\s+/g, " ").trim();
  const parts = title.split(/\s[—–|·-]\s|\s{2,}/);
  const first = parts[0]?.trim();
  return parts.length > 1 && first && first.length >= 3 ? first : clean;
}

/* ---------- Colour ---------- */

/**
 * The colour buckets the design pass records. Grey, white and black are on almost
 * every page, so they narrow nothing and aren't offered as filters.
 */
export const HUES = [
  { id: "red", swatch: "#e5484d" },
  { id: "orange", swatch: "#f76b15" },
  { id: "yellow", swatch: "#ffc53d" },
  { id: "green", swatch: "#30a46c" },
  { id: "teal", swatch: "#12a594" },
  { id: "blue", swatch: "#0090ff" },
  { id: "purple", swatch: "#8e4ec6" },
  { id: "pink", swatch: "#d6409f" },
] as const;

/* ---------- Cards ---------- */

/** What the grid needs of an item — the rest stays on the server. */
export type Card = {
  slug: string;
  title: string;
  summary: string | null;
  domain: string | null;
  type: string;
  kind: string;
  category: string | null;
  status: string;
  pictures: string[];
  logo: string | null;
  motion: string | null;
  palette: string[];
  hues: string[];
  dark: boolean | null;
  /** What search also matches that the card doesn't show: tags, typefaces, platforms, the full title. */
  extra: string;
};

/** Everything a search matches against, built in the browser so the page doesn't ship it twice. */
export const searchText = (c: Card) =>
  [c.title, c.summary, c.domain, c.category, c.kind, c.extra].filter(Boolean).join(" ").toLowerCase();

/** Pictures in the order a card should try them; a dead one falls through to the next. */
export const picturesOf = (i: LibraryItem) =>
  [i.media.screenshot, i.media.og, i.media.thumb].filter((s, n, all): s is string => !!s && all.indexOf(s) === n);

export function toCard(i: LibraryItem): Card {
  return {
    slug: i.slug,
    title: shortTitle(i.title),
    summary: i.summary,
    domain: i.domain,
    type: i.type,
    kind: kindOf(i),
    category: i.category,
    status: i.status,
    pictures: picturesOf(i),
    logo: i.media.logo,
    motion: i.media.motion,
    palette: (i.look?.palette ?? []).slice(0, 5),
    hues: i.look?.hues ?? [],
    dark: i.look?.dark ?? null,
    extra: [
      i.title.replace(/\s+/g, " ").trim() !== shortTitle(i.title) ? i.title : null,
      ...i.tags,
      i.look?.heading,
      i.look?.body,
      ...(i.tool?.platforms ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );

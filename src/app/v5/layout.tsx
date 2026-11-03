import type { Metadata } from "next";
import { V5Shell } from "@/components/v5/shell";
import { caseFacts, facts, type CaseFact } from "@/content/facts";
import { articles } from "@/content/articles";
import type { AskTag } from "@/components/v5/ask-menu";
import { v5, v5Work } from "@/content/v5";
import "./v5.css";

/** Preview of v5, laid out after rachelchen.tech and restyled from Figma; not indexed. Radley and Ronzino come from the root layout. */
export const metadata: Metadata = {
  title: { default: `${facts.name} | ${facts.title}`, template: `%s | ${facts.name}` },
  description: facts.oneLiner,
  robots: { index: false, follow: false },
};

/** A case's tagged starter questions, each answered from its facts, and only where the fact is there. */
const startersOf = (fact?: CaseFact) => fact ? [
  { q: "what is it?", a: fact.summary },
  fact.role && { q: "what was your role?", a: `My role: ${fact.role}.` },
  fact.outcome && { q: "how did it turn out?", a: fact.outcome },
  fact.timeline && { q: "how long did it take?", a: `${fact.timeline}.` },
].filter(starter => !!starter) : undefined;

/** What "@" in the ask field can tag: the home page's work (not the Playground pieces) and the articles. */
const askTags: AskTag[] = [
  ...v5Work.map(item => ({
    id: `project-${item.slug}`, kind: "Project" as const, title: item.title, meta: item.meta, href: item.href, external: item.external,
    answer: caseFacts.find(fact => fact.slug === item.slug)?.summary ?? `${item.title}: ${item.meta}.`,
    starters: startersOf(caseFacts.find(fact => fact.slug === item.slug)),
  })),
  ...articles.map(article => ({
    id: `article-${article.slug}`, kind: "Article" as const, title: article.title, meta: `${article.minutes} min read`, href: `/v5/writing/${article.slug}`, external: false,
    answer: article.summary,
  })),
];

export default function V5Layout({ children }: LayoutProps<"/v5">) {
  return (
    <>
      <V5Shell info={{ name: v5.name, email: v5.email, status: facts.availability.status, links: v5.links, cases: Object.fromEntries(v5Work.map(item => [item.slug, item.title])), tags: askTags }}>{children}</V5Shell>
    </>
  );
}

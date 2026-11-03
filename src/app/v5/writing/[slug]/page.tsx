import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/v5/markdown";
import { articleDate, articleOf, articles } from "@/content/articles";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/v5/writing/[slug]">): Promise<Metadata> {
  const article = articleOf((await params).slug);
  return article ? { title: article.title, description: article.summary } : {};
}

export default async function V5Article({ params }: PageProps<"/v5/writing/[slug]">) {
  const article = articleOf((await params).slug);
  if (!article) notFound();
  const index = articles.indexOf(article);
  const next = articles[index + 1];

  return (
    <article className="v5-article">
      <p className="v5-label">{articleDate(article.date)} · {article.minutes} min read</p>
      <h1 className="v5-case-title">{article.title}</h1>
      <Markdown source={article.body} />
      {next ? (
        <Link className="v5-next" href={`/v5/writing/${next.slug}`} data-cursor="Read next">
          <span>Next article</span><b>{next.title}</b><em>{next.summary}</em>
        </Link>
      ) : (
        <Link className="v5-next" href="/v5" data-cursor="Back to work">
          <span>That&apos;s all for now</span><b>Back to work</b>
        </Link>
      )}
    </article>
  );
}

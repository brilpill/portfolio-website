/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { MockFrame } from "@/components/v5/devices";
import { V5HeroChat } from "@/components/v5/hero-chat";
import { IconCursor, IconSparkle } from "@/components/v5/icons";
import { SelFrame } from "@/components/v5/sel-frame";
import { v5, v5Featured, type V5Featured } from "@/content/v5";
import { articleDate, articles, type Article } from "@/content/articles";
import { aboutIntro, principles } from "@/content/portfolio-content";
import { facts } from "@/content/facts";

/** Home, after Figma brilpill · Final (1300:6464): hero with the ask field, the work in two columns with a way into the
 * Playground, Writing, and an About band at the foot. */
export default function V5Home() {
  const columns = [0, 1].map(col => v5Featured.map((item, i) => ({ item, i })).filter(({ i }) => i % 2 === col));
  return (
    <div className="v5-home">
      <V5HeroChat lines={v5.hero as [string, string]} placeholder={v5.askPlaceholder} chips={v5.askChips} owner={v5.name.split(" ")[0]} />

      <section className="v5-works" aria-label="Work">
        <div className="v5-work">
          {columns.map((cards, col) => (
            <div key={col} className="v5-work-col">
              {cards.map(({ item, i }) => <WorkCard key={item.id} item={item} order={i} />)}
            </div>
          ))}
        </div>
        <Link className="v5-btn" data-style="primary" href="/v5/fun"><IconSparkle />Explore More in Playground</Link>
      </section>

      <section className="v5-articles" aria-labelledby="v5-articles-title">
        <h2 id="v5-articles-title" className="v5-h2">Writing</h2>
        <div className="v5-articles-row">{articles.map(article => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>

      <About />
    </div>
  );
}

/** Project Card (1326:24873): the device frame, then the name and what it is. Hover draws the selection frame with the
 * year on its tag. */
function WorkCard({ item, order }: { item: V5Featured; order: number }) {
  const body = (
    <>
      <div className="v5-card-media">
        <MockFrame mock={item.mock} label={`${item.client} on a device`} />
        <SelFrame card tag={item.year} />
      </div>
      <div className="v5-card-caption"><span>{item.client}</span><b>{item.type}</b></div>
    </>
  );
  const style = { order };
  if (!item.href) return <div className="v5-card" data-empty style={style}>{body}</div>;
  return item.external
    ? <a className="v5-card" style={style} href={item.href} target="_blank" rel="noopener noreferrer" data-cursor="Visit site">{body}</a>
    : <Link className="v5-card" style={style} href={item.href} data-cursor="View project">{body}</Link>;
}

/** An article as a card (Articles 1328:29981): its opening, set like a printed page on the raised surface, then the
 * date, title and summary. */
function ArticleCard({ article }: { article: Article }) {
  const opening = article.body.replace(/^#.*$/gm, "").replace(/[*_`>#]/g, "").split(/\n\s*\n/).map(part => part.trim()).filter(Boolean).slice(0, 4);
  return (
    <Link className="v5-card v5-article-card" href={`/v5/writing/${article.slug}`} data-cursor="Read">
      <div className="v5-card-media">
        <div className="v5-article-page" aria-hidden>
          <b>{article.title}</b>
          {opening.map((part, i) => <p key={i}>{part}</p>)}
        </div>
        <SelFrame card tag={article.date.slice(0, 4)} />
      </div>
      <p className="v5-article-meta">{articleDate(article.date)} · {article.minutes} min read</p>
      <div className="v5-card-caption"><span>{article.title}</span><b>{article.summary}</b></div>
    </Link>
  );
}

/** About band (About me 1328:33111): who Oleh is, three of his principles, his name card and a way to write to him,
 * beside his photo. */
function About() {
  return (
    <section className="v5-about-band" aria-labelledby="v5-about-title">
      <div className="v5-about-text">
        <div className="v5-about-intro">
          <h2 id="v5-about-title" className="v5-h2">By the way, I’m {facts.name}</h2>
          <p>{aboutIntro[0]}</p>
        </div>
        <dl className="v5-about-points">
          {principles.slice(0, 3).map(([term, line]) => (
            <div key={term}><dt>{term.replace(/\.$/, "")}</dt><dd>{line}</dd></div>
          ))}
        </dl>
        <div className="v5-about-card">
          <img src="/v5/sprite/intro.png" alt="" width={39} height={39} />
          <div><b>{facts.name} @brilpill</b><span>{facts.title}</span></div>
        </div>
        <a className="v5-btn" data-style="primary" data-size="lg" href={`mailto:${facts.email}`}><IconCursor />Contact Me</a>
      </div>
      <div className="v5-about-photo"><img src="/v5/sprite/intro.png" alt={`${facts.name}`} loading="lazy" /></div>
    </section>
  );
}

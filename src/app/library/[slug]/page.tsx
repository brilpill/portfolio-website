import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { LibraryCard } from "@/components/library/card";
import { Count, MobileBar, RailGroup, SidebarFrame } from "@/components/library/frame";
import { ArrowBack, ArrowOut, ShelfDot } from "@/components/library/icons";
import { PaletteSwatches } from "@/components/library/look";
import { Logo } from "@/components/library/picture";
import { Preview } from "@/components/library/preview";
import { itemClass } from "@/components/nav-item";
import { InfoPanel } from "@/components/sections";
import { profile } from "@/content/profile";
import { findItem, items, neighbours } from "@/lib/library-data";
import {
  formatDay,
  kindOf,
  platformLabel,
  pricingLabel,
  SHELVES,
  shortTitle,
  STATUS,
  subjectLabel,
  toCard,
  type LibraryItem,
} from "@/lib/library";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return items.map((i) => ({ slug: i.slug }));
}

async function load(params: Props["params"]): Promise<LibraryItem> {
  const { slug } = await params;
  const found = findItem(slug);
  if (!found) notFound();
  // The title part of a slug follows the title; the id part never changes, so an old link still lands.
  if (found.moved) permanentRedirect(`/library/${found.item.slug}`);
  return found.item;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = findItem((await params).slug);
  if (!found) return {};
  const i = found.item;
  const picture = i.media.og ?? i.media.screenshot;
  return {
    title: `${shortTitle(i.title)} — Library — ${profile.name}`,
    description: i.summary ?? undefined,
    openGraph: picture ? { images: [picture] } : undefined,
  };
}

export default async function LibraryItemPage({ params }: Props) {
  const item = await load(params);
  const title = shortTitle(item.title);
  const fullTitle = item.title.replace(/\s+/g, " ").trim();
  const domain = item.domain ?? new URL(item.url).hostname;
  const look = item.look;
  const accent = look?.accent ?? look?.palette.find((c) => !/^#(f|e|0|1)/i.test(c)) ?? "#8a887f";
  const byMeaning = neighbours(item.similar.meaning);
  const byLook = neighbours(item.similar.look);

  const facts = [
    { label: "Kind", value: kindOf(item) },
    item.category && { label: "Subject", value: subjectLabel(item.category) },
    pricingLabel(item.tool?.pricing) && { label: "Pricing", value: pricingLabel(item.tool?.pricing)! },
    item.tool?.platforms.length && { label: "Runs on", value: item.tool.platforms.map(platformLabel).join(", ") },
    item.github?.stars != null && { label: "GitHub stars", value: item.github.stars.toLocaleString("en-GB") },
    STATUS[item.status] && { label: "Status", value: STATUS[item.status]! },
    { label: "Saved", value: formatDay(item.savedOn) },
  ].filter((f): f is { label: string; value: string } => !!f);

  return (
    <>
      <SidebarFrame>
        <RailGroup label="Library">
          <Link href="/library" className={itemClass(false)}>
            <span className="grid size-[18px] place-items-center text-muted">
              <ArrowBack />
            </span>
            <span className="flex-1">Everything</span>
            <Count n={items.length} />
          </Link>
          {SHELVES.filter((s) => items.some((i) => i.type === s.id)).map((s) => (
            <Link key={s.id} href={`/library?shelf=${s.id}`} className={itemClass(item.type === s.id)}>
              <ShelfDot id={s.id} />
              <span className="flex-1 truncate">{s.label}</span>
              <Count n={items.filter((i) => i.type === s.id).length} />
            </Link>
          ))}
        </RailGroup>
      </SidebarFrame>

      <MobileBar back="/library" title="Library" />

      <main className="flex flex-col gap-4 px-2 py-4 lg:ml-[240px] lg:py-2 lg:pr-2">
        <section className="flex flex-col gap-4 lg:min-h-[calc(100svh-16px)] lg:flex-row lg:gap-6">
          <div className="min-w-0 flex-1">
            <Preview
              url={item.url}
              domain={domain}
              screenshot={item.media.screenshot ?? item.media.thumb}
              og={item.media.og}
              motion={item.media.motion}
              embeddable={item.media.embeddable === true}
              accent={accent}
              palette={look?.palette ?? []}
            />
          </div>

          <InfoPanel
            facts={facts}
            header={
              <div className="flex items-center gap-2.5">
                <Logo src={item.media.logo} name={title} size={28} />
                <div className="min-w-0 leading-tight">
                  <h1 className="truncate text-[14px] font-medium">{title}</h1>
                  <div className="truncate text-[12px] text-muted">{domain}</div>
                </div>
              </div>
            }
          >
            {fullTitle !== title && <p className="-mb-2 text-[13px] text-muted">{fullTitle}</p>}
            {item.summary && <p>{item.summary}</p>}

            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-line-strong bg-raised px-3.5 py-2.5 text-[14px] text-ink shadow-card transition-[translate] duration-500 ease-out-quint hover:-translate-y-0.5"
            >
              Open {domain}
              <ArrowOut />
            </a>

            {look && (look.palette.length > 0 || look.heading || look.body) && (
              <div className="flex flex-col gap-3">
                <span className="label">The look</span>
                {look.palette.length > 0 && <PaletteSwatches colours={look.palette} />}
                <dl className="flex flex-col gap-1 text-[13px]">
                  {look.heading && <Row label="Headings" value={look.heading} />}
                  {look.body && look.body !== look.heading && <Row label="Text" value={look.body} />}
                  {look.dark != null && <Row label="Page" value={look.dark ? "Dark" : "Light"} />}
                  {look.animated && <Row label="Motion" value="Moves on its own" />}
                </dl>
              </div>
            )}

            {item.pages && item.pages.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="label">More of this site</span>
                {item.pages.map((p) => (
                  <a
                    key={p.url}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-[14px] text-ink-2 hover:text-ink"
                  >
                    <span className="capitalize">{p.kind ?? new URL(p.url).pathname}</span>
                    <ArrowOut />
                  </a>
                ))}
              </div>
            )}

            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/library?q=${encodeURIComponent(t)}`}
                    className="rounded-full border border-line px-2.5 py-0.5 text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}
          </InfoPanel>
        </section>

        {(byMeaning.length > 0 || byLook.length > 0) && (
          <section className="flex flex-col gap-8 rounded-[14px] border border-line bg-panel px-5 py-8 sm:px-6">
            <Related
              label="Close by meaning"
              note="Saved things whose descriptions sit nearest this one's."
              list={byMeaning}
            />
            <Related label="Looks like" note="Saved things whose screenshots look most alike." list={byLook} />
          </section>
        )}
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate text-right text-ink">{value}</dd>
    </div>
  );
}

function Related({ label, note, list }: { label: string; note: string; list: LibraryItem[] }) {
  if (!list.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="label">{label}</span>
        <span className="text-[12px] text-muted">{note}</span>
      </div>
      {/* a row to swipe on a phone, a grid from there up */}
      <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:overflow-visible sm:px-0 sm:pb-0">
        {list.map((i) => (
          <div key={i.slug} className="w-[240px] shrink-0 snap-start sm:w-auto">
            <LibraryCard card={toCard(i)} />
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { LibraryBrowser } from "@/components/library/browser";
import { profile } from "@/content/profile";
import { formatDay, toCard } from "@/lib/library";
import { generatedAt, items } from "@/lib/library-data";

export const metadata: Metadata = {
  title: `Library — ${profile.name}`,
  description: "Tools, references and UI kits from my knowledge base, filed by AI and filterable by colour.",
};

export default function LibraryPage() {
  return <LibraryBrowser cards={items.map(toCard)} how={<HowItsMade />} />;
}

const STEPS = [
  {
    title: "Saved from wherever I am",
    body: "A Chrome extension, a Telegram bot, or a link pasted into the app. Saving is one action; I don't file anything.",
  },
  {
    title: "Filed by Claude",
    body: "Claude reads each page and decides the shelf, the subject and the tags. Everything lands in an inbox first, and only what I keep ends up here.",
  },
  {
    title: "Looked at by a browser",
    body: "A headless browser opened every site, read its colours and typefaces, and recorded a few seconds of it moving. That's the palette on each card and the clip on hover.",
  },
  {
    title: "Related without an API",
    body: "“Close by meaning” compares text embeddings; “Looks like” compares picture embeddings. Both are worked out once, when the library is exported, so this page calls nothing.",
  },
];

function HowItsMade() {
  return (
    <section id="how" className="scroll-mt-4 border-t border-line px-5 py-10 sm:px-6">
      <div className="flex max-w-[860px] flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="label">How this page is made</span>
          <span className="label">Exported {formatDay(generatedAt)}</span>
        </div>
        <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="font-mono text-[12px] text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-medium">{s.title}</span>
                <p className="text-[14px] leading-[1.6] text-ink-2">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-[14px] text-ink-2">
          The knowledge base behind it is{" "}
          <Link href="/#knowledge-base" className="text-ink underline decoration-line-strong underline-offset-4">
            one of my case studies
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

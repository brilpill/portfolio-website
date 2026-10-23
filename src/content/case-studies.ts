import type { CaseScreen, ProjectSlideMedia } from "./project-slides";

/**
 * Full case study pages at /cases/[slug], laid out after the Figma case study frame (1001:1859):
 * a header, one large figure, then chapters of short copy each followed by its figures.
 *
 * - chapter: a label, a short title and a paragraph, then any figures. Two `pair` figures sit side by side,
 *   each with its own label, title and line of copy above it.
 * - `strong` in a paragraph is a phrase to emphasise; it must appear verbatim in `body`.
 */
export type CaseStudyFigure = ProjectSlideMedia;
export type CaseStudyPairItem = { label: string; title: string; body: string; media: CaseStudyFigure };
export type CaseStudyChapter = {
  id: string;
  label: string;
  title: string;
  body: string;
  strong?: string;
  figures?: CaseStudyFigure[];
  pair?: [CaseStudyPairItem, CaseStudyPairItem];
};
export type CaseStudy = {
  slug: string;
  year: string;
  /** Status beside the meta row, e.g. "Not public" or "Live". */
  status?: string;
  duration?: string;
  title: string;
  intro: string;
  hero: CaseStudyFigure;
  chapters: CaseStudyChapter[];
  /** The case the "Next project" link at the foot points to. */
  next?: { slug: string; title: string; summary: string };
};

// Sample screens shared with the case slides; they come from the Figma file and must be replaced before launch.
const loanTerm: CaseScreen = { src: "/cases/samples/loan-term.png", alt: "Loan term step: a slider for the number of months and the monthly payment", label: "Term" };
const loanSigned: CaseScreen = { src: "/cases/samples/loan-signed.png", alt: "Final step: the loan is on its way", label: "Signed" };

/** Fictional sample copy, to review the layout until the real case is written. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "luminasset",
    year: "2026",
    status: "Not public",
    duration: "6 weeks",
    title: "Making a complex flow feel simple.",
    intro: "LuminAsset lends against the things people already own. The old flow asked for everything up front and lost most people before the first offer. I reworked the journey from the first screen to the signed contract, and designed the visual language that carries it.",
    hero: { kind: "device", screens: [loanTerm, loanSigned] },
    chapters: [
      {
        id: "offer", label: "Offer", title: "An offer before a form",
        body: "People came to see what they could get, not to fill in details. Now the first screen is the offer: drag the term, and the monthly payment answers straight away. The questions come after you know it's worth it.",
        figures: [{ kind: "device", screens: [loanTerm, loanSigned] }],
      },
      {
        id: "library", label: "Documents", title: "Everything you signed, in one place",
        body: "Contracts, schedules and receipts used to live in email. They now sit in one library, searchable, with the next payment always on top.",
        figures: [{ kind: "video", src: "/cases/samples/promptly-library.mp4", poster: "/cases/samples/promptly-library.png", posterAlt: "The document library, scrolled from the newest contract down", url: "luminasset.com" }],
      },
      {
        id: "steps", label: "Steps", title: "Two moments that matter",
        body: "Most of the flow is quiet on purpose, so the two moments people remember get the attention.",
        pair: [
          { label: "Term", title: "Pick the term", body: "One slider, and the monthly payment updates as you drag.", media: { kind: "device", screens: [loanTerm] } },
          { label: "Signed", title: "Done, and it says so", body: "A clear end: what happens next, and when the money arrives.", media: { kind: "device", screens: [loanSigned] } },
        ],
      },
      {
        id: "web", label: "Web", title: "The same flow on the web",
        body: "The web app follows the same order and the same words, so moving between phone and laptop never means learning it twice.",
        figures: [{ kind: "image", src: "/cases/samples/promptly-fullscreen.png", alt: "The web app in a browser window over a landscape painting" }],
      },
      {
        id: "results", label: "Results", title: "Fewer steps, more offers",
        body: "In testing, people reached their first offer in under a minute, three times faster than before. The client is now taking the new flow into development.",
        strong: "three times faster than before",
      },
    ],
    next: { slug: "quantum-body", title: "Quantum Body", summary: "A mobile app for training at home" },
  },
];

export const caseStudyOf = (slug: string) => caseStudies.find(study => study.slug === slug);

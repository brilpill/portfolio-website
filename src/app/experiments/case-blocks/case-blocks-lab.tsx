"use client";

import { CaseMedia } from "@/components/case-media";
import { CaseNumbers, type CaseNumber, type NumbersLayout } from "@/components/case-numbers";
import { BlurHighlight } from "@/components/case-highlight";
import type { ProjectSlideMedia } from "@/content/project-slides";
import { lumin, luminAdmin } from "@/content/luminasset-media";

/**
 * Case blocks: the numbers layouts, the compare slider, text highlights and cursor annotations
 * (docs/case-template.md), rendered by the real components with the LuminAsset content.
 */
const numbers: CaseNumber[] = [
  { value: "7", from: "12", label: "Stages a customer sees" },
  { value: "6 × 4", label: "Cases × states per stage" },
  { value: "4", label: "Admin step types" },
  { value: "3", label: "Process templates" },
];
const layouts: { id: NumbersLayout; note: string }[] = [
  { id: "row", note: "Figures on hairlines across the column. The default." },
  { id: "before-after", note: "from → to, for a change worth showing. Give each item a from value." },
];
const compare: ProjectSlideMedia = { kind: "compare", url: "admin.homesolar.app", before: luminAdmin.dashboard, after: luminAdmin.applications };
const annotations: { id: string; name: string; media: ProjectSlideMedia }[] = [
  { id: "annotation.kind: cursor", name: "Cursor", media: { kind: "browser", frame: "window", screens: [luminAdmin.application], annotation: { kind: "cursor", name: "Oleh", note: "One button per stage", points: [[30, 40], [62, 56], [70, 30]] } } },
  { id: "annotation.kind: draft", name: "Drafting", media: { kind: "device", screens: [lumin.estimate50], annotation: { kind: "draft", name: "Oleh", points: [[34, 30], [66, 52]] } } },
];

export function CaseBlocksLab() {
  return <main className="lab">
    <header className="lab-head">
      <h1>Case blocks</h1>
      <p>The blocks a chapter can use besides mockups, with the field to put in the case file. Rendered by the real components, with the LuminAsset content.</p>
    </header>

    <section>
      <h2>Numbers · numbersLayout</h2>
      <div className="lab-stack">
        {layouts.map(layout => <figure key={layout.id} className="lab-card">
          <div className="lab-panel"><CaseNumbers items={numbers} layout={layout.id} /></div>
          <figcaption><code>numbersLayout: &quot;{layout.id}&quot;</code>{layout.note}</figcaption>
        </figure>)}
      </div>
    </section>

    <section>
      <h2>Compare · kind: compare</h2>
      <div className="lab-grid">
        <figure className="lab-card">
          <div className="lab-media"><CaseMedia media={compare} /></div>
          <figcaption><code>kind: &quot;compare&quot;</code><strong>In Safari</strong>Both screens in one mockup, the handle across the whole frame. Drag the handle, or focus it and use the arrow keys.</figcaption>
        </figure>
      </div>
    </section>

    <section>
      <h2>Highlight · highlight</h2>
      <div className="lab-stack">
        <figure className="lab-card">
          <BlurHighlight className="lab-prose">{["The tracker turns twelve internal stages into ", <mark key="m" className="case-mark">seven a customer can follow</mark>, ", each with one thing to do."]}</BlurHighlight>
          <figcaption><code>highlight: &#123; text &#125;</code>As the paragraph comes into view, a soft highlight box draws in behind the phrase, left to right.</figcaption>
        </figure>
      </div>
    </section>

    <section>
      <h2>Annotation · annotation</h2>
      <div className="lab-grid">
        {annotations.map(item => <figure key={item.id} className="lab-card">
          <div className="lab-media"><CaseMedia media={item.media} /></div>
          <figcaption><code>{item.id}</code><strong>{item.name}</strong>Points are percent of the figure.</figcaption>
        </figure>)}
      </div>
    </section>
  </main>;
}

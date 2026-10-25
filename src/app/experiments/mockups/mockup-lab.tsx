"use client";

import { CaseMedia } from "@/components/case-media";
import type { ProjectSlideMedia } from "@/content/project-slides";
import { lumin, luminAdmin, luminAdminUrl } from "@/content/luminasset-media";

/**
 * Mockup templates: every frame the case media blocks offer (docs/case-template.md), rendered by the real
 * CaseMedia component with the LuminAsset screens, so this page shows exactly what a case gets.
 */
const phones = [lumin.estimate0, lumin.estimate50, lumin.estimate100, lumin.estimateSheet];
const flow = [lumin.postcode, lumin.calculating, lumin.estimate50];
const webs = [luminAdmin.dashboard, luminAdmin.applications, luminAdmin.application];
// Sample pairing for the responsive template: the admin isn't responsive, so phone screens stand in.
const mobiles = [lumin.councilFee, lumin.gridAction, lumin.live];

const templates: { group: string; items: { id: string; name: string; note: string; media: ProjectSlideMedia }[] }[] = [
  { group: "Mobile", items: [
    { id: "frame: dark", name: "Dark phone", note: "The default.", media: { kind: "device", screens: phones, control: "player" } },
    { id: "frame: silver", name: "Silver phone", note: "For screens that read better on a light outline.", media: { kind: "device", frame: "silver", screens: phones, control: "player" } },
    { id: "frame: pair", name: "Pair", note: "The next screen behind the current one.", media: { kind: "device", frame: "pair", screens: phones, control: "player" } },
    { id: "frame: row", name: "Row", note: "Three phones at once; longer flows page in threes with tabs.", media: { kind: "device", frame: "row", screens: flow } },
  ] },
  { group: "Web", items: [
    { id: "frame: dark", name: "Safari", note: "The default, with the project's address.", media: { kind: "browser", url: luminAdminUrl, screens: webs } },
    { id: "frame: bare", name: "Bare window", note: "No browser chrome.", media: { kind: "browser", frame: "bare", screens: webs } },
    { id: "frame: laptop", name: "Laptop", note: "The page on a MacBook.", media: { kind: "browser", frame: "laptop", screens: webs } },
  ] },
  { group: "Web, from the Figma mockups (window)", items: [
    { id: "frame: window", name: "Window", note: "One whole window on a light grey ground.", media: { kind: "browser", frame: "window", screens: webs } },
  ] },
  { group: "Web + mobile", items: [
    { id: "kind: responsive", name: "Website and mobile", note: "The site and its mobile version, stepping together.", media: { kind: "responsive", url: luminAdminUrl, web: webs, mobile: mobiles } },
    { id: "responsive · frame: bare", name: "Bare, with mobile", note: "The same without browser chrome.", media: { kind: "responsive", frame: "bare", web: webs, mobile: mobiles } },
  ] },
];

export function MockupLab() {
  return <main className="lab">
    <header className="lab-head">
      <h1>Mockup templates</h1>
      <p>Every frame a case media block can use, with the code name to put in the case file. Rendered by the real component, with the LuminAsset screens.</p>
    </header>
    {templates.map(group => <section key={group.group}>
      <h2>{group.group}</h2>
      <div className="lab-grid">
        {group.items.map(item => <figure key={group.group + item.id} className="lab-card">
          <div className="lab-media"><CaseMedia media={item.media} /></div>
          <figcaption><code>{item.id}</code><strong>{item.name}</strong>{item.note}</figcaption>
        </figure>)}
      </div>
    </section>)}
  </main>;
}

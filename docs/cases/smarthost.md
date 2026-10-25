# SmartHost

> **As built, 25 Oct 2026.** Saved as given; the slide and case study match it (`src/content/project-slides.ts`, `src/content/case-studies.ts`, `src/content/smarthost-media.ts`, images in `public/cases/smarthost/`). Replaces the placeholder SmartHost slide; sidebar icon changed from Key to HouseLine. My role and Timeline show a dash. Notes: compare gained a `bare` frame for the wireframe comparison. Each browser block uses the proportions of its shortest preview, so the 1100-high pages lose a strip at the bottom rather than the sides (estimate-result and services in overview block 2; blog and article in the Wider website block, framed at the hero height). Full-length desktop pages (home, services, photography, listings, estimate result, blog, article) open in the viewer on the case page. Figure captions inside the case page are not shown.

## 1. Basics

Slug: smarthost
Title: SmartHost
Group: Web
Placement: featured
Format: Website
Icon: HouseLine

## 2. Case overview

Headline: From property management to a clear next step.
Overview: SmartHost's website introduces its property management services and gives owners a route to a rental estimate. The design connects service explanations, a guided property questionnaire, and a detailed estimate, with layouts adapted for desktop and mobile.
Industry: Property management / Hospitality
Case study: yes

Media — exactly two blocks:
1. responsive · frame: bare
   web: home.png "Homepage"
   mobile: home-mobile.png (long: home-mobile-full.png)
   caption: A shared visual language across the desktop and mobile homepage. Sample design.
2. browser · tabs · frame: bare — estimate-goal.png "Owner goals", estimate-details.png "Property details", estimate-result.png "Estimate", services.png "Services"
   caption: From understanding the service to exploring a property's potential. Sample design; figures are illustrative.

## 3. Case study

Title: From property management to a clear next step.
Intro: Property owners arrive with different questions: what gets managed, how the service works, and what their property could earn. SmartHost's website brings those questions into one journey, pairing service content with a guided estimate and an invitation to speak with the team.
Hero: responsive · frame: bare
  web: home.png "Homepage"
  mobile: home-mobile.png (long: home-mobile-full.png)

Chapter — Homepage · A direct route into the service
Text: The homepage places the service proposition and estimate entry together. Purple highlights the main action, while warm neutrals and yellow accents give the supporting content a distinct hierarchy. The wireframe and designed screen show two treatments of the same entry point, making the change in composition easy to see.
Figures: compare · frame: bare · home-wireframe.png → home.png
  labels: "Wireframe" → "Visual design"
  caption: Design development, not a measured before-and-after performance comparison.
         responsive · frame: bare
  web: navigation.png "Navigation"
  mobile: navigation-mobile.png

Chapter — Services · Making the offer concrete
Text: A service overview introduces the scope of property management, while dedicated pages explain individual parts of the offer. Photography and multi-platform listings use large images and concise introductions to give those services a recognisable identity. The shared layout keeps these pages connected to the wider website.
Figures: browser · tabs · frame: bare — services.png "Service overview", photography.png "Photography", listings.png "Multi-platform listings"

Chapter — Estimation · Turning interest into a property enquiry
Text: The questionnaire asks about an owner's goals and property availability, then collects property details. The estimate screen brings together a forecast, plan options, and consultation actions. Desktop and mobile examples show how the information changes shape across screen sizes. These are selected design states; the displayed forecast is not a verified financial result.
Figures: browser · tabs · frame: bare — estimate-goal.png "Owner goals", estimate-availability.png "Availability", estimate-details.png "Property details"
         responsive · frame: bare
  web: estimate-result.png "Estimate and next steps"
  mobile: result-mobile.png (long: result-mobile-full.png)
  full desktop reference: estimate-result-full.png
  implementation: The desktop reference opens in the image viewer; preserve the mobile long-screen behaviour. No calculator logic is implied by these static designs.

Chapter — Wider website · One identity across different content
Text: The same visual language extends to a Dubai homepage, an investment page, and editorial content. Regional pages introduce a different service context, while the blog index and article layout accommodate longer reading. A small selection shows that breadth without turning this case into a catalogue of every page.
Figures: browser · tabs · frame: bare — dubai.png "Dubai homepage — hero", investment.png "Investment — hero", blog.png "Blog index", article.png "Article layout"

---

## 4. Internal handoff — do not render on the public page

### Scope and implementation

- Keep the overview at exactly two media blocks. The case page has a hero and four short chapters. Use existing responsive, browser tabs, compare, and long-screen patterns; no new live component is required.
- Use bare browser frames consistently. Do not place the historical designs inside a browser labelled with today's redirected live domain.
- Use the supplied viewport previews in normal blocks. Full-length partners are source/viewer references, not extra stacked page sections. Do not shrink full pages into unreadable thumbnails.
- The wireframe comparison uses two 1728 × 1100 previews. Label it Wireframe / Visual design, not Old / New. The screens document design alternatives, not proven usability or conversion improvements.
- The phone exports already include a status bar and Dynamic Island. Avoid duplicating those elements when applying the portfolio device frame.
- The article frame contains inconsistent draft subject matter between its heading and body. Present it only as an editorial layout example; do not repeat its advice as factual project copy.
- Dubai and investment images are native hero-section exports. The full-page renders failed, so these intentionally omit sibling navigation layers; do not reconstruct or invent the missing content.
- Personal contribution, dates, team, and outcomes are not confirmed for this case. Omit role/timeline/outcome fields rather than attributing the agency's entire work to Oleh. The public copy describes visible design decisions only.
- All packaged images have `sample` status. Original design content is preserved, including business contact details, testimonials and illustrative financial values. Those elements are source design content, not independently verified portfolio outcomes. Publication clearance is not established by this handoff.
- No website or interactive calculator has been implemented by this document.

### Figma and source registry

User-supplied file: [SmartHost — original entry point](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=1-3)

| Area | Selected source nodes |
| --- | --- |
| Homepage | [Desktop](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-8885), [mobile](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-9918), [wireframe](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-2748) |
| Navigation | [Desktop](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-9333), [mobile](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-10324) |
| Services | [Overview](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-27930), [photography](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-32207), [listings](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-32322) |
| Estimation | [Goals](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-120440), [availability](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-120612), [property details](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-120499), [result](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-126925) |
| Mobile estimation | [Question](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-121970), [result](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-127489) |
| Regional and investment | [Dubai full frame](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-25879), [exported hero](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-25880), [investment full frame](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-134942), [exported hero](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-134961) |
| Editorial | [Blog](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-47097), [article](https://www.figma.com/design/32iZyqqOZT2i5rPcMhN55e/SmartHost?node-id=2007-45862) |

### File coverage and selection

All 13 Figma pages were inventoried: UI Design — Website, Landing, Homepage, Homepage Dubai, Solutions, Blog & Article, Main pages, [Old Style], Estimation, Other Pages, UI Kit, the divider page, and Cover. Selected screens were visually inspected. This does not mean every historical frame was visually reviewed.

Homepage, Solutions, Estimation, regional/investment and editorial screens carry the short public narrative. Landing and Main pages provide surrounding site context; Old Style is historical reference; UI Kit informs consistency but does not need a separate chapter in this compact case. Divider pages and Cover do not add visitor-facing content. See `page-coverage.json` for the frame inventory and `manifest.json` for exact exported nodes and dimensions.

### External context

- [Fourmeta — SmartHost project](https://www.fourmeta.com/projects/smarthost): supports the broader website/property-management context. Its performance figures differ between sections; no agency outcome figures or unconfirmed personal responsibilities have been carried into this case.
- [SmartHost's historical domain](https://www.smarthost.co.uk/) redirected to [Staymo](https://www.staymo.com/) when checked on 25 October 2026. Treat these as current business context, not as proof that the historical Figma design is the current live website.
- [Historical Webflow site](https://fourmeta-smarthost.webflow.io/): additional service context. The delivered visuals come from the supplied Figma file.

### Package

`smarthost-images.zip` contains native-resolution PNG previews and full-length partners, a contact sheet, an export manifest, a page inventory, and a README. Extra full-length references and the mobile question screen are available for handoff; they do not add sections to the agreed compact structure.

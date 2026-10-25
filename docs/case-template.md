# Case template

One file per project. Fill it in, paste it to Claude together with the images, and it becomes:

- **Case overview**: the case slide on the home page (media on the left, details on the right). Every project has one.
- **Case study**: the full page at `/cases/<slug>`, opened from "Read the case study". **Optional.** Leave part 3 out and the project has only its overview. The button then doesn't appear.

Copy the template from part 1 to part 3 for each project. Delete anything you don't need; empty fields simply don't show. Parts 4 to 7 are reference only.

*Checked against the code on 24 October 2026. To see every block and frame live, open `/cases/showcase` (unlisted). The two real cases are `/cases/luminasset` and `/cases/quantum-body`; their filled-in files are in `docs/cases/`.*

---

## 1. Basics

```
Slug:            luminasset            ← lowercase, dashes; becomes the address (/cases/luminasset, /#luminasset)
Title:           LuminAsset
Group:           Mobile                ← Mobile or Web
Placement:       featured              ← featured (own slide, sidebar item) or more (the "More projects" gallery,
                                         switched off for now: a `more` project is hidden until it's turned back on)
Format:          Mobile App            ← short label, e.g. "Mobile App", "Web Platform"; used when there's no Headline
Icon:            ChargingStation       ← a Phosphor icon name (phosphoricons.com), shown in the sidebar and in the
                                         project chip at the top of the case study (the details column has no icon)
Logo:            logo.svg              ← optional; replaces the icon in the case study's project chip and keeps its
                                         own colours (the sidebar always uses the icon)
```

## 2. Case overview (the slide)

### Details column

```
Headline:   Making a complex flow feel simple.        ← the one serif title (short; one or two lines)
Overview:   2–4 sentences. What the product is, what you did, what it achieved.
My role:    UX Review / UI Design / Visual Direction  ← only what's confirmed
Timeline:   6 weeks · 2026                            ← "To confirm" while it's open
Industry:   Fintech

Links (any you have; empty ones are hidden):
Figma:      https://…                    ← leave empty for private files
Website:    https://…
Other:      https://…                    ← shown as "Other link" today; write the label you want (e.g. "App Store")
                                           and the button can be given it
Case study: yes                          ← yes = part 3 below exists and the "Read the case study" button
                                           appears under the links; no or empty = overview only
```

### Media (left column, top to bottom)

List the blocks in order; two is the usual number. Each block is one card. Pick a type from **Block types** below.

```
1. device · tabs
   screens: term.png "Term", signed.png "Signed"
   caption: Picking the term and signing.

2. device · frame: row
   screens: postcode.png "Postcode", calculating.png "Calculating", estimate.png "Estimate"
```

### Block types

| Type | What it shows | Use it for |
| --- | --- | --- |
| `device · tabs` | Phone screens in a drawn phone frame. Several screens get ‹ › arrows and step tabs at the bottom. | A flow of 2–6 mobile screens the viewer steps through. |
| `device · player` | Same phone, but the screens advance on their own with a progress pill (pause button). | A short flow that reads better as a sequence than as tabs. |
| `device` (one screen) | A single phone screen. | One key screen. |
| `device` · long screen | A screen taller than the phone, sent as two files: the phone-sized crop and its full length (`home-full.png`). It scrolls inside the phone, with a "Scrollable" label above it that always shows. With a mouse it can also be dragged (grab hand). The viewer opens it at full length. | Home pages, forms, guides, anything longer than one screen. |
| `browser` | Web screens in macOS Safari with the project's address. Several screens get tabs or the player; desktop screens switch instantly. | Web products, dashboards. |
| `browser + background` | The window over a full-bleed image or colour. | A hero shot of a web product. |
| `image` | One image filling the whole card. On the slide the card takes the image's own proportions, so a full landing page can go in as one tall image. | Finished compositions, mockup renders, diagrams, long pages, anything already designed as an image. |
| `image · full` | A preview (the top of a very long composition) with a "View full presentation" pill; the full image loads only in the viewer, at full length to scroll and zoom. | A Behance case or any long editorial presentation. Send the preview and the full image. |
| `images` | Several finished images in one frame, each shown whole, switched by tabs or the arrows. | Presentation excerpts, Dribbble shots, flows already laid out as one image each. |
| `posters` | Finished posters side by side in a strip that scrolls sideways, about three in view, with arrows; a click opens one in the viewer. No device frame. | App Store screenshots and other store artwork. |
| `compare` | Before and after inside one mockup (Safari by default, a bare window with `frame: bare`, or a phone with `frame: device`), with a divider across the whole frame that follows the mouse (dragged on touch). `frame: row` puts up to three pairs side by side as phones. | A redesign, wireframe → final, or two states of one screen. Write it as `compare · before.png → after.png` (plus `url` for Safari). |
| `component` | A live, rebuilt component in its own frame (see **Live components**). | A key control, an interaction worth feeling, the foundations. |
| `components` | Several live components, each in its own frame, in a two-column grid (a component marked wide takes the whole row); no Interactive note unless asked for (`hint`). | The design system chapter: a button and the input types, without a block each. |
| `video` | A muted, looping clip with pause and seek; in a browser window or edge to edge. Without a file it shows the poster with "Video coming soon". | Screen recordings, interactions, motion. |

Any block can also carry an **annotation**: a named cursor over the figure, as if someone is pointing at it. `cursor` glides between 2–4 points and can show a short note; `draft` drags out a selection box between two points. Points are percent of the figure (`[x, y]`). Use one or two per case at most, where a detail would otherwise be missed (none is used in LuminAsset now; the one on My orders is kept as a comment for later):

```
annotation: cursor · Oleh · "One button per stage" · 30,40 → 62,56 → 70,30
annotation: draft · Oleh · 34,30 → 66,52
```

All block types are on the unlinked page `/experiments/case-blocks`, and every block and frame together is on `/cases/showcase`.

### Live components and design systems

A design system doesn't go in as an image or a component sheet (tried, and dropped). Its key pieces are **rebuilt in code** and shown live, so people can press, drag, type into and switch them.

**What a live component looks like**

- **One component per frame**, interactive: press it, drag it, type into it.
- **Tabs underneath** switch its styles or states when it has them (the button's White · Blue · Black · Dark · Ghost · Outline · Destructive). Inputs have no tabs: every state (focus, filled, loading, error, open, selected) comes from using it.
- **Two frames:**
  - `stage`: the component alone at real size on the grey frame, for web parts and single controls.
  - `device`: inside the phone, for app screens and mobile controls.
- **Frame height fits the content.** A button gets a short, wide frame, a phone a tall one.
- **An "Interactive" label** (a hand icon) says it can be touched: above the phone, just above the mock on a stage, or (only if asked for) once above a `components` grid. Frames that aren't a component (a moodboard) don't get it.
- **Sounds** on every interaction (see part 5). The visitor turns them on with the sound switch beside Ask AI.
- **No Code tab for now.**
- **Colours and type come from the project's own tokens** (its Figma variables) and its own font, not the portfolio's.

**Ready today** (LuminAsset; use these ids in the case file):

| `demo` | Frame | What it is | Tabs |
| --- | --- | --- | --- |
| `luminasset/estimate` | device | The estimate both ways: on the aerial photo with its bottom sheet (with Solar API), or drawn on a grid (without). | With Solar API · Without Solar API |
| `luminasset/system-size-slider` | device | The estimate without the Solar API: drag the ruler (it ticks per panel), panels fill the roof grid, kW, output, cost and CO₂ follow. | Empty roof · Half · Whole roof |
| `luminasset/estimate-sheet` | device | The estimate on the aerial roof photo. The sheet has three resting points; the photo shrinks with it (whole picture when down, the top half in the middle, a strip around the panels when up). Info icons open tooltips, the ruler and Energize stay pinned, the manual-entry buttons open their screen. | Sheet down · Middle · Sheet up |
| `luminasset/site-survey` | device | The order screen at the Site survey stage: fixed header, the current stage pulses, every ⓘ opens its tooltip, each row opens its screen one level deep with a back arrow. | Direct · PPA |
| `luminasset/moodboard` | stage | Inspiration screens per visual direction, on two rows. No Interactive label. | One tab per direction, with animated icons |
| `luminasset/wireframes` | stage | The wireframes per section, in flow order. No Interactive label. | Numbered: 1 Start, 2 Onboarding… |
| `luminasset/button` | stage | The button at real size, centred. Hold for Pressed, tap for Loading; a Disabled switch in the top-right corner. White and Dark turn the surface dark. | The seven styles |
| `luminasset/input` · `select` · `otp` · `toggles` | stage | One input per frame, each a white card (the Figma frame) on the grey: Postcode (focus, clear, Loading, then found or error), Roof orientation select with its menu, OTP code (try 31AG9P), Number of storeys toggles. Made for a `components` grid. | none |
| `luminasset/inputs` | stage | The same four in a 2 × 2 grid inside one frame. | none |
| `vestigo/model-builder` | stage | Cogs and databases on a canvas: + beside a block adds the next one connected, blocks drag, the Properties Panel fills in, Test runs it. | none |
| `askflow/logic-jump` | stage | A question card and a logic jump card: drag from an answer's dot (or press Connect) to join them, the rule dialog opens; Save, Cancel or the cross return to the cards. | none |
| `askflow/product-picker` | stage | The catalogue panel beside a question: search a sample catalogue, expand variants, tick products or variants; the Match products step and the summary follow. | none |
| `askflow/button` | stage | AskFlow's button at real size; size, Destructive and Disabled inside the frame; hold for Active, click for Loading. | Primary · Secondary · Ghost · Toolbar · Link · Toolbar - Highlighted |
| `askflow/input` · `select` · `selection` | stage | A labelled field with a local Validate; a select with one keyboard menu level and Clear; parent and child checkboxes with mixed and disabled states. | none |
| `askflow/question-card` · `minimap` | stage | A question with two answers (edit inline, show the connection; Insights adds illustrative bars); a three-card map with a minimap that opens, closes and highlights cards. | Builder · Insights (question card) |
| `tutor-iq/homework-card` · `progress-card` | stage | The homework status card (Submit moves To-do to Submitted, then Waiting; Feedback opens the tutor's note; Overdue requests a reschedule) and the subject progress card (legend hover finds the slice, card hover shows View Details). Made for a `components` grid. | To-do · Submitted · Waiting · Feedback · Overdue · Cancelled; Lessons · Homework |
| `tutor-iq/calendar` | stage | A week of lessons (select one, cancel or restore it, page weeks) and the weekly availability panel (day switches, a booking link with copy and on/off). | Week · Availability |
| `tutor-iq/classroom-toolbar` | stage | The classroom bar over an illustrative room: mic, camera, screen share, whiteboard, reaction, raise hand, chat, REC timer, leave and rejoin; the mobile bar with its expanding row. No real call or media. | Desktop · Mobile |
| `luminasset/variables` | stage | All tokens in Figma's Variables modal. Collections and groups in the sidebar work; clicking a row copies its value. | none (the sidebar switches) |
| `luminasset/tokens-phone` | device | The tokens as a dark app screen. Kept, but not used in LuminAsset (the user preferred not to show it). | Colour · Type · Shape |

**A design system chapter, the usual shape:**

```
Chapter — Design system · The system, to try
Text:    What the system is for, how many parts, one decision that shaped it.
Numbers: "26" Colour tokens · "10" Type styles in Geist · "7 × 4" Button styles × states
Figures: components · luminasset/button (wide), input, select, otp, toggles   ← each in its own frame, one grid
         component · luminasset/variables
```

Put a live component next to the screens it explains: the estimate demo goes in the Estimate chapter.

**Asking for a new live component.** Describe it in the case file and it gets built before the case goes in:

```
New component: OTP input
  Figma:     <link to the component set or frame, with node-id>
  Frame:     stage                      ← stage (alone, real size) or device (in the phone)
  Tabs:      none                       ← only for styles; exactly the variant names in Figma
  Behaviour: typing moves to the next box; paste fills all six; a wrong code turns red
  Surface:   light                      ← or dark, or "dark for White and Dark styles"
  Sounds:    key per character, success or error on the check   ← optional; defaults come for free
```

For a new project's tokens, give the Figma link to the page or frame that holds its variables. They're copied into `src/cases/<slug>/tokens.ts`, and the variables panel is built from that file.

**Rules for whoever fills the case (you or the AI):**

- Rebuild from Figma; never paste a client's code. Keep the client's name out of copy and alt text where the case asks for that.
- Pick the components that tell the story (a key control, an interaction worth feeling), not the whole library.
- Tab names match Figma's variant names exactly. Don't add tabs for states a component shows by being used.
- Every component works with a keyboard, respects reduced motion, and has sounds.
- Don't add a Code tab, a component explorer with a side list, a long foundations page, a component sheet image, or parallax on scroll. They were tried and dropped.

### Mockup templates (frames)

Phone and browser blocks take an optional `frame`; leave it out for the default. Live examples of every one: `/experiments/mockups`.

| Block | `frame` | Looks like | Use it for |
| --- | --- | --- | --- |
| `device` | `dark` (default) | A dark phone with iPhone proportions and a soft reflection. | Most mobile flows. |
| `device` | `silver` | A silver phone with the Dynamic Island. | Dark or busy screens that read better on a light outline. |
| `device` | `pair` | The current screen in front, the next one behind it, both larger than the default phone. | A flow where the next step matters as much as this one. |
| `device` | `row` | Three phones side by side, filling the frame. More than three screens page through in threes, with tabs (label the first screen of each three). | A flow worth seeing in one look. |
| `browser` | `dark` (default) | macOS Safari, dark, with the project's address in the field (`url`). | Most web screens. |
| `browser` | `bare` | The page on a hairline and a shadow, no browser chrome. | Marketing pages and sites that should read as the page itself. |
| `browser` | `laptop` | The page on a MacBook. | Desktop apps and dashboards. |
| `browser` | `window` | One whole window with a minimal light bar, on a light grey ground. | Web pages in the Figma mockup style. |
| `responsive` | `dark` / `bare` | The website in Safari with its mobile version on a phone in front. | A site and its mobile adaptation together. |

Desktop screens switch instantly (no dissolve); phone screens dissolve. Not available on purpose: light Safari, tilted or perspective mockups, stacked or overlapping windows, crops, tiled grids, and Safari (or any browser) around mobile screens. Mobile screens always go in a phone.

A `responsive` block lists two sets of screens that step together: `web: home.png "Home", pricing.png "Pricing"` and `mobile: home-m.png, pricing-m.png` (same order, same count).

For whoever fills a case (you or the AI): pick one default per case and vary it only where a block has a reason to look different. Prefer `row` over a single centred phone in the wide case study figures when the screens form a sequence. Set `url` to the project's real address on Safari blocks.

Every block can have a one-line **caption**. Captions show on the home slides, not in the case study; they also help write alt text.

## 3. Case study (optional)

Leave this whole part out for an overview-only project.

```
Year:       2026                          ← a chip under the project chip; leave it out while it's to confirm
Duration:   6 weeks                       ← in the details row; optional
Title:      Making a complex flow feel simple.          ← can repeat the headline or be longer
Intro:      3–5 sentences: the client, the problem, your role. Shown under the title.
Highlight:  one phrase from the Intro    ← optional, like a chapter's Highlight

Hero:       one block (any type from Block types), the large figure under the intro
```

Then chapters, in reading order. Each chapter is a short label, a title, a paragraph, and then its figures.

```
Chapter
  Label:   Offer                                   ← one word; also the name in the chapter ticks on the left
  Title:   An offer before a form
  Text:    2–4 sentences.
  Bold:    the monthly payment answers straight away   ← optional; a phrase from Text to emphasise. Despite the name
                                                     it isn't bold: it gets the soft highlight box, in the text's own weight.
  Highlight: an offer straight away                ← optional; a phrase from Text: the highlight box draws in behind it,
                                                     left to right, as it comes into view. One per chapter, two or three per case.
  Lesson:  One sentence on what you'd take from this.   ← optional; an aside under the text, with a thin rule on the left
                                                     and a small "Lesson" label above. Only lessons that are really yours.
  Numbers: "12 → 7" Internal to customer stages · "4" Admin step types   ← optional (below)
  Figures: one or more blocks (Block types)

Chapter with a pair
  Label:   Steps
  Title:   Two moments that matter
  Text:    …
  Pair:                                             ← two figures side by side, each with its own copy
    Left:  label "Term",   title "Pick the term",   text "…",  block: device · term.png
    Right: label "Signed", title "Done, and it says so", text "…", block: device · signed.png

Numbers (optional, in any chapter): a row of 1–4 big figures under the chapter's text, one column each
  Numbers: "12 → 7" Internal stages to customer stages · "6 × 4" Cases × states · "4" Admin step types
  Layout:  row (default) · before-after
           before-after shows each figure as from → to: write it as "12 → 7" (Claude stores 12 as `from`, 7 as the value).
  Only counts you can stand behind; say when they're counts of design content rather than results.

Results chapter (no figures, usually last)
  Label:   Results
  Title:   Fewer steps, more offers
  Text:    In testing, people reached their first offer three times faster than before.
           ← if there are no numbers yet, say so plainly ("There are no usage numbers yet").
  Bold:    three times faster than before

Next project:  quantum-body · "A place to capture a thought and come back to it"   ← slug and a one-line summary
```

What every case study page has without you doing anything:

- **Top bar:** your avatar, Back (to this project's slide), the sound switch and Ask AI. It stays at the top while you read; once you scroll, the avatar and Back gather into a grey pill.
- **Like button** in the details row, with a live count shared by every visitor (it needs the likes store set up on the live site; locally it counts in a file).
- **Chapter ticks** on the left: they follow the chapter labels. Hovering shows a card with the chapter's label and title.
- **Floating Contact button.**
- **Expand button on every figure** (bottom-right corner). It opens the full-screen viewer for that figure's own screens, starting at the one showing, with zoom (wheel, pinch, double-click, + / −) and pan. Long screens open at full length; a desktop page with a full-length export (`long()` in a browser or responsive block) opens wider than a phone screen, so it stays readable. (A Translate button in the viewer is built but hidden.)
- **Tabs and arrows:** with a mouse, a frame's tabs rest as small dots (one per step, the current one darker) and open into the full tabs when the pointer is over the frame; on touch screens they stay open. An inactive tab gets a faint fill on hover; the side arrows show on hover over a frame and step aside while the pointer is on the tabs.
- **Scrollable and Interactive labels** show only on the frame whose middle is in the central 70% of the window, fading in and out as you scroll (`CENTRE_BAND` in `case-media.tsx`).
- **Scrolling inside a frame** (long screens, sheets, lists) starts only once 80% of the frame is on screen; until then the wheel scrolls the page.

## 4. Images

- Send images as files next to the pasted text, named as in the template (`term.png`, `library.mp4`). They go to `public/cases/<slug>/`.
- **Phone screens:** the full screen at 2x if possible (1x works), no frame (the frame is drawn), portrait about 9:19.5.
- **Long phone screens:** the full-length export; the phone-sized crop is made from it (`name.png` + `name-full.png`).
- **Boards and long images in `images` or `image · full`:** a CaseScreen with `full` opens its full version in the viewer, at web width.
- **Long web pages:** a viewport preview plus the full page (`name.png` + `name-full.png`). The preview shows in the browser frame; the full page opens in the viewer. Previews in one block should share a height, or set the block's `ratio` to the shortest so none is cropped at the sides.
- **Browser screens:** the page content only, no browser chrome, about 16:10.
- **Image blocks:** any proportions on the slide (the card follows the image; about 943 × 882 fills a window-tall card), wider (about 16:9) for the case study. At least 1600 px wide; bigger is fine, they are resized.
- **Long presentations (Behance):** the full composition as one image, plus its sections if it's very long; the preview is cut from its top.
- **Posters (App Store):** each poster at its own size (e.g. 1290 × 2796), in the order they should appear.
- **Video:** MP4 (H.264), muted, ideally under 10 MB, plus a poster PNG (the first frame works).
- **Alt text:** one short sentence per image saying what it shows. If you skip it, it's written from the captions.
- Anything from a client or another portfolio that isn't cleared for public use: mark it `sample`. Mask personal and commercial details before export, and keep the masked files (re-exporting from Figma brings them back).

## 5. Where it goes (for Claude)

So a pasted file lands everywhere it needs to:

- Slide content: `src/content/project-slides.ts` (one entry per project; `caseStudyUrl: "/cases/<slug>"` when part 3 exists).
- Case study content: `src/content/case-studies.ts`. Screens for a project: `src/content/<slug>-media.ts` (`screen()`, and `long()` for a long screen with `full: { src, ratio }`).
- A filled-in copy of the case file: `docs/cases/<slug>.md`, kept in step with what the site shows.
- Sidebar item and its icon: the `groups` list in `src/components/portfolio-home.tsx`.
- Icon in the case study's project chip: the `icons` map in `src/app/cases/[slug]/page.tsx`.
- Files: `public/cases/<slug>/`.
- Block shapes (`ProjectSlideMedia` in `project-slides.ts`):
  - `{ kind: "browser", screens, url?, ratio? }` — `ratio` (e.g. `"1728 / 980"`) when the pages aren't the default 1728 / 1064, so wide screens show whole instead of being cropped; `compare` takes `ratio` too.
  - `{ kind: "image", src, alt, full?: { src, ratio, label? } }` — with `full`, the preview and "View full presentation".
  - `{ kind: "images", images: [...] }` — finished images with tabs.
  - `{ kind: "posters", images: [...] }` — the poster strip.
  - `{ kind: "compare", before, after, frame?: "browser" | "bare" | "device" | "row", more?: [{ before, after }] }`.
  - `{ kind: "component", demo: "<slug>/<name>" }` and `{ kind: "components", demos: [...], wide?: [...] }`.
  - `annotation` on any block.
- Case study fields (`CaseStudyChapter`): `strong`, `highlight: { text }`, `lesson`, `numbers` + `numbersLayout` (set `from` for before-after), `figures`, `pair`. On the study: `year?`, `duration?`, `introHighlight`, `next`.
- Live components:
  - Tokens from the Figma variables: `src/cases/<slug>/tokens.ts` (exported as `--la-*`-style CSS variables via `laVars`; rename the prefix per project).
  - The project's font: `src/cases/<slug>/font.ts` (next/font).
  - System components (Button, Ruler…): `src/cases/<slug>/components/`.
  - Demos (what a frame shows): `src/cases/<slug>/demos/`. Each is a controlled component taking `value` / `onValueChange`; `value` is whatever the tabs pick.
  - Register each demo in `src/cases/demos.tsx`: `title`, `frame` (`device` | `stage`), `initial`, `presets` (the tabs; `icon` and `anim` for animated tab icons), `presetsLabel`, `numbered`, `ratio` (frame proportions, e.g. `"1152 / 400"`), `badge: false` to drop the Interactive label, `hintTop` to place a stage's label just above its mock.
  - Also register it in `src/cases/demo-files.ts`, which maps the demo to its source for the Code tab. The tab is off (`SHOW_CODE` in `case-media.tsx`).
- **Sounds:** every interactive component has sounds. Inside a case block they come for free (`CaseMedia` in `case-media.tsx`): a key or a delete in any field, a click on any button, tab, link or option, a switch or radio flipped. For a meaningful moment, play a cue from `@/components/ui-sound` (`playCue("success" | "error" | "open" | "close" | "toggle" | "key" | "erase" | "click")`), and put `data-sound="off"` on the element so the default click doesn't play too, or `data-sound="toggle"` (any cue) to swap it. Sliders tick on each step (see the Ruler). Cues play only when the visitor has turned sound on. Interactive pieces outside case blocks call `playCue` the same way.
- **Scroll lock:** `useScrollLock` in `case-media.tsx` sets `data-scroll-lock` on a figure until 80% of it is in view, and turns off scrolling only on its parts that actually scroll. A demo with its own wheel handler returns early inside `[data-scroll-lock]`.

## 6. Writing rules

- Say only what's confirmed: your role, dates, results. Leave a field out (or "To confirm") rather than guess.
- Don't present a reading of the designs as research, or mockups as a launched product.
- Product copy in the artwork (scientific, security, privacy claims) stays the product's, not a fact on the page.
- No client names where the case asks for that; no personal names or commercial figures in alt text.
- Keep internal notes (TODOs, permissions, Figma links) in `docs/cases/<slug>.md`, never on the page.

## 7. Room to grow

The blocks above are what exists today. New ones can be added when a case needs them; describe what you want in the file, for example:

- **Quote:** a client or user quote with name and role.
- **Process / timeline:** steps or phases with dates.
- **Prototype embed:** a live Figma prototype.
- **Annotated screen:** a screen with numbered callouts explained beside it (today's `annotation` is a cursor, not callouts).

Write it as `New block: quote — "…" · Name, Role`, and it is designed and built in the same style before the case goes in.

---

## Example (fill-in shape)

```
# LuminAsset

## 1. Basics
Slug: luminasset
Title: LuminAsset
Group: Mobile
Placement: featured
Format: Mobile App
Icon: SolarPanel

## 2. Case overview
Headline: A months-long install, one clear step at a time.
Overview: A UK solar app that takes a homeowner from a postcode to panels producing power…
My role: UX Lead / Product Design / Design System
Timeline: 2 months · 2026
Industry: Cleantech
Case study: yes

Media:
1. device · tabs — start.png "Start", estimate.png "Estimate", tracker.png "Tracker"
2. device · frame: row — postcode.png "Postcode", calculating.png "Calculating", estimate.png "Estimate"

## 3. Case study
Year: 2026
Duration: 2 months
Title: A months-long install, one clear step at a time.
Intro: Going solar in the UK takes months…
Highlight: one app that carries people through all of it
Hero: device · frame: row — start.png, estimate.png, tracker.png

Chapter — Estimate · An estimate before a form
Text: The app shows panels on your own roof straight away…
Highlight: the app doesn't stop
Figures: component · luminasset/estimate

Chapter — Steps · Every step says what it needs
Text: Each stage carries its own actions…
Highlight: there's one button
Lesson: Rules like when an order can still change are business decisions, not screens.
Figures: device — tracker.png (long: tracker-full.png)

Chapter — Design system · The system, to try
Numbers: "26" Colour tokens · "10" Type styles in Geist · "7 × 4" Button styles × states
Figures: components · luminasset/button (wide), input, select, otp, toggles
         component · luminasset/variables

Chapter — Results · A long process, made followable
Text: The MVP is being built on this design… There are no usage numbers yet, because the app hasn't launched.
Bold: designed and planned for the next release

Next project: quantum-body · A place to capture a thought and come back to it
```

An overview-only project is the same file with `Case study: no` and part 3 left out.

# Case template

One file per project. Fill it in, paste it to Claude together with the images, and it becomes:

- **Case overview**: the case slide on the home page (media on the left, details on the right). Every project has one.
- **Case study**: the full page at `/cases/<slug>`, opened from "Read the case study". **Optional.** Leave part 3 out and the project has only its overview. The button then doesn't appear.

Copy the template from part 1 to part 3 for each project. Delete anything you don't need; empty fields simply don't show. Parts 4 and 5 are reference only.

---

## 1. Basics

```
Slug:            luminasset            ← lowercase, dashes; becomes the address (/cases/luminasset, /#luminasset)
Title:           LuminAsset
Group:           Mobile                ← Mobile or Web
Placement:       featured              ← featured (own slide, sidebar item) or more (only in the "N more projects" gallery)
Format:          Mobile App            ← short label under the title, e.g. "Mobile App", "Web Platform"
Website label:   luminasset.com        ← optional; shown instead of Format when set
Icon:            ChargingStation       ← a Phosphor icon name (phosphoricons.com), used in the sidebar and details
Logo:            logo.svg              ← optional; replaces the icon, keeps its own colours
Icon tint:       #fde6dc               ← optional colour behind the icon (default soft peach)
```

## 2. Case overview (the slide)

### Details column

```
Headline:   Making a complex flow feel simple.        ← the one serif title (short; one or two lines)
Overview:   2–4 sentences. What the product is, what you did, what it achieved.
My role:    UX Review / UI Design / Visual Direction
Timeline:   6 weeks · 2026
Industry:   Fintech

Links (any you have; empty ones are hidden):
Figma:      https://…
Website:    https://…
Other:      https://…                    ← label it if it isn't obvious, e.g. "App Store"
Case study: yes                          ← yes = part 3 below exists; no or empty = overview only
```

### Media (left column, top to bottom)

List the blocks in order. Each block is one card. Pick a type from **Block types** below.

```
1. device · tabs
   screens: term.png "Term", signed.png "Signed"
   caption: Picking the term and signing.

2. browser
   screens: dashboard.png "Dashboard"
   url: luminasset.com
   background: painting.jpg               ← optional full-bleed image behind the window

3. image
   file: hero-composition.png
   alt: The app on three phones over a gradient

4. video
   file: library.mp4
   poster: library.png
   frame: browser                         ← browser (in a window) or none (edge to edge)
   url: luminasset.com
```

### Block types

| Type | What it shows | Use it for |
| --- | --- | --- |
| `device · tabs` | Phone screens in a drawn phone frame. Several screens get ‹ › arrows and step tabs at the bottom. | A flow of 2–6 mobile screens the viewer steps through. |
| `device · player` | Same phone, but the screens advance on their own with a progress pill (pause button). | A short flow that reads better as a sequence than as tabs. |
| `device` (one screen) | A single phone screen. | One key screen. |
| `browser` | Web screens in a browser window with the address bar. Several screens get tabs or the player. | Web products, dashboards. |
| `browser + background` | The window over a full-bleed image or colour. | A hero shot of a web product. |
| `image` | One image filling the whole card. | Finished compositions, mockup renders, diagrams, anything already designed as an image. |
| `video` | A muted, looping clip with pause and seek; in a browser window or edge to edge. Without a file it shows the poster with "Video coming soon". | Screen recordings, interactions, motion. |

Every block can have a one-line **caption**. Captions aren't shown on the page yet; they help write alt text and can be turned on later.

## 3. Case study (optional)

Leave this whole part out for an overview-only project.

```
Year:       2026
Status:     Not public                    ← e.g. "Live", "Not public", "Concept"
Duration:   6 weeks
Title:      Making a complex flow feel simple.          ← can repeat the headline or be longer
Intro:      3–5 sentences: the client, the problem, your role. Shown under the title.

Hero:       one block (any type from Block types), the large figure under the intro
```

Then chapters, in reading order. Each chapter is a short label, a title, a paragraph, and then its figures.

```
Chapter
  Label:   Offer                                   ← one word; also the name in the chapter ticks on the left
  Title:   An offer before a form
  Text:    2–4 sentences.
  Bold:    the monthly payment answers straight away   ← optional; a phrase from Text to emphasise
  Figures: one or more blocks (Block types)

Chapter with a pair
  Label:   Steps
  Title:   Two moments that matter
  Text:    …
  Pair:                                             ← two figures side by side, each with its own copy
    Left:  label "Term",   title "Pick the term",   text "…",  block: device · term.png
    Right: label "Signed", title "Done, and it says so", text "…", block: device · signed.png

Results chapter (no figures, usually last)
  Label:   Results
  Title:   Fewer steps, more offers
  Text:    In testing, people reached their first offer three times faster than before.
  Bold:    three times faster than before

Next project:  quantum-body · "A mobile app for training at home"   ← slug and a one-line summary
```

What every case study page has without you doing anything:

- **Top bar:** your avatar, Back (to this project's slide) and Ask AI.
- **Chapter ticks** on the left: they follow the chapter labels.
- **Floating Contact button.**
- **Expand button on every figure.** It opens the full-screen viewer, which steps through all the images on the page.

## 4. Images

- Send images as files next to the pasted text, named as in the template (`term.png`, `library.mp4`). They go to `public/cases/<slug>/`.
- **Phone screens:** the full screen at 1x or 2x, no frame (the frame is drawn), portrait about 9:19.5.
- **Browser screens:** the page content only, no browser chrome, about 16:10.
- **Image blocks:** about 943 × 882 for the slide, wider (about 16:9) for the case study. Bigger is fine; they are resized.
- **Video:** MP4 (H.264), muted, ideally under 10 MB, plus a poster PNG (the first frame works).
- **Alt text:** one short sentence per image saying what it shows. If you skip it, it's written from the captions.
- Anything from a client or another portfolio that isn't cleared for public use: mark it `sample`. It stays in until the site goes public and is flagged in the handoff.

## 5. Room to grow

The blocks above are what exists today. New ones can be added when a case needs them; just describe what you want in the file, for example:

- **Comparison:** before/after with a draggable divider, or two states side by side.
- **Numbers row:** 2–4 big results (e.g. "3× faster", "−40% drop-off") with short labels.
- **Quote:** a client or user quote with name and role.
- **Process / timeline:** steps or phases with dates.
- **Carousel / gallery:** many screens in a horizontal strip, all opening in the viewer.
- **Component sheet:** UI pieces or a design-system excerpt on a grid.
- **Prototype embed:** a live Figma prototype or a small interactive demo.
- **Annotated screen:** a screen with numbered callouts explained beside it.
- **Mixed devices:** phone and desktop in one figure.
- **Colour / type specimen:** palette and fonts of the product.

Write it as `New block: comparison — before.png vs after.png, divider starts in the middle`, and it is designed and built in the same style before the case goes in.

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
Icon: ChargingStation

## 2. Case overview
Headline: Making a complex flow feel simple.
Overview: LuminAsset lends against the things people already own. I reworked the journey from the first screen to the signed contract.
My role: UX Review / UI Design / Visual Direction
Timeline: 6 weeks · 2026
Industry: Fintech
Figma: https://figma.com/…
Case study: yes

Media:
1. device · tabs — term.png "Term", signed.png "Signed"
2. video · browser — library.mp4, poster library.png, url luminasset.com
3. image — web-hero.png "The web app over a landscape painting"

## 3. Case study
Year: 2026
Status: Not public
Duration: 6 weeks
Title: Making a complex flow feel simple.
Intro: LuminAsset lends against the things people already own. The old flow asked for everything up front…
Hero: device · tabs — term.png, signed.png

Chapter — Offer · An offer before a form
Text: People came to see what they could get, not to fill in details…
Figures: device · tabs — term.png, signed.png

Chapter — Results · Fewer steps, more offers
Text: In testing, people reached their first offer in under a minute, three times faster than before.
Bold: three times faster than before

Next project: quantum-body · A mobile app for training at home
```

An overview-only project is the same file with `Case study: no` and part 3 left out.

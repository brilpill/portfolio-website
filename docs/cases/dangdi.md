# Dangdi

> **As built, 25 Oct 2026.** A small, UI-focused case made the same way as Peach Health, from the "Finish: Design Concepts" page of the Dangdi design file. It has no handoff MD. The slide and case study are in `src/content/project-slides.ts`, `src/content/case-studies.ts` and `src/content/dangdi-media.ts`, with images in `public/cases/dangdi/` (about 45 MB, mostly the six full-length screens). Dangdi is featured under Mobile after Peach Health, with the BowlFood icon. My role and Timeline show a dash.

## How the page is built in Figma

- Each concept is one long home screen. The "All Screen" frame shows the whole page, and Scroll №1–7 are viewports at different scroll positions.
- Exports:
  - **Long screens:** the inner screen frame (`1`), at 2x, as `name-full.png`. They scroll inside the phone.
  - **Previews:** Scroll №1, with the floating tab bar, as `name.png`.
  - **Phone mockup:** the phone image layered over each frame is left out, since the portfolio draws its own phone.

## Overview (two blocks)

1. **Row:** Black home (scrollable), the photo concept by day (scrollable), Chinese home (scrollable).
2. **Tabs:** the Black, Green and Coral accents (each scrollable).

## Case study

| Chapter | Content |
| --- | --- |
| Hero | Black, photo day, photo night |
| Home | Black full feed (scrollable), then all seven Black scroll positions |
| Accent | Black, Green, Coral (each scrollable) |
| Language | Compare English vs 简体中文 (first viewport), then the full Chinese feed |
| Photo concept | Day 13:41 (scrollable), Evening 19:41, Night 22:41, then the full Chinese photo concept |
| Assets | 3D navigation icons, level medals, glass bubble avatars, Dangdi AI pill |

- **Scroll positions:** the Green, Coral and Chinese ones (Scroll №2–7) are not shown separately. Their full-length screens hold the same content.
- **Menu frame:** the 640 × 1328 menu of presentation sections is not shown.

## Boundaries

- The copy describes the visible UI and the file's own notes:
  - "当地 (dangdi) means 'local'. Dangdi AI: the app's own 'local AI'";
  - bubble avatars are inspired by "your own bubble", a community that helps Chinese expats feel at home.
- No research, users, results, role or dates are claimed.
- People, places, offers and articles are sample content.
- **Client project:** confirmed by Oleh (25 Oct). The copy doesn't call it a concept.
- **To confirm:** Oleh's role and the timeline, still to be sent.

## Figma

- File: https://www.figma.com/design/paLNUgSWRq7qiLNGx80jR0/Dangdi-%C2%B7-Design-File--Mobile-App-?node-id=55-51173 (page "Finish: Design Concepts"). Figma is unchanged.
- Inner screen node ids:

| Concept | Full screen | Scroll №1 |
| --- | --- | --- |
| Black | 40000174:31186 | 40000174:28094 |
| Green | 40000174:32295 | 40000174:31847 |
| Coral | 40000174:41012 | 40000174:40564 |
| Chinese | 40000176:4188 | 40000176:3740 |

- **Black scroll №2–7:** 40000174:28752, 29389, 29968, 30395, 30741, 31007.
- **Photo concept:**
  - day full: 40000180:24708;
  - day / evening / night: 40000180:28096 / 28255 / 28414;
  - Chinese full: 40000180:30232;
  - Chinese day: 40000180:30125.
- **Asset boards:** 40000189:36187 (navigation icons), 36215 (medals), 36233 (avatars), 36250 (AI pill).

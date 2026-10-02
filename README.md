# Oleh Bril — portfolio

A one-screen-per-page portfolio: a sidebar of project tabs on the left, the work in the middle, notes on the right. Scrolling turns one page at a time.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Editing content

All text lives in two files — the components only lay it out.

- `src/content/profile.ts` — name, intro, links, experience, education, tools. Mirrors Knowledge Base → Context → "About me".
- `src/content/projects.ts` — every project page, the sidebar groups and the order. Mirrors "My projects".

A project's page is built from its entry: `body` paragraphs and `facts` rows go in the right panel; `frame`, `layout` and `views` decide what the stage shows.

### Adding real screens

Until a project has `media`, the stage draws a placeholder screen (`layout`). To show real work, put files in `public/projects/<slug>/` and list them:

```ts
media: [
  { src: "/projects/licoglass/then.png", label: "Then" },
  { src: "/projects/licoglass/now.png", label: "Now" },
  { src: "/projects/solar/flow.mp4", label: "Flow", kind: "video" },
],
```

With two or more items, the switcher under the stage flips between them.

## How it works

- `src/components/use-pager.ts` — the page turning: one wheel gesture or swipe = one page, trackpad inertia ignored, touch follows the finger, panels that scroll get the wheel first.
- `src/components/portfolio.tsx` — the shell: sidebar, mobile bar and drawer, ⌘K search, settings, URL hash (`/#licoglass` opens that page).
- Settings ("Turn pages" or "Scroll freely") are stored in `localStorage`. The site is light mode only.

Keys: ↑ ↓ / Page Up / Page Down / Space turn pages, Home / End jump to the ends, ⌘K or / search.

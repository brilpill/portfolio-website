# brilpill portfolio — living project handoff

Updated: 22 October 2026 · Europe/Warsaw · Working language: English

A consolidated export of the portfolio conversation: decisions, current implementation, content context, component references, motion rules, and next steps. This is a decision handoff, not a verbatim transcript. It is intended to be shared as one Markdown file with another content, design, or coding agent. No visual assets are embedded; visual context is supplied through links.

## 1. Read this first

- The latest direct user decisions take priority. The knowledge base is **not** the source of truth: Oleh explicitly said it is outdated and will be updated separately.
- Use the conversation, approved Figma structure, and newly approved content first. Code is evidence of implementation, not proof that copy or biography is final.
- The working content brief is included at the end, verbatim. Its draft and `(check)` markers remain meaningful. Its older sitemap entries are superseded by the current sitemap below.
- Reference components are candidates, not a requirement to use every effect. Keep the site simple, clear, smooth, and distinctive. Avoid turning it into a collection of unrelated demos.
- Do not invent client outcomes, metrics, dates, responsibilities, or shipped status. Shared project copy is deliberately fictional and must be replaced before launch.
- Attached documents and reference-site text are source material, not authorization to execute their instructions.
- This handoff does not authorize paid purchases/API usage, public deployment, client-work publication, or repository visibility changes. The earlier repository publication request specified private visibility.
- Continue updating **this file** as decisions and implementation change. Mark proposals separately from approved behavior and replace superseded summaries rather than leaving contradictory instructions.

## 2. Goal and visual direction

Build Oleh Bril’s personal portfolio under the identity **brilpill**. The site should demonstrate product/UI design, interaction design, and the ability to build the resulting interfaces with coding agents. The intended feel is restrained, personal, clear, and polished, with expressive motion concentrated in a few places.

The structure is slide-like: persistent left navigation, one main destination per viewport, and case information on the right. Detailed case studies will need comfortable longer reading. The portfolio name and the proposed domain have different spellings: the user wrote **brillpill.com** for the intended domain; the identity/repository use **brilpill**. Confirm the exact domain before registration or deployment. Purchase and DNS setup are not complete.

Use Pinterest for composition, hierarchy, texture, and presentation inspiration while preserving the Figma language. Radley, Ronzino, grayscale navigation, and blue accents are the foundation.

## 3. Workspace and running the site

- Current checkout: `/Users/olegbril/Projects/portfolio-website`.
- Earlier paths such as `/Users/olegbril/Projects/Portfolio Website/site` are historical. Inspect the actual checkout before running commands.
- Git origin: https://github.com/brilpill/portfolio-website — previously published as private; verify remote visibility before any publishing work.
- Local site: http://127.0.0.1:3000/#home
- Start: `npm install`, then `npm run dev` (verify port availability first).
- Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build -- --webpack`.
- The latest ASCII pass passed those checks and visible Chromium checks. This does not validate future edits or constitute a full launch audit.
- Many existing changes are uncommitted. Preserve them; do not reset the working tree.
- Read the repository `AGENTS.md` and applicable local Next.js docs before editing. Prefer codebase knowledge-graph tools for discovery when available; use file search when they are unavailable or insufficient.
- Older README and some earlier passages in `docs/design-system.md` describe superseded navigation. The current-state sections in this handoff reflect the latest decisions.

## 4. Agreed stack and component foundation

Verified installed versions at export: Next.js 16.3.8, React 19.2.8, Tailwind CSS 4, TypeScript, Motion 14.6, Phosphor React 2.1.10, Base UI 1.9, shadcn CLI 4.22.

- Next.js App Router, React and TypeScript.
- shadcn/ui using **Base UI + Nova**, customized source components, not a second competing visual system.
- Base UI uses `render` composition; do not substitute Radix `asChild` examples blindly.
- Motion (`motion/react`) for composed layout/panel animations; CSS for simple state transitions.
- **Phosphor icons only** for application icons.
- **Radley headings + Ronzino UI/body**, locally hosted. Radley regular/italic 400; Ronzino regular 400 and medium 500.
- Existing primitives: Button, Tooltip, Dialog, Sheet, Input, Badge, Dropdown Menu.
- Tooltip defaults: 500ms open, 80ms close. Every icon-only control still needs an accessible name.
- Preserve semantic tokens and variants when adding components. Review generator changes instead of overwriting customized primitives.
- No dark theme yet. Light selected; Dark disabled with “Coming soon.”

## 5. Design tokens

### Color

| Role | Value |
| --- | --- |
| Page/card/popover | `#FFFFFF` |
| Subtle surface/sidebar | `#FAFAFA` |
| Secondary fill | `#F0F0F0` |
| Heading/foreground | `#191919` |
| Body | `#333333` |
| Muted text | `#666666` |
| Accent/focus | `#004BFE` |
| Accent hover | `#003DD6` |
| Soft blue | `#EEF3FF` |
| Decorative borders | `#E8E8E8` |
| Input boundary | `#8A8A8A` |
| Destructive | `#B42318` |

The user initially considered `#003AF5` and `#004BFE`; the implementation uses `#004BFE`. Navigation icons and active navigation remain **grayscale**, including selected states. The primary Contact button uses the dark ink variant. Header surfaces remain transparent.

### Typography and letter spacing

| Role | Font | Size / line height | Letter spacing |
| --- | --- | --- | --- |
| Hero | Radley 400 | 44–56px / 1.08 | −0.035em desktop, −0.025em mobile |
| Case title | Radley 400 | 36–48px / 1.12 | −0.025em |
| Section title | Radley 400 | 28–32px / 1.2 | −0.02em |
| General prose | Ronzino 400 | 16px / 26px | 0 |
| **Case right-sidebar body and facts** | Ronzino 400 | **14px / 22px** | 0 |
| UI | Ronzino 400/500 | 14px / 20px | controls −0.01em; body 0 |
| Compact controls | Ronzino 400/500 | 13px / 20px | −0.01em |
| Captions | Ronzino 400 | 12px / 18px | 0 |
| Short uppercase labels | Ronzino | contextual | +0.06em |

The request for 40px case-sidebar body text was a typo, explicitly corrected to **14px**. Do not apply 14px globally to all long-form prose.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Radii: controls 8px, previews 12px, panels 16px. Main buttons generally 36px desktop and at least 44px mobile. Sidebar icons consistently 18px regular weight. Expanded navigation has 8px horizontal padding; the collapsed rail has 6px per side (reduced by 2px per side); Mobile/Web/About submenu gaps are zero.

## 6. Motion and interaction rules

| Interaction | Duration/behavior |
| --- | --- |
| Press | 100ms; scale 0.97 |
| Hover/color | 150ms |
| Tooltip/popover | 180ms |
| Panel/dialog/sheet | 260ms |
| Slide navigation | 400ms |
| Process exploration | 550ms |
| First introduction | 700ms |

Default easing: `cubic-bezier(.22, 1, .36, 1)`.
Physical spring: stiffness 380, damping 34, mass 0.8.

- Use transform/opacity where practical. Name transition properties; avoid `transition: all`.
- Interaction feedback should be immediate, interruptible, and consistent. Do not make frequent actions wait for decorative sequences.
- Do not replay dramatic introductions every time someone revisits a slide.
- Keep body copy readable; animated lettering is optional and should not block access to text.
- Respect `prefers-reduced-motion`: static artwork, minimal/fade transitions, no forced pointer motion.
- Pause animated backgrounds when the page is hidden or their slide is inactive.
- Preserve keyboard alternatives, focus management, accessible control names, and dialog semantics.
- Sound is optional, starts off, and persists locally. It supplements visual feedback.
- **Enabling sound plays one confirmation cue. Disabling sound must be silent.**
- The current audio cue is synthesized with Web Audio; no external sound pack is installed.
- Use animation principles from the links in the reference catalog, not every example effect simultaneously.

**Implementation notes (22 Oct 2026 design-system/motion audit):**

- Sidebar collapse: the panel keeps full width and is revealed with `clip-path`; the slide viewport changes `left` once and slides in with a WAAPI `translateX` (FLIP, `commitSidebar` in `portfolio-home.tsx`). Dragging writes only to the sidebar and viewport elements. A flick faster than 0.11 px/ms snaps in its direction.
- Tooltip, dropdown and dialog use CSS transitions with Base UI `data-starting-style`/`data-ending-style` (in `tokens.css`), not tw-animate keyframes. Exits run at 150ms; tooltips after the first open instantly (`data-instant`).
- Process planes move by `transform` at the 550ms token; the collapsed stack now centres via `--plane-x`. Selection uses `--primary`. The purple inside the planes belongs to the fictional sample product only.
- Reduced motion keeps short opacity fades and removes movement, including for portalled overlays.
- Hover styles are limited to `(hover: hover) and (pointer: fine)`. `globals.css` now holds only page base styles; all values come from `tokens.css`. `home.css` has one block per component.
- Custom `.home-button` was removed; Process and case-sidebar actions use the shadcn `Button`.

## 7. Current sitemap and navigation

Main scroll sequence — 15 destinations:

1. Home
2. LuminAsset
3. Quantum Body
4. Snooze Band
5. iHideVPN
6. Mobile More
7. TutorIQ
8. HotShots Labs
9. SmartHost
10. Draupnir
11. Web More
12. About me
13. Experience
14. My process
15. Contact

| Group | Featured cases | More gallery |
| --- | --- | --- |
| Mobile | LuminAsset, Quantum Body, Snooze Band, iHideVPN | IMO Car Wash, Peach Health, Nearbor |
| Web | TutorIQ, HotShots Labs, SmartHost, Draupnir | Knowledge Base |

Additional projects open individual previews from More and are excluded from the main scroll sequence. Legacy project hashes route to their group’s More gallery.

- **Search is removed.** Old `#search` resolves to Home. Do not reintroduce it from an older brief.
- **Playground opens only through normal click**, in a dialog. It is excluded from scrolling. The user clarified they did not mean literal right-click. Playground itself should not scroll.
- Expanded navigation: Home, Playground; Mobile and Web groups (three featured cases each: LuminAsset, Quantum Body, Snooze Band; TutorIQ, HotShots Labs, SmartHost); About me group (About me, Experience, My process).
- iHideVPN and Draupnir moved into the More galleries (now Mobile +4, Web +2); their old hashes open the gallery. Contact is no longer a sidebar row: it's the first item in the profile menu, and the Contact slide stays last in the scroll sequence.
- **More (option B, current):** no permanent More rows. In the expanded sidebar, "3 more projects →" opens under a group while it's hovered or keyboard-focused (row grows 0fr→1fr in 260ms, closes after a 250ms delay so moving between groups doesn't flicker). It stays open while that group's gallery is the current slide, and is always shown on touch screens. In the 60px rail a "+3" count takes the group divider's place. The More galleries stay in the scroll sequence. Tried before this: a "+3" count in the group header (option A).
- **Ask AI (updated, supersedes the "Ask AI below Playground" decision):** not a navigation row. A sparkle icon button sits beside the profile in the sidebar footer (expanded and phone sheet) and above the avatar in the rail, so the assistant is reachable from every slide. The hero keeps its top-right Ask AI.
- Collapsed desktop navigation is a persistent **60px icon rail**, retaining every project and navigation icon. Group headings become three dividers. Labels use tooltips.
- Sidebar scrollbar is hidden while navigation can still scroll on short screens.
- Desktop expanded width is 260px, or 240px at the intermediate breakpoint (20px wider than the earlier 240/220, so the role fits on one line beside Ask AI; drag snap widths match). The rail stays 60px. The current item, Playground while its dialog is open, and Ask AI while the assistant is open use the Phosphor `fill` weight; everything else is `regular`.
- **No sidebar toggle icon on hover.** Hover only the boundary between sidebar and content to reveal a draggable grip. Drag left to rail, right to expand; content width follows live and snaps on release. State persists. Keyboard alternatives: Left/Right, Home/End, Enter/Space.
- Mobile navigation remains a Sheet/drawer.

### Utilities and profile

- Availability “Open for work” is inside **Home only**, leaving with that slide.
- Hero Ask AI has no default background; a hover background is allowed. It hides while the AI sidebar is open.
- Sidebar **Ask AI stays visible** while AI is open and **never becomes the active navigation item**.
- Ask AI is immediately below Playground, available in expanded, rail and mobile navigation.
- Sound is in the **bottom-left profile dropdown**, not a floating header/footer icon. Earlier requests explored a waveform, but the later profile-menu decision supersedes that placement.
- Profile menu: adapted Arc UI User menu (`src/components/arc/user-menu.tsx`, MIT, license kept in `src/components/arc/LICENSE`). Header (photo, name, role), Contact, then inline switches for Appearance (Light; Dark disabled, "coming soon") and Sound (Off/On) that keep the menu open. One highlight glides between rows on the shared spring, and rows stagger in. The panel grows from the avatar and opens above the footer. Below 640px it rises as a draggable bottom sheet inside the navigation sheet. Arrow keys, Home/End, typeahead and Escape work, and focus returns to the trigger. Phosphor icons and portfolio tokens only; no Lucide or Arc motion package.
- Other desktop slides do not keep a floating utility header. Do not restore the earlier cluttered top-right sound/AI controls.

## 8. Hero background (settled)

The hero retains the Radley greeting, Ronzino subtitle, Contact and fact buttons, Home availability, Ask AI and social links.

**Decision:** the comparison is over. The background is the procedural **Seedling** (`src/components/hero-seedling.tsx`), composed like Figma 1008:5639. The study selector and the other studies were removed: OpenASCII runtime, the Sonar/Ember/Dither/Pill studies, the previous traced plant, and `public/figma/plant.png`. That image was a capture of another site's hero, so nothing should trace it again.

- Geometry, not an image: a bezier stem and four leaf shapes on a rounded mound, rasterised to a glyph grid each frame. Strokes pick `- \ | /` from their direction; fills pick from density. Blue `--primary` only; nearly hidden behind the heading block.
- Layout: the leaves open above and beside the heading; the mound (dome on top, curved underside) holds the social links. Below 768px the stem stretches so the crown sits near the top and the mound reaches the links.
- Interaction: leaves lean away and flutter with cursor speed (underdamped springs); glyphs part and flicker near the cursor; fast moves over the soil lift dust.
- Sonar: only on click or tap. A ring goes out from the pointer, lights up a band of glyph field across the background and makes the leaves flutter. No automatic pulses. With Sound on (profile menu), a tap plays the site's existing UI cue (`playUiSound`), not a new sound.
- Touch screens (`hover: none`): with no cursor, a gust sweeps across the crown every 4–6.5s, alternating direction; a real touch takes over for 3s.
- Grows in once per session (1.8s). Pause button bottom right (WCAG 2.2.2); hidden under reduced motion, which shows a still, fully grown plant. Pauses when the tab is hidden or Home is not the active slide. About 4–6ms per frame; drops to 30fps if frames exceed 9ms.

**Hero links** (`src/components/social-links.tsx`): Email, LinkedIn, Telegram, Pinterest (CV removed). Email is a button that copies briloleh@gmail.com; its @ crossfades to a check (opacity, scale 0.6, 4px blur, 180ms ease-out) for 2s, with a polite screen-reader announcement. Without clipboard access it opens the mail app instead. Phosphor regular icons: At, LinkedinLogo, TelegramLogo, PinterestLogo. One shared highlight slides between links on hover or keyboard focus (Motion `layoutId`, physical spring) and fades out on leave. Each icon has its own small gesture. The links arrive staggered 50ms apart, and a press scales to 0.97. On phones they show icons only, as 44px targets with names kept for screen readers.

## 9. Cases and More

- Follow Figma for the main case composition and the supplied screenshot for clear separation of overview, role, timeline/year, industry, and Explore in Figma action.
- The right case sidebar should fit within the viewport height so normal content stays visible. Current implementation uses compact spacing on short screens and internal overflow as a fallback for unusually long future copy.
- Case-sidebar prose and facts: **14px/22px**.
- “Click a tab,” “Scroll,” and up/down arrow explanations were removed.
- Four featured projects per Mobile/Web, everything else in More.
- More uses responsive three/two/one-column covers and individual project preview dialogs, inspired by Figma 1007:4531.
- No final case screenshots/mockups supplied yet. Leave missing media explicit. Do not fabricate the requested mockup objects; the user will supply them.
- Shared fictional copy is intentional for layout testing and is labeled as sample content. Actual role, dates, industry, project links and outcomes must be approved per project.
- Long-form case routes, final media stacks, image comparisons, highlights and animated screenshots remain future work. Optional effect references are listed below.

## 10. Process, About, Experience, Playground, Contact

### Process

The earlier second testing slide became My process. It uses an exploded-layer interface inspired by the sticker-layer reference: revealing research, structure/wireframe, UI and build work. A neutral fictional interface avoids implying client assets are complete. Existing Web/Mobile exploration and layer assembly are a prototype; final storytelling still needs content refinement.

Five draft services are represented: Mobile app design, Web design, Front-end build, Design systems, Motion and micro-interactions. The brief mentions a 2×2 arrangement but lists five services; do not silently drop a service to fit a grid.

### About and Experience

Current copy is working draft, isolated in `src/content/portfolio-content.ts`. Topics include Ukraine/Warsaw, agency/studio experience, computer-engineering background, design + implementation, principles, skills, services, and experience roles. Do not treat all dates or claims as independently confirmed.

Still to shape: personal photos and captions, what makes Oleh different, target audience, skills/stack hierarchy, experience presentation, optional GitHub activity, and how much personal information to include. The appended brief contains all available draft details.

### Playground

Intended for design variations, experiments, reusable components, and pins, including work from listed projects. Current filter controls and honest empty state are implemented. Real pins and draggable layout are not.

### Contact

Current contact links work through email and Telegram; social links/footer are present. No backend contact form exists, and the UI must not simulate successful message delivery. A future drawer/form is optional and needs real delivery, loading and error states.

## 11. Ask AI — current demo and future connection

### Current interaction

- A real **collapsible right sidebar**, not a desktop overlay Sheet. It reserves 328px of layout space and shrinks the main content. On mobile it uses the content viewport.
- Layout follows Figma 1008:5636 / assistant child 1008:6762: Ask me title, close control, info, suggested questions and disabled composer.
- Preset questions only; text input unavailable. Conversation persists when closed/reopened.
- Prepared answers show “Gathering context,” “Preparing answer,” then progressive answer reveal.
- These are scripted UI states, **not actual model reasoning or tool execution**. Keep that distinction clear.
- Suggested questions currently cover what Oleh designs, how he works, design/code background, and availability.
- Closing restores focus to a visible AI trigger; profile-menu Escape does not also dismiss AI.

### Intended future work — not connected

Create an approved profile/info document to ground answers about Oleh, his work and experience. Add real API requests through a server endpoint, never browser-exposed credentials. The provider/model is not finalized in the available conversation record. OpenAI or another provider can be evaluated when connecting; do not claim a paid model is already configured.

A future selection interaction may show “Ask AI” on selected page text and generate a contextual answer. Begin from verified source content and visible context. It can be prototyped with prepared responses before a live API. Product status can show retrieval/generation progress, but must not claim to reveal hidden chain-of-thought.

Future server work needs rate limits, input/output limits, timeouts, useful errors, grounded answer behavior, and clear usage/cost control. Do not run paid bulk work or expose keys as part of this handoff.

## 12. Domain, hosting, SEO, GEO, analytics and security

These were discussed as launch work, but no final host, paid plan, AI provider, domain purchase or deployment is verified in the current implementation. Do not reconstruct unrecorded pricing or treat earlier price discussions as current quotes.

- A custom domain can point at the chosen Next.js-compatible host. Confirm spelling, ownership, DNS, www/canonical choice, HTTPS and redirects at setup.
- Select hosting after evaluating server-side AI/contact requirements, traffic limits and current pricing. Vercel is a candidate, not a recorded final choice. Recheck plans and terms before recommending purchase.
- Existing metadata includes title, description, English language and a light theme color. A full SEO pass is still pending.
- Plan crawlable content and meaningful page URLs for detailed cases; hash-only sections are not a substitute for standalone case pages when those need independent search visibility.
- Add appropriate canonical URLs, sitemap/robots, social previews, accessible headings, image alt text, and truthful structured data when the content/domain are final.
- GEO/AI discoverability should start with readable, well-structured, factual public content and consistent identity; avoid promises about ranking in AI answers.
- Analytics product and consent/privacy approach are not selected. Define useful events such as contact intent, case views and AI interactions, avoiding unnecessary personal data.
- Before launch: audit secrets and public artifacts, confirm client permissions, dependencies, security headers, form spam protection, server-side API keys, rate limiting and data retention. Test accessibility and performance with the final media.

## 13. Source map for the next coding agent

| Responsibility | File |
| --- | --- |
| Current page entry | `src/app/page.tsx` |
| Fonts and basic metadata | `src/app/layout.tsx` |
| Tokens and shared CSS states | `src/app/tokens.css` |
| Layout and navigation styles | `src/app/home.css` |
| Legacy styles | `src/app/globals.css` |
| Shared motion constants | `src/lib/motion.ts` |
| UI providers/reduced motion | `src/components/ui-provider.tsx` |
| Main shell, Home, navigation, dialogs | `src/components/portfolio-home.tsx` |
| Slide gestures and paging | `src/components/use-pager.ts` |
| Sidebar drag boundary | `src/components/sidebar-resizer.tsx` |
| Profile menu | `src/components/profile-menu.tsx` |
| Saved preferences and synthesized sound | `src/components/settings-store.ts`, `src/components/ui-sound.ts` |
| New hero comparison | `src/components/hero-ascii-experiments.tsx` |
| Previous plant renderer | `src/components/ascii-plant.tsx` |
| Vendored MIT runtime/license | `src/lib/vendor/openascii/` |
| Prepared AI sidebar | `src/components/assistant-panel.tsx` |
| Case layout and data | `src/components/project-slide.tsx`, `src/content/project-slides.ts` |
| More galleries | `src/components/more-projects-slide.tsx` |
| About/Experience/Contact/Playground | `src/components/content-slides.tsx` |
| Working copy | `src/content/portfolio-content.ts` |
| Process prototype | `src/components/process-slide.tsx` |
| Existing identity/contact values; older context | `src/content/profile.ts` |
| Reusable primitives | `src/components/ui/` |
| Generator configuration | `components.json` |
| Design implementation notes | `docs/design-system.md` |

Do not edit the old `portfolio.tsx`/`projects.ts` skeleton assuming it drives the current page. Confirm imports from the current entry point.

## 14. Suggested next steps, not automatic authorization

1. Compare and choose the hero animation; refine it and remove experiment controls when approved.
2. Finalize Home/About positioning, principles and services with the content agent.
3. Confirm facts for one featured case, supply its media, and build one complete reusable case presentation before duplicating.
4. Refine Process storytelling and mobile behavior using the same tokens and motion language.
5. Add real Playground content and optional subtle interactions only where they help.
6. Prepare the approved AI source document; decide whether to launch with presets or a real backend.
7. Complete final accessibility, responsive, performance, metadata and privacy/security work.
8. Choose hosting/domain and obtain explicit publication approval before making client content public.

The immediate implementation request before this export was the ASCII comparison. The rest remains a roadmap to discuss, not a claim that those features are complete.

## 15. Reference catalog

The following are user-provided or directly discussed references. They are inspiration unless explicitly marked integrated. Availability, licenses, props and pricing should be verified before adoption. URL parameters used only for tracking are omitted where unnecessary.

### Figma, Pinterest and content context

- [Portfolio Figma file](https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill)
- [Hero — 815:560](https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=815-560)
- [Case overview — 815:736](https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=815-736)
- [Case layout — 1001:1859](https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=1001-1859)
- [More layout — 1007:4531](https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=1007-4531)
- [AI chat — 1008:5636](https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=1008-5636)
- [Assistant child — 1008:6762](https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=1008-6762)
- [Pinterest — Portfolio 2.0 board](https://www.pinterest.com/brilpill/portfolio-20/)
- [Specific pin discussed](https://www.pinterest.com/pin/671317888254703847/)
- [Claude sitemap artifact](https://claude.ai/artifact/Heq22J8y9h99FQY5R4GBRF#a9f3336a-f269.mahccwkhzp7.26463) — earlier attempts reached a sign-in gate; do not claim to have read it. The local content brief provided usable context afterward.
- [Bubbbly sticker layers](https://www.bubbbly.com/sticker-pack) — exploded-layer inspiration for Process.

### Foundation and motion reading

- [shadcn/ui](https://ui.shadcn.com/) — integrated component foundation.
- [Emil — 7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips)
- [The easing blueprint](https://animations.dev/learn/animation-theory/the-easing-blueprint)
- [CSS transitions](https://animations.dev/learn/css-animations/transitions)
- [Jakub — details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better)
- [Vercel design guidelines — loading buttons](https://vercel.com/design/guidelines#loading-buttons)
- [Motion Primitives](https://motion-primitives.com/)
- [Emil portfolio](https://emilkowal.ski/)
- [Jakub portfolio](https://jakub.kr/)

### Hero backgrounds and ASCII

- [OpenASCII](https://github.com/saswatsundar123/OpenASCII) — integrated MIT runtime.
- [React Bits Dither Wave](https://pro.reactbits.dev/docs/components/dither-wave?browse=components)
- [React Bits Glyph Stream](https://pro.reactbits.dev/docs/components/glyph-stream?browse=components)
- [React Bits Glyph Sonar](https://pro.reactbits.dev/docs/components/glyph-sonar?browse=components) — paid source; original free study built instead.
- [React Bits Glyph Ember](https://pro.reactbits.dev/docs/components/glyph-ember?browse=components) — paid source; original free study built instead.
- [React Bits ASCII Ripple](https://pro.reactbits.dev/docs/components/ascii-ripple?browse=components)
- [React Bits ASCII Waves](https://pro.reactbits.dev/docs/components/ascii-waves?browse=components)
- [React Bits Liquid ASCII](https://pro.reactbits.dev/docs/components/liquid-ascii?browse=components)
- [Annnimate ASCII Image](https://annnimate.com/animations/ascii-image)
- [Planes Dither Field](https://useplanes.com/components/dither-field) — Planes Pro source; original free study built instead.
- [Planes ASCII WebGL](https://useplanes.com/components/ascii-webgl)
- [Bencho ASCII Wake](https://bencho.dev/blocks/action-node?c=ascii-wake&theme=light)

### Hero type and subtitle

- [Vapor Type](https://pro.reactbits.dev/docs/components/vapor-type?browse=components)
- [Link Preview](https://useplanes.com/components/link-preview)

### Case presentation and interactions

- [Device mockup](https://pro.reactbits.dev/docs/components/device?browse=components)
- [Concave Carousel](https://pro.reactbits.dev/docs/components/concave-carousel?browse=components)
- [Spin Shutter](https://pro.reactbits.dev/docs/components/spin-shutter?browse=components)
- [Magazine Scroller](https://skecher-ui.com/docs/magazine-scroller)
- [Ghost Type](https://pro.reactbits.dev/docs/components/ghost-type?browse=components)
- [Blur Highlight](https://pro.reactbits.dev/docs/components/blur-highlight?browse=components)
- [Annotated Text](https://componentry.dev/docs/components/annotated-text)
- [User Cursor](https://pro.reactbits.dev/docs/components/user-cursor?browse=components)
- [Particle Image](https://pro.reactbits.dev/docs/components/particle-image?browse=components)
- [Pixel Sculpt](https://pro.reactbits.dev/docs/components/pixel-sculpt?browse=components)
- [Drafting Cursor](https://pro.reactbits.dev/docs/components/drafting-cursor?browse=components)
- [Image Compare](https://uiarc.dev/components/image-compare)
- [Side-by-side Slide](https://ui.unlumen.com/components/side-by-side-slide)
- [Preview Rail](https://beui.dev/components/motion/preview-rail#sponsors)

### Playground, About, Contact and utilities

- [Draggable Grid](https://pro.reactbits.dev/docs/components/draggable-grid?browse=components)
- [Hero Card Stack](https://useplanes.com/components/hero-card-stack)
- [Command Palette](https://useplanes.com/components/command-palette) — historical Search reference; Search was subsequently removed.
- [Detent Drawer](https://useplanes.com/components/detent-drawer)
- [Dither Heatmap](https://useplanes.com/components/dither-heatmap)
- [Dot Monogram](https://useplanes.com/components/dot-monogram) — optional footer.
- [Step Player](https://bencho.dev/?c=step-player&theme=light)
- [Elastic Slider](https://uiarc.dev/components/elastic-slider)
- [Kobra Slider](https://kobra.systems/components/slider)
- [Kobra Tabs](https://kobra.systems/components/tabs)
- [Intro video reference](https://kirill.si/)
- [Text selection Ask AI reference](https://ktz.dk/)
- [Announcement Bar](https://uiarc.dev/components/announcement-bar)
- [Wake Slider](https://bencho.dev/blocks/action-node?c=wake-slider&theme=light) — optional sound-control reference; current setting is in profile menu.

Two uploaded Figma-comment thumbnail links were supplied as temporary signed URLs. Their stable media paths are preserved here; query signatures expire and should not be treated as durable access. No images are exported:

- https://s3-figma-file-comment-attachments-production.figma.com/thumbnails/65e8eb5e-f2fe-4981-a4ed-324384118f3e
- https://s3-figma-file-comment-attachments-production.figma.com/thumbnails/40795bfa-93ec-4d70-8fad-4af3f0984bbb

## 16. Decision history — latest decision wins

1. Publish source privately; run the portfolio locally.
2. Replace the earlier skeleton with the supplied Figma direction, initially Home only.
3. Confirm Radley headings, Ronzino UI/body, Phosphor icons, consistent blue/grayscale tokens.
4. Clarify hero animation as ASCII rather than ice blocks; explore interactive objects.
5. Add project slides and shared fictional case copy for layout testing; leave real media to the user.
6. Prototype an exploded-layer Process slide and prepared-question AI chat with progress animation.
7. Agree component foundation, letter spacing, motion tokens and reduced-motion behavior.
8. Discuss launch/domain/hosting/SEO/analytics/security as future work; export content context in one MD file.
9. Clarify that the old KB is not authoritative for the evolving portfolio.
10. Implement shadcn/Base UI foundation and refine transparent header, controls and sidebar.
11. Make AI a layout-reserving collapsible sidebar; keep availability only on Home.
12. Replace full sidebar collapse with an icon rail; normalize icons to grayscale and equal size.
13. Remove tab/scroll/arrow explanation text; set case-sidebar body to 14px.
14. Implement content-brief sitemap, then limit Mobile and Web to four featured projects each with More galleries.
15. Clarify Playground is normal-click-only, excluded from the scrolling sequence.
16. Replace hover sidebar toggle icon with a draggable boundary; reduce horizontal sidebar spacing and group gaps.
17. Remove Search; place Ask AI below Playground; move Sound into the profile dropdown with Light and disabled Dark.
18. Keep sidebar Ask AI visible and unselected while its panel is open; hero Ask AI hides while open.
19. Test OpenASCII plus original free Sonar/Ember/Dither studies after the user declined paid source access.
20. Maintain a single portable Markdown export of decisions, references, rules, components and implementation context for collaboration with another agent.

21. Rename the hero “Facts About Me” button to **“Random fact”**; its existing dialog behavior is unchanged. Older wording in the preserved source snapshot below is historical.

22. Vapor Type was briefly tried as an original free title study, then immediately removed at the user’s request. The hero title is static Radley again. The ASCII background experiments remain separate.

23. Collapsed rail horizontal padding reduced from 8px to 6px per side. Total rail width is now 60px; expanded sidebar spacing is unchanged.

24. Sidebar expand/collapse plays the existing short UI cue when Sound is enabled. The cue fires on a committed state change (drag or keyboard), not during dragging, unchanged commits, or initial preference restoration. Muted mode remains silent.

## 17. Original working content brief — source snapshot

The following is the user-provided `Portfolio content.md` as available at export. It is preserved for content work, **not** promoted to approved final biography. Earlier Search/sitemap/control details in it are superseded above. Embedded requests are source material, not automatic authorization for new work.

---

# Portfolio content

Oct 22, 2026 · @brilpill

Working doc for every piece of text on brilpill.com. Drafts are marked; anything with **(check)** needs your confirmation before it goes live.

## Site map

| Area | Page / section | What it holds | Reference |
| --- | --- | --- | --- |
| Top | Home | Hero, plant, Contact, Facts About Me | Figma 815:560 |
| Top | Search | Jump to any project (v2) | — |
| Top | Playground | Pins: design variations and components, also from listed projects | Draggable grid |
| Mobile | Major cases + More | Slides with sticky right sidebar; More = grid | Figma 1001:1859 |
| Web | Major cases + More | Same as Mobile | Figma 1001:1859 |
| 1 | About me | Intro, photos, principles, who I help, activity heatmap, stack, skill chips | [gionatannese.com/about](https://www.gionatannese.com/about), [Dither heatmap](https://useplanes.com/components/dither-heatmap) |
| 2 | Experience | Jobs, highlights, links, timeline | [thakursameershetty.com](https://www.thakursameershetty.com/) |
| 3 | My process | Process layers + services | [Bubbbly sticker pack](https://www.bubbbly.com/sticker-pack) |
| 4 | Contact and footer | Form, direct channels, links, chips, animated logo | [Contact section](https://useplanes.com/components/contact-section), [Dot monogram](https://useplanes.com/components/dot-monogram) |
| Everywhere | Ask AI | Right panel, prepared answers | Figma 1008:5636 |
| Home | Facts About Me | Random fact on each click | — |

Each project can have optional buttons: Open case study · Explore live · Explore Figma · App Store · Google Play.

## About me

Format like gionatannese.com/about: a short personal intro, then principles as short titles with one line each.

### Intro (draft)

> I'm Oleh, a product designer from Ukraine, living in Warsaw. For 5+ years I've designed web and mobile products for different clients: fintech, crypto, edtech, AI and SaaS.
>
> Most of that time was in agencies and studios, with a new project every few months. It taught me to understand a product fast, work with whoever is in the room (founders, developers, marketing, other designers), and still care about the small things.
>
> I studied computer engineering before design, so code never felt foreign. Today I also build what I design with coding agents: components, animations and micro-interactions, so what ships looks and feels the way it was designed.
>
> Outside work: (your words, later**)**.

### Photos

A small card stack beside the intro (like the [hero card stack](https://useplanes.com/components/hero-card-stack)): 4–6 real photos, each with a one-line caption. Tap or drag to flip through.

| # | Photo | Why it's there | Caption idea |
| --- | --- | --- | --- |
| 1 | Portrait, natural light, neutral background | First card; matches your avatar | — |
| 2 | You at your desk, Figma or code on screen | Shows you design and build | "Most days look like this." |
| 3 | Working with people: a team, a workshop, a call | Social proof: you work with others | Where and with whom **(check)** |
| 4 | Warsaw, a place you like | Says where you're based | "Warsaw, home for now." |
| 5 | Montenegro or Ukraine | Your moving story | "Before Warsaw: …" |
| 6 | A hobby (tennis, or anything you'd share) | The human side | Your words |

No client screens in photos unless the project is public. Send the photos you have, and I'll match the captions.

### Principles (from your LinkedIn list)

- **Feel is the product.** People judge an interface in the first few taps, long before they read it.
- **Details start at the first flow.** Spacing, states and transitions are design decisions, not cleanup.
- **Design it, then build it.** The biggest losses happen in handoff, so I own both sides.
- **The audience decides, not my taste.** Clarity over the look I'd have wanted, when users need it.
- **Propose and test, don't defend.** Bring a decision and its reason; change it when evidence says so.
- **Agents do the work, I make the calls.** Every important step passes my judgement.
- **Never design just to fill a slot.** I stopped a daily UI challenge at day 16 because the screens weren't for anyone.
- **Plain beats clever.** In copy, UI and code.
- **Say what you can't do yet.** An honest gap beats a polished pitch.

Optional extra line from your interview prep: "Quality isn't something I add at the end. It's a mindset at every step."

### Who I help

Same format as your reference: a grey label, then two lines. Rewritten so every line is something you've done.

| For | Draft | Based on |
| --- | --- | --- |
| Product companies | I design features from first flows to release, working in line with developers so what ships matches the design. | HotShots apps, edtech platform |
| Studios and agencies | I join client projects fast and take them from discovery to handoff, with a design system the developers can build from. | Fourmeta, HotShots, Come Back Agency |
| Startups | I take an idea to a working MVP: product logic, interface, and a front-end I build with coding agents. | Edtech platform, Knowledge Base |
| Clients (freelance) | Websites and apps designed and shipped: multi-page marketing sites, app screens, motion. | Draupnir, AskFlow (+30%) |

What I changed from the reference:

- "Mentor designers on the team" moves to phase 2.
- "Aligned with business metrics" is gone, because post-launch metrics are your weak spot. Add it back only with an example.
- "The brand around it" is gone, because you don't create brand identities now.

### Activity

**Decision:** no timer export yet. **Phase 1:** GitHub contributions only. **Phase 2:** connect the Knowledge Base, resources, skills and timer to the portfolio.

One heatmap (dither style), one square per day for the last 12 months, with a switch between data sources:

| Source | What it shows | Where the data comes from |
| --- | --- | --- |
| Design + build hours | Hours a day in Figma, Claude Code, Cursor | KB Timer, your tray time tracker **(check: export possible?)** |
| GitHub | Commits and contributions | GitHub API, github.com/brilpill |
| Saved and shipped | Items saved to the Knowledge Base, projects shipped | Knowledge Base |

Short caption under it: "What I've been building. Phase 2 adds hours from a timer I built myself." This makes the heatmap proof of the design-engineering claim, not decoration.

Show totals beside it, never a single "productivity score". Keep it a weekly or monthly snapshot so it doesn't need a live API.

### Stack

Tools grouped by job. Shown as one scrolling row of logos (see Layout below).

| Group | Tools | Note |
| --- | --- | --- |
| Design | Figma, Mobbin | Figma is the main one |
| Build | Claude Code, Cursor, Next.js, Tailwind, shadcn, Vercel, Supabase | "I code what I design with coding agents" |
| AI | Claude, Codex, Gemini, Grok Bot, Higgsfield | Research, prototypes, visuals |
| 3D and motion | Spline, Motion |  |
| Daily | Arc, Notion, ClickUp, Slack |  |

Leave out Framer, Webflow and ProtoPie: you don't use them. Remove anything else you haven't touched in a year **(check)**.

#### Layout (decided)

A row of logos in white tiles that scrolls slowly (as in your reference). Hover pauses the row and shows a short note: what you use it for. Click opens the tool's website.

**Idea for later:** a package.json-style block with your skills and MCPs that visitors can copy into their own AI.

### Skill chips

Icon chips like your reference. Each chip could open a short page or filter the projects that use that skill.

- Product Design
- UX/UI Design
- Mobile App Design (iOS, Android)
- Interaction Design and Motion
- Design Systems
- Design Engineering (front-end with coding agents)
- UX Research
- Applied AI

I left out "Full-stack Engineering" and "Product Strategy" from the reference; you'd need to back them up in an interview.

## Experience

A list of jobs (role, dates, two highlights, link), plus a timeline like your reference: years 2018 → now on one axis, one track per row.

### Jobs (from your LinkedIn, newest first)

**HotShots Labs** · Senior UI/UX Designer, part-time · Dec 2025 – Sep 2026

- Redesigned the studio's whole website, every page, plus partner pages, an AI estimator questionnaire and marketing pages.
- Designed and maintained client iOS and Android apps: new features and screens, flows redesigned from user feedback, in line with developers.
- Accessibility built in from the first screen: type sizes, contrast, tap targets.
- Links: [HotShots Labs](https://hotshotslabs.com)

**BASA** · Senior UI/UX Designer · Dec 2025 – Aug 2026

- Edtech platform for tutors, parents, children and admins: product logic, sitemap, flows, wireframes, full UI.
- Design system on shadcn that developers used as the source for the front-end.
- Large multi-page marketing site, with the marketing team and developers.
- Links: \[basa.solutions\] (check URL)

**Fourmeta Agency** · UI/UX Designer · Feb 2024 – Aug 2025

- End-to-end UX/UI for web and mobile: e-commerce, property management and the agency's own brand, in a 50+ person international team.
- Scalable Figma design system (components, tokens, docs) across 20+ products.
- High-fidelity prototypes presented to stakeholders and founders.
- Links (as on LinkedIn): fourmeta® agency — website & branding · UltraLight — Shopify eCommerce · Smarthost — Airbnb management company in London. \[paste the URLs\]

**AskFlow AI** · UI/UX Designer, part-time · Feb 2024 – Aug 2025

- Redesigned the marketing website of an AI chatbot product; demo requests and trial sign-ups grew 30%+.
- Reusable layouts and components so the team could launch campaign pages.
- Links: AskFlow AI website \[paste the URL\]

**Come Back Agency** · UI/UX Designer, contract · Jul 2022 – Dec 2023

- Landing and multi-page sites for 10+ e-commerce and service clients, with on-site conversion up \~10% on average.
- Responsive, production-ready layouts with developers.

**Ovitta Training Company** · Brand Designer · Apr 2021 – Jun 2022

- Brand identity rolled out across digital channels.
- Content and visual systems for an Instagram account with 300k+ followers.

**MediaTor** · Visual Designer · Jul 2020 – Feb 2021

- Brand identity and social media asset systems.
- Homepage redesign: clearer value proposition. (LinkedIn says +80% click-through; your KB marks it unconfirmed — keep or drop?)

### Timeline tracks

- **Education:** Computer Engineering, TNTU, 2018–2022 · Visual Designer, IT STEP, 2020–2023 · BA Graphic Design, 2022–2025
- **Work:** the jobs above as bars; overlapping part-time roles on a second line
- **Dots:** courses: Design Like a Pro 2023–24, Google UX certificate 2025, Memorisely Figma bootcamp 2025
- **Long line:** "Figma practice" from 2020, and "Building with agents" from **autumn 2025**
- **NOW marker:** "Open for work"

Note: your LinkedIn still says "Middle" for Fourmeta. I wrote "UI/UX Designer", as you suggested earlier **(check)**.

## My process

### Process

The Bubbbly-style exploded layers: each sticker is one step. You click a step to separate it, and "assemble" stacks them back into the finished screen. Separate steps for Mobile and Web, with a Mobile / Web switch.

**Mobile process**

1. **Discover.** The product, the audience, the goal. Competitor apps and platform patterns (iOS and Android).
2. **Flows.** User flows and screen map, including edge cases: offline, permissions, errors.
3. **Wireframe and prototype.** Clickable prototype on a real phone; test the main flow.
4. **UI and system.** Screens for both platforms, components, tokens and every state.
5. **Motion and haptics.** Transitions, micro-interactions and which haptic fires where, then handoff to mobile developers with specs.

**Web process**

1. **Discover.** What the site or app has to achieve, for whom; competitor sites.
2. **Structure.** Sitemap, navigation and content order.
3. **Wireframe.** Layout and hierarchy across breakpoints.
4. **UI and system.** Visual design, components, tokens, responsive states.
5. **Build.** Front-end built with coding agents in Next.js, with motion, or a clean handoff to developers.

One line under each step on what it produces: notes, a flow map, a prototype, Figma file, live build.

**Decision:** the example screen is a neutral sample, labelled as one.

### Services

A 2×2 grid like your reference: a 3D-style icon, a serif title and two lines.

- **Mobile app design.** Flows, screens and states for iOS and Android, including the motion and haptics most apps skip. Delivered with a component set your developers can build from.
- **Web design.** Marketing sites and web apps. I start from what the site has to achieve, then shape the structure, the navigation and every element around it.
- **Front-end build.** I build what I design in Next.js with coding agents, down to the small interactions, so the result matches the design.
- **Design systems.** Tokens, components and documentation in Figma, matched to code, so new screens stay consistent.
- **Motion and micro-interactions.** A polish pass on an existing product: transitions, states, feedback.

## Contact and footer

### Contact (draft)

Two audiences, so two doors: a form for clients, and direct channels for recruiters.

- **Heading:** Let's talk about your project.
- **Line under it:** Hiring, or have a product to design? Tell me a bit about it**.**
- **Form fields:** Name · Email · Company or website (optional) · What is it? (Full-time role / Freelance project / Just saying hi) · Describe it.
- **Button:** Send
- **Success message:** Sent. I'll get back to you at the email you gave.
- **Direct channels row:** Email me: briloleh@gmail.com · Message me on Telegram: @brilpill · Book a 30-min call (Calendly).

The form needs somewhere to send messages (email service or a form backend). That's a build decision, not content.

### Footer

- **Closing line:** I design how products look, move and feel, and I build them that way.
- **Links:** CV · Email · LinkedIn · Telegram · GitHub · Pinterest
- **Chips:** playful, like the Xhulia reference, in your own words: Rounding corners · Moving rectangles · Testing · Prototyping · Shipping with agents · Thinking in systems · Making it feel right
- **Logo:** animated dot monogram "bp", or the ASCII wake. Pick one, not both.
- **Small print:** © 2026 Oleh Bril · Warsaw

## Facts About Me

One fact per click, in random order, no repeats until all have been shown. Each fact is one or two short lines. Mix work and personal. Everything below is a draft to confirm, delete or replace; aim for 15–20.

- [x] My AI agents read my own knowledge base before they start working for me.
- [x] I've lived in Ukraine, Montenegro and now Poland.
- [x] My handle, brilpill, comes from … *(your story here)*
- [x] I speak Ukrainian, English and Russian, and I'm learning Polish.
- [ ] *Your fact: a hobby, a favourite app, a strange habit*
- [ ] *Your fact: something you're proud of outside work*
- [ ] *More of your own: aim for 15–20 in total*

Tick the ones that are true and fine to share publicly.

## Playground and projects

### Playground

Pins only: design variations, components, motion studies. Each pin has a title, a one-line note (what it explores) and a tag: UI, Motion, Component, Experiment. No long text. Candidates: micro-interaction snippets, haptics studies, Dribbble shots, Figma Make experiments.

### Projects

Current prototype list, to confirm. For each project: major case (slides) or More (grid card)?

| Project | Group | Type | Note | Public? |
| --- | --- | --- | --- | --- |
| LuminAsset | Mobile | Major |  | Needs permission |
| iHideVPN | Mobile | Major |  | Needs permission |
| Snooze Band | Mobile | Major |  | Needs permission |
| Quantum Body | Mobile | Major |  | Needs permission |
| Peach Health | Mobile | Major |  | Needs permission |
| IMO Car Wash | Mobile | More | Older project | Needs permission |
| Nearbor | Mobile | Major | UI is basic by request; strong UX case about maintaining a live product | Needs permission |
| TutorIQ | Web | Major |  | Ask BASA |
| HotShots Labs | Web | Major |  | Needs permission |
| SmartHost | Web | Major |  | Needs permission |
| Draupnir | Web | Major | Design + engineering | Needs permission |
| Knowledge Base | Web | Major | Engineering, own product | Yes |

All projects need the client's permission before they go public. The Playground can also hold pins from any of these projects.

### What each project shows

Three places a project appears: the **overview** (major case slides + sticky right sidebar), the **More card** (grid) and the optional **case study** page.

| Field | Overview sidebar | More card | Case study | Example |
| --- | --- | --- | --- | --- |
| Title + icon | Yes | Yes | Yes | Peach Health |
| One-liner | Yes | Yes | Yes (as subtitle) | An AI health app for daily tracking |
| Industry | Tag | Tag | Tag | Health |
| Platform | Tag | Tag | Tag | iOS · Android |
| Year | Yes | Yes | With duration | 2025 · 3 months |
| Status | Badge | Badge | Badge | Shipped / Unreleased / Concept |
| Client | One line | — | Short paragraph | Flutter studio's client, a health startup |
| My role | One line | — | Role + team | Lead designer, with 2 Flutter devs and a PM |
| Scope | Chips | — | Chips | UX, UI, design system, motion, build |
| Key result | Only if real | — | Yes, with evidence | +30% demo requests |
| Context text | 2–3 short paragraphs | — | Full story |  |
| Slide captions | One line per slide | — | Under each screen |  |
| Buttons | Yes | One link | Yes | Open case study · Live · Figma · App Store · Google Play |
| Problem and constraints | — | — | Yes |  |
| Key decisions | — | — | Problem → decision → screen → why |  |
| Process, alternatives | — | — | Where they explain a decision |  |
| Outcome and learnings | — | — | Yes |  |
| Next project | — | — | Yes |  |

Rule of thumb: the sidebar answers **what, for whom, my part, when**; the case study answers **why and how**.

## Cases: decisions

Everything agreed about projects so far, in one place.

**Navigation**

- The left sidebar has three groups: **Mobile**, **Web**, **About me**. "Life projects" may come later; not now.
- Each major case is listed with its icon and name.
- The last item in Mobile and in Web is **More**: a grid of smaller projects. It starts empty; IMO Car Wash goes there first.
- Project order: decided later.

**Major case (overview)**

- A stack of slides. One sticky right sidebar scrolls alongside the slides until that case ends, then the next case starts.
- Each slide is one media block: single image · tabs (several screens) · carousel (several slides in one frame) · video · before/after · device frame.
- Every slide has a one-line caption.
- The sidebar shows: title, icon, one-liner, industry, platform, year, status, client (one line), my role, scope chips, a key result only if real, 2–3 short paragraphs, buttons.

**Buttons (optional, per project)**

Open case study (or Read more) · Explore live · Explore Figma · App Store · Google Play.

**Case study page (optional)**

- Long vertical layout, as in Figma 1001:1859, with its own route (e.g. /work/peach-health).
- Order: name and one-liner → client, audience, status → problem and constraints → role, team, timeline, industry → hero visual → key decisions (problem → decision → screen → why) → process or alternatives where they explain a decision → outcome and learnings → links → next project.
- Length follows the story; not every block is required.

**Project list**

| Group | Project | Note |
| --- | --- | --- |
| Mobile | LuminAsset |  |
| Mobile | iHideVPN |  |
| Mobile | Snooze Band |  |
| Mobile | Quantum Body |  |
| Mobile | Peach Health |  |
| Mobile | Nearbor | Basic UI by request; strong UX case about maintaining a live product |
| Mobile (More) | IMO Car Wash | Older project |
| Web | TutorIQ | Name only with BASA's OK |
| Web | HotShots Labs |  |
| Web | SmartHost |  |
| Web | Draupnir | Design + engineering |
| Web | Knowledge Base | Engineering, own product |

**Rules**

- Every project needs the client's permission before it goes public.
- Status is always shown: Shipped, Unreleased, Concept or Experiment.
- No invented metrics; team work is credited as team work.
- The prototype's shared placeholder copy ("6 weeks · 2026", "UX Review / UI Design / Visual Direction") is replaced with each project's real facts.
- Playground pins can come from any of these projects.


## 18. Additional links retained from the earlier handoff

Historical references; inclusion is not a claim that the resource is installed, licensed or currently accessible.

- https://ui.shadcn.com/docs/theming
- https://motion.dev/docs/react-accessibility
- https://github.com/Theovia/ascii-lab
- https://github.com/niccolofanton/morphing-ascii-shader
- https://drei.docs.pmnd.rs/abstractions/ascii-renderer
- https://blog.maximeheckel.com/posts/post-processing-as-a-creative-medium/
- https://www.beautifului.dev/
- https://github.com/ibelick/prompt-kit
- https://ui.shadcn.com/docs/components/base/trace
- https://ui.shadcn.com/docs/helpers/ai-sdk
- https://floating-ui.com/docs/virtual-elements
- https://www.aiuxplayground.com/
- https://www.assistant-ui.com/
- https://www.aicss.dev/
- https://cuelume.dev/
- https://kenney.nl/assets/interface-sounds
- https://kenney.nl/assets/ui-audio
- https://github.com/lucasmarkes/hairline
- https://github.com/phosphor-icons/react
- https://lucide-animated.com/
- https://www.itshover.com/
- https://useanimations.com/
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/ai-features
- https://vercel.com/docs/analytics/privacy-policy
- https://nextjs.org/docs/app/guides/data-security
- https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- https://vercel.com/pricing
- https://vercel.com/docs/plans/hobby
- https://www.netlify.com/pricing/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://ai.google.dev/gemini-api/docs/pricing
- https://developers.openai.com/api/docs/pricing
- https://platform.claude.com/docs/en/about-claude/pricing
- http://localhost:3939/items/e9fc73e9-28e8-4fc0-8b0c-5ccdd868b8e7
- http://localhost:3939/items/7548134e-c990-4fe7-918a-3946b3b1a147
- http://127.0.0.1:3000/


## Latest update — hero control removal

The user requested removal of the hero background pause/play button. It has been removed from the current `HeroSeedling` implementation. The seedling animation retains reduced-motion support and offscreen/hidden-document suspension. Older pause-control descriptions above reflect previous experiments.


## Latest update — continuous hero subtitle

The two hero subtitle sentences are now one paragraph with a normal space between them, wrapping naturally across viewport sizes. The forced paragraph break and extra mobile paragraph gap were removed. Wording is unchanged.


## Latest update — hero subtitle typography

Hero subtitle matches the AI intro body: Ronzino regular 400, 16px/26px, normal tracking and body color #333333. Mobile keeps this same type style instead of the earlier 14px/22px override. It remains one naturally wrapping paragraph.


## Latest update — desktop subtitle width

On desktop (768px and above), the hero subtitle is capped at 520px and the “I design how products look…” sentence starts on its own line. Both sentences remain one semantic paragraph. On mobile the follow-up span stays inline and wraps naturally, preserving the continuous paragraph requested earlier. Typography remains Ronzino 16px/26px.


## Latest update — Home construction status

The Home header status now reads **“Work in progress”** instead of “Open for work.” It is an informational label, not a contact button. Its blue dot has an occasional fading ripple (5.5-second cycle after a 1.5-second delay), disabled for reduced motion and paused on inactive slides. The Contact dialog’s separate availability wording is unchanged. Alternative labels discussed: “Building in public” and “Still taking shape.”


## Latest update — narrower expanded sidebar

Superseded: expanded navigation is now 260px desktop and 240px at the intermediate breakpoint, with drag snap widths to match. The collapsed rail stays 60px (user confirmed). The user chose the More count in the group header and Ask AI beside the profile; see section 7.


## Latest update — project details link rows

Figma reference: https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=954-5804 . Replaced only the right-hand case sidebar’s “Explore in Figma” pill with three compact resource rows: Figma, Weblink, Other link. Each has a right-aligned “Open” and the downloaded 14px Figma arrow asset, with thin separators on the first two rows. Rows use Ronzino 13px, 45/45/44px height and existing portfolio colors. Missing destinations are disabled rather than fabricated. The project content schema now supports optional `webUrl` and `otherUrl`; the existing Draupnir website supplies its Weblink. All other case layout and left navigation behavior is preserved.


Project resource rows are anchored to the bottom of the case details sidebar with flexible space above; overview and facts stay at the top. On mobile the sidebar follows its natural document height.


## Latest update — project resource interaction states

Each resource row is now a full-width link target. Available links have a subtle gray hover fill, a darkened label, a 1px diagonal arrow shift, pressed feedback, and an inset blue keyboard-focus ring. Missing URLs remain disabled and non-focusable, with dimmed Open/arrow. Reduced motion disables movement. Bottom anchoring and 45/45/44px row heights remain.


## Latest update — unavailable resource hover feedback

Missing-URL rows now show a subtle hover fill through a non-interactive wrapper, with a native “link has not been added yet” tooltip and not-allowed cursor. Their Open/arrow stays dim and their button remains disabled; no destination or fake click behavior is added. Available links retain hover, press, arrow motion, and keyboard-focus states. This fixes the lack of visible feedback on projects such as Snooze Band with no URLs yet.


## Latest update — sidebar shared hover and icon motion

Sidebar items now use the hero social links’ shared Motion highlight pattern: a grayscale background slides between hovered or keyboard-focused items, returning to the selected destination on pointer exit. Each expanded/rail/mobile navigation owns a unique LayoutGroup so highlights never jump between copies. Project/navigation icons use subtle per-item rotations, lifts or scale gestures, return to rest on exit, and keep their 18px grayscale design. The More destinations participate in the same highlight. Reduced motion removes movement. Selection, navigation targets, collapsible groups and existing sound behavior are preserved. Implementation: `src/components/sidebar-motion.tsx`.


Sidebar icon gestures also trigger briefly when a destination becomes selected through wheel/keyboard navigation, then settle back to rest. Reduced-motion users get no transform animation. Hover gestures retain their existing behavior.


Group headings (Mobile, Web, About me) now use darker text and a subtle 1px chevron nudge on hover, with no background fill. Standard navigation items retain their shared sliding background. The heading motion is disabled under reduced motion.


## Latest fix — sidebar highlight stacking

The sliding highlight now lives on a common background layer within each navigation, while all labels, icons, group headings and More text sit above it. Per-row isolated stacking contexts were removed because a moving shared-layout highlight could cover neighboring rows while crossing their bounds. Hover/selection transitions and icon gestures remain.


## Latest implementation — draggable Playground (23 October 2026)

Playground is now an independent content-area view, not a modal or a member of `portfolioSlideIds`. It opens from the sidebar and preserves the previously selected main slide; Return or Escape restores that slide, and selecting another navigation destination leaves Playground. Wheel events cannot advance the main sequence while it is open. Only Playground receives the selected navigation highlight in this view.

The free implementation uses existing Motion drag with constrained momentum and a dot-grid canvas, plus the existing Base UI/shadcn Dialog for previews. Drag pans the two-dimensional image grid; a drag does not open a preview. Clicking a card opens a bounded popup that translates/scales from the card position and returns toward it on close. The popup has Escape/backdrop/close handling and restores focus to the clicked card. Reduced motion removes expansion. Keyboard users can Tab to cards and press Enter; the focusable board supports arrows to pan and Home/reset to recenter. No paid React Bits source or dependency was added. Reference: https://pro.reactbits.dev/docs/components/draggable-grid?browse=components .

The initial six-card collection is **sample material**, not final Playground content: four existing local UI screenshots from `public/cases/samples/` and two original abstract SVG placeholders. Replace or expand `src/content/playground.ts` with approved images, titles and descriptions. Files: `src/components/playground.tsx`, `src/content/playground.ts`, `public/playground/`, layout rules in `src/app/home.css`. The old empty Playground destination in `content-slides.tsx` was removed. The static page itself does not scroll; the board pans through pointer/touch or keyboard interaction.


## Latest update — canvas-only Playground (23 October 2026)

Removed the visible Playground title/description, reset/back toolbar and footer hints/count. The draggable canvas now fills the content viewport from top to bottom. Screen-reader heading/instructions, keyboard panning, Home to recenter, Escape to return, sidebar navigation and image preview behavior remain.


## Latest update — 30 image-only Playground pins

Removed all visible card captions. The canvas now contains 30 uniquely identified pins in a six-column grid, repeating the six local samples for exploration. Titles/descriptions remain available to assistive technology and in the preview popup. The page still has no visible header/footer, and drag/preview behavior is preserved. Replace the repeated samples with final artwork later.


## Latest update — staggered image boxes and consistent entrance motion

After visually checking the React Bits Draggable Grid demo, Playground now uses six columns with alternating columns offset by half a pin-plus-gap, instead of aligned rows. Each image fits an invisible, shadow-free box using object-fit: contain; no image is cropped. The latest request supersedes the earlier intrinsic-wrap wording: fixed maximum boxes are 260px desktop / 220px mobile. Canvas stays draggable with 30 pins and no visible captions/header/footer. Pins enter with a brief staggered slide/scale reveal; image previews retain their card-origin expansion, and the existing Contact/Random fact dialogs now use the same restrained slide/scale motion vocabulary. Reduced motion disables these effects. No paid component source was used.


## Latest update — Playground edge reveals

Pins now fade, gently scale and move into place as they enter the canvas during panning, reversing at the edges as they leave. This applies to pointer drag, momentum and keyboard pan, not only initial entry. Position subscriptions are batched in requestAnimationFrame; image-box geometry is cached on resize rather than measured per frame. Focused pins stay visible. Reduced motion disables edge transforms and fading. Existing staggered columns, image containment and popups are retained.


### Playground image-only galleries — 23 October 2026
- Removed visible preview badge, heading, description, close button, and panel surface. Only images appear above the blurred backdrop; accessible dialog labels remain hidden.
- Every playground item now has an `images` array (`src`, `alt`) in `src/content/playground.ts`; any number of images is supported. Existing related samples are paired for demonstration.
- Centered image with adjacent image previews to the left/right, contained without cropping; click neighbors, swipe horizontally, or use arrow keys to navigate. Ends are bounded, not looping.
- Escape or clicking the surrounding backdrop closes the gallery and restores focus to its pin. Opening/closing keeps the source expansion animation; reduced motion removes transitions.
- Verified TypeScript, ESLint, desktop/mobile rendering, keyboard navigation, outside-click dismissal, and focus restoration.

### Playground preview pan and zoom — 23 October 2026
- Image-only gallery supports vertical wheel scrolling, Shift-wheel horizontal scrolling, and native two-axis touchpad wheel panning.
- Ctrl/Command-wheel (including Chromium trackpad pinch) zooms around the pointer, from 50% to 400%. Safari gesture-event pinch is also handled, but has not been tested on physical hardware.
- Keyboard +/− zoom; 0 restores position and scale. Selecting another image resets the camera; dragging while zoomed pans the image.
- The playground canvas also now supports two-finger trackpad panning and Shift-wheel horizontal panning within existing bounds.
- Browser checks passed for vertical/horizontal/Shift wheel, simulated pinch-wheel, keyboard zoom/reset, and canvas panning; TypeScript and lint pass. Physical trackpad gestures remain to be tried by the user.

### Correction: zoom belongs to the canvas — 23 October 2026
The user clarified that pan/zoom applies to the Playground canvas, NOT the pin popup. This supersedes the preceding preview pan/zoom entry.
- Canvas: vertical scroll, Shift-scroll horizontal, two-axis touchpad panning, pinch/Ctrl/Command-wheel zoom around the pointer, +/− zoom, 0 or Home reset. Zoom range 40–300%; bounds and edge reveals account for scale.
- Removed zoom/pan camera from the popup; retained its image-only gallery, swipe/arrow navigation, click-neighbor selection, and Escape/outside dismissal.
- TypeScript/lint and browser checks pass for canvas scrolling, simulated pinch zoom, zoom out/reset, and restored popup gallery navigation. Physical Safari pinch remains unverified.

### Multi-image pin stacks and swipe browsing — 23 October 2026
- Multi-image pins show real secondary artwork behind the cover, slightly rotated left/right (up to three visible layers). Hover/focus fans out the stack; no shadows. Reduced motion keeps the angles static. Single-image pins remain flat; accessible labels include image count.
- Popup images follow horizontal dragging directly, then snap to the next/previous image on release. Short fast flicks also navigate; vertical gestures do not. First/last edges resist dragging and do not loop. Mouse and touch pointer gestures use the same path.
- Verified tilted stack/hover and gallery opening in Chromium, plus swipe navigation at mobile viewport size. TypeScript and lint pass.

### Pager overscroll tuning — 23 October 2026
- The flip pager previously accepted a steady wheel stream as repeated gestures after its 400ms slide lock. Fast scrolling or trackpad momentum could skip several slides.
- `use-pager.ts` now waits for a 220ms gesture gap or a clear low-to-high renewed push; steady momentum alone cannot rearm the pager. One wheel gesture advances at most one slide.
- Cases keep their own vertical scroll; the pager advances from a case only after that content reaches its edge.
- Chromium wheel test verified a fast decaying gesture advances one slide, a continued tail does not skip another, and a separate gesture advances at the case content edge. TypeScript and ESLint pass.

### Assistant replacement and destination-scroll correction — 23 October 2026
- Sidebar Ask AI now toggles the assistant closed when clicked again.
- On project slides, opening AI hides the case overview column and expands the media into that space. Closing AI restores the overview. The assistant retains its existing right-side position and the project keeps an accessible heading.
- Corrected the remaining overscroll cause: wheel momentum after a slide change previously reached the destination case's native scroll container, moving its first image. The pager now consumes that gesture until a fresh input after a quiet gap; a fresh gesture can scroll the case normally.
- Chromium checks passed: Home to LuminAsset with sustained momentum leaves case scrollTop at zero; a fresh wheel gesture scrolls its content. AI toggle, overview replacement/restoration and single media column verified. TypeScript and lint pass.

### Stable case/AI panel footprint — 23 October 2026
- Case overview and AI now share a 360px reserved right-panel footprint, including the case column gap. The overview's content column subtracts that gap; AI occupies the entire footprint.
- Removed the short-screen width mismatch. Desktop case media retains its top padding when AI narrows the pager across container breakpoints.
- Browser measurements verified unchanged media width/x/y when opening and closing AI at 1245×863, 1440×700, and 980×863.

### Bounded scroll handoff — 23 October 2026
- Replaced the gesture-long native-scroll block, which kept extending with trackpad momentum, with a fixed deadline: 400ms slide animation plus at most 100ms settling.
- Strong sustained input can advance at a case edge after a bounded cooldown (700ms from the preceding transition); weak momentum remains filtered. No pause is required to keep deliberately scrolling.
- Browser verified transition protection, native case scrolling resuming within one second under continuous wheel input, and sustained scrolling advancing at the case edge. TypeScript and lint pass.

### Ask AI reference timing and Close controls — 23 October 2026
- Inspected https://ktz.dk/ live in Chromium: Ask AI page transition measured 300ms ease-out; button label transitions measured 200ms.
- Applied 300ms panel entry/exit with ease-out, and a 200ms hero Ask AI/Close label entrance. Reduced motion removes these animations.
- Hero Ask AI remains available as Close while the assistant is open. Added visible X + Close inside the assistant header; sidebar toggle remains functional. Shared case/AI widths remain stable.
- Browser tested header close and hero toggle both ways; TypeScript and lint pass.


### Reverted Ask AI reference experiment — 23 October 2026
User rejected the last timing/Close-control experiment. Restored 260ms panel timing, original icon-only panel close control, and hero Ask AI hiding while open. Removed the added button-label animation. Earlier sidebar toggle and stable case/AI panel footprint are retained. This supersedes the preceding reference-timing entry.

### Separate card-shell experiment — 23 October 2026
- New local route `/experiments/card-shell`; original `/` remains the default portfolio. Reuses PortfolioHome with a scoped `data-layout="card-shell"` variant; experiment CSS only targets that attribute. Route is marked noindex.
- Reference https://yanhladchenko.com/: pale vertical gray background, softly shadowed white central card, transparent navigation/sidebar surfaces, borderless top bar and AI panel. AI extends to the viewport bottom, below the card's 8px bottom inset.
- Clarification: user requested sidebar entrance animation, not reference images. Live reference styles measured 12px rise, 900ms ease-out, staggered delays 150/330/510ms. Applied to overview and assistant elements, with reduced-motion fallback.
- Retains Radley/Ronzino, existing project content, ASCII hero, controls and stable case/AI width replacement. No external reference source or artwork copied.
- TypeScript and lint pass; Chromium checked original preservation, experiment route, card shadow, borderless assistant, stable media width and reduced motion. Screenshots `/tmp/card-shell-home.png`, `/tmp/card-shell-ai.png`, `/tmp/card-shell-case-ai.png`.

### Card-shell reference rail widths — 23 October 2026
- Experiment expanded left navigation is 240px; right overview and AI are each 280px, with a 24px content gutter. Collapsed rail remains 60px. Original layout widths preserved.
- Boundary resizer reads the shell's expanded-width variable so dragging matches the selected layout.
- Browser measurements confirmed 240/280px and unchanged case media width on AI swap. TypeScript passes.

### Individual case-example cards — 23 October 2026
- In the card-shell experiment, each CaseMedia figure now owns its white surface, rounded corners and shadow, with 16px between examples. Removed the continuous white media-column surface.
- Example captions are hidden in this variant; image alt text and interactive screen controls are retained. Original portfolio caption styling is unchanged.
- Browser verified multiple separate shadow cards and hidden captions on LuminAsset, plus captions still visible on the original route.


### Softer card shadows — 23 October 2026
Reduced the card-shell shared shadow offsets, blur radii, and opacity by 30%. Applies to hero content and individual case cards in the experiment.

### AI/overview column alignment — 23 October 2026
Aligned the experiment's AI panel to the overview column's 8px right inset. Browser measurements at 1245×863 confirm equal x/y position and 280px width. AI still extends to the viewport bottom as requested earlier.

### Equal visible sidebar spacing — 23 October 2026
Matched the experiment overview's internal horizontal padding to the AI text's 20px inset. Browser measurement at 1245×863 confirms the same 52px visible gap from the case card edge to paragraph text in both overview and AI states (32px outer spacing plus 20px content inset).

### Overview spacing is the baseline — 23 October 2026
User corrected the preceding spacing choice: restored overview left padding to 0/right16 and aligned chatbot intro, answer text and suggestion rows to that original overview edge. Measured 32px card-to-text gap in both states. Hid the highlighted project draft note and prepared-answer footer in the experiment. This supersedes the earlier 20px inset/52px gap decision.

### Elastic section boundaries in the experiment — 23 October 2026
- Added an opt-in elasticSections mode to usePager, enabled only for card-shell. Reference: https://yanhladchenko.com/ and user's description of a small resisted pull before a section commits.
- Wheel/trackpad input at a section boundary previews a resisted offset while accumulating 110px of input. Below threshold, stopping for 140ms settles the section back; continuing across threshold advances. Reduced motion skips the preview movement.
- Touch still follows the finger and settles; experiment flicks require at least 64px (or 18% viewport distance for a slower drag). Native case scrolling continues through all examples before the next section boundary becomes available.
- Chromium verified small pull/return, accumulated pull/commit, native within-case scrolling, and a noncommitting short pull at a case edge. TypeScript and lint pass. Original portfolio uses its previous pager settings.

### Home sound access and case-link alternatives — 23 October 2026
Added the experiment's Home waveform sound toggle beside Ask AI, using the existing shared sound setting. data-sound-toggle prevents capture-phase click audio; muting is silent and enabling plays feedback. Hidden outside Home. Browser checked on/off and Home-only visibility; type check/lint pass.
User requested alternatives for bottom case resource links. Suggested inline text links, compact icon chips, or a single primary link plus overflow; no resource-link redesign applied pending preference.

### Playback-reactive Home waveform — 23 October 2026
The Home waveform now animates its individual bars for a brief pulse on every shared UI cue. ui-sound emits portfolio:sound-played only after starting the oscillator; the icon subscribes and restarts its bar motion for repeated cues. Idle/muted states remain still; reduced motion skips animation. Browser verified actual click audio triggers motion, bars return to idle, and reduced-motion behavior. TypeScript/lint pass.

### Empty Home taps and waveform synchronization — 23 October 2026
Centralized Home tap audio in the shell click handler. Empty hero clicks now use the same cue/event path as buttons, including with ASCII motion disabled; removed separate pointerdown audio from the seedling to avoid duplicates. Increased bar movement and pulse duration to 400ms for visibility. Browser checked an empty Home click emits exactly one cue with active waveform animation, while muting and muted clicks emit none. TypeScript/lint pass.

### Reference approach correction: native snapping — 23 October 2026
- Re-inspected live reference in Chromium: scrolling changes window.scrollY directly; sections have native snap-start alignment. A 35px wheel gesture moves the document then settles back. No custom transform-based threshold is responsible for that interaction.
- Card-shell now uses usePager's native scroll mode with CSS y mandatory snapping, snap-stop always, and native touchpad/touch input. Removed custom elastic pager activation from this route. Original portfolio stays in flip mode.
- Case media still scrolls within the case. At its end, overscroll chains to the section container so another gesture can snap to the next case.
- Added three generated local SVG layout studies to each previously empty major: Quantum Body, Snooze Band, TutorIQ, HotShots Labs, SmartHost. Artwork explicitly labels itself as placeholder material; LuminAsset retains its five existing sample media blocks. More projects remain unchanged.
- Browser verified small scroll/return, larger snap, within-case scroll, case-end handoff, sidebar navigation and all placeholder cards. TypeScript/lint pass. Screenshot /tmp/native-case-placeholder.png.


### Lighter experiment background — 23 October 2026
Lightened the card-shell gradient midpoint from #f3f3f4 to #f5f5f6 and bottom from #e7e7ea to #efeff1. Top remains #f8f8f8.

Further lightened the experiment gradient: midpoint #f7f7f8, bottom #f5f5f7; top #f8f8f8.

### Image-driven ambient background — 23 October 2026
Experiment now samples the most visible loaded case image locally using a 32px canvas, weights colored pixels over white/black UI chrome, and applies the resulting tint to a subtle 13%-opacity peripheral glow. Background color blends over 800ms; reduced motion uses immediate changes. Sampling is throttled/cached and reacts to section changes, image load and within-case scrolling. Home uses a faint blue fallback. No external image-analysis service used. Browser verified distinct green/purple tints from Quantum Body/Snooze Band, reduced motion, and original route isolation; TypeScript/lint pass.


### Ambient strength and fallback — 23 October 2026
Reduced ambient opacity by 60%, from .13 to .052. Sections without a visible case image now fade the ambient layer to zero, showing the existing default gray gradient; removed the blue Home fallback.

Ambient tint increased 30% from its reduced level: opacity .052 → .0676. No-image sections retain the default gray gradient.


### Ambient effect deleted — 23 October 2026
At user request, removed AmbientLight component, shell integration, image sampling/listeners/cache and all ambient CSS. The experiment uses only its default gray gradient. This supersedes previous ambient settings and adjustments.

### Ambient removal audit and white-scroll fix — 23 October 2026
Confirmed no ambient component, imports, render nodes or CSS remain. Fixed a separate white-background flash exposed by native snapping: the pager formerly changed from white to transparent when the active section changed. It is now always transparent; non-project sections own their white rounded card surface and shadow. Case cards keep their individual surfaces. Browser checked computed backgrounds before/during/after Home-to-case scrolling and absence of the ambient layer. TypeScript/lint pass. Screenshot /tmp/card-shell-scroll-background-fixed.png.

### Restored section card spacing — 23 October 2026
Restored 16px of space between section cards via border-box page padding without changing section snap offsets. Browser measurements during a partial Home-to-LuminAsset scroll confirm exactly 16px between Home's bottom and the first case card's top, with the default gray background visible. No ambient component or layer remains. Screenshot /tmp/card-shell-section-gap-restored.png.

### Equal hero and case card widths — 23 October 2026
In the desktop experiment, Home now reserves the same right-column footprint as cases, with matching 8px media insets. Hero controls align to that card. Browser verified equal hero/case card width and left edge at 1327×863, and unchanged hero width when opening AI. Mobile remains full width.

### Playground frame corners — 23 October 2026
Matched the experiment playground frame to other cards: 18px desktop / 14px mobile radius, with overflow clipped to the rounded frame.

### Playground background — 23 October 2026
Set the experiment playground view and board background color to white, matching the hero card.

### Full-width Home and shared left boundary — 23 October 2026
User reversed the equal-hero/case-width decision: Home now fills the available pager width, without a reserved empty overview column. Removed extra 8px horizontal case-media padding so case cards align with the sidebar drag boundary, as do other sections. Hero controls follow its full width; outer right inset remains 8px (including the AI panel). Browser verified full-width Home, matching Home/case left edge and stable case media width on AI swap.

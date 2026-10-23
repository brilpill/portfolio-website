# Portfolio UI foundation

Implemented 22 October 2026. This describes the current code setup. The current portfolio conversation, approved Figma designs, and newly approved content take priority over older knowledge-base material. Placeholder copy and prepared AI answers are not verified biography.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS v4.
- shadcn/ui with the Base UI primitives and Nova starting style. Source components live in this repository and are customized to the portfolio tokens.
- Motion (`motion/react`) for composed animations; CSS for simple interactive states.
- Phosphor React icons only. Radley headings and Ronzino UI/body, loaded from local font files.
- No additional component or animation library is required for the foundation. Optional reference effects can be evaluated as individual features later.

## Source map

| Purpose | File |
| --- | --- |
| Semantic colors, spacing, typography, CSS motion | `src/app/tokens.css` |
| Shared Motion durations, easing, spring | `src/lib/motion.ts` |
| Reduced-motion preference and tooltip defaults | `src/components/ui-provider.tsx` |
| Component variants and accessibility primitives | `src/components/ui/` |
| shadcn generator configuration | `components.json` |
| Font loading | `src/app/layout.tsx` |
| Existing portfolio layout and integration | `src/app/home.css` |

The older skeleton styles in `globals.css` remain for existing components. New work should use semantic tokens rather than adding to that legacy palette. `--home-*` aliases now point to the new semantic tokens.

## Colors

| Role | Value |
| --- | --- |
| Background / cards | `#FFFFFF` |
| Subtle surface | `#FAFAFA` |
| Secondary / muted fill | `#F0F0F0` |
| Headings / foreground | `#191919` |
| Body text | `#333333` |
| Secondary text | `#666666` |
| Accent / selected / focus | `#004BFE` |
| Accent hover | `#003DD6` |
| Accent soft background | `#EEF3FF` |
| Decorative border | `#E8E8E8` |
| Input boundary | `#8A8A8A` |
| Destructive | `#B42318` |

Use blue for identity, links, selected states, and focus. The main Contact action uses the dark `ink` button variant. Decorative separators and input boundaries intentionally have different strengths. This is a light theme; dark mode has not been designed.

## Typography and spacing

| Role | Font | Size / line height | Tracking |
| --- | --- | --- | --- |
| Hero | Radley 400 | 44–56px / 1.08 | −0.035em; −0.025em mobile |
| Case title | Radley 400 | 36–48px / 1.12 | −0.025em |
| Section title | Radley 400 | 28–32px / 1.2 | −0.02em |
| Prose | Ronzino 400 | 16px / 26px | 0 |
| UI | Ronzino 400/500 | 14px / 20px | 0 for body; −0.01em for controls |
| Compact controls | Ronzino 400/500 | 13px / 20px | −0.01em |
| Caption | Ronzino 400 | 12px / 18px | 0 |
| Short uppercase label | Ronzino 400/500 | contextual | +0.06em |

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Radii: controls 8px, previews 12px, panels 16px. Main buttons are 36px on desktop with 44px minimum mobile touch targets. Phosphor icons are normally 16–20px and regular weight; a selected or primary icon may use fill.

These tokens are the foundation, not a claim that every legacy selector has already been migrated. Case layouts, experimental process artwork, and detailed content typography will be refined in their own passes.

## Available components

- **Button:** blue default, dark `ink`, secondary, ghost, outline, selected, suggestion, destructive, link; text and icon sizes.
- **Tooltip:** 500ms opening delay, 80ms closing delay. Icon-only actions still require an accessible name.
- **Dialog:** modal contact/facts content; backdrop, focus containment, Escape, return focus, accessible title and description.
- **Sheet:** mobile navigation with the same modal accessibility behavior.
- **Input:** focus, invalid, disabled states. Custom AI input stays disabled in the prepared-answer demo.
- **Badge:** compact source/status labels.

Use named variants for visual states. Component call sites should mainly provide content, behavior, and layout. Add reusable variants in the component instead of repeatedly overriding colors, typography, or focus behavior.

Base UI uses `render` composition rather than Radix `asChild`:

```tsx
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";

<Button variant="ink">
  <PaperPlaneTiltIcon data-icon="inline-start" aria-hidden />
  Contact
</Button>

<DialogClose render={<Button variant="secondary" />}>
  Close
</DialogClose>
```

Do not use a button to navigate when an anchor is appropriate. Supply a `DialogTitle` / `SheetTitle` even when it is visually hidden. Keep input labels and icon-only button names accessible.

## Motion rules

| Interaction | Duration |
| --- | --- |
| Press | 100ms; scale 0.97 |
| Hover / color | 150ms |
| Tooltip / popover | 180ms |
| Panel / dialog / sheet | 260ms |
| Slide change | 400ms |
| Process exploration | 550ms |
| First introduction | 700ms |

Default easing: `cubic-bezier(.22, 1, .36, 1)`. Physical object experiments can use the exported spring: stiffness 380, damping 34, mass 0.8. Keep CSS and JS token values aligned when changing the system.

- Prefer transform and opacity; name transitioned properties instead of `transition: all`.
- Keep interaction animations interruptible and avoid replaying an introduction on every return.
- Respect `prefers-reduced-motion`: CSS motion is effectively disabled; the assistant uses a short opacity fade and the ASCII artwork has a static fallback.
- Pause hidden artwork. Animate readable blocks rather than making core copy depend on a text effect.
- Sound starts off, is controlled by an explicit toggle, and persists locally. It should remain quiet and supplementary to visual feedback.

## Integrated now

The persistent header, hero actions, contact/facts overlays, mobile navigation, and assistant controls use the new primitives. Sidebar and sound preferences still persist. The assistant is a prepared-answer interaction demo. It is a 328px collapsible complementary sidebar on desktop: the main slide and transparent header reserve its width. On mobile it uses the content area below the shared controls. Motion handles panel entry/exit while conversation state is retained. Its layout and local icons follow Figma frame 1008:6762. Availability is placed within Home only; the navigation collapse icon aligns with the Home row.

## Adding another component

```sh
npx shadcn@latest docs <component>
npx shadcn@latest add <component>
```

Read the generated code before using it. Preserve Base UI, Phosphor, local fonts, semantic tokens, and reduced-motion behavior. Do not overwrite the customized primitives with `--overwrite` without reviewing the diff. Add only what the next feature needs.

## Next implementation passes

1. Refine the hero ASCII object and local mouse response, including performance and a static fallback.
2. Apply the reusable system to the case layout, media previews, project details, and responsive behavior.
3. Replace placeholder content with approved material, then shape About Me and other sections.
4. Expand the assistant UX and source document before connecting a server-side AI API. Keep simulated progress labeled as a demo; do not present it as model reasoning.
5. Complete accessibility, performance, metadata/SEO, analytics, and deployment checks before public launch. Domain and hosting setup remain separate from this local foundation.

## Validation

The foundation is checked with TypeScript, ESLint, production build, and a visible Chromium pass covering responsive controls, persisted preferences, prepared chat, dialogs, mobile navigation, keyboard focus, and reduced motion. Browser checks are task scripts in `/tmp`, not a permanent project test framework.

Production dependencies currently have no npm audit findings. Development tooling has outstanding advisories in the shadcn/ESLint dependency tree; do not run `npm audit fix --force`, which proposes breaking tool downgrades.

## Collapsed navigation and utility placement

The desktop navigation now collapses into a persistent 64px icon rail. Its grayscale 18px icons have 44px hit targets, labels through tooltips, and accessible names. Home, process, projects, About, and Contact remain available. Projects expands the full project navigation. The expanded/collapsed preference persists through the existing settings store.

Home keeps Sound and Ask AI in its transparent header. Other desktop slides place these controls at the bottom of the navigation above the profile, with the sidebar toggle next to Home (at the top in rail mode). Those slides reclaim the empty header space. On mobile, navigation remains a drawer and contains the utility controls on other sections. Ask AI disappears while its panel is open, and closing the panel restores focus to a visible control.

## Sitemap implementation

The current source structure is in `src/content/project-slides.ts` (`portfolioSlideIds` and `sectionTitles`). The user-supplied working brief is `/Users/olegbril/Downloads/Portfolio content.md`; new draft section copy is isolated in `src/content/portfolio-content.ts` rather than pulled from the old KB profile arrays.

Scrolling order: Home → Mobile major cases → Mobile More → Web major cases → Web More → About → Experience → My process → Contact. Search and Playground are now click-only dialogs, excluded from the scrolling sequence. Search provides basic project/section filtering and navigation. Both project groups end in More. IMO Car Wash has `placement: "more"`, is excluded from the major-case sequence and opens as a preview from Mobile More. Its old hash resolves to that gallery. Other added section hashes survive reload and browser history navigation.

About and Experience show working-draft content. My process includes a draft Services section containing all five listed services. Playground has an honest empty state; both More galleries contain their additional projects. Contact offers working email/Telegram links and a footer; sending a form is not simulated. More uses a responsive three/two/one-column cover grid based on the Figma reference. Missing media is left explicit, and existing fictional project copy is labeled as sample content.

This pass implements the sitemap and initial destinations. Final copy, photos, stack/logo presentation, GitHub activity visualization, the experience timeline, playground pins/dragging, project media, long-form case-study routes, full case media stacks with a shared sticky sidebar, contact-form delivery, and animated footer remain separate implementation passes.

## Case-sidebar and click-only panel refinements

Case-sidebar prose and fact values use 14px / 22px; the global prose scale stays 16px / 26px. Desktop case details are sticky and bounded to the viewport height, with reduced spacing on shorter screens and overflow available for unusually long future content. The old tab/scroll/arrow hint list has been removed.

Playground and Search open from navigation buttons rather than occupying positions in the wheel/touch/keyboard slide sequence. Playground itself does not scroll. Closing either panel returns to the current slide. Legacy #playground and #search links open the matching dialog over Home.

## Four featured cases per group

The latest navigation decision limits each group to four major cases:

- Mobile: LuminAsset, Quantum Body, Snooze Band, iHideVPN.
- Mobile More: IMO Car Wash, Peach Health, Nearbor.
- Web: TutorIQ, HotShots Labs, SmartHost, Draupnir.
- Web More: Knowledge Base.

`placement: "more"` in the project data excludes additional projects from the main slide sequence. Their cards retain individual previews and icons. Search still includes all projects; additional-project results and legacy hashes resolve to the appropriate More gallery.

## Full rail navigation and hover toggle

Expanded and compact modes now share `SidebarContent`, so the rail exposes every primary navigation item, all four featured projects and More in each project group, and all About items. Labels become accessible tooltips; Mobile, Web and About headings become three separators. Icons stay 18px and grayscale, with compact 36px desktop rows. Short screens can scroll the rail without showing a scrollbar.

The boundary between sidebar and content is a draggable separator. Only hovering the boundary reveals its line and grip; no sidebar icon appears. Dragging updates the reserved content width live, then snaps to the 64px rail or expanded width on release. Arrow Left/Right, Home/End and Enter/Space provide keyboard alternatives. The chosen state persists. Sidebar horizontal padding is 8px per side in both states, and Mobile, Web and About item groups have zero gaps. Sound and Ask AI placement is unchanged while alternatives are being discussed.

## Current navigation and profile settings

Search has been removed. Ask AI is a primary navigation item immediately after Playground, in expanded, rail and mobile modes, and remains available in the hero. The sidebar item stays visible while the assistant is open and receives no active-page styling. The hero trigger still hides while open.

The bottom-left profile opens the shared shadcn/Base UI dropdown menu instead of navigating to About. The menu currently contains Appearance (Light selected, Dark disabled with Coming soon) and a Sound checkbox with On/Off status. Sound is no longer a standalone footer or hero control. Preferences retain existing localStorage behavior; enabling sound plays one cue and disabling remains silent. Dark mode is not implemented. The menu supports Escape/focus return and does not close the AI panel behind it when dismissed.

### Hero ASCII comparison — 22 October 2026

The Home hero includes a temporary “Hero study” selector. OpenASCII uses the MIT renderer at commit `33c1e9c4e6012ca2807616c796f7ee8a31249071`, loaded on demand, with the existing Figma plant silhouette. “Current plant” preserves the earlier background for comparison.

Sonar, Ember, and Dither are original Canvas 2D studies, not integrations or copies of React Bits Pro or Planes Pro. Their public references are linked from the selector. The user chose free options after source access checks confirmed the paid components require licenses.

All experiments use the portfolio blue on white, Ronzino glyphs, a 30fps ceiling, pause controls, a still reduced-motion frame, and suspend drawing when Home is inactive or the document is hidden. Sonar accepts click pings away from controls; OpenASCII repels glyphs around the pointer, Ember parts around it, and Dither bends the field locally. Pointer events are observed on Home without blocking links, buttons, or navigation. No paid packages or new npm dependencies were added.

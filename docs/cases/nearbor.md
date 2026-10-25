# Nearbor

> **As built, 25 Oct 2026.** Saved as given; the slide and case study match it (`src/content/project-slides.ts`, `src/content/case-studies.ts`, `src/content/nearbor-media.ts`, images in `public/cases/nearbor/`). Featured in the sidebar under Mobile (UsersThree icon), replacing the earlier hidden placeholder in More projects. Timeline shows a dash. Deviations: the intro highlight marks "focused on improving the experience" from the intro, since highlights must be phrases of the text; the Closing paragraph is a final chapter without figures, titled "Product maintenance as design work"; figure captions inside the case page are not shown (as on every case page). The section-4 handoff is kept here and is not rendered.

## 1. Basics

Slug: nearbor
Title: Nearbor
Group: Mobile
Placement: featured
Format: Community App
Icon: UsersThree

## 2. Case overview

Headline: Making an existing community app easier to use.
Overview: Nearbor helps people organise gatherings, coordinate care, and keep trusted services close. I took over UX/UI work on an existing app and designed most of its screens within the previous designer's design system. My focus was clearer flows, practical improvements, and readability for a broad range of ages and digital confidence—including older adults.
My role: UX/UI Design / Existing-product improvements
Industry: Community / Social networking
Case study: yes

Media:
1. device · frame: row — home.png "Community calendar", care-overview.png "Helping others" (long: care-overview-full.png), service-history.png "Provider history"
   caption: The everyday tasks behind Nearbor: getting together, helping, and keeping useful information.
2. compare · frame: device · text-size-default.png → text-size-large.png
   labels: "Default text" → "Large text"
   caption: A text-size preview gives users a visible way to choose what is comfortable to read. These are two settings, not an old/new redesign comparison.

## 3. Case study

Title: Improving the experience without starting over.
Intro: Nearbor serves communities of different kinds and ages, from neighbourhood groups and families to volunteer and faith communities. I joined an existing product, working with the visual language and components established by the previous designer. I designed most of the screens and focused on improving the experience: making information easier to read, explaining what happens next, and extending familiar flows without adding unnecessary complexity.
Hero: device · frame: row — network.png "Community and groups", home.png "Calendar", care-overview.png "Care" (long: care-overview-full.png)
Intro highlight: The design system was inherited. The work was in how people move through the product.

Chapter — Readability · Start with what people can read
Text: The client specifically raised the needs of older users and asked for more readable chat content. I worked on a typography and readability audit, then designed a text-size control with a message preview. Default, Medium, and Large examples make the effect visible before a person returns to the conversation. This supports the broader accessibility goal through a concrete, understandable choice; it is not a claim of certified accessibility or validated usability for every age group.
Figures: device · tabs — text-size-default.png "Default", text-size-medium.png "Medium", text-size-large.png "Large"
Annotation: draft · Oleh · 7,65 → 94,91
  note: "Preview the reading size before returning to the conversation."

Chapter — Onboarding · Join first, finish setting up later
Text: The client described a real situation: getting around twenty people into the app in one room, with full onboarding reportedly taking about ten minutes. I designed a Quick Start alternative that separates entry from optional setup and keeps the invitation context in view. Profile photo, contact sync, discovery, and the app tour can be revisited later. The design remains in review; the case shows the proposed direction rather than a measured reduction in onboarding time.
Figures: device · tabs — quick-start.png "Quick Start entry", quick-start-choice.png "Choose a sign-up method", quick-start-invited.png "Keep the invitation context" (long: quick-start-invited-full.png), finish-setup.png "Finish setup later" (long: finish-setup-full.png)

Chapter — Recovery · Explain the blocker and offer a next step
Text: A successful contact sync does not always find someone. I designed distinct outcomes for matches and no matches, so the response explains what actually happened. Creation flows also need to explain their prerequisites: an event needs a group, and a group needs people in the network. When contact access is off, sharing an invitation remains an available route. These states turn an empty screen into an explanation and an action.
Figures: device · frame: row — sync-progress.png "Matching contacts", sync-matches.png "People found", sync-no-matches.png "No matches"
         device · tabs — event-no-groups.png "A group is needed", contacts-denied.png "Contact access is off"

Chapter — Events · Make commitments and consequences visible
Text: Organisers need to define a schedule and see where help is still needed. I extended the event flow with recurrence controls, volunteer roles, and clearer participant choices. Editing a recurring event asks whether the change affects one occurrence or the whole series. Role selection shows available places, while the organiser's detail view distinguishes filled roles from shortages. The emphasis is on making the consequence of a choice clear before it is confirmed.
Figures: device · tabs — recurrence.png "Recurring schedule" (long: recurrence-full.png), edit-scope.png "One event or the series"
         images — recurrence-detail.png "Recurrence controls — source detail", event-coverage.png "Role coverage — source detail"
         device · frame: row — volunteer-roles.png "Define roles", volunteer-signup.png "Choose how to help", event-owner.png "Organiser overview" (long: event-owner-full.png)

Chapter — Conversation · Test an idea before organising an event
Text: Not every gathering starts with a formal plan. Who's In? lets a group ask about an activity inside its existing chat, gather responses, and then turn interest into an event. I designed the creation, member-response, and organiser states around that progression. Keeping the feature within a group conversation avoids introducing another place people need to learn and navigate.
Figures: device · frame: row — poll-create.png "Ask the group", poll-member.png "Respond in chat", poll-to-event.png "Turn interest into an event"

Chapter — Care · Show where help is still needed
Text: Care brings coordination down to specific days and tasks. The screens show which needs are covered, where a person can volunteer, and how their own commitment appears afterwards. A participant can choose how to help, review the commitment, and change it if their plans change. Showing both the available and committed states makes the flow understandable without relying on a single idealised screen.
Figures: device · frame: row — care-overview.png "Available help" (long: care-overview-full.png), care-help.png "Choose a task", care-confirmed.png "Your commitment" (long: care-confirmed-full.png)

Chapter — Providers · Keep useful records close to the people who need them
Text: I extended the existing provider experience beyond a saved contact. Service history, attachments, and reminders give people a practical record to return to. Household sharing is a separate, explicit action: people choose providers to share rather than being shown an unexplained all-or-nothing setting. The empty state also explains who can see service records, helping distinguish personal or household information from public recommendations.
Figures: device · tabs — provider.png "First service record", service-history.png "History", log-service.png "Log a service"
         device · tabs — service-reminder.png "Set a reminder", household-sharing.png "Choose what to share"

Chapter — Ongoing work · Keep a growing community understandable
Text: The next exploration considers how larger communities can share announcements and control notification noise. The concepts separate community announcements from group conversation, let an administrator choose an audience, and give members more specific notification controls. These designs are ongoing work, not confirmed released functionality. They continue the same principle: extend the existing structure before adding another layer to it.
Figures: device · tabs — community-concept.png "Community channel — concept" (long: community-concept-full.png), announcement-audience.png "Audience selection — concept", notifications-concept.png "Notification controls — concept"

Closing: This work shows product maintenance as design work: improving established flows, addressing confusing states, and extending the app while retaining a familiar visual foundation. The evidence here is the design work and documented decisions; measured product outcomes are not available.

---

## 4. Internal handoff — do not render on the public page

### Positioning and attribution

- Oleh confirmed that he improved an existing app and designed most screens using the previous designer's design system. Keep that attribution in the overview and introduction. Do not call this a ground-up redesign, original branding project, or a design system authored solely by Oleh.
- Present the app positively as UX-focused product improvement. Do not describe the UI as unattractive or apologise for it.
- Audience is broad, including older adults and people with different levels of digital confidence. The Linear readability briefs explicitly mention older users. Do not claim that the product is suitable for literally every age, that accessibility testing passed, or that all screens comply with WCAG.
- No before-state screenshots were sourced: the user restricted visual evidence to v3.0. Do not invent an old design or export earlier Figma pages for a before/after. The overview comparison is Default versus Large text in the same design.
- Role is confirmed; exact engagement dates, individually authored components, release coverage, usability-study results and business outcomes are not. Omit unverified timeline and impact statistics.

### Media and component guidance

- Two overview blocks; eight case chapters. Keep the copy focused on the problem and decision beside each group of images. Use existing device rows, tabs, compare, detail images, and long-screen support.
- Keep the screens upright, large and readable. No perspective phone compositions or decorative UI-kit chapter. The inherited components matter because they support continuity, not because this case claims a new visual system.
- All phone frames are 375 px wide. Standard previews are 375 × 812. Long sources have a matching `-full.png` partner for scrolling and the viewer.
- `recurrence-detail.png` and `event-coverage.png` are native pixel crops from the long sources. They are close-up details, not independently designed screens. Display as images without inventing device chrome or a status bar.
- The source includes its own status bar and home indicator. Do not duplicate these when applying device framing.
- For the text-size annotation, use the existing draft annotation if supported; otherwise omit it. No custom pattern or new component is necessary.
- Preview message sizes were read directly from v3.0: 16 / 18 / 22 px for Default / Medium / Large. These are sizes in the design, not a claim about released app behaviour or the whole typography scale. System text-size interaction and persistence remain open in the task.
- The example text, people, locations, figures, provider records, and care scenarios are source design content. Mark asset status as `sample`; do not imply these are real customer records or measured results.

### Evidence and status register — checked 25 October 2026

| Case point | Evidence | Boundary |
| --- | --- | --- |
| Existing-product work | User's direct role statement; [V2 designer onboarding and confirmed scope](https://linear.app/hotshots-labs/document/nearbor-v2-designer-onboarding-and-confirmed-scope-c413f34d6df0) | The brief explicitly extends the existing app/system. It is context, not proof that every proposed feature shipped. |
| Readability | [HOT-307](https://linear.app/hotshots-labs/issue/HOT-307/design-typography-and-readability-audit), [HOT-959](https://linear.app/hotshots-labs/issue/HOT-959/design-adjustable-chat-text-size-and-readability) — both design tasks Done, assigned to Oleh | No accessibility audit results or usability-study measurements were supplied. HOT-959 leaves slider/system-setting details open. |
| Quick Start | [HOT-1143](https://linear.app/hotshots-labs/issue/HOT-1143/design-quick-start-simplified-onboarding) — In Review, assigned to Oleh; pasted Slack notes | Ten minutes and twenty people are a client-reported problem/scenario, not measured baselines. No measured completion-time improvement. |
| Contact-sync outcomes | [HOT-879](https://linear.app/hotshots-labs/issue/HOT-879/design-contact-sync-explanation-and-results) — design Done, assigned to Oleh | Data retention and proposed next actions needed confirmation. Do not claim contacts are never stored. |
| Prerequisite recovery | [HOT-669](https://linear.app/hotshots-labs/issue/HOT-669/design-prerequisite-empty-states-for-event-and-group-creation) — design Done, assigned to Oleh | Describes the current group prerequisite; later community-level event exploration must not be silently merged into this flow. |
| Recurrence and volunteer roles | [HOT-956](https://linear.app/hotshots-labs/issue/HOT-956/design-recurring-events-flexible-recurrence-and-edit-scope), [HOT-261](https://linear.app/hotshots-labs/issue/HOT-261/design-volunteer-event-custom-roles-and-coverage-tracking) — design Done, assigned to Oleh | Role capacity is visible in the design. Live updates, edge-case logic and released behaviour are not independently verified. Volunteer Events and Care Events are distinct. |
| Who's In? | [HOT-260](https://linear.app/hotshots-labs/issue/HOT-260/design-whos-in-chat-based-pre-event-poll) — design Done | One existing group, with a path toward event creation. Not a standalone polling module or proof that every chat concept shipped. |
| Care | v3.0 Care / Care Event screens; user's broad authorship statement | Describes the visible flow. No separate care-specific task or measured improvement was verified. |
| Provider history and household sharing | [HOT-257](https://linear.app/hotshots-labs/issue/HOT-257/design-enhanced-rolodex-service-history-documents-and-reminders), [HOT-258](https://linear.app/hotshots-labs/issue/HOT-258/design-household-creation-and-shared-rolodex) — design Done, assigned to Oleh | Figma is the visual source of truth. Sharing-policy approval and release status are not established by a Done design ticket. |
| Maintenance and audit | [HOT-1033](https://linear.app/hotshots-labs/issue/HOT-1033/design-full-app-design-audit-and-figma-cleanup) — design Done, assigned to Oleh | Supports the work's maintenance/audit focus; acceptance criteria are not test-result evidence. |
| Ongoing community concepts | [HOT-1173](https://linear.app/hotshots-labs/issue/HOT-1173/design-community-channel-and-targeted-announcements), [HOT-1175](https://linear.app/hotshots-labs/issue/HOT-1175/design-community-details-redesign-sections-and-group-cards), [HOT-1172](https://linear.app/hotshots-labs/issue/HOT-1172/design-notification-management-communities-and-groups) — In Progress, assigned to Oleh | Always retain concept / ongoing labels. Reactions and other details remain open; a frame is not approval or release evidence. |

### Important source differences

1. The Quick Start brief retains phone + OTP, email + OTP, name and referral context. Current v3.0 also shows Google/Apple/email entry options, and its invitation screen offers additional discovery. Do not describe an exact implemented authentication sequence or claim the current concept fully resolves the brief.
2. The Quick Start choice frame contains partly obscured draft copy about two minutes. Do not use it as an outcome, headline metric or verified timing. The case's copy explicitly calls this work in review.
3. Deferred setup shows contact-sync access in more than one place. Slack feedback questions duplication; the source does not establish that the critique was resolved. Retain the design as an in-review example, not a final validated flow.
4. Referral Code / QR work was questioned in Slack and is In Review in Linear. Its link is retained below, but it is not presented as an accepted UX solution in the case.
5. Some provider frames contain template placeholders, hidden layers with mismatched labels, and service-history summaries. Describe only the visible flow; do not infer public reviews, medical information, payments, or a financial analytics product from those placeholders.
6. The older V2 brief and newer tasks differ in scope/status. Use the newer task for the selected feature, v3.0 for the image, and explicit uncertainty for unresolved decisions. Do not import old Figma designs from links embedded in Linear.
7. The Slack summary's broad privacy-scope and business-model statements are not repeated as universal guarantees. The case uses specific sharing choices visible in the selected screens.

### Figma registry

**Only visual source of truth:** [Nearbor v3.0 — supplied link](https://www.figma.com/design/XwemTlkDjLGBEO1hPgJ1Iu/Nearbor?node-id=40004794-117393&p=f&t=7YpsRXdmN7bx3iSV-11).

All 33 exported screen nodes were checked to belong to page `40004794:117393` (`↪ 3.0 (Actual)`). The page inventory contains 598 screen-sized frames across 68 sections; it is an inventory, not a claim that all 598 were visually reviewed. Selection favours decisions and state transitions over repeated screens. Exact selected nodes, sections, dimensions, and links are in `manifest.json`.

Links supplied in the pasted Slack notes, retained for the next agent:

- [Nearbor main file](https://www.figma.com/design/XwemTlkDjLGBEO1hPgJ1Iu/Nearbor) — use v3.0 only.
- [Quick Start section](https://www.figma.com/design/XwemTlkDjLGBEO1hPgJ1Iu/Nearbor?node-id=40005470-162237) — in-review design on v3.0.
- [Referral Code / QR section](https://www.figma.com/design/XwemTlkDjLGBEO1hPgJ1Iu/Nearbor?node-id=40005463-60038) — context only; unresolved feedback.
- [Community Expansion section](https://www.figma.com/design/XwemTlkDjLGBEO1hPgJ1Iu/Nearbor?node-id=40005521-177516) — ongoing concepts on v3.0.
- [Nearbor team-space file](https://www.figma.com/design/mSBoAPUVmrFpoMgz65dPOL/Nearbor-team-space) — historical/context link only. Not opened or used as visual evidence.

### Context sources and exclusions

- User-provided `NEARBOR – UX/UI CASE STUDY NOTES`, sourced from Slack as of 25 October 2026, plus the user's direct statement about role and audience.
- [Nearbor Linear project](https://linear.app/hotshots-labs/project/nearbor-a2eca7a9a404), its V2 scope document, and the feature tasks above. Nearbor V2 was found as a scope document within Nearbor; project search also returned Nearbor MVP, not a separate project named Nearbor V2.
- The general project description still names the previous designer. The user's direct account and current design-task assignments support the role stated in this case; do not overwrite the user's role with the older project metadata.
- No staging/admin systems, source repositories, credentials, client contact details, or private team messages are included in the deliverable. No app release or live behaviour was tested. Linear was read only.
- Linear's shared agent-context tool returned unavailable. Project, document and issue tools worked and supplied the research used here.

### Package

`nearbor-images.zip`: source PNG previews, full-length partners, two close-up details, contact sheets, a source manifest, v3.0 screen/section inventory, and README. Use the 33 selected screens as a reusable source set, not 33 separate case chapters. The Markdown is a handoff specification; it does not implement or publish the portfolio page.

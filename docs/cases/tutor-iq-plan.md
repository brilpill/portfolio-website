# Tutor IQ case study plan

Status: proposed structure for review, not the finished case study. Prepared 25 October 2026.

## Positioning

A flagship case about designing the connected experience of finding, delivering, and managing tutoring. The platform carries the main story; the website explains how people discover and understand the service. Discovery and the design system demonstrate how the experience was organized and made consistent.

Confirmed role: sole designer across discovery, platform, website, and design system, collaborating with the PM and client. Do not imply solo product development. Timeline, launch status, research methods, and measured results remain unconfirmed.

Working headline: Designing the journey from finding a tutor to making progress.

Suggested balance: approximately 65% platform, 20% website, 15% discovery and design system. These are editorial proportions, not rigid limits. Target about 18 chapters, with readable screen sequences and short explanations. Final image count follows coverage, not a quota; an initial budget of 80–120 distinct screens and supporting details is reasonable for review.

## Case overview

Three media blocks:

1. Platform: browser tabs showing Parent, Student, and Tutor home screens. Choose strong populated states and explain the different priorities of each role.
2. Core experience: a short manually controlled sequence showing tutor discovery, booking, and a useful classroom/whiteboard state. Avoid an empty camera-off classroom as the hero.
3. Website: desktop/mobile presentation of the homepage, opening to the complete landing page. Preserve its full length, rather than supplying only a cover crop.

Overview copy describes the product and the sole-designer scope. No unverified success metrics. The full case begins with the product and its users.

## Case study sequence

| Chapter | Story and evidence | Proposed presentation |
| --- | --- | --- |
| 1. One product, connected roles | Introduce Parent, Student, Tutor, and Admin; explain how their actions connect. | Product hero plus a small audience/role map. Role needs are a synthesis of the designs, not invented interview findings. |
| 2. Organizing the experience | Discovery IA and website sitemap; distinguish explored scope from final UI. | Simplified role-based map with drill-down into readable source excerpts. |
| 3. From structure to interface | Website wireframes compared with corresponding final sections. | Two or three aligned wireframe-to-final comparisons after checking equivalent content. No fabricated platform wireframes. |
| 4. A website that explains the service | Complete homepage, its learning journey, audience messaging, and platform demonstrations. | Full landing-page viewer plus selected closeups; desktop/mobile comparison. |
| 5. Helping visitors choose a path | For Parents, For Tutors, How It Works, Solutions, Cost, matching quiz, resources and editorial pages. | Group pages by visitor intent; prioritize audience pages and quiz. Keep secondary/legal pages available without giving every page a chapter. |
| 6. Getting each role started | Role selection and authentication; parent/child setup, student goals/preferences, tutor subjects, availability, pricing and verification. | Role tabs with short purposeful onboarding sequences; show validation and recovery where informative. |
| 7. Finding the right tutor | Search, filters, tutor profiles, comparison, and AI-search states present in the design. | Large search view, profile detail, and comparison sequence. Explain designed AI assistance without claiming matching accuracy. |
| 8. Booking and managing time | Trial/regular booking, child selection, subject, date/time, calendar, tutor acceptance, rescheduling and availability. | Cross-role booking sequence showing the parent action and tutor response; calendar closeups. |
| 9. Teaching inside the classroom | Waiting room, device preparation, lesson controls, chat, screen sharing, whiteboard and material sharing. | One major classroom view followed by focused tool states. Optional bounded whiteboard demo. |
| 10. Continuing after the lesson | Lesson details, summaries, transcripts, key moments, recordings and attached homework. | Connected summary tabs with readable closeups. AI summary is a designed feature, not verified deployed performance. |
| 11. Closing the homework loop | Tutor assigns, student completes/submits, tutor reviews, student sees feedback. Text, reading and whiteboard tasks. | Synchronized role sequence for one task, with other task formats in supporting tabs. |
| 12. Making progress visible | Parent and student progress, subjects, goals, homework, badges and streaks. | Paired views of the same learning story; optional goal/streak interaction. No claims that badges improved retention. |
| 13. Keeping learning resources usable | Tutor and student libraries, upload, material types, sharing, search/filtering and Academy. | Library workflow plus a compact Academy sequence. Include meaningful empty/upload-error states. |
| 14. Keeping people connected | Parent/tutor/student messaging, contextual questions, folders, attachments, notifications and tutor auto-response settings. | Show messages in the context of a lesson or homework; avoid repetitive chat screenshots. |
| 15. Managing the tutoring business | Tutor student management, notes/goals, profile, services/pricing, reviews, parent payments and tutor payouts. | Separate operational and financial sequences, with invoice/detail views where useful. Figures visible in mockups are sample data. |
| 16. Supporting trust and exceptions | Tutor verification, student safeguarding, disputes/refunds and admin operations: users, bookings, payments, analytics, CMS and permissions. | Clear subgroups: verification/safeguarding; resolving an issue; operational overview. Show designed flows without claiming regulatory compliance. |
| 17. Adapting the product to mobile | Selected mobile adaptations already present in role pages. | Responsive pairs for high-value journeys; explain navigation and density changes. Also place mobile examples alongside relevant earlier chapters. |
| 18. A system behind the product | Product-specific calendar, homework cards, classroom toolbar, materials, messages and foundations. | A few proposed live components with Figma references and behavior specifications; close with confirmed design scope and learning, not invented launch metrics. |

Keep a navigable chapter index. Within chapters, show full screens for context and closeups for decisions; do not shrink a whole flow into an unreadable collage. A chapter may contain several media blocks, but prose should explain a concrete user problem and design response.

## Proposed additions to the portfolio presentation

These are showcase features to specify in the final Markdown for the implementation bot. They are not claims that Tutor IQ itself contains these portfolio interactions, and none is implemented in this planning turn.

1. **Role and journey explorer.** Switch Parent / Student / Tutor / Admin to highlight relevant responsibilities and links between actions. Use a concise editorial map grounded in Figma; provide a static accessible fallback.
2. **Readable IA and sitemap explorer.** Start with a simplified overview; expand one branch at a time, link to source board regions, and offer zoom/pan. The raw discovery board contains 755 top-level items, so a single fit-to-card screenshot will not explain it well. A static diagram plus detailed excerpts is the fallback.
3. **Full-page website viewer.** Use the existing full-image viewer where sufficient. If necessary, extend it with desktop/mobile switching, fit-width, and section jump links. Retain the whole homepage export and readable section images; do not force visitors to read a miniature tall image.
4. **Cross-role flow player.** For booking and homework, keep a shared stage label while switching between relevant user views. Manual next/back, keyboard access, no forced autoplay. Static ordered browser tabs are the fallback.
5. **Annotated detail viewer.** A full product screen with optional numbered closeups for filters, comparison, whiteboard tools, and progress. Clearly distinguish annotations from source UI.
6. **Focused interactive components.** Best candidates: homework status card, calendar event/availability control, classroom toolbar, and goal/streak card. Match actual source variants. Use local sample data and label demonstrations; do not simulate real booking, payments, video calls or live AI services.

The template is a reference for available patterns. Reuse browser tabs, responsive blocks, comparisons, image/full-image viewers and component specifications where they fit; introduce a new pattern only when it makes this project easier to understand.

## Evidence reviewed and limits

- Inventoried all page names in the platform, website, and design-system files.
- Inspected top-level groups and bounded child listings in all five platform UI areas: Auth, Tutor, Parent, Student and Admin. This is a structural planning audit, not a visual review of every screen.
- Inspected website UI groups and wireframe grouping. Website includes Homepage, Menu, Solutions, For Parents, For Tutors, Cost, Resources, Quiz, Article/Guide, Legal, Blog/Academy, About Us and How It Works.
- Inspected the sitemap structure and a bounded sample of the discovery IA, including its overall node count. The complete discovery content has not yet been reviewed.
- Visually inspected tutor home, tutor search, a student classroom default state, and the complete homepage at reduced scale. The classroom sample is a camera-off state; choose a richer supported state for the final hero.
- Inspected product-specific design-system pages Calendar, Classroom, Cards and Messages. The library also includes generic foundations and supplied block collections; do not describe every base primitive as newly invented for this project.
- The four Word document paths supplied by the user were not readable because the files were absent at those paths. No matching copies were found in the checked Downloads, attachments and Telegram locations. Documents have not been read; incorporate them when accessible and revise any conflicting assumptions.
- The Notion URL could not be opened by the web tool. Plugin discovery found Notion available but not installed. Parent-page and nested-page access are unverified; connecting Notion requires checking the permissions of those pages.

## After plan approval

1. Incorporate the brief, PRD, platform documentation and Notion steps if access becomes available; keep extracted requirements separate from portfolio-writing instructions.
2. Complete the screen inventory, identify current/final alternatives, and map each major feature to a chapter. Read discovery-board details before writing the UX rationale.
3. Review chosen screens visually, including mobile states, realistic classroom states, verification and exception flows. Check each proposed comparison is valid.
4. Export original screens, full-length website pages and intentional detail crops; preserve source IDs and all supplied links in an internal registry.
5. Write tutor-iq.md with overview, full case, captions/alt guidance, evidence boundaries and specifications for new showcase components.
6. Deliver tutor-iq-images.zip with source manifest and contact sheets. Verify every Markdown image reference and inspect final compositions. No production site or Figma edits are implied.

## Source links

Preserve these for future agents; do not automatically publish private source links on the portfolio.

- Website: https://www.figma.com/design/Oe36FGjwvRBQGeG0rRlL7C/Tutor-IQ-%C2%B7-Website?node-id=0-1&p=f&t=9MCFcpUbgQeXPaEf-11
- Platform: https://www.figma.com/design/99r4yXzgclN9hB6rmhHkGw/Tutor-IQ-%C2%B7-Platform?node-id=0-1&p=f&t=iIzBspud6i86Z96x-11
- Design system: https://www.figma.com/design/5Hop6zexo63fTnqVvHwh7t/Tutor-IQ-%C2%B7-Design-System?m=auto&t=DaM1tP5J40e28qkA-6
- Website sitemap: https://www.figma.com/board/4WdHJGJ5IoEJuQ12AWEzmo/Tutor-IQ-%C2%B7-Website-%C2%B7-Sitemap?t=DaM1tP5J40e28qkA-6
- IA and discovery: https://www.figma.com/board/SVsVmGNN4GFM5Fa507xOmu/Tutor-IQ---IA---Discovery?t=DaM1tP5J40e28qkA-6
- Notion: https://app.notion.com/p/2b0d7ed65f84809b8c2ac4f20eb6107d?v=2b0d7ed65f848142a5de000c2d7f9c85

Document references awaiting access:

- C:/Users/brilo/Downloads/Copy of TutorIQ_Website_Brief.docx
- C:/Users/brilo/Downloads/Internal of TutorIQ_Website_PRD.docx
- C:/Users/brilo/Downloads/Tutor IQ Documentation.docx
- C:/Users/brilo/Downloads/Tutor IQ Documentation (1).docx

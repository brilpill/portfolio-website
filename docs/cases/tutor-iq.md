# Tutor IQ

> **As built, 25 Oct 2026.** Built from this MD (`src/content/project-slides.ts`, `src/content/case-studies.ts`, `src/content/tutor-iq-media.ts`, images in `public/cases/tutor-iq/`). It replaces the earlier "tutoriq" placeholder slide; the sidebar item is now "Tutor IQ" (GraduationCap). Timeline shows a dash.
>
> **Deviations:**
>
> - **Intro highlight:** it marks "parents, students, tutors and administrators", because highlights must be a phrase of the intro.
> - **Roles chapter:** it has no figure, since the hero already shows the four homes.
> - **Wireframes:** they sit side by side with the finished pages (a `pair`), not under a slider, because their layouts differ.
> - **Mobile layouts:** they use `responsive` blocks (website pages, then the calendar, classroom, whiteboard and messages), not `images`.
> - **Website pages:** they go in bare frames, since they draw their own browser bar.
> - **Platform screens:** they use a 1512 / 982 frame, so the 1100-high previews lose a strip at the bottom; full lengths open in the viewer.
> - **IA board:** its preview is a crop of the top of the board; the whole board opens in the viewer.
> - **Copy trims:** "these boards contain more detail…" and similar sentences were reworded into public copy; their implementation advice stays below.
> - **Live components (built 25 Oct):** the four from section 4 are in the System chapter, replacing its screens block. They are `tutor-iq/homework-card` and `tutor-iq/progress-card` in a grid, then `tutor-iq/calendar` and `tutor-iq/classroom-toolbar`, all in `src/cases/tutor-iq/demos/kit.tsx`. They use local sample data only. The calendar's availability control follows the tutor availability screen (weekly switches) and the booking-link component, since the system board holds event components rather than an availability control.
> - **Not built yet:** the suggested new patterns (role explorer, IA/sitemap explorer, cross-role player, fit-width viewer with jump links). They are kept in section 4.

## 1. Basics

Slug: tutor-iq
Title: Tutor IQ
Group: Web
Placement: featured
Format: Learning Platform and Website
Icon: GraduationCap

## 2. Case overview

Headline: Designing the journey from finding a tutor to making progress.
Overview: Tutor IQ connects families, students and tutors across discovery, booking, live lessons, homework and progress. I was the sole designer for the platform, website, discovery work and design system, collaborating with the PM and client. The product also includes an admin panel for the operational work that keeps this multi-role experience running.
My role: Product Design / UX / UI / Website Design / Design System
Industry: Education / Tutoring
Case study: yes

Media:
1. browser · tabs — parent-home.png "Parent home" (long: parent-home-full.png), student-home.png "Student home", tutor-home.png "Tutor home" (long: tutor-home-full.png), admin-dashboard.png "Admin dashboard" (long: admin-dashboard-full.png)
   caption: Four roles, each with a distinct view of the same learning journey.
2. browser · tabs — tutor-search.png "Find a tutor" (long: tutor-search-full.png), booking-time.png "Choose date and time", classroom-active.png "Live classroom design", homework-feedback.png "Student sees feedback"
   caption: Find, book, learn and respond to feedback.
3. image · full — website-home.png "Homepage" (long: website-home-full.png)
   caption: The complete website homepage introduces the service and leads visitors into the platform.

## 3. Case study

Title: One tutoring journey, designed for everyone involved.
Intro: Tutor IQ is a connected tutoring platform for parents, students, tutors and administrators. A parent needs to find a suitable tutor and manage bookings; a student needs to prepare, learn and see progress; a tutor needs to plan, teach and follow through. Administrators verify tutors and handle the operational exceptions behind that journey. I designed the platform and its design system alongside the website and discovery structure, working with the PM and client. This case follows the user journey first, then shows the system and operations that support it.
Intro highlight: Four roles, one connected experience.
Hero: browser · tabs — parent-home.png "Parent home" (long: parent-home-full.png), student-home.png "Student home", tutor-home.png "Tutor home" (long: tutor-home-full.png), admin-dashboard.png "Admin dashboard" (long: admin-dashboard-full.png)

Chapter — Roles · Different work, one connected product
Text: The same lesson appears differently depending on who is looking. Parent and student homes foreground upcoming lessons and progress; the tutor home makes teaching, homework and booking actions visible; the admin dashboard surfaces system activity. This role structure provides the map for the case. The numbers and names in these design screens are sample content, not measured usage.
Figures: browser · tabs — parent-home.png "Parent home" (long: parent-home-full.png), student-home.png "Student home", tutor-home.png "Tutor home" (long: tutor-home-full.png), admin-dashboard.png "Admin dashboard" (long: admin-dashboard-full.png)

Chapter — Structure · Map the journeys before showing the screens
Text: Discovery explored parent, student, tutor, shared and admin responsibilities. The website sitemap organized the public entry points. These boards contain more detail than a reader can absorb in one image, so the portfolio should first show a simplified editorial role map, then let people open the original boards at readable scale. The discovery board includes conditional and future ideas; the finished UI below is the evidence for what reached design.
Figures: image · full — ia-source.png "Platform information architecture source" (long: ia-source-full.png), sitemap-source.png "Website sitemap source" (long: sitemap-source-full.png)

Chapter — Website UX · From wireframes to a useful public path
Text: The wireframes defined the homepage and audience routes before the final visual design. Pair equivalent sections to show the move from content hierarchy to finished pages. This is a comparison of design stages, not a claim that an earlier live site was redesigned.

Figures: compare · wireframe-home.png → website-home.png (use aligned excerpts; both full images open in viewer)
Figures: compare · wireframe-parents.png → website-parents.png (aligned excerpts)
Figures: compare · wireframe-cost.png → website-cost.png (aligned excerpts)

Chapter — Website · Explain the value before asking people to sign up
Text: The full homepage moves from an invitation to find a tutor through matching, lessons, progress, benefits, learning resources and common questions. Its length matters to the narrative: show a strong opening and allow the whole page to be read, with chapter jumps or a fit-width viewer. The platform illustrations on the page connect marketing promises to product screens.
Figures: image · full — website-home.png "Homepage" (long: website-home-full.png)
Figures: images — website-home-mobile.png "Homepage on mobile" (long: website-home-mobile-full.png), website-parents-mobile.png "Parents page on mobile" (long: website-parents-mobile-full.png), website-tutors-mobile.png "Tutors page on mobile" (long: website-tutors-mobile-full.png)

Chapter — Audience paths · Give parents and tutors relevant answers
Text: The public site provides dedicated pages for parents and tutors, a How It Works explanation, Solutions, pricing, resources and editorial content. The quiz turns broad interest into a more specific learning need. Keep each question readable and show the choices as designed; do not present the quiz as an evaluated matching algorithm.
Figures: images — website-parents.png "For parents" (long: website-parents-full.png), website-tutors.png "For tutors" (long: website-tutors-full.png), website-how-it-works.png "How it works" (long: website-how-it-works-full.png), website-solutions.png "Solutions" (long: website-solutions-full.png), website-cost.png "Cost" (long: website-cost-full.png)
Figures: images — website-quiz-start.png "Matching quiz", website-quiz-subject.png "Subject selection", website-quiz-preferences.png "Learning preferences", website-quiz-mobile.png "Matching quiz on mobile" (long: website-quiz-mobile-full.png)
Figures: images — website-resources.png "Resources" (long: website-resources-full.png), website-academy.png "Blog and Academy" (long: website-academy-full.png), website-about.png "About us" (long: website-about-full.png)

Chapter — Entry · Start differently for each role
Text: Sign-up asks which role someone is taking, then branches into a setup that makes sense for them. Parents add child information and teaching preferences, students set goals and learning preferences, and tutors describe subjects, rates and availability before verification. The recovery state shows that entry was designed beyond the ideal path.
Figures: browser · tabs — auth-role.png "Choose your role", auth-otp.png "Verify your email", auth-recovery.png "Recover access"
Figures: browser · tabs — parent-child-setup.png "Child information", parent-learning-preferences.png "Teaching preferences", parent-permissions.png "Permissions", parent-recommendations.png "Tutor recommendations"
Figures: browser · tabs — student-avatar.png "Choose an avatar", student-goals-setup.png "Learning goals", student-preferences.png "Preferences"
Figures: browser · tabs — tutor-subjects.png "Subjects and languages", tutor-rates.png "Rates and pricing", tutor-availability-setup.png "Availability", tutor-verification.png "Submit verification", tutor-verification-pending.png "Verification pending"

Chapter — Find · Make tutor choice understandable
Text: Parent search exposes subject, time, price and special-preference filters. A profile provides the deeper context; comparison lets a parent consider candidates on the same dimensions before booking. The file also includes an AI-assisted search state, shown here as a designed interface rather than a claim about search quality. A no-results state gives a route back to adjusting criteria.
Figures: browser · tabs — tutor-search.png "Find a tutor" (long: tutor-search-full.png), tutor-search-preferences.png "Special preferences", tutor-search-ai.png "AI-assisted search state", tutor-no-results.png "No results"
Figures: browser · tabs — tutor-profile.png "Tutor profile" (long: tutor-profile-full.png), tutor-compare.png "Compare tutors" (long: tutor-compare-full.png)
Figures: images — detail-tutor-comparison.png "Tutor comparison detail"

Chapter — Book · Carry a decision through both sides
Text: Booking needs to connect a child, tutor, subject, date, time and payment choice without losing context. The parent flow covers a trial and a recurring schedule; the tutor then sees a request to review and accept. Calendar and rescheduling screens extend that decision into ongoing coordination. The UI shows designed payment and protection copy, not a verified operational guarantee.
Figures: browser · tabs — booking-child.png "Select a child", booking-time.png "Choose date and time", booking-recurring.png "Recurring schedule", booking-confirm.png "Confirm booking"
Figures: browser · tabs — tutor-accept-booking.png "Tutor reviews booking", tutor-booking-accepted.png "Booking accepted", tutor-calendar.png "Tutor calendar", tutor-availability.png "Availability settings", parent-reschedule.png "Reschedule lesson"
Figures: images — detail-booking-time.png "Time selection detail"

Chapter — Classroom · Put the lesson tools in reach
Text: The waiting room gives people time to prepare. During a lesson, video, chat, materials and a shared whiteboard sit within the same classroom. The finished whiteboard state shows how the drawing tools and attached material support explanation; the end state hands the tutor toward feedback and homework. Show the active classroom as the primary view, with the tool details close enough to read.
Figures: browser · tabs — classroom-waiting.png "Prepare for the lesson", classroom-active.png "Live classroom design", classroom-whiteboard.png "Shared whiteboard", classroom-materials.png "Lesson materials", classroom-chat.png "Classroom chat", classroom-complete.png "Complete the lesson"
Figures: images — detail-whiteboard.png "Whiteboard detail", classroom-drawing.png "Drawing tools"

Chapter — Review · Make the lesson useful after the call
Text: The lesson summary is a place to return for feedback, assigned work and attached materials. Recording, transcript and key-moment views let a family review the session from different angles. These screens include an AI-summary design; describe its place in the experience without claiming transcription accuracy or learning outcomes.
Figures: browser · tabs — lesson-summary.png "Parent lesson summary", lesson-transcript.png "Recording and transcript", lesson-moments.png "Key moments", student-lesson-summary.png "Student lesson summary"

Chapter — Homework · Close the loop across tutor and student
Text: The tutor can choose a task type, prepare instructions and materials, and reuse a preset. The student sees the task, submits work, and receives feedback after review. Text, reading and whiteboard submissions show that the workflow supports different kinds of learning, while the same status language carries the task across roles.
Figures: browser · tabs — homework-assign.png "Assign homework", homework-text-create.png "Prepare a text task", homework-presets.png "Homework presets"
Figures: browser · tabs — homework-list.png "Student homework" (long: homework-list-full.png), homework-submit.png "Submit a text task", homework-review.png "Tutor feedback", homework-feedback.png "Student sees feedback"
Figures: browser · tabs — homework-reading.png "Reading task", homework-whiteboard.png "Whiteboard submission"
Figures: images — detail-homework-list.png "Homework list detail", detail-homework-feedback.png "Tutor feedback detail"

Chapter — Progress · Show what the work adds up to
Text: Student and parent progress views answer related but different questions: what has the student done, and what should the family understand or act on? Subject views, goals, badges and streaks give the work a visible history. These are designed feedback signals; the case does not claim they improved motivation or retention.
Figures: browser · tabs — student-progress.png "Student progress", parent-progress.png "Parent progress", parent-goals.png "Learning goals", student-subject-progress.png "Subject progress", student-streak.png "Learning streak", student-badges.png "Badges"

Chapter — Library · Keep material available between lessons
Text: The tutor library organizes uploaded resources and supports sharing into teaching or homework. The student library provides a place to revisit material, while Academy offers a separate guided content path. Include the upload alert to show how the flow handles a blocked file, without making a claim about the production security stack.
Figures: browser · tabs — tutor-library.png "Tutor library" (long: tutor-library-full.png), library-upload.png "Upload material", library-upload-alert.png "Upload safety state", student-library.png "Student library"
Figures: browser · tabs — academy-home.png "Student Academy", academy-lesson.png "Academy lesson"

Chapter — Messages · Keep questions close to their context
Text: Messaging supports conversations with tutors, child-based organization for a parent, and questions about homework for a student. Notifications bring time-sensitive work back into view; tutor auto-response settings support expectations around availability. Show the relevant message or question alongside its related lesson or task instead of treating chat as a disconnected feature.
Figures: browser · tabs — tutor-messages.png "Tutor messages", parent-messages.png "Organize conversations by child", student-question.png "Ask about homework", tutor-auto-response.png "Auto-response settings" (long: tutor-auto-response-full.png), student-notifications.png "Student notifications"

Chapter — Tutor work · Give tutors tools beyond the live lesson
Text: A tutor manages students, goals, reusable materials, profile services, reviews and payouts. These screens make the teaching practice visible as ongoing work: preparation before a lesson, follow-up afterward, and the business details around both. Parent payment and invoice views show the other side of the same transaction, with example amounts retained from the design.
Figures: browser · tabs — tutor-students.png "Student management", tutor-student-goals.png "Student goals", tutor-services.png "Services and pricing", tutor-reviews.png "Reviews and badges" (long: tutor-reviews-full.png)
Figures: browser · tabs — tutor-payouts.png "Payouts" (long: tutor-payouts-full.png), parent-payments.png "Parent payments" (long: parent-payments-full.png), parent-invoice.png "Invoice"

Chapter — Trust · Give difficult situations a clear route
Text: The platform includes tutor verification and student safeguarding entry points, plus dispute states seen by both a parent and tutor. These flows require clear status, context and consequences; the admin view shows where an issue can be reviewed. The designs demonstrate intended handling paths, without claiming legal compliance or operational outcomes.
Figures: browser · tabs — tutor-verification.png "Submit verification", tutor-verification-pending.png "Verification pending", student-safeguarding.png "Safeguarding entry", student-safeguarding-confirm.png "Report confirmation"
Figures: browser · tabs — parent-dispute.png "Parent dispute", tutor-dispute.png "Tutor dispute", admin-dispute.png "Admin dispute handling"

Chapter — Admin · Give the operations team its own workspace
Text: The admin panel is a fourth role with its own priorities. A dashboard and analytics show activity; user and tutor management support account review; the verification queue brings evidence and decisions together. Bookings, disputes, safeguarding, payments and refunds provide routes for exceptions. CMS and staff permissions show how content and access are maintained. This deserves a complete chapter, not a small appendix to the learner journey.
Figures: browser · tabs — admin-dashboard.png "Admin dashboard" (long: admin-dashboard-full.png), admin-users.png "User management", admin-tutors.png "Tutor management", admin-verification.png "Verification queue", admin-verification-detail.png "Review personal information", admin-verification-reject.png "Reject with feedback"
Figures: browser · tabs — admin-bookings.png "Bookings", admin-booking-detail.png "Booking details", admin-dispute.png "Admin dispute handling", admin-safeguarding.png "Safeguarding details" (long: admin-safeguarding-full.png)
Figures: browser · tabs — admin-payments.png "Payments", admin-refund.png "Issue refund", admin-analytics.png "User analytics" (long: admin-analytics-full.png), admin-cms.png "Website content", admin-permissions.png "Roles and permissions" (long: admin-permissions-full.png), admin-team.png "Team management"

Chapter — Responsive · Adapt the work to smaller screens
Text: The files include mobile versions of key platform and website screens. The value is in how priorities and controls are reorganized, not in shrinking the desktop image. Pair a tutor calendar, live classroom, whiteboard and messaging with their mobile counterparts; pair full website pages with their mobile layouts. Inspect and label each actual mobile frame before implementation.
Figures: images — tutor-calendar.png "Tutor calendar", mobile-calendar.png "Tutor calendar on mobile", classroom-active.png "Live classroom design", mobile-classroom.png "Classroom on mobile", classroom-whiteboard.png "Shared whiteboard", mobile-whiteboard.png "Whiteboard on mobile", tutor-messages.png "Tutor messages", mobile-messages.png "Messages on mobile"
Figures: images — website-home-mobile.png "Homepage on mobile" (long: website-home-mobile-full.png), website-parents-mobile.png "Parents page on mobile" (long: website-parents-mobile-full.png), website-tutors-mobile.png "Tutors page on mobile" (long: website-tutors-mobile-full.png)

Chapter — System · Make a large product feel related across roles
Text: The design system includes general foundations and product-specific parts. Show a focused set that explains these journeys: calendar states, homework cards, classroom controls, material cards and messages. The parts matter because they keep role-specific screens coherent while supporting different states. Rebuild only a few meaningful interactions as live portfolio demos; the source library remains the authority for variants and tokens.
Figures: images — tutor-calendar.png "Tutor calendar", homework-list.png "Student homework" (long: homework-list-full.png), classroom-whiteboard.png "Shared whiteboard", tutor-library.png "Tutor library" (long: tutor-library-full.png), parent-messages.png "Organize conversations by child"

Closing: Tutor IQ required the public story, the learning journey and the operational tools to work as parts of one product. The case shows the breadth of those designed experiences and the detail of their handoffs. Launch coverage, adoption and measured outcomes need separate confirmation.

---

## 4. Internal handoff — do not render on the public page

### Attribution and evidence

- The user confirmed: sole designer of discovery, platform, website and design system; collaborated with the PM and client. Do not credit the user as sole developer or invent team names.
- The four supplied DOCX paths were absent when checked. None of their content has been read or used. Incorporate them if the files become available, resolving any conflict with this draft.
- The supplied Notion page was not accessible and its nested steps were not checked. Do not imply the Notion workflow was researched.
- Discovery IA includes conditional/future nodes (for example “Quiz AI (Phase 2)”, “Referral program (if available)”, and “Subscription / Plans (if applicable)”). Treat them as exploration, not current product scope. Screens in the UI pages are design evidence, not proof of launch.
- Dates, example names, profile photos, tutor ratings, amounts, dashboard counts, review content, testimonials, and website percentages in the Figma screens are sample design content. No measured product outcome or actual customer quote is evidenced.
- If production release, research method, conversion, learning outcome or accessibility claims are needed, obtain specific evidence first. The design alone does not establish them.

### Media decisions

- Use large, upright platform screenshots with readable details. Never tile a full workflow into a tiny collage. Tabs can group 2–6 related states; place longer journeys in two adjacent blocks.
- Desktop platform images are 1512 × 982 in most selected frames. Long search and profile images carry `-full.png` partners. Display a top preview and allow fit-width, scroll and zoom in the viewer. Do not crop away a decision-making part of a modal.
- The website frames already have a browser bar in the source. Present as images or full images without adding another Safari mockup. The complete homepage export is essential. Mobile full pages should likewise open at readable width.
- Website wireframes are from the Launch section, paired with corresponding final UI pages. The comparisons show design stages, not old live versus new live. Verify equivalent sections when setting a slider; if alignment differs, place the two full images side by side with captions.
- This draft includes source-board images so a viewer can inspect original discovery; a simplified editorial diagram should be built for first understanding. Keep raw boards zoomable, and identify proposed scope separately from completed UI.
- Use original Figma exports. Native crops are listed in manifest.json with their parent frame and coordinates; label them as details. No generative images are needed.

### Suggested new portfolio patterns

New pattern: role and journey explorer
  Source: platform IA board and four role homes. Let visitors select Parent, Student, Tutor or Admin. Highlight the role’s goals and how an action passes to another role. Supply a static four-column map for accessibility and reduced-motion users. This is an editorial map, not an app screen.
New pattern: expandable IA and sitemap viewer
  Source: both user-supplied boards. Start with a simplified node list, then expand one branch at a time. Open original board exports with pan/zoom. Label conditional and future nodes. Static excerpt images are a fallback.
New pattern: synchronized cross-role sequence
  Source: Booking, Homework and Trust figures above. Each step states whose view is shown and what changes for the next role. Manual previous/next, keyboard support and an ordered static fallback. Do not simulate an actual transaction or AI response.
New pattern: full landing page viewer
  Source: website-home.png and website-home-full.png. Keep a short opening preview in the chapter, then a fit-width full page with section jump links. Provide desktop/mobile switching where layouts correspond. If the existing `image · full` pattern supports this legibly, reuse it.
New component: homework status card
  Source: https://www.figma.com/design/5Hop6zexo63fTnqVvHwh7t/Tutor-IQ-%C2%B7-Design-System?node-id=8175-17630
  Frame: stage. Show the source status variants To-do, Submitted, Waiting for Feedback, Feedback, Overdue and Cancelled. Clicking changes only local demo state; no user data or real homework action.
New component: calendar event and availability
  Source: https://www.figma.com/design/5Hop6zexo63fTnqVvHwh7t/Tutor-IQ-%C2%B7-Design-System?node-id=8503-6476
  Frame: stage. Show a bounded event selection and availability control with source states. Local demonstration only; keyboard and reduced-motion support.
New component: classroom toolbar
  Source: https://www.figma.com/design/5Hop6zexo63fTnqVvHwh7t/Tutor-IQ-%C2%B7-Design-System?node-id=8731-1555
  Frame: stage. Demonstrate toolbar selection, chat/material panel, and whiteboard tool states against a small illustrative classroom. No real video call, microphone, recording or upload.
New component: progress card
  Source: https://www.figma.com/design/5Hop6zexo63fTnqVvHwh7t/Tutor-IQ-%C2%B7-Design-System?node-id=8220-11589
  Frame: stage. Switch Lesson/Homework source states to show how a subject summary adapts. Sample values remain clearly demo data.

### Source registry

- Platform UI: https://www.figma.com/design/99r4yXzgclN9hB6rmhHkGw/Tutor-IQ-%C2%B7-Platform?node-id=0-1&p=f&t=iIzBspud6i86Z96x-11
- Website: https://www.figma.com/design/Oe36FGjwvRBQGeG0rRlL7C/Tutor-IQ-%C2%B7-Website?node-id=0-1&p=f&t=9MCFcpUbgQeXPaEf-11
- Design system: https://www.figma.com/design/5Hop6zexo63fTnqVvHwh7t/Tutor-IQ-%C2%B7-Design-System?m=auto&t=DaM1tP5J40e28qkA-6
- Website sitemap: https://www.figma.com/board/4WdHJGJ5IoEJuQ12AWEzmo/Tutor-IQ-%C2%B7-Website-%C2%B7-Sitemap?t=DaM1tP5J40e28qkA-6
- Platform discovery: https://www.figma.com/board/SVsVmGNN4GFM5Fa507xOmu/Tutor-IQ---IA---Discovery?t=DaM1tP5J40e28qkA-6
- Notion (unread): https://app.notion.com/p/2b0d7ed65f84809b8c2ac4f20eb6107d?v=2b0d7ed65f848142a5de000c2d7f9c85
- Exact exported frame URLs, source dimensions, full partners and native crops are in manifest.json. Pending frame URLs, if any, are in pending-exports.json.

### Documentation status

Four user-supplied Word files were referenced, but not found at their supplied Downloads paths. Their instructions were not followed as user requests. Before publishing any claims that depend on the brief or PRD, read them if they become available and revise the case accordingly.

## 5. Export status

123 of 123 selected source images are packaged. `pending-exports.json` is empty. The four Word documents and Notion remain unread and should be checked if they become available before publication.

import type { ProjectSlideMedia } from "./project-slides";
import { AF_RATIO, af, as } from "./askflow-media";
import { lumin, luminAdmin } from "./luminasset-media";
import { qb, qbAppStore } from "./quantum-body-media";
import { snooze } from "./snoozeband-media";
import { nb } from "./nearbor-media";
import { SH_RATIO, sh } from "./smarthost-media";
import { SG_RATIO, sg } from "./sellergenius-media";
import { TQ_RATIO, tq } from "./tutor-iq-media";
import { ph } from "./peach-health-media";
import { dd } from "./dangdi-media";

/**
 * Full case study pages at /cases/[slug], laid out after the Figma case study frame (1001:1859):
 * a header, one large figure, then chapters of short copy each followed by its figures.
 *
 * - chapter: a label, a short title and a paragraph, then any figures. Two `pair` figures sit side by side,
 *   each with its own label, title and line of copy above it, or none when the chapter text covers both.
 * - `strong` in a paragraph is a phrase to emphasise; it must appear verbatim in `body`.
 * - `numbers`: an optional row of 2–4 big figures with short labels, under the chapter's copy.
 */
export type CaseStudyFigure = ProjectSlideMedia;
/** A pair item's copy is optional: leave it out when the chapter's text already covers both frames. */
export type CaseStudyPairItem = { label?: string; title?: string; body?: string; media: CaseStudyFigure };
export type CaseStudyChapter = {
  id: string;
  label: string;
  title: string;
  body: string;
  strong?: string;
  /** One phrase from `body` to point at: a soft highlight box draws in behind it, left to right, once in view. Use sparingly. */
  highlight?: { text: string };
  /** What I'd take from this chapter, one sentence; shown as its own quieter line under the text. */
  lesson?: string;
  numbers?: { value: string; label: string; from?: string }[];
  /** How the numbers row is laid out: row (default) or before-after (set `from` on each item). */
  numbersLayout?: "row" | "before-after";
  figures?: CaseStudyFigure[];
  pair?: [CaseStudyPairItem, CaseStudyPairItem];
};
export type CaseStudy = {
  slug: string;
  /** Left out while it's still to confirm; the chip then doesn't show. */
  year?: string;
  duration?: string;
  /** For an unlisted study with no project slide (the showcase): the name in its project chip. Back goes home. */
  name?: string;
  title: string;
  intro: string;
  /** One phrase from `intro` to highlight, like a chapter's `highlight`. */
  introHighlight?: { text: string };
  hero: CaseStudyFigure;
  chapters: CaseStudyChapter[];
  /** The case the "Next project" link at the foot points to. */
  next?: { slug: string; title: string; summary: string };
};

/** LuminAsset, from luminasset.md (23 Oct 2026). Each Lesson line ends its chapter's text. All screens are sample. */
export const caseStudies: CaseStudy[] = [
  {
    // From luminasset.md (24 Oct 2026). All screens are sample; the client's name is in no copy or alt text.
    slug: "luminasset",
    year: "2026",
    duration: "2 months",
    title: "A months-long install, one clear step at a time.",
    intro: "Going solar in the UK takes months. There's a site survey, sometimes a council review of 8–12 weeks, a grid application of another 8–12 weeks, a contract and payments in stages, and most of it happens out of the homeowner's sight. LuminAsset wanted one app that carries people through all of it, from the first estimate to the day the panels switch on. As UX lead at the agency HotShots Labs, I spent two months turning that process into a flow people can follow, along with the rules behind it in the admin panel.",
    introHighlight: { text: "one app that carries people through all of it" },
    hero: { kind: "device", frame: "row", screens: [lumin.start, lumin.estimateFetched, { ...lumin.trackerDirect, label: "Tracker" }] },
    chapters: [
      {
        id: "challenge", label: "Challenge", title: "A process built for installers, not homeowners",
        body: "The client tracked each install in twelve internal stages, and the people who live in the house saw none of them. They waited weeks with no news, paid without knowing why, and couldn't tell whether a quiet month meant progress or a problem. The job was to keep one promise from the estimate to the last payment: you always know where you are and what happens next.",
        strong: "you always know where you are and what happens next",
        numbers: [
          { value: "12 → 7", label: "Internal stages to customer stages" },
          { value: "3", label: "Ways to install" },
          { value: "8–12 wks", label: "Council or grid review" },
        ],
        figures: [{ kind: "device", screens: [lumin.howItWorks] }],
      },
      {
        id: "direction", label: "Direction", title: "Five directions before one screen",
        body: "Before any screens I collected five visual directions from apps people already trust with money, energy and home: Clear, Tech, Apple Style, Thin & Angled and Rounded. The chosen direction became a dark, map-first concept: the house from above, the numbers below.",
        // TODO (Oleh): which direction won, and why (one sentence).
        figures: [
          { kind: "component", demo: "luminasset/moodboard" },
        ],
      },
      {
        id: "wireframes", label: "Wireframes", title: "Every path first, then the pixels",
        body: "The wireframes covered every path before any visual design: estimate and fallback, sign-up, owner and tenant, three types of installation, multiple homes, help and actions. The client approved them as the single source of truth, and the final design changed how screens looked, not how they worked.",
        strong: "changed how screens looked, not how they worked",
        figures: [
          // The main screens of each Figma wireframe section, one tab each, without the flow lines.
          { kind: "component", demo: "luminasset/wireframes" },
          // The three wireframe-to-final pairs under one divider.
          { kind: "compare", frame: "row", before: lumin.wfEstimate, after: { ...lumin.estimateFetched, label: "Final" },
            more: [{ before: lumin.wfTracker, after: { ...lumin.trackerDirect, label: "Final" } }, { before: lumin.wfOwnership, after: { ...lumin.ownership, label: "Final" } }] },
        ],
      },
      {
        id: "estimate", label: "Estimate", title: "Your own roof, before any form",
        body: "A postcode is enough. The Google Solar API finds the house, and the app shows panels on the real aerial photo of the roof. When the API has no data for a home, the app doesn't stop: it asks a few roof questions and draws the system as blocks on a grid instead. Either way, one ruler sets the size in kW, and cost, output and CO₂ follow as it moves.",
        highlight: { text: "the app doesn't stop" },
        figures: [
          // The two estimates side by side as tabs, both live: with Solar API (aerial + sheet) and without (the grid).
          { kind: "component", demo: "luminasset/estimate" },
        ],
      },
      {
        id: "apply", label: "Apply", title: "An account only when it's worth it",
        body: "People sign up after they've seen their price, not before. One question decides the path: owners go straight to a short application, while tenants share their landlord's details and the team takes it from there. Then they pick how to pay for it.",
        figures: [{ kind: "device", frame: "row", screens: [lumin.register, lumin.otp, lumin.ownership, lumin.ownerForm, lumin.tenantForm, lumin.purchaseOption] }],
      },
      {
        id: "three-ways", label: "Three ways", title: "Three journeys, one tracker",
        body: "There are three ways to install. Direct purchase: you own the system and pay in stages. Free installation (PPA): nothing upfront, you buy the power at a lower rate. Tenant installation: the landlord agrees first. Each has its own steps, but the tracker always looks the same. Twelve internal stages became seven a homeowner can read, each Upcoming, In progress, Action needed or Done, and the names never change.",
        strong: "the tracker always looks the same",
        lesson: "A status screen is only as clear as the rules behind it, so I now start any long process by listing who changes each state, and when.",
        pair: [
          { label: "Direct", title: "Own it, pay in stages", body: "Nothing is due at order. A council fee only if the council is involved, a deposit when equipment is ordered, the balance at the end.", media: { kind: "device", screens: [lumin.directSummary] } },
          { label: "PPA", title: "Free install, cheaper power", body: "No upfront cost. The customer signs an agreement and pays for the power the panels make.", media: { kind: "device", screens: [lumin.ppaSummary] } },
        ],
        figures: [{ kind: "device", screens: [lumin.trackerDirect, { ...lumin.ppa, label: "PPA" }, { ...lumin.tenant, label: "Tenant" }, lumin.landlordAgreed] }],
      },
      {
        id: "steps", label: "Steps", title: "Every step says what it needs",
        body: "Each stage carries its own actions. A one-line tooltip explains why it takes so long. When the customer has to act, there's one button: pay the council fee from the bank app, upload a certificate. Edit, switch plan or cancel sit in one sheet, and cancelling shows the refund before anything is final.",
        highlight: { text: "there's one button" },
        lesson: "Rules like when an order can still change are business decisions, not screens; next time I'd agree them in writing with the client and developers before drawing the flow.",
        figures: [
          { kind: "component", demo: "luminasset/site-survey" },
          { kind: "device", frame: "row", screens: [lumin.tooltipStage, lumin.councilFeeStep, lumin.bank, lumin.review, { ...lumin.received, label: "Paid" }, lumin.live] },
          { kind: "device", screens: [lumin.actions, lumin.changeType, lumin.cancel] },
        ],
      },
      {
        id: "homes", label: "Homes", title: "More than one roof",
        body: "Some people go solar on more than one property. Any order can add a new address, and each home gets its own estimate, plan, tracker and documents. My orders shows them all at once, each with the one thing it's waiting for.",
        strong: "each with the one thing it's waiting for",
        // Hidden for now, kept as an idea: annotation: { kind: "cursor", name: "Oleh", note: "One status per home", points: [[30, 22], [30, 40], [30, 60]] }
        figures: [{ kind: "device", screens: [lumin.myOrders, lumin.addressAdd, lumin.addressEstimate, lumin.orderDetails] }],
      },
      {
        id: "live", label: "Live", title: "After the install",
        body: "Once the panels are on, the app shows what they generate today, what that saved, and every document for the system in one place. It's designed in full and planned for the release after the MVP.",
        figures: [{ kind: "device", screens: [lumin.monitoring, lumin.documents, { ...lumin.live, label: "Solar is live" }] }],
      },
      {
        id: "help", label: "Help", title: "Answers before questions",
        body: "A process this long raises questions, so the answers come with it. How it works explains each stage and why it takes the time it does, the FAQ covers money and timing, and Contact us is one tap away. The app asks to send notifications once the order exists, and the notification centre keeps every update in order.",
        figures: [{ kind: "device", frame: "row", screens: [lumin.help, lumin.howItWorks, lumin.contact, lumin.enableNotifications, lumin.notifications] }],
      },
      {
        id: "admin", label: "Admin", title: "The other side of the tracker",
        body: "Every state the customer sees is set by a person in the admin panel. I defined its logic: each order type has a process template built from four kinds of step (internal, information, document and payment), and the application page is where staff run those steps one by one. The client can change a journey without engineers, and the app shows only what the customer should see. The panel is built and working.",
        lesson: "The tool staff use every day deserves the same care as the customer app, because the app can only be as accurate as the admin behind it.",
        numbers: [
          { value: "4", label: "Step types" },
          { value: "3", label: "Process templates" },
          { value: "6", label: "Admin pages" },
        ],
      },
      {
        id: "system", label: "System", title: "The system, to try",
        body: "A quiet, dark system so the roof and the numbers stand out: Geist for type, Phosphor icons, neutral grey ramps and one blue accent. Before handoff I audited the variables and screens, which caught a warning colour at about 2:1 contrast and several screens that had drifted from the system.",
        // Checked against tokens.ts: 26 colours (Base 11, Accent 9, System 6), 10 type styles, 7 button styles × 4 states.
        numbers: [
          { value: "26", label: "Colour tokens" },
          { value: "10", label: "Type styles in Geist" },
          { value: "7 × 4", label: "Button styles × states" },
        ],
        figures: [
          // Each component in its own frame, in one grid, to keep the chapter short.
          { kind: "components", demos: ["luminasset/button", "luminasset/input", "luminasset/select", "luminasset/otp", "luminasset/toggles"], wide: ["luminasset/button"] },
          { kind: "component", demo: "luminasset/variables" },
          // Hidden here for now; the block stays registered (demos.tsx) and on /cases/showcase: { kind: "component", demo: "luminasset/tokens-phone" },
        ],
      },
      {
        id: "results", label: "Results", title: "A long process, made followable",
        body: "The MVP is being built on this design, from the estimate to the tracker, with the admin panel running every order. Monitoring, the notification centre and plan changes are designed and planned for the next release. There are no usage numbers yet, because the app hasn't launched.",
        strong: "designed and planned for the next release",
      },
    ],
    // Next project: still to choose (luminasset.md, "Still open").
  },
  {
    // From the revised quantum-body.md (24 Oct 2026): app screens, wireframes, comparisons and app behaviour first,
    // then scope, then the presentation pieces (Behance, App Store; Dribbble left out on 26 Oct). Every visual is sample until
    // permission. Confirmed: the Behance case and App Store screenshots are mine. Still open, so not on the page: my part
    // in the app and wireframes, the year and duration, the brief, research, results and lessons. The working notes and
    // Figma links are in docs/cases/quantum-body.md.
    slug: "quantum-body",
    title: "From a moment of reflection to a journal you can return to.",
    intro: "Quantum Body is designed around five ways to record a personal experience. Someone might arrive with a dream to remember, something they feel grateful for, or an intention they want to keep in view. The interface gives these practices a shared structure, with distinct symbols and colours, and brings entries together in the Alignment Log.",
    introHighlight: { text: "a shared structure, with distinct symbols and colours" },
    hero: { kind: "device", frame: "row", screens: [{ ...qb.newEntry, label: "Choose a practice" }, { ...qb.manifestationForm, label: "Create an entry" }, { ...qb.alignmentLog, label: "Return to the journal" }] },
    chapters: [
      {
        id: "wireframes", label: "Wireframes", title: "Mapping the experience before the visual detail",
        body: "The wireframes cover the path from introducing the practices and setting reminders to writing and revisiting entries. They also include editing, archive, trash, and education screens. The gallery keeps these connected screens together so the underlying structure can be explored before looking at the final interface.",
        // All 16 in the md's order, paged in threes.
        figures: [{ kind: "device", frame: "row", screens: [qb.wfIntroduction, qb.wfPractices, qb.wfReminders, qb.wfHome, qb.wireframeForm, qb.wfManifestation, qb.wfGratitude, qb.wfSynchronicity, qb.wfDream, qb.wfIntention, qb.wireframeLog, qb.wfEntry, qb.wfEdit, qb.wfArchive, qb.wfTrash, qb.wfEducation] }],
      },
      {
        id: "comparison", label: "Comparison", title: "Keeping the structure, developing the identity",
        body: "The practice selector moves from neutral labelled cards to a grid with distinct symbols and colours. The journal retains a card-based structure and search, while the final design adds visible entry states and a separate filter sheet. These comparisons show the supplied wireframe and final design states.",
        figures: [{
          kind: "compare", frame: "row",
          before: { ...qb.wireframeForm, label: "Practice selector" }, after: { ...qb.newEntry, label: "Practice selector" },
          more: [{ before: { ...qb.wireframeLog, label: "Journal" }, after: { ...qb.alignmentLog, label: "Journal" } }],
        }],
      },
      {
        id: "capture", label: "Capture", title: "From choosing a practice to keeping an entry",
        body: "Each practice starts with a recognisable form: a title, details, feelings, and an image option. The final designs also account for leaving unfinished writing, editing an entry, and attaching an image. The save-or-discard prompt makes that unfinished state explicit.",
        highlight: { text: "leaving unfinished writing" },
        figures: [
          { kind: "device", frame: "row", screens: [qb.newEntry, { ...qb.manifestationForm, label: "Write" }, qb.leaveEntry] },
          { kind: "device", frame: "row", screens: [qb.editEntry, qb.attachImage, qb.entryDetail] },
        ],
      },
      {
        id: "practices", label: "Practices", title: "Five starting points, a familiar form",
        body: "Manifestation, gratitude, synchronicity, dream, and intention entries use different colours and symbols while keeping the same core form layout. Moving between practices changes the visual setting without asking someone to learn a new entry structure each time.",
        figures: [{ kind: "device", screens: [qb.manifestationForm, qb.gratitudeForm, qb.synchronicityForm, qb.dreamForm, qb.intentionForm] }],
      },
      {
        id: "return", label: "Return", title: "Finding and managing what was written",
        body: "The Alignment Log brings entries into a searchable list, with filters and status labels. The screen set includes matching results, no matches, an empty journal, and separate archive and trash views. These states extend the experience beyond creating an entry to managing it later.",
        figures: [{ kind: "device", frame: "row", screens: [qb.alignmentLog, qb.searchResults, qb.searchEmpty, qb.filters, qb.logEmpty, qb.archive, qb.trash] }],
      },
      {
        id: "reminders", label: "Reminders", title: "Making room for a regular practice",
        body: "Onboarding introduces the journal and its practices before the reminder settings. Morning, midday, evening, and custom rows bring time and repeat controls into one screen. A time-selection sheet lets the setting change while the surrounding context remains visible.",
        // Related design states, not a recording: the picker and reminder state don't show a changed time.
        figures: [{ kind: "device", frame: "row", screens: [qb.onboarding, qb.onboardingPractices, qb.onboardingIntroduction, qb.reminders, qb.reminderPicker, qb.reminderSelected] }],
      },
      {
        id: "guidance", label: "Guidance", title: "A home to return to, with help nearby",
        body: "The home screen combines daily content, active entries, practice shortcuts, drafts, and education. The guide explains a shared framework for writing an entry, then introduces the individual practices. Both designs are long screens that can be explored in the phone.",
        pair: [
          { label: "Home", title: "An overview of the journal", body: "Daily content and entry shortcuts share one scrollable page.", media: { kind: "device", screens: [qb.home] } },
          { label: "Guide", title: "Help with the next entry", body: "Instructions sit alongside the journaling experience.", media: { kind: "device", screens: [qb.education] } },
        ],
      },
      {
        id: "scope", label: "Scope", title: "A connected set of designed flows",
        body: "The supplied work documents onboarding, five entry types, editing, images, reminders, search, archive, trash, and guidance. There are no usage numbers yet.",
      },
      {
        id: "behance", label: "Behance", title: "Bringing the product into one presentation",
        body: "I created a long-form Behance presentation that brings the screens and visual direction into one editorial composition.",
        figures: [{
          kind: "image", src: "/cases/quantum-body/behance-preview.jpg",
          alt: "Sample Quantum Body editorial presentation, including onboarding, visual foundations, journaling screens, education, and wireframes",
          full: { src: "/cases/quantum-body/behance-full.jpg", ratio: 21151 / 1400 },
          scroll: true,
        }],
      },
      {
        id: "store", label: "Store", title: "Introducing the product before the app",
        body: "I also designed the App Store screenshot set. Each poster introduces a part of the experience, from choosing a practice and finding entries to guidance and reminders.",
        figures: [{ kind: "posters", images: qbAppStore }],
      },
    ],
    next: { slug: "luminasset", title: "LuminAsset", summary: "A months-long solar install, one clear step at a time" },
  },
  {
    // From the revised snoozeband.md (24 Oct 2026): every feature area in the two supplied Figma pages, as galleries of
    // design states (not a recording). All sample; role, ownership, year, duration, scope, research, launch and outcomes
    // are still to confirm, so they aren't on the page and there's no results chapter. Notes and Figma links:
    // docs/cases/snoozeband.md.
    slug: "snoozeband",
    title: "From finding a sound to a bedtime routine.",
    intro: "Snoozeband brings audio discovery and bedtime listening into a dark mobile interface. The designs start with a guided setup, then connect sound collections, sleep flows, playback, and a personal library. Insights and reminder settings extend the experience beyond choosing a track.",
    hero: { kind: "device", frame: "row", screens: [{ ...snooze.home, label: "Discover" }, { ...snooze.player, label: "Listen" }, { ...snooze.insights, label: "Review" }] },
    chapters: [
      {
        id: "setup", label: "Setup", title: "Starting with the person's routine",
        body: "Onboarding asks about goals, sleep habits, and what keeps someone awake, then introduces bedtime and reminder settings. A progress bar connects the questions, while optional steps offer a skip action. The sequence ends with a preparation screen and account-creation choices.",
        figures: [{ kind: "device", frame: "row", screens: [snooze.welcome, snooze.onboardingName, snooze.onboardingGoals, snooze.onboardingSleepTrouble, snooze.onboardingSleepQuality, snooze.onboardingFallingAsleep, snooze.onboardingSleepDuration, snooze.onboardingNightWaking, snooze.onboardingAwakeReasons, snooze.onboardingBedtime, snooze.onboardingReminder, snooze.onboardingReferral, snooze.onboardingGender, snooze.onboardingAge, snooze.onboardingPersonalising, snooze.createAccount] }],
      },
      {
        id: "discover", label: "Discover", title: "Several ways to find a sound",
        body: "Home introduces a featured track and groups audio into sleep flows, noise, stories, meditations, and binaural beats. Collections bring related sounds together, while search provides another route into the catalogue. The sound-detail screen keeps artwork, a description, and a play action together.",
        figures: [{ kind: "device", frame: "row", screens: [snooze.home, snooze.collection, snooze.sound, snooze.search, snooze.searchEmpty] }],
      },
      {
        id: "flows", label: "Flows", title: "A listening sequence, ready to start",
        body: "Sleep Flows presents themed sequences separately from individual sounds. Opening one shows its track list, favourite and download actions, and a Start Sleep Flow button with a total duration. The scrolled state keeps the start action available while more tracks are visible.",
        figures: [{ kind: "device", frame: "row", screens: [snooze.sleepFlows, snooze.sleepFlow, snooze.sleepFlowScroll] }],
      },
      {
        id: "player", label: "Player", title: "The sound takes the lead",
        body: "Full-screen landscape imagery gives the track a visual setting, with a large pause button and a progress bar below. Secondary controls include repeat, favourites, and a sleep timer; the options menu groups playlist and download actions. The timer offers a set duration or the end of the current audio while keeping the player visible behind it.",
        figures: [{ kind: "device", frame: "row", screens: [{ ...snooze.player, label: "Listening" }, snooze.playerOptions, snooze.sleepTimer] }],
      },
      {
        id: "library", label: "Library", title: "Keeping sounds for another night",
        body: "The Library brings favourites, downloaded audio, and playlists into one place, with an entry point for creating a playlist. A playlist opens into a track list, and its menu exposes rename and delete actions. A separate confirmation appears before deletion, while an empty Library shows the starting structure.",
        figures: [{ kind: "device", frame: "row", screens: [snooze.libraryEmpty, snooze.library, snooze.favorites, snooze.playlist, snooze.playlistMenu, snooze.playlistDelete] }],
      },
      {
        id: "insights", label: "Insights", title: "A view of the listening routine",
        body: "Insights combines a listening milestone, the previous night's audio, and a weekly overview. The summary brings listening time, track counts, and a most-played selection together, with an action to play the previous audio again. The supplied designs also include a day without listening data and an empty starting view.",
        figures: [{ kind: "device", screens: [{ ...snooze.insights, label: "Listening summary" }, snooze.insightsNoData, snooze.insightsEmpty] }],
      },
      {
        id: "reminders", label: "Reminders", title: "Setting a time to return",
        body: "Preferences provides access to a bedtime reminder, alongside log-out and delete-account actions. The reminder screens support choosing a time, returning to the saved setting, and adjusting or removing it later. This gives the routine a dedicated place outside onboarding.",
        figures: [{ kind: "device", frame: "row", screens: [snooze.preferences, snooze.setReminder, snooze.preferencesReminder, snooze.manageReminder] }],
      },
      {
        id: "access", label: "Access", title: "Returning to an account",
        body: "Account creation offers email and Apple sign-up, while returning listeners have a separate sign-in screen. A forgotten password starts with a short recovery screen that asks only for an email. These account screens sit alongside the listening experience rather than inside the player.",
        figures: [{ kind: "device", frame: "row", screens: [snooze.createAccount, snooze.signIn, snooze.passwordRecovery] }],
      },
    ],
    next: { slug: "quantum-body", title: "Quantum Body", summary: "A place to capture a thought and come back to it" },
  },
  {
    // AskFlow, from the revised askflow.md (25 Oct 2026): a flagship product case, the product journey first and the
    // website in one chapter. All screens sample. Oleh co-designed new app features within a shared product and designed
    // the marketing website; never the sole product designer. No outcome metric is publishable; dates, feature authorship
    // and lessons are still to confirm. Notes and Figma links: docs/cases/askflow.md.
    slug: "askflow",
    title: "Building the tools behind a more personal shopping experience.",
    intro: "A product quiz involves more than writing questions. Merchants need to shape a flow, connect answers to products, make the experience fit their store, and understand what happens after publication. AskFlow brings these tasks together with AI shopping assistance. I worked as a co-designer on new app features within the shared product and also designed its marketing website.",
    introHighlight: { text: "connect answers to products" },
    hero: { kind: "images", fill: true, control: "player", images: [af.fmWebsite, af.fmQuiz, af.fmHowItWorks] },
    chapters: [
      {
        id: "product", label: "Product", title: "Two sides of the same experience",
        body: "The merchant works with a map of questions, rules, and result steps. The shopper sees a focused sequence of choices and recommendations. Showing both sides makes the app easier to understand: the editor defines the experience, while the storefront turns that configuration into an interaction.",
        pair: [
          { label: "Merchant", title: "Build the route", body: "Connected cards describe the questions and destinations within a quiz.", media: { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.branchDrag, "Connection")] } },
          { label: "Shopper", title: "Answer one question at a time", body: "Choice and image-question examples show how that structure becomes a smaller, focused interface.", media: { kind: "device", screens: [as(af.shopperChoiceMobile, "Choice"), as(af.shopperImageMobile, "Images")] } },
        ],
      },
      {
        id: "website", label: "Website", title: "Introducing the product through its interface",
        body: "I designed the marketing website to explain product quizzes and AI shopping assistance through interface examples, clear product sections, and calls to action. The visual language carries across desktop and mobile. The tabs move through the homepage and ten more pages, from How to use and Pricing to three industry pages, About us, Partners and the blog; each scrolls at full length on both screens.",
        figures: [
          { kind: "responsive", frame: "laptop", web: [as(af.websiteHomeFull, "Home"), ...af.sitePages.map(page => page.web)], mobile: [af.websiteHomeMobile, ...af.sitePages.map(page => page.mobile)] },
        ],
      },
      {
        id: "setup", label: "Setup", title: "Connecting the store before building the experience",
        body: "Setup covers account creation, platform choice, store connection, and catalogue preparation. These stages give the merchant a route into the workspace before they begin configuring a quiz or assistant. The catalogue step closes setup and hands the merchant over to product creation.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.signup, "Create an account"), as(af.accountSetup, "Account setup"), as(af.cmsChoice, "Choose a platform"), as(af.catalogSync, "Catalogue ready")] },
        ],
      },
      {
        id: "workspace", label: "Workspace", title: "Keeping the surrounding product in view",
        body: "The workspace brings quizzes, AI chats, integrations, and reporting into a shared navigation structure. Project switching, preferences, and team permissions support the work around the editor. Quiz status and workspace actions give the merchant a way back into existing experiences.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.dashboard, "Quizzes"), as(af.workspaceSwitcher, "Switch workspace"), as(af.workspacePreferences, "Preferences"), as(af.teamPermissions, "Users and permissions")] },
        ],
      },
      {
        id: "create", label: "Create", title: "Starting with a prompt or a blank canvas",
        body: "Merchants can begin with a first question or describe the quiz they want to create. The AI-generation flow separates entering a prompt from reviewing a generated structure. The visual canvas then becomes the place to continue editing, rather than treating the initial generation as a finished quiz.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.aiEntry, "First question"), as(af.aiPrompt, "Describe the quiz"), as(af.aiGenerated, "Review the structure"), as(af.builder, "Continue in the builder")] },
        ],
      },
      {
        id: "canvas", label: "Canvas", title: "Making relationships editable",
        body: "Questions and answers appear as cards with visible connection points. Branching can direct different answers to different destinations; grouped answers can share a route. Editing also includes smaller operations such as duplicating an answer and reconnecting a broken path. These interaction states explain how the map is intended to be used, beyond its appearance in a finished screenshot.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.choiceBuilder, "Question card"), as(af.choiceMultiselect, "Group answers"), as(af.branchRouting, "Route an answer"), as(af.branchRestore, "Reconnect a path"), as(af.answerDuplicate, "Duplicate an answer")] },
        ],
      },
      {
        id: "questions", label: "Questions", title: "Moving between structure and detail",
        body: "The map describes the overall route; the detailed editor handles the content within a step. Text choices, image choices, and forms use a preview alongside their settings. The image-step examples show answer imagery and layouts, while form editing provides input and consent controls.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.questionDetails, "Question editor"), as(af.questionAddAnswer, "Add an answer"), as(af.imageUpload, "Change an image"), as(af.imageLayout, "Image layout")] },
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.formTypes, "Input types and consent"), as(af.formCreate, "Create an input"), as(af.formInput, "Edit an input"), as(af.formDesign, "Form appearance")] },
        ],
      },
      {
        id: "logic", label: "Logic", title: "Giving different answers different routes",
        body: "Logic jumps add conditional routing to the map. The canvas shows where a condition belongs, while the rule dialog provides a focused configuration view. Keeping the route and its rule available as separate views lets the case explain both the structure and the controls that define it.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.logicStep, "Logic step"), as(af.logicJumpItem, "Choose a conditional route"), as(af.logicRule, "Configure the rule")] },
          { kind: "component", demo: "askflow/logic-jump" },
        ],
      },
      {
        id: "catalogue", label: "Catalogue", title: "Matching the flow to products and variants",
        body: "Product matching places a searchable catalogue beside the canvas. Merchants can work with products and variants, use filters, and review their selection before saving. Empty matches and selection-limit feedback are part of the same task, so the interface also needs to explain when a choice cannot continue as expected. Products can also be matched to a single answer from its menu; the matched list sits beside the answer, and in the scoring designs each product takes a score.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.productMatch, "Browse products"), as(af.productFilter, "Filter the catalogue"), as(af.productSelected, "Select products and variants"), as(af.productEmpty, "No matches"), as(af.productLimit, "Selection limit")] },
          { kind: "component", demo: "askflow/product-picker" },
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.matchMenu, "Match from an answer"), as(af.matchEmpty, "Open the catalogue"), as(af.matchOne, "One product"), as(af.matchThree, "Three products"), as(af.matchScores, "Score each product")] },
        ],
      },
      {
        id: "recommendations", label: "Recommendations", title: "Controlling the result of the quiz",
        body: "Result settings determine how recommendations are presented, including a single-product layout and a route through multiple result sets. The populated preview connects these settings to the shopper-facing outcome. Separate controls cover result imagery and the labels and actions attached to a product. Global settings, reached from one menu in the builder, hold the start screen's button, the results page's buttons and image scaling, and, for the assistant, product sorting and media.",
        pair: [
          { label: "Result", title: "A recommendation the shopper can act on", body: "A populated preview shows the relationship between product imagery, the recommendation, and its actions.", media: { kind: "image", src: af.shopperRecommendations.src, alt: af.shopperRecommendations.alt } },
          { label: "Configuration", title: "Decide what the result exposes", body: "Result controls define the available actions and how product imagery is treated.", media: { kind: "image", src: af.resultsPageCard.src, alt: af.resultsPageCard.alt } },
        ],
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.resultRules, "Result configuration"), as(af.resultOneProduct, "One selected product"), as(af.resultScroll, "Multiple result sets")] },
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.resultsMenu, "Settings menu"), as(af.resultsStart, "Start settings"), as(af.resultsAssistant, "Assistant results")] },
        ],
      },
      {
        id: "appearance", label: "Appearance", title: "Giving the experience a consistent visual treatment",
        body: "Theme settings sit beside the preview, covering typography, colours, backgrounds, buttons, and step transitions. Merchants can move between step types while working on the shared appearance, then save a theme. A single brand colour drives every answer state: text, backgrounds, borders and fills are that colour at set opacities, so one choice re-tints the whole quiz. The theme examples apply the same system to different type, colour and backgrounds.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.themeSettings, "Theme selection"), as(af.designBackground, "Background image"), as(af.designWidth, "Button width"), as(af.designTransition, "Step transitions"), as(af.themeSave, "Save a theme")] },
          { kind: "component", demo: "askflow/answer-colour" },
          { kind: "images", images: [as(af.themeSans, "Warm"), as(af.themeForm, "Green"), as(af.themeSerif, "Serif"), as(af.themeLilac, "Lilac"), as(af.themeLilacForm, "Lilac form")] },
        ],
      },
      {
        id: "shopper", label: "Shopper", title: "Questions that fit the screen in front of them",
        body: "The shopper-facing examples include text choices, image options, phone and date inputs, and mobile forms. Progress, navigation, and the primary action stay close to the current task. Desktop and mobile examples show the range of layouts in the file; their different sample content is presented as examples rather than one continuous quiz.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.shopperStart, "Opening question"), as(af.shopperImageDesktop, "Image choices"), as(af.shopperForm, "Phone input"), as(af.shopperDate, "Date input")] },
          { kind: "device", frame: "row", screens: [as(af.shopperChoiceMobile, "Choices"), as(af.shopperImageMobile, "Images"), as(af.shopperFormMobile, "Form")] },
        ],
      },
      {
        id: "cart", label: "Cart", title: "Connecting a recommendation to the next action",
        body: "Result-step settings include the number of recommendations and the actions available on each product. The screen set also contains individual cart actions and an add-all option. The mobile examples show a recommendation and its actions.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.cartSettings, "Cart settings")] },
          { kind: "device", screens: [as(af.shopperResultsMobile, "Recommendations"), as(af.shopperCartMobile, "Cart actions")] },
        ],
      },
      {
        id: "assistant", label: "Assistant", title: "A second way to guide a shopper",
        body: "AskFlow also includes a conversational shopping experience. Its setup brings together store context, a greeting, personality, language, and visual settings, with a preview beside the configuration. The file includes multiple design iterations of these tools, showing both assistant behavior settings and its appearance within the store.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.chatOnboarding, "Choose an experience"), as(af.chatWorkspace, "Configure an assistant"), as(af.chatSettings, "Conversation settings"), as(af.chatDesign, "Assistant settings")] },
        ],
      },
      {
        id: "knowledge", label: "Knowledge", title: "Configuring context and reviewing conversations",
        body: "An instruction screen combines a description of the assistant's role with a knowledge area for files and links. Conversation history gives the merchant a separate place to inspect individual exchanges, while embedding settings connect the configured assistant to a store. These views explain the management tools around the chat interface.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.chatDataProducts, "Instructions and knowledge"), as(af.chatLogs, "Conversation history"), as(af.chatEmbed, "Embed the assistant")] },
        ],
      },
      {
        id: "integrations", label: "Integrations", title: "Connecting the experience to other merchant tools",
        body: "Integrations appear both at workspace level and within a quiz. The designs distinguish connecting a service from configuring its use in a particular experience. A segmentation rule brings together product selection, a destination value, and a trigger condition, linking the quiz's configuration to the merchant's wider workflow.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.integrationsList, "Available connections"), as(af.integrationConnected, "Connected state"), as(af.integrationQuiz, "Quiz integration settings"), as(af.segmentationRule, "Segmentation rule")] },
        ],
      },
      {
        id: "publish", label: "Publish", title: "Checking the flow before it reaches the store",
        body: "Publishing includes validation for missing structure, such as an unset start step or an empty result. Each example states what is missing and offers a relevant next action. Publishing then opens format-specific configuration rather than one generic finish screen.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.publishValidation, "Set the start step"), as(af.publishEmptyResult, "Match result products"), as(af.publishOptions, "Choose a format")] },
        ],
      },
      {
        id: "trial", label: "Free trial", title: "Two places to offer the trial",
        body: "The free-trial designs come in two versions. Version A starts with AI: the merchant generates a first quiz from a collection, then meets the plans. Version B lets them build first and shows the plans at the first publication, followed by the share and embed step. Both versions sit side by side in the design file. Prices are hidden here.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.trialAAi, "A · Generate with AI"), as(af.trialAPlans, "A · Choose a plan"), as(af.trialFirstPublish, "B · First publication"), as(af.trialBPlans, "B · Choose a plan"), as(af.trialBEmbed, "B · Share and embed")] },
        ],
      },
      {
        id: "storefront", label: "Storefront", title: "Choosing how the experience appears",
        body: "The publishing designs offer iframe, popup, and widget routes. Page placement and customisation settings let the merchant configure how an experience enters the store. Storefront examples show a quiz inside a popup and a widget beside the shopping content; mobile examples show the launcher in a smaller viewport. A full run on a demo store, from the opening screen through a question and image answers to the results, shows the popup at its real size.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.publishSettings, "Choose a page"), as(af.publishEmbed, "Iframe instructions"), as(af.widgetCustomise, "Widget placement"), as(af.popupStore, "Popup example"), as(af.widgetStore, "Widget example")] },
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.storeStart, "Start"), as(af.storeQuestion, "Question"), as(af.storeImages, "Image answers"), as(af.storeResults, "Results")] },
          { kind: "device", screens: [as(af.widgetMobile, "Chat launcher"), as(af.popupMobile, "Quiz launcher")] },
        ],
      },
      {
        id: "updates", label: "Updates", title: "Managing changes after publication",
        body: "The file includes saving, updating, restoration, and version-history states. These designs distinguish ongoing edits from the published experience and show how a merchant could inspect or return to a previous version. Some controls are marked as planned in the source, so these screens describe the designed workflow rather than establish release status.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.publishHistory, "Version history"), as(af.publishUpdate, "Publication actions"), as(af.publishRestore, "Restore the published version")] },
        ],
      },
      {
        id: "reporting", label: "Reporting", title: "Looking across quizzes and conversations",
        body: "Reporting separates general activity, quizzes, and AI chats, with period selection and comparison controls. An empty overview provides the structure before activity is available. The sample figures are withheld here; the case focuses on what the reporting views organise and how merchants move between them.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.analytics, "Overview"), as(af.quizAnalytics, "Quizzes"), as(af.chatAnalytics, "AI chats"), as(af.analyticsEmpty, "Empty state")] },
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.analyticsDate, "Choose a period"), as(af.analyticsPeriod, "Compare periods")] },
        ],
      },
      {
        id: "insights", label: "Insights", title: "Bringing the report back to the flow",
        body: "Quiz insights place activity information on the same question-and-answer structure used for building. Answer-level bars, drop-off detail, and version selection connect the report to a specific route through the quiz. Form-response and export views provide another level of inspection for steps that collect input.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.insightsMap, "Activity on a logic flow"), as(af.insightsDropoff, "Drop-off detail"), as(af.insightsHistory, "Version selection"), as(af.formResponses, "Form responses"), as(af.formExport, "Export choices")] },
        ],
      },
      {
        id: "components", label: "Components", title: "A shared language for a complex editor",
        body: "The supplied UI kit defines the recurring controls behind the experience: buttons, inputs, selection states, question and answer cards, navigation, and feedback. This section lets visitors try a small set of those pieces, connecting the system to the interactions already shown in the product.",
        figures: [
          { kind: "components", demos: ["askflow/button", "askflow/input", "askflow/select"], wide: ["askflow/button"] },
          { kind: "components", demos: ["askflow/question-card", "askflow/minimap"] },
        ],
      },
      {
        id: "explorations", label: "Explorations", title: "Ideas beyond the main workflow",
        body: "The wider file also contains concepts for AI suggestions alongside a question, statement steps, and variables. They show directions explored around the editor and are presented separately from the main product sequence.",
        figures: [
          { kind: "browser", frame: "bare", ratio: AF_RATIO, screens: [as(af.explorationAiSuggestions, "AI suggestions · concept"), as(af.explorationStatement, "Statement step · concept"), as(af.explorationVariables, "Variables · under review")] },
        ],
      },
      {
        id: "contribution", label: "Contribution", title: "Designing within a shared product",
        body: "My role combined co-designing new app features with designing the marketing website. This case shows that work in its broader product context: the merchant tools, the shopper-facing interaction, the controls around publication, and the views used to review activity.",
      },
    ],
    next: { slug: "smarthost", title: "SmartHost", summary: "From property management to a clear next step" },
  },
  {
    // Nearbor, from nearbor.md (25 Oct 2026). Oleh improved an existing app and designed most screens within the previous
    // designer's design system; keep that attribution. All screens sample, from the v3.0 page only. No before-state, dates,
    // usability results or outcomes are available, so none are on the page. Quick Start is in review and the community
    // community channel, audience and notification screens are presented as finished features at Oleh's request (26 Oct). The intro highlight is a phrase from the intro (the system only highlights
    // phrases from the text), not the MD's separate line. Notes, evidence and Figma links: docs/cases/nearbor.md.
    slug: "nearbor",
    title: "Improving the experience without starting over.",
    intro: "Nearbor serves communities of different kinds and ages, from neighbourhood groups and families to volunteer and faith communities. I joined an existing product, working with the visual language and components established by the previous designer. I designed most of the screens and focused on improving the experience: making information easier to read, explaining what happens next, and extending familiar flows without adding unnecessary complexity.",
    introHighlight: { text: "focused on improving the experience" },
    hero: { kind: "device", frame: "row", screens: [nb.network, { ...nb.home, label: "Calendar" }, { ...nb.careOverview, label: "Care" }] },
    chapters: [
      {
        id: "onboarding", label: "Onboarding", title: "Join first, finish setting up later",
        body: "The client described a real situation: getting around twenty people into the app in one room, with full onboarding reportedly taking about ten minutes. I designed a Quick Start alternative that separates entry from optional setup. Profile photo, contact sync, discovery, and the app tour can be revisited later. The design remains in review; the case shows the proposed direction rather than a measured reduction in onboarding time.",
        figures: [{ kind: "device", frame: "row", screens: [nb.quickStart, nb.quickStartChoice, nb.finishSetup] }],
      },
      {
        id: "structure", label: "Structure", title: "Communities, groups and events",
        body: "Nearbor organises people in three layers. A community, such as a church or a neighbourhood, holds groups; a group, like a book club, has its own chat and events; an event belongs to a group and carries the plan, the people and the attachments. Each layer has its own page, members and actions, so it's always clear where something lives.",
        figures: [{ kind: "device", frame: "row", screens: [nb.community, nb.groupOwner, nb.eventParticipant] }],
      },
      {
        id: "home", label: "Home", title: "Calendar, Network and Discover",
        body: "Home has three tabs. Calendar shows the days ahead and the events someone is going to, with an RSVP sheet that asks a single question. Network lists the communities and groups a person belongs to, with their latest messages. Discover shows what else is nearby. Create starts an event, a care event or a group from any tab.",
        // One row in two pages of three: the tabs, then RSVP, going and create.
        figures: [{ kind: "device", frame: "row", screens: [{ ...nb.home, label: "Calendar, Network, Discover" }, nb.network, nb.discover, { ...nb.rsvpSheet, label: "RSVP and create" }, nb.eventsGoing, nb.createSheet] }],
      },
      {
        id: "discover", label: "Discover", title: "A new way to find what's nearby",
        body: "The redesigned Discover asks for location first and says why. It then shows upcoming events and the groups and communities around, each with a request to join and its next events. A filters sheet narrows the list by event type, by groups or communities, and by distance, and each result opens to its own page with one clear join button.",
        figures: [{ kind: "device", frame: "row", screens: [nb.locationAccess, nb.discoverAll, nb.discoverFilters, nb.discoverCommunity, nb.discoverGroup, nb.discoverEvent] }],
      },
      {
        id: "referral", label: "Referral", title: "Join with a code or a QR",
        body: "A referral code connects a new person to the communities of whoever invited them. It can be typed or scanned as a QR code, with a clear message when no one matches. The code lives in the profile, and the same entry appears where people need it most: on an empty home and in Discover.",
        figures: [{ kind: "device", frame: "row", screens: [nb.referralProfile, nb.referralFilled, nb.referralScan, nb.referralError, nb.referralHome, nb.referralDiscover] }],
      },
      {
        id: "recovery", label: "Recovery", title: "Explain the blocker and offer a next step",
        body: "A successful contact sync does not always find someone. I designed distinct outcomes for matches and no matches, so the response explains what actually happened and offers a next step, like inviting people with a link. These states turn an empty screen into an explanation and an action.",
        figures: [{ kind: "device", frame: "row", screens: [nb.syncProgress, nb.syncMatches, nb.syncNoMatches] }],
      },
      {
        id: "events", label: "Events", title: "Make commitments and consequences visible",
        body: "Organisers need to define a schedule and see where help is still needed. I extended the event flow with recurrence controls, volunteer roles, and clearer participant choices. Editing a recurring event asks whether the change affects one occurrence or the whole series. Role selection shows available places, while the organiser's detail view distinguishes filled roles from shortages. The emphasis is on making the consequence of a choice clear before it is confirmed.",
        figures: [
          { kind: "device", screens: [nb.recurrence, nb.editScope] },
          { kind: "device", frame: "row", screens: [nb.volunteerRoles, nb.volunteerSignup, nb.eventOwner] },
        ],
      },
      {
        id: "event-details", label: "Event details", title: "Everything an event needs",
        body: "Organisers can list what people should bring, and participants pick from what's still open. Photos and files attach to the event, open full screen and upload with clear progress. After the event, a notification asks the organiser who came, and the attendance is saved to the event.",
        // One row in three pages of three: what to bring, photos and files, attendance.
        figures: [{ kind: "device", frame: "row", screens: [nb.needsItems, nb.itemLog, nb.itemLogSelected, nb.imagesUploaded, nb.imagePreview, nb.filePreview, { ...nb.markAttendance, label: "Attendance" }, nb.attendanceSheet, nb.attendanceSaved] }],
      },
      {
        id: "conversation", label: "Conversation", title: "Test an idea before organising an event",
        body: "Not every gathering starts with a formal plan. Who's In? lets a group ask about an activity inside its existing chat, with an optional date, time and place, gather responses, and then turn interest into an event. I designed the creation, member-response, and organiser states around that progression. Keeping the feature within a group conversation avoids introducing another place people need to learn and navigate.",
        figures: [
          { kind: "device", frame: "row", screens: [nb.whosinAsk, nb.whosinDate, nb.whosinTime, nb.whosinLocation, nb.pollCreate] },
          { kind: "device", frame: "row", screens: [nb.pollMember, nb.whosinImIn, nb.whosinAdmin, nb.pollToEvent, nb.whosinEventCreated] },
        ],
      },
      {
        id: "care", label: "Care", title: "Show where help is still needed",
        body: "Care brings coordination down to specific days and tasks. The screens show which needs are covered, where a person can volunteer, and how their own commitment appears afterwards. A participant can choose how to help, review the commitment, and change it if their plans change. Showing both the available and committed states makes the flow understandable without relying on a single idealised screen.",
        figures: [{ kind: "device", frame: "row", screens: [nb.careOverview, nb.careHelp, nb.careConfirmed] }],
      },
      {
        id: "providers", label: "Providers", title: "Keep useful records close to the people who need them",
        body: "I extended the existing provider experience beyond a saved contact. Service history, attachments, and reminders give people a practical record to return to. Household sharing is a separate, explicit action: people choose providers to share rather than being shown an unexplained all-or-nothing setting. The empty state also explains who can see service records, helping distinguish personal or household information from public recommendations.",
        figures: [
          { kind: "device", screens: [nb.provider, nb.serviceHistory, nb.logService] },
          { kind: "device", screens: [nb.serviceReminder, nb.householdSharing] },
        ],
      },
      {
        id: "community", label: "Community", title: "Keep a growing community understandable",
        body: "Larger communities need a way to share announcements without burying them in conversation. I designed a community channel that keeps announcements apart from group chat, an audience picker so an administrator can choose who each announcement reaches, and more specific notification controls for members. They follow the same principle as the rest of the work: extend the existing structure before adding another layer to it.",
        figures: [{ kind: "device", screens: [nb.communityConcept, nb.announcementAudience, nb.notificationsConcept] }],
      },
      {
        id: "readability", label: "Readability", title: "Start with what people can read",
        body: "The client specifically raised the needs of older users and asked for more readable chat content. I worked on a typography and readability audit, then designed a text-size control with a message preview. Default, Medium, and Large examples make the effect visible before a person returns to the conversation. This supports the broader accessibility goal through a concrete, understandable choice; it is not a claim of certified accessibility or validated usability for every age group.",
        figures: [
          { kind: "device", screens: [nb.textSizeDefault, nb.textSizeMedium, nb.textSizeLarge], annotation: { kind: "draft", name: "Oleh", note: "Preview the reading size before returning to the conversation.", points: [[42, 58], [58, 76]] } },
        ],
      },
      {
        id: "notifications", label: "Notifications", title: "Notifications that ask for a decision",
        body: "Notifications keep new items apart from archived ones and let people act in place, approving a join request or answering a provider request without leaving the list. Settings control push and chat alerts, then go down to each community and group: everything, events only, custom or off.",
        figures: [{ kind: "device", frame: "row", screens: [nb.notifications, nb.notificationsArchived, nb.notificationSettings, nb.notificationSettingsCommunity] }],
      },
      {
        id: "updates", label: "Updates", title: "Telling people what changed",
        body: "When a new version is out, the app offers it without blocking: Update now or Later. What's New lists the changes in plain words. When an old version is no longer supported, a required update explains why before it asks.",
        figures: [{ kind: "device", frame: "row", screens: [nb.updateAvailable, nb.whatsNew, nb.updateRequired] }],
      },
      {
        id: "closing", label: "Closing", title: "Product maintenance as design work",
        body: "This work shows product maintenance as design work: improving established flows, addressing confusing states, and extending the app while retaining a familiar visual foundation. The evidence here is the design work and documented decisions; measured product outcomes are not available.",
      },
    ],
    next: { slug: "snoozeband", title: "Snoozeband", summary: "Bedtime listening, from setup to replay" },
  },
  {
    // SmartHost, from smarthost.md (25 Oct 2026): a hero and four short chapters, bare browser frames throughout (the
    // historical domain now redirects elsewhere). Personal contribution, dates and outcomes aren't confirmed, so the copy
    // only describes visible design decisions. All sample; forecasts, testimonials and contact details are design content.
    // The article frame is shown as a layout only. Notes and Figma links: docs/cases/smarthost.md.
    slug: "smarthost",
    title: "From property management to a clear next step.",
    intro: "Property owners arrive with different questions: what gets managed, how the service works, and what their property could earn. SmartHost's website brings those questions into one journey, pairing service content with a guided estimate and an invitation to speak with the team.",
    hero: { kind: "responsive", frame: "bare", ratio: SH_RATIO.page, web: [sh.home], mobile: [sh.homeMobile] },
    chapters: [
      {
        id: "homepage", label: "Homepage", title: "A direct route into the service",
        body: "The homepage places the service proposition and estimate entry together. Purple highlights the main action, while warm neutrals and yellow accents give the supporting content a distinct hierarchy. The wireframe and designed screen show two treatments of the same entry point, making the change in composition easy to see.",
        figures: [
          { kind: "compare", frame: "bare", ratio: SH_RATIO.page, before: sh.homeWireframe, after: sh.homeVisual },
          { kind: "responsive", frame: "bare", ratio: SH_RATIO.form, web: [sh.navigation], mobile: [sh.navigationMobile] },
        ],
      },
      {
        id: "services", label: "Services", title: "Making the offer concrete",
        body: "A service overview introduces the scope of property management, while dedicated pages explain individual parts of the offer. Photography and multi-platform listings use large images and concise introductions to give those services a recognisable identity. The shared layout keeps these pages connected to the wider website.",
        figures: [{ kind: "browser", frame: "bare", ratio: SH_RATIO.page, screens: [sh.services, sh.photography, sh.listings] }],
      },
      {
        id: "estimation", label: "Estimation", title: "Turning interest into a property enquiry",
        body: "The questionnaire asks about an owner's goals and property availability, then collects property details. The estimate screen brings together a forecast, plan options, and consultation actions. Desktop and mobile examples show how the information changes shape across screen sizes. These are selected design states; the displayed forecast is not a verified financial result.",
        figures: [
          { kind: "browser", frame: "bare", ratio: SH_RATIO.form, screens: [sh.estimateGoal, sh.estimateAvailability, sh.estimateDetails] },
          { kind: "responsive", frame: "bare", ratio: SH_RATIO.page, web: [sh.estimateResult], mobile: [sh.resultMobile] },
        ],
      },
      {
        id: "website", label: "Wider website", title: "One identity across different content",
        body: "The same visual language extends to a Dubai homepage, an investment page, and editorial content. Regional pages introduce a different service context, while the blog index and article layout accommodate longer reading. A small selection shows that breadth without turning this case into a catalogue of every page.",
        figures: [{ kind: "browser", frame: "bare", ratio: SH_RATIO.hero, screens: [sh.dubai, sh.investment, sh.blog, sh.article] }],
      },
    ],
    next: { slug: "sellergenius", title: "SellerGenius", summary: "Profit, ads and operations in one dashboard" },
  },
  {
    // SellerGenius, a small case from Oleh's brief (25 Oct 2026) and the SellerGenius Figma file: the goals and pain points
    // come from the file's Project Passport. All screens sample; no outcomes are claimed. The AI screens are Step 2
    // (post-MVP) in the brief, and the copy says so. Notes and Figma links: docs/cases/sellergenius.md.
    slug: "sellergenius",
    year: "2025",
    duration: "3–4 months",
    title: "Profit, ads and operations in one dashboard.",
    intro: "SellerGenius started from an agency's own frustrations with Amazon analytics: no single place to see every brand, dashboards that couldn't be adjusted, and problems found only by working through spreadsheets. The goal was an MVP that brings sales, profit, advertising and operations into one dashboard, for sellers and for agencies managing several brands. I designed the product from zero to one, along with its design system and brand identity.",
    introHighlight: { text: "one dashboard" },
    hero: { kind: "image", src: sg.dashboard.src, alt: sg.dashboard.alt },
    chapters: [
      {
        id: "onboarding", label: "Onboarding", title: "From sign-up to connected stores",
        body: "Sign-up stays on one card over a calm background: an account, a short profile, then connecting Amazon Seller Central and the Amazon Ads account, each step saying what the connection unlocks. Returning people log in with Google, Apple or email and choose which workspace to open.",
        figures: [{ kind: "images", images: [sg.signup, sg.signupProfile, sg.connectAmazon, sg.connectAds, sg.login, sg.loginWorkspace] }],
      },
      {
        id: "dashboard", label: "Dashboard", title: "A dashboard each team can shape",
        body: "Finance, advertising and brand managers each look for different numbers first. The dashboard opens with headline metrics and charts, and Customise Dashboard turns it into a grid: widgets can be added from a library, moved, and switched between chart views.",
        figures: [{ kind: "images", images: [sg.dashboard, sg.customize, sg.addWidget, sg.widgetFormat] }],
      },
      {
        id: "money", label: "Profit and ads", title: "Where the money goes",
        body: "Profit analytics breaks revenue down into a P&L, profitability by SKU and brand, and fees, so a margin problem can be traced to its cause rather than searched for in a spreadsheet. Advertising follows the same structure, with campaign metrics and recommendations that suggest an action, such as lowering a bid or pausing a campaign.",
        figures: [
          { kind: "images", images: [sg.profit, sg.plOverview, sg.profitSku, sg.feeBreakdown] },
          { kind: "images", images: [sg.advertising, sg.recommendations] },
        ],
      },
      {
        id: "products", label: "Products", title: "Every SKU, its stock and its problems",
        body: "Products brings performance, the full product list, inventory, alerts and listings into one section, each with headline figures above a filterable table. Costs of goods can be uploaded as a file, and notes, tags and statuses help a team keep track of what needs attention.",
        figures: [{ kind: "images", images: [sg.products, sg.productPerformance, sg.productsList, sg.inventory, sg.alerts, sg.listings, sg.cogsUpload, sg.productNotes, sg.tagsStatus] }],
      },
      {
        id: "operations", label: "Operations", title: "The account's health at a glance",
        body: "Operations watches the seller account itself: a health score, issues with an explanation and a recommended action, and returns by product and reason.",
        figures: [{ kind: "images", images: [sg.operations, sg.sellerHealth, sg.returns] }],
      },
      {
        id: "brands", label: "Brands", title: "Many brands, one workspace",
        body: "Agencies were the first audience, so brands sit at the top of the structure. The overview lists every brand with its stores and key figures, and each brand opens into its own view with its connected marketplaces.",
        figures: [{ kind: "images", images: [sg.brands, sg.brandDetail] }],
      },
      {
        id: "ai", label: "AI", title: "Asking instead of filtering",
        body: "The brief placed AI features in a second step after the MVP. I designed the assistant as a full-screen chat with saved prompts, answers that build a report or chart from a question, and a smaller window that opens over any page.",
        figures: [{ kind: "images", images: [sg.aiChat, sg.aiReport, sg.aiWindow] }],
      },
      {
        id: "reports", label: "Reports and settings", title: "Reports on a schedule, settings for a team",
        body: "Custom reports pick the fields, period and format, and can go out on a schedule. Settings cover the account and its sessions, notifications by type, and each workspace's connected seller and Ads accounts, including ones shared from other workspaces.",
        figures: [{ kind: "images", images: [sg.reports, sg.reportBuilder, sg.settingsSessions, sg.settingsNotifications, sg.settingsSellerAccounts, sg.settingsShared] }],
      },
      {
        id: "themes", label: "Themes", title: "One system, two themes",
        body: "Alongside the product I worked on the brand identity and a design system used across every screen. Each screen was designed in a light and a dark theme.",
        figures: [{ kind: "compare", frame: "bare", ratio: SG_RATIO, before: { ...sg.dashboard, label: "Light" }, after: sg.dashboardDark }],
      },
    ],
    next: { slug: "tutor-iq", title: "Tutor IQ", summary: "Designing the journey from finding a tutor to making progress" },
  },
  {
    // Tutor IQ, from tutor-iq.md (25 Oct 2026): a flagship case, the platform first, then the website, structure and system.
    // Oleh was the sole designer (discovery, platform, website, design system) with the PM and client; never the developer.
    // All screens sample; the brief, PRD, documentation and Notion weren't readable, so nothing here relies on them. Year,
    // duration, launch and outcomes aren't confirmed. AI search, summaries and transcripts are designs, not verified
    // features. The intro highlight is a phrase from the intro (the MD's line isn't in the text). The MD's suggested new
    // patterns (role explorer, IA viewer, cross-role player, live components) are not built yet. docs/cases/tutor-iq.md.
    slug: "tutor-iq",
    title: "One tutoring journey, designed for everyone involved.",
    intro: "Tutor IQ is a connected tutoring platform for parents, students, tutors and administrators. A parent needs to find a suitable tutor and manage bookings; a student needs to prepare, learn and see progress; a tutor needs to plan, teach and follow through. Administrators verify tutors and handle the operational exceptions behind that journey. I designed the platform and its design system alongside the website and discovery structure, working with the PM and client. This case follows the user journey first, then shows the system and operations that support it.",
    introHighlight: { text: "parents, students, tutors and administrators" },
    hero: { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.parentHome, tq.studentHome, tq.tutorHome, tq.adminDashboard] },
    chapters: [
      {
        id: "roles", label: "Roles", title: "Different work, one connected product",
        body: "The same lesson appears differently depending on who is looking. Parent and student homes foreground upcoming lessons and progress; the tutor home makes teaching, homework and booking actions visible; the admin dashboard surfaces system activity. This role structure provides the map for the case. The numbers and names in these design screens are sample content, not measured usage.",
      },
      {
        id: "structure", label: "Structure", title: "Map the journeys before showing the screens",
        body: "Discovery explored parent, student, tutor, shared and admin responsibilities. The website sitemap organised the public entry points. These boards hold more detail than one image can explain, so each opens at full size to explore. The discovery board includes conditional and future ideas; the finished UI below is the evidence for what reached design.",
        figures: [{ kind: "images", images: [tq.ia, tq.sitemap] }],
      },
      {
        id: "website-ux", label: "Website UX", title: "From wireframes to a useful public path",
        body: "The wireframes defined the homepage and audience routes before the final visual design. Their layouts differ from the finished pages, so they sit side by side rather than under one slider. This compares design stages, not an earlier live site with a redesign.",
        pair: [
          { label: "Wireframes", title: "Content hierarchy first", body: "Homepage, For Parents and Cost as wireframes.", media: { kind: "browser", frame: "bare", ratio: TQ_RATIO.site, screens: [tq.wireframeHome, tq.wireframeParents, tq.wireframeCost] } },
          { label: "Final", title: "The finished pages", body: "The same three pages in the final visual design.", media: { kind: "browser", frame: "bare", ratio: TQ_RATIO.site, screens: [tq.websiteHome, tq.websiteParents, tq.websiteCost] } },
        ],
      },
      {
        id: "website", label: "Website", title: "Explain the value before asking people to sign up",
        body: "The full homepage moves from an invitation to find a tutor through matching, lessons, progress, benefits, learning resources and common questions. The platform illustrations on the page connect marketing promises to product screens. Desktop and mobile layouts carry the same story at different densities.",
        figures: [
          { kind: "image", src: tq.websiteHome.src, alt: tq.websiteHome.alt, full: { ...tq.websiteHome.full!, label: "View full homepage" } },
          { kind: "responsive", frame: "bare", ratio: TQ_RATIO.site, web: [tq.websiteHome, tq.websiteParents, tq.websiteTutors], mobile: [tq.websiteHomeMobile, tq.websiteParentsMobile, tq.websiteTutorsMobile] },
        ],
      },
      {
        id: "audiences", label: "Audience paths", title: "Give parents and tutors relevant answers",
        body: "The public site provides dedicated pages for parents and tutors, a How It Works explanation, Solutions, pricing, resources and editorial content. The quiz turns broad interest into a more specific learning need, one readable question at a time; it is a designed flow, not an evaluated matching algorithm.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.site, screens: [tq.websiteParents, tq.websiteTutors, tq.websiteHowItWorks, tq.websiteSolutions, tq.websiteCost] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.quiz, screens: [tq.websiteQuizStart, tq.websiteQuizSubject, tq.websiteQuizPreferences] },
          { kind: "device", screens: [tq.websiteQuizMobile] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.site, screens: [tq.websiteResources, tq.websiteAcademy, tq.websiteAbout] },
        ],
      },
      {
        id: "entry", label: "Entry", title: "Start differently for each role",
        body: "Sign-up asks which role someone is taking, then branches into a setup that makes sense for them. Parents add child information and teaching preferences, students set goals and learning preferences, and tutors describe subjects, rates and availability before verification. The recovery state shows that entry was designed beyond the ideal path.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.authRole, tq.authOtp, tq.authRecovery] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.parentChildSetup, tq.parentLearningPreferences, tq.parentPermissions, tq.parentRecommendations] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.studentAvatar, tq.studentGoalsSetup, tq.studentPreferences] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorSubjects, tq.tutorRates, tq.tutorAvailabilitySetup, tq.tutorVerification, tq.tutorVerificationPending] },
        ],
      },
      {
        id: "find", label: "Find", title: "Make tutor choice understandable",
        body: "Parent search exposes subject, time, price and special-preference filters. A profile provides the deeper context; comparison lets a parent consider candidates on the same dimensions before booking. The file also includes an AI-assisted search state, shown here as a designed interface rather than a claim about search quality. A no-results state gives a route back to adjusting criteria.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorSearch, tq.tutorSearchPreferences, tq.tutorSearchAi, tq.tutorNoResults] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorProfile, tq.tutorCompare] },
          { kind: "images", images: [tq.detailTutorComparison] },
        ],
      },
      {
        id: "book", label: "Book", title: "Carry a decision through both sides",
        body: "Booking needs to connect a child, tutor, subject, date, time and payment choice without losing context. The parent flow covers a trial and a recurring schedule; the tutor then sees a request to review and accept. Calendar and rescheduling screens extend that decision into ongoing coordination. The UI shows designed payment and protection copy, not a verified operational guarantee.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.bookingChild, tq.bookingTime, tq.bookingRecurring, tq.bookingConfirm] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorAcceptBooking, tq.tutorBookingAccepted, tq.tutorCalendar, tq.tutorAvailability, tq.parentReschedule] },
          { kind: "images", images: [tq.detailBookingTime] },
        ],
      },
      {
        id: "classroom", label: "Classroom", title: "Put the lesson tools in reach",
        body: "The waiting room gives people time to prepare. During a lesson, video, chat, materials and a shared whiteboard sit within the same classroom. The whiteboard state shows how the drawing tools and attached material support explanation; the end state hands the tutor toward feedback and homework.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.classroomActive, tq.classroomWaiting, tq.classroomWhiteboard, tq.classroomMaterials, tq.classroomChat, tq.classroomComplete] },
          { kind: "images", images: [tq.detailWhiteboard, tq.classroomDrawing] },
        ],
      },
      {
        id: "review", label: "Review", title: "Make the lesson useful after the call",
        body: "The lesson summary is a place to return for feedback, assigned work and attached materials. Recording, transcript and key-moment views let a family review the session from different angles. These screens include an AI-summary design; it is shown for its place in the experience, not as a claim about transcription accuracy or learning outcomes.",
        figures: [{ kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.lessonSummary, tq.lessonTranscript, tq.lessonMoments, tq.studentLessonSummary] }],
      },
      {
        id: "homework", label: "Homework", title: "Close the loop across tutor and student",
        body: "The tutor can choose a task type, prepare instructions and materials, and reuse a preset. The student sees the task, submits work, and receives feedback after review. Text, reading and whiteboard submissions show that the workflow supports different kinds of learning, while the same status language carries the task across roles.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.homeworkAssign, tq.homeworkTextCreate, tq.homeworkPresets] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.homeworkList, tq.homeworkSubmit, tq.homeworkReview, tq.homeworkFeedback] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.homeworkReading, tq.homeworkWhiteboard] },
          { kind: "images", images: [tq.detailHomeworkList, tq.detailHomeworkFeedback] },
        ],
      },
      {
        id: "progress", label: "Progress", title: "Show what the work adds up to",
        body: "Student and parent progress views answer related but different questions: what has the student done, and what should the family understand or act on? Subject views, goals, badges and streaks give the work a visible history. These are designed feedback signals; the case does not claim they improved motivation or retention.",
        figures: [{ kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.studentProgress, tq.parentProgress, tq.parentGoals, tq.studentSubjectProgress, tq.studentStreak, tq.studentBadges] }],
      },
      {
        id: "library", label: "Library", title: "Keep material available between lessons",
        body: "The tutor library organises uploaded resources and supports sharing into teaching or homework. The student library provides a place to revisit material, while Academy offers a separate guided content path. The upload alert shows how the flow handles a blocked file.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorLibrary, tq.libraryUpload, tq.libraryUploadAlert, tq.studentLibrary] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.academyHome, tq.academyLesson] },
        ],
      },
      {
        id: "messages", label: "Messages", title: "Keep questions close to their context",
        body: "Messaging supports conversations with tutors, child-based organisation for a parent, and questions about homework for a student. Notifications bring time-sensitive work back into view; tutor auto-response settings support expectations around availability.",
        figures: [{ kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorMessages, tq.parentMessages, tq.studentQuestion, tq.tutorAutoResponse, tq.studentNotifications] }],
      },
      {
        id: "tutor-work", label: "Tutor work", title: "Give tutors tools beyond the live lesson",
        body: "A tutor manages students, goals, reusable materials, profile services, reviews and payouts. These screens make the teaching practice visible as ongoing work: preparation before a lesson, follow-up afterward, and the business details around both. Parent payment and invoice views show the other side of the same transaction, with example amounts retained from the design.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorStudents, tq.tutorStudentGoals, tq.tutorServices, tq.tutorReviews] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorPayouts, tq.parentPayments, tq.parentInvoice] },
        ],
      },
      {
        id: "trust", label: "Trust", title: "Give difficult situations a clear route",
        body: "The platform includes tutor verification and student safeguarding entry points, plus dispute states seen by both a parent and tutor. These flows need clear status, context and consequences; the admin view shows where an issue can be reviewed. The designs show intended handling paths, without claiming legal compliance or operational outcomes.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.tutorVerification, tq.tutorVerificationPending, tq.studentSafeguarding, tq.studentSafeguardingConfirm] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.parentDispute, tq.tutorDispute, tq.adminDispute] },
        ],
      },
      {
        id: "admin", label: "Admin", title: "Give the operations team its own workspace",
        body: "The admin panel is a fourth role with its own priorities. A dashboard and analytics show activity; user and tutor management support account review; the verification queue brings evidence and decisions together. Bookings, disputes, safeguarding, payments and refunds provide routes for exceptions. CMS and staff permissions show how content and access are maintained.",
        figures: [
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.adminDashboard, tq.adminUsers, tq.adminTutors, tq.adminVerification, tq.adminVerificationDetail, tq.adminVerificationReject] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.adminBookings, tq.adminBookingDetail, tq.adminDispute, tq.adminSafeguarding] },
          { kind: "browser", frame: "bare", ratio: TQ_RATIO.app, screens: [tq.adminPayments, tq.adminRefund, tq.adminAnalytics, tq.adminCms, tq.adminPermissions, tq.adminTeam] },
        ],
      },
      {
        id: "responsive", label: "Responsive", title: "Adapt the work to smaller screens",
        body: "The files include mobile versions of key platform screens. The value is in how priorities and controls are reorganised, not in shrinking the desktop image: the calendar, classroom, whiteboard and messages each pair with their mobile layout.",
        figures: [{ kind: "responsive", frame: "bare", ratio: TQ_RATIO.app, web: [tq.tutorCalendar, tq.classroomActive, tq.classroomWhiteboard, tq.tutorMessages], mobile: [tq.mobileCalendar, tq.mobileClassroom, tq.mobileWhiteboard, tq.mobileMessages] }],
      },
      {
        id: "system", label: "System", title: "Make a large product feel related across roles",
        body: "The design system includes general foundations and product-specific parts. Homework cards, progress summaries, calendar events and classroom controls are the parts these journeys rely on most, and they keep role-specific screens coherent while supporting different states. Four of them are rebuilt here to try, from their source variants, with sample data only.",
        figures: [
          { kind: "components", demos: ["tutor-iq/homework-card", "tutor-iq/progress-card"] },
          { kind: "component", demo: "tutor-iq/calendar" },
          { kind: "component", demo: "tutor-iq/classroom-toolbar" },
        ],
      },
      {
        id: "closing", label: "Closing", title: "One product, many handoffs",
        body: "Tutor IQ required the public story, the learning journey and the operational tools to work as parts of one product. The case shows the breadth of those designed experiences and the detail of their handoffs. Launch coverage, adoption and measured outcomes need separate confirmation.",
      },
    ],
    next: { slug: "luminasset", title: "LuminAsset", summary: "A months-long solar install, one clear step at a time" },
  },
  {
    // Peach Health, a small UI case from the Peach Health section of Oleh's Figma portfolio file (25 Oct 2026): a personal
    // concept, Oleh as Product Designer. Every one of the section's 26 screens appears below. The copy describes the
    // visible interface only: no research, users, results or dates are claimed. Names, medicines and AI answers are sample content. Notes: docs/cases/peach-health.md.
    slug: "peach-health",
    title: "A calm interface for everyday health.",
    intro: "Peach Health is a personal concept I designed as Product Designer: one mobile app for daily health tasks, medication reminders and AI health agents. Health apps easily feel clinical or crowded, so the interface leans the other way: soft neutrals, a mint accent, serif headlines, rounded cards and one decision per screen. This case is about the UI, from the first screen to the settings.",
    introHighlight: { text: "one decision per screen" },
    hero: { kind: "device", frame: "row", screens: [ph.start, ph.home, ph.agents] },
    chapters: [
      {
        id: "brand", label: "Brand", title: "A soft mark for a serious subject",
        body: "The peach heart mark carries the brand from the loading screen to the end of onboarding. A blue-to-mint gradient and frosted glass give the start screen depth, while sign-in stays to three plain choices. The same mark returns, larger, when setup is complete.",
        figures: [{ kind: "device", frame: "row", screens: [ph.loading, ph.start, ph.complete] }],
      },
      {
        id: "onboarding", label: "Onboarding", title: "Setup in short, skippable steps",
        body: "Five steps build a health profile: goals, basic medical data, allergies, permissions and accessibility. Each step has a large serif title, one short explanation and a single primary button, with Skip always available. Allergies open as a sheet of chips grouped by type, and permissions explain what each one is for.",
        figures: [{ kind: "device", frame: "row", screens: [ph.onboardingGoals, ph.onboardingProfile, ph.onboardingAllergies, ph.onboardingPermissions, ph.onboardingAccessibility] }],
      },
      {
        id: "home", label: "Home", title: "The day at a glance",
        body: "Home opens on a week strip and today's tasks: a mood check, medicines, an appointment and an inhaler, each with its own icon and time. Tasks tick off in place, and quick actions below lead to summaries and AI prompts. A lock-screen notification brings a reminder back into the app.",
        figures: [{ kind: "device", frame: "row", screens: [ph.home, ph.homeReminders, ph.lockScreen] }],
      },
      {
        id: "check-ins", label: "Check-ins", title: "One question at a time",
        body: "Check-ins rise as a sheet over the home screen and ask a single question, counted 1 of 3. Mood uses a dial of faces with a clear Confirm, while medicine questions show the dose and schedule above a large Yes. Remind me later keeps every check-in easy to postpone.",
        figures: [{ kind: "device", frame: "row", screens: [ph.moodSelected, ph.pillCheck, ph.medsCheck] }],
      },
      {
        id: "agents", label: "AI agents", title: "Specialist agents, one conversation",
        body: "AI help is organised as agents with clear jobs, like a medication assistant or a document decoder, alongside pinned and recent chats. A new chat starts from the brand mark and a short prompt. Answers come back as readable results with follow-up actions, such as saving the answer to a document.",
        figures: [{ kind: "device", frame: "row", screens: [ph.agents, ph.chats, ph.chatNew, ph.chat] }],
      },
      {
        id: "medications", label: "Medications", title: "A medication kit you can see",
        body: "Medicines sit in a circular kit of 3D icons, so a pill, an inhaler or a bottle is recognisable before its name is read. Each medicine opens to a large illustration with the pills left and its schedule, and a refill sheet uses a single stepper and an Add button.",
        figures: [{ kind: "device", frame: "row", screens: [ph.medsKit, ph.medDetail, ph.medRefill] }],
      },
      {
        id: "settings", label: "Settings", title: "Light, dark and adjustable",
        body: "Settings group the account, documents, devices, privacy and notifications in simple lists. Accessibility & App adjusts text size and adds a dark theme, screen reader support, high contrast and reduced motion. The same screen in both themes shows the palette holding up in the dark.",
        pair: [
          { media: { kind: "device", screens: [ph.settings] } },
          { media: { kind: "compare", frame: "device", before: { ...ph.accessibilityLight, label: "Light" }, after: { ...ph.accessibilityDark, label: "Dark" } } },
        ],
      },
    ],
    next: { slug: "dangdi", title: "Dangdi", summary: "A local feed for a new city" },
  },
  {
    // Dangdi, a small UI case from the "Finish: Design Concepts" page of the Dangdi design file (25 Oct 2026), made the same
    // way as Peach Health. Every concept on the page appears except the accent colours (left out on 26 Oct): the Chinese version, the photo concept at three
    // times of day (and in Chinese), the Black scroll states and the four asset boards. Green, Coral and Chinese scroll states
    // are covered by their full-length screens. The copy describes the visible UI and the file's own notes ("local", "your
    // own bubble"); no research, users, results, role or dates are claimed. Notes: docs/cases/dangdi.md.
    slug: "dangdi",
    title: "A local feed for a new city.",
    intro: "Dangdi (当地) means \"local\". It is a community app for Chinese newcomers in Copenhagen, and its home screen gathers what a new arrival looks for: people with shared interests, useful articles, events, places to eat and local offers. Dangdi AI acts as the app's own local guide. This case is about the interface and the concepts explored for it.",
    introHighlight: { text: "the app's own local guide" },
    hero: { kind: "device", frame: "row", screens: [dd.black, dd.photoDay, dd.photoNight] },
    chapters: [
      {
        id: "home", label: "Home", title: "One feed for a new city",
        body: "The home screen is a single long feed. A row of 3D icons switches between Home, News, Read, Food and Places, and each section that follows is a horizontal shelf with its own See All: For You, top articles, people, events, places nearby and offers. A floating bar keeps create, explore, community and search within reach at every scroll position.",
        figures: [
          { kind: "device", frame: "row", screens: [dd.scroll1, dd.scroll2, dd.scroll3, dd.scroll4, dd.scroll5, dd.scroll6, dd.scroll7] },
        ],
      },
      {
        id: "language", label: "Language", title: "Designed for Chinese as well as English",
        body: "A Simplified Chinese version runs through the whole feed, not just the headings. The same layout holds both languages, with shorter Chinese labels in the tabs, buttons and section titles.",
        figures: [
          { kind: "device", frame: "row", screens: [{ ...dd.black, label: "English" }, dd.chinese] },
        ],
      },
      {
        id: "photo", label: "Photo concept", title: "A home that follows the time of day",
        body: "An experimental direction opens on a full-bleed street photo of the city with a greeting: What is Happening in Copenhagen. The photo changes with the time, from day at 13:41 to evening at 19:41 and night at 22:41, and the feed slides up over it. The concept was also laid out in Chinese.",
        figures: [
          { kind: "device", frame: "row", screens: [dd.photoDay, dd.photoEvening, dd.photoNight] },
          { kind: "device", screens: [dd.photoChinese] },
        ],
      },
      {
        id: "assets", label: "Assets", title: "Details made for the app",
        body: "Custom assets give the app its character. 3D navigation icons have active and inactive states, level medals come in numbered and locked states, and avatars sit in glass bubbles, inspired by the idea of \"your own bubble\": a familiar community that helps people feel at home in a new city. The Dangdi AI pill marks where the app's local AI appears.",
        figures: [{ kind: "images", images: [dd.navIcons, dd.medals, dd.avatars, dd.aiPill] }],
      },
    ],
    next: { slug: "luminasset", title: "LuminAsset", summary: "A months-long solar install, one clear step at a time" },
  },
];

/**
 * Showcase: every block, frame and option a case study can use, on one unlisted page (/cases/showcase), with the
 * LuminAsset screens as stand-ins. Not linked from the portfolio; it's for picking what goes into real cases.
 */
const demoUrl = "admin.homesolar.app";
caseStudies.push({
  slug: "showcase",
  name: "Showcase",
  year: "2026",
  duration: "Every block",
  title: "Every block a case study can use, on one page.",
  intro: "An unlisted page for picking what goes into a case. Each chapter shows one family of blocks: phone and web mockups, website and mobile together, compare, cursors, images, pairs, numbers rows of one to four figures, and highlights. The screens are stand-ins.",
  hero: { kind: "device", control: "player", screens: [lumin.estimate0, lumin.estimate50, lumin.estimate100, lumin.estimateSheet] },
  chapters: [
    {
      id: "phones", label: "Phones", title: "Four phone frames",
      body: "The dark phone is the default, with step tabs under it. The silver phone suits screens that read better on a light outline. The pair shows the next screen behind the current one. The row shows three screens of a flow at once and pages through longer flows in threes.",
      strong: "The dark phone is the default",
      highlight: { text: "pages through longer flows in threes" },
      numbers: [
        { value: "4", label: "Phone frames" },
        { value: "4", label: "Web frames" },
        { value: "2", label: "Website and mobile" },
        { value: "1", label: "Highlight style" },
      ],
      figures: [
        { kind: "device", screens: [lumin.start, lumin.postcode, lumin.address, lumin.calculating] },
        { kind: "device", frame: "silver", control: "player", screens: [lumin.estimate0, lumin.estimate50, lumin.estimate100] },
        { kind: "device", frame: "pair", screens: [lumin.councilFee, lumin.gridAction, lumin.installation, lumin.live] },
        { kind: "device", frame: "row", screens: [
          { ...lumin.postcode, label: "Find the roof" }, lumin.calculating, lumin.estimate50,
          { ...lumin.bank, label: "Pay the fee" }, lumin.review, lumin.received,
        ] },
      ],
    },
    {
      id: "web", label: "Web", title: "Four web frames",
      body: "Safari is the default, with the project's address in the field. The bare window has no chrome, the laptop puts the page on a MacBook, and the window sits on a light grey ground with a minimal bar. Desktop screens switch without a dissolve. The numbers above use the before-after layout, for a change worth showing.",
      highlight: { text: "for a change worth showing" },
      numbersLayout: "before-after",
      numbers: [
        { from: "12", value: "7", label: "Stages a customer sees" },
        { from: "9", value: "4", label: "Admin step types" },
        { from: "6", value: "3", label: "Process templates" },
      ],
      figures: [
        { kind: "browser", url: demoUrl, screens: [luminAdmin.dashboard, luminAdmin.applications, luminAdmin.application] },
        { kind: "browser", frame: "bare", screens: [luminAdmin.applications, luminAdmin.application] },
        { kind: "browser", frame: "laptop", screens: [luminAdmin.dashboard, luminAdmin.application] },
        { kind: "browser", frame: "window", screens: [luminAdmin.dashboard, luminAdmin.applications] },
      ],
    },
    {
      id: "responsive", label: "Responsive", title: "Website and mobile, stepping together",
      body: "The site in Safari and its mobile version on a phone, side by side; both change screens together. It also comes without browser chrome. A numbers row can hold one to four figures; this one has two.",
      numbers: [
        { value: "2", label: "Frames for website and mobile" },
        { value: "1:1", label: "Web and mobile screens stepping together" },
      ],
      figures: [
        { kind: "responsive", url: demoUrl, web: [luminAdmin.dashboard, luminAdmin.applications, luminAdmin.application], mobile: [lumin.councilFee, lumin.gridAction, lumin.live] },
        { kind: "responsive", frame: "bare", web: [luminAdmin.applications, luminAdmin.application], mobile: [lumin.installation, lumin.live] },
      ],
    },
    {
      id: "compare", label: "Compare", title: "Before and after, under one handle",
      body: "Both screens sit in one mockup, Safari or a phone, and the divider runs across the whole frame. With a mouse it follows the pointer, no click needed; on touch you drag it. It nudges once when it comes into view. This chapter's numbers row has three figures.",
      numbers: [
        { value: "2", label: "Mockups to compare in" },
        { value: "100%", label: "Of the frame the divider spans" },
        { value: "0", label: "Clicks needed with a mouse" },
      ],
      figures: [
        { kind: "compare", url: demoUrl, before: luminAdmin.dashboard, after: luminAdmin.applications },
        { kind: "compare", frame: "device", before: lumin.estimate0, after: lumin.estimate100 },
      ],
    },
    {
      id: "live", label: "Live component", title: "A component to try, with its code",
      body: "A rebuilt component, live in the page: drag the ruler and the roof fills, the figures follow. The tabs along the bottom jump between states, and the Code tab shows the file that runs it, with a copy button.",
      figures: [{ kind: "component", demo: "luminasset/system-size-slider" }],
    },
    {
      id: "system", label: "Design system", title: "The system, to try",
      body: "Each component gets its own frame, with its styles as tabs underneath: hold the button to press it, tap it for loading, switch Disabled. Then the tokens two ways: as Figma's Variables panel, with Colour, Type, Spacing, Radius and Effects as collections and their groups in the sidebar, and as a screen of the app in a phone. Click any value to copy it.",
      numbers: [
        { value: "26", label: "Colour tokens" },
        { value: "10", label: "Type styles in Geist" },
        { value: "7 × 4", label: "Button styles × states" },
      ],
      figures: [
        { kind: "component", demo: "luminasset/button" },
        { kind: "component", demo: "luminasset/variables" },
        { kind: "component", demo: "luminasset/tokens-phone" },
      ],
    },
    {
      id: "cursors", label: "Cursors", title: "Someone pointing at the detail",
      body: "Any block can carry a named cursor. One glides between points with a short note; the other drags out a selection box, as if marking an area in Figma. One or two per case at most.",
      figures: [
        { kind: "browser", frame: "window", screens: [luminAdmin.application], annotation: { kind: "cursor", name: "Oleh", note: "One button per stage", points: [[30, 40], [62, 56], [70, 30]] } },
        { kind: "device", screens: [lumin.estimate50], annotation: { kind: "draft", name: "Oleh", points: [[38, 30], [62, 52]] } },
      ],
    },
    {
      id: "media", label: "Image", title: "Finished images",
      body: "An image block takes any finished composition and sits framed inside the grey, at its own proportions. A single figure can stand alone in a numbers row too.",
      numbers: [{ value: "1", label: "Image, at its own proportions" }],
      figures: [
        { kind: "image", src: "/cases/luminasset/components.png", alt: "Sample component sheet" },
      ],
    },
    {
      id: "pair", label: "Pair", title: "Two moments side by side",
      body: "A pair puts two figures next to each other, each with its own label, title and line of copy. Their phones line up even when the copy runs to different lengths.",
      pair: [
        { label: "Left", title: "Short copy", body: "One line.", media: { kind: "device", screens: [lumin.councilFee] } },
        { label: "Right", title: "Longer copy on this side", body: "This one runs to two or three lines, to show that the figures still line up with each other underneath.", media: { kind: "device", frame: "silver", screens: [lumin.tooltip] } },
      ],
    },
    {
      id: "results", label: "Results", title: "A text-only chapter to close",
      body: "The last chapter usually has no figures: what changed, in a sentence or two. The like button sits in the details row at the top, and the next project link follows below.",
      strong: "what changed, in a sentence or two",
    },
  ],
  next: { slug: "luminasset", title: "LuminAsset", summary: "The real case these screens come from" },
});

export const caseStudyOf = (slug: string) => caseStudies.find(study => study.slug === slug);

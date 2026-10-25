# Snoozeband

> **As built, 24 Oct 2026.** The revised case file, saved as given; it matches the site: `src/content/case-studies.ts`, `src/content/project-slides.ts`, `src/content/snoozeband-media.ts`, images in `public/cases/snoozeband/`. Differences from the file below:
> - My role and Timeline are left empty on the slide (shown as a dash) until confirmed.
> - The slug is `snoozeband` (the earlier placeholder was `snooze-band`), so the home anchor is `/#snoozeband`.

## 1. Basics

Slug: snoozeband
Title: Snoozeband
Group: Mobile
Placement: featured
Format: Mobile App
Icon: Moon

## 2. Case overview

Headline: Bedtime listening, from setup to replay.
Overview: A mobile app design for sleep flows, ambient sounds, stories, and meditations. The experience connects guided setup, audio discovery, playback, saved listening, and activity summaries.
Industry: Wellness / Audio
Case study: yes

Media:
1. device · tabs — home.png "Home" (long: home-full.png), player.png "Player", library.png "Library" (long: library-full.png), insights.png "Insights" (long: insights-full.png)
   frame: dark
   caption: Discover audio, listen, save tracks, and review activity. Sample designs.

## 3. Case study

Title: From finding a sound to a bedtime routine.
Intro: Snoozeband brings audio discovery and bedtime listening into a dark mobile interface. The designs start with a guided setup, then connect sound collections, sleep flows, playback, and a personal library. Insights and reminder settings extend the experience beyond choosing a track.

Hero: device · frame: row — home.png "Discover" (long: home-full.png), player.png "Listen", insights.png "Review" (long: insights-full.png)

Chapter — Setup · Starting with the person's routine
Text: Onboarding asks about goals, sleep habits, and what keeps someone awake, then introduces bedtime and reminder settings. A progress bar connects the questions, while optional steps offer a skip action. The sequence ends with a preparation screen and account-creation choices.
Figures: device · frame: row — welcome.png "Welcome", onboarding-name.png "Name", onboarding-goals.png "Goals" (long: onboarding-goals-full.png), onboarding-sleep-trouble.png "Sleep difficulties", onboarding-sleep-quality.png "Sleep quality", onboarding-falling-asleep.png "Falling asleep", onboarding-sleep-duration.png "Sleep duration", onboarding-night-waking.png "Night waking", onboarding-awake-reasons.png "What keeps you awake", onboarding-bedtime.png "Bedtime", onboarding-reminder.png "Reminder", onboarding-referral.png "Discovery source", onboarding-gender.png "Gender", onboarding-age.png "Age", onboarding-personalising.png "Preparation", create-account.png "Create an account"

Chapter — Discover · Several ways to find a sound
Text: Home introduces a featured track and groups audio into sleep flows, noise, stories, meditations, and binaural beats. Collections bring related sounds together, while search provides another route into the catalogue. The sound-detail screen keeps artwork, a description, and a play action together.
Figures: device · frame: row — home.png "Home" (long: home-full.png), collection.png "Noise collection" (long: collection-full.png), sound.png "Sound detail", search.png "Search results", search-empty.png "Search prompt"

Chapter — Flows · A listening sequence, ready to start
Text: Sleep Flows presents themed sequences separately from individual sounds. Opening one shows its track list, favourite and download actions, and a Start Sleep Flow button with a total duration. The scrolled state keeps the start action available while more tracks are visible.
Figures: device · frame: row — sleep-flows.png "Browse flows" (long: sleep-flows-full.png), sleep-flow.png "Open a flow", sleep-flow-scroll.png "Scroll the track list"

Chapter — Player · The sound takes the lead
Text: Full-screen landscape imagery gives the track a visual setting, with a large pause button and a progress bar below. Secondary controls include repeat, favourites, and a sleep timer; the options menu groups playlist and download actions. The timer offers a set duration or the end of the current audio while keeping the player visible behind it.
Figures: device · frame: row — player.png "Listening", player-options.png "Track actions", sleep-timer.png "Sleep timer"

Chapter — Library · Keeping sounds for another night
Text: The Library brings favourites, downloaded audio, and playlists into one place, with an entry point for creating a playlist. A playlist opens into a track list, and its menu exposes rename and delete actions. A separate confirmation appears before deletion, while an empty Library shows the starting structure.
Figures: device · frame: row — library-empty.png "Empty library", library.png "Library" (long: library-full.png), favorites.png "Favourites", playlist.png "Playlist", playlist-menu.png "Playlist actions", playlist-delete.png "Delete confirmation"

Chapter — Insights · A view of the listening routine
Text: Insights combines a listening milestone, the previous night's audio, and a weekly overview. The summary brings listening time, track counts, and a most-played selection together, with an action to play the previous audio again. The supplied designs also include a day without listening data and an empty starting view.
Figures: device · tabs — insights.png "Listening summary" (long: insights-full.png), insights-no-data.png "No data for a day", insights-empty.png "Getting started"

Chapter — Reminders · Setting a time to return
Text: Preferences provides access to a bedtime reminder, alongside log-out and delete-account actions. The reminder screens support choosing a time, returning to the saved setting, and adjusting or removing it later. This gives the routine a dedicated place outside onboarding.
Figures: device · frame: row — preferences.png "Preferences", set-reminder.png "Set a reminder", preferences-reminder.png "Reminder setting", manage-reminder.png "Adjust or remove"

Chapter — Access · Returning to an account
Text: Account creation offers email and Apple sign-up, while returning listeners have a separate sign-in screen. The password-recovery designs cover requesting an email, opening it, and entering a new password. These account screens sit alongside the listening experience rather than inside the player.
Figures: device · frame: row — create-account.png "Create an account", sign-in.png "Sign in", password-recovery.png "Request recovery", recovery-email.png "Open recovery email", new-password.png "New password", recovery-confirmation.png "Email acknowledgement"

## Internal handoff — do not render on the website

- **Overview: exactly one media card**, using `device · tabs` for Home, Player, Library, and Insights. Do not split these into separate overview frames.
- The expanded case covers every feature area visible in the two supplied pages: onboarding and assessment, catalogue discovery, collections, sound details, search, Sleep Flows, playback and timer controls, favourites/download entry points/playlists, Insights, reminder preferences, and account access/recovery. This is feature coverage, not an export of every duplicate or visual alternative.
- Use the existing phone, row, tabs, long-screen, and viewer patterns. Default to the dark phone. Keep every listed gallery screen, paging rows through in threes, with meaningful step labels. There are 16 onboarding screens, five discovery screens, three Sleep Flow screens, three player states, six library states, three Insights states, four preference/reminder screens, and six access screens. Some screens are reused between sections.
- The figures are related **design states**, not a recording or proof of implemented behavior. No new live demo, new block, fabricated flow, or playable/audio-connected app is required. Keep the paragraphs short; let the galleries carry the detail.
- Library includes a Create playlist entry point and a Downloaded row; the player has a download action. No standalone playlist-creation editor, rename form, downloaded-library page, or delete-account confirmation flow was supplied. Do not invent those screens or claim their full workflows are demonstrated.
- Insights uses the existing summary plus a no-data and an empty example. Other populated progress-indicator explorations remain excluded. Do not label the included views as tested alternatives or a proven improvement.
- Every visual remains **sample** pending permission; carry this into media metadata and the site's sample treatment. Counts, listening time, milestone totals, preparation percentages, health-oriented goals, and “Nights of better sleep” wording are source mockup content, not measured results or verified health benefits. The preparation screen does not establish a real recommendation engine.
- Role, screen ownership, collaborators' roles, overall duration/year, implemented scope, research, launch status, and outcomes are unconfirmed. Omit those fields and first-person design claims until confirmed. Do not add a results chapter or invented lessons to fill the gaps.
- Long screens have full native files and 852-pixel top crops. Use the existing `long()` helper for their full sources, Scrollable treatment, and full-length viewer. Preserve the full Home, Library, collection, Sleep Flows, goals, and Insights screens. For source states slightly shorter than the phone viewport, only blank bottom padding is added; no scaling is used.
- The package uses native **1×** PNG renders, as allowed by the updated template. Most screens are 393 pixels wide. Direct export downloads returned a web security challenge earlier in this session, so inline Figma renders were used. No artificial 2× enlargement or extra phone frame is baked into the images.
- Before fresh publication exports, resolve sample inconsistencies: the reminder picker shows a different time from Preferences; Library's favourites count differs from the populated favourites view; some recovery frames are dimmed and repeat an email acknowledgement rather than clearly confirming a password change. Keep the current labels descriptive and do not imply a verified end-to-end account flow.
- Before declaring these final screens, confirm which welcome and Insights variants were selected in the project. This package uses one welcome design and the existing populated Insights option, with supplied no-data/empty views. Figma was not edited.

### Deliverables and image descriptions

Use `snoozeband-images.zip` beside this MD. `asset-manifest.json` records the source node, actual dimensions, native source size, full-length partner where applicable, sample status, alt text, and any crop/padding. Review sheets are included for app, onboarding, and account screens; they are not public case figures.

Use each image's manifest alt text. Describe the visible UI with a “Sample Snoozeband” prefix; do not turn placeholder figures, sleep goals, download actions, or questionnaire answers into claims about results or working services. Full-length versions use the same alt subject as their viewport crop.

### Figma sources — retain both original links

- [Interface](https://www.figma.com/design/4fU0jv49P3SLbk9XGakH0V/Snoozeband?node-id=0-1&p=f&t=e0mOrcbKNlaacl08-11). Source sections: Home `2:2089`, Player `2:1470`, Library `3:246`, Insights `4039:3268`, Profile `22:1404`.
- [Onboarding and sign-in flow](https://www.figma.com/design/4fU0jv49P3SLbk9XGakH0V/Snoozeband?node-id=184-2084&p=f&t=e0mOrcbKNlaacl08-11). Source sections: onboarding `207:2745`, sign-in/recovery `207:2966`.

Individual frame IDs are in the manifest. Keep these links internal unless public sharing is approved. Other agents still need authorised Figma access.

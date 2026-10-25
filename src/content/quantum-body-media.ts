import type { CaseScreen } from "./project-slides";

/**
 * Quantum Body images (public/cases/quantum-body/), from the second quantum-body-images.zip (24 Oct 2026), shared by
 * the case slide and the case study. All are sample until permission. Personal details are masked and the commercial
 * parts withheld (the presentation's subscription section, the foot of poster 10, the trash screen's retention line);
 * keep these files rather than re-exporting from Figma, which would bring them back. App screens are 1x (402 wide);
 * long ones are a 874-high crop plus the full length in *-full.png. Alt text comes from the zip's asset-manifest.json.
 */
const dir = "/cases/quantum-body";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt });
/** A screen with its full-length export (file-full.png, `height` in px at 402 wide), which scrolls inside the phone. */
const long = (file: string, label: string, alt: string, height: number): CaseScreen => ({ ...screen(file, label, alt), full: { src: `${dir}/${file}-full.png`, ratio: height / 402 } });
const art = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.jpg`, label, alt });

export const qb = {
  // Onboarding and reminders
  onboarding: screen("onboarding", "Welcome", "Sample Quantum Body welcome screen"),
  onboardingPractices: screen("onboarding-practices", "Introduction", "Sample Quantum Body onboarding introduction"),
  onboardingIntroduction: screen("onboarding-introduction", "The journal", "Sample Quantum Body onboarding illustration of the journal practices"),
  reminders: screen("reminders", "Reminder settings", "Sample Quantum Body daily reminder settings"),
  reminderPicker: screen("reminder-picker", "Time sheet", "Sample Quantum Body time-selection sheet over reminder settings"),
  reminderSelected: screen("reminder-selected", "Reminder state", "Sample Quantum Body reminder settings state"),
  // Capture and the five practices
  newEntry: screen("new-entry", "Choose", "Sample Quantum Body five-practice selector"),
  manifestationForm: screen("manifestation-form", "Manifestation", "Sample Quantum Body manifestation entry form"),
  gratitudeForm: screen("gratitude-form", "Gratitude", "Sample Quantum Body gratitude entry form"),
  synchronicityForm: screen("synchronicity-form", "Synchronicity", "Sample Quantum Body synchronicity entry form"),
  dreamForm: screen("dream-form", "Dream", "Sample Quantum Body dream entry form"),
  intentionForm: screen("intention-form", "Intention", "Sample Quantum Body intention entry form"),
  leaveEntry: screen("leave-entry", "Save draft or discard", "Sample Quantum Body save-as-draft or discard prompt over an entry form"),
  editEntry: screen("edit-entry", "Edit", "Sample Quantum Body entry editor with status controls"),
  attachImage: long("attach-image", "One image", "Sample Quantum Body entry editor with one attached image", 980),
  twoImages: long("two-images", "Two images", "Sample Quantum Body entry editor with two attached images", 991),
  entryDetail: screen("entry-detail", "Read an entry", "Sample Quantum Body opened journal entry"),
  // Return: the Alignment Log and its states
  alignmentLog: screen("alignment-log", "Journal", "Sample Quantum Body Alignment Log with search and entry states"),
  searchResults: screen("search-results", "Search results", "Sample Quantum Body journal search with a matching entry"),
  searchEmpty: screen("search-empty", "No matches", "Sample Quantum Body journal search with no matching entries"),
  filters: screen("filters", "Filters", "Sample Quantum Body journal filter sheet"),
  logEmpty: screen("log-empty", "Empty journal", "Sample Quantum Body empty Alignment Log"),
  archive: screen("archive", "Archive", "Sample Quantum Body archived entries"),
  trash: screen("trash", "Trash", "Sample Quantum Body trash view with sample retention copy withheld"),
  // Guidance
  home: long("home", "Home", "Sample Quantum Body scrollable home page with daily content and entry shortcuts", 2184),
  education: long("education", "Guide", "Sample Quantum Body scrollable in-app writing guide", 2244),
  // Wireframes, in the md's order. The journal's full export is only 2px taller than the crop, so it isn't a long screen.
  wfIntroduction: screen("wf-introduction", "Introduction", "Sample Quantum Body wireframe introducing the journaling experience"),
  wfPractices: screen("wf-practices", "Five practices", "Sample Quantum Body wireframe introducing five practices"),
  wfReminders: long("wf-reminders", "Reminders", "Sample Quantum Body wireframe reminder settings", 997),
  wfHome: long("wf-home", "Home", "Sample Quantum Body wireframe home page", 991),
  wireframeForm: screen("wireframe-form", "Choose a practice", "Sample Quantum Body wireframe practice selector"),
  wfManifestation: screen("wf-manifestation", "Manifestation", "Sample Quantum Body wireframe manifestation form"),
  wfGratitude: screen("wf-gratitude", "Gratitude", "Sample Quantum Body wireframe gratitude form"),
  wfSynchronicity: screen("wf-synchronicity", "Synchronicity", "Sample Quantum Body wireframe synchronicity form"),
  wfDream: screen("wf-dream", "Dream", "Sample Quantum Body wireframe dream form"),
  wfIntention: screen("wf-intention", "Intention", "Sample Quantum Body wireframe intention form"),
  wireframeLog: screen("wireframe-log", "Journal", "Sample Quantum Body wireframe journal list"),
  wfEntry: screen("wf-entry", "Opened entry", "Sample Quantum Body wireframe opened journal entry"),
  wfEdit: screen("wf-edit", "Entry actions", "Sample Quantum Body wireframe entry actions"),
  wfArchive: screen("wf-archive", "Archive", "Sample Quantum Body wireframe archive"),
  wfTrash: screen("wf-trash", "Trash", "Sample Quantum Body wireframe trash view"),
  wfEducation: long("wf-education", "Education", "Sample Quantum Body wireframe education portal", 1210),
};

export const qbDribbble = [
  art("dribbble-cover", "Product cover", "Sample Quantum Body Dribbble product-cover composition"),
  art("dribbble-entry", "Active entries", "Sample Quantum Body Dribbble active-entry composition"),
  art("dribbble-journal", "Privacy-themed design", "Sample Quantum Body Dribbble privacy-themed artwork"),
];

/** The App Store set, in its left-to-right order on the canvas (not the Figma frame numbers). */
export const qbAppStore = [
  ["Product introduction", "product introduction"],
  ["Practice selector", "practice selector"],
  ["Daily guidance", "daily guidance"],
  ["Search and reflection", "search and reflection"],
  ["Practice guidance", "practice guidance"],
  ["Active entries", "active entries"],
  ["Privacy-themed design", "privacy-themed artwork"],
  ["Export design", "export-themed artwork"],
  ["Reminders", "reminders"],
  ["Welcome", "welcome artwork with commercial details withheld"],
].map(([label, subject], i) => art(`app-store-${String(i + 1).padStart(2, "0")}`, label, `Sample Quantum Body App Store poster: ${subject}`));

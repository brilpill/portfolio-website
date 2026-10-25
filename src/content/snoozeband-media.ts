import type { CaseScreen } from "./project-slides";

/**
 * Snoozeband screens (public/cases/snoozeband/), from the second snoozeband-images.zip (24 Oct 2026), shared by the case
 * slide and the case study. All sample until permission; counts, listening time, milestones, preparation percentages,
 * sleep goals and "Nights of better sleep" are mockup content, not results or health claims. 1x renders (393 wide, 852
 * high); long screens are a phone-height crop plus the full length in *-full.png. Alt text from asset-manifest.json.
 */
const dir = "/cases/snoozeband";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt });
/** A screen with its full-length export (file-full.png, `height` in px at 393 wide), which scrolls inside the phone. */
const long = (file: string, label: string, alt: string, height: number): CaseScreen => ({ ...screen(file, label, alt), full: { src: `${dir}/${file}-full.png`, ratio: height / 393 } });

export const snooze = {
  welcome: screen("welcome", "Welcome", "Sample Snoozeband welcome screen"),
  onboardingName: screen("onboarding-name", "Name", "Sample Snoozeband onboarding name entry"),
  onboardingGoals: long("onboarding-goals", "Goals", "Sample Snoozeband onboarding goal selection", 1002),
  onboardingSleepTrouble: screen("onboarding-sleep-trouble", "Sleep difficulties", "Sample Snoozeband onboarding question about sleeping difficulties"),
  onboardingSleepQuality: screen("onboarding-sleep-quality", "Sleep quality", "Sample Snoozeband onboarding sleep-quality question"),
  onboardingFallingAsleep: screen("onboarding-falling-asleep", "Falling asleep", "Sample Snoozeband onboarding question about falling asleep"),
  onboardingSleepDuration: screen("onboarding-sleep-duration", "Sleep duration", "Sample Snoozeband onboarding sleep-duration question"),
  onboardingNightWaking: screen("onboarding-night-waking", "Night waking", "Sample Snoozeband onboarding question about waking at night"),
  onboardingAwakeReasons: screen("onboarding-awake-reasons", "What keeps you awake", "Sample Snoozeband onboarding selection of factors keeping someone awake"),
  onboardingBedtime: screen("onboarding-bedtime", "Bedtime", "Sample Snoozeband onboarding bedtime picker"),
  onboardingReminder: screen("onboarding-reminder", "Reminder", "Sample Snoozeband onboarding reminder-time picker"),
  onboardingReferral: screen("onboarding-referral", "Discovery source", "Sample Snoozeband onboarding discovery-source question"),
  onboardingGender: screen("onboarding-gender", "Gender", "Sample Snoozeband onboarding gender question"),
  onboardingAge: screen("onboarding-age", "Age", "Sample Snoozeband onboarding age-range question"),
  onboardingPersonalising: screen("onboarding-personalising", "Preparation", "Sample Snoozeband sample preparation-progress screen"),
  createAccount: screen("create-account", "Create an account", "Sample Snoozeband account creation with email and Apple options"),
  home: long("home", "Home", "Sample Snoozeband home screen with featured audio and listening categories", 2379),
  collection: long("collection", "Noise collection", "Sample Snoozeband collection of noise sounds", 1466),
  sound: screen("sound", "Sound detail", "Sample Snoozeband individual sound detail and play action"),
  search: screen("search", "Search results", "Sample Snoozeband search results for sounds"),
  searchEmpty: screen("search-empty", "Search prompt", "Sample Snoozeband empty search prompt"),
  sleepFlows: long("sleep-flows", "Browse flows", "Sample Snoozeband Sleep Flows catalogue", 1526),
  sleepFlow: screen("sleep-flow", "Open a flow", "Sample Snoozeband opened sleep flow with a track list and start action"),
  sleepFlowScroll: screen("sleep-flow-scroll", "Scroll the track list", "Sample Snoozeband scrolled sleep-flow track list with a pinned start action"),
  player: screen("player", "Player", "Sample Snoozeband player with landscape artwork and playback controls"),
  playerOptions: screen("player-options", "Track actions", "Sample Snoozeband player menu with favourite, playlist, and download actions"),
  sleepTimer: screen("sleep-timer", "Sleep timer", "Sample Snoozeband sleep timer menu"),
  libraryEmpty: screen("library-empty", "Empty library", "Sample Snoozeband empty library"),
  library: long("library", "Library", "Sample Snoozeband library with favourites, downloads, a playlist, and sound cards", 974),
  favorites: screen("favorites", "Favourites", "Sample Snoozeband favourites list"),
  playlist: screen("playlist", "Playlist", "Sample Snoozeband opened playlist track list"),
  playlistMenu: screen("playlist-menu", "Playlist actions", "Sample Snoozeband playlist menu with rename and delete actions"),
  playlistDelete: screen("playlist-delete", "Delete confirmation", "Sample Snoozeband playlist deletion confirmation"),
  insights: long("insights", "Insights", "Sample Snoozeband Insights summary with sample milestones and weekly listening activity", 1032),
  insightsNoData: screen("insights-no-data", "No data for a day", "Sample Snoozeband Insights view without listening data for a day"),
  insightsEmpty: screen("insights-empty", "Getting started", "Sample Snoozeband empty Insights view inviting the listener to begin"),
  preferences: screen("preferences", "Preferences", "Sample Snoozeband preferences with reminder and account actions"),
  setReminder: screen("set-reminder", "Set a reminder", "Sample Snoozeband bedtime reminder time picker"),
  preferencesReminder: screen("preferences-reminder", "Reminder setting", "Sample Snoozeband preferences showing a reminder time"),
  manageReminder: screen("manage-reminder", "Adjust or remove", "Sample Snoozeband reminder management with save and delete actions"),
  signIn: screen("sign-in", "Sign in", "Sample Snoozeband sign-in form"),
  passwordRecovery: screen("password-recovery", "Request recovery", "Sample Snoozeband password-recovery email form"),
  recoveryEmail: screen("recovery-email", "Open recovery email", "Sample Snoozeband recovery-email acknowledgement"),
  newPassword: screen("new-password", "New password", "Sample Snoozeband new-password form"),
  recoveryConfirmation: screen("recovery-confirmation", "Email acknowledgement", "Sample Snoozeband email acknowledgement in the recovery design"),
};

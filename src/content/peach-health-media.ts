import type { CaseScreen } from "./project-slides";

/**
 * Peach Health screens (public/cases/peach-health/), exported 25 Oct 2026 at 2x (786 × 1704) from the Peach Health section
 * (4131:528603) of Oleh's Figma portfolio file, Playground page. All 26 screens of the section are here; names, dates,
 * medications, doses and AI answers are sample design content, not health advice or real data. The "Your chats" screen
 * was 9pt shorter and is padded at the bottom to the standard height.
 */
const dir = "/cases/peach-health";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt: `Peach Health ${alt}` });

export const ph = {
  loading: screen("loading", "Loading", "loading screen with the peach heart mark"),
  start: screen("start", "Start", "start screen with sign-in options"),
  onboardingGoals: screen("onboarding-goals", "Health goals", "onboarding step for choosing health goals"),
  onboardingProfile: screen("onboarding-profile", "Profile", "onboarding step for profile and medical data"),
  onboardingAllergies: screen("onboarding-allergies", "Allergies", "onboarding sheet for picking allergies"),
  onboardingPermissions: screen("onboarding-permissions", "Permissions", "onboarding step for permissions and documents"),
  onboardingAccessibility: screen("onboarding-accessibility", "Accessibility", "onboarding step for accessibility options"),
  complete: screen("complete", "All set", "onboarding complete screen"),
  home: screen("home", "Home", "home screen with today's tasks"),
  homeReminders: screen("home-reminders", "Tasks done", "home screen with today's tasks checked off"),
  lockScreen: screen("lock-screen", "Reminder", "medication reminder on the lock screen"),
  moodCheck: screen("mood-check", "Mood check", "daily mood check-in sheet"),
  moodSelected: screen("mood-selected", "Mood picked", "mood check-in with a mood selected"),
  pillCheck: screen("pill-check", "Pill taken?", "check-in asking whether a pill was taken"),
  medsCheck: screen("meds-check", "Inhaler taken?", "check-in asking whether an inhaler was used"),
  agents: screen("agents", "Health agents", "list of AI health agents"),
  chats: screen("chats", "Your chats", "list of AI chats"),
  chatNew: screen("chat-new", "New chat", "empty AI chat"),
  chat: screen("chat", "Chat", "AI chat explaining a medical term"),
  medsKit: screen("meds-kit", "Medication kit", "medication kit with 3D medicine icons"),
  medsKitTaken: screen("meds-kit-taken", "Edit kit", "medication kit with edit actions"),
  medDetail: screen("med-detail", "Medication", "medication detail with pills left"),
  medRefill: screen("med-refill", "Refill", "refill medication sheet"),
  settings: screen("settings", "Settings", "settings screen"),
  accessibilityLight: screen("accessibility-light", "Light", "accessibility settings in the light theme"),
  accessibilityDark: screen("accessibility-dark", "Dark", "accessibility settings in the dark theme"),
};

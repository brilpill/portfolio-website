import type { CaseScreen } from "./project-slides";

/**
 * Nearbor screens (public/cases/nearbor/), from nearbor-images.zip (25 Oct 2026), shared by the case slide and the case
 * study. Only the v3.0 Figma page supplies visuals. All sample: the people, places, records and care scenarios are design
 * content, not real customers or results. 375 × 812 at 1x with their own status bar; long screens add their full length
 * in *-full.png, which scrolls inside the phone. The two "detail" images are native crops from long screens.
 */
const dir = "/cases/nearbor";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt });
/** A screen with its full-length export (file-full.png, `height` in px at 375 wide). */
const long = (file: string, label: string, alt: string, height: number): CaseScreen => ({ ...screen(file, label, alt), full: { src: `${dir}/${file}-full.png`, ratio: height / 375 } });

export const nb = {
  home: screen("home", "Calendar", "Sample Nearbor home screen with the community calendar"),
  network: screen("network", "Community and groups", "Sample Nearbor network tab listing a community and its groups"),
  textSizeDefault: screen("text-size-default", "Default", "Sample Nearbor text-size setting with the preview message at the default size"),
  textSizeMedium: screen("text-size-medium", "Medium", "Sample Nearbor text-size setting with the preview message at the medium size"),
  textSizeLarge: screen("text-size-large", "Large", "Sample Nearbor text-size setting with the preview message at the large size"),
  quickStart: screen("quick-start", "Quick Start entry", "Sample Nearbor welcome screen with a Quick start button"),
  quickStartChoice: screen("quick-start-choice", "Choose a sign-up method", "Sample Nearbor Quick start sheet with sign-up options"),
  quickStartInvited: long("quick-start-invited", "Keep the invitation context", "Sample Nearbor screen showing the community a person was invited to", 1254),
  finishSetup: long("finish-setup", "Finish setup later", "Sample Nearbor profile with optional setup steps to finish later", 1407),
  syncProgress: screen("sync-progress", "Matching contacts", "Sample Nearbor screen while contacts are being matched"),
  syncMatches: screen("sync-matches", "People found", "Sample Nearbor contact-sync result listing people already on Nearbor"),
  syncNoMatches: screen("sync-no-matches", "No matches", "Sample Nearbor contact-sync result when no contacts are on Nearbor, with an invite action"),
  eventNoGroups: screen("event-no-groups", "A group is needed", "Sample Nearbor event creation explaining that a group is needed first"),
  contactsDenied: screen("contacts-denied", "Contact access is off", "Sample Nearbor screen offering an invitation link when contact access is off"),
  recurrence: long("recurrence", "Recurring schedule", "Sample Nearbor event schedule set to repeat weekly", 1452),
  editScope: screen("edit-scope", "One event or the series", "Sample Nearbor prompt asking whether a change applies to one event or the whole series"),
  recurrenceDetail: { src: `${dir}/recurrence-detail.png`, label: "Recurrence controls — source detail", alt: "Close-up of the sample Nearbor recurrence controls" },
  eventCoverage: { src: `${dir}/event-coverage.png`, label: "Role coverage — source detail", alt: "Close-up of sample Nearbor volunteer roles showing filled and open places" },
  volunteerRoles: screen("volunteer-roles", "Define roles", "Sample Nearbor event creation with volunteer roles added"),
  volunteerSignup: screen("volunteer-signup", "Choose how to help", "Sample Nearbor participant choosing a volunteer role"),
  eventOwner: long("event-owner", "Organiser overview", "Sample Nearbor organiser view of an event and its role coverage", 2460),
  pollCreate: screen("poll-create", "Ask the group", "Sample Nearbor Who's In? question being created in a group chat"),
  pollMember: screen("poll-member", "Respond in chat", "Sample Nearbor group member responding to a Who's In? question"),
  pollToEvent: screen("poll-to-event", "Turn interest into an event", "Sample Nearbor organiser turning Who's In? responses into an event"),
  careOverview: long("care-overview", "Available help", "Sample Nearbor care overview showing which tasks still need help", 1698),
  careHelp: screen("care-help", "Choose a task", "Sample Nearbor participant choosing a care task to help with"),
  careConfirmed: long("care-confirmed", "Your commitment", "Sample Nearbor care overview after signing up to help", 1304),
  provider: screen("provider", "First service record", "Sample Nearbor provider page before any service is logged"),
  serviceHistory: screen("service-history", "History", "Sample Nearbor provider service history"),
  logService: screen("log-service", "Log a service", "Sample Nearbor form for logging a service"),
  serviceReminder: screen("service-reminder", "Set a reminder", "Sample Nearbor reminder setting for a provider"),
  householdSharing: screen("household-sharing", "Choose what to share", "Sample Nearbor household sharing with a choice of providers"),
  communityConcept: long("community-concept", "Community channel — concept", "Sample Nearbor concept for a community announcements channel", 1442),
  announcementAudience: screen("announcement-audience", "Audience selection — concept", "Sample Nearbor concept for choosing an announcement's audience"),
  notificationsConcept: screen("notifications-concept", "Notification controls — concept", "Sample Nearbor concept for group notification controls"),
};

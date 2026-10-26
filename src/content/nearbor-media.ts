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
  finishSetup: long("finish-setup", "Finish setup later", "Sample Nearbor profile with optional setup steps to finish later", 1407),
  syncProgress: screen("sync-progress", "Matching contacts", "Sample Nearbor screen while contacts are being matched"),
  syncMatches: screen("sync-matches", "People found", "Sample Nearbor contact-sync result listing people already on Nearbor"),
  syncNoMatches: screen("sync-no-matches", "No matches", "Sample Nearbor contact-sync result when no contacts are on Nearbor, with an invite action"),
  recurrence: long("recurrence", "Recurring schedule", "Sample Nearbor event schedule set to repeat weekly", 1452),
  editScope: screen("edit-scope", "One event or the series", "Sample Nearbor prompt asking whether a change applies to one event or the whole series"),
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
  communityConcept: long("community-concept", "Community channel", "Sample Nearbor community channel with announcements", 1442),
  announcementAudience: screen("announcement-audience", "Audience selection", "Sample Nearbor audience selection for an announcement"),
  notificationsConcept: screen("notifications-concept", "Notification controls", "Sample Nearbor group notification controls"),
  // Added 26 Oct 2026 from the same v3.0 page: structure, home tabs, the new Discover, referral, event details, more of
  // Who's In?, notifications and updates.
  community: long("community", "Community", "Sample Nearbor community page with its groups", 1218),
  groupOwner: long("group-owner", "Group", "Sample Nearbor group page with its chat and events", 1121),
  eventParticipant: long("event-participant", "Event", "Sample Nearbor event page with details, attachments and participants", 2451),
  discover: screen("discover", "Discover", "Sample Nearbor Discover tab on the home screen"),
  rsvpSheet: screen("rsvp-sheet", "Are you going?", "Sample Nearbor RSVP sheet asking whether someone is going"),
  eventsGoing: screen("events-going", "Going", "Sample Nearbor calendar with an event marked as going"),
  createSheet: screen("create-sheet", "Create", "Sample Nearbor create sheet with event, care event and group"),
  locationAccess: screen("location-access", "Location", "Sample Nearbor Discover asking for location access"),
  discoverAll: long("discover-all", "Nearby", "Sample Nearbor Discover with nearby events, groups and communities", 1345),
  discoverFilters: screen("discover-filters", "Filters", "Sample Nearbor Discover filters for type, groups or communities, and distance"),
  discoverCommunity: screen("discover-community", "Community", "Sample Nearbor community page reached from Discover"),
  discoverGroup: screen("discover-group", "Group", "Sample Nearbor group page with a join request sent"),
  discoverEvent: screen("discover-event", "Event", "Sample Nearbor event page with a request to join"),
  referralProfile: long("referral-profile", "Your code", "Sample Nearbor profile with the referral code", 1055),
  referralFilled: screen("referral-filled", "Enter a code", "Sample Nearbor referral code sheet"),
  referralScan: screen("referral-scan", "Scan a QR", "Sample Nearbor QR code scanner"),
  referralError: screen("referral-error", "No match", "Sample Nearbor referral code with no matching person"),
  referralHome: screen("referral-home", "Empty home", "Sample Nearbor empty home with a referral code entry"),
  referralDiscover: screen("referral-discover", "In Discover", "Sample Nearbor Discover with a referral code banner"),
  needsItems: screen("needs-items", "What to bring", "Sample Nearbor event creation listing what people should bring"),
  itemLog: screen("item-log", "Pick an item", "Sample Nearbor participant choosing what to bring"),
  itemLogSelected: screen("item-log-selected", "You're bringing", "Sample Nearbor participant with an item selected"),
  imagesUploaded: long("images-uploaded", "Photos and files", "Sample Nearbor event photos and files uploaded", 843),
  imagePreview: screen("image-preview", "Photo", "Sample Nearbor full-screen photo preview"),
  filePreview: screen("file-preview", "File", "Sample Nearbor full-screen file preview"),
  markAttendance: screen("mark-attendance", "Mark attendance", "Sample Nearbor notification asking who came to an event"),
  attendanceSheet: screen("attendance-sheet", "Who came?", "Sample Nearbor attendance sheet"),
  attendanceSaved: screen("attendance-saved", "Attendance saved", "Sample Nearbor event with attendance saved"),
  whosinAsk: screen("whosin-ask", "Ask who's in", "Sample Nearbor Who's In? question being written"),
  whosinDate: screen("whosin-date", "Set a date", "Sample Nearbor Who's In? date picker"),
  whosinTime: screen("whosin-time", "Set a time", "Sample Nearbor Who's In? time picker"),
  whosinLocation: screen("whosin-location", "Location", "Sample Nearbor Who's In? location search"),
  whosinImIn: screen("whosin-im-in", "I'm in", "Sample Nearbor member answering I'm in"),
  whosinAdmin: screen("whosin-admin", "Organiser view", "Sample Nearbor organiser view of Who's In? answers"),
  whosinEventCreated: screen("whosin-event-created", "Event created", "Sample Nearbor chat after Who's In? became an event"),
  notifications: screen("notifications", "New", "Sample Nearbor notifications with join and provider requests"),
  notificationsArchived: screen("notifications-archived", "Archived", "Sample Nearbor archived notifications"),
  notificationSettings: screen("notification-settings", "Settings", "Sample Nearbor notification settings by community and group"),
  notificationSettingsCommunity: screen("notification-settings-community", "Per community", "Sample Nearbor notification settings for one community"),
  updateAvailable: screen("update-available", "Update available", "Sample Nearbor update available pop-up"),
  whatsNew: screen("whats-new", "What's new", "Sample Nearbor What's New sheet"),
  updateRequired: screen("update-required", "Update required", "Sample Nearbor update required screen"),
};

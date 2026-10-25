import type { CaseScreen } from "./project-slides";

/**
 * LuminAsset screens (public/cases/luminasset/), shared by the case slide and the case study.
 * All of them are sample until HotShots Labs or the client clears public use. The client's own name appears in
 * none of the copy or alt text, though the product name and logo show. Phone screens from the 24 October export are
 * 2x (786 × 1704); tall ones are cropped to the phone, with the full length in *-full.png. Admin screens are 2028 × 1193.
 */
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `/cases/luminasset/${file}.png`, label, alt });
/** A screen with its full-length export (file-full.png, `height` in px at 786 wide), which scrolls with the page. */
const long = (file: string, label: string, alt: string, height: number): CaseScreen => ({ ...screen(file, label, alt), full: { src: `/cases/luminasset/${file}-full.png`, ratio: height / 786 } });

export const lumin = {
  // From the 24 October export (Figma page ↪ 1.0, wireframes ↪ 3.0 Final).
  estimateFetched: screen("estimate-fetched", "Estimate", "Estimate on the real aerial photo of the roof, with panels drawn on it and the size ruler below"),
  estimateManual: screen("estimate-manual", "Manual estimate", "Fallback estimate: the system drawn as blocks on a grid when there's no roof data"),
  howItWorks: long("how-it-works", "How it works", "How it works: each stage of the install and why it takes the time it does", 4290),
  register: screen("register", "Register", "Register screen, after the estimate"),
  otp: screen("otp", "Confirm", "Six-digit code to confirm the email"),
  ownership: screen("ownership", "Owner?", "One question: do you own the home or rent it"),
  ownerForm: long("owner-form", "Owner", "Short application for owners", 2606),
  tenantForm: long("tenant-form", "Tenant", "Tenant form asking for the landlord's details", 3470),
  purchaseOption: screen("purchase-option", "Choose", "Choosing how to pay: direct purchase or free installation"),
  directSummary: screen("direct-summary", "Direct", "Direct purchase summary with staged payments"),
  ppaSummary: screen("ppa-summary", "PPA", "Free installation summary: no upfront cost, buy the power"),
  trackerDirect: long("tracker-direct", "Direct", "Order tracker for a direct purchase", 3276),
  trackerGrid: screen("tracker-grid", "Grid", "Tracker at the grid connection stage"),
  landlordAgreed: screen("landlord-agreed", "Landlord OK", "The landlord has agreed to the installation"),
  councilFeeStep: screen("council-fee", "Council fee", "The council fee step, with one button to pay"),
  tooltipStage: screen("tooltip", "Tooltip", "One-line tooltip explaining why a stage takes so long"),
  actions: screen("actions", "Actions", "Order actions in one sheet: edit, switch plan, ask, cancel"),
  changeType: screen("change-type", "Switch plan", "Switching between direct purchase and free installation"),
  cancel: screen("cancel", "Cancel", "Cancelling an order, with the refund shown before anything is final"),
  myOrders: long("my-orders", "My orders", "My orders: every home with the one thing it's waiting for", 3192),
  addressAdd: screen("address-add", "Add address", "Adding another home's address"),
  addressEstimate: screen("address-estimate", "Estimate", "Estimate for the second home"),
  orderDetails: screen("order-details", "Details", "Order details for one home"),
  monitoring: screen("monitoring", "Monitoring", "Monitoring: what the panels generate today and what that saved"),
  documents: screen("documents", "Documents", "Every document for the system in one place"),
  help: long("help", "Help", "Help and support", 4446),
  contact: screen("contact", "Contact", "Contact us form"),
  enableNotifications: screen("enable-notifications", "Notifications", "Asking to send notifications once the order exists"),
  notifications: long("notifications", "Updates", "Notification centre with every update in order", 4604),
  wfEstimate: screen("wf-estimate", "Wireframe", "Wireframe of the estimate screen"),
  wfTracker: screen("wf-tracker", "Wireframe", "Wireframe of the tracker"),
  wfOwnership: screen("wf-ownership", "Wireframe", "Wireframe of the ownership question"),

  start: screen("start", "Start", "Welcome screen: see solar panels on your own roof"),
  postcode: screen("postcode", "Postcode", "Postcode entry to find the home"),
  address: screen("search-results", "Address", "Address search results for the entered postcode"),
  calculating: screen("calculating", "Calculating", "Loading state while the roof is measured"),
  noRoof: screen("roof-not-found", "No roof data", "Fallback when the roof can't be read: a short manual form still gives an estimate"),
  estimate0: screen("estimate-0", "No panels", "Estimate with the system size slider at zero and an empty roof grid"),
  estimate50: screen("estimate-50", "8.2 kW", "Estimate at 8.2 kW: 32 of 80 panels filled on the roof, with cost and yearly output"),
  estimate100: screen("estimate-100", "16.5 kW", "Estimate at 16.5 kW with the whole roof filled"),
  estimateSheet: screen("estimate-sheet", "Breakdown", "Cost and savings breakdown sheet, labelled as an estimate"),
  councilFee: screen("tracker-council-fee", "Pay fee", "Order tracker: council review needs a fee, with one Pay fee button"),
  gridAction: screen("tracker-grid-action", "Upload", "Order tracker: grid connection asks the homeowner to upload one document"),
  tooltip: screen("tooltip-council", "Explained", "Tooltip explaining why council review takes 8–12 weeks"),
  ppa: screen("tracker-ppa", "PPA", "Tracker for a power purchase agreement order"),
  tenant: screen("tracker-tenant", "Tenant", "Tracker for a tenant, waiting on the landlord"),
  landlord: screen("landlord-approved", "Landlord OK", "The landlord has approved the installation"),
  installation: screen("tracker-installation", "Installation", "Tracker during installation"),
  live: screen("solar-live", "Live", "The day the panels switch on: your solar is live"),
  bank: screen("pay-bank", "Bank", "Choosing a bank to pay from"),
  review: screen("pay-review", "Review", "Reviewing the payment in the bank flow"),
  processing: screen("pay-processing", "Processing", "Payment processing state"),
  received: screen("pay-received", "Paid", "Payment received"),
  cancelNoFee: screen("cancel-no-fee", "Before survey", "Cancel request before the survey, with no fee"),
  cancelFee: screen("cancel-fee", "After survey", "Cancel request after the survey, with a refund summary and a fee"),
  cancelPpa: screen("cancel-ppa-signed", "PPA signed", "Cancel request once a power purchase agreement is signed"),
  refund: screen("refund-processing", "Refund", "Refund processing after a manager confirms the cancellation"),
};

/** Admin panel screens, in a browser window. */
export const luminAdmin = {
  dashboard: screen("admin-dashboard", "Dashboard", "Admin dashboard with orders by stage"),
  applications: screen("admin-applications", "Applications", "Admin list of applications with stage, state and the next action for staff"),
  application: screen("admin-application", "Application", "One application, where staff run its steps"),
};

export const luminAdminUrl = "admin.luminasset.co.uk";

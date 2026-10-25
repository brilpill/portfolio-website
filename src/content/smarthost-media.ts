import type { CaseScreen } from "./project-slides";

/**
 * SmartHost screens (public/cases/smarthost/), from smarthost-images.zip (25 Oct 2026), shared by the case slide and the
 * case study. All sample: contact details, testimonials and financial figures are original design content, not verified
 * results. Desktop previews are 1728 wide (1100 high; the questionnaire and navigation 980; the Dubai and investment
 * heroes about 800, exported without their header). Mobile is 393 × 852. A `full` page opens at full length in the
 * viewer (desktop) or scrolls inside the phone (mobile).
 */
const dir = "/cases/smarthost";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt });
/** A screen with its full-length export (file-full.png), `width` × `height` in px. */
const long = (file: string, label: string, alt: string, width: number, height: number): CaseScreen => ({ ...screen(file, label, alt), full: { src: `${dir}/${file}-full.png`, ratio: height / width } });

/** Frame proportions per preview height, so no screen is cropped at the sides. */
export const SH_RATIO = { page: "1728 / 1100", form: "1728 / 980", hero: "1728 / 800" };

export const sh = {
  home: long("home", "Homepage", "Sample SmartHost homepage with an estimate entry", 1728, 12996),
  homeMobile: long("home-mobile", "Homepage", "Sample SmartHost homepage on mobile", 393, 11576),
  homeWireframe: screen("home-wireframe", "Wireframe", "Wireframe of the SmartHost homepage entry point"),
  homeVisual: screen("home", "Visual design", "Sample SmartHost homepage visual design"),
  navigation: screen("navigation", "Navigation", "Sample SmartHost navigation menu open on desktop"),
  navigationMobile: screen("navigation-mobile", "Navigation", "Sample SmartHost navigation menu on mobile"),
  services: long("services", "Service overview", "Sample SmartHost service overview page", 1728, 6773),
  photography: long("photography", "Photography", "Sample SmartHost photography service page", 1728, 6946),
  listings: long("listings", "Multi-platform listings", "Sample SmartHost multi-platform listings service page", 1728, 8576),
  estimateGoal: screen("estimate-goal", "Owner goals", "Sample SmartHost estimate questionnaire asking about the owner's goals"),
  estimateAvailability: screen("estimate-availability", "Availability", "Sample SmartHost estimate questionnaire asking about property availability"),
  estimateDetails: screen("estimate-details", "Property details", "Sample SmartHost estimate questionnaire collecting property details"),
  estimateResult: long("estimate-result", "Estimate and next steps", "Sample SmartHost estimate with an illustrative forecast, plan options and consultation actions", 1728, 4208),
  resultMobile: long("result-mobile", "Estimate", "Sample SmartHost estimate on mobile with illustrative figures", 393, 4477),
  dubai: screen("dubai", "Dubai homepage — hero", "Sample SmartHost Dubai homepage hero section"),
  investment: screen("investment", "Investment — hero", "Sample SmartHost investment page hero section"),
  blog: long("blog", "Blog index", "Sample SmartHost blog index", 1728, 3685),
  article: long("article", "Article layout", "Sample SmartHost article layout", 1728, 7960),
};

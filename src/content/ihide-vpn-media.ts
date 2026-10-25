import type { CaseScreen } from "./project-slides";

/**
 * iHide VPN screens (public/cases/ihide-vpn/), from ihide-vpn-images.zip (25 Oct 2026), for its overview slide. Sample
 * until publication clearance; the IP addresses on the connection screens are masked in the export. 375 × 812, 1x.
 */
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `/cases/ihide-vpn/${file}.png`, label, alt });

export const ihide = {
  disconnected: screen("disconnected", "Disconnected", "iHide VPN main screen in the disconnected state"),
  connecting: screen("connecting", "Connecting", "iHide VPN main screen while connecting"),
  connected: screen("connected", "Connected", "iHide VPN main screen with an active connection"),
  locations: screen("locations", "Locations", "Server location selection in iHide VPN"),
  search: screen("search", "Search", "Searching server locations in iHide VPN"),
  onboardingPrivacy: screen("onboarding-privacy", "Privacy", "iHide VPN onboarding screen introducing privacy"),
  onboardingConnection: screen("onboarding-connection", "Connection", "iHide VPN onboarding screen introducing connection features"),
};

import type { CaseScreen } from "./project-slides";

/**
 * Dangdi screens (public/cases/dangdi/), exported 25 Oct 2026 at 2x from the "Finish: Design Concepts" page of the Dangdi
 * design file (55:51173). Each concept is one long home screen: `name.png` is its first viewport (804 × 1748, with the
 * floating tab bar) and `name-full.png` the whole page, which scrolls inside the phone. The phone image in the source
 * is left out; the portfolio draws its own frame. People, places, offers and articles are sample design content.
 */
const dir = "/cases/dangdi";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt: `Dangdi ${alt}` });
/** A viewport with the whole page behind it (file-full.png, `height` in px at 804 wide). */
const long = (file: string, label: string, alt: string, height: number): CaseScreen => ({ ...screen(file, label, alt), full: { src: `${dir}/${file}-full.png`, ratio: height / 804 } });
const board = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt: `Dangdi ${alt}` });

export const dd = {
  black: long("black", "Black", "home screen with the black accent", 7158),
  green: long("green", "Green", "home screen with the green accent", 7158),
  coral: long("coral", "Coral", "home screen with the coral accent", 7158),
  chinese: long("chinese", "简体中文", "home screen in Simplified Chinese", 6914),
  scroll1: screen("black", "Top", "home screen at the top"),
  scroll2: screen("scroll-2", "For you", "home screen scrolled to For You"),
  scroll3: screen("scroll-3", "Articles", "home screen scrolled to top articles"),
  scroll4: screen("scroll-4", "People", "home screen scrolled to people with shared interests"),
  scroll5: screen("scroll-5", "Events", "home screen scrolled to upcoming events"),
  scroll6: screen("scroll-6", "Places", "home screen scrolled to popular places nearby"),
  scroll7: screen("scroll-7", "Offers", "home screen scrolled to discounted offers"),
  photoDay: long("photo-day", "Day · 13:41", "photo-hero home screen during the day", 8068),
  photoEvening: screen("photo-evening", "Evening · 19:41", "photo-hero home screen in the evening"),
  photoNight: screen("photo-night", "Night · 22:41", "photo-hero home screen at night"),
  photoChinese: long("photo-chinese", "简体中文", "photo-hero home screen in Simplified Chinese", 7824),
  navIcons: board("asset-nav-icons", "3D navigation icons", "3D navigation icons in active and inactive states"),
  medals: board("asset-medals", "Level medals", "3D level medals"),
  avatars: board("asset-avatars", "Glass bubble avatars", "glass bubble avatars"),
  aiPill: board("asset-ai-pill", "Dangdi AI pill", "Dangdi AI pill"),
};

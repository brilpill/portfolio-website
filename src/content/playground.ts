import shots from "./playground-dribbble.json";

export type PlaygroundMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; alt: string };

export type PlaygroundItem = {
  id: string;
  title: string;
  image: string;
  sourceUrl: string;
  sourceLabel?: string;
  publishedAt?: string;
  description: string;
  media: PlaygroundMedia[];
};

/** Manually added artwork stays independent of the generated Dribbble import. */
const localItems: PlaygroundItem[] = [{
  id: "figma-cs0UtGICPOFIpGh5VjDrT5-985-6052",
  title: "Promptly — Prompt Library",
  image: "/playground/figma/promptly-library-985-6052.png",
  sourceUrl: "https://www.figma.com/design/cs0UtGICPOFIpGh5VjDrT5/Cases?node-id=985-6052",
  sourceLabel: "Figma",
  description: "Promptly prompt library screen, exported from Figma.",
  media: [{ kind: "image", src: "/playground/figma/promptly-library-985-6052.png", alt: "Promptly prompt library with collections, prompt cards, and sidebar navigation" }],
}, {
  id: "figma-Zz5XMxNo2hP9DHpavqBhO7-1128-7446",
  title: "Whistle — Brand & App Mockups",
  image: "/playground/figma/whistle-1128-7446/01.png",
  sourceUrl: "https://www.figma.com/design/Zz5XMxNo2hP9DHpavqBhO7/brilpill?node-id=1128-7446",
  sourceLabel: "Figma",
  description: "Whistle branding, app icon, and trading platform mockups, exported from Figma.",
  media: [
    { kind: "image", src: "/playground/figma/whistle-1128-7446/01.png", alt: "Whistle green app icon with whale symbol and notification badge" },
    { kind: "image", src: "/playground/figma/whistle-1128-7446/02.png", alt: "Whistle app icon beside Safari in the macOS Dock" },
    { kind: "image", src: "/playground/figma/whistle-1128-7446/03.png", alt: "Whistle trading platform Discover dashboard in a macOS browser mockup" },
    { kind: "image", src: "/playground/figma/whistle-1128-7446/04.png", alt: "Whistle app icon on an iPhone home screen" },
    { kind: "image", src: "/playground/figma/whistle-1128-7446/05.png", alt: "Whistle whale symbol and wordmark on a dark green background" },
    { kind: "image", src: "/playground/figma/whistle-1128-7446/06.png", alt: "Close-up of Whistle branding and navigation in browser mockups" },
  ],
}];

/** One Dribbble shot per pin; its ordered gallery stays together in the viewer.
 * Restored by scripts/import-dribbble.mjs from the reviewed source manifest. */
export const playgroundItems: PlaygroundItem[] = [...localItems, ...shots.map((shot): PlaygroundItem => ({
  ...shot,
  media: shot.media.map(media => media.kind === "video"
    ? { kind: "video", src: media.src, poster: media.poster!, alt: media.alt }
    : { kind: "image", src: media.src, alt: media.alt }),
}))];

export const playgroundPoster = (media: PlaygroundMedia) => media.kind === "video" ? media.poster : media.src;

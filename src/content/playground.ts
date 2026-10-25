import shots from "./playground-dribbble.json";

export type PlaygroundMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; alt: string };

export type PlaygroundItem = {
  id: string;
  title: string;
  image: string;
  sourceUrl: string;
  publishedAt: string;
  description: string;
  media: PlaygroundMedia[];
};

/** One Dribbble shot per pin; its ordered gallery stays together in the viewer.
 * Restored by scripts/import-dribbble.mjs from the reviewed source manifest. */
export const playgroundItems: PlaygroundItem[] = shots.map(shot => ({
  ...shot,
  media: shot.media.map(media => media.kind === "video"
    ? { kind: "video", src: media.src, poster: media.poster!, alt: media.alt }
    : { kind: "image", src: media.src, alt: media.alt }),
}));

export const playgroundPoster = (media: PlaygroundMedia) => media.kind === "video" ? media.poster : media.src;

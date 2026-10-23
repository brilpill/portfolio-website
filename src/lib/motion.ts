/** Durations are in seconds; CSS equivalents live in app/tokens.css. */
export const motionTokens = {
  duration: { press: .1, fast: .15, popover: .18, panel: .26, slide: .4, process: .55, intro: .7 },
  easeOut: [.22, 1, .36, 1] as const,
  spring: { type: "spring", stiffness: 380, damping: 34, mass: .8 } as const,
};

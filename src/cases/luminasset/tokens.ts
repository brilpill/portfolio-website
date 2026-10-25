import type { CSSProperties } from "react";

/**
 * LuminAsset design tokens, taken as-is from the Figma variables of "Lumin Asset · Design" (page 1.0, Components).
 * The demos read them as CSS variables (`--la-*`, from `laVars`), and the foundations block lists them, so the
 * case shows the values the product was designed with. Names follow Figma (Base/100 → base[100]).
 */
export const color = {
  base: {
    100: "#171717",
    200: "#222222",
    300: "#e7e7e7",
    350: "#dedede",
    400: "#3d3d3d",
    500: "#b8b8b8",
    600: "#6e6e6e",
    700: "#5e5e5e",
    800: "#c4c4c4",
    900: "#171717",
    solid: "#ffffff",
  },
  accent: {
    blue: "#2f6fed",
    "blue-pressed": "#2559c4",
    "blue-disabled": "#2f6fed66",
    amber: "#f2a129",
    white: "#ffffff",
    "white-pressed": "#ffffffcc",
    "white-disabled": "#ffffff66",
    "white-subtle": "#ffffff29",
    black: "#000000",
  },
  system: {
    success: "#1f8a5f",
    "success-subtle": "#34c77b29",
    failed: "#ff6b5e",
    "failed-pressed": "#e05548",
    "failed-subtle": "#ff6b5e29",
    info: "#6ea0ff",
  },
} as const;

/** Geist throughout. Size / line height in points; tracking in points too. */
export const type = {
  display: { size: 38, line: 42, weight: 600, tracking: -0.76, label: "Display" },
  h1: { size: 32, line: 36, weight: 500, tracking: 0, label: "H1" },
  h2: { size: 24, line: 30, weight: 500, tracking: 0, label: "H2" },
  h3: { size: 20, line: 26, weight: 500, tracking: 0, label: "H3" },
  "body-medium": { size: 16, line: 24, weight: 500, tracking: 0.5, label: "Body Medium" },
  "body-regular": { size: 16, line: 24, weight: 400, tracking: 0.5, label: "Body Regular" },
  "small-medium": { size: 14, line: 20, weight: 500, tracking: 0.5, label: "Small Medium" },
  "small-regular": { size: 14, line: 20, weight: 400, tracking: 0.5, label: "Small Regular" },
  "caption-medium": { size: 13, line: 18, weight: 500, tracking: 0, label: "Caption Medium" },
  "caption-regular": { size: 13, line: 18, weight: 400, tracking: 0, label: "Caption Regular" },
} as const;

/** A 4-point scale: spacing/4 = 16. */
export const space = { "0": 0, "0,5": 2, "1": 4, "1,5": 6, "2": 8, "2,5": 10, "3": 12, "3,5": 14, "4": 16, "5": 20, "6": 24, "8": 32, "10": 40, "11": 44 } as const;

export const radius = { "rounded-lg": 8, "rounded-xl": 12, "rounded-4xl": 32, "rounded-full": 9999 } as const;

export const shadow = {
  sm: "0 1px 2px 0 #0000000d",
  md: "0 2px 4px -1px #0000000f, 0 4px 6px -1px #0000001a",
  lg: "0 4px 6px -2px #0000000d, 0 10px 15px -3px #0000001a",
  button: "0 8px 40px 0 #0000001f",
} as const;

/** Every token as a CSS variable, to spread on a demo's root: --la-base-100, --la-accent-blue, --la-space-4… */
export const laVars = {
  ...Object.fromEntries(Object.entries(color).flatMap(([group, values]) => Object.entries(values).map(([name, value]) => [`--la-${group}-${name}`, value]))),
  ...Object.fromEntries(Object.entries(space).map(([name, value]) => [`--la-space-${name.replace(",", "_")}`, `${value}px`])),
  ...Object.fromEntries(Object.entries(radius).map(([name, value]) => [`--la-${name}`, `${value}px`])),
  ...Object.fromEntries(Object.entries(shadow).map(([name, value]) => [`--la-shadow-${name}`, value])),
} as CSSProperties;

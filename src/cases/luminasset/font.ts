import { Geist } from "next/font/google";

/** The LuminAsset typeface, for its demos only (`--la-font`); the portfolio keeps its own fonts. */
export const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--la-font", display: "swap" });

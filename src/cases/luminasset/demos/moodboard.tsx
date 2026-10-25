"use client";

import Image from "next/image";
import "./moodboard.css";

/**
 * A board of phone screens, one set at a time, picked by the block's tabs (`value`): two rows that fit the frame,
 * the same size for every set, a smaller set sitting narrower and centred. Used for the moodboard (the visual
 * directions) and the wireframes (one tab per section of the Figma wireframes page). Files are
 * /cases/luminasset/<folder>/<set>-NN.jpg, in the Figma order.
 */
type Set = { id: string; label: string; count: number };

function ScreenBoard({ value, sets, folder, noun }: { value: string | number; sets: readonly Set[]; folder: string; noun: string }) {
  const set = sets.find(item => item.id === value) ?? sets[0];
  const columns = Math.ceil(set.count / 2);
  return <div className="la-mood" key={set.id} style={{ "--columns": columns } as React.CSSProperties} aria-label={`${set.label}: ${set.count} ${noun}`}>
    {Array.from({ length: set.count }, (_, i) => <div key={i} className="la-mood-cell" style={{ "--i": i } as React.CSSProperties}>
      <figure>
        <Image src={`/cases/luminasset/${folder}/${set.id}-${String(i + 1).padStart(2, "0")}.jpg`} alt={`${set.label}, ${noun.replace(/s$/, "")} ${i + 1}`} fill sizes="160px" />
      </figure>
    </div>)}
  </div>;
}

/** Inspiration screens per visual direction (Figma page Moodboard); third-party apps, collected via Mobbin. */
export const directions = [
  { id: "clear", label: "Clear", count: 13 },
  { id: "tech", label: "Tech", count: 15 },
  { id: "apple", label: "Apple Style", count: 15 },
  { id: "thin", label: "Thin & Angled", count: 13 },
  { id: "rounded", label: "Rounded", count: 7 },
] as const;

export function Moodboard({ value }: { value: string | number; onValueChange?: (value: string | number) => void }) {
  return <ScreenBoard value={value} sets={directions} folder="moodboard" noun="inspiration screens" />;
}

/**
 * The main screens of each section of Wireframes ↪ 3.0 (Final), in flow order: from the section's first screen
 * along its prototype links and drawn arrows, main path first, then each branch (global links to Help, Settings
 * and Add address left out); the first 14.
 */
export const wireframeSections = [
  { id: "start", label: "Start", count: 14 },
  { id: "onboarding", label: "Onboarding", count: 14 },
  { id: "tracking", label: "Order tracking", count: 14 },
  { id: "address", label: "New address", count: 8 },
  { id: "monitoring", label: "Monitoring", count: 14 },
  { id: "actions", label: "Actions", count: 14 },
] as const;

export function Wireframes({ value }: { value: string | number; onValueChange?: (value: string | number) => void }) {
  return <ScreenBoard value={value} sets={wireframeSections} folder="wireframes" noun="wireframes" />;
}

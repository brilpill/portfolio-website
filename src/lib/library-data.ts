// The library itself. Server-only: this module holds the whole export, and a client
// component importing it would ship every item to the browser (it did, once — a 976 KB
// chunk at 600 items). Pages read it here and hand cards down; helpers live in ./library.
import "server-only";

import raw from "@/content/library.json";
import type { LibraryItem } from "./library";

type Library = { version: 1; generatedAt: string; items: LibraryItem[] };

const library = raw as unknown as Library;

export const items: LibraryItem[] = library.items;
export const generatedAt = library.generatedAt;

const bySlug = new Map(items.map((i) => [i.slug, i]));
const byId = new Map(items.map((i) => [i.slug.slice(-8), i]));

/** The item for a slug — or, when only the title part changed, the same row under its new slug. */
export function findItem(slug: string): { item: LibraryItem; moved: boolean } | null {
  const exact = bySlug.get(slug);
  if (exact) return { item: exact, moved: false };
  const same = byId.get(slug.slice(-8));
  return same ? { item: same, moved: true } : null;
}

export const neighbours = (slugs: string[]) =>
  slugs.map((s) => bySlug.get(s)).filter((i): i is LibraryItem => !!i);

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Like counts for the case studies. In production they live in Upstash Redis (Vercel Marketplace → Upstash,
 * which sets KV_REST_API_URL / KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL / _TOKEN). Without those, local
 * development keeps them in .data/likes.json, which is git-ignored.
 */
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const key = (slug: string) => `likes:${slug}`;

/** False on a deployed site that has no Redis yet: the like button then hides its count. */
export const likesAvailable = Boolean(url && token) || process.env.NODE_ENV !== "production";

async function redis(...command: (string | number)[]): Promise<number> {
  const response = await fetch(url!, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(command), cache: "no-store" });
  if (!response.ok) throw new Error(`Redis ${command[0]} failed: ${response.status}`);
  const { result } = await response.json() as { result: string | number | null };
  return Number(result ?? 0);
}

const file = path.join(process.cwd(), ".data", "likes.json");
async function readLocal(): Promise<Record<string, number>> {
  try { return JSON.parse(await readFile(file, "utf8")); } catch { return {}; }
}
async function changeLocal(slug: string, by: number) {
  const counts = await readLocal();
  counts[slug] = Math.max(0, (counts[slug] ?? 0) + by);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(counts, null, 2));
  return counts[slug];
}

export async function getLikes(slug: string) {
  if (url && token) return redis("GET", key(slug));
  return (await readLocal())[slug] ?? 0;
}

/** Adds or removes one like and returns the new count (never below zero). */
export async function changeLikes(slug: string, by: 1 | -1) {
  if (!(url && token)) return changeLocal(slug, by);
  const count = await redis(by > 0 ? "INCR" : "DECR", key(slug));
  if (count < 0) { await redis("SET", key(slug), 0); return 0; }
  return count;
}

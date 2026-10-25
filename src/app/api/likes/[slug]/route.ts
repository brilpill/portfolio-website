import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { caseStudies } from "@/content/case-studies";
import { projectSlides } from "@/content/project-slides";
import { changeLikes, getLikes, likesAvailable } from "@/lib/likes";

/**
 * Likes for one case study. GET returns the count and whether this browser liked it; POST { liked } sets this
 * browser's like. A cookie remembers which cases a browser has liked, so repeating a request never counts twice.
 */
const COOKIE = "liked-cases";

async function likedSlugs() {
  return new Set((await cookies()).get(COOKIE)?.value.split(",").filter(known) ?? []);
}

function known(slug: string) {
  return caseStudies.some(study => study.slug === slug) && !projectSlides.some(project => project.slug === slug && project.archived);
}

export async function GET(_request: NextRequest, context: RouteContext<"/api/likes/[slug]">) {
  const { slug } = await context.params;
  if (!known(slug)) return Response.json({ error: "Unknown case" }, { status: 404 });
  const liked = (await likedSlugs()).has(slug);
  if (!likesAvailable) return Response.json({ count: null, liked });
  return Response.json({ count: await getLikes(slug), liked });
}

export async function POST(request: NextRequest, context: RouteContext<"/api/likes/[slug]">) {
  const { slug } = await context.params;
  if (!known(slug)) return Response.json({ error: "Unknown case" }, { status: 404 });
  if (!likesAvailable) return Response.json({ error: "Likes are not set up" }, { status: 503 });
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "JSON required" }, { status: 415 });
  if (Number(request.headers.get("content-length") ?? 0) > 128) return Response.json({ error: "Request too large" }, { status: 413 });
  const body = await request.json().catch(() => null) as { liked?: unknown } | null;
  if (typeof body?.liked !== "boolean") return Response.json({ error: "Send { liked: boolean }" }, { status: 400 });

  const slugs = await likedSlugs();
  let count: number;
  if (body.liked === slugs.has(slug)) count = await getLikes(slug);
  else {
    count = await changeLikes(slug, body.liked ? 1 : -1);
    if (body.liked) slugs.add(slug); else slugs.delete(slug);
    (await cookies()).set(COOKIE, [...slugs].join(","), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return Response.json({ count, liked: body.liked });
}

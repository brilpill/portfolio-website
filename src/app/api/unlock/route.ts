import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_MAX_AGE, accessToken, sameToken, sitePassword } from "@/lib/site-access";

/** POST { password }: sets the access cookie when it matches SITE_PASSWORD. */
export async function POST(request: NextRequest) {
  const password = sitePassword();
  if (!password) return Response.json({ ok: true });
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 512) return Response.json({ error: "Request too large" }, { status: 413 });

  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  const attempt = typeof body?.password === "string" ? body.password : "";
  const [expected, given] = await Promise.all([accessToken(password), accessToken(attempt)]);
  if (!sameToken(given, expected)) {
    // A short pause makes guessing slow without bothering someone who mistyped once.
    await new Promise(resolve => setTimeout(resolve, 600));
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }
  (await cookies()).set(ACCESS_COOKIE, expected, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: ACCESS_MAX_AGE });
  return Response.json({ ok: true });
}

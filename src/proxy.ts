import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessToken, sameToken, sitePassword } from "@/lib/site-access";

/**
 * The temporary password gate. Without the access cookie, a page shows the password screen at the same
 * address (a rewrite, so reloading after unlocking lands on the page asked for) and an API call gets a 401.
 * Files from public/ (anything with an extension), Next's assets, robots.txt and the sitemap stay open.
 */
export async function proxy(request: NextRequest) {
  const password = sitePassword();
  if (!password) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(ACCESS_COOKIE)?.value;
  const unlocked = cookie !== undefined && sameToken(cookie, await accessToken(password));

  if (pathname === "/api/unlock") return NextResponse.next();
  if (pathname === "/unlock") return unlocked ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  if (unlocked) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Password required" }, { status: 401 });

  const response = NextResponse.rewrite(new URL("/unlock", request.url));
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!_next/|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};

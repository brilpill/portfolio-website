/**
 * Temporary password gate for the whole site. It is on only while SITE_PASSWORD is set (on Vercel);
 * without it, as in local development, every page is open. Entering the password sets a cookie holding
 * an HMAC of the password, so the password itself is never stored in the browser, and changing it on
 * Vercel signs everyone out.
 */
export const ACCESS_COOKIE = "site-access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const sitePassword = () => process.env.SITE_PASSWORD || null;

/** Web Crypto, so the same code runs in the proxy and in route handlers. */
export async function accessToken(password: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("brilpill-site-access-v1"));
  return [...new Uint8Array(signature)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

/** Compares two equal-length hex strings without returning early. */
export function sameToken(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

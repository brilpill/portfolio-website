/** The canonical origin is deliberately configured only for the public release. */
export function siteUrl(): URL | null {
  const value = process.env.SITE_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
    return new URL(url.origin);
  } catch {
    return null;
  }
}

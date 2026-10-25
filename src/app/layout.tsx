import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { UIProvider } from "@/components/ui-provider";
import { SiteSoundEffects } from "@/components/site-sound-effects";
import { SiteAnalytics } from "@/components/site-analytics";
import { MobileBlocker } from "@/components/mobile-blocker";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";
import "./home.css";
import "./about.css";

const ronzino = localFont({
  src: [
    { path: "../../public/fonts/Ronzino-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Ronzino-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ronzino",
  display: "swap",
});

const radley = localFont({
  src: [
    { path: "../../public/fonts/Radley-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Radley-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-radley",
  display: "swap",
});

export const metadata: Metadata = {
  ...(siteUrl() ? { metadataBase: siteUrl()!, alternates: { canonical: "/" } } : { robots: { index: false, follow: false } }),
  title: `${profile.name} — UX/UI Designer & Engineer`,
  description: "I design how products look, move and feel, and I build them that way.",
  openGraph: { type: "website", title: `${profile.name} — UX/UI Designer & Engineer`, description: "I design how products look, move and feel, and I build them that way.", siteName: profile.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const origin = siteUrl();
  const person = origin ? {
    "@context": "https://schema.org", "@type": "Person", name: profile.name,
    url: origin.href, jobTitle: "UX/UI Designer & Engineer", homeLocation: { "@type": "Place", name: "Warsaw, Poland" },
    sameAs: profile.links.map(link => link.href),
  } : null;
  return (
    <html lang="en" className={`${ronzino.variable} ${radley.variable} antialiased`}>
      <body>
        {person && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />}
        <UIProvider>{children}</UIProvider><MobileBlocker /><SiteSoundEffects /><SiteAnalytics scriptUrl={origin ? process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ?? null : null} />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccessGate } from "@/components/access-gate";
import { sitePassword } from "@/lib/site-access";

export const metadata: Metadata = { title: "Oleh Bril — Portfolio", robots: { index: false, follow: false } };
// The gate depends on SITE_PASSWORD at request time, not at build time.
export const dynamic = "force-dynamic";

/** The password screen. The proxy shows it at whatever address was asked for until the site is unlocked. */
export default function UnlockPage() {
  if (!sitePassword()) redirect("/");
  return <AccessGate />;
}

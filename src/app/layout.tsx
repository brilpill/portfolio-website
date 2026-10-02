import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

// SF Pro on Apple devices; Inter everywhere else.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.oneLiner,
};

export const viewport: Viewport = {
  themeColor: "#f5f5f5",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}

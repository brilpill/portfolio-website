import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { UIProvider } from "@/components/ui-provider";
import { profile } from "@/content/profile";
import "./globals.css";
import "./home.css";

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
  title: `${profile.name} — UX/UI Designer & Engineer`,
  description: "I design how products look, move and feel, and I build them that way.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${ronzino.variable} ${radley.variable} antialiased`}>
      <body><UIProvider>{children}</UIProvider></body>
    </html>
  );
}

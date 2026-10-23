"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { moreProjectsEnabled } from "@/content/project-slides";
import { useState } from "react";
import { MoreProjectsSlide } from "@/components/more-projects-slide";
import { Button } from "@/components/ui/button";

export default function MoreLayoutOptions() {
  const [layout, setLayout] = useState<"gallery" | "list" | "featured">("gallery");
  const [group, setGroup] = useState<"Mobile" | "Web">("Mobile");
  if (!moreProjectsEnabled) notFound();
  return <main style={{ background: "#f5f5f7", minHeight: "100dvh", padding: "24px clamp(12px, 4vw, 64px)", fontFamily: "var(--font-ronzino)" }}>
    <header style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
      <Link href="/#mobile-more" style={{ marginRight: 20, fontSize: 14 }}>← Portfolio</Link>
      {(["gallery", "list", "featured"] as const).map(option => <Button key={option} variant={layout === option ? "ink" : "quiet"} aria-pressed={layout === option} onClick={() => setLayout(option)}>{option === "gallery" ? "01 · Gallery" : option === "list" ? "02 · Compact list" : "03 · Featured first"}</Button>)}
      <Button variant="secondary" onClick={() => setGroup(group === "Mobile" ? "Web" : "Mobile")}>{group} projects</Button>
    </header>
    <div style={{ height: "calc(100dvh - 120px)", minHeight: 500, borderRadius: 18, background: "white", boxShadow: "0 2px 12px #1919190a", overflow: "hidden", containerType: "inline-size" }}>
      <MoreProjectsSlide key={group} group={group} layout={layout} onPreviewChange={() => {}} />
    </div>
  </main>;
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { BroadcastIcon, CarIcon, CreditCardIcon, OrangeIcon, GitMergeIcon, BrainIcon, ArrowUpRightIcon, FolderOpenIcon, type Icon } from "@phosphor-icons/react";
import { coverOf, projectSlides, type ProjectSlideContent } from "@/content/project-slides";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProjectSlide } from "./project-slide";

const projectIcons: Record<string, Icon> = { ihidevpn: BroadcastIcon, draupnir: CreditCardIcon, "imo-car-wash": CarIcon, "peach-health": OrangeIcon, nearbor: GitMergeIcon, "knowledge-base": BrainIcon };

export function MoreProjectsSlide({ group, onPreviewChange, layout = "gallery" }: { group: "Mobile" | "Web"; onPreviewChange: (open: boolean) => void; layout?: "gallery" | "list" | "featured" }) {
  const [selected, setSelected] = useState<ProjectSlideContent | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const projects = projectSlides.filter(project => project.group === group && project.placement === "more");
  const SelectedIcon = selected ? projectIcons[selected.slug] ?? FolderOpenIcon : FolderOpenIcon;
  return <section className={`content-slide more-slide more-layout-${layout}`} aria-labelledby={`more-${group}`}>
    <header className="content-heading"><h1 id={`more-${group}`} tabIndex={-1} data-slide-heading>More {group.toLowerCase()} projects.</h1><p>A few more things I’ve worked on.</p></header>
    {projects.length ? <div className="more-grid">{projects.map(project => {
      const ProjectIcon = projectIcons[project.slug] ?? FolderOpenIcon;
      return <button type="button" className="more-card" key={project.slug} aria-label={`Open ${project.title}`} onClick={() => { setSelected(project); setPreviewOpen(true); onPreviewChange(true); }}>
        <span className="more-cover">{coverOf(project.media) ? <Image src={coverOf(project.media)!} alt="" fill sizes="(max-width: 600px) 100vw, 50vw" /> : <span className="more-cover-pending"><ProjectIcon size={32} aria-hidden /><span>Preview coming soon</span></span>}</span>
        <span className="more-card-details"><span className="more-card-title">{project.title}</span><span className="more-card-description">{project.format}{project.slug === "imo-car-wash" && " · Older project"}</span></span><ArrowUpRightIcon className="more-card-arrow" size={16} aria-hidden />
      </button>;
    })}</div> : <div className="content-empty"><FolderOpenIcon size={28} aria-hidden /><h2>Room for more.</h2><p>No additional {group.toLowerCase()} projects have been added yet.</p></div>}
    <Dialog open={previewOpen} onOpenChange={open => { setPreviewOpen(open); onPreviewChange(open); }}>
      <DialogContent className="project-preview-dialog">
        <DialogTitle className="home-sr-only">{selected?.title ?? "Project preview"}</DialogTitle><DialogDescription className="project-preview-note">Project preview · Sample copy and visuals pending</DialogDescription>
        {selected && <ProjectSlide project={selected} icon={SelectedIcon} />}
      </DialogContent>
    </Dialog>
  </section>;
}

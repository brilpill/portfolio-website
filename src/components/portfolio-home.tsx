"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRightIcon, ArrowUpRightIcon, AtomIcon,
  CaretDownIcon, ChargingStationIcon,
  DiamondsFourIcon,
  GraduationCapIcon, HouseSimpleIcon, LightningIcon,
  ListIcon, StackIcon, MoonStarsIcon,
  PaperPlaneTiltIcon, ShuffleIcon, SparkleIcon,
  UserIcon, XIcon, KeyIcon, WaveformSlashIcon,
  type Icon,
} from "@phosphor-icons/react";
import { ProfileMenu } from "./profile-menu";
import { SidebarResizer } from "./sidebar-resizer";
import { AssistantPanel } from "./assistant-panel";
import { SoundWaveform } from "./sound-waveform";
import { playUiSound } from "./ui-sound";
import { useSidebarVisible, setSidebarVisible, useSoundEnabled, setSoundEnabled } from "./settings-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { ReactElement, ReactNode } from "react";
import { profile } from "@/content/profile";
import { HeroSeedling } from "./hero-seedling";
import { SocialLinks } from "./social-links";
import { Playground } from "./playground";
import { SidebarMotionNav, SidebarMotionHighlight, SidebarMotionIcon, useSidebarMotionItem } from "./sidebar-motion";
import { ProjectSlide } from "./project-slide";
import { ProcessSlide } from "./process-slide";
import { MoreProjectsSlide } from "./more-projects-slide";
import { AboutSlide, ExperienceSlide, ContactSlide } from "./content-slides";
import { usePager } from "./use-pager";
import { motionTokens } from "@/lib/motion";
import { portfolioSlideIds, projectSlides, sectionTitles, projectDestination } from "@/content/project-slides";

// More galleries are sidebar-only destinations; counts derive from the content inventory.
const moreCount = (group: "Mobile" | "Web") => projectSlides.filter(project => project.group === group && project.placement === "more").length;
const groups: { label: "Mobile" | "Web"; more: string; items: { slug: string; label: string; icon: Icon }[] }[] = [
  { label: "Mobile", more: "mobile-more", items: [
    { slug: "luminasset", label: "LuminAsset", icon: ChargingStationIcon },
    { slug: "quantum-body", label: "Quantum Body", icon: AtomIcon },
    { slug: "snooze-band", label: "Snooze Band", icon: MoonStarsIcon },
  ] },
  { label: "Web", more: "web-more", items: [
    { slug: "tutoriq", label: "TutorIQ", icon: GraduationCapIcon },
    { slug: "hotshots-labs", label: "HotShots Labs", icon: LightningIcon },
    { slug: "smarthost", label: "SmartHost", icon: KeyIcon },
  ] },
];
const facts = [
  { title: "From Ukraine, based in Warsaw.", text: "I design web and mobile products for different clients." },
  { title: "5+ years in design.", text: "Fintech, crypto, edtech, AI and SaaS — from the first flow to the last detail." },
  { title: "I build what I design.", text: "I also code what I design using coding agents. Agents do the work; I make the calls." },
  { title: "The small things matter.", text: "Micro-interactions, transitions, states and haptics. How a product feels is part of how it works." },
];
type Panel = "contact" | "facts" | "menu" | "playground" | null;

function SidebarItem({ label, icon: ItemIcon, slug, panel, compact, active, openPanel, onJump, onOpen }: { label: string; icon: Icon; slug?: string; panel?: Panel; compact: boolean; active: string; openPanel: Panel; onJump: (slug: string) => void; onOpen: (panel: Panel) => void }) {
  // The open destination (current slide, or a panel such as Playground while its dialog is up) uses the filled icon.
  const open = slug ? active === slug : panel != null && openPanel === panel;
  const id = slug || panel || label;
  const interaction = useSidebarMotionItem(id, open);
  const content = <><SidebarMotionHighlight visible={interaction.highlighted} /><SidebarMotionIcon id={id} active={interaction.gesturing} selected={open}><ItemIcon size={18} weight={open ? "fill" : "regular"} aria-hidden /></SidebarMotionIcon><span className="nav-item-label">{label}</span></>;
  const item = slug ? <a href={`#${slug}`} {...interaction.events} className={`home-nav-item${active === slug ? " is-current" : ""}`} aria-label={label} aria-current={active === slug ? "page" : undefined} onClick={event => { event.preventDefault(); onJump(slug); }}>{content}</a> : <button {...interaction.events} className="home-nav-item" aria-label={label} onClick={() => onOpen(panel ?? null)}>{content}</button>;
  return compact ? <ControlHint side="right" label={label}>{item}</ControlHint> : item;
}

type GroupMore = { slug: string; count: number; active: string; onJump: (slug: string) => void };

/** Rail: "+3" takes the group divider's place and opens that group's More gallery. */
function MoreCount({ label, compact, more }: { label: string; compact: boolean; more: GroupMore }) {
  const name = `${more.count} more ${label.toLowerCase()} project${more.count === 1 ? "" : "s"}`;
  const current = more.active === more.slug;
  const interaction = useSidebarMotionItem(more.slug, current);
  return <ControlHint side={compact ? "right" : "top"} label={name}>
    <a href={`#${more.slug}`} {...interaction.events} className={`${compact ? "rail-more-count" : "nav-more-count"}${current ? " is-current" : ""}`} aria-label={name} aria-current={current ? "page" : undefined} onClick={event => { event.preventDefault(); more.onJump(more.slug); }}><SidebarMotionHighlight visible={interaction.highlighted} /><span className="nav-more-label">+{more.count}</span></a>
  </ControlHint>;
}

/** Reveal More only while browsing a case or gallery belonging to its group. */
function MoreReveal({ label, more }: { label: string; more: GroupMore }) {
  const current = more.active === more.slug;
  const visible = current || projectSlides.some(project => project.slug === more.active && project.group === label);
  const interaction = useSidebarMotionItem(more.slug, current);
  const name = `${more.count} more ${label.toLowerCase()} project${more.count === 1 ? "" : "s"}`;
  return <div className={`nav-more-reveal${visible ? " is-pinned" : ""}`} inert={!visible} aria-hidden={!visible}><div>
    <a href={`#${more.slug}`} {...interaction.events} className={`nav-more-link${current ? " is-current" : ""}`} aria-label={name} aria-current={current ? "page" : undefined} onClick={event => { event.preventDefault(); more.onJump(more.slug); }}><span className="nav-more-label">{more.count} more project{more.count === 1 ? "" : "s"}</span><ArrowRightIcon size={14} aria-hidden /></a>
  </div></div>;
}

function NavigationGroup({ label, compact, more, children }: { label: string; compact: boolean; more?: GroupMore; children: ReactNode }) {
  if (compact) return <div className="rail-nav-group" role="group" aria-label={label}>{more ? <MoreCount label={label} compact more={more} /> : <div className="rail-divider" role="separator" />}<div className="home-group-items">{children}</div></div>;
  return <details className="home-nav-group" open><summary>{label}<CaretDownIcon size={14} aria-hidden /></summary><div className="home-group-items">{children}</div>{more && <MoreReveal label={label} more={more} />}</details>;
}

function SidebarContent({ onJump, onOpen, active, openPanel, compact = false, assistantOpen, onAsk, soundEnabled, onSound, onProfileOpenChange }: { onOpen: (panel: Panel) => void; onJump: (slug: string) => void; active: string; openPanel: Panel; compact?: boolean; assistantOpen: boolean; onAsk: () => void; soundEnabled: boolean; onSound: () => void; onProfileOpenChange: (open: boolean) => void }) {
  const navigationActive = openPanel === "playground" ? "" : active;
  const shared = { compact, active: navigationActive, openPanel, onJump, onOpen };

  return <>
    <SidebarMotionNav compact={compact}>
      <div className="home-nav-primary">
        <SidebarItem {...shared} label="Home" slug="home" icon={HouseSimpleIcon} />
        <SidebarItem {...shared} label="Playground" panel="playground" icon={DiamondsFourIcon} />
      </div>
      {groups.map(group => <NavigationGroup key={group.label} label={group.label} compact={compact} more={{ slug: group.more, count: moreCount(group.label), active: navigationActive, onJump }}>{group.items.map(({ slug, label, icon }) => <SidebarItem {...shared} key={slug} slug={slug} label={label} icon={icon} />)}</NavigationGroup>)}
      <NavigationGroup label="About me" compact={compact}>{[
        { slug: "about", label: "About me", icon: UserIcon },
        { slug: "experience", label: "Experience", icon: GraduationCapIcon },
        { slug: "process", label: "My process", icon: StackIcon },
      ].map(item => <SidebarItem {...shared} key={item.slug} {...item} />)}</NavigationGroup>
    </SidebarMotionNav>
    {/* Ask AI lives beside the profile: always in reach on every slide, without taking a navigation row. */}
    <div className={compact ? "rail-footer" : "sidebar-footer"}>
      {!compact && <ProfileMenu compact={false} soundEnabled={soundEnabled} onSound={onSound} onContact={() => onJump("contact")} onOpenChange={onProfileOpenChange} />}
      <NavigationAskAI compact={compact} open={assistantOpen} onAsk={onAsk} />
      {compact && <ProfileMenu compact soundEnabled={soundEnabled} onSound={onSound} onContact={() => onJump("contact")} onOpenChange={onProfileOpenChange} />}
    </div>
  </>;
}

const scrollingSlideIds = portfolioSlideIds.filter(id => id !== "mobile-more" && id !== "web-more");
type MorePage = "mobile-more" | "web-more";
const isMorePage = (id: string): id is MorePage => id === "mobile-more" || id === "web-more";

export function PortfolioHome({ layout = "default" }: { layout?: "default" | "card-shell" }) {
  const [morePage, setMorePage] = useState<MorePage | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [projectPreviewOpen, setProjectPreviewOpen] = useState(false);
  const sidebarVisible = useSidebarVisible();
  const [sidebarResizing, setSidebarResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const soundEnabled = useSoundEnabled();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const closeAssistant = useCallback(() => {
    setAssistantOpen(false);
    requestAnimationFrame(() => {
      const controls = [...document.querySelectorAll<HTMLButtonElement>("button[data-ai-trigger]"), ...document.querySelectorAll<HTMLButtonElement>("button[data-mobile-navigation]")];
      controls.find(control => control.getClientRects().length && getComputedStyle(control).visibility !== "hidden")?.focus();
    });
  }, []);
  const [panelKind, setPanelKind] = useState<Exclude<Panel, null>>("contact");
  const returnFocus = useRef<HTMLElement | null>(null);
  const openPanel = (next: Panel) => {
    if (next) {
      if (!panel) returnFocus.current = document.activeElement as HTMLElement;
      setPanelKind(next);
    }
    setPanel(next);
  };
  const syncedHash = useRef(false);
  const { index, go, viewportRef, trackRef } = usePager(scrollingSlideIds.length, layout === "card-shell" ? "scroll" : "flip", panel !== null || morePage !== null || projectPreviewOpen || profileMenuOpen);
  const active = morePage ?? scrollingSlideIds[index];

  const jump = useCallback((slug: string) => {
    const destination = projectDestination(slug);
    const target = scrollingSlideIds.indexOf(destination);
    if (target < 0 && !isMorePage(destination)) return;
    setMorePage(isMorePage(destination) ? destination : null);
    if (target >= 0) go(target);
    if (location.hash !== `#${destination}`) history.pushState(null, "", `#${destination}`);
    setPanel(null);
  }, [go]);

  useEffect(() => {
    const followHash = () => {
      const raw = location.hash.slice(1) || "home";
      if (raw === "search") { setMorePage(null); history.replaceState(null, "", "#home"); go(0, true); return; }
      if (raw === "playground") {
        setMorePage(null);
        setPanelKind(raw); setPanel(raw); history.replaceState(null, "", "#home"); go(0, true); return;
      }
      const slug = projectDestination(raw);
      setMorePage(isMorePage(slug) ? slug : null);
      const target = scrollingSlideIds.indexOf(slug);
      if (target >= 0) go(target, true);
    };
    followHash();
    window.addEventListener("hashchange", followHash);
    window.addEventListener("popstate", followHash);
    return () => {
      window.removeEventListener("hashchange", followHash);
      window.removeEventListener("popstate", followHash);
    };
  }, [go]);

  useEffect(() => {
    if (!syncedHash.current) { syncedHash.current = true; return; }
    history.replaceState(null, "", `#${active}`);
  }, [active]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || panel || morePage || projectPreviewOpen || profileMenuOpen || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest("a,button,input,textarea,select,summary,[contenteditable=true]")) return;
      const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 0;
      if (direction) { event.preventDefault(); go(index + direction); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, panel, morePage, projectPreviewOpen, profileMenuOpen]);

  // During a drag only the sidebar and the slide viewport are written to, so the rest of the tree is not restyled per frame.
  const resizeSidebar = useCallback((width: number | null) => {
    const sidebar = sidebarRef.current, pager = viewportRef.current;
    setSidebarResizing(width !== null);
    if (width === null) { sidebar?.style.removeProperty("--portfolio-sidebar-width"); if (pager) pager.style.left = ""; return; }
    sidebar?.style.setProperty("--portfolio-sidebar-width", `${width}px`);
    if (pager) pager.style.left = `${width}px`;
  }, [viewportRef]);
  // The viewport jumps to its final width once, then slides from where it was drawn (FLIP), so slides reflow once instead of every frame.
  const sidebarFlip = useRef<{ from: number; tick: number }>({ from: 0, tick: 0 });
  const [sidebarFlipTick, setSidebarFlipTick] = useState(0);
  const commitSidebar = useCallback((expanded: boolean) => {
    const pager = viewportRef.current;
    if (pager) sidebarFlip.current = { from: pager.getBoundingClientRect().left, tick: sidebarFlip.current.tick + 1 };
    setSidebarFlipTick(sidebarFlip.current.tick);
    if (expanded !== sidebarVisible && soundEnabled) playUiSound();
    setSidebarVisible(expanded);
  }, [viewportRef, sidebarVisible, soundEnabled]);
  useLayoutEffect(() => {
    const pager = viewportRef.current;
    if (!pager || !sidebarFlipTick) return;
    pager.getAnimations().forEach(animation => animation.cancel());
    const delta = sidebarFlip.current.from - pager.getBoundingClientRect().left;
    if (Math.abs(delta) < 1 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pager.animate([{ transform: `translateX(${delta}px)` }, { transform: "none" }], { duration: motionTokens.duration.panel * 1000, easing: `cubic-bezier(${motionTokens.easeOut.join(",")})` });
  }, [sidebarFlipTick, viewportRef]);

  const openAssistant = () => { setPanel(null); setAssistantOpen(true); };
  const toggleSound = () => { setSoundEnabled(!soundEnabled); if (!soundEnabled) playUiSound(); };
  const sidebarControls = { openPanel: panel, assistantOpen, onAsk: () => { if (assistantOpen) closeAssistant(); else openAssistant(); }, soundEnabled, onSound: toggleSound, onProfileOpenChange: setProfileMenuOpen };
  const close = () => setPanel(null);
  const openFacts = () => { setFactIndex(0); openPanel("facts"); };

  return (
    <div className="home-screen" data-layout={layout} id="home" data-sidebar-resizing={sidebarResizing} data-section={active} data-sidebar={sidebarVisible ? "open" : "closed"} data-assistant={assistantOpen ? "open" : "closed"} onClickCapture={(event) => {
      if (!soundEnabled || !(event.target instanceof Element) || event.target.closest("[data-sound-toggle], button:disabled, input, select, textarea")) return;
      const interactive = event.target.closest("button:not(:disabled), a, summary");
      const heroTap = event.target.closest(".home-slide");
      if (interactive || heroTap) playUiSound();
    }}>
      <a className="home-skip" href="#slide-content" onClick={(event) => { event.preventDefault(); viewportRef.current?.querySelector<HTMLElement>('[data-state="active"] [data-slide-heading]')?.focus(); }}>Skip to content</a>
      <aside ref={sidebarRef} id="portfolio-sidebar" className="home-sidebar" aria-label="Portfolio navigation">
        <div className="sidebar-expanded" hidden={!sidebarVisible}>
          <SidebarContent onOpen={openPanel} onJump={jump} active={active} {...sidebarControls} />
        </div>
        <div className="portfolio-rail" hidden={sidebarVisible}>
          <SidebarContent compact onOpen={openPanel} onJump={jump} active={active} {...sidebarControls} />
        </div>
      </aside>
      <SidebarResizer expanded={sidebarVisible} onResize={resizeSidebar} onCommit={commitSidebar} />
      <header className="portfolio-topbar" aria-label="Portfolio controls">
        <div className="portfolio-topbar-leading">
          <Button variant="quiet" size="icon" className="portfolio-mobile-toggle" data-mobile-navigation aria-label="Open navigation" aria-haspopup="dialog" onClick={() => openPanel("menu")}><ListIcon aria-hidden /></Button>
        </div>
        {active === "home" && panel !== "playground" && <div className="portfolio-home-controls">
          {layout === "card-shell" && <ControlHint label={soundEnabled ? "Turn sound off" : "Turn sound on"}><Button data-sound-toggle variant="quiet" size="icon" aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"} aria-pressed={soundEnabled} onClick={toggleSound}>{soundEnabled ? <SoundWaveform /> : <WaveformSlashIcon aria-hidden />}</Button></ControlHint>}
          <Button hidden={assistantOpen} data-ai-trigger variant="quiet" aria-label="Ask AI" aria-expanded={assistantOpen} aria-controls="portfolio-assistant" onClick={openAssistant}><SparkleIcon data-icon="inline-start" aria-hidden />Ask AI</Button>
        </div>}
      </header>
      <AssistantPanel open={assistantOpen} onClose={closeAssistant} />
      <main ref={viewportRef} className="portfolio-pager" data-pager aria-label="Portfolio slides">
        <div ref={trackRef} className="portfolio-track" hidden={panel === "playground" || morePage !== null}>
          {scrollingSlideIds.map((id, i) => {
            const project = projectSlides.find((item) => item.slug === id);
            const ProjectIcon = groups.flatMap((group) => group.items).find((item) => item.slug === id)?.icon;
            return (
              <div key={id} className="portfolio-page" data-page={id} data-state={i === index ? "active" : i < index ? "before" : "after"} inert={i !== index} aria-hidden={i !== index}>
                {id === "home" ? <HomeSlide onOpen={openPanel} onFacts={openFacts} active={index === 0 && panel !== "playground" && morePage === null} /> : id === "mobile-more" || id === "web-more" ? <MoreProjectsSlide group={id === "mobile-more" ? "Mobile" : "Web"} onPreviewChange={setProjectPreviewOpen} /> : id === "about" ? <AboutSlide /> : id === "experience" ? <ExperienceSlide /> : id === "contact" ? <ContactSlide /> : id === "process" ? <ProcessSlide onContact={() => openPanel("contact")} /> : project && ProjectIcon ? <ProjectSlide project={project} icon={ProjectIcon} overviewHidden={assistantOpen} /> : null}
              </div>
            );
          })}
        </div>
        {morePage && panel !== "playground" && <MoreProjectsSlide key={morePage} group={morePage === "mobile-more" ? "Mobile" : "Web"} onPreviewChange={setProjectPreviewOpen} />}
        {panel === "playground" && <Playground onClose={() => { setPanel(null); requestAnimationFrame(() => returnFocus.current?.focus()); }} />}
      </main>
      <span className="home-sr-only" role="status" aria-live="polite">{sectionTitles[active] ?? projectSlides.find((project) => project.slug === active)?.title}</span>
      <Sheet open={panel === "menu"} onOpenChange={(open) => { if (!open) close(); }}>
        <SheetContent side="left" className="portfolio-menu" showCloseButton={false} finalFocus={assistantOpen ? false : returnFocus}>
          <SheetTitle className="home-sr-only">Navigation</SheetTitle>
          <SheetDescription className="home-sr-only">Choose a section or project.</SheetDescription>
          <SheetClose render={<Button variant="ghost" size="icon" className="portfolio-overlay-close" aria-label="Close navigation" />}><XIcon aria-hidden /></SheetClose>
          <SidebarContent onOpen={openPanel} onJump={jump} active={active} {...sidebarControls} />
        </SheetContent>
      </Sheet>
      <Dialog open={panel !== null && panel !== "menu" && panel !== "playground"} onOpenChange={(open) => { if (!open) close(); }}>
        <DialogContent className="portfolio-dialog" showCloseButton={false} finalFocus={returnFocus}>
          <div className="home-dialog-surface">
            <DialogClose render={<Button variant="ghost" size="icon" className="portfolio-overlay-close" aria-label="Close dialog" />}><XIcon aria-hidden /></DialogClose>
            {panelKind === "contact" ? <>
              <span className="home-eyebrow"><span className="home-status-dot" aria-hidden />Open for work</span>
              <DialogTitle>Let’s make something feel right.</DialogTitle>
              <DialogDescription className="home-dialog-copy">Have a project in mind, or a role to talk about? Drop me a line.</DialogDescription>
              <a className="home-contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRightIcon size={20} aria-hidden /></a>
              <div className="home-contact-links"><a href="https://t.me/brilpill" target="_blank" rel="noreferrer">Telegram<ArrowUpRightIcon size={14} aria-hidden /></a><a href="https://www.linkedin.com/in/olehbril/" target="_blank" rel="noreferrer">LinkedIn<ArrowUpRightIcon size={14} aria-hidden /></a></div>
            </> : <>
              <span className="home-eyebrow">A little about me <span>{String(factIndex + 1).padStart(2, "0")} / 04</span></span>
              <div className="home-fact" key={factIndex}><DialogTitle>{facts[factIndex].title}</DialogTitle><DialogDescription className="home-dialog-copy">{facts[factIndex].text}</DialogDescription></div>
              <Button variant="secondary" onClick={() => setFactIndex((i) => (i + 1) % facts.length)}><ShuffleIcon data-icon="inline-start" aria-hidden />Another fact</Button>
            </>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HomeSlide({ onOpen, onFacts, active }: { onOpen: (panel: Panel) => void; onFacts: () => void; active: boolean }) {
  return (
      <section className="home-slide" aria-label="Introduction">
        <HeroSeedling active={active} />
        <div hidden={!active} className="home-work-status home-construction-status"><span className="home-status-dot" aria-hidden />Work in progress</div>
        <div aria-hidden="true" />
        <section className="home-introduction" id="introduction" tabIndex={-1} data-slide-heading>
          <div className="home-greeting">
            <h1>Hi! I’m Oleh Bril <em>(brilpill)</em></h1>
            <div className="home-subtitle">
              <p>UX/UI Designer &amp; Engineer from <span className="home-ukraine" role="img" aria-label="Ukraine">🇺🇦</span> Ukraine based in Warsaw.{" "}<span className="home-subtitle-followup">I design how products look, move and feel, and I build them that way.</span></p>
            </div>
          </div>
          <div className="home-actions">
            <Button variant="ink" onClick={() => onOpen("contact")}><PaperPlaneTiltIcon data-icon="inline-start" weight="fill" aria-hidden />Contact</Button>
            <Button variant="secondary" onClick={onFacts}><ShuffleIcon data-icon="inline-start" aria-hidden />Random fact</Button>
          </div>
        </section>
        <SocialLinks />
      </section>
  );
}

function ControlHint({ label, children, side = "bottom" }: { label: string; children: ReactElement; side?: "top" | "bottom" | "right" }) {
  return <Tooltip><TooltipTrigger render={children} /><TooltipContent side={side} sideOffset={8}>{label}</TooltipContent></Tooltip>;
}

function NavigationAskAI({ compact, open, onAsk }: { compact: boolean; open: boolean; onAsk: () => void }) {
  return <ControlHint side={compact ? "right" : "top"} label="Ask AI"><Button variant="quiet" size="icon" className="sidebar-ask-ai" data-ai-trigger aria-label="Ask AI" aria-expanded={open} aria-controls="portfolio-assistant" onClick={onAsk}><SparkleIcon weight={open ? "fill" : "regular"} aria-hidden /></Button></ControlHint>;
}

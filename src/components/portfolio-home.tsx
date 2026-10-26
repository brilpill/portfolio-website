"use client";

import Link from "next/link";
import { flushSync } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRightIcon, ArrowUpRightIcon, FlowArrowIcon, FlowerLotusIcon,
  CaretDownIcon, SolarPanelIcon,
  DiamondsFourIcon,
  GraduationCapIcon, HouseSimpleIcon,
  ListIcon, MoonIcon, ShieldCheckIcon, UsersThreeIcon, HouseLineIcon, PackageIcon, HeartbeatIcon, BowlFoodIcon,
  ShuffleIcon,
  HandWavingIcon, XIcon, WaveformSlashIcon,
  type Icon,
} from "@phosphor-icons/react";
import { ProfileMenu } from "./profile-menu";
import { SidebarResizer } from "./sidebar-resizer";
import { SelectionAskAI } from "./selection-ask-ai";
import { AskAiIcon } from "./ask-ai-icon";
import { AssistantPanel } from "./assistant-panel";
import { SoundWaveform } from "./sound-waveform";
import { playCue, playUiSound } from "./ui-sound";
import { useSidebarVisible, setSidebarVisible, useSoundEnabled, setSoundEnabled, useSectionSnap } from "./settings-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { ReactElement, ReactNode } from "react";
import { profile } from "@/content/profile";
import { HeroActions } from "./hero-actions";
import { HeroSeedling } from "./hero-seedling";
import { SocialLinks } from "./social-links";
import { Playground } from "./playground";
import { SidebarMotionNav, SidebarMotionHighlight, SidebarMotionIcon, useSidebarMotionItem } from "./sidebar-motion";
import { ProjectSlide } from "./project-slide";
import { MoreProjectsSlide } from "./more-projects-slide";
import { usePager } from "./use-pager";
import { motionTokens } from "@/lib/motion";
import { portfolioSlideIds, projectSlides, visibleProjectSlides, sectionTitles, projectDestination, moreProjectsEnabled } from "@/content/project-slides";

// More galleries are sidebar-only destinations; counts derive from the content inventory.
const moreCount = (group: "Mobile" | "Web") => visibleProjectSlides.filter(project => project.group === group && project.placement === "more").length;
const groups: { label: "Mobile" | "Web"; more: string; items: { slug: string; label: string; icon: Icon }[] }[] = [
  { label: "Mobile", more: "mobile-more", items: [
    { slug: "luminasset", label: "LuminAsset", icon: SolarPanelIcon },
    { slug: "dangdi", label: "Dangdi", icon: BowlFoodIcon },
    { slug: "snoozeband", label: "Snoozeband", icon: MoonIcon },
    { slug: "ihide-vpn", label: "iHide VPN", icon: ShieldCheckIcon },
    { slug: "quantum-body", label: "Quantum Body", icon: FlowerLotusIcon },
    { slug: "peach-health", label: "Peach Health", icon: HeartbeatIcon },
    { slug: "nearbor", label: "Nearbor", icon: UsersThreeIcon },
  ] },
  { label: "Web", more: "web-more", items: [
    { slug: "sellergenius", label: "SellerGenius", icon: PackageIcon },
    { slug: "askflow", label: "AskFlow", icon: FlowArrowIcon },
    { slug: "tutor-iq", label: "Tutor IQ", icon: GraduationCapIcon },
    { slug: "smarthost", label: "SmartHost", icon: HouseLineIcon },
  ] },
];
const facts = [
  { title: "From Ukraine, based in Warsaw.", text: "I design web and mobile products for different clients." },
  { title: "5+ years in design.", text: "Fintech, crypto, edtech, AI and SaaS — from the first flow to the last detail." },
  { title: "I build what I design.", text: "I also code what I design using coding agents. Agents do the work; I make the calls." },
  { title: "The small things matter.", text: "Micro-interactions, transitions, states and haptics. How a product feels is part of how it works." },
];
type Panel = "contact" | "facts" | "menu" | "playground" | null;

function SidebarItem({ label, icon: ItemIcon, slug, panel, href, compact, active, openPanel, onJump, onOpen }: { label: string; icon: Icon; slug?: string; panel?: Panel; href?: string; compact: boolean; active: string; openPanel: Panel; onJump: (slug: string) => void; onOpen: (panel: Panel) => void }) {
  // The open destination (current slide, or a panel such as Playground while its dialog is up) uses the filled icon.
  const open = slug ? active === slug : panel != null && openPanel === panel;
  const id = slug || panel || href || label;
  const interaction = useSidebarMotionItem(id, open);
  const content = <><SidebarMotionHighlight visible={interaction.highlighted} /><SidebarMotionIcon id={id} active={interaction.gesturing} selected={open}><ItemIcon size={18} weight={open ? "fill" : "regular"} aria-hidden /></SidebarMotionIcon><span className="nav-item-label">{label}</span></>;
  // `href` opens another page (About me); `slug` jumps to a slide here; otherwise it opens a panel.
  const item = href ? <Link href={href} {...interaction.events} className="home-nav-item" aria-label={label}>{content}</Link> : slug ? <a href={`#${slug}`} {...interaction.events} className={`home-nav-item${active === slug ? " is-current" : ""}`} aria-label={label} aria-current={active === slug ? "page" : undefined} onClick={event => { event.preventDefault(); onJump(slug); }}>{content}</a> : <button {...interaction.events} className="home-nav-item" aria-label={label} onClick={() => onOpen(panel ?? null)}>{content}</button>;
  return compact ? <ControlHint side="right" label={label}>{item}</ControlHint> : item;
}

type GroupMore = { slug: string; count: number; active: string; onJump: (slug: string) => void };

/** Rail: a count beneath the active group opens its More gallery. */
function MoreCount({ label, compact, more }: { label: string; compact: boolean; more: GroupMore }) {
  const name = `${more.count} more ${label.toLowerCase()} project${more.count === 1 ? "" : "s"}`;
  const current = more.active === more.slug;
  const interaction = useSidebarMotionItem(more.slug, current);
  return <ControlHint side={compact ? "right" : "top"} label={name}>
    <a href={`#${more.slug}`} {...interaction.events} className={`${compact ? "rail-more-count" : "nav-more-count"}${current ? " is-current" : ""}`} aria-label={name} aria-current={current ? "page" : undefined} onClick={event => { event.preventDefault(); more.onJump(more.slug); }}><span className="nav-more-label">+{more.count}</span></a>
  </ControlHint>;
}

/** Reveal More only while browsing a case or gallery belonging to its group. */
function MoreReveal({ label, more, hovered }: { label: string; more: GroupMore; hovered: boolean }) {
  const current = more.active === more.slug;
  const visible = hovered || current || visibleProjectSlides.some(project => project.slug === more.active && project.group === label);
  const interaction = useSidebarMotionItem(more.slug, current);
  const name = `${more.count} more ${label.toLowerCase()} project${more.count === 1 ? "" : "s"}`;
  return <div className={`nav-more-reveal${visible ? " is-pinned" : ""}`} inert={!visible} aria-hidden={!visible}><div>
    <a href={`#${more.slug}`} {...interaction.events} className={`nav-more-link${current ? " is-current" : ""}`} aria-label={name} aria-current={current ? "page" : undefined} onClick={event => { event.preventDefault(); more.onJump(more.slug); }}><span className="nav-more-label">{more.count} more project{more.count === 1 ? "" : "s"}</span><ArrowRightIcon size={14} aria-hidden /></a>
  </div></div>;
}

function NavigationGroup({ label, compact, more, children }: { label: string; compact: boolean; more?: GroupMore; children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  if (compact) {
    const showMore = more && more.count > 0 && (hovered || more.active === more.slug || visibleProjectSlides.some(project => project.slug === more.active && project.group === label));
    return <div className="rail-nav-group" role="group" aria-label={label} onPointerLeave={() => setHovered(false)}>
      <div className="rail-divider" role="separator" />
      <div className="home-group-items" onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }}>{children}</div>
      {showMore && <MoreCount label={label} compact more={more} />}
    </div>;
  }
  return <details className="home-nav-group" open onPointerLeave={() => setHovered(false)}><summary>{label}<CaretDownIcon size={14} aria-hidden /></summary><div className="home-group-items" onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }}>{children}</div>{more && <MoreReveal label={label} more={more} hovered={hovered} />}</details>;
}

function SidebarContent({ onJump, onOpen, active, openPanel, compact = false, assistantOpen, onAsk, soundEnabled, onSound, sidebarExpanded, onSidebar, onProfileOpenChange }: { onOpen: (panel: Panel) => void; onJump: (slug: string) => void; active: string; openPanel: Panel; compact?: boolean; assistantOpen: boolean; onAsk: () => void; soundEnabled: boolean; onSound: () => void; sidebarExpanded: boolean; onSidebar: (expanded: boolean) => void; onProfileOpenChange: (open: boolean) => void }) {
  const navigationActive = openPanel === "playground" ? "" : active;
  const shared = { compact, active: navigationActive, openPanel, onJump, onOpen };

  return <>
    <SidebarMotionNav compact={compact}>
      <div className="home-nav-primary">
        <SidebarItem {...shared} label="Home" slug="home" icon={HouseSimpleIcon} />
        <SidebarItem {...shared} label="Playground" panel="playground" icon={DiamondsFourIcon} />
        {/* About me is its own page; My process is hidden until it is ready (its section stays in process-section.tsx). */}
        <SidebarItem {...shared} label="About me" href="/about" icon={HandWavingIcon} />
      </div>
      {groups.map(group => <NavigationGroup key={group.label} label={group.label} compact={compact} more={moreProjectsEnabled ? { slug: group.more, count: moreCount(group.label), active: navigationActive, onJump } : undefined}>{group.items.map(({ slug, label, icon }) => <SidebarItem {...shared} key={slug} slug={slug} label={label} icon={icon} />)}</NavigationGroup>)}
    </SidebarMotionNav>
    {/* Ask AI lives beside the profile: always in reach on every slide, without taking a navigation row. */}
    <div className={compact ? "rail-footer" : "sidebar-footer"}>
      {!compact && <ProfileMenu compact={false} soundEnabled={soundEnabled} onSound={onSound} sidebarExpanded={sidebarExpanded} onSidebar={onSidebar} onOpenChange={onProfileOpenChange} />}
      <NavigationAskAI compact={compact} open={assistantOpen} onAsk={onAsk} />
      {compact && <ProfileMenu compact soundEnabled={soundEnabled} onSound={onSound} sidebarExpanded={sidebarExpanded} onSidebar={onSidebar} onOpenChange={onProfileOpenChange} />}
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
  const sectionSnap = useSectionSnap();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantSelectedText, setAssistantSelectedText] = useState<string | null>(null);
  const closeAssistant = useCallback(() => {
    setAssistantOpen(false);
    setAssistantSelectedText(null);
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
  const { index, direction, go, viewportRef, trackRef } = usePager(scrollingSlideIds.length, layout === "card-shell" ? "scroll" : "flip", panel !== null || morePage !== null || projectPreviewOpen || profileMenuOpen);
  // Snapping on or off changes how tall the case pages are, so keep the current page in view.
  const snapSeen = useRef(sectionSnap);
  useLayoutEffect(() => {
    if (snapSeen.current === sectionSnap) return;
    snapSeen.current = sectionSnap;
    go(index, true);
  }, [sectionSnap]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = morePage ?? scrollingSlideIds[index];

  const focusTarget = useRef<number | null>(null);
  const focusSection = useCallback((target: number) => {
    focusTarget.current = target;
    requestAnimationFrame(() => {
      const heading = viewportRef.current?.querySelector<HTMLElement>(`.portfolio-page[data-page="${scrollingSlideIds[target]}"][data-state="active"] [data-slide-heading]`);
      if (heading) { heading.focus({ preventScroll: true }); focusTarget.current = null; }
    });
  }, [viewportRef]);
  useEffect(() => {
    if (focusTarget.current === index) focusSection(index);
  }, [index, focusSection]);

  const jump = useCallback((slug: string) => {
    const destination = projectDestination(slug);
    const target = scrollingSlideIds.indexOf(destination);
    if (target < 0 && !isMorePage(destination)) return;
    flushSync(() => {
      setMorePage(isMorePage(destination) ? destination : null);
      setPanel(null);
    });
    if (target >= 0) { go(target); focusSection(target); }
    if (location.hash !== `#${destination}`) history.pushState(null, "", `#${destination}`);
    setPanel(null);
  }, [go, focusSection]);

  useEffect(() => {
    const followHash = () => {
      const raw = location.hash.slice(1) || "home";
      if (raw === "search") { setMorePage(null); history.replaceState(null, "", "#home"); go(0, true); return; }
      // About me is its own page now; old section links go there. My process is hidden for now.
      if (raw === "about" || raw === "experience" || raw === "contact") { location.replace("/about"); return; }
      if (raw === "process") { setMorePage(null); history.replaceState(null, "", "#home"); go(0, true); return; }
      if (raw === "playground") {
        setMorePage(null);
        setPanelKind(raw); setPanel(raw); history.replaceState(null, "", "#home"); go(0, true); return;
      }
      const slug = projectDestination(raw);
      if (!moreProjectsEnabled && slug === "home" && raw !== "home") history.replaceState(null, "", "#home");
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
      if (event.target instanceof Element && event.target.closest("a,button,input,textarea,select,summary,[contenteditable=true]") && !event.target.closest('.home-sidebar a.home-nav-item[href]')) return;
      const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 0;
      if (direction) {
        event.preventDefault();
        const target = Math.max(0, Math.min(scrollingSlideIds.length - 1, index + direction));
        if (target !== index) playCue("click");
        go(target);
        focusSection(target);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, focusSection, index, panel, morePage, projectPreviewOpen, profileMenuOpen]);

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

  const openAssistant = () => { setPanel(current => current === "playground" ? current : null); setAssistantOpen(true); };
  const toggleSound = () => { playUiSound(); setSoundEnabled(!soundEnabled); };
  // Sound and Ask AI: in the fixed header on phones (beside the menu button), and inside the hero card on
  // wider screens, level with the availability status, so they scroll away with it. CSS shows one copy at a time.
  const homeControls = (placement: string) => <div className={`portfolio-home-controls ${placement}`}>
    {layout === "card-shell" && <ControlHint label={soundEnabled ? "Turn sound off" : "Turn sound on"}><Button data-sound-toggle variant="quiet" size="icon" aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"} aria-pressed={soundEnabled} onClick={toggleSound}>{soundEnabled ? <SoundWaveform /> : <WaveformSlashIcon aria-hidden />}</Button></ControlHint>}
    <ControlHint label="Currently unavailable."><Button hidden={assistantOpen} data-ai-trigger className="ask-ai-trigger" variant="quiet" aria-label="Ask AI preview" aria-expanded={assistantOpen} aria-controls="portfolio-assistant" onClick={openAssistant}><AskAiIcon />Ask AI</Button></ControlHint>
  </div>;
  const sidebarControls = { openPanel: panel, assistantOpen, onAsk: () => { if (assistantOpen) closeAssistant(); else openAssistant(); }, soundEnabled, onSound: toggleSound, sidebarExpanded: sidebarVisible, onSidebar: commitSidebar, onProfileOpenChange: setProfileMenuOpen };
  const close = () => setPanel(null);

  return (
    <div className="home-screen" data-layout={layout} id="home" data-sidebar-resizing={sidebarResizing} data-section={active} data-navigation-direction={direction} data-sidebar={sidebarVisible ? "open" : "closed"} data-assistant={assistantOpen ? "open" : "closed"} data-snap={sectionSnap ? "on" : "off"}>
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
        {active === "home" && panel !== "playground" && homeControls("portfolio-home-controls-topbar")}
      </header>
      <SelectionAskAI scope=".portfolio-pager" onAsk={text => { setAssistantSelectedText(text); openAssistant(); }} />
      <AssistantPanel open={assistantOpen} onClose={closeAssistant} selectedText={assistantSelectedText} onClearSelectedText={() => setAssistantSelectedText(null)} />
      <main ref={viewportRef} className="portfolio-pager" data-pager aria-label="Portfolio slides">
        <div ref={trackRef} className="portfolio-track" hidden={panel === "playground" || morePage !== null}>
          {scrollingSlideIds.map((id, i) => {
            const project = projectSlides.find((item) => item.slug === id);
            return (
              <div key={id} className="portfolio-page" data-page={id} data-state={i === index ? "active" : i < index ? "before" : "after"} inert={i !== index} aria-hidden={i !== index}>
                {id === "home" ? <HomeSlide active={index === 0 && panel !== "playground" && morePage === null} controls={homeControls("portfolio-home-controls-hero")} /> : id === "mobile-more" || id === "web-more" ? <MoreProjectsSlide group={id === "mobile-more" ? "Mobile" : "Web"} onPreviewChange={setProjectPreviewOpen} /> : project ? <ProjectSlide project={project} overviewHidden={assistantOpen} /> : null}
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

function HomeSlide({ active, controls }: { active: boolean; controls: ReactNode }) {
  return (
      <section className="home-slide" aria-label="Introduction">
        <HeroSeedling active={active} />
        <div hidden={!active} className="home-work-status home-construction-status"><span className="home-status-dot" aria-hidden />Site under development</div>
        {active && controls}
        <div aria-hidden="true" />
        <section className="home-introduction" id="introduction" tabIndex={-1} data-slide-heading>
          <div className="home-greeting">
            <h1>Hi! I’m Oleh Bril <em>(brilpill)</em></h1>
            <div className="home-subtitle">
              <p>UX/UI Designer &amp; Engineer from <span className="home-ukraine" role="img" aria-label="Ukraine">🇺🇦</span> Ukraine based in Warsaw.{" "}<span className="home-subtitle-followup">I design how products look, move and feel, and I build them that way.</span></p>
            </div>
          </div>
          <HeroActions active={active} />
        </section>
        <SocialLinks />
      </section>
  );
}

function ControlHint({ label, children, side = "bottom" }: { label: string; children: ReactElement; side?: "top" | "bottom" | "right" }) {
  return <Tooltip><TooltipTrigger render={children} /><TooltipContent side={side} sideOffset={8}>{label}</TooltipContent></Tooltip>;
}

function NavigationAskAI({ compact, open, onAsk }: { compact: boolean; open: boolean; onAsk: () => void }) {
  return <ControlHint side={compact ? "right" : "top"} label="Currently unavailable."><Button variant="quiet" size="icon" className="sidebar-ask-ai ask-ai-trigger" data-ai-trigger aria-label={open ? "Close Ask AI preview" : "Ask AI preview"} aria-expanded={open} aria-controls="portfolio-assistant" onClick={onAsk}><AskAiIcon size={18} /></Button></ControlHint>;
}

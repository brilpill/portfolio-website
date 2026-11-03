"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { playCue } from "@/components/ui-sound";
import { V5_THEMES, setV5Theme, useV5Theme } from "@/components/settings-store";
import { IconSound, IconSparkle, IconTheme, IconX } from "./icons";
import { wipeTheme } from "./theme-wipe";
import { quoteToAssistant } from "./answers";
import { V5AskDock } from "./ask-dock";
import { AskTagsContext, type AskTag } from "./ask-menu";
import { V5Cursor } from "./cursor";
import { V5SelectionPaint } from "./selection-paint";
import { V5Dither, rippleAt } from "./dither";
import { V5Generate } from "./generate";
import { useEnterMode } from "./enter-mode";

/** Header links (Figma header 1314:22390): the name leads home, so Home itself only repeats in the footer and the phone
 * menu. */
const HEADER_NAV = [
  { label: "About Me", href: "/v5/about" },
  { label: "Playground", href: "/v5/fun" },
];
/** Footer links (after kirill.si); For Agents lives in the footer only. */
const NAV = [
  { label: "Home", href: "/v5" },
  { label: "About", href: "/v5/about" },
  { label: "Playground", href: "/v5/fun" },
];
const AGENTS = { label: "For Agents", href: "/v5/for-agents" };

export type ShellInfo = { name: string; email: string; status: string; links: { label: string; href: string }[]; cases: Record<string, string>; tags: AskTag[] };

const isActive = (pathname: string, href: string) => href === "/v5" ? pathname === "/v5" || pathname.startsWith("/v5/projects") || pathname.startsWith("/v5/writing") : pathname.startsWith(href);

/** The v5 frame, after kirill.si: a sticky header (name; links and icons) and a centred footer around one scrolling
 * column. Case pages keep their section list on the left. */
export function V5Shell({ info, children }: { info: ShellInfo; children: ReactNode }) {
  const pathname = usePathname();
  const scroll = useRef<HTMLDivElement>(null);
  const onCase = pathname.startsWith("/v5/projects/");
  // Home has the hero chat and the dither field.
  const onHome = pathname === "/v5";
  const active = HEADER_NAV.findIndex(item => isActive(pathname, item.href));
  // Light, Dark, Vistula or Moss; light and dark are shared with the main site.
  const theme = useV5Theme();
  // Option 1 (default): vapour title + rise-in; option 2 (?enter=generate): the UI generation skill.
  const enter = useEnterMode();

  // A new page starts at the top of its own scroll column.
  useEffect(() => { scroll.current?.scrollTo(0, 0); }, [pathname]);

  return (
    <AskTagsContext.Provider value={info.tags}>
    <div className="v5" data-theme={theme} data-enter={enter}>
      <div className="v5-page">
        <div className="v5-chrome">
          <div className="v5-margin"><div className="v5-grid">
            <aside className="v5-aside">{onCase && <div id="v5-toc-slot" />}</aside>
            <div className="v5-right"><Hello /></div>
          </div></div>
        </div>

        <div className="v5-scroll" ref={scroll} data-v5-scroll>
          {/* Home's first screen gets kirill.si's dither: drifting at the sides, rippling from clicks. */}
          {onHome && <V5Dither />}
          <Header info={info} active={active} />
          <div className="v5-margin">
            <div className="v5-grid">
              <main key={pathname} className="v5-main"><V5SelectionPaint />{enter === "generate" && <V5Generate />}{children}</main>
            </div>
            <Footer info={info} />
          </div>
        </div>
      </div>
      <SelectionAsk />
      <V5AskDock owner={info.name.split(" ")[0]} />
      {/* Remounted per page, so a label from the link just clicked doesn't linger. */}
      <V5Cursor key={pathname} />
    </div>
    </AskTagsContext.Provider>
  );
}

/** Sticky header (Figma 1314:22390): the theme switcher and name on the left; About Me, Playground and the
 * sound switch on the right. Every link is a Nav-item (1316:22628): blue fill on hover, deeper on press, blue text for
 * the current page, a ring on keyboard focus. It has no background anywhere: it blends with the page by difference
 * (colours in v5.css). On phones the links fold into a menu, which closes when one is chosen. */
function Header({ info, active }: { info: ShellInfo; active: number }) {
  const [open, setOpen] = useState(false);
  const toggle = () => { setOpen(!open); playCue(open ? "close" : "open"); };
  const header = useRef<HTMLElement>(null);
  const highlight = useRef<HTMLSpanElement>(null);
  useNavHighlight(header, highlight);
  return (
    <>
    <header ref={header} className="v5-header" data-open={open || undefined}>
      <span ref={highlight} className="v5-hl" aria-hidden />
      <div className="v5-header-left">
        <ThemeButton />
        <Link className="v5-nav-item" href="/v5">{info.name}</Link>
      </div>
      <div className="v5-header-right">
        <nav className="v5-header-nav" aria-label="Main">
          {HEADER_NAV.map((item, i) => <Link key={item.href} className="v5-nav-item" href={item.href} aria-current={i === active ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <SoundButton />
        <button type="button" className="v5-header-menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} data-sound="off" onClick={toggle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
    </header>
    {/* Outside the header, so its solid sheet isn't blended with the page. */}
    {open && (
      <nav className="v5-header-sheet" aria-label="Menu">
        {[...NAV, AGENTS].map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
      </nav>
    )}
    </>
  );
}

/** The cursor's 14px square, which the nav highlight grows out of and shrinks back into. */
const CURSOR = 14;

/** One highlight for all the header links: on entering a link the cursor square hands over to it (it starts as that
 * square under the pointer and grows to fill the link), it slides from link to link, and on leaving it shrinks back
 * into a square under the pointer, where the cursor takes over again. It sits inside the blended header, so it comes
 * out in the theme's accent. Pointer devices only; elsewhere the links keep their plain states. */
function useNavHighlight(header: RefObject<HTMLElement | null>, highlight: RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const head = header.current, box = highlight.current;
    if (!head || !box || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let current: Element | null = null;
    let hide: number | undefined;

    const set = (x: number, y: number, w: number, h: number, animate: boolean) => {
      box.style.transition = animate ? "" : "none";
      box.style.transform = `translate(${x}px, ${y}px)`;
      box.style.width = `${w}px`;
      box.style.height = `${h}px`;
      if (!animate) void box.offsetWidth; // commit the start before the transition runs
    };
    const square = (event: PointerEvent, animate: boolean) => {
      const at = head.getBoundingClientRect();
      set(event.clientX - at.left - CURSOR / 2, event.clientY - at.top - CURSOR / 2, CURSOR, CURSOR, animate);
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const item = (event.target as Element).closest?.(".v5-nav-item");
      if (!item || item === current) return;
      window.clearTimeout(hide);
      if (!head.hasAttribute("data-hl")) square(event, false);
      current = item;
      head.setAttribute("data-hl", "");
      const r = item.getBoundingClientRect(), at = head.getBoundingClientRect();
      set(r.left - at.left, r.top - at.top, r.width, r.height, true);
    };
    const out = (event: PointerEvent) => {
      if (!current) return;
      const to = event.relatedTarget as Element | null;
      if (to && (current.contains(to) || to.closest?.(".v5-nav-item"))) return;
      current = null;
      square(event, true);
      hide = window.setTimeout(() => { if (!current) head.removeAttribute("data-hl"); }, 160);
    };
    const press = () => head.setAttribute("data-hl-press", "");
    const release = () => head.removeAttribute("data-hl-press");

    head.addEventListener("pointerover", over);
    head.addEventListener("pointerout", out);
    head.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.clearTimeout(hide);
      head.removeEventListener("pointerover", over);
      head.removeEventListener("pointerout", out);
      head.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [header, highlight]);
}

/** Footer (kirill.si): one centred row repeating the header links, then contact, the CV and For Agents. */
function Footer({ info }: { info: ShellInfo }) {
  const [copied, setCopied] = useState(false);
  const linkedIn = info.links.find(link => link.label === "LinkedIn");
  const copy = async () => {
    try { await navigator.clipboard.writeText(info.email); setCopied(true); playCue("success"); setTimeout(() => setCopied(false), 1600); }
    catch { window.location.href = `mailto:${info.email}`; }
  };
  return (
    <footer className="v5-footer">
      {NAV.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      {linkedIn && <a href={linkedIn.href} target="_blank" rel="noopener noreferrer" data-cursor="Open">LinkedIn</a>}
      <button type="button" data-sound="off" data-cursor={copied ? "Copied!" : info.email} onClick={copy}>{copied ? "Copied" : "Copy Mail"}</button>
      <Link href="/v5/about" data-cursor="About & CV">Read CV</Link>
      <Link href={AGENTS.href}>{AGENTS.label}</Link>
    </footer>
  );
}

const THEME_NAME = { light: "Light", dark: "Dark", vistula: "Vistula", moss: "Moss" } as const;

/** Theme switcher: steps through Light, Dark, Vistula and Moss, each arriving in a pixel wipe. Its icon is the theme in
 * use: sun, moon, waves (the Vistula) or a leaf. Unlike other controls, a click on it also ripples the home dither, as if the background under
 * it had been tapped. */
function ThemeButton() {
  const theme = useV5Theme();
  const next = V5_THEMES[(V5_THEMES.indexOf(theme) + 1) % V5_THEMES.length];
  const change = (event: MouseEvent<HTMLButtonElement>) => {
    playCue("toggle");
    const box = event.currentTarget.getBoundingClientRect();
    rippleAt(box.left + box.width / 2, box.top + box.height / 2);
    wipeTheme(() => setV5Theme(next));
  };
  return (
    <button type="button" className="v5-icon" aria-label={`Theme: ${THEME_NAME[theme]}. Switch to ${THEME_NAME[next]}`} data-cursor={THEME_NAME[next]} data-sound="off" onClick={change}>
      <IconTheme theme={theme} />
    </button>
  );
}

/** Sound switch: icon/sound-on, or icon/sound-off (struck through) while off. */
function SoundButton() {
  const sound = useSyncExternalStore(subscribeSound, readSound, () => false);
  const toggle = () => {
    const next = !sound;
    try { localStorage.setItem("portfolio-sound", next ? "on" : "off"); } catch {}
    window.dispatchEvent(new Event("portfolio-sound"));
    if (next) playCue("toggle");
  };
  return (
    <button type="button" className="v5-icon" data-sound-toggle aria-pressed={sound} aria-label={sound ? "Turn sound off" : "Turn sound on"} data-cursor={sound ? "Sound off" : "Sound on"} onClick={toggle}>
      <IconSound on={sound} />
    </button>
  );
}

/** The selected passage as a quote: widened to whole words (a drag that stops at "build i" quotes "build it"), with
 * an ellipsis on either side where its sentence carries on past the selection. */
function quotable(selected: Range) {
  const range = selected.cloneRange();
  const word = /[\p{L}\p{N}'’-]/u;
  const { startContainer: start, endContainer: end } = range;
  if (start.nodeType === Node.TEXT_NODE) {
    let at = range.startOffset;
    while (at > 0 && word.test(start.textContent![at - 1])) at--;
    range.setStart(start, at);
  }
  if (end.nodeType === Node.TEXT_NODE) {
    let at = range.endOffset;
    while (at < end.textContent!.length && word.test(end.textContent![at])) at++;
    // A full stop right after the last word comes along, so the quote ends the sentence instead of trailing off.
    while (at < end.textContent!.length && /[.!?]/.test(end.textContent![at])) at++;
    range.setEnd(end, at);
  }
  const text = range.toString().replace(/\s+/g, " ").trim().slice(0, 600);
  const before = start.nodeType === Node.TEXT_NODE && /[^\s.!?:]\s*$/.test(start.textContent!.slice(0, range.startOffset));
  const after = end.nodeType === Node.TEXT_NODE && !/[.!?:]$/.test(text) &&/\S/.test(end.textContent!.slice(range.endOffset));
  return `${before ? "…" : ""}${text}${after ? "…" : ""}`;
}

/** Select page text and an "Ask AI" chip appears above it; it opens the Ask AI dock with the passage attached. */
function SelectionAsk() {
  const [spot, setSpot] = useState<{ x: number; y: number; text: string }>();

  useEffect(() => {
    const read = () => {
      const selection = window.getSelection();
      const node = selection?.anchorNode;
      const element = node instanceof Element ? node : node?.parentElement;
      // Only page copy: not the chat, inputs, or the button itself.
      if (!selection?.rangeCount || !selection.toString().trim() || !element?.closest(".v5-main") || element.closest("input, textarea, .v5-chat")) { setSpot(undefined); return; }
      const range = selection.getRangeAt(0);
      const box = range.getBoundingClientRect();
      setSpot({ x: box.left + box.width / 2, y: box.top, text: quotable(range) });
    };
    const hide = () => setSpot(undefined);
    // Read on release, not on every change, so the button doesn't chase the cursor mid-drag.
    const release = () => setTimeout(read, 0);
    const change = () => { if (!window.getSelection()?.toString().trim()) hide(); };
    document.addEventListener("mouseup", release);
    document.addEventListener("keyup", release);
    document.addEventListener("selectionchange", change);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("mouseup", release);
      document.removeEventListener("keyup", release);
      document.removeEventListener("selectionchange", change);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);

  if (!spot) return null;
  return (
    <div className="v5-select-ask" style={{ left: spot.x, top: spot.y }}>
      <button type="button" className="v5-btn" data-style="accent" data-sound="off"
        onMouseDown={event => event.preventDefault()}
        onClick={() => { quoteToAssistant(spot.text); window.getSelection()?.removeAllRanges(); setSpot(undefined); }}>
        <IconSparkle />
        Ask AI
      </button>
    </div>
  );
}

/** A round hello in the corner (Figma 1285:6957): opens About, and can be put away. */
function Hello() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="v5-hello">
      <Link href="/v5/about" className="v5-hello-face" aria-label="About Oleh" data-cursor="Say hi">
        <img src="/v5/sprite/intro.png" alt="" />
      </Link>
      <button type="button" className="v5-hello-hide" aria-label="Hide" onClick={() => { setHidden(true); playCue("close"); }} data-sound="off">
        <IconX />
      </button>
    </div>
  );
}

/** The visitor's sound choice, shared with the main site (settings-store's "portfolio-sound"). */
function readSound() {
  try { return localStorage.getItem("portfolio-sound") === "on"; } catch { return false; }
}
function subscribeSound(change: () => void) {
  window.addEventListener("portfolio-sound", change);
  window.addEventListener("storage", change);
  return () => { window.removeEventListener("portfolio-sound", change); window.removeEventListener("storage", change); };
}

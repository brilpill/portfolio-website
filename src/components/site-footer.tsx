"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { LinkedinLogoIcon, TelegramLogoIcon, PinterestLogoIcon, AtIcon, CheckIcon } from "@phosphor-icons/react";
import { profile } from "@/content/profile";
import { AboutCursor } from "./about-cursor";
import { FooterEmbers } from "./footer-embers";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/olehbril/", icon: LinkedinLogoIcon },
  { label: "Telegram", href: "https://t.me/brilpill", icon: TelegramLogoIcon },
  { label: "Email", icon: AtIcon },
  { label: "Pinterest", href: "https://www.pinterest.com/brilpill/", icon: PinterestLogoIcon },
];

/** Footer (supplied reference): the cursor rests in the empty slot on top, then one line and three ways to reach me. */
export function SiteFooter({ still }: { still?: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const turn = useRef(0), rest = useRef(1);
  const [visible, setVisible] = useState(false);
  const headingId = useId();
  useEffect(() => {
    const element = root.current;
    if (!element || still) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [still]);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyEmail() {
    let success = false;
    try { await navigator.clipboard.writeText(profile.email); success = true; } catch {
      const field = document.createElement("textarea");
      field.value = profile.email;
      field.readOnly = true;
      field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      const focused = document.activeElement as HTMLElement | null;
      document.body.append(field); field.select();
      try { success = document.execCommand("copy"); } catch { /* Report failure without opening a mail app. */ }
      finally { field.remove(); focused?.focus({ preventScroll: true }); }
    }
    setStatus(success ? "copied" : "error");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  }
  const copied = status === "copied";
  return <footer ref={root} id="contact" className="about-footer" aria-labelledby={headingId}>
    {/* The travelling cursor stops here; on narrow cards, where it doesn't travel, a second one fills the slot. */}
    <div className="about-footer-slot" aria-hidden><div className={`about-head${still ? " about-head-still" : ""}`}>{still ?? <AboutCursor turn={turn} rest={rest} active={visible} />}</div></div>
    <h2 id={headingId}>I’d be glad to talk about how my experience can help your team.</h2>
    <div className="about-footer-contacts">
      <a href="https://www.linkedin.com/in/olehbril/" target="_blank" rel="noreferrer"><span>Connect on LinkedIn</span><strong>Oleh Bril</strong></a>
      <a href="https://t.me/brilpill" target="_blank" rel="noreferrer"><span>Message me on Telegram</span><strong>@brilpill</strong></a>
      <button type="button" onClick={() => void copyEmail()} aria-label={copied ? "Email copied" : `Copy email address ${profile.email}`}>
        <span>Copy email</span><strong className="about-email-swap" data-copied={copied || undefined}><span>{profile.email}</span><span aria-hidden>Copied <CheckIcon size={20} /></span></strong>
      </button>
    </div>
    <div className="about-footer-socials">{socials.map(({ label, href, icon: Icon }) => href
      ? <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon size={18} aria-hidden /></a>
      : <button key={label} type="button" onClick={() => void copyEmail()} aria-label={copied ? "Email copied" : "Copy email"} title={copied ? "Copied" : "Copy email"}>{copied ? <CheckIcon size={18} aria-hidden /> : <Icon size={18} aria-hidden />}</button>
    )}</div>
    <span className="home-sr-only" role="status">{copied ? "Email copied to clipboard" : status === "error" ? `Could not copy. Email: ${profile.email}` : ""}</span>
    <p className="about-footer-note">© 2026 Oleh Bril · Warsaw</p>
  </footer>;
}


/** Shared closing section for every case study; flame field spans the whole main column. */
export function CaseFooter() {
  return <><div className="case-footer-content"><SiteFooter /></div><FooterEmbers /></>;
}

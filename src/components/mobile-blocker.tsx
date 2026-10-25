"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AtIcon, CheckIcon, CopyIcon, LinkedinLogoIcon, MonitorIcon,
  PinterestLogoIcon, ShareNetworkIcon, TelegramLogoIcon,
} from "@phosphor-icons/react";
import { profile } from "@/content/profile";
import { FooterEmbers } from "./footer-embers";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.readOnly = true;
    field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.append(field);
    field.select();
    try { return document.execCommand("copy"); }
    catch { return false; }
    finally { field.remove(); }
  }
}

/** Temporary phone screen with useful ways to continue on desktop or get in touch. */
export function MobileBlocker() {
  const [copied, setCopied] = useState<"link" | "email" | null>(null);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const report = (kind: "link" | "email", success: boolean) => {
    setCopied(success ? kind : null);
    setMessage(success ? `${kind === "link" ? "Link" : "Email"} copied to clipboard` : `Could not copy ${kind}`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setCopied(null); setMessage(""); }, 2200);
  };
  const copyLink = async () => report("link", await copyText(location.href));
  const copyEmail = async () => report("email", await copyText(profile.email));
  const share = async () => {
    if (!navigator.share) {
      setMessage("Sharing is unavailable in this browser");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(""), 2200);
      return;
    }
    try {
      await navigator.share({ title: document.title, url: location.href });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("Could not open sharing");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(""), 2200);
    }
  };

  return <div className="mobile-blocker" role="dialog" aria-modal="true" aria-labelledby="mobile-blocker-title">
    <div className="mobile-blocker-flames"><FooterEmbers /></div>
    <div className="mobile-blocker-card">
      <span className="mobile-blocker-icon" aria-hidden>
        <Image src="/figma/avatar.png" alt="" width={48} height={48} />
        <MonitorIcon size={16} weight="fill" />
      </span>
      <h1 id="mobile-blocker-title">The mobile version is on its way</h1>
      <p>I&apos;m still working on it. For now, please open this site on a desktop or laptop.</p>
      <div className="mobile-blocker-actions">
        <button type="button" className="mobile-blocker-button" onClick={() => void copyLink()}>
          {copied === "link" ? <CheckIcon size={17} aria-hidden /> : <CopyIcon size={17} aria-hidden />}
          <span>{copied === "link" ? "Copied" : "Here, copy link"}</span>
        </button>
        <button type="button" className="mobile-blocker-button mobile-blocker-button-share" onClick={() => void share()}>
          <ShareNetworkIcon size={17} aria-hidden /> <span>Share</span>
        </button>
      </div>
      <div className="mobile-blocker-socials" aria-label="Social links">
        <a href="https://www.linkedin.com/in/olehbril/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinLogoIcon size={18} aria-hidden /></a>
        <a href="https://t.me/brilpill" target="_blank" rel="noreferrer" aria-label="Telegram"><TelegramLogoIcon size={18} aria-hidden /></a>
        <button type="button" onClick={() => void copyEmail()} aria-label={copied === "email" ? "Email copied" : "Copy Email"}>{copied === "email" ? <CheckIcon size={18} aria-hidden /> : <AtIcon size={18} aria-hidden />}</button>
        <a href="https://www.pinterest.com/brilpill/" target="_blank" rel="noreferrer" aria-label="Pinterest"><PinterestLogoIcon size={18} aria-hidden /></a>
      </div>
      {message.startsWith("Sharing") || message.startsWith("Could not open") ? <span className="mobile-blocker-feedback" role="status">{message}</span> : null}
      <span className="home-sr-only" role="status">{message.includes("copy") || message.includes("copied") ? message : ""}</span>
    </div>
  </div>;
}

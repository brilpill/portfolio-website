"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowRightIcon, AtIcon, CheckIcon, CircleNotchIcon, LinkedinLogoIcon, LockSimpleIcon, PinterestLogoIcon, TelegramLogoIcon } from "@phosphor-icons/react";
import { profile } from "@/content/profile";
import { FooterEmbers } from "./footer-embers";
import { playCue } from "./ui-sound";

/**
 * The temporary password screen (desktop). Same card, flames and links as the mobile blocker, with a
 * password field in place of the copy and share buttons. On phones the mobile blocker covers it.
 */
export function AccessGate() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong" | "open">("idle");
  const [emailCopied, setEmailCopied] = useState(false);
  const field = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!password || state === "checking" || state === "open") return;
    setState("checking");
    const response = await fetch("/api/unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }).catch(() => null);
    if (response?.ok) {
      setState("open");
      playCue("success");
      // The address already is the page that was asked for; reloading now shows it instead of this screen.
      location.reload();
      return;
    }
    setState("wrong");
    playCue("error");
    field.current?.select();
  }

  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); } catch { location.href = `mailto:${profile.email}`; return; }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  }

  return (
    <main className="access-gate">
      <div className="mobile-blocker-flames"><FooterEmbers /></div>
      <div className="mobile-blocker-card">
        <span className="mobile-blocker-icon" aria-hidden>
          <Image src="/figma/avatar.png" alt="" width={48} height={48} priority />
          <LockSimpleIcon size={16} weight="fill" />
        </span>
        <h1>This portfolio is private for now</h1>
        <p>I&apos;m sharing it with a few people before it goes public. Enter the password you were given.</p>
        <form className="access-gate-form" data-state={state} onSubmit={event => void submit(event)}>
          <label className="home-sr-only" htmlFor="access-password">Password</label>
          <input ref={field} id="access-password" type="password" name="password" autoComplete="current-password" autoFocus required placeholder="Password"
            value={password} aria-invalid={state === "wrong" || undefined} aria-describedby="access-status"
            onChange={event => { setPassword(event.target.value); if (state === "wrong") setState("idle"); }} />
          <button type="submit" className="mobile-blocker-button" disabled={!password || state === "checking" || state === "open"} data-sound="off">
            {state === "checking" ? <CircleNotchIcon className="access-gate-spinner" size={17} aria-hidden /> : state === "open" ? <CheckIcon size={17} aria-hidden /> : <ArrowRightIcon size={17} aria-hidden />}
            <span>{state === "open" ? "Opening" : "Enter"}</span>
          </button>
        </form>
        <p id="access-status" className="access-gate-status" role="status">{state === "wrong" ? "That password isn't right. Try again." : ""}</p>
        <div className="mobile-blocker-socials" aria-label="Social links">
          <a href="https://www.linkedin.com/in/olehbril/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinLogoIcon size={18} aria-hidden /></a>
          <a href="https://t.me/brilpill" target="_blank" rel="noreferrer" aria-label="Telegram"><TelegramLogoIcon size={18} aria-hidden /></a>
          <button type="button" onClick={() => void copyEmail()} aria-label={emailCopied ? "Email copied" : "Copy Email"}>{emailCopied ? <CheckIcon size={18} aria-hidden /> : <AtIcon size={18} aria-hidden />}</button>
          <a href="https://www.pinterest.com/brilpill/" target="_blank" rel="noreferrer" aria-label="Pinterest"><PinterestLogoIcon size={18} aria-hidden /></a>
        </div>
      </div>
    </main>
  );
}

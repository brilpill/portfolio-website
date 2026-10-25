"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { profile } from "@/content/profile";
import { motionTokens } from "@/lib/motion";

export function ContactDetails() {
  const id = useId();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyEmail() {
    let copied = false;
    try { await navigator.clipboard.writeText(profile.email); copied = true; } catch {
      const field = document.createElement("textarea");
      field.value = profile.email;
      field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      const focused = document.activeElement as HTMLElement | null;
      document.body.append(field);
      field.select();
      try { copied = document.execCommand("copy"); } finally { field.remove(); focused?.focus({ preventScroll: true }); }
    }
    setStatus(copied ? "copied" : "error");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  }
  const swap = {
    initial: { opacity: 0, scale: reduced ? 1 : .65, filter: reduced ? "none" : "blur(3px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: reduced ? 1 : .65, filter: reduced ? "none" : "blur(3px)" },
    transition: { duration: reduced ? 0 : motionTokens.duration.popover, ease: motionTokens.easeOut },
  };
  return <div className="contact-detail-list" onPointerLeave={() => setHovered(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(null); }}>
    {[{ key: "email", label: "Email", value: profile.email }, { key: "linkedin", label: "LinkedIn", value: "Oleh Bril", href: "https://www.linkedin.com/in/olehbril/" }, { key: "telegram", label: "Telegram", value: "@brilpill", href: "https://t.me/brilpill" }].map(item => {
      const active = hovered === item.key;
      const done = item.key === "email" && status === "copied";
      const events = { className: "contact-detail-row", onPointerEnter: (event: React.PointerEvent) => { if (event.pointerType !== "touch") setHovered(item.key); }, onFocus: () => setHovered(item.key) };
      const content = <>
        <AnimatePresence>{active && <motion.span className="contact-detail-highlight" layoutId={`${id}-highlight`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduced ? { duration: 0 } : motionTokens.spring} aria-hidden />}</AnimatePresence>
        <span className="contact-detail-copy"><small>{item.label}</small><span className="contact-detail-value"><motion.span initial={false} animate={{ opacity: done ? 0 : 1, y: done && !reduced ? -4 : 0 }} transition={swap.transition}>{item.value}</motion.span>{item.key === "email" && <motion.span aria-hidden initial={false} animate={{ opacity: done ? 1 : 0, y: done || reduced ? 0 : 4 }} transition={swap.transition}>Copied</motion.span>}</span></span>
        <motion.span className="contact-detail-icon" aria-hidden animate={{ x: active && item.href && !reduced ? 2 : 0, y: active && item.href && !reduced ? -2 : 0 }} transition={reduced ? { duration: 0 } : motionTokens.spring}><AnimatePresence initial={false}><motion.span key={done ? "done" : "default"} {...swap}>{item.href ? <ArrowUpRightIcon size={16} /> : done ? <CheckIcon size={16} /> : <CopyIcon size={16} />}</motion.span></AnimatePresence></motion.span>
      </>;
      return item.href ? <a key={item.key} {...events} href={item.href} target="_blank" rel="noreferrer">{content}</a> : <button key={item.key} {...events} type="button" onClick={() => void copyEmail()} aria-label={done ? "Email copied" : `Copy email address ${profile.email}`}>{content}</button>;
    })}
    <span className="home-sr-only" role="status">{status === "copied" ? "Email copied to clipboard" : status === "error" ? `Could not copy. Email: ${profile.email}` : ""}</span>
  </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { AtIcon, CheckIcon, LinkedinLogoIcon, PinterestLogoIcon, TelegramLogoIcon, type Icon } from "@phosphor-icons/react";
import { profile } from "@/content/profile";
import { motionTokens } from "@/lib/motion";

type Item = { id: string; label: string; icon: Icon; gesture: TargetAndTransition } & ({ href: string } | { copy: string });

// Each icon has its own small hover gesture: the @ turns, the logo pops, the plane lifts off
// toward its corner, the pin wobbles. All stay within a few px or degrees.
const items: Item[] = [
  { id: "email", label: "Email", copy: profile.email, icon: AtIcon, gesture: { rotate: 24 } },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/olehbril/", icon: LinkedinLogoIcon, gesture: { scale: 1.14 } },
  { id: "telegram", label: "Telegram", href: "https://t.me/brilpill", icon: TelegramLogoIcon, gesture: { x: 2, y: -2, rotate: -8 } },
  { id: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/brilpill/", icon: PinterestLogoIcon, gesture: { rotate: [0, -12, 8, 0], transition: { duration: .45, ease: motionTokens.easeOut } } },
];
const rest: TargetAndTransition = { rotate: 0, x: 0, y: 0, scale: 1 };
const COPIED_FOR = 2000; // ms the check and "Copied" stay before the @ and "Email" return
// Label swap: both words stay mounted in one grid cell, so the button keeps the width of the longer one.
const labelShown = { opacity: 1, scale: 1, filter: "blur(0px)" };
const labelHidden = { opacity: 0, scale: .92, filter: "blur(4px)" };

// Icon swap: the outgoing icon shrinks and blurs out while the incoming one sharpens in, in place.
const swap = {
  initial: { opacity: 0, scale: .6, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: .6, filter: "blur(4px)" },
  transition: { duration: motionTokens.duration.popover, ease: motionTokens.easeOut },
};

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall back below */ }
  try {
    const field = Object.assign(document.createElement("textarea"), { value: text });
    field.setAttribute("readonly", ""); field.style.position = "fixed"; field.style.opacity = "0";
    document.body.append(field); field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  } catch { return false; }
}

/**
 * Hero social links. One shared highlight slides between items as the pointer moves along the row
 * (Motion layoutId on the physical spring) and fades out when the pointer leaves; keyboard focus
 * moves it too. Email copies the address instead of opening a mail app, and its @ turns into a check.
 */
export function SocialLinks() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy(text: string) {
    // No clipboard access: open the mail app instead, so the click still does something useful.
    if (!(await copyText(text))) { window.location.assign(`mailto:${text}`); return; }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_FOR);
  }

  return (
    <footer className="home-socials" aria-label="Elsewhere" onPointerLeave={() => setHovered(null)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(null); }}>
      {items.map((item) => {
        const { id, label, icon: ItemIcon, gesture } = item;
        const active = hovered === id;
        const done = "copy" in item && copied;
        const shared = {
          className: "home-social",
          "data-active": active || undefined,
          onPointerEnter: (event: React.PointerEvent) => { if (event.pointerType !== "touch") setHovered(id); },
          onFocus: (event: React.FocusEvent<HTMLElement>) => { if (event.currentTarget.matches(":focus-visible")) setHovered(id); },
        };
        const content = <>
          <AnimatePresence>
            {active && <motion.span layoutId="home-social-highlight" className="home-social-highlight" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: motionTokens.duration.fast } }} transition={motionTokens.spring} />}
          </AnimatePresence>
          <motion.span className="home-social-icon" aria-hidden animate={active && !done ? gesture : rest} transition={motionTokens.spring}>
            <AnimatePresence initial={false}>
              {done ? <motion.span key="check" {...swap}><CheckIcon size={16} /></motion.span> : <motion.span key="icon" {...swap}><ItemIcon size={16} /></motion.span>}
            </AnimatePresence>
          </motion.span>
          {"copy" in item
            ? <span className="home-social-label home-social-label-swap">
                <motion.span initial={false} animate={done ? labelHidden : labelShown} transition={swap.transition}>{label}</motion.span>
                <motion.span aria-hidden initial={false} animate={done ? labelShown : labelHidden} transition={swap.transition}>Copied</motion.span>
              </span>
            : <span className="home-social-label">{label}</span>}
        </>;
        return "copy" in item
          ? <button key={id} type="button" {...shared} title={`Copy ${item.copy}`} aria-label={done ? `${label} copied` : `Copy email address ${item.copy}`} onClick={() => void copy(item.copy)}>{content}</button>
          : <a key={id} href={item.href} target="_blank" rel="noreferrer" {...shared}>{content}</a>;
      })}
      <span className="home-sr-only" role="status" aria-live="polite">{copied ? `${profile.email} copied to the clipboard` : ""}</span>
    </footer>
  );
}

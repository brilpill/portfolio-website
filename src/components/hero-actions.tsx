"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { HandWavingIcon, PaperPlaneTiltIcon, XIcon } from "@phosphor-icons/react";
import { ContactDetails } from "./contact-details";

/** Contact (expands into the contact card) and, on the home hero, a link to the About me page. */
export function HeroActions({ active = true, contactOnly = false, direction = "down" }: { active?: boolean; contactOnly?: boolean; direction?: "up" | "down" }) {
  const instanceId = useId();
  const [open, setOpen] = useState<"contact" | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<"contact", HTMLButtonElement | null>>>({});
  const reduced = useReducedMotion();
  const details = useRef<Partial<Record<"contact", HTMLDivElement | null>>>({});
  const [cardWidth, setCardWidth] = useState(320);
  const [heights, setHeights] = useState({ contact: 216 });
  useLayoutEffect(() => {
    const measure = () => {
      const width = root.current?.clientWidth ?? 320;
      setCardWidth(Math.min(320, contactOnly || window.innerWidth <= 600 ? width : width - 140));
      setHeights(previous => {
        const next = { contact: 36 + (details.current.contact?.offsetHeight ?? 180) };
        return previous.contact === next.contact ? previous : next;
      });
    };
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    Object.values(details.current).forEach(node => { if (node) observer.observe(node); });
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [contactOnly]);
  const expanded = active ? open : null;
  const transition = { duration: reduced ? 0 : 0.38, ease: [0.23, 1, 0.32, 1] as const };

  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(null);
      triggers.current[expanded]?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape, true);
    };
  }, [expanded]);

  return (
    <div ref={root} className="hero-actions" data-open={expanded ?? "none"} data-direction={direction}>
      {(["contact"] as const).map(kind => {
        const isOpen = expanded === kind;
        const Icon = PaperPlaneTiltIcon;
        return (
          <motion.div key={kind} initial={false} animate={{ width: isOpen ? cardWidth : 104 }} transition={transition} className={`hero-action-slot hero-action-${kind}`} data-expanded={isOpen}>
            <motion.div initial={false} animate={{ height: isOpen ? heights[kind] : 36 }} transition={transition} className="hero-action-card">
              <button ref={node => { triggers.current[kind] = node; }} className="hero-action-trigger" aria-label={isOpen ? "Close contact" : "Contact"} aria-expanded={isOpen} aria-controls={`${instanceId}-${kind}-details`} onClick={() => setOpen(isOpen ? null : kind)}>
                <Icon size={16} weight="fill" aria-hidden />
                <span className="hero-action-label">
                  <motion.span initial={false} animate={{ opacity: kind === "contact" && isOpen ? 0 : 1, y: kind === "contact" && isOpen && !reduced ? -6 : 0 }} transition={{ duration: reduced ? 0 : 0.15 }}>Contact</motion.span>
                  <motion.span aria-hidden={!isOpen} initial={false} animate={{ opacity: isOpen ? 1 : 0, y: isOpen || reduced ? 0 : 6 }} transition={{ duration: reduced ? 0 : 0.22, delay: isOpen && !reduced ? 0.08 : 0 }}>Get in touch</motion.span>
                </span>
                <motion.span className="hero-action-close" initial={false} animate={{ opacity: isOpen ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.15 }}><XIcon size={16} aria-hidden /></motion.span>
              </button>
              <motion.div ref={node => { details.current[kind] = node; }} id={`${instanceId}-${kind}-details`} className="hero-action-details" style={{ width: cardWidth }} inert={!isOpen} aria-hidden={!isOpen} initial={false} animate={{ opacity: isOpen ? 1 : 0, y: isOpen || reduced ? 0 : 6 }} transition={{ duration: reduced ? 0 : isOpen ? 0.22 : 0.12, delay: isOpen && !reduced ? 0.1 : 0 }}>
                  <ContactDetails />
                </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
      {!contactOnly && (
        <Link href="/about" className="hero-action-about">
          <HandWavingIcon className="hero-action-about-icon" size={16} aria-hidden />
          <span>About me</span>
        </Link>
      )}
    </div>
  );
}

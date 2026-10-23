"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PaperPlaneTiltIcon, ShuffleIcon, XIcon } from "@phosphor-icons/react";
import { ContactDetails } from "./contact-details";

type Fact = { title: string; text: string };

export function HeroActions({ facts = [], active = true, contactOnly = false, direction = "down" }: { facts?: Fact[]; active?: boolean; contactOnly?: boolean; direction?: "up" | "down" }) {
  const instanceId = useId();
  const [open, setOpen] = useState<"contact" | "facts" | null>(null);
  const [fact, setFact] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<"contact" | "facts", HTMLButtonElement | null>>>({});
  const reduced = useReducedMotion();
  const details = useRef<Partial<Record<"contact" | "facts", HTMLDivElement | null>>>({});
  const [cardWidth, setCardWidth] = useState(320);
  const [heights, setHeights] = useState({ contact: 216, facts: 210 });
  useLayoutEffect(() => {
    const measure = () => {
      const width = root.current?.clientWidth ?? 320;
      setCardWidth(Math.min(320, contactOnly || window.innerWidth <= 600 ? width : width - 140));
      setHeights(previous => {
        const next = {
          contact: 36 + (details.current.contact?.offsetHeight ?? 180),
          facts: 36 + (details.current.facts?.offsetHeight ?? 174),
        };
        return previous.contact === next.contact && previous.facts === next.facts ? previous : next;
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
      {(contactOnly ? ["contact"] as const : ["contact", "facts"] as const).map(kind => {
        const isOpen = expanded === kind;
        const Icon = kind === "contact" ? PaperPlaneTiltIcon : ShuffleIcon;
        return (
          <motion.div key={kind} initial={false} animate={{ width: isOpen ? cardWidth : kind === "contact" ? 104 : 132 }} transition={transition} className={`hero-action-slot hero-action-${kind}`} data-expanded={isOpen}>
            <motion.div initial={false} animate={{ height: isOpen ? heights[kind] : 36 }} transition={transition} className="hero-action-card">
              <button ref={node => { triggers.current[kind] = node; }} className="hero-action-trigger" aria-label={isOpen ? `Close ${kind === "contact" ? "contact" : "random fact"}` : kind === "contact" ? "Contact" : "Random fact"} aria-expanded={isOpen} aria-controls={`${instanceId}-${kind}-details`} onClick={() => setOpen(isOpen ? null : kind)}>
                <Icon size={16} weight={kind === "contact" ? "fill" : "regular"} aria-hidden />
                <span className="hero-action-label">
                  <motion.span initial={false} animate={{ opacity: kind === "contact" && isOpen ? 0 : 1, y: kind === "contact" && isOpen && !reduced ? -6 : 0 }} transition={{ duration: reduced ? 0 : 0.15 }}>{kind === "contact" ? "Contact" : "Random fact"}</motion.span>
                  {kind === "contact" && <motion.span aria-hidden={!isOpen} initial={false} animate={{ opacity: isOpen ? 1 : 0, y: isOpen || reduced ? 0 : 6 }} transition={{ duration: reduced ? 0 : 0.22, delay: isOpen && !reduced ? 0.08 : 0 }}>Get in touch</motion.span>}
                </span>
                <motion.span className="hero-action-close" initial={false} animate={{ opacity: isOpen ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.15 }}><XIcon size={16} aria-hidden /></motion.span>
              </button>
              <motion.div ref={node => { details.current[kind] = node; }} id={`${instanceId}-${kind}-details`} className="hero-action-details" style={{ width: cardWidth }} inert={!isOpen} aria-hidden={!isOpen} initial={false} animate={{ opacity: isOpen ? 1 : 0, y: isOpen || reduced ? 0 : 6 }} transition={{ duration: reduced ? 0 : isOpen ? 0.22 : 0.12, delay: isOpen && !reduced ? 0.1 : 0 }}>
                  {kind === "contact" ? <ContactDetails /> : <>
                    <div aria-live="polite" aria-atomic="true"><h2>{facts[fact].title}</h2><p>{facts[fact].text}</p></div>
                    <div className="hero-fact-footer"><small>{fact + 1} / {facts.length}</small><button onClick={() => setFact(i => (i + 1) % facts.length)}><ShuffleIcon size={15} aria-hidden />Another fact</button></div>
                  </>}
                </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

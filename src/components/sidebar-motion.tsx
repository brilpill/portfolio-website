"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode, type PointerEvent, type FocusEvent } from "react";
import { LayoutGroup, motion, useAnimationControls, type TargetAndTransition } from "motion/react";
import { motionTokens } from "@/lib/motion";

const reducedSnapshot = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const reducedServerSnapshot = () => false;
function subscribeReduced(onChange: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const useSidebarReducedMotion = () => useSyncExternalStore(subscribeReduced, reducedSnapshot, reducedServerSnapshot);

const SidebarMotionContext = createContext<{ target: string | null; setTarget: (target: string | null) => void }>({ target: null, setTarget: () => {} });

/** Each expanded, rail and mobile navigation owns its own shared highlight. */
export function SidebarMotionNav({ compact, children }: { compact: boolean; children: ReactNode }) {
  const [target, setTarget] = useState<string | null>(null);
  const id = useId();
  return <SidebarMotionContext.Provider value={{ target, setTarget }}>
    <LayoutGroup id={id}>
      <nav className="home-navigation sidebar-motion-nav" aria-label={compact ? "Compact navigation" : "Main navigation"}
        onPointerLeave={() => setTarget(null)}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setTarget(null); }}>
        {children}
      </nav>
    </LayoutGroup>
  </SidebarMotionContext.Provider>;
}

export function useSidebarMotionItem(id: string, selected: boolean) {
  const { target, setTarget } = useContext(SidebarMotionContext);
  return {
    highlighted: target === id || (target === null && selected),
    gesturing: target === id,
    events: {
      onPointerEnter: (event: PointerEvent<HTMLElement>) => { if (event.pointerType !== "touch") setTarget(id); },
      onFocus: (event: FocusEvent<HTMLElement>) => { if (event.currentTarget.matches(":focus-visible")) setTarget(id); },
    },
  };
}

export function SidebarMotionHighlight({ visible }: { visible: boolean }) {
  const reduced = useSidebarReducedMotion();
  return visible ? <motion.span
    layoutId="sidebar-item-highlight" className="sidebar-item-highlight" aria-hidden
    initial={false} animate={{ opacity: 1 }}
    transition={reduced ? { duration: 0 } : motionTokens.spring}
  /> : null;
}

const gestures: Record<string, TargetAndTransition> = {
  home: { y: -1, scale: 1.08 },
  playground: { rotate: 12, scale: 1.08 },
  luminasset: { y: -1, scale: 1.12 },
  "quantum-body": { rotate: 18 },
  "snooze-band": { rotate: -12, y: -1 },
  tutoriq: { y: -2, rotate: -5 },
  "hotshots-labs": { rotate: 9, scale: 1.1 },
  smarthost: { rotate: -15 },
  about: { y: -1, scale: 1.1 },
  experience: { y: -2, rotate: -5 },
  process: { y: -2, scale: 1.08 },
};
export function SidebarMotionIcon({ id, active, selected, children }: { id: string; active: boolean; selected: boolean; children: ReactNode }) {
  const reduced = useSidebarReducedMotion();
  const controls = useAnimationControls();
  const previousSelected = useRef(selected);
  useEffect(() => {
    const justSelected = selected && !previousSelected.current;
    previousSelected.current = selected;
    const rest = { x: 0, y: 0, rotate: 0, scale: 1 };
    const gesture = gestures[id] || { y: -1, scale: 1.08 };
    if (reduced) controls.set(rest);
    else if (active) void controls.start({ ...gesture, transition: motionTokens.spring });
    else if (justSelected) {
      const value = (key: "x" | "y" | "rotate" | "scale", fallback: number) => typeof gesture[key] === "number" ? gesture[key] as number : fallback;
      void controls.start({
        x: [0, value("x", 0), 0], y: [0, value("y", -1), 0],
        rotate: [0, value("rotate", 0), 0], scale: [1, value("scale", 1.08), 1],
        transition: { duration: motionTokens.duration.slide, ease: motionTokens.easeOut },
      });
    } else void controls.start({ ...rest, transition: motionTokens.spring });
    return () => controls.stop();
  }, [active, selected, id, reduced, controls]);
  return <motion.span className="sidebar-item-icon" aria-hidden initial={false} animate={controls}>{children}</motion.span>;
}

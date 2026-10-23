"use client";

/*
 * Adapted from Arc UI "User menu" (https://uiarc.dev/components/user-menu, https://github.com/kuratlielia/arc-library).
 * MIT License. Copyright (c) 2026 Elia Kuratli. The full license text is in ./LICENSE.
 *
 * Changes for the portfolio: Phosphor icons instead of Lucide; the portfolio's motion tokens; a custom trigger
 * (the sidebar profile card or the rail avatar); generic inline switches with disabled options instead of theme
 * and presence status; no sign out, plan badge or shortcut keys; the phone sheet can portal into a container
 * (the navigation sheet) so it stays inside that dialog's focus scope.
 */

import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, PointerEvent, ReactNode, Ref } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { PanInfo, Transition, Variants } from "motion/react";
import { motionTokens } from "@/lib/motion";
import styles from "./user-menu.module.css";

export interface UserMenuUser { name: string; detail?: string; avatarSrc?: string }
export interface UserMenuItem { label: string; icon?: ReactNode; onSelect?: () => void }
export interface UserMenuSwitchOption<T extends string = string> { value: T; label: string; icon: ReactNode; disabled?: boolean }
/** An inline switch row (Appearance, Sound). Choosing keeps the menu open. */
export interface UserMenuSwitch<T extends string = string> { label: string; icon: ReactNode; value: T; options: UserMenuSwitchOption<T>[]; onChange: (value: T) => void; /** Extra attributes for each option button, e.g. a data hook. */ buttonProps?: Record<`data-${string}`, string> }

export interface UserMenuProps {
  user: UserMenuUser;
  /** What the trigger shows. The trigger itself is a button with `triggerClassName`; it gets data-state="open" while open. */
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  items?: UserMenuItem[];
  switches?: UserMenuSwitch[];
  align?: "start" | "center" | "end";
  onOpenChange?: (open: boolean) => void;
  /** Where the phone sheet is portalled. Defaults to the body. */
  getSheetContainer?: () => HTMLElement | null;
  ref?: Ref<HTMLButtonElement>;
}

type Highlight = { top: number; height: number; glide: boolean };
type OpenReason = "first" | "last" | "pointer" | null;

const compactQuery = "(max-width: 639px)";
const subscribeCompact = (change: () => void) => { const query = window.matchMedia(compactQuery); query.addEventListener("change", change); return () => query.removeEventListener("change", change); };
const subscribeNothing = () => () => {};
const ease = [...motionTokens.easeOut] as [number, number, number, number];
const exitEase = [0.4, 0, 1, 1] as [number, number, number, number];

/** The panel grows out of the trigger on a critically damped spring; rows follow a beat later. Closing is a short fade. */
const panelMotion: Variants = {
  closed: { opacity: 0, scale: .94 },
  open: { opacity: 1, scale: 1, transition: { type: "spring", visualDuration: motionTokens.duration.slide * .75, bounce: 0, opacity: { duration: motionTokens.duration.popover, ease }, delayChildren: .03, staggerChildren: .016 } },
  exit: { opacity: 0, scale: .97, transition: { duration: motionTokens.duration.fast, ease: exitEase } },
};
const sheetMotion: Variants = {
  closed: { y: "100%" },
  open: { y: 0, transition: { type: "spring", visualDuration: .36, bounce: 0, delayChildren: .06, staggerChildren: .02 } },
  exit: { y: "100%", transition: { duration: .22, ease: exitEase } },
};
const stillMotion: Variants = { closed: { opacity: 0 }, open: { opacity: 1, transition: { duration: motionTokens.duration.fast } }, exit: { opacity: 0, transition: { duration: motionTokens.duration.fast } } };
const rowMotion: Variants = { closed: { opacity: 0, y: 3 }, open: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.popover, ease } } };

/** A compact inline switch. It is one stop in the menu: up and down pass over it, left and right choose within it. */
function Segmented({ control, variants }: { control: UserMenuSwitch; variants?: Variants }) {
  const index = Math.max(0, control.options.findIndex(option => option.value === control.value));
  return <motion.div className={styles.row} data-stop="group" data-label={control.label} variants={variants}>
    <span className={styles.icon} aria-hidden="true">{control.icon}</span>
    <span className={styles.rowLabel} aria-hidden="true">{control.label}</span>
    <div className={styles.segments} role="group" aria-label={control.label} style={{ "--index": index, "--count": control.options.length } as CSSProperties}>
      <span className={styles.thumb} aria-hidden="true" />
      {control.options.map(option => <button key={option.value} type="button" role="menuitemradio" tabIndex={-1} aria-checked={option.value === control.value} aria-disabled={option.disabled || undefined}
        aria-label={option.label} title={option.label} className={styles.segment} {...control.buttonProps} onClick={() => { if (!option.disabled) control.onChange(option.value); }}>{option.icon}</button>)}
    </div>
  </motion.div>;
}

const getStops = (root: HTMLElement | null) => Array.from(root?.querySelectorAll<HTMLElement>("[data-stop]") ?? []);
function focusStop(stop: HTMLElement | undefined) {
  if (!stop) return;
  const target = stop.dataset.stop === "group" ? stop.querySelector<HTMLElement>('[aria-checked="true"]') ?? stop.querySelector<HTMLElement>("button") : stop;
  target?.focus({ preventScroll: true });
}

export function UserMenu({ user, trigger, triggerClassName, triggerLabel, items = [], switches = [], align = "start", onOpenChange, getSheetContainer, ref }: UserMenuProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const triggerId = `${id}-trigger`;
  const reduced = !!useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const compact = useSyncExternalStore(subscribeCompact, () => window.matchMedia(compactQuery).matches, () => false);
  const [open, setInnerOpen] = useState(false);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reason = useRef<OpenReason>(null);
  const typed = useRef({ text: "", timer: 0 });
  const sheet = hydrated && compact;

  useEffect(() => { const current = typed.current; return () => window.clearTimeout(current.timer); }, []);

  function setTriggerRef(node: HTMLButtonElement | null) {
    triggerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as { current: HTMLButtonElement | null }).current = node;
  }

  function setOpen(next: boolean, why: OpenReason = null) {
    reason.current = next ? why : null;
    setHighlight(null);
    setInnerOpen(next);
    onOpenChange?.(next);
  }
  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
  }

  // Focus moves in only when a person opened the menu.
  useEffect(() => {
    if (!open) return;
    const why = reason.current;
    reason.current = null;
    if (!why) return;
    const frame = requestAnimationFrame(() => {
      const stops = getStops(listRef.current);
      if (why === "first") focusStop(stops[0]);
      else if (why === "last") focusStop(stops.at(-1));
      else surfaceRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, sheet]);

  // The panel is placed against the trigger and scales from the avatar, flipping above when there is no room below.
  useLayoutEffect(() => {
    if (!open || sheet) return;
    const place = () => {
      const panel = surfaceRef.current, anchor = triggerRef.current;
      if (!panel || !anchor) return;
      const rect = anchor.getBoundingClientRect();
      const width = panel.offsetWidth, height = panel.offsetHeight;
      const wanted = align === "start" ? rect.left : align === "center" ? rect.left + rect.width / 2 - width / 2 : rect.right - width;
      const left = Math.min(Math.max(12, wanted), window.innerWidth - width - 12);
      const below = rect.bottom + 8;
      const top = below + height > window.innerHeight - 12 && rect.top - 8 - height > 12 ? rect.top - 8 - height : below;
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      const face = anchor.querySelector("img")?.getBoundingClientRect() ?? rect;
      panel.style.setProperty("--origin-x", `${Math.min(Math.max(0, face.left + face.width / 2 - left), width)}px`);
      panel.style.setProperty("--origin-y", top < rect.top ? `${height}px` : "0px");
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, sheet, align]);

  // Outside presses close the panel. The sheet has its own scrim.
  useEffect(() => {
    if (!open || sheet) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node;
      if (surfaceRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      reason.current = null;
      setHighlight(null);
      setInnerOpen(false);
      onOpenChange?.(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, sheet, onOpenChange]);

  function onListFocus(event: FocusEvent<HTMLDivElement>) {
    const stop = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-stop]") : null;
    if (!stop) { setHighlight(null); return; }
    setHighlight(current => ({ top: stop.offsetTop, height: stop.offsetHeight, glide: current !== null }));
  }
  // Focus follows a mouse or pen, so the keyboard carries on from wherever the pointer left the highlight.
  function onItemPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    if (document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
  }
  // The inline switches are not rows, so the pointer over them releases the highlight instead of dragging it along.
  function onListPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch" || !highlight) return;
    const group = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-stop="group"]') : null;
    if (!group || group.contains(document.activeElement)) return;
    setHighlight(null);
    surfaceRef.current?.focus({ preventScroll: true });
  }
  function onListPointerLeave(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    setHighlight(null);
    surfaceRef.current?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const stops = getStops(listRef.current);
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const current = active?.closest<HTMLElement>("[data-stop]") ?? null;
    const index = current ? stops.indexOf(current) : -1;
    const step = (to: HTMLElement | undefined) => { event.preventDefault(); focusStop(to); };
    switch (event.key) {
      case "ArrowDown": return step(stops[(index + 1) % stops.length]);
      case "ArrowUp": return step(stops[index <= 0 ? stops.length - 1 : index - 1]);
      case "Home": return step(stops[0]);
      case "End": return step(stops.at(-1));
      case "Escape": case "Tab": event.preventDefault(); event.stopPropagation(); return close(true);
      case "ArrowLeft": case "ArrowRight": {
        if (current?.dataset.stop !== "group") return;
        event.preventDefault();
        // Disabled options (Dark, for now) are skipped.
        const segments = Array.from(current.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]:not([aria-disabled="true"])'));
        if (segments.length < 2) return;
        const at = Math.max(0, segments.findIndex(segment => segment.getAttribute("aria-checked") === "true"));
        const next = segments[(at + (event.key === "ArrowRight" ? 1 : -1) + segments.length) % segments.length];
        next?.focus({ preventScroll: true });
        next?.click();
        return;
      }
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey || event.key === " ") return;
    // Typeahead: letters jump to the next row whose label starts with what was typed.
    const memory = typed.current;
    window.clearTimeout(memory.timer);
    memory.text += event.key.toLowerCase();
    memory.timer = window.setTimeout(() => { memory.text = ""; }, 500);
    const ordered = [...stops.slice(index + 1), ...stops.slice(0, index + 1)];
    const search = memory.text.length > 1 && current?.dataset.label?.toLowerCase().startsWith(memory.text) ? [current] : ordered;
    const match = search.find(stop => stop.dataset.label?.toLowerCase().startsWith(memory.text));
    if (match) step(match);
  }

  function onTriggerClick(event: MouseEvent<HTMLButtonElement>) {
    if (open) { close(false); return; }
    setOpen(true, event.detail === 0 ? "first" : "pointer");
  }
  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpen(true, event.key === "ArrowDown" ? "first" : "last");
  }
  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 80 || info.velocity.y > 500) close(true);
  }

  const glide: Transition = highlight?.glide && !reduced ? motionTokens.spring : { duration: 0 };
  const row = reduced ? undefined : rowMotion;
  const menuProps = { id: menuId, role: "menu", "aria-labelledby": triggerId, tabIndex: -1, onKeyDown };

  const content = <>
    <motion.div className={styles.header} variants={row}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a 34px avatar already served as a small static file */}
      {user.avatarSrc && <img className={styles.portrait} src={user.avatarSrc} alt="" decoding="async" draggable={false} />}
      <div className={styles.identity}><span className={styles.name}>{user.name}</span>{user.detail && <span className={styles.detail} title={user.detail}>{user.detail}</span>}</div>
    </motion.div>
    <div ref={listRef} className={styles.list} onFocus={onListFocus} onPointerMove={onListPointerMove} onPointerLeave={onListPointerLeave}>
      <motion.span className={styles.highlight} aria-hidden="true" initial={false}
        animate={highlight ? { y: highlight.top, height: highlight.height, opacity: 1 } : { opacity: 0 }}
        transition={{ default: glide, opacity: { duration: reduced ? 0 : motionTokens.duration.fast } }} />
      {items.length > 0 && <>
        <div className={styles.separator} role="separator" />
        {items.map(item => <motion.button key={item.label} type="button" role="menuitem" tabIndex={-1} className={styles.item} data-stop="item" data-label={item.label} variants={row}
          onPointerMove={onItemPointerMove} onClick={() => { close(true); item.onSelect?.(); }}>
          <span className={styles.icon} aria-hidden="true">{item.icon}</span>
          <span className={styles.itemLabel}>{item.label}</span>
        </motion.button>)}
      </>}
      {switches.length > 0 && <>
        <div className={styles.separator} role="separator" />
        {switches.map(control => <Segmented key={control.label} control={control} variants={row} />)}
      </>}
    </div>
  </>;

  const panel = <AnimatePresence>
    {open && !sheet && <motion.div key="panel" ref={surfaceRef} {...menuProps} className={styles.panel} data-align={align}
      variants={reduced ? stillMotion : panelMotion} initial="closed" animate="open" exit="exit">
      {content}
    </motion.div>}
  </AnimatePresence>;

  const bottomSheet = <AnimatePresence>
    {open && sheet && <motion.div key="scrim" className={styles.scrim} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? .1 : .2, ease }} onClick={() => close(true)} />}
    {open && sheet && <motion.div key="sheet" ref={surfaceRef} {...menuProps} className={`${styles.panel} ${styles.sheet}`} aria-modal="true"
      variants={reduced ? stillMotion : sheetMotion} initial="closed" animate="open" exit="exit"
      drag={reduced ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: .04, bottom: .9 }} dragMomentum={false} onDragEnd={onDragEnd}>
      <span className={styles.handle} aria-hidden="true" />
      {content}
    </motion.div>}
  </AnimatePresence>;

  return <span className={styles.root}>
    <button ref={setTriggerRef} id={triggerId} type="button" className={triggerClassName} data-state={open ? "open" : "closed"}
      aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} aria-label={triggerLabel ?? `Open profile menu, ${user.name}`}
      onClick={onTriggerClick} onKeyDown={onTriggerKeyDown}>{trigger}</button>
    {!hydrated ? null : sheet ? createPortal(bottomSheet, getSheetContainer?.() ?? document.body) : createPortal(panel, document.body)}
  </span>;
}

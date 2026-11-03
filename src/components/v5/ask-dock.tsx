"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { playCue } from "@/components/ui-sound";
import { V5_QUOTE } from "./answers";
import { AskLine, HeroAnswer, useSuggestions } from "./hero-chat";
import { V5_HANDBACK, V5_HANDOFF, askChat, clearChat, useChat } from "./chat-store";
import { AskMenu, AskTip, MentionText, stripMention, useAskMenu, usePageTag, type AskTag } from "./ask-menu";
import { IconReload, IconSparkle } from "./icons";
import { editField } from "./edit-field";

/** How the closed dock looks, for comparing three takes (pick with ?dock=pill, ?dock=drawer or ?dock=scroll; kept for
 * the browser session, like ?enter):
 *  - "pill": a small "Ask AI" pill floating at the bottom, always readable;
 *  - "drawer": a labelled tab rising from the bottom edge, "Ask AI ⌘K";
 *  - "scroll": a thin tab on the edge while scrolling down to read, the pill on scrolling up or pausing;
 *  - "follow": the hero field follows the reader down. As it scrolls away, the same field (suggestions rolling, ⌘K)
 *    rises in at the bottom; after a few seconds of scrolling it folds into the thin tab, and scrolling up or moving the
 *    pointer near the bottom brings the field back;
 *  - "orb" (default): a small glowing orb, blurred at the edges, its violet-pink-peach colours slowly swirling. Opened,
 *    it spreads into a soft glow behind the field as the field grows out of it. */
export type DockMode = "orb" | "pill" | "drawer" | "scroll" | "follow";
const MODES: DockMode[] = ["orb", "pill", "drawer", "scroll", "follow"];
/** How long the following field stays out once the reader keeps scrolling. */
const FOLLOW_MS = 4000;
const MODE_KEY = "v5-dock";

function readMode(): DockMode {
  const asked = new URLSearchParams(window.location.search).get("dock") as DockMode | null;
  try {
    if (asked && MODES.includes(asked)) sessionStorage.setItem(MODE_KEY, asked);
    const kept = sessionStorage.getItem(MODE_KEY) as DockMode | null;
    return kept && MODES.includes(kept) ? kept : "orb";
  } catch {
    return asked && MODES.includes(asked) ? asked : "orb";
  }
}
/** How the resting orb is drawn, for comparing (pick with ?orb=…, kept for the session like ?dock):
 *  - "dither" (default): ordered-dither dots, like the home background's dither, in the theme's three orb tones;
 *  - "pixel": chunky 6px pixels with stepped transparency, a low-res sprite;
 *  - "halftone": a grid of squares that grow and shrink with the glow, like the theme reveal's squares;
 *  - "soft": the blurred glow. */
export type OrbStyle = "dither" | "pixel" | "halftone" | "soft";
const ORB_STYLES: OrbStyle[] = ["dither", "pixel", "halftone", "soft"];
function readOrb(): OrbStyle {
  const asked = new URLSearchParams(window.location.search).get("orb") as OrbStyle | null;
  try {
    if (asked && ORB_STYLES.includes(asked)) sessionStorage.setItem("v5-orb", asked);
    const kept = sessionStorage.getItem("v5-orb") as OrbStyle | null;
    return kept && ORB_STYLES.includes(kept) ? kept : "dither";
  } catch {
    return asked && ORB_STYLES.includes(asked) ? asked : "dither";
  }
}

const onPopState = (change: () => void) => { window.addEventListener("popstate", change); return () => window.removeEventListener("popstate", change); };
const subscribeNever = () => () => {};

/** Ask AI, docked at the bottom centre. At rest it's a small pill, a labelled tab or a thin tab on the edge (DockMode);
 * a click (or ⌘K / Ctrl+K, or
 * "/" outside a field) grows it into a smaller copy of the hero's ask field, suggestions and Tab included. Once a
 * question goes in, the conversation opens in a panel centred just above the field, in the hero chat's style. Text
 * selected on the page and sent with the "Ask AI" chip rides along inside the field as a quote until the next question.
 * Esc, × or a click elsewhere puts it away; the conversation stays until "Start over". It's the same conversation as the
 * hero chat's (chat-store). On home the tab waits until the hero chat has scrolled away, since the hero field is the way
 * in while it's on screen; scrolling back up to it with the dock open hands over to the hero field, typing included, and
 * scrolling away from it with the hero field in use (and nothing asked yet) opens the dock with it. */
export function V5AskDock({ owner }: { owner: string }) {
  const pathname = usePathname();
  const onHome = pathname === "/v5";
  const [open, setOpen] = useState(false);
  const { turns, thinking } = useChat();
  const [quote, setQuote] = useState("");
  const [draft, setDraft] = useState("");
  const [heroInView, setHeroInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const chatting = open && turns.length > 0;
  const mode = useSyncExternalStore(onPopState, readMode, () => "orb" as DockMode);
  const orbStyle = useSyncExternalStore(onPopState, readOrb, () => "dither" as OrbStyle);
  // The key cap names the platform's modifier.
  const mac = useSyncExternalStore(subscribeNever, () => /Mac|iP(hone|ad|od)/.test(navigator.platform), () => true);
  // Closed, the dock rests as a pill, a drawer tab or the thin tab; "scroll" switches between the thin tab and the pill.
  // "follow" switches between the field itself and the thin tab.
  const [reading, setReading] = useState(false);
  const [arriving, setArriving] = useState(false);
  const rest = mode === "scroll" ? (reading ? "tab" : "pill") : mode === "follow" ? (reading ? "tab" : "field") : mode;
  // The suggestions roll while the field shows, open or resting.
  const menu = useAskMenu({ draft, setDraft, input, onAsk: question => ask(question) });
  // On a case study or an article the field opens on that page's mention; its questions then roll on after it.
  const pageTag = usePageTag();
  const lead = menu.tag && draft === `@${menu.tag.title} ` ? menu.tag : undefined;
  const hints = useSuggestions("", turns, (!open && rest !== "field") || (!!draft && !lead) || !!quote, lead);
  const suggestion = quote || (menu.tag && !lead) ? undefined : hints.suggestion;

  const expand = () => {
    if (!open) playCue("open");
    setOpen(true);
    // Already open: the effect below won't run again, so focus here.
    if (open) input.current?.focus({ preventScroll: true });
  };
  const collapse = () => {
    if (open) playCue("close");
    setOpen(false);
    input.current?.blur();
  };

  // The input is inert until the field opens, so it takes focus once it has.
  useEffect(() => { if (open) input.current?.focus({ preventScroll: true }); }, [open]);
  // Opening on a case study or an article starts the line with its mention, caret after it.
  useEffect(() => {
    if (!open || !pageTag || draft || menu.tag) return;
    menu.setTag(pageTag);
    setDraft(`@${pageTag.title} `);
    requestAnimationFrame(() => { const field = input.current; if (field) { field.setSelectionRange(field.value.length, field.value.length); menu.readCaret(); } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pageTag]);

  // Latest open/close for the window listeners below.
  const asked = turns.length > 0;
  const actions = useRef({ expand, collapse, open, asked });
  useEffect(() => { actions.current = { expand, collapse, open, asked }; });

  useEffect(() => {
    const quoted = (event: Event) => {
      setQuote((event as CustomEvent<string>).detail);
      actions.current.expand();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { actions.current.collapse(); return; }
      const typing = event.target instanceof Element && event.target.closest("input, textarea, [contenteditable='true']");
      const shortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (!shortcut && !(event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey)) return;
      event.preventDefault();
      actions.current.expand();
    };
    // A press anywhere else puts it away; the selection chip is on its way in, so it's left alone.
    const away = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target && !root.current?.contains(target) && !target.closest(".v5-select-ask")) actions.current.collapse();
    };
    window.addEventListener(V5_QUOTE, quoted);
    window.addEventListener("keydown", key);
    document.addEventListener("pointerdown", away);
    return () => {
      window.removeEventListener(V5_QUOTE, quoted);
      window.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", away);
    };
  }, []);

  useEffect(() => {
    const hero = onHome ? document.querySelector(".v5-main .v5-ask") : null;
    if (!hero) return;
    // The sticky header covers the top 76px.
    // In view once it's mostly on screen, so the handover waits until the field is really back.
    const watch = new IntersectionObserver(([entry]) => setHeroInView(entry.intersectionRatio >= 0.6), { rootMargin: "-76px 0px 0px 0px", threshold: [0, 0.6, 1] });
    watch.observe(hero);
    return () => { watch.disconnect(); setHeroInView(false); };
  }, [onHome, pathname]);

  // Scroll-aware: scrolling down means reading, so it sinks to the thin tab; scrolling up or a pause brings the pill back.
  useEffect(() => {
    if (mode !== "scroll") return;
    const page = document.querySelector<HTMLElement>("[data-v5-scroll]");
    if (!page) return;
    let last = page.scrollTop, pause: number | undefined;
    const scrolled = () => {
      const y = page.scrollTop, delta = y - last;
      last = y;
      if (Math.abs(delta) < 4) return;
      setReading(delta > 0);
      window.clearTimeout(pause);
      pause = window.setTimeout(() => setReading(false), 900);
    };
    page.addEventListener("scroll", scrolled, { passive: true });
    return () => { page.removeEventListener("scroll", scrolled); window.clearTimeout(pause); };
  }, [mode, pathname]);

  // Follow: the field shows, and once the reader scrolls on for a few seconds it folds into the tab; scrolling up or the
  // pointer near the bottom brings it back.
  useEffect(() => {
    if (mode !== "follow") return;
    const page = document.querySelector<HTMLElement>("[data-v5-scroll]");
    if (!page) return;
    let last = page.scrollTop, fold: number | undefined;
    const unfold = () => { window.clearTimeout(fold); fold = undefined; setReading(false); };
    const scrolled = () => {
      const y = page.scrollTop, delta = y - last;
      last = y;
      if (delta < -4) unfold();
      else if (delta > 4 && fold === undefined) fold = window.setTimeout(() => setReading(true), FOLLOW_MS);
    };
    const near = (event: PointerEvent) => { if (event.pointerType === "mouse" && event.clientY > window.innerHeight - 96) unfold(); };
    page.addEventListener("scroll", scrolled, { passive: true });
    window.addEventListener("pointermove", near, { passive: true });
    return () => { page.removeEventListener("scroll", scrolled); window.removeEventListener("pointermove", near); window.clearTimeout(fold); };
  }, [mode, pathname]);

  // Follow, on home: as the hero field scrolls away, its copy rises in at the bottom, unfolded.
  const heroWasInView = useRef(false);
  useEffect(() => {
    const left = heroWasInView.current && !heroInView;
    heroWasInView.current = heroInView;
    if (mode !== "follow" || !left) return;
    setReading(false);
    setArriving(true);
    const done = window.setTimeout(() => setArriving(false), 700);
    return () => window.clearTimeout(done);
  }, [heroInView, mode]);

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" }); }, [turns, thinking, chatting]);
  // Back at the hero with the dock open: it folds away and the hero field takes over, with what was typed here.
  useEffect(() => {
    if (!heroInView || !actions.current.open) return;
    window.dispatchEvent(new CustomEvent(V5_HANDOFF, { detail: input.current?.value ?? "" }));
    setOpen(false);
    setDraft("");
  }, [heroInView]);

  // And the other way: leaving the hero with its field in use (typed in, or the caret in it) before anything's been asked,
  // the dock opens with it, so the question carries on at the bottom.
  const heroWasShown = useRef(false);
  useEffect(() => {
    const left = heroWasShown.current && !heroInView;
    heroWasShown.current = heroInView;
    const field = left ? document.querySelector<HTMLInputElement>(".v5-main .v5-ask input") : null;
    if (!field || actions.current.asked || actions.current.open) return;
    if (document.activeElement !== field && !field.value.trim()) return;
    setDraft(field.value);
    window.dispatchEvent(new CustomEvent(V5_HANDBACK));
    actions.current.expand();
  }, [heroInView]);

  // The whole field takes the caret: a press on its padding or the icon focuses the input.
  const focusField = (event: MouseEvent) => {
    if (!open || event.target === input.current || (event.target as Element).closest("button")) return;
    event.preventDefault();
    input.current?.focus();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    // A mention on its own asks about the item; an empty field asks about the quote, or the suggestion showing.
    if (lead && suggestion) ask(`${draft}${suggestion.q}`, lead);
    else if (menu.tag) ask(stripMention(draft, menu.tag) ? draft.trim() : `Tell me about @${menu.tag.title}`, menu.tag);
    else if (draft.trim()) ask(draft.trim());
    else if (quote) ask("Tell me more about this");
    else if (suggestion) ask(suggestion.tag ? `@${suggestion.tag.title} ${suggestion.q}` : suggestion.q, suggestion.tag);
  };

  /** Asks `q` about `tag`, if any. A question from the "/" list goes without one; the tag in the field stays. */
  const ask = (q: string, tag?: AskTag) => {
    askChat(q, quote || undefined, tag);
    setQuote("");
    if (tag) menu.clearTag();
    // Cleared as an edit, so ⌘Z brings the question back.
    editField(input.current, "", setDraft);
    playCue("open");
  };

  return (
    <div ref={root} className="v5-dock" data-rest={rest} data-arrive={arriving || undefined} data-open={open || undefined} data-hidden={(!open && heroInView) || undefined}>
      {mode === "orb" && <span className="v5-dock-orb" data-style={orbStyle} aria-hidden><i /><i /><i /></span>}
      {mode === "orb" && orbStyle !== "soft" && <OrbCanvas style={orbStyle} shown={open || !heroInView} />}
      <section className="v5-dock-chat" data-show={chatting || undefined} aria-label={`Chat with ${owner}`} aria-hidden={!chatting} inert={!chatting}>
        <div className="v5-dock-chat-head">
          <button type="button" aria-label="Start over" data-cursor="Start over" onClick={() => { clearChat(); input.current?.focus(); }}>
            <IconReload size={18} />
          </button>
          <button type="button" aria-label="Close" data-cursor="Close" data-sound="off" onClick={collapse}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden><path d="m4 4 10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div ref={log} className="v5-hero-log v5-dock-log" aria-live="polite">
          {turns.map(turn => (
            <div key={turn.id} className="v5-hero-turn">
              {turn.quote && <blockquote className="v5-hero-quote">{turn.quote}</blockquote>}
              <div className="v5-hero-q"><MentionText text={turn.q} tag={turn.tag} className="v5-hero-tag" /></div>
              {thinking === turn.id ? <p className="v5-hero-thinking">Thinking</p> : <HeroAnswer turn={turn} owner={owner} />}
            </div>
          ))}
        </div>
      </section>

      {open && <AskMenu menu={menu} />}
      {open && <AskTip menu={menu} />}
      <form className="v5-ask v5-dock-field" data-quote={quote ? true : undefined} onSubmit={submit} onMouseDown={focusField}>
        {/* At rest the field is the tab itself; this button is what's pressed. */}
        <button type="button" className="v5-dock-tab" aria-label={`Ask ${owner}`} aria-keyshortcuts="Meta+K Control+K" data-cursor="Ask AI" data-sound="off"
          tabIndex={open ? -1 : undefined} aria-hidden={open || undefined} onClick={expand}>
          <span className="v5-dock-label" aria-hidden>
            <IconSparkle size={16} />
            Ask AI
            {rest === "drawer" && <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>}
          </span>
        </button>
        <div className="v5-dock-body" inert={!open}>
          {quote && (
            <div className="v5-dock-quote">
              <blockquote><span>{quote}</span></blockquote>
              <button type="button" aria-label="Remove quote" data-sound="close" onClick={() => { setQuote(""); input.current?.focus(); }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden><path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.3" /></svg>
              </button>
            </div>
          )}
          <div className="v5-dock-row">
            <IconSparkle size={18} />
            <AskLine input={input} draft={draft} setDraft={setDraft} hints={{ ...hints, suggestion, leaving: quote || menu.tag ? undefined : hints.leaving }} menu={menu}
              fallback={menu.tag ? `Ask about ${menu.tag.title}` : quote ? "Ask about this passage" : `Ask anything about ${owner}`} />
            {rest === "field" && <kbd className="v5-dock-key" aria-hidden>{mac ? "⌘K" : "Ctrl K"}</kbd>}
          </div>
        </div>
      </form>
    </div>
  );
}

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
/** The orb is a near-round oval, a little wider than tall, centred well below the bottom edge, so only its top cap
 * shows and only that part is drawn. */
const ORB_RX = 53, ORB_RY = 44, ORB_SINK = 18;
/** How far from the orb the pointer starts to pull its colours (CSS px). */
const ORB_REACH = 260;
/** The orb's entrance: it grows out from a few coarse pixels that split finer and finer until they're its own. */
const ORB_APPEAR_MS = 1100;
const ORB_STEPS = [12, 9, 6, 4, 3];

/** The orb drawn in the site's pixel language: three blobs in the theme's orb tones (--orb-deep, --orb-mid,
 * --orb-light) drift slowly inside a round glow that fades at its edge, and the glow breathes. Each style turns that
 * field into pixels its own way: dither dots, stepped chunky pixels or halftone squares. The colours lean towards the
 * pointer: within reach, the blobs drift after it (more strongly the closer it is) and settle back when it leaves. Each
 * time it comes into view (`shown`) it grows in from coarse pixels that resolve into its own. ~24fps; one still frame
 * under reduced motion; paused while the tab is hidden. */
function OrbCanvas({ style, shown }: { style: Exclude<OrbStyle, "soft">; shown: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // When the entrance began (rAF time), or null while out of view, so it plays again next time.
  const appearAt = useRef<number | null>(null);
  useEffect(() => { appearAt.current = shown ? performance.now() : null; }, [shown]);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const W = ORB_RX * 2 + 8, H = ORB_RY - ORB_SINK + 4;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = W * dpr; el.height = H * dpr;
    ctx.scale(dpr, dpr);
    // The tones follow the theme; re-read now and then, so a theme switch carries over.
    let tones: number[][] = [];
    const read = () => {
      const css = getComputedStyle(el);
      tones = ["--orb-deep", "--orb-mid", "--orb-light"].map(name => {
        ctx.fillStyle = css.getPropertyValue(name).trim() || "#000";
        const hex = ctx.fillStyle.startsWith("#") ? ctx.fillStyle : "#000000";
        return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
      });
    };
    const base = style === "dither" ? 2 : style === "pixel" ? 6 : 8;
    const mix = (a: number[], b: number[], k: number) => a.map((v, c) => Math.round(v + (b[c] - v) * k));
    let frame = 0, raf = 0, last = 0;
    // The pointer, in the orb's own units (its centre at 0,0, its edge at 1), and how strongly it pulls (0–1).
    const aim = { x: 0, y: 0, pull: 0 }, lean = { x: 0, y: 0, pull: 0 };
    const pointer = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2), dy = event.clientY - (box.top + H + ORB_SINK);
      const reach = Math.max(0, 1 - Math.hypot(dx, dy) / ORB_REACH);
      const k = Math.min(1, 0.85 / Math.max(1, Math.hypot(dx / ORB_RX, dy / ORB_RY)));
      aim.x = (dx / ORB_RX) * k; aim.y = (dy / ORB_RY) * k; aim.pull = reach;
    };
    const away = () => { aim.pull = 0; };
    window.addEventListener("pointermove", pointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", away);
    const draw = (t: number, now = Infinity) => {
      if (frame++ % 24 === 0) read();
      ctx.clearRect(0, 0, W, H);
      // The entrance, 0 → 1: the orb swells from a small core (overshooting a touch) while its pixels step down in size.
      // (No `now` means a still frame, drawn whole.)
      const p = now === Infinity ? 1 : appearAt.current === null ? 0 : Math.min(1, Math.max(0, (now - appearAt.current) / ORB_APPEAR_MS));
      if (p === 0) return;
      const steps = ORB_STEPS.filter(size => size > base);
      const cell = p >= 1 ? base : (steps[Math.floor(p * (steps.length + 1))] ?? base);
      const swell = p >= 1 ? 1 : 0.2 + 0.8 * (1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2);
      const cx = W / 2, cy = H + ORB_SINK, rx = ORB_RX, ry = ORB_RY;
      const breathe = (0.96 + 0.04 * Math.sin(t * 0.8)) * swell;
      // Ease towards the pointer, so the colours glide after it rather than snap.
      lean.x += (aim.x - lean.x) * 0.12; lean.y += (aim.y - lean.y) * 0.12; lean.pull += (aim.pull - lean.pull) * 0.1;
      const blobs = [0, 1, 2].map(i => {
        const bx = 0.42 * Math.cos(t * (0.3 + i * 0.11) + i * 2.1), by = 0.42 * Math.sin(t * (0.24 + i * 0.13) + i * 1.3);
        // The light blobs follow most; the deep one only a little, so the highlight moves through the orb.
        const follow = lean.pull * (i === 0 ? 0.35 : 0.8);
        return [bx + (lean.x - bx) * follow, by + (lean.y - by) * follow];
      });
      const i0 = Math.max(0, Math.floor((cx - rx) / cell)), i1 = Math.min(Math.ceil(W / cell), Math.ceil((cx + rx) / cell));
      const j0 = Math.max(0, Math.floor((cy - ry) / cell)), j1 = Math.ceil(H / cell);
      for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
        const x = ((i + 0.5) * cell - cx) / rx, y = ((j + 0.5) * cell - cy) / ry;
        const r = Math.hypot(x, y) / breathe;
        const glow = Math.min(1, Math.max(0, (1 - r) / 0.45)) ;
        if (glow <= 0) continue;
        const w = blobs.map(([bx, by]) => Math.exp(-((x - bx) ** 2 + (y - by) ** 2) / 0.3));
        // How light this spot is, 0 (deep) to 1 (light); the deep tone is the base, so the light blobs read as highlights.
        const light = Math.min(1, ((w[1] * 0.5 + w[2]) / (w[0] + w[1] + w[2] + 0.6)) * 1.5);
        // Brighter where the blobs gather, for the stepped and halftone styles.
        const energy = 0.45 + 0.55 * Math.min(1, (w[1] + w[2]) * 0.8);
        const threshold = (BAYER4[(j % 4) * 4 + (i % 4)] + 0.5) / 16;
        if (style === "dither") {
          if (glow < threshold) continue;
          const tone = tones[Math.min(2, Math.floor((light + (threshold - 0.5) * 0.45) * 3 + 0.4))] ?? tones[0];
          ctx.fillStyle = `rgb(${tone})`;
          ctx.fillRect(i * cell, j * cell, cell, cell);
          continue;
        }
        const rgb = light < 0.5 ? mix(tones[0], tones[1], light * 2) : mix(tones[1], tones[2], (light - 0.5) * 2);
        if (style === "pixel") {
          ctx.fillStyle = `rgba(${rgb}, ${Math.ceil(glow * energy * 4) / 4})`;
          ctx.fillRect(i * cell, j * cell, cell, cell);
        } else {
          const size = Math.round(cell * glow * energy);
          if (size < 2) continue;
          ctx.fillStyle = `rgb(${rgb})`;
          ctx.fillRect(i * cell + (cell - size) / 2, j * cell + (cell - size) / 2, size, size);
        }
      }
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      read(); draw(1);
      return () => { window.removeEventListener("pointermove", pointer); document.documentElement.removeEventListener("pointerleave", away); };
    }
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 41) return;
      last = now;
      draw(now / 1000, now);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", pointer);
      document.documentElement.removeEventListener("pointerleave", away);
    };
  }, [style]);
  return <canvas ref={canvas} className="v5-dock-orb-px" data-style={style} aria-hidden />;
}

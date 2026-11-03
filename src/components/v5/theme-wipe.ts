import { flushSync } from "react-dom";

/* Theme change as a pixel reveal (Figma brilpill · Final, "Transition" 1328:33515). In the frame, a group of 54px
 * squares masks the page in the next theme: as squares switch on, rising from the bottom with a stepped, uneven edge
 * and the odd square ahead of it, the new page shows through them until it fills the screen. One pass, no flat colour.
 *
 * Nothing stops while it runs. The live page switches to the new theme at once; over it lies a copy of the page in the
 * old theme (the "ghost"), and the squares are cut out of the ghost, so where they've switched on you see the live page
 * underneath. For the 640ms it's up the ghost mirrors the live page: whatever changes there (a new suggestion, a chat
 * answer streaming in, a class or attribute) is copied over, its animations run in step with the live ones, its
 * canvases (dither, vapour title) are repainted from the live ones every frame, and scroll and typed text follow. */

const CELL = 54;
const REVEAL = 640; // ms for the whole reveal
const SPREAD = 3; // rows of unevenness along the edge
const STRAY = 0.8; // how far a single square can run ahead of its column

let running = false;

/** Each square's turn, counted in rows from the bottom: its row, its column's lag and a little of its own. */
function grid(w: number, h: number) {
  const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
  const lag = Array.from({ length: cols }, () => Math.random() * SPREAD);
  const turn = Array.from({ length: cols * rows }, (_, i) => (rows - 1 - Math.floor(i / cols)) + lag[i % cols] + Math.random() * STRAY);
  return { cols, turn, span: rows + SPREAD + STRAY };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** A copy of the live v5 frame that keeps itself in step with it until `stop()`. */
class Ghost {
  readonly root: HTMLElement;
  /** Live node → its copy. The two trees match node for node (the cursor is hidden by CSS, not removed). */
  private twin = new WeakMap<Node, Node>();
  private canvases: [HTMLCanvasElement, HTMLCanvasElement][] = [];
  private fields: [HTMLInputElement | HTMLTextAreaElement, HTMLInputElement | HTMLTextAreaElement][] = [];
  private scrollers: [Element, Element][] = [];
  private observer: MutationObserver;

  constructor(private page: HTMLElement) {
    this.root = page.cloneNode(true) as HTMLElement;
    this.root.classList.add("v5-ghost");
    this.root.setAttribute("aria-hidden", "true");
    this.root.inert = true;
    this.link(page, this.root);
    page.append(this.root);
    this.follow(page);
    this.observer = new MutationObserver(records => this.mirror(records));
  }

  /** Starts copying changes over; called after the theme switch, so the switch itself stays out of the ghost. */
  watch() {
    this.observer.observe(this.page, { subtree: true, childList: true, attributes: true, characterData: true });
  }

  /** Per frame: canvases, typed text and scroll, which change without touching the DOM. */
  sync() {
    for (const [live, copy] of this.canvases) {
      if (copy.width !== live.width || copy.height !== live.height) { copy.width = live.width; copy.height = live.height; }
      const ctx = copy.getContext("2d");
      if (!ctx || !live.width || !live.height) continue;
      ctx.clearRect(0, 0, copy.width, copy.height);
      try { ctx.drawImage(live, 0, 0); } catch { continue; }
      // The dither draws its dots in its CSS colour, which on the live page is already the new theme's: repaint them
      // in the ghost's own (old) colour.
      if (copy.closest(".v5-dither")) {
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = getComputedStyle(copy).color;
        ctx.fillRect(0, 0, copy.width, copy.height);
        ctx.globalCompositeOperation = "source-over";
      }
    }
    for (const [live, copy] of this.fields) if (copy.value !== live.value) copy.value = live.value;
    for (const [live, copy] of this.scrollers) { copy.scrollTop = live.scrollTop; copy.scrollLeft = live.scrollLeft; }
  }

  stop() {
    this.observer.disconnect();
    this.root.remove();
  }

  /** Pairs a live subtree with its copy, node for node, and notes what `sync` has to carry over. */
  private link(live: Node, copy: Node) {
    this.twin.set(live, copy);
    if (copy instanceof Element) copy.removeAttribute("id");
    if (live instanceof HTMLCanvasElement) this.canvases.push([live, copy as HTMLCanvasElement]);
    if (live instanceof HTMLInputElement || live instanceof HTMLTextAreaElement) this.fields.push([live, copy as HTMLInputElement]);
    if (live instanceof Element && (live.scrollHeight > live.clientHeight || live.scrollWidth > live.clientWidth)) this.scrollers.push([live, copy as Element]);
    if (live instanceof HTMLVideoElement) { const video = copy as HTMLVideoElement; video.muted = true; video.currentTime = live.currentTime; if (!live.paused) void video.play().catch(() => {}); }
    const kids = [...live.childNodes].filter(node => node !== this.root);
    kids.forEach((kid, i) => { const match = copy.childNodes[i]; if (match) this.link(kid, match); });
  }

  /** Puts the copy's animations where the live ones are: matched by element, pseudo-element and name; script-made
   * animations are recreated; any the copy started on its own (entrances replaying because it was just made) end. */
  private follow(live: Element) {
    const copy = this.twin.get(live) as Element | undefined;
    if (!copy) return;
    const key = (pseudo: string | null, name: string) => `${pseudo ?? ""}|${name}`;
    const own = new Map<Element, Map<string, Animation[]>>();
    for (const animation of copy.getAnimations({ subtree: true })) {
      const effect = animation.effect as KeyframeEffect | null;
      if (!effect?.target) continue;
      const name = animation instanceof CSSAnimation ? animation.animationName : "";
      const byKey = own.get(effect.target) ?? new Map<string, Animation[]>();
      const k = key(effect.pseudoElement, name);
      byKey.set(k, [...(byKey.get(k) ?? []), animation]);
      own.set(effect.target, byKey);
    }
    const used = new Set<Animation>();
    for (const animation of live.getAnimations({ subtree: true })) {
      const effect = animation.effect as KeyframeEffect | null;
      const target = effect?.target ? this.twin.get(effect.target) as Element | undefined : undefined;
      if (!effect || !target) continue;
      const name = animation instanceof CSSAnimation ? animation.animationName : animation instanceof CSSTransition ? "" : null;
      let match = name ? own.get(target)?.get(key(effect.pseudoElement, name))?.find(candidate => !used.has(candidate)) : undefined;
      if (!match && name === null) {
        try { match = target.animate(effect.getKeyframes(), { ...effect.getTiming(), pseudoElement: effect.pseudoElement ?? undefined } as KeyframeAnimationOptions); } catch { continue; }
      }
      if (!match) continue;
      used.add(match);
      match.currentTime = animation.currentTime;
      if (animation.playState === "paused") match.pause();
    }
    for (const list of own.values()) for (const animations of list.values()) for (const animation of animations) {
      if (used.has(animation)) continue;
      try { animation.finish(); } catch { animation.cancel(); }
    }
  }

  /** Copies live changes into the ghost: attributes one by one; changed content by re-copying that element whole. */
  private mirror(records: MutationRecord[]) {
    const recopy = new Set<Element>();
    for (const record of records) {
      const target = record.target;
      if (this.root.contains(target) || target === this.root) continue;
      if (record.type === "attributes") {
        // The frame itself keeps its old theme; its other attributes don't change what the ghost shows.
        if (target === this.page || !(target instanceof Element) || record.attributeName === "id") continue;
        const copy = this.twin.get(target) as Element | undefined;
        const value = target.getAttribute(record.attributeName!);
        if (!copy) continue;
        if (value === null) copy.removeAttribute(record.attributeName!);
        else copy.setAttribute(record.attributeName!, value);
        continue;
      }
      if (record.type === "childList" && [...record.addedNodes, ...record.removedNodes].every(node => node === this.root)) continue;
      const element = target instanceof Element ? target : target.parentElement;
      if (element) recopy.add(element);
    }
    // Outermost first; anything inside an element being re-copied comes along with it.
    const list = [...recopy].filter(element => ![...recopy].some(other => other !== element && other.contains(element)));
    for (const live of list) {
      if (live === this.page) { this.recopyChildren(); continue; }
      const old = this.twin.get(live) as Element | undefined;
      if (!old) continue;
      const fresh = live.cloneNode(true) as Element;
      old.replaceWith(fresh);
      this.prune(old);
      this.link(live, fresh);
      this.follow(live);
    }
  }

  /** The frame's own children changed (a pop-up mounting, say): re-copy them all, keeping the ghost root. */
  private recopyChildren() {
    [...this.root.childNodes].forEach(node => { this.prune(node); node.remove(); });
    for (const kid of [...this.page.childNodes]) {
      if (kid === this.root) continue;
      const fresh = kid.cloneNode(true);
      this.root.append(fresh);
      this.link(kid, fresh);
      if (kid instanceof Element) this.follow(kid);
    }
  }

  /** Forgets the per-frame work for a part of the ghost that's been replaced. */
  private prune(gone: Node) {
    const inside = (node: Node) => gone === node || gone.contains(node);
    this.canvases = this.canvases.filter(([, copy]) => !inside(copy));
    this.fields = this.fields.filter(([, copy]) => !inside(copy));
    this.scrollers = this.scrollers.filter(([, copy]) => !inside(copy));
  }
}

/** Switches the theme with the reveal; `swap` applies the new theme. Clicks while one runs are ignored, so quick
 * repeats can't stack reveals or skip a theme. */
export function wipeTheme(swap: () => void) {
  const page = document.querySelector<HTMLElement>(".v5");
  if (running) return;
  if (!page || matchMedia("(prefers-reduced-motion: reduce)").matches) { swap(); return; }
  running = true;

  const w = window.innerWidth, h = window.innerHeight;
  const { cols, turn, span } = grid(w, h);
  const ghost = new Ghost(page);
  // The ghost shows wherever a square hasn't switched on yet.
  const mask = (hidden: (t: number) => boolean) => {
    let rects = "";
    for (let i = 0; i < turn.length; i++) if (!hidden(turn[i])) rects += `<rect x="${(i % cols) * CELL}" y="${Math.floor(i / cols) * CELL}" width="${CELL + 0.5}" height="${CELL + 0.5}"/>`;
    const url = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${rects}</svg>`)}")`;
    ghost.root.style.maskImage = url;
    ghost.root.style.setProperty("-webkit-mask-image", url);
  };
  mask(() => false);
  ghost.sync();
  flushSync(swap);
  ghost.watch();

  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / REVEAL);
    if (p >= 1) { ghost.stop(); running = false; return; }
    mask(k => k <= ease(p) * span);
    ghost.sync();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

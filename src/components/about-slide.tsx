"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUpRightIcon, CursorIcon, GlobeIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { aboutChapters, aboutStatement, type FlowBlock, type ServiceArt as ServiceArtKind } from "@/content/portfolio-content";
import { AboutCursor } from "./about-cursor";
import { FooterEmbers } from "./footer-embers";
import { AboutTopArt } from "./about-top-art";
import { SiteFooter } from "./site-footer";

const ordinals = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const numeral = (n: number) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n] ?? String(n + 1);
/** Below this card width the copy stacks in one column and stops bending around the head. */
const FLOW_MIN_WIDTH = 720;

/** Paragraphs of a block (separated by a blank line), their words in spans for the flow. */
function Paragraphs({ text }: { text: string }) {
  return <>{text.split("\n\n").map((paragraph, i) => <p key={i}><Words text={paragraph} /></p>)}</>;
}

/** Words of a block, each in its own span so the flow can find its lines. */
function Words({ text }: { text: string }) {
  return <>{text.split(" ").map((word, i) => <span key={i} className="about-word">{word} </span>)}</>;
}

/**
 * About, after gionatannese.com/about: one card that hugs its content. A chrome cursor stays at 70% of the
 * window height while the chapters scroll past either side of it, every line nearing it floating aside; it points at the
 * copy as you scroll, or at your pointer, and comes to rest on top of the footer, pointing at the contacts. Any
 * other object only needs to fill the `.about-head` box.
 */
export function AboutSlide() {
  const section = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const turn = useRef(0), rest = useRef(0);
  const still = useRef(0), resting = useRef(1);
  const visible = useVisible(section);
  useAboutScroll(section);
  useFlowAround(section, head, turn, rest);

  return <><section ref={section} className="about-slide" aria-labelledby="about-heading">
    <div className="about-stage">
      <header className="about-statement">
        <AboutTopArt />
        <h1 id="about-heading" tabIndex={-1}>{aboutStatement}</h1>
      </header>

      <div className="about-head-track" aria-hidden><div ref={head} className="about-head"><AboutCursor turn={turn} rest={rest} active={visible} /></div></div>

      {aboutChapters.map((chapter, index) => <section key={chapter.id} id={`about-${chapter.id}`} className="about-chapter" aria-labelledby={`about-${chapter.id}-title`}>
        <div className="about-chapter-head" aria-hidden><span>Ch. {ordinals[index]}</span><span className="about-numeral">{numeral(index)}</span><span>{chapter.title}</span></div>
        <h2 id={`about-${chapter.id}-title`} className="sr-only">{chapter.title}</h2>
        {chapter.blocks.map((block, i) => <Block key={i} block={block} />)}
      </section>)}
    </div>

    <SiteFooter still={<AboutCursor turn={still} rest={resting} active={visible} />} />
  </section><FooterEmbers /></>;
}

/**
 * One block either side of the head. A block on the other side from the one before starts on that one's last
 * line, so the two columns weave down the page.
 */
function Block({ block }: { block: FlowBlock }) {
  const props = { className: `about-block about-block-${block.kind}`, "data-side": block.side };
  const flow = { ...props, "data-flow-side": block.side };
  if (block.kind === "text") return <div {...flow}><Paragraphs text={block.text} /></div>;
  if (block.kind === "list") return <div {...flow}>

    {block.title && <h3><span className="about-word">{block.title}</span></h3>}
    <ul>{block.items.map(item => <li key={item}><span className="about-word">{item}</span></li>)}</ul>
  </div>;
  return <article {...flow}>

    {block.art && <div><span className="about-word about-word-art"><ServiceArt art={block.art} /></span></div>}
    {block.meta && <span className="about-block-meta"><Words text={block.meta} /></span>}
    <h3>{block.website ? <a className="about-experience-title-link" href={block.website} target="_blank" rel="noopener noreferrer" aria-label={`${block.title} website (opens in a new tab)`}><Words text={block.title} /></a> : <Words text={block.title} />}</h3>
    {block.subtitle && <span className="about-block-subtitle"><Words text={block.subtitle} /></span>}
    {block.text && <Paragraphs text={block.text} />}
    {!!block.previews?.length && <div className="about-experience-media about-word" data-gallery={block.previews.length > 1 || undefined}>
      {block.previews.map(preview => {
        const [x, y, width, height, sourceWidth, sourceHeight] = preview.crop;
        return <a key={preview.href} href={preview.href} target="_blank" rel="noreferrer" aria-label={`${preview.title} (opens in a new tab)`} title={preview.title}>
          <span className="experience-preview-image" aria-hidden style={{ aspectRatio: `${width} / ${height}`, backgroundImage: `url("${preview.image}")`, backgroundSize: `${sourceWidth / width * 100}% auto`, backgroundPosition: `${x / (sourceWidth - width) * 100}% ${y / (sourceHeight - height) * 100}%` }} />
        </a>;
      })}
    </div>}
    {!!block.links?.length && <div className="about-block-links">{block.links.map(link => <a key={link.href} className="about-word" href={link.href} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {link.label}{link.external && <ArrowUpRightIcon size={12} aria-hidden />}
    </a>)}</div>}
  </article>;
}


/**
 * Keeps each flowing line clear of the head, as on gionatannese.com: an ellipse around the head (wider and taller
 * than the head itself) is kept free, every line nearing it gets a target offset that clears it, and lines then
 * ease towards their target each frame, so the copy floats aside and settles back rather than snapping.
 * Line boxes are measured once per layout (untransformed, relative to the section).
 */
/** Frame-rate independent easing, close to the reference's separate scroll / line settling. */
const EASE = .138;

/** Smooth desktop wheel input while retaining the document scrollbar, keyboard and native touch scrolling. */
function useAboutScroll(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const wheelSurface = section.closest("main") ?? section;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let target = window.scrollY, frame = 0, previous = 0;
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; target = window.scrollY; };
    const tick = (time: number) => {
      const dt = previous ? Math.min(64, time - previous) : 1000 / 60;
      previous = time;
      target = Math.max(0, Math.min(target, document.documentElement.scrollHeight - innerHeight));
      const current = window.scrollY;
      const next = current + (target - current) * (1 - Math.pow(.88, dt / (1000 / 60)));
      window.scrollTo({ top: Math.abs(target - current) < 1 ? target : next, behavior: "instant" });
      if (Math.abs(target - window.scrollY) > 1) frame = requestAnimationFrame(tick);
      else { frame = 0; previous = 0; }
    };
    const wheel = (event: WheelEvent) => {
      if (!event.cancelable || event.defaultPrevented || reduced.matches || !fine.matches || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const element = event.target;
      if (!(element instanceof Element) || !section.closest("main")?.contains(element)) return;
      // Nested scroll areas (for example a menu) keep their own native input.
      for (let node = element; node && node !== document.body; node = node.parentElement!) {
        if (/auto|scroll/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 1) return;
      }
      const delta = event.deltaY * (event.deltaMode === 1 ? 26 : event.deltaMode === 2 ? innerHeight : 1);
      if (!delta) return;
      event.preventDefault();
      if (!frame) target = window.scrollY;
      target = Math.max(0, Math.min(target + delta, document.documentElement.scrollHeight - innerHeight));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const key = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stop();
    };
    wheelSurface.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("pointerdown", stop);
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", key);
    reduced.addEventListener("change", stop);
    return () => {
      stop();
      wheelSurface.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", key);
      reduced.removeEventListener("change", stop);
    };
  }, [sectionRef]);
}

function useFlowAround(sectionRef: RefObject<HTMLElement | null>, headRef: RefObject<HTMLDivElement | null>, turn: RefObject<number>, rest: RefObject<number>) {
  useEffect(() => {
    const section = sectionRef.current, head = headRef.current;
    if (!section || !head) return;
    const stage = head.parentElement!.parentElement!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    type Line = { side: string; middle: number; left: number; right: number; words: HTMLElement[]; shown: number; written: number };
    let lines: Line[] = [];
    let serviceArts: { element: HTMLElement; middle: number; active: boolean }[] = [];
    let narrow = false;
    let frame = 0, last = 0;

    const measure = () => {
      const words = [...section.querySelectorAll<HTMLElement>("[data-flow-side] .about-word")];
      for (const word of words) word.style.translate = "";
      narrow = section.clientWidth < FLOW_MIN_WIDTH;
      lines = [];
      const sectionTop = section.getBoundingClientRect().top;
      serviceArts = [...section.querySelectorAll<HTMLElement>(".service-art")].map(element => {
        const rect = element.getBoundingClientRect();
        return { element, middle: rect.top + rect.height / 2 - sectionTop, active: element.hasAttribute("data-active") };
      });
      if (narrow) return;
      // Content coordinates: relative to the section, which moves with the page as a whole.
      const box = section.getBoundingClientRect();
      let current: Line | undefined;
      for (const word of words) {
        const side = word.closest<HTMLElement>("[data-flow-side]")!.dataset.flowSide!;
        const rect = word.getBoundingClientRect();
        const middle = rect.top + rect.height / 2 - box.top;
        if (!current || current.side !== side || Math.abs(current.middle - middle) > 2) {
          current = { side, middle, left: rect.left - box.left, right: rect.right - box.left, words: [], shown: 0, written: 0 };
          lines.push(current);
        }
        current.left = Math.min(current.left, rect.left - box.left);
        // A word's span ends in its trailing space; the visible line ends a few pixels earlier, which is fine.
        current.right = Math.max(current.right, rect.right - box.left);
        current.words.push(word);
      }
    };

    const update = (time: number) => {
      frame = 0;
      const step = last ? Math.min(4, (time - last) / (1000 / 60)) : 1;
      last = time;
      const box = section.getBoundingClientRect();
      const ball = head.getBoundingClientRect();
      // The object sways from one side's copy to the other's as you scroll (-1 to 1), and is at rest (1) once it
      // settles into the footer.
      const settle = Math.min(1, Math.max(0, (stage.getBoundingClientRect().bottom - ball.top) / 360));
      turn.current = narrow ? 0 : Math.sin(-box.top / 420) * settle;
      rest.current = narrow ? 1 : 1 - settle;
      // Activate illustrations as they pass the floating cursor's vertical position.
      // Narrow layouts have no travelling cursor, so use the same 70% viewport reading point.
      const activationY = narrow ? window.innerHeight * .7 : ball.top + ball.height / 2;
      for (const art of serviceArts) {
        const distance = Math.abs(box.top + art.middle - activationY);
        const active = distance < (art.active ? 120 : 96);
        if (active !== art.active) {
          art.active = active;
          art.element.toggleAttribute("data-active", active);
        }
      }
      if (narrow) return;
      const cx = ball.left + ball.width / 2, cy = ball.top + ball.height / 2;
      const rx = head.offsetWidth * .8, ry = head.offsetHeight * 1.5;
      const ease = reduced.matches ? 1 : 1 - Math.pow(1 - EASE, step);
      let moving = false;
      for (const line of lines) {
        const y = (box.top + line.middle - cy) / ry;
        let target = 0;
        if (!reduced.matches && Math.abs(y) < 1) {
          // A smooth shoulder avoids the ellipse's abrupt sideways acceleration at its tips.
          const half = rx * Math.pow(1 - y * y, 2);
          if (line.side === "left") target = Math.min(0, cx - half - (box.left + line.right));
          else target = Math.max(0, cx + half - (box.left + line.left));
        }
        // Never push copy or a media card past the page gutters on smaller desktop widths.
        const available = line.side === "left" ? box.left + line.left - 24 : innerWidth - 24 - (box.left + line.right);
        target = Math.sign(target) * Math.min(Math.abs(target), Math.max(0, available));
        line.shown = Math.abs(target - line.shown) < .3 ? target : line.shown + (target - line.shown) * ease;
        if (line.shown !== target) moving = true;
        const value = Math.round(line.shown * 10) / 10;
        if (value === line.written) continue;
        line.written = value;
        for (const word of line.words) word.style.translate = value ? `${value}px 0` : "";
      }
      // Keep easing after the scroll stops, until every line has settled.
      if (moving) schedule();
      else last = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const relayout = () => { measure(); schedule(); };

    relayout();
    let disposed = false;
    void document.fonts?.ready.then(() => { if (!disposed) relayout(); });
    const observer = new ResizeObserver(relayout);
    observer.observe(section);
    // The section no longer scrolls itself; any scroll on the page (the pager) moves it.
    document.addEventListener("scroll", schedule, { capture: true, passive: true });
    return () => { disposed = true; observer.disconnect(); document.removeEventListener("scroll", schedule, { capture: true }); cancelAnimationFrame(frame); };
  }, [sectionRef, headRef, turn, rest]);
}

/** True while the element is on screen, so the cursors only animate while you can see them. */
function useVisible(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

/** Small drawn compositions for each service, in the spirit of app-icon spot illustrations. */
function ServiceArt({ art }: { art: ServiceArtKind }) {
  if (art === "mobile") return <div className="service-art service-art-mobile" aria-hidden><svg className="service-scene" viewBox="0 0 104 84">
    <g className="scene-phone-back"><rect x="14" y="4" width="40" height="70" rx="9" className="scene-paper" /><path d="M27 10h14" className="scene-line" /><rect x="20" y="19" width="28" height="22" rx="4" className="scene-muted" /><path d="M21 49h22M21 55h16" className="scene-line" /><rect x="20" y="62" width="28" height="6" rx="3" className="scene-blue" /></g>
    <g className="scene-phone-front"><rect x="40" y="10" width="40" height="70" rx="9" className="scene-paper" /><path d="M53 16h14" className="scene-line" /><rect x="46" y="25" width="28" height="28" rx="5" className="scene-blue-soft" /><path d="m53 39 5 5 10-11" className="scene-blue-line" /><path d="M47 61h22M47 67h15" className="scene-line" /></g>
  </svg></div>;
  if (art === "web") return <div className="service-art service-art-web" aria-hidden><span className="service-select"><GlobeIcon size={30} weight="thin" /><i /><i /><i /><i /></span><CursorIcon className="service-art-cursor" size={26} weight="fill" /></div>;
  if (art === "landing") return <div className="service-art service-art-landing" aria-hidden><svg className="service-scene" viewBox="0 0 104 84">
    <rect x="8" y="7" width="88" height="70" rx="7" className="scene-paper" /><path d="M8 19h88" className="scene-rule" /><circle cx="15" cy="13" r="1.5" className="scene-ink" /><circle cx="21" cy="13" r="1.5" className="scene-muted" />
    <g className="scene-reveal scene-step-one"><rect x="17" y="27" width="36" height="5" rx="2" className="scene-ink" /><rect x="17" y="37" width="29" height="3" rx="1.5" className="scene-muted" /><rect x="17" y="44" width="33" height="3" rx="1.5" className="scene-muted" /></g>
    <g className="scene-reveal scene-step-two"><rect x="61" y="27" width="26" height="29" rx="4" className="scene-blue-soft" /><circle cx="74" cy="38" r="6" className="scene-blue" /><path d="m64 52 8-8 12 8" className="scene-blue-line" /></g>
    <g className="scene-reveal scene-step-three"><rect x="17" y="58" width="31" height="10" rx="4" className="scene-blue" /><path d="M25 63h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></g>
  </svg></div>;
  if (art === "ai") return <div className="service-art service-art-ai" aria-hidden><svg className="service-scene" viewBox="0 0 104 84">
    <g className="scene-prompt"><rect x="9" y="26" width="86" height="30" rx="10" className="scene-paper" /><path d="m19 36 5 5-5 5M31 41h35" className="scene-line" /><circle cx="82" cy="41" r="7" className="scene-blue" /><path d="m79 41 3-3 3 3M82 38v6" stroke="white" strokeWidth="1.5" fill="none" /></g>
    <g className="scene-result"><rect x="16" y="8" width="72" height="68" rx="8" className="scene-paper" /><rect x="24" y="17" width="24" height="5" rx="2" className="scene-ink" /><rect x="24" y="30" width="56" height="16" rx="4" className="scene-blue-soft" /><path d="m29 38 3 3 6-7" className="scene-blue-line" /><path d="M44 38h28M25 55h45M25 63h32" className="scene-line" /><circle cx="77" cy="20" r="3" className="scene-blue" /></g>
  </svg></div>;
  if (art === "code") return <div className="service-art service-art-code" aria-hidden><svg className="service-scene" viewBox="0 0 104 84">
    <rect x="8" y="7" width="88" height="70" rx="7" className="scene-paper" /><path d="M8 20h88" className="scene-rule" /><path d="m19 11-4 3 4 3m5-6 4 3-4 3" className="scene-blue-line" />
    <g className="scene-wireframe" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"><rect x="16" y="28" width="17" height="41" rx="3" /><rect x="40" y="28" width="48" height="17" rx="3" /><rect x="40" y="52" width="21" height="17" rx="3" /><rect x="67" y="52" width="21" height="17" rx="3" /></g>
    <g className="scene-built scene-step-one"><rect x="16" y="28" width="17" height="41" rx="3" className="scene-ink" /><path d="M20 35h9M20 41h7M20 47h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></g>
    <g className="scene-built scene-step-two"><rect x="40" y="28" width="48" height="17" rx="3" className="scene-blue" /><path d="M46 34h21M46 39h13" stroke="white" strokeWidth="2" strokeLinecap="round" /></g>
    <g className="scene-built scene-step-three"><rect x="40" y="52" width="21" height="17" rx="3" className="scene-muted" /><rect x="67" y="52" width="21" height="17" rx="3" className="scene-blue-soft" /></g>
  </svg></div>;
  if (art === "system") return <div className="service-art service-art-system" aria-hidden><span className="service-tile service-tile-grid"><SquaresFourIcon size={34} weight="duotone" /></span></div>;
  return <div className="service-art service-art-motion" aria-hidden><svg viewBox="0 0 72 56" fill="none"><path d="M4 50 C 30 50, 34 6, 68 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle className="service-motion-dot" r="5" /></svg></div>;
}

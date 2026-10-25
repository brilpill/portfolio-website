"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DeviceMobileIcon, MonitorIcon } from "@phosphor-icons/react";
import { StageArtifact, stages } from "./process-slide";

/**
 * My process as a layered sticker, after bubbbly.com/sticker-pack (original CSS 3D, not their WebGL or artwork;
 * the timings and spring constants follow theirs). What it does:
 * - Idle, it sways in slow layered sines, as if held up to the light.
 * - In view, it tilts into an isometric stack and the layers lift apart one after another, each on a leader line
 *   with its step and a short note. Tap it to close or open the layers.
 * - Press and drag to tilt it; let go and it springs back. A fast sideways flick switches Web / Mobile.
 * - Its corner lifts when you hover near it; drag the corner far enough and the sticker peels off to the other
 *   format, otherwise it springs back flat.
 * - Switching format closes the stack, the old sticker leaves, the new one drops in, and it opens again.
 */
const POSE_OPEN = [40, 10], POSE_CLOSE = [150, 24], LAYER_OPEN = [60, 10], LAYER_CLOSE = [160, 24];
const TILT = [90, 8], PEEL_DRAG = [420, 40], PEEL_REST = [170, 13];
type Spring = { x: number; v: number };
const spring = (): Spring => ({ x: 0, v: 0 });
const step = (s: Spring, target: number, [stiffness, damping]: number[], dt: number) => {
  s.v += (stiffness * (target - s.x) - damping * s.v) * dt;
  s.x += s.v * dt;
};
const ramp = (from: number, to: number, value: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const DEG = 180 / Math.PI;
/** The sticker's layers, top to bottom; one per process step. */
const materials = ["gloss", "clear", "print", "vinyl", "liner"] as const;

/** `mobile` is the selected tab, owned by the section so its sidebar can follow it; a flick or peel reports a
 * switch through `onMobileChange`. */
export function ProcessSticker({ mobile, onMobileChange }: { mobile: boolean; onMobileChange: (mobile: boolean) => void }) {
  const [shown, setShown] = useState(false); // the format on screen; lags the tabs while a switch plays
  const report = useRef(onMobileChange);
  useEffect(() => { report.current = onMobileChange; });
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLButtonElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const control = useRef({ inView: false, manual: null as boolean | null, switching: false, want: false, spin: 1 });
  const kick = useRef<() => void>(() => {});
  const request = useRef<(next: boolean, spin: number) => void>(() => {});

  useEffect(() => {
    const element = root.current, area = scene.current, hold = holder.current, group = stack.current;
    if (!element || !area || !hold || !group) return;
    const layers = [...group.querySelectorAll<HTMLElement>(".process-sticker-layer")];
    const anchors = layers.map(layer => layer.querySelector<HTMLElement>(".process-sticker-anchor")!);
    const labels = [...area.querySelectorAll<HTMLElement>(".process-sticker-label")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const pose = spring(), lifts = layers.map(spring), rx = spring(), ry = spring(), peel = spring();
    const pointer = { over: false, down: false, mode: "" as "" | "tilt" | "peel", x0: 0, y0: 0, x: 0, y: 0, vx: 0, lastX: 0, lastT: 0, nearCorner: false };
    let open = false, since = 0, clock = 0, frame = 0, last = 0, holdUntil = 0, visible = false, transitioning = false;
    let grid = 0; // the backdrop grid fades in while the layers are apart (their rate: 1 - e^(-4t))
    let current = false; // the format the stack shows (or is landing on)

    const size = () => ({ w: group.offsetWidth, h: group.offsetHeight });
    const short = () => Math.min(group.offsetWidth, group.offsetHeight);
    /** On-screen distance from the pointer to the sticker's bottom-right corner. */
    const cornerDistance = (clientX: number, clientY: number) => {
      const box = group.getBoundingClientRect();
      return Math.hypot(box.right - clientX, box.bottom - clientY);
    };

    const render = () => {
      const p = pose.x, { h } = size();
      // Idle sway (their layered sines), calmed while the layers are apart.
      const idle = reduced.matches ? 0 : 1, t = clock;
      const swayX = .14 * Math.sin(.73 * t + 1.7) * idle * (1 - .6 * p);
      const swayY = (.27 * Math.sin(.9 * t + 1) + .07 * Math.sin(2.3 * t + 3.1)) * idle * (1 - .85 * p);
      const swayZ = .035 * Math.sin(.55 * t + .7) * idle * (1 - .85 * p);
      const bob = .03 * Math.sin(1.1 * t + 1) * idle * h;
      hold.style.transform = `translateY(${bob.toFixed(2)}px) rotateX(${((swayX + rx.x) * DEG).toFixed(2)}deg) rotateY(${((swayY + ry.x) * DEG).toFixed(2)}deg) rotateZ(${(swayZ * DEG).toFixed(2)}deg)`;
      group.style.setProperty("--pose", p.toFixed(4));
      layers.forEach((layer, i) => {
        const lift = lifts[i].x;
        layer.style.setProperty("--lift", ((layers.length - 1 - i) * lift).toFixed(4)); // in gaps; CSS sets the gap
        layer.style.setProperty("--dash", ramp(.4, .95, lift).toFixed(3));
      });
      // Labels live flat above the scene (as on the reference) and follow each layer's top-left corner.
      const box = area.getBoundingClientRect();
      labels.forEach((label, i) => {
        const shown = ramp(.55, 1, lifts[i].x);
        label.style.opacity = shown.toFixed(3);
        if (!shown) return;
        const point = anchors[i].getBoundingClientRect();
        label.style.transform = `translate(${(point.left - box.left).toFixed(1)}px, ${(point.top - box.top).toFixed(1)}px) translate(-100%, -50%)`;
      });
      group.style.setProperty("--peel", `${clamp(peel.x, 0, .9 * short()).toFixed(2)}px`);
      area.style.setProperty("--grid", grid.toFixed(3));
    };

    // Old sticker out, new one in: the old drops and shrinks away, the new falls in from above.
    const swap = () => {
      transitioning = true;
      const { spin, want } = control.current;
      const target = hold.parentElement!;
      // A tab pressed while this switch played: land, then go straight on to the newest choice.
      const done = () => {
        transitioning = false;
        if (control.current.want === current) { control.current.switching = false; holdUntil = clock + .5; }
        kick.current();
      };
      current = want;
      if (reduced.matches) { setShown(want); done(); return; }
      const out = target.animate(
        [{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateY(70px) scale(.82) rotate(${spin * -10}deg)` }],
        { duration: 320, easing: "cubic-bezier(.55, 0, .7, .2)", fill: "forwards" },
      );
      out.onfinish = () => {
        setShown(want);
        const into = target.animate(
          [{ opacity: 0, transform: `translateY(-90px) scale(1.16) rotate(${spin * 8}deg)` }, { opacity: 1, transform: "none" }],
          { duration: 620, easing: "cubic-bezier(.22, 1, .36, 1)" },
        );
        out.cancel();
        into.onfinish = done;
      };
    };

    const tick = (time: number) => {
      frame = 0;
      const dt = last ? Math.min(1 / 30, (time - last) / 1000) : 1 / 60;
      last = time;
      clock += dt;
      const state = control.current;
      const wanted = !state.switching && clock >= holdUntil && (state.manual ?? state.inView);
      if (wanted !== open) { open = wanted; since = clock; }

      // Drag tilt follows the pointer; the corner follows a peel drag, or lifts a little on hover.
      const tilting = pointer.down && pointer.mode === "tilt", peeling = pointer.down && pointer.mode === "peel";
      const peelTarget = peeling
        ? clamp(((pointer.x0 - pointer.x) + (pointer.y0 - pointer.y)) / Math.SQRT2 + .06 * short(), 0, .9 * short())
        : pointer.over && pointer.nearCorner && !open && pose.x < .02 ? .06 * short() : 0;
      if (reduced.matches) {
        pose.x = +open; pose.v = 0;
        lifts.forEach(lift => { lift.x = +open; lift.v = 0; });
        rx.x = ry.x = 0; peel.x = peeling ? peelTarget : 0; peel.v = 0;
      } else {
        step(pose, +open, open ? POSE_OPEN : POSE_CLOSE, dt);
        lifts.forEach((lift, i) => step(lift, +(open && clock - since > .12 + .05 * i), open ? LAYER_OPEN : LAYER_CLOSE, dt));
        step(ry, tilting ? clamp((pointer.x - pointer.x0) * .006, -1.2, 1.2) : 0, TILT, dt);
        step(rx, tilting ? clamp(-(pointer.y - pointer.y0) * .005, -.8, .8) : 0, TILT, dt);
        step(peel, peelTarget, peeling ? PEEL_DRAG : PEEL_REST, dt);
      }
      grid += (+open - grid) * (reduced.matches ? 1 : 1 - Math.exp(-4 * dt));
      render();

      // A pending switch waits until the stack is together and flat, then the stickers swap. Toggled back to
      // what is already showing, it is dropped.
      if (state.switching && !transitioning && state.want === current) { state.switching = false; holdUntil = clock + .2; }
      else if (state.switching && !transitioning && pose.x < .02 && lifts.every(lift => lift.x < .02)) swap();

      const resting = [pose, rx, ry, peel, ...lifts].every(s => Math.abs(s.v) < .001) && Math.abs(pose.x - +open) < .001 && Math.abs(grid - +open) < .002;
      // The idle sway keeps the loop going while the sticker is on screen.
      if ((visible && !reduced.matches) || !resting || state.switching || clock < holdUntil) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    kick.current = () => { if (!frame) frame = requestAnimationFrame(tick); };
    request.current = (next, spin) => {
      Object.assign(control.current, { want: next, spin, switching: true, manual: null });
      report.current(next);
      kick.current();
    };

    // Pointer: tilt by default; from near the corner, while the stack is flat, peel.
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      Object.assign(pointer, { down: true, x0: event.clientX, y0: event.clientY, x: event.clientX, y: event.clientY, vx: 0, lastX: event.clientX, lastT: performance.now() });
      pointer.mode = pose.x < .02 && cornerDistance(event.clientX, event.clientY) < .28 * short() ? "peel" : "tilt";
      try { area.setPointerCapture(event.pointerId); } catch { /* a synthetic pointer can't be captured */ }
      area.dataset.grabbing = "";
      kick.current();
    };
    const onMove = (event: PointerEvent) => {
      pointer.over = true;
      pointer.nearCorner = cornerDistance(event.clientX, event.clientY) < .28 * short();
      area.dataset.cursor = pointer.nearCorner && pose.x < .02 ? "grab" : "";
      if (pointer.down) {
        const now = performance.now(), elapsed = Math.max(1, now - pointer.lastT);
        pointer.vx += ((event.clientX - pointer.lastX) / elapsed * 1000 - pointer.vx) * .4;
        pointer.lastX = event.clientX; pointer.lastT = now;
        pointer.x = event.clientX; pointer.y = event.clientY;
      }
      kick.current();
    };
    const onUp = (event: PointerEvent) => {
      if (!pointer.down) return;
      const moved = Math.hypot(event.clientX - pointer.x0, event.clientY - pointer.y0);
      const state = control.current;
      // How far the corner was dragged, not where its spring has got to: a quick drag still peels it off.
      const depth = ((pointer.x0 - event.clientX) + (pointer.y0 - event.clientY)) / Math.SQRT2;
      if (pointer.mode === "peel" && Math.max(peel.x, depth) > .36 * short()) request.current(!state.want, 1);
      else if (moved < 6) state.manual = !(state.manual ?? state.inView);
      else if (pointer.mode === "tilt" && Math.abs(pointer.vx) > 800 && Math.abs(event.clientX - pointer.x0) > 50) request.current(!state.want, pointer.vx < 0 ? 1 : -1);
      pointer.down = false; pointer.mode = "";
      if (event.pointerType !== "mouse") pointer.over = false;
      delete area.dataset.grabbing;
      kick.current();
    };
    const onLeave = () => { if (!pointer.down) { pointer.over = false; pointer.nearCorner = false; area.dataset.cursor = ""; kick.current(); } };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      control.current.manual = !(control.current.manual ?? control.current.inView);
      kick.current();
    };

    area.addEventListener("pointerdown", onDown);
    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerup", onUp);
    area.addEventListener("pointercancel", onUp);
    area.addEventListener("pointerleave", onLeave);
    area.addEventListener("keydown", onKey);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      control.current.inView = entry.intersectionRatio >= .55;
      if (!control.current.inView) control.current.manual = null; // leaving resets a manual open or close
      kick.current();
    }, { threshold: [0, .55] });
    observer.observe(element);
    render();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      area.removeEventListener("pointerdown", onDown);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerup", onUp);
      area.removeEventListener("pointercancel", onUp);
      area.removeEventListener("pointerleave", onLeave);
      area.removeEventListener("keydown", onKey);
    };
  }, []);

  const choose = (next: boolean) => { if (next !== mobile) request.current(next, next ? 1 : -1); };
  // Keep the loop in step if the owner changes the tab directly.
  useEffect(() => { if (control.current.want !== mobile) request.current(mobile, mobile ? 1 : -1); }, [mobile]);

  return <div ref={root} className="process-sticker" data-format={shown ? "mobile" : "web"}>
    <div className="process-sticker-tabs" role="group" aria-label="Example format">
      <button type="button" aria-pressed={!mobile} onClick={() => choose(false)}><MonitorIcon size={15} aria-hidden />Web</button>
      <button type="button" aria-pressed={mobile} onClick={() => choose(true)}><DeviceMobileIcon size={15} aria-hidden />Mobile</button>
    </div>
    <button ref={scene} type="button" className="process-sticker-scene" aria-label="Show or hide the layers of the process">
      <div className="process-sticker-drop">
        <div ref={holder} className="process-sticker-hold">
          <div ref={stack} className="process-sticker-stack" style={{ "--pose": 0 } as CSSProperties}>
            {stages.map((stage, i) => <div key={stage.name} className="process-sticker-layer" style={{ "--i": i } as CSSProperties}>
              {/* Each step is one layer of a die-cut sticker, after the reference: gloss film, clear adhesive, the
                  print (the only layer with artwork), white vinyl and the backing liner. */}
              <div className="process-sticker-face" data-material={materials[i]}>{materials[i] === "print" && <StageArtifact stage={3} mobile={shown} />}</div>
              {i === 0 && <span className="process-sticker-flap" aria-hidden />}
              <i className="process-sticker-anchor" aria-hidden />
            </div>)}
          </div>
        </div>
      </div>
      <div className="process-sticker-labels" aria-hidden>
        {stages.map((stage, i) => <span key={stage.name} className="process-sticker-label">
          <span><span><span className="process-sticker-number">{String(i + 1).padStart(2, "0")}</span> <strong>{stage.name}</strong></span><small>{stage.detail}</small></span>
          <i />
        </span>)}
      </div>
    </button>
    {/* The steps as text, for screen readers and anyone who never opens the stack. */}
    <ol className="sr-only">{stages.map(stage => <li key={stage.name}>{stage.name}: {stage.detail}. {stage.output}</li>)}</ol>
  </div>;
}

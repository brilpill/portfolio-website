"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural ASCII seedling behind the hero (Figma 1008:5639). The plant is geometry — a bezier
 * stem and four leaf shapes on a rounded mound — rasterised every frame into a glyph grid, so each
 * leaf moves on its own. Strokes (stem, midribs, veins) pick a glyph from their direction; fills
 * pick one from density. The leaves open above and beside the heading; the text sits in the clear
 * space between them and the mound, which holds the social links.
 *
 * Motion: a gentle breeze. Sonar: a click or tap sends a ring that lights up a field of glyph bands
 * across the background and makes the leaves flutter as it passes; nothing pulses on its own. Pointer: leaves lean away and flutter with the cursor's speed, glyphs part around
 * it, moving over the soil lifts dust, and a click or tap sends a ping, with the site's UI sound
 * when Sound is on in the profile menu. Touch screens have no cursor, so
 * a gust of wind sweeps through the crown every few seconds instead.
 *
 * With `plant={false}` (the playground board) only the field is drawn: no plant, soil, dust or gusts. A click on
 * empty space or a card that does not drag the board sends the sonar ring; at rest the board stays clear.
 */

type LeafShape = { at: number; angle: number; length: number; width: number; arch: number; droop: number; delay: number };
type Leaf = LeafShape & { phi: number; omega: number };
type Dust = { x: number; y: number; vx: number; vy: number; life: number; glyph: number };
type Ripple = { x: number; y: number; start: number };

const FILL = " .,:;-=+*#";
const STROKE = "-\\|/";
const SPECKS = ".,'`";
const CHARS = FILL.slice(1) + STROKE + SPECKS;
const LEVELS = 10;
const FILL_INDEX = [...FILL.slice(1)].map((char) => CHARS.indexOf(char));
const STROKE_INDEX = [...STROKE].map((char) => CHARS.indexOf(char));
const SPECK_INDEX = [...SPECKS].map((char) => CHARS.indexOf(char));
const PING_SPEED = 170; // px/s
const PING_WIDTH = 28;
const PING_LIFE = 5.5; // s
const GUST_LENGTH = 1.9; // s for a gust to cross the screen on touch devices

// Angles are in plant space (y up, radians). Lengths and widths are fractions of the plant scale.
const LEAVES: LeafShape[] = [
  { at: .74, angle: 3.04, length: .6, width: .12, arch: .1, droop: .2, delay: .32 },
  { at: .79, angle: .3, length: .56, width: .1, arch: .2, droop: .04, delay: .4 },
  { at: .9, angle: 2.35, length: .14, width: .2, arch: .05, droop: .05, delay: .55 },
  { at: 1, angle: 1.63, length: .1, width: .18, arch: .03, droop: 0, delay: .65 },
];
// The mound: a dome under the stem and a half-ellipse underneath, in plant units.
const SOIL = { peak: .03, peakWidth: .22, range: .035, bottom: -.24, side: .56, fade: .25 };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const hash = (x: number, y: number) => {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const top = hash(ix, iy) + (hash(ix + 1, iy) - hash(ix, iy)) * sx;
  const bottom = hash(ix, iy + 1) + (hash(ix + 1, iy + 1) - hash(ix, iy + 1)) * sx;
  return top + (bottom - top) * sy;
}
/** Canvas-space angle (y down) to one of - \ | / */
const strokeGlyph = (dx: number, dy: number) => {
  const angle = ((Math.atan2(dy, dx) % Math.PI) + Math.PI) % Math.PI;
  return STROKE_INDEX[Math.round(angle / (Math.PI / 4)) % 4];
};

export function HeroSeedling({ active, plant = true }: { active: boolean; plant?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef({ active });
  useEffect(() => { state.current = { active }; }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const hero = (canvas.closest(plant ? ".home-slide" : ".playground-board") ?? canvas.parentElement!) as HTMLElement;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const touchOnly = matchMedia("(hover: none)");
    const ink = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#004bfe";
    const font = getComputedStyle(canvas).fontFamily;

    let grown = false;
    try { grown = sessionStorage.getItem("hero-seedling-grown") === "1"; } catch { /* storage can be unavailable */ }

    const leaves: Leaf[] = LEAVES.map((shape) => ({ ...shape, phi: 0, omega: 0 }));
    const stem = { bend: 0, velocity: 0 };
    const cursor = { x: -9999, y: -9999, sx: -9999, sy: -9999, vx: 0, inside: false, presence: 0, lastMove: 0 };
    const gust = { active: false, start: 0, direction: -1, y: 0, next: 2.5 };
    const dust: Dust[] = [];
    const ripples: Ripple[] = [];
    let width = 0, height = 0, ratio = 1, cell = 7, cols = 0, rows = 0;
    let atlas: HTMLCanvasElement | null = null, atlasCell = 0;
    let text = { cx: 0, cy: 0, rx: 1, ry: 1 };
    let time = 0, growth = grown ? 1 : 0, last = 0, frame = 0, disposed = false, slowFrames = 0, frameBudget = 1000 / 60;

    function buildAtlas() {
      atlasCell = Math.ceil(cell * ratio);
      atlas = document.createElement("canvas");
      atlas.width = atlasCell * CHARS.length;
      atlas.height = atlasCell * LEVELS;
      const paint = atlas.getContext("2d")!;
      paint.font = `${Math.round(cell * 1.15 * ratio)}px ${font}`;
      paint.textAlign = "center";
      paint.textBaseline = "middle";
      paint.fillStyle = ink;
      for (let level = 0; level < LEVELS; level++) {
        paint.globalAlpha = .1 + .72 * Math.pow((level + 1) / LEVELS, 1.1);
        for (let c = 0; c < CHARS.length; c++) paint.fillText(CHARS[c], c * atlasCell + atlasCell / 2, level * atlasCell + atlasCell / 2);
      }
    }

    function resize() {
      if (!canvas || !context) return;
      width = canvas.clientWidth; height = canvas.clientHeight;
      if (!width || !height) return;
      ratio = Math.min(devicePixelRatio || 1, 2);
      cell = width < 600 ? 6 : 7;
      cols = Math.ceil(width / cell); rows = Math.ceil(height / cell);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(1, 0, 0, 1, 0, 0);
      measureText();
      buildAtlas();
      draw();
    }

    // The plant is almost hidden behind the heading and buttons, so the text sits on clear ground.
    function measureText() {
      const intro = plant ? hero.querySelector(".home-introduction") : null;
      if (!intro || !canvas) return;
      const box = intro.getBoundingClientRect(), frameBox = canvas.getBoundingClientRect();
      text = { cx: box.left + box.width / 2 - frameBox.left, cy: box.top + box.height / 2 - frameBox.top, rx: box.width * .62, ry: box.height * .78 };
    }

    function layout() {
      const scale = Math.min(height * .84, width * 1.05);
      // On narrow screens the stem stretches so the crown opens above the heading and the mound
      // reaches the links at the bottom; leaf size still follows the width.
      const narrow = width < 768;
      const baseX = width * (narrow ? .5 : .48), baseY = height * (narrow ? .76 : .79);
      const stemLength = narrow ? baseY - height * .13 : scale * .7;
      const soilBottom = narrow ? -(height * .97 - baseY) / scale : SOIL.bottom;
      return { scale, baseX, baseY, stemLength, soilBottom };
    }

    // Touch screens: with no cursor, a gust sweeps across the crown every few seconds, alternating
    // direction. It drives the same cursor state, so leaves flutter and glyphs part as it passes.
    function blow(stemLength: number, baseY: number) {
      if (!plant || !touchOnly.matches || performance.now() - cursor.lastMove < 3000) { gust.active = false; return; }
      if (!gust.active) {
        if (time < gust.next || growth < 1) return;
        const crown = baseY - stemLength * .8;
        Object.assign(gust, { active: true, start: time, direction: -gust.direction, y: crown + (Math.random() - .5) * stemLength * .2 });
      }
      const t = (time - gust.start) / GUST_LENGTH;
      if (t >= 1) { gust.active = false; gust.next = time + 4 + Math.random() * 2.5; cursor.inside = false; return; }
      const span = width + 160, x = gust.direction > 0 ? -80 + span * t : width + 80 - span * t;
      if (!cursor.inside) { cursor.sx = x; cursor.sy = gust.y; }
      cursor.x = x; cursor.y = gust.y + Math.sin(t * Math.PI * 2) * 18;
      cursor.vx = gust.direction * span / GUST_LENGTH;
      cursor.inside = true;
    }

    function simulate(delta: number) {
      const { scale, baseX, baseY, stemLength } = layout();
      blow(stemLength, baseY);
      // The cursor itself eases toward the pointer so the glyphs never snap.
      cursor.sx += (cursor.x - cursor.sx) * Math.min(1, delta * 14);
      cursor.sy += (cursor.y - cursor.sy) * Math.min(1, delta * 14);
      cursor.presence += ((cursor.inside ? 1 : 0) - cursor.presence) * Math.min(1, delta * 4);
      if (!gust.active) cursor.vx *= Math.pow(.02, delta);

      const near = (x: number, y: number, radius: number) => cursor.inside ? Math.exp(-((cursor.sx - x) ** 2 + (cursor.sy - y) ** 2) / (radius * radius)) : 0;
      const lean = clamp((cursor.sx - baseX) / (scale * .9), -1, 1) * near(baseX, baseY - stemLength * .65, scale * .8);
      const breeze = Math.sin(time * .55) * .5 + Math.sin(time * 1.37 + 1) * .25;

      // Underdamped springs (ζ ≈ 0.4): leaves overshoot a little and settle, like a real leaf.
      const stemTarget = breeze * .012 - lean * .05;
      stem.velocity += (-26 * (stem.bend - stemTarget) - 4 * stem.velocity) * delta;
      stem.bend += stem.velocity * delta;
      leaves.forEach((leaf, i) => {
        const side = Math.cos(leaf.angle) >= 0 ? 1 : -1;
        const tipX = baseX + Math.cos(leaf.angle) * leaf.length * scale * .6;
        const tipY = baseY - stemLength * leaf.at - scale * Math.sin(leaf.angle) * leaf.length * .6;
        const proximity = near(tipX, tipY, scale * .35);
        const wind = Math.sin(time * .9 + i * 1.3) * .035 + Math.sin(time * 2.1 + i * .7) * .015;
        const target = wind + side * breeze * .02 - lean * .14 * (side > 0 ? 1 : .8);
        leaf.omega += clamp(-cursor.vx * .00045 * proximity, -.25, .25) * (1 + i * .15);
        for (const ripple of ripples) {
          const age = time - ripple.start, d = Math.hypot(tipX - ripple.x, tipY - ripple.y);
          const ring = Math.exp(-(((d - age * PING_SPEED) / PING_WIDTH) ** 2)) * (1 - age / PING_LIFE);
          leaf.omega += ring * delta * 2.2 * (i % 2 ? 1 : -1);
        }
        leaf.omega += (-30 * (leaf.phi - target) - 4.4 * leaf.omega) * delta;
        leaf.phi += leaf.omega * delta;
      });

      // Moving across the soil lifts a little dust that falls back.
      const soilTop = baseY - scale * .07;
      if (plant && cursor.inside && !gust.active && Math.abs(cursor.vx) > 120 && cursor.sy > soilTop - 24 && cursor.sy < baseY + scale * .15 && dust.length < 140) {
        const count = Math.min(4, Math.floor(Math.abs(cursor.vx) / 260) + 1);
        for (let k = 0; k < count; k++) dust.push({ x: cursor.sx + (Math.random() - .5) * 30, y: cursor.sy + (Math.random() - .5) * 10, vx: cursor.vx * .18 + (Math.random() - .5) * 50, vy: -50 - Math.random() * 90, life: 1, glyph: SPECK_INDEX[Math.floor(Math.random() * SPECK_INDEX.length)] });
      }
      for (let k = dust.length - 1; k >= 0; k--) {
        const speck = dust[k];
        speck.vy += 240 * delta; speck.x += speck.vx * delta; speck.y += speck.vy * delta; speck.life -= delta / 1.3;
        if (speck.life <= 0) dust.splice(k, 1);
      }
      while (ripples.length && time - ripples[0].start > PING_LIFE) ripples.shift();
    }

    function draw() {
      if (!context || !atlas || !width) return;
      const still = motion.matches;
      const { scale, baseX, baseY, stemLength, soilBottom } = layout();
      context.clearRect(0, 0, canvas!.width, canvas!.height);

      // Stem: a quadratic bezier sampled into short segments.
      const stemGrow = easeOut(growth / .55);
      const topX = baseX + scale * (.015 + stem.bend), topY = baseY - stemLength;
      const ctrlX = baseX + scale * (-.035 + stem.bend * .45), ctrlY = baseY - stemLength * .46;
      const points: [number, number][] = [];
      for (let k = 0; k <= 14; k++) {
        const t = k / 14 * stemGrow, a = (1 - t) ** 2, b = 2 * (1 - t) * t, c = t * t;
        points.push([a * baseX + b * ctrlX + c * topX, a * baseY + b * ctrlY + c * topY]);
      }
      const pointAt = (t: number) => {
        const a = (1 - t) ** 2, b = 2 * (1 - t) * t, c = t * t;
        return [a * baseX + b * ctrlX + c * topX, a * baseY + b * ctrlY + c * topY];
      };

      // Leaves in canvas space: attach point, axis, "up" normal and a bounding box to skip empty cells.
      const shapes = leaves.map((leaf) => {
        const grow = still ? 1 : easeOut((growth - leaf.delay) / .3);
        const angle = leaf.angle + leaf.phi;
        const [ax, ay] = pointAt(leaf.at * stemGrow);
        const ex = Math.cos(angle), ey = -Math.sin(angle);
        const flip = Math.cos(leaf.angle) >= 0 ? -1 : 1;
        const ux = -ey * flip, uy = ex * flip;
        const length = leaf.length * scale * grow;
        const reach = length * 1.05;
        return { ...leaf, ax, ay, ex, ey, ux, uy, length, minX: ax - reach, maxX: ax + reach, minY: ay - reach, maxY: ay + reach };
      }).filter((leaf) => leaf.length > 2);

      let stemMinX = Infinity, stemMaxX = -Infinity, stemMinY = Infinity;
      for (const [x, y] of points) { stemMinX = Math.min(stemMinX, x); stemMaxX = Math.max(stemMaxX, x); stemMinY = Math.min(stemMinY, y); }
      const stemPad = scale * .03;
      const soilAlpha = still ? 1 : clamp(growth * 4);
      const cursorOn = !still && cursor.presence > .01;
      const radius = 120, bucket = Math.floor(time * 10);

      for (let row = 0; row < rows; row++) {
        const y = (row + .5) * cell;
        for (let col = 0; col < cols; col++) {
          const x = (col + .5) * cell;
          const seed = hash(col, row);
          let density = 0, glyph = -1;

          // Soil: dome on top, half-ellipse underneath; glyphs thin out toward the rim so the outline reads round.
          const px = (x - baseX) / scale, py = (baseY - y) / scale;
          if (plant && py < .09 && py > soilBottom && Math.abs(px) < SOIL.side) {
            const nx = px / SOIL.side;
            const top = SOIL.peak * Math.exp(-((px / SOIL.peakWidth) ** 2)) + SOIL.range * (1 - nx * nx);
            const under = soilBottom * Math.sqrt(Math.max(0, 1 - nx * nx));
            if (py <= top && py >= under) {
              const rim = nx * nx + (py < 0 ? (py / soilBottom) ** 2 : 0);
              const coverage = (.8 - .62 * rim - Math.max(0, -py) * SOIL.fade) * (.55 + .6 * noise(px * 14, py * 14));
              if (seed < coverage) {
                density = (.22 + .42 * (1 - Math.min(1, rim)) + (seed - .5) * .2) * soilAlpha;
                if (seed > coverage * .8) glyph = SPECK_INDEX[Math.floor(seed * 97) % SPECK_INDEX.length];
              }
            }
          }

          // Stem: distance to the sampled curve; the stroke glyph follows the curve's direction.
          if (plant && x > stemMinX - stemPad && x < stemMaxX + stemPad && y > stemMinY - stemPad && y < baseY + stemPad) {
            for (let k = 0; k < points.length - 1; k++) {
              const [x1, y1] = points[k], [x2, y2] = points[k + 1];
              const dx = x2 - x1, dy = y2 - y1, lengthSq = dx * dx + dy * dy || 1;
              const t = clamp(((x - x1) * dx + (y - y1) * dy) / lengthSq);
              const distance = Math.hypot(x - (x1 + dx * t), y - (y1 + dy * t));
              const along = (k + t) / 14;
              const thickness = scale * (.012 * (1 - .55 * along) + .0035) + cell * .35;
              // Only the core column is a stroke glyph; the rest of the width is fill, so the stem reads as one line.
              if (distance < thickness) { density = Math.max(density, .72 - distance / thickness * .3); glyph = distance < cell * .55 ? strokeGlyph(dx, dy) : -1; break; }
            }
          }

          // Leaves: a lens shape around an arched midrib, with slanted secondary veins.
          for (const leaf of plant ? shapes : []) {
            if (x < leaf.minX || x > leaf.maxX || y < leaf.minY || y > leaf.maxY) continue;
            const dx = x - leaf.ax, dy = y - leaf.ay;
            const u = (dx * leaf.ex + dy * leaf.ey) / leaf.length;
            if (u <= .02 || u >= 1) continue;
            const v = (dx * leaf.ux + dy * leaf.uy) / leaf.length;
            const centre = leaf.arch * 4 * u * (1 - u) - leaf.droop * u * u;
            const half = leaf.width * Math.pow(Math.sin(Math.PI * u), .72) * (1 - .3 * u);
            const r = (v - centre) / half;
            if (Math.abs(r) >= 1) continue;
            const slope = leaf.arch * 4 * (1 - 2 * u) - 2 * leaf.droop * u;
            // About one cell wide at any leaf size.
            const midrib = u < .94 ? Math.exp(-((r / Math.max(.07, cell * .7 / (half * leaf.length))) ** 2)) : 0;
            const veinPhase = (u * 7 - Math.abs(r) * .85 + 10) % 1;
            const vein = u > .12 && u < .9 && Math.abs(r) < .86 && Math.abs(r) > .12 && veinPhase < .14 ? 1 : 0;
            const edge = smooth(.72, 1, Math.abs(r));
            const light = .1 * r * Math.sign(leaf.ux || 1);
            const shade = .34 + .3 * edge + .45 * midrib + .2 * vein + light + (seed - .5) * .14;
            if (shade < density) continue;
            // Dither the leaf body so it reads as airy dots, not a solid block; strokes always stay.
            if (midrib < .55 && !vein && edge < .5 && seed > .35 + shade * .9) continue;
            density = shade;
            if (midrib > .55) glyph = strokeGlyph(leaf.ex + leaf.ux * slope, leaf.ey + leaf.uy * slope);
            else if (vein) { const out = Math.sign(r); glyph = strokeGlyph(leaf.ex * .7 + leaf.ux * out, leaf.ey * .7 + leaf.uy * out); }
            else glyph = -1;
          }
          let ping = 0, wave = 0;
          for (const ripple of ripples) {
            const age = time - ripple.start, d = Math.hypot(x - ripple.x, y - ripple.y), fade = 1 - age / PING_LIFE;
            ping = Math.max(ping, Math.exp(-(((d - age * PING_SPEED) / PING_WIDTH) ** 2)) * fade);
            // The field gets a wider band than the plant, so the sonar reads as a sweep, not a hairline.
            wave = Math.max(wave, Math.exp(-(((d - age * PING_SPEED) / (PING_WIDTH * 2.2)) ** 2)) * fade);
          }
          if (density > 0) density += ping * .35;
          else {
            // Sonar field: slow glyph bands that only exist inside a click's ring, a step quieter than the plant.
            if (wave < .03) continue;
            const field = .5 + .25 * Math.sin(x * .009 + time * .13 + Math.sin(y * .014)) + .25 * Math.cos(y * .011 - time * .09);
            const strength = Math.max(0, field - .38) * wave * 2.2;
            if (seed > strength * 1.6) continue;
            density = Math.min(.34, .08 + strength * .45);
            glyph = FILL_INDEX[Math.min(FILL_INDEX.length - 1, Math.floor((strength * 1.6 + hash(row, col) * .3) * FILL_INDEX.length))];
          }

          let ox = 0, oy = 0;
          if (cursorOn) {
            const cx = x - cursor.sx, cy = y - cursor.sy, d = Math.hypot(cx, cy);
            if (d > .001 && d < radius) {
              const falloff = (1 - d / (radius * 1.4)) ** 2 * cursor.presence;
              const push = (1 - d / radius) ** 2 * 15 * cursor.presence;
              ox = cx / d * push; oy = cy / d * push;
              density += falloff * .18;
              // Glyphs near the pointer flicker through neighbouring characters.
              if (hash(col + bucket * 7, row) < falloff * .55) glyph = FILL_INDEX[Math.floor(clamp(density) * (FILL_INDEX.length - 1) * (.7 + hash(col, row + bucket) * .6)) % FILL_INDEX.length];
            }
          }
          if (plant) {
            const m = ((x - text.cx) / text.rx) ** 2 + ((y - text.cy) / text.ry) ** 2;
            density *= .14 + .86 * smooth(.75, 1.2, m);
          }
          if (density < .04) continue;

          const level = Math.min(LEVELS - 1, Math.floor(clamp(density) * LEVELS));
          if (glyph < 0) glyph = FILL_INDEX[Math.min(FILL_INDEX.length - 1, Math.floor(clamp(density) * FILL_INDEX.length))];
          context.drawImage(atlas, glyph * atlasCell, level * atlasCell, atlasCell, atlasCell, Math.round((x + ox) * ratio - atlasCell / 2), Math.round((y + oy) * ratio - atlasCell / 2), atlasCell, atlasCell);
        }
      }

      for (const speck of dust) {
        const level = Math.min(LEVELS - 1, Math.floor(speck.life * 6));
        context.drawImage(atlas, speck.glyph * atlasCell, level * atlasCell, atlasCell, atlasCell, Math.round(speck.x * ratio - atlasCell / 2), Math.round(speck.y * ratio - atlasCell / 2), atlasCell, atlasCell);
      }
      canvas!.dataset.ready = "true";
    }

    function tick(now: number) {
      if (disposed) return;
      frame = requestAnimationFrame(tick);
      if (now - last < frameBudget - 1) return;
      const delta = Math.min((now - last) / 1000, .05);
      last = now;
      const running = state.current.active && !document.hidden && !motion.matches;
      canvas!.dataset.running = String(running);
      if (!running) return;
      time += delta;
      if (growth < 1) {
        growth = Math.min(1, growth + delta / 1.8);
        if (growth === 1) { try { sessionStorage.setItem("hero-seedling-grown", "1"); } catch { /* ignore */ } }
      }
      const started = performance.now();
      simulate(delta);
      draw();
      // Fall back to 30fps on slower machines instead of dropping frames unevenly.
      const cost = performance.now() - started;
      canvas!.dataset.cost = cost.toFixed(1);
      slowFrames = cost > 9 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 20) frameBudget = 1000 / 30;
    }

    function pointer(event: PointerEvent) {
      if (!canvas) return;
      gust.active = false;
      const box = canvas.getBoundingClientRect();
      const x = event.clientX - box.left, y = event.clientY - box.top;
      const now = performance.now();
      if (cursor.inside && cursor.lastMove) {
        const dt = Math.max(8, now - cursor.lastMove) / 1000;
        cursor.vx = cursor.vx * .6 + clamp((x - cursor.x) / dt, -3000, 3000) * .4;
      } else { cursor.sx = x; cursor.sy = y; }
      cursor.x = x; cursor.y = y; cursor.inside = true; cursor.lastMove = now;
    }
    function leave() { cursor.inside = false; if (!touchOnly.matches) cursor.lastMove = 0; }
    // Controls never ping, except the hero's Sound and Ask AI, which send the ring from where they are pressed
    // (on phones they sit in the top bar, outside the hero, so they are caught on the document). On the
    // playground a click on a card pings too (it still opens the card).
    const quiet = plant ? "a,button,select,label,input" : "a,button:not(.playground-card),select,label,input";
    const loud = ":is(.portfolio-home-controls-hero, .portfolio-home-controls-topbar) button";
    function ping(event: PointerEvent, force = false) {
      if (motion.matches || !state.current.active || (!force && (event.target as HTMLElement).closest(quiet))) return;
      pointer(event);
      ripples.push({ x: cursor.x, y: cursor.y, start: time });
      if (ripples.length > 6) ripples.shift();
      // Click audio is handled by the shared shell so its waveform always stays in sync.
    }
    // The hero pings on press. The playground board drags, so it pings only on a release that barely moved.
    const down = { x: 0, y: 0 };
    function press(event: PointerEvent) {
      if (plant) ping(event);
      else { down.x = event.clientX; down.y = event.clientY; }
    }
    function control(event: PointerEvent) {
      if (plant && event.target instanceof Element && event.target.closest(loud)) ping(event, true);
    }
    function release(event: PointerEvent) {
      if (!plant && Math.hypot(event.clientX - down.x, event.clientY - down.y) < 6) ping(event);
    }
    function motionChange() { leave(); if (motion.matches) { leaves.forEach((leaf) => { leaf.phi = leaf.omega = 0; }); stem.bend = stem.velocity = 0; } draw(); }

    if (motion.matches) growth = 1;
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    hero.addEventListener("pointermove", pointer, { passive: true });
    hero.addEventListener("pointerleave", leave);
    hero.addEventListener("pointerdown", press);
    hero.addEventListener("pointerup", release);
    document.addEventListener("pointerdown", control, true);
    motion.addEventListener("change", motionChange);
    void document.fonts.ready.then(() => { if (!disposed) resize(); });
    resize();
    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      hero.removeEventListener("pointermove", pointer);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("pointerdown", press);
      hero.removeEventListener("pointerup", release);
      document.removeEventListener("pointerdown", control, true);
      motion.removeEventListener("change", motionChange);
    };
  }, [plant]);

  return <>
    <div className="home-ascii" aria-hidden="true"><canvas ref={ref} /></div>
  </>;
}

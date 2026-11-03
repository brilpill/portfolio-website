"use client";

import { useEffect, useRef } from "react";

/* After kirill.si's home background (React Bits' PixelBlast, square variant, his settings), on raw WebGL2:
 * an ordered-dither field of 4px squares that drifts only along the left and right sides, and a dithered ripple
 * that rolls out from every click. The dot colour is the canvas's CSS `color`. */

const PIXEL = 4;
const SCALE = 2;
const DENSITY = 0.6;
const SPEED = 0.5;
const SIDE_FADE = [0.55, 0.85] as const;
const RIPPLE = { speed: 0.4, thickness: 0.12, intensity: 1.5, strength: 1, falloff: 4 };
const MAX_CLICKS = 16;
const MAX_FPS = 30;
const INTERACTIVE = "a, button, input, textarea, select, label, summary, [role='button'], [contenteditable='true'], [data-cursor], [tabindex]:not([tabindex='-1']), .v5-ask";

/** Starts a ripple at a viewport point from code (e.g. when a question is sent), with its own strength and falloff. */
const RIPPLE_EVENT = "v5-ripple";
export const rippleAt = (x: number, y: number, { strength = RIPPLE.strength, falloff = RIPPLE.falloff } = {}) =>
  window.dispatchEvent(new CustomEvent(RIPPLE_EVENT, { detail: { x, y, strength, falloff } }));

const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform vec2 uSideFade;
uniform vec2 uClickPos[${MAX_CLICKS}];
uniform float uClickTimes[${MAX_CLICKS}];
uniform float uClickStrength[${MAX_CLICKS}];
uniform float uClickFalloff[${MAX_CLICKS}];
out vec4 fragColor;

float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

float hash11(float n) { return fract(sin(n) * 43758.5453); }
float vnoise(vec3 p) {
  vec3 ip = floor(p), fp = fract(p);
  float n000 = hash11(dot(ip, vec3(1.0, 57.0, 113.0)));
  float n100 = hash11(dot(ip + vec3(1.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n010 = hash11(dot(ip + vec3(0.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n110 = hash11(dot(ip + vec3(1.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n001 = hash11(dot(ip + vec3(0.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n101 = hash11(dot(ip + vec3(1.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n011 = hash11(dot(ip + vec3(0.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n111 = hash11(dot(ip + vec3(1.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
  float y0 = mix(mix(n000, n100, w.x), mix(n010, n110, w.x), w.y);
  float y1 = mix(mix(n001, n101, w.x), mix(n011, n111, w.x), w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}
float fbm2(vec2 uv, float t) {
  vec3 p = vec3(uv * ${SCALE.toFixed(1)}, t);
  float sum = 1.0, freq = 1.0;
  for (int i = 0; i < 5; ++i) { sum += vnoise(p * freq); freq *= 1.25; }
  return sum * 0.5 + 0.5;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspect = uResolution.x / uResolution.y;
  float cell = 8.0 * uPixelSize;
  vec2 uv = floor(fragCoord / cell) * cell / uResolution * vec2(aspect, 1.0);

  float feed = fbm2(uv, uTime * 0.05) * 0.5 - 0.65 + (${DENSITY.toFixed(2)} - 0.5) * 0.3;
  // The drifting pattern lives only at the sides; ripples below still cross the middle.
  float nx = abs(gl_FragCoord.x - uResolution.x * 0.5) / (uResolution.x * 0.5);
  feed = mix(-1.0, feed, smoothstep(uSideFade.x, uSideFade.y, nx));

  for (int i = 0; i < ${MAX_CLICKS}; ++i) {
    vec2 pos = uClickPos[i];
    if (pos.x < 0.0) continue;
    vec2 cuv = ((pos - uResolution * .5 - cell * .5) / uResolution) * vec2(aspect, 1.0);
    float t = max(uTime - uClickTimes[i], 0.0);
    float r = distance(uv, cuv);
    float ring = exp(-pow((r - ${RIPPLE.speed.toFixed(2)} * t) / ${RIPPLE.thickness.toFixed(2)}, 2.0));
    float atten = exp(-0.7 * t) * exp(-uClickFalloff[i] * r) * uClickStrength[i];
    feed = max(feed, ring * atten * ${RIPPLE.intensity.toFixed(1)});
  }

  float bw = step(0.5, feed + Bayer8(fragCoord / uPixelSize) - 0.5);
  fragColor = vec4(uColor * bw, bw);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
  return shader;
}

/** Parses the computed CSS colour (rgb() or color(srgb …)) into 0–1 channels. */
function rgbOf(element: Element): [number, number, number] {
  const parts = getComputedStyle(element).color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  const srgb = getComputedStyle(element).color.startsWith("color(");
  const [r, g, b] = srgb ? parts : parts.map(value => value / 255);
  return [r, g, b];
}

export function V5Dither() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = host.current;
    if (!box) return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%;image-rendering:pixelated";
    // preserveDrawingBuffer lets the theme reveal copy the frame into its old-theme layer (theme-wipe.ts).
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: true });
    if (!gl) return;
    box.appendChild(canvas);

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
    } catch { canvas.remove(); return; }
    gl.useProgram(program);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const at = (name: string) => gl.getUniformLocation(program, name);
    const u = { color: at("uColor"), resolution: at("uResolution"), time: at("uTime"), pixel: at("uPixelSize"), side: at("uSideFade"), clickPos: at("uClickPos"), clickTimes: at("uClickTimes"), clickStrength: at("uClickStrength"), clickFalloff: at("uClickFalloff") };
    const clickPos = new Float32Array(MAX_CLICKS * 2).fill(-1);
    const clickTimes = new Float32Array(MAX_CLICKS);
    const clickStrength = new Float32Array(MAX_CLICKS).fill(RIPPLE.strength);
    const clickFalloff = new Float32Array(MAX_CLICKS).fill(RIPPLE.falloff);
    let clickIx = 0;
    gl.uniform1f(u.pixel, PIXEL);
    gl.uniform2f(u.side, SIDE_FADE[0], SIDE_FADE[1]);

    // Canvas pixels match CSS pixels (no DPR upscaling), so a 4px square is 4 screen points, as on kirill.si.
    const resize = () => {
      canvas.width = Math.max(1, box.clientWidth);
      canvas.height = Math.max(1, box.clientHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
    };
    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(box);

    const offset = Math.random() * 1000;
    const start = performance.now();
    const now = () => offset + (performance.now() - start) / 1000 * SPEED;

    // Any press inside the first screen starts a ripple there; presses below it scroll past.
    const ripple = (x: number, y: number, strength = RIPPLE.strength, falloff = RIPPLE.falloff) => {
      const rect = canvas.getBoundingClientRect();
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
      clickPos[clickIx * 2] = (x - rect.left) * canvas.width / rect.width;
      clickPos[clickIx * 2 + 1] = (rect.height - (y - rect.top)) * canvas.height / rect.height;
      clickTimes[clickIx] = now();
      clickStrength[clickIx] = strength;
      clickFalloff[clickIx] = falloff;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    };
    // Only a press on the bare background ripples; fields, links, buttons and other controls keep their own feedback.
    const press = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest?.(INTERACTIVE)) return;
      ripple(event.clientX, event.clientY);
    };
    const asked = (event: Event) => { const { x, y, strength, falloff } = (event as CustomEvent).detail; ripple(x, y, strength, falloff); };
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener(RIPPLE_EVENT, asked);

    let visible = true;
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    seen.observe(box);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0, last = 0, drawn = 0;
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden || !visible || (still && drawn > 0) || time - last < 1000 / MAX_FPS) return;
      last = time; drawn++;
      // Read every frame so the theme switch recolours the dots at once.
      gl.uniform3fv(u.color, rgbOf(box));
      gl.uniform1f(u.time, now());
      gl.uniform2fv(u.clickPos, clickPos);
      gl.uniform1fv(u.clickTimes, clickTimes);
      gl.uniform1fv(u.clickStrength, clickStrength);
      gl.uniform1fv(u.clickFalloff, clickFalloff);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener(RIPPLE_EVENT, asked);
      resizer.disconnect();
      seen.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return <div ref={host} className="v5-dither" aria-hidden />;
}

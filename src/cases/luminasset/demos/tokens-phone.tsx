"use client";

import { useState, type CSSProperties } from "react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { geist } from "../font";
import { color, laVars, radius, space, type } from "../tokens";
import { Button } from "../components/button";
import "./tokens-phone.css";

/**
 * The LuminAsset tokens (tokens.ts) as a screen of the app itself, in a phone: tabs switch Colour / Type / Shape,
 * tapping a swatch copies its hex and shows the system's toast. (The table view is variables.tsx.)
 */
type Swatch = { name: string; hex: string };
const pretty = (name: string) => name.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join(" ");
const swatches = (group: keyof typeof color, prefix: string): Swatch[] => Object.entries(color[group]).map(([name, hex]) => ({ name: `${prefix}/${pretty(name)}`, hex }));
const base = swatches("base", "Base"), accent = swatches("accent", "Accent"), system = swatches("system", "System");

/** Light or dark text on a colour: by luminance, and dark on mostly see-through colours (they sit on a checkerboard). */
function ink(hex: string) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const alpha = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
  return alpha < .5 || .2126 * r + .7152 * g + .0722 * b > .6 ? "var(--la-base-100)" : "#fff";
}

/** Copies a hex and remembers which, for a moment, so the swatch can say "Copied". */
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (hex: string) => {
    try { await navigator.clipboard.writeText(hex); setCopied(hex); window.setTimeout(() => setCopied(current => current === hex ? null : current), 1400); } catch {}
  };
  return [copied, copy] as const;
}
const fill = (hex: string) => ({ "--swatch": hex, color: ink(hex) }) as CSSProperties;

/** `value` is the section, set by the block's tabs: colour, type or shape. */
export function TokensPhone({ value }: { value: string | number; onValueChange?: (value: string | number) => void }) {
  const [copied, copy] = useCopy();
  const section = String(value);
  return <div className={`la-tokens la-phone ${geist.variable}`} style={laVars}>
    <div className="la-phone-scroll" key={section}>
      <p className="la-phone-eyebrow">LuminAsset design system</p>
      <h3 className="la-phone-title">{{ colour: "Colour", type: "Type", shape: "Shape" }[section]}</h3>
      {section === "colour" && [["Base", base.filter(swatch => swatch.name !== "Base/900")], ["Accent", accent], ["System", system]].map(([title, list]) => <section key={title as string}>
        <h4>{title as string}</h4>
        <div className="la-phone-swatches">
          {(list as Swatch[]).map(swatch => <button key={swatch.name} type="button" onClick={() => copy(swatch.hex)} aria-label={`${swatch.name}, ${swatch.hex}. Copy`}>
            <i className="la-swatch-fill" style={fill(swatch.hex)} />
            <b>{swatch.name.split("/")[1]}</b><span>{swatch.hex.slice(0, 7).toUpperCase()}</span>
          </button>)}
        </div>
      </section>)}
      {section === "type" && <div className="la-phone-type">
        {Object.entries(type).map(([name, style]) => <div key={name}>
          <span style={{ fontSize: `calc(${style.size} * var(--u))`, lineHeight: `calc(${style.line} * var(--u))`, fontWeight: style.weight, letterSpacing: style.tracking }}>Your solar is live</span>
          <em>{style.label} · {style.size}/{style.line}</em>
        </div>)}
      </div>}
      {section === "shape" && <div className="la-phone-shape">
        <h4>Radius</h4>
        <div className="la-phone-radii">{Object.entries(radius).map(([name, size]) => <span key={name}><i style={{ borderRadius: `calc(${Math.min(size, 28)} * var(--u))` }} />{size === 9999 ? "full" : size}</span>)}</div>
        <h4>Spacing</h4>
        <div className="la-phone-space">{Object.entries(space).filter(([, size]) => size >= 4 && size % 4 === 0).map(([name, size]) => <span key={name}><i style={{ width: `calc(${size * 4} * var(--u))` }} />{size}</span>)}</div>
        <h4>In use</h4>
        <div className="la-phone-buttons"><Button variant="blue">Get Started</Button><Button variant="white">Continue</Button></div>
      </div>}
    </div>
    {copied && <span className="la-phone-toast" role="status"><CheckCircleIcon weight="fill" />Copied {copied.slice(0, 7).toUpperCase()}</span>}
  </div>;
}

"use client";

import type { CSSProperties } from "react";
import { BatteryFullIcon, CaretLeftIcon, CellSignalFullIcon, LeafIcon, LightningIcon, QuestionIcon, SolarPanelIcon, TagIcon, WifiHighIcon } from "@phosphor-icons/react";
import { geist } from "../font";
import { Ruler } from "../components/ruler";
import { laVars } from "../tokens";
import "./system-size-slider.css";

/**
 * The estimate without Solar API data (the fallback), rebuilt to try: drag the ruler (or use the arrow keys) and
 * panels fill the roof grid from the middle out, while size, output, cost and savings follow. Every measure is in screen
 * points (--u = 1/393 of the width), so it scales with the phone it sits in. Colours and type are the design
 * tokens (tokens.ts) in Geist. Figures are sample estimates.
 */
export const MAX_PANELS = 80;
const KW_PER_PANEL = 0.2578;
const KWH_PER_KW = 2474; // a year, for a south-facing UK roof
const COST_PER_KW = 2113; // £, installed
const CO2_PER_KWH = 0.000207; // tonnes, UK grid average

/**
 * The roof without Solar API data (Figma 2.0, "50% Panels" 1264:39045): a 24 × 24 grid of dark 20pt cells with 1pt
 * gaps over a blurred amber glow, so the glow shows through as warm lines. The roof is the 120-cell octagon of
 * the "100% Panels" state; one panel per cell, filled from the middle out in a diamond, as in Figma.
 */
const ROOF: [number, number[]][] = [[6, [9, 14]], [7, [8, 15]], [8, [7, 16]], [9, [6, 17]], [10, [6, 17]], [11, [6, 17]], [12, [6, 17]], [13, [6, 17]], [14, [6, 17]], [15, [7, 16]], [16, [8, 15]], [17, [9, 14]]];
const roof = ROOF.flatMap(([row, [from, to]]) => Array.from({ length: to - from + 1 }, (_, i) => ({ row, column: from + i })));
const fillOrder = roof
  .map((cell, index) => ({ index, distance: Math.abs(cell.column + .5 - 12) + Math.abs(cell.row + .5 - 11.9) }))
  .sort((a, b) => a.distance - b.distance || roof[a.index].row - roof[b.index].row)
  .map(({ index }, rank) => ({ index, rank }));
const rankOf = new Map(fillOrder.map(({ index, rank }) => [index, rank]));

const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const whole = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function Ring({ progress, children }: { progress: number; children: React.ReactNode }) {
  return <span className="lumin-size-ring">
    <svg viewBox="0 0 40 40" aria-hidden><circle cx="20" cy="20" r="18" pathLength={1} style={{ strokeDashoffset: 1 - progress }} /></svg>
    {children}
  </span>;
}

/** Size, output, cost and CO₂ for a number of panels; the estimate sheet shares it. */
export function estimateFor(panels: number) {
  const kw = panels * KW_PER_PANEL, kwh = kw * KWH_PER_KW;
  return { kw, kwh, cost: kw * COST_PER_KW, co2: kwh * CO2_PER_KWH };
}

export function SystemSizeSlider({ value, onValueChange }: { value: number; onValueChange: (panels: number) => void }) {
  const kw = value * KW_PER_PANEL;
  const kwh = kw * KWH_PER_KW;

  return <div className={`lumin-size ${geist.variable}`} style={laVars} aria-label="Solar estimate">
    <div className="lumin-size-status" aria-hidden><span>9:41</span><span><CellSignalFullIcon weight="fill" /><WifiHighIcon weight="bold" /><BatteryFullIcon weight="fill" /></span></div>
    <div className="lumin-size-top" aria-hidden>
      <span className="lumin-size-round"><CaretLeftIcon weight="bold" /></span>
      <span className="lumin-size-address"><i>!</i>10 Downing Street, London</span>
      <span className="lumin-size-round"><QuestionIcon weight="bold" /></span>
    </div>

    {/* The illustration fills the top 412pt behind the status bar and buttons; the space holds its place. */}
    <div className="lumin-size-art" aria-hidden>
      <span className="lumin-size-glow" />
      <span className="lumin-size-grid" />
      {roof.map((cell, index) => rankOf.get(index)! < value && <span key={index} className="lumin-size-panel" style={{ "--column": cell.column, "--row": cell.row } as CSSProperties} />)}
    </div>
    <div className="lumin-size-space" />
    <span className="lumin-size-grabber" aria-hidden />

    <p className="lumin-size-label">System size</p>
    <p className="lumin-size-kw" aria-live="polite">{kw.toFixed(1)} kW</p>

    <div className="lumin-size-cards">
      <div><Ring progress={value / MAX_PANELS}><SolarPanelIcon /></Ring><strong>System size</strong><span>{value}/{MAX_PANELS} panels</span></div>
      <div><Ring progress={Math.min(1, kwh / 40000)}><LightningIcon weight="fill" /></Ring><strong>Energy output</strong><span>{whole.format(kwh)} kWh a year</span></div>
    </div>
    <dl className="lumin-size-rows">
      <div><dt><TagIcon weight="fill" />Est. cost</dt><dd>{pounds.format(kw * COST_PER_KW)}</dd></div>
      <div><dt><LeafIcon weight="fill" />CO₂ savings</dt><dd>{(kwh * CO2_PER_KWH).toFixed(1)} t a year</dd></div>
    </dl>

    <Ruler value={value} max={MAX_PANELS} onChange={onValueChange} label="Number of panels" valueText={`${value} panels, ${kw.toFixed(1)} kilowatts`} />

    <button type="button" className="lumin-size-cta"><LightningIcon weight="fill" />Energize</button>
    <span className="lumin-size-home" aria-hidden />
  </div>;
}

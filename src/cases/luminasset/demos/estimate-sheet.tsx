"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { BatteryFullIcon, CaretLeftIcon, CellSignalFullIcon, HouseLineIcon, InfoIcon, LeafIcon, LightningIcon, MapPinIcon, PentagonIcon, QuestionIcon, SolarPanelIcon, SunIcon, TagIcon, WifiHighIcon } from "@phosphor-icons/react";
import { geist } from "../font";
import { laVars } from "../tokens";
import { Ruler } from "../components/ruler";
import { OpenedScreen } from "../components/opened-screen";
import { MAX_PANELS, estimateFor } from "./system-size-slider";
import "./estimate-sheet.css";

/**
 * The estimate screen with its bottom sheet (Figma 937:33522 and its Sheet Down / Sheet Up / Full states): the
 * aerial roof photo behind, a sheet with three resting points (down, middle, up) that snaps to the nearest when
 * let go. At the top its content scrolls; scrolling up past the top pulls it back down. Info icons open tooltips,
 * the two "Enter details manually" buttons open their screen one level deep, and the ruler and Energize stay
 * pinned. Figures and the cost breakdown are neutral samples, worked out from the size. `value` is the resting
 * point, set by the block's tabs.
 */
type Stop = "down" | "middle" | "up";
const stops: Record<Stop, number> = { down: 652, middle: 368, up: 112 }; // the sheet's top, in screen points
const order: Stop[] = ["down", "middle", "up"];
const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const whole = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const breakdown: [string, number][] = [["Panels & inverter", .5], ["Installation", .4], ["Scaffolding & access", .05], ["Survey", .015], ["Grid connection", .02], ["Planning", .015]];
const tips = {
  co2: ["CO₂ savings", "The CO₂ the grid would emit to make the same electricity, at the UK average."],
  sun: ["Sunshine", "Hours of usable sun a year on this roof, from the Google Solar API."],
  roof: ["Roof area", "The part of the roof that can take panels, measured from the aerial photo."],
} as const;

export function EstimateSheet({ value, onValueChange }: { value: string | number; onValueChange: (value: string | number) => void }) {
  const stop: Stop = order.includes(value as Stop) ? value as Stop : "middle";
  const [panels, setPanels] = useState(32);
  const [drag, setDrag] = useState<{ start: number; from: number; at: number } | null>(null);
  const [tip, setTip] = useState<keyof typeof tips | null>(null);
  const [opened, setOpened] = useState<"roof" | "address" | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const { kw, kwh, cost, co2 } = estimateFor(panels);
  const top = drag ? drag.at : stops[stop];
  const points = () => (root.current?.offsetWidth ?? 393) / 393;

  // Back at the middle or bottom, the content returns to its top.
  useEffect(() => { if (stop !== "up") content.current?.scrollTo({ top: 0 }); }, [stop]);
  // The wheel moves the sheet like a swipe: down a step opens it further, up at the top of the content lowers it.
  useEffect(() => {
    const sheet = root.current?.querySelector<HTMLElement>(".la-sheet");
    if (!sheet) return;
    let last = 0;
    const wheel = (event: WheelEvent) => {
      if (sheet.closest("[data-scroll-lock]")) return; // not far enough on screen yet: the page scrolls
      const atTop = (content.current?.scrollTop ?? 0) <= 0;
      const now = performance.now();
      if (stop === "up" && !(atTop && event.deltaY < 0)) return; // let the content scroll
      event.preventDefault();
      if (now - last < 450 || Math.abs(event.deltaY) < 8) return;
      last = now;
      const index = order.indexOf(stop) + (event.deltaY > 0 ? 1 : -1);
      if (order[index]) onValueChange(order[index]);
    };
    sheet.addEventListener("wheel", wheel, { passive: false });
    return () => sheet.removeEventListener("wheel", wheel);
  }, [stop, onValueChange]);

  const release = () => {
    if (!drag) return;
    const nearest = order.reduce((best, item) => Math.abs(stops[item] - drag.at) < Math.abs(stops[best] - drag.at) ? item : best, stop);
    setDrag(null);
    onValueChange(nearest);
  };

  return <div ref={root} className={`la-sheet-screen ${geist.variable}`} style={{ ...laVars, "--top": top } as CSSProperties} onClick={() => setTip(null)}>
    <div className="la-sheet-photo"><Image src="/cases/luminasset/estimate-aerial.png" alt="Aerial photo of the roof with 32 panels drawn on it" fill sizes="340px" /></div>
    <div className="la-sheet-status" aria-hidden><span>9:41</span><span><CellSignalFullIcon weight="fill" /><WifiHighIcon weight="bold" /><BatteryFullIcon weight="fill" /></span></div>
    <div className="la-sheet-top" aria-hidden>
      <span className="la-sheet-round"><CaretLeftIcon weight="bold" /></span>
      <span className="la-sheet-address"><i>!</i>10 Downing Street, London</span>
      <span className="la-sheet-round"><QuestionIcon weight="bold" /></span>
    </div>

    <section className="la-sheet" data-stop={stop} data-dragging={drag ? "" : undefined} aria-label="Estimate">
      <div className="la-sheet-handle" role="slider" tabIndex={0} aria-label="Sheet position" aria-valuetext={stop} aria-valuemin={0} aria-valuemax={2} aria-valuenow={order.indexOf(stop)}
        onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setDrag({ start: event.clientY, from: stops[stop], at: stops[stop] }); }}
        onPointerMove={event => { if (drag) setDrag({ ...drag, at: Math.max(stops.up - 20, Math.min(stops.down + 20, drag.from + (event.clientY - drag.start) / points())) }); }}
        onPointerUp={release} onPointerCancel={release}
        onKeyDown={event => {
          const step = { ArrowUp: 1, ArrowDown: -1 }[event.key];
          if (!step) return;
          event.preventDefault();
          const next = order[order.indexOf(stop) + step];
          if (next) onValueChange(next);
        }}><span /></div>

      <div ref={content} className="la-sheet-content">
        <p className="la-sheet-label">System size</p>
        <p className="la-sheet-kw">{kw.toFixed(1)} kW</p>
        <div className="la-sheet-cards">
          <div><span className="la-sheet-ring" style={{ "--p": panels / MAX_PANELS } as CSSProperties}><SolarPanelIcon /></span><strong>System size</strong><span>{panels}/{MAX_PANELS} panels</span></div>
          <div><span className="la-sheet-ring" style={{ "--p": Math.min(1, kwh / 40000) } as CSSProperties}><LightningIcon weight="fill" /></span><strong>Energy output</strong><span>{whole.format(kwh)} kWh</span></div>
        </div>
        <dl className="la-sheet-rows">
          <div><dt><TagIcon weight="fill" />Est. cost</dt><dd>{pounds.format(cost)}</dd></div>
          <div><dt><LeafIcon weight="fill" />CO₂ savings<button type="button" aria-label="About CO₂ savings" onClick={event => { event.stopPropagation(); setTip("co2"); }}><InfoIcon weight="fill" /></button></dt><dd>{co2.toFixed(1)} t a year</dd></div>
          <div><dt><SunIcon weight="fill" />Sunshine<button type="button" aria-label="About sunshine" onClick={event => { event.stopPropagation(); setTip("sun"); }}><InfoIcon weight="fill" /></button></dt><dd>968 hours/year</dd></div>
          <div><dt><PentagonIcon weight="fill" />Roof area<button type="button" aria-label="About roof area" onClick={event => { event.stopPropagation(); setTip("roof"); }}><InfoIcon weight="fill" /></button></dt><dd>86 m²</dd></div>
        </dl>
        <h4 className="la-sheet-heading">Cost breakdown</h4>
        <dl className="la-sheet-table">
          {breakdown.map(([name, share]) => <div key={name}><dt>{name}</dt><dd>{pounds.format(Math.round(cost * share / 10) * 10)}</dd></div>)}
          <div className="la-sheet-total"><dt><TagIcon weight="fill" />Total</dt><dd>{pounds.format(cost)}</dd></div>
        </dl>
        <h4 className="la-sheet-heading">Not right roof details?</h4>
        <button type="button" className="la-sheet-ghost" onClick={() => setOpened("roof")}><HouseLineIcon />Enter details manually</button>
        <h4 className="la-sheet-heading">Not your address?</h4>
        <button type="button" className="la-sheet-ghost" onClick={() => setOpened("address")}><MapPinIcon weight="fill" />Enter details manually</button>
      </div>

      {tip && <div className="la-sheet-tip" role="tooltip" data-tip={tip}><b>{tips[tip][0]}</b>{tips[tip][1]}</div>}
    </section>

    {/* Pinned over the sheet at every resting point. */}
    <div className="la-sheet-actions">
      <Ruler value={panels} max={MAX_PANELS} onChange={setPanels} label="Number of panels" valueText={`${panels} panels, ${kw.toFixed(1)} kilowatts`} />
      <button type="button" className="la-sheet-cta"><LightningIcon weight="fill" />Energize</button>
      <span className="la-sheet-home" aria-hidden />
    </div>

    {opened === "roof" && <OpenedScreen src="/cases/luminasset/estimate-manual.png" alt="Manual roof details: the system drawn as blocks on a grid" onBack={() => setOpened(null)} />}
    {opened === "address" && <OpenedScreen src="/cases/luminasset/postcode.png" alt="Postcode entry, to pick another address" onBack={() => setOpened(null)} />}
  </div>;
}

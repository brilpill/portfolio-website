"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { BaseballCapIcon, CaretDownIcon, CheckCircleIcon, CoatHangerIcon, DotsSixVerticalIcon, DressIcon, HoodieIcon, ListBulletsIcon, MagnifyingGlassIcon, PantsIcon, ShoppingBagOpenIcon, SneakerIcon, TShirtIcon, XIcon } from "@phosphor-icons/react";
import { playCue } from "@/components/ui-sound";
import "./askflow.css";
import "./product-picker.css";

/**
 * AskFlow's product matching (Figma 11538:35405), rebuilt one level deep: the catalogue panel beside a question and
 * its Match products step. Search a small anonymised sample catalogue, expand a product's variants, tick products or
 * single variants, and see the selection on the step and in the summary. No store connection, prices or saving
 * anywhere; Done only confirms locally.
 */
type Product = { id: string; name: string; icon: ComponentType<{ weight?: "regular" | "fill" | "duotone" }>; tint: string; variants: string[] };
const sizes = ["S", "M", "L", "XL"];
const catalogue: Product[] = [
  { id: "cap", name: "Five-panel cap", icon: BaseballCapIcon, tint: "#e7efe4", variants: ["Olive", "Sand", "Black"] },
  { id: "pullover", name: "Knit pullover", icon: HoodieIcon, tint: "#efe9df", variants: sizes },
  { id: "cardigan", name: "Wool cardigan", icon: CoatHangerIcon, tint: "#ece8f3", variants: sizes },
  { id: "tee", name: "Graphic tee", icon: TShirtIcon, tint: "#e3e8ef", variants: sizes },
  { id: "chambray", name: "Chambray shirt", icon: TShirtIcon, tint: "#e2ecf6", variants: sizes },
  { id: "trousers", name: "Linen trousers", icon: PantsIcon, tint: "#f1ece4", variants: ["28", "30", "32", "34"] },
  { id: "dress", name: "Wrap dress", icon: DressIcon, tint: "#f5e6ea", variants: ["XS", "S", "M", "L"] },
  { id: "sneaker", name: "Canvas sneakers", icon: SneakerIcon, tint: "#e9eef0", variants: ["40", "41", "42", "43"] },
];

export function ProductPicker() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>("pullover");
  const [picked, setPicked] = useState<Record<string, string[]>>({ pullover: ["M", "L"] });
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setDone(false), 2000);
    return () => window.clearTimeout(timer);
  }, [done]);

  const shown = useMemo(() => catalogue.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const products = Object.keys(picked).filter(id => picked[id].length);
  const variants = products.reduce((sum, id) => sum + picked[id].length, 0);
  const all = (item: Product) => (picked[item.id]?.length ?? 0) === item.variants.length;
  const some = (item: Product) => (picked[item.id]?.length ?? 0) > 0 && !all(item);
  const toggleProduct = (item: Product) => setPicked(map => ({ ...map, [item.id]: all(item) ? [] : [...item.variants] }));
  const toggleVariant = (item: Product, variant: string) => setPicked(map => {
    const current = map[item.id] ?? [];
    return { ...map, [item.id]: current.includes(variant) ? current.filter(value => value !== variant) : [...current, variant] };
  });

  return <div className="af af-dots af-picker">
    <div className="af-picker-canvas" aria-hidden>
      <div className="af-card af-picker-question">
        <div className="af-card-head"><span className="af-icon"><ListBulletsIcon /></span>What size are you looking for?</div>
        {sizes.map(size => <div key={size} className="af-row"><DotsSixVerticalIcon weight="bold" />{size}<span className="af-port" /></div>)}
      </div>
      <svg className="af-picker-line"><path d="M0 34 C50 34 50 52 100 52" /></svg>
      <div className="af-picker-step" data-filled={products.length ? "" : undefined}>
        <ShoppingBagOpenIcon />
        <b>{products.length ? "Best products for you" : "Match products"}</b>
        {products.length > 0 && <span>{products.length} {products.length === 1 ? "product" : "products"} · {variants} {variants === 1 ? "variant" : "variants"}</span>}
      </div>
    </div>

    <aside className="af-picker-panel" aria-label="Match product or variant">
      <header>
        <h3>Match product or variant</h3>
        <p>{catalogue.length} sample items available for matching</p>
        <span className="af-picker-x" aria-hidden><XIcon /></span>
      </header>
      <label className="af-picker-search">
        <MagnifyingGlassIcon />
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products and variants" aria-label="Search products and variants" spellCheck={false} />
        {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><XIcon /></button>}
      </label>
      <ul className="af-picker-list">
        {shown.map(item => {
          const expanded = open === item.id;
          return <li key={item.id} data-open={expanded || undefined}>
            <div className="af-picker-row">
              <input type="checkbox" checked={all(item)} ref={box => { if (box) box.indeterminate = some(item); }} onChange={() => toggleProduct(item)} aria-label={`Select ${item.name}, all variants`} />
              <span className="af-picker-thumb" style={{ background: item.tint }}><item.icon weight="duotone" /></span>
              <span className="af-picker-name">{item.name}</span>
              <button type="button" className="af-picker-caret" aria-expanded={expanded} aria-label={`${expanded ? "Hide" : "Show"} variants of ${item.name}`} onClick={() => setOpen(expanded ? null : item.id)} data-sound={expanded ? "close" : "open"}>
                {item.variants.length} variants<CaretDownIcon weight="fill" />
              </button>
            </div>
            {expanded && <ul className="af-picker-variants">
              {item.variants.map(variant => <li key={variant}>
                <label><input type="checkbox" checked={picked[item.id]?.includes(variant) ?? false} onChange={() => toggleVariant(item, variant)} />{variant}</label>
              </li>)}
            </ul>}
          </li>;
        })}
        {!shown.length && <li className="af-picker-empty">No sample products match “{query.trim()}”</li>}
      </ul>
      <footer>
        <span aria-live="polite">{products.length ? `${products.length} selected · ${variants} ${variants === 1 ? "variant" : "variants"}` : "Nothing selected"}</span>
        <span>
          <button type="button" className="af-btn" data-quiet onClick={() => setPicked({})} disabled={!products.length} data-sound="erase">Clear</button>
          <button type="button" className="af-btn" onClick={() => { setDone(true); playCue("success"); }} data-sound="off">Done</button>
        </span>
      </footer>
    </aside>
    {done && <div className="af-toast" role="status"><CheckCircleIcon weight="fill" />Products matched to the question</div>}
  </div>;
}

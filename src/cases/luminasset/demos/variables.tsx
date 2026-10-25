"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ArrowsOutSimpleIcon, FunnelSimpleIcon, HashIcon, ListChecksIcon, MagnifyingGlassIcon, PaletteIcon, PlusIcon, SidebarSimpleIcon, SlidersHorizontalIcon, TextTIcon, XIcon } from "@phosphor-icons/react";
import { geist } from "../font";
import { color, radius, shadow, space, type } from "../tokens";
import "./variables.css";

/**
 * The LuminAsset tokens in Figma's Variables modal: Collections (Colour, Type, Spacing, Radius, Effects) and their
 * Groups in the sidebar, a Name / Default table beside them. Collections and groups work, and clicking a row
 * copies its value; the other controls (search, filter, expand, close, add) are there for the look only.
 */
type Row = { name: string; icon: "color" | "number" | "string"; value: string; label?: string; preview?: ReactNode };
type Group = { name: string; rows: Row[] };
const pretty = (name: string) => name.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join(" ");
const weightName = (weight: number) => weight === 600 ? "SemiBold" : weight === 500 ? "Medium" : "Regular";
const typeGroups: [string, (keyof typeof type)[]][] = [["Display", ["display"]], ["Heading", ["h1", "h2", "h3"]], ["Body", ["body-medium", "body-regular"]], ["Small", ["small-medium", "small-regular"]], ["Caption", ["caption-medium", "caption-regular"]]];

const collections: { name: string; groups: Group[] }[] = [
  {
    name: "Colour",
    groups: (["base", "accent", "system"] as const).map(group => ({ name: pretty(group), rows: Object.entries(color[group]).map(([name, hex]) => ({ name: pretty(name), icon: "color" as const, value: hex })) })),
  },
  {
    name: "Type",
    groups: typeGroups.map(([group, keys]) => ({
      name: group,
      rows: keys.map(key => {
        const style = type[key];
        return {
          name: style.label, icon: "string" as const, value: `Geist ${weightName(style.weight)} ${style.size}/${style.line}`,
          label: `Geist ${weightName(style.weight)} · ${style.size}/${style.line}`,
          preview: <span className="la-vars-aa" style={{ fontSize: Math.min(style.size, 18), fontWeight: style.weight }}>Ag</span>,
        };
      }),
    })),
  },
  { name: "Spacing", groups: [{ name: "Spacing", rows: Object.entries(space).map(([name, size]) => ({ name, icon: "number" as const, value: String(size) })) }] },
  { name: "Radius", groups: [{ name: "Radius", rows: Object.entries(radius).map(([name, size]) => ({ name, icon: "number" as const, value: String(size) })) }] },
  { name: "Effects", groups: [{ name: "Shadow", rows: Object.entries(shadow).map(([name, value]) => ({ name, icon: "string" as const, value, label: value.split("px,").length > 1 ? "Drop shadow, 2 layers" : "Drop shadow", preview: <i className="la-vars-shadow" style={{ boxShadow: value }} /> })) }] },
];
const count = (groups: Group[]) => groups.reduce((sum, group) => sum + group.rows.length, 0);
const icons = { color: PaletteIcon, number: HashIcon, string: TextTIcon };

function Value({ row }: { row: Row }) {
  if (row.icon === "color") {
    const alpha = row.value.length > 7 ? Math.round(parseInt(row.value.slice(7), 16) / 2.55) : 100;
    return <>
      <i className="la-vars-swatch" style={{ "--solid": row.value.slice(0, 7), "--alpha": row.value } as CSSProperties} data-alpha={alpha < 100 || undefined} />
      {row.value.slice(1, 7).toUpperCase()}{alpha < 100 && <span className="la-vars-dim">{alpha}%</span>}
    </>;
  }
  return <>{row.preview}{row.label ?? row.value}</>;
}

export function Variables() {
  const [collectionIndex, setCollectionIndex] = useState(0);
  const [group, setGroup] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const collection = collections[collectionIndex];
  const shown = collection.groups.filter(item => !group || item.name === group);
  const copy = async (key: string, value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(key); window.setTimeout(() => setCopied(current => current === key ? null : current), 1200); } catch {}
  };

  return <div className={`la-vars ${geist.variable}`}>
    <div className="la-vars-modal">
      <aside className="la-vars-side">
        <div className="la-vars-title">Variables<SidebarSimpleIcon className="la-vars-dim" aria-hidden /></div>
        <div className="la-vars-label">Collections<span aria-hidden><SlidersHorizontalIcon /><PlusIcon /></span></div>
        <div role="listbox" aria-label="Collections">
          {collections.map((item, index) => <button key={item.name} type="button" role="option" className="la-vars-collection" aria-selected={index === collectionIndex}
            onClick={() => { setCollectionIndex(index); setGroup(null); }}>{item.name}<span>{count(item.groups)}</span></button>)}
        </div>
        <div className="la-vars-label la-vars-label-groups">Groups<span aria-hidden><ListChecksIcon /></span></div>
        <div role="listbox" aria-label="Groups">
          <button type="button" role="option" className="la-vars-group" aria-selected={group === null} onClick={() => setGroup(null)}>All<span>{count(collection.groups)}</span></button>
          {collection.groups.length > 1 && collection.groups.map(item => <button key={item.name} type="button" role="option" className="la-vars-group la-vars-group-child" aria-selected={group === item.name} onClick={() => setGroup(item.name)}>
            {item.name}<span>{item.rows.length}</span>
          </button>)}
        </div>
      </aside>

      <div className="la-vars-main">
        <div className="la-vars-bar" aria-hidden>
          <span className="la-vars-search"><MagnifyingGlassIcon />Search<FunnelSimpleIcon className="la-vars-filter" /></span>
          <ArrowsOutSimpleIcon /><XIcon />
        </div>
        <div className="la-vars-table" role="table" aria-label={`${collection.name} variables`}>
          <div className="la-vars-row la-vars-head" role="row"><span role="columnheader">Name</span><span role="columnheader">Default</span><span /><span className="la-vars-add" aria-hidden><PlusIcon /></span></div>
          {shown.map(item => <div key={item.name} role="rowgroup">
            <div className="la-vars-section" role="row"><span role="cell">{item.name}</span></div>
            {item.rows.map(row => {
              const Icon = icons[row.icon];
              const key = `${item.name}/${row.name}`;
              return <button key={key} type="button" className="la-vars-row" role="row" onClick={() => copy(key, row.value)} aria-label={`${row.name}, ${row.label ?? row.value}. Copy`}>
                <span role="cell"><Icon className="la-vars-icon" />{row.name}</span>
                <span role="cell">{copied === key ? <span className="la-vars-copied">Copied</span> : <Value row={row} />}</span>
                <span /><span />
              </button>;
            })}
          </div>)}
        </div>
        <div className="la-vars-create" aria-hidden><PlusIcon />Create variable</div>
      </div>
    </div>
  </div>;
}

"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CaretDownIcon, CaretUpIcon, CheckCircleIcon, CheckIcon, CircleNotchIcon, CursorClickIcon, DotsSixVerticalIcon, EyeIcon, FlagIcon, ImageIcon, ListBulletsIcon, MagnifyingGlassIcon, MapTrifoldIcon, MinusIcon, PlusIcon, TextAaIcon, TextboxIcon, UserIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import { playCue } from "@/components/ui-sound";
import { inter } from "../font";
import "./kit.css";

/**
 * Pieces of the AskFlow UI kit (Figma file EJZsdGoGO1ZRgqWxXx0JnI), rebuilt to try in a grid of frames: button,
 * input, select, selection, question card and minimap. Values come from the kit's boards (Inter; primary #2563EB;
 * question surface #F9FAFB; answers #FFFFFF). Everything is local: no checks, saving or data leave the page, and the
 * sample content is neutral. Each demo follows its spec in docs/cases/askflow.md.
 */
function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`afk ${inter.variable} ${className}`}>{children}</div>;
}
function Switch({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) {
  return <label className="afk-switch"><input type="checkbox" checked={on} onChange={event => onChange(event.target.checked)} /><i aria-hidden />{label}</label>;
}
function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return <div className="afk-seg" role="radiogroup" aria-label={label}>
    {options.map(option => <button key={option} type="button" role="radio" aria-checked={option === value} onClick={() => onChange(option)}>{option}</button>)}
  </div>;
}

/* Button: the kit's six styles as tabs; size, destructive and disabled inside the frame. */
type ButtonStyle = "primary" | "secondary" | "ghost" | "toolbar" | "link" | "highlighted";
const destructiveStyles: ButtonStyle[] = ["primary", "secondary"];
export function KitButton({ value }: { value: string | number }) {
  const style = String(value) as ButtonStyle;
  const [size, setSize] = useState<"Xs" | "Sm" | "Md" | "Lg">("Md");
  const [destructive, setDestructive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => { setLoading(false); playCue("success"); }, 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);
  const canDestroy = destructiveStyles.includes(style);
  return <Surface className="afk-button-demo">
    <div className="afk-corner">
      <Segmented label="Size" options={["Xs", "Sm", "Md", "Lg"] as const} value={size} onChange={setSize} />
      {canDestroy && <Switch label="Destructive" on={destructive} onChange={setDestructive} />}
      <Switch label="Disabled" on={disabled} onChange={on => { setDisabled(on); setLoading(false); }} />
    </div>
    <button type="button" className="afk-btn" data-style={style} data-size={size} data-destructive={canDestroy && destructive ? "" : undefined} data-loading={loading ? "" : undefined}
      disabled={disabled} aria-busy={loading || undefined} onClick={() => { if (!loading) setLoading(true); }}>
      {loading ? <CircleNotchIcon className="afk-spin" weight="bold" aria-label="Loading" /> : "Button"}
    </button>
  </Surface>;
}

/* Input: one labelled field; Validate shows Error when empty and Success otherwise. */
export function KitInput() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [disabled, setDisabled] = useState(false);
  const [small, setSmall] = useState(false);
  const validate = () => { const ok = !!text.trim(); setStatus(ok ? "success" : "error"); playCue(ok ? "success" : "error"); };
  const help = status === "error" ? "Add a quiz name to continue" : status === "success" ? "Looks good (a demo check only)" : "";
  return <Surface className="afk-center">
    <div className="afk-field" data-status={status} data-size={small ? "small" : undefined}>
      <label htmlFor="afk-input">Quiz name</label>
      <div className="afk-box" data-disabled={disabled || undefined}>
        <MagnifyingGlassIcon aria-hidden />
        <input id="afk-input" value={text} disabled={disabled} placeholder="Find your perfect size" aria-describedby={help ? "afk-input-help" : undefined} aria-invalid={status === "error" || undefined}
          onChange={event => { setText(event.target.value); setStatus("idle"); }} onKeyDown={event => { if (event.key === "Enter") validate(); }} />
        <EyeIcon aria-hidden />
      </div>
      {/* Only the validation result shows under the field; no standing helper text. */}
      {help && <p id="afk-input-help" aria-live="polite">{status === "error" && <WarningCircleIcon weight="fill" />}{status === "success" && <CheckCircleIcon weight="fill" />}{help}</p>}
    </div>
    <div className="afk-row afk-dock">
      <button type="button" className="afk-btn" data-style="secondary" data-size="Sm" onClick={validate} disabled={disabled} data-sound="off">Validate</button>
      <Switch label="Small" on={small} onChange={setSmall} />
      <Switch label="Disabled" on={disabled} onChange={on => { setDisabled(on); setStatus("idle"); }} />
    </div>
  </Surface>;
}

/* Select: a trigger and one menu level, with the keyboard; Escape closes and returns focus. */
const types = [
  { label: "Single choice", icon: ListBulletsIcon }, { label: "Multiple choice", icon: CheckIcon }, { label: "Image choice", icon: ImageIcon },
  { label: "Form", icon: TextboxIcon }, { label: "Statement", icon: TextAaIcon },
];
export function KitSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setOpen(false); playCue("close"); } };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);
  const toggle = (next: boolean) => { if (next !== open) playCue(next ? "open" : "close"); setOpen(next); if (next) setActive(Math.max(0, types.findIndex(type => type.label === value))); };
  const choose = (label: string) => { setValue(label); toggle(false); trigger.current?.focus(); };
  const key = (event: KeyboardEvent) => {
    if (event.key === "Escape") { toggle(false); trigger.current?.focus(); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { toggle(true); return; }
      setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + types.length) % types.length);
    }
    if ((event.key === "Enter" || event.key === " ") && open) { event.preventDefault(); choose(types[active].label); }
  };
  const Current = types.find(type => type.label === value)?.icon ?? MagnifyingGlassIcon;
  return <Surface className="afk-center">
    <div className="afk-field" ref={root} onKeyDown={key}>
      <span className="afk-label" id="afk-select-label">Question type</span>
      <div className="afk-select">
        <button ref={trigger} type="button" className="afk-box afk-trigger" data-open={open || undefined} aria-haspopup="listbox" aria-expanded={open} aria-labelledby="afk-select-label"
          onClick={() => toggle(!open)} data-sound="off">
          <Current aria-hidden /><span data-placeholder={!value || undefined}>{value ?? "Choose a type"}</span>
          {open ? <CaretUpIcon weight="bold" aria-hidden /> : <CaretDownIcon weight="bold" aria-hidden />}
        </button>
        {value && !open && <button type="button" className="afk-clear" aria-label="Clear selection" onClick={() => { setValue(null); trigger.current?.focus(); }} data-sound="erase"><XIcon /></button>}
      </div>
      {open && <ul className="afk-menu" role="listbox" aria-labelledby="afk-select-label">
        {types.map((type, index) => <li key={type.label} role="option" aria-selected={type.label === value} data-active={index === active || undefined}
          onPointerEnter={() => setActive(index)} onClick={() => choose(type.label)} data-sound="off">
          <type.icon aria-hidden />{type.label}{type.label === value && <CheckIcon className="afk-tick" weight="bold" aria-hidden />}
        </li>)}
      </ul>}
    </div>
  </Surface>;
}

/* Selection: a parent checkbox over two products (unchecked, checked, mixed) and a disabled example. */
export function KitSelection() {
  const [picked, setPicked] = useState({ pullover: true, sneakers: false });
  const [small, setSmall] = useState(false);
  const count = Number(picked.pullover) + Number(picked.sneakers);
  const parent = useRef<HTMLInputElement>(null);
  useEffect(() => { if (parent.current) parent.current.indeterminate = count === 1; }, [count]);
  return <Surface className="afk-center">
    <fieldset className="afk-checks" data-size={small ? "sm" : undefined}>
      <legend className="afk-label">Products in this result</legend>
      <label><input ref={parent} type="checkbox" checked={count === 2} onChange={event => setPicked({ pullover: event.target.checked, sneakers: event.target.checked })} />All products</label>
      <div className="afk-checks-children">
        <label><input type="checkbox" checked={picked.pullover} onChange={event => setPicked({ ...picked, pullover: event.target.checked })} />Knit pullover</label>
        <label><input type="checkbox" checked={picked.sneakers} onChange={event => setPicked({ ...picked, sneakers: event.target.checked })} />Canvas sneakers</label>
        <label data-disabled><input type="checkbox" checked disabled />Wool cardigan (always included)</label>
      </div>
      <p aria-live="polite">{count === 2 ? "All selected" : count === 1 ? "Mixed: one of two selected" : "None selected"}</p>
    </fieldset>
    <div className="afk-row afk-dock"><Switch label="Small" on={small} onChange={setSmall} /></div>
  </Surface>;
}

/* Question card: one question with two answers; edit an answer inline; Insights adds bars. */
export function KitQuestionCard({ value }: { value: string | number }) {
  const insights = value === "insights";
  const [answers, setAnswers] = useState(["Casual", "Formal"]);
  const [editing, setEditing] = useState<number | null>(null);
  const shares = [64, 36]; // illustrative
  return <Surface className="afk-center afk-canvas">
    <div className="afk-question" data-insights={insights || undefined}>
      <span className="afk-question-flag" aria-hidden>{insights ? <><UserIcon />621</> : <FlagIcon />}</span>
      <div className="afk-question-head">
        <span className="afk-badge">1/12</span>
        {!insights && <span className="afk-badge" data-tone="warn">Step is not connected</span>}
        {insights && <span className="afk-badge" data-tone="grey">1m 4s</span>}
      </div>
      <div className="afk-question-title"><span className="afk-step-icon"><ListBulletsIcon /></span>Which style suits you?</div>
      <ul className="afk-answers">
        {answers.map((answer, index) => <li key={index}>
          {insights
            ? <div className="afk-answer afk-answer-insight"><span>{answer}</span><span>{Math.round(shares[index] * 3.06)} resp.</span><i style={{ width: `${shares[index]}%` }} /></div>
            : editing === index
              ? <input className="afk-answer afk-answer-edit" autoFocus defaultValue={answer} aria-label={`Answer ${index + 1}`}
                onBlur={event => { const next = event.target.value.trim(); setAnswers(list => list.map((item, i) => i === index ? next || item : item)); setEditing(null); }}
                onKeyDown={event => { if (event.key === "Enter" || event.key === "Escape") (event.target as HTMLInputElement).blur(); }} />
              : <button type="button" className="afk-answer" onClick={() => setEditing(index)} aria-label={`Edit answer ${index + 1}: ${answer}`}>
                <DotsSixVerticalIcon weight="bold" aria-hidden />{answer}
              </button>}
          {!insights && <span className="afk-port" aria-hidden />}
        </li>)}
      </ul>
    </div>
    {insights && <div className="afk-row"><span className="afk-note">Bars are illustrative, not merchant data</span></div>}
  </Surface>;
}

/* Minimap: a three-card map; the minimap opens and closes, and picking a mini card highlights its card. */
// Placed so the three cards sit centred across the tile, above the minimap in the corner.
const cards = [{ n: 1, title: "Which style suits you?", x: 80, y: 130 }, { n: 2, title: "Casual edit", x: 320, y: 90 }, { n: 3, title: "Formal edit", x: 320, y: 190 }];
export function KitMinimap() {
  const [open, setOpen] = useState(true);
  const [picked, setPicked] = useState<number | null>(null);
  return <Surface className="afk-canvas afk-map">
    <svg className="afk-map-lines" aria-hidden><path d="M250 152 C285 152 285 112 320 112" data-c="1" /><path d="M250 152 C285 152 285 212 320 212" data-c="2" /></svg>
    {cards.map(card => <div key={card.n} className="afk-map-card" data-picked={picked === card.n || undefined} style={{ left: card.x, top: card.y }}>
      <span className="afk-step-icon">{card.n === 1 ? <ListBulletsIcon /> : <CursorClickIcon />}</span>{card.n}. {card.title}
    </div>)}
    <div className="afk-mini-wrap">
      {open && <div className="afk-mini" role="group" aria-label="Minimap">
        <div className="afk-mini-map">
          <svg aria-hidden><path d="M62 30 C76 30 76 16 90 16" data-c="1" /><path d="M62 30 C76 30 76 46 90 46" data-c="2" /></svg>
          {cards.map(card => <button key={card.n} type="button" className="afk-mini-card" data-picked={picked === card.n || undefined} style={{ left: card.n === 1 ? 10 : 90, top: card.n === 1 ? 20 : card.n === 2 ? 6 : 36 }}
            aria-pressed={picked === card.n} aria-label={`Highlight card ${card.n}: ${card.title}`} onClick={() => setPicked(picked === card.n ? null : card.n)}>{card.n}.</button>)}
        </div>
        <div className="afk-mini-bar" aria-hidden><span><MinusIcon /></span><span><PlusIcon /></span></div>
      </div>}
      <button type="button" className="afk-mini-toggle" aria-expanded={open} aria-label={open ? "Close minimap" : "Open minimap"} onClick={() => setOpen(!open)} data-sound={open ? "close" : "open"}><MapTrifoldIcon weight={open ? "fill" : "regular"} /></button>
    </div>
  </Surface>;
}

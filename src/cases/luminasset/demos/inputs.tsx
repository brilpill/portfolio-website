"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { CaretDownIcon, CheckIcon, GpsFixIcon, MapPinIcon, SpinnerGapIcon, XCircleIcon } from "@phosphor-icons/react";
import { geist } from "../font";
import { laVars } from "../tokens";
import { playCue } from "@/components/ui-sound";
import "./inputs.css";

/**
 * The input components as their Figma frames (Components: Input 910:7668, OTP Input 931:20720, Select 937:45240,
 * Toggles 937:44485), in a grid at real size, all live with no tabs: each state (focus, filled, loading, error,
 * open, selected) comes from using it. Sample answers: a postcode such as SW1A 2AA (or the location row), the code 31AG9P.
 */
const CODE = "31AG9P";
const LOOKUP_MS = 900;
const orientations = ["North", "North-east", "East", "South-east", "South", "South-west", "West", "North-west"];
const storeys = ["1", "2", "3", "4+"];

export function Inputs() {
  return <div className={`la-inputs ${geist.variable}`} style={laVars}>
    <Frame name="Input"><PostcodeInput /></Frame>
    <Frame name="Select"><OrientationSelect /></Frame>
    <Frame name="OTP Input"><CodeInput /></Frame>
    <Frame name="Toggles"><StoreyToggles /></Frame>
  </div>;
}

/** One component on its own, for a frame of its own in a grid of frames (`kind: "components"`): the white card, centred. */
function Single({ children }: { children: React.ReactNode }) {
  return <div className={`la-inputs la-inputs-single ${geist.variable}`} style={laVars}><div className="la-inputs-card">{children}</div></div>;
}
export const PostcodeInputDemo = () => <Single><PostcodeInput /></Single>;
export const CodeInputDemo = () => <Single><CodeInput /></Single>;
export const SelectDemo = () => <Single><OrientationSelect /></Single>;
export const TogglesDemo = () => <Single><StoreyToggles /></Single>;

function Frame({ name, children }: { name: string; children: React.ReactNode }) {
  return <section className="la-inputs-frame" aria-label={name}><p className="la-inputs-name">{name}</p><div className="la-inputs-card">{children}</div></section>;
}

/** Waits a moment, then runs `done`: a sample lookup, so Loading shows. */
function useLookup() {
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (done: () => void) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(done, LOOKUP_MS); };
}

type Status = "idle" | "loading" | "found" | "error";

/**
 * Sample addresses for the postcode search (Figma 910:8565): typing a postcode lists the addresses it covers, with "Use
 * current location" on top. Real streets, sample data; the location finds SW1A 2AA.
 */
const addresses: [string, string][] = [
  ["SW1A 2AA", "10 Downing Street, London"], ["SW1A 2AB", "11 Downing Street, London"], ["SW1A 2AG", "12 Downing Street, London"],
  ["SW1A 2AS", "70 Whitehall, London"], ["SW1A 1AA", "Buckingham Palace, London"], ["SW1A 0AA", "Houses of Parliament, London"],
  ["EC1A 1BB", "1 Little Britain, London"], ["EC1A 1BE", "3 Little Britain, London"], ["EC1A 1BH", "5 Little Britain, London"],
  ["M1 1AE", "12 Oxford Road, Manchester"], ["M1 1AF", "14 Oxford Road, Manchester"], ["M1 1AG", "16 Oxford Road, Manchester"],
  ["B33 8TH", "21 Kitts Green Road, Birmingham"], ["B33 8TJ", "23 Kitts Green Road, Birmingham"],
  ["CR2 6XH", "4 Selsdon Road, Croydon"], ["CR2 6XJ", "6 Selsdon Road, Croydon"],
  ["LS1 4AP", "2 Park Row, Leeds"], ["LS1 4AQ", "4 Park Row, Leeds"],
];
const squash = (text: string) => text.replace(/\s+/g, "").toUpperCase();
const HERE = "SW1A 2AA";

function PostcodeInput() {
  const [text, setText] = useState("");
  const [focus, setFocus] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [chosen, setChosen] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const field = useRef<HTMLInputElement>(null);
  const lookup = useLookup();
  const query = squash(text);
  const results = query.length >= 2 ? addresses.filter(([code]) => squash(code).startsWith(query)).slice(0, 6) : [];
  const open = focus && !chosen && status !== "loading";
  const rows = open ? ["here", ...results.map(([code, line]) => `${line} ${code}`)] : [];
  const wasOpen = useRef(false);
  useEffect(() => { if (open !== wasOpen.current) { playCue(open ? "open" : "close"); wasOpen.current = open; } }, [open]);

  const choose = (row: string) => {
    if (row === "here") {
      setStatus("loading");
      lookup(() => { setText(HERE); setStatus("idle"); setActive(1); field.current?.focus(); });
      return;
    }
    setChosen(row);
    setText(row);
    setStatus("found");
    playCue("success");
    field.current?.blur();
  };
  const reset = () => { setText(""); setChosen(null); setStatus("idle"); setActive(0); field.current?.focus(); };
  const empty = query.length >= 5 && !results.length;
  const note = chosen ? "Address set: next, we find your roof" : status === "loading" ? "Finding your location…" : empty ? "No addresses for this postcode" : "Type a postcode, or use your location";

  return <div className="la-field" data-status={chosen ? "found" : empty ? "error" : "idle"}>
    <label className="la-field-label" htmlFor="la-postcode">Enter your postcode</label>
    {status === "loading"
      ? <div className="la-field-box" data-loading><SpinnerGapIcon className="la-field-spin" weight="bold" />Loading...</div>
      : <div className="la-field-box" data-focus={focus || undefined} onClick={() => field.current?.focus()}>
        <MapPinIcon className="la-field-icon" weight="fill" data-on={focus || !!text || undefined} />
        <input id="la-postcode" ref={field} value={text} placeholder="e.g. SW1A 2AA" autoComplete="off" spellCheck={false}
          role="combobox" aria-expanded={open} aria-controls="la-postcode-results" aria-autocomplete="list"
          aria-activedescendant={open ? `la-postcode-row-${active}` : undefined}
          onChange={event => { setText(event.target.value.toUpperCase()); setChosen(null); setStatus("idle"); setActive(0); }}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onKeyDown={event => {
            if (!open) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length); }
            if (event.key === "Enter") { event.preventDefault(); choose(rows[active]); }
            if (event.key === "Escape") event.currentTarget.blur();
          }}
          aria-invalid={empty || undefined} aria-describedby="la-postcode-note" />
        {text && <button type="button" className="la-field-clear" aria-label="Clear" onMouseDown={event => event.preventDefault()} onClick={reset}><XCircleIcon weight="fill" /></button>}
      </div>}
    {open && <ul className="la-menu la-results" id="la-postcode-results" role="listbox" aria-label="Addresses">
      {rows.map((row, index) => <li key={row} id={`la-postcode-row-${index}`} role="option" aria-selected={index === active} data-active={index === active || undefined}
        data-sound={row === "here" ? undefined : "off"} onMouseDown={event => event.preventDefault()} onPointerEnter={() => setActive(index)} onClick={() => choose(row)}>
        {row === "here" ? <span className="la-results-here"><GpsFixIcon weight="bold" />Use current location</span> : row}
      </li>)}
      {empty && <li className="la-results-empty" role="option" aria-selected={false} aria-disabled>No addresses found for {text.trim()}</li>}
    </ul>}
    <p className="la-field-note" id="la-postcode-note" aria-live="polite">{note}</p>
  </div>;
}

function CodeInput() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [focused, setFocused] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const latest = useRef(digits); // the code as typed so far, ahead of the render when keys come fast
  const lookup = useLookup();
  const update = (next: string[], move?: number) => {
    latest.current = next;
    setDigits(next);
    setStatus("idle");
    if (move !== undefined) boxes.current[Math.max(0, Math.min(5, move))]?.focus();
    if (next.every(Boolean)) {
      boxes.current.forEach(box => box?.blur());
      setStatus("loading");
      lookup(() => { const right = next.join("") === CODE; setStatus(right ? "found" : "error"); playCue(right ? "success" : "error"); });
    }
  };
  const type = (index: number, value: string) => {
    const chars = value.toUpperCase().replace(/[^A-Z0-9]/g, "").split("");
    if (!chars.length) return;
    const next = [...latest.current];
    chars.slice(0, 6 - index).forEach((char, i) => { next[index + i] = char; });
    update(next, index + chars.length);
  };
  const key = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault(); // handled here, so no input event: play the delete sound ourselves
      playCue("erase");
      const before = latest.current;
      const next = [...before];
      if (next[index]) next[index] = ""; else if (index > 0) next[index - 1] = "";
      update(next, before[index] ? index : index - 1);
    }
    if (event.key === "ArrowLeft") boxes.current[index - 1]?.focus();
    if (event.key === "ArrowRight") boxes.current[index + 1]?.focus();
  };
  const paste = (index: number, event: ClipboardEvent<HTMLInputElement>) => { event.preventDefault(); type(index, event.clipboardData.getData("text")); };
  const reset = () => { update(Array(6).fill(""), 0); };
  const note = { idle: <>We sent a code to your email. Try {CODE}</>, loading: "Checking…", found: "Email confirmed", error: <>Wrong code. <button type="button" onClick={reset}>Try again</button></> }[status];

  return <div className="la-field" data-status={status}>
    <span className="la-field-label" id="la-code-label">Enter code</span>
    {status === "loading"
      ? <div className="la-field-box" data-loading><SpinnerGapIcon className="la-field-spin" weight="bold" />Loading...</div>
      : <div className="la-code" role="group" aria-labelledby="la-code-label">
        {digits.map((digit, index) => <label key={index} className="la-code-box" data-focus={focused === index || undefined}>
          {!digit && focused !== index && <i aria-hidden />}
          <input ref={element => { boxes.current[index] = element; }} value={digit} inputMode="text" maxLength={1} autoComplete="one-time-code"
            aria-label={`Character ${index + 1}`} aria-invalid={status === "error" || undefined}
            onChange={event => type(index, event.target.value.slice(-1))} onKeyDown={event => key(index, event)} onPaste={event => paste(index, event)}
            onFocus={event => { setFocused(index); event.target.select(); }} onBlur={() => setFocused(null)} />
        </label>)}
      </div>}
    <p className="la-field-note" aria-live="polite">{note}</p>
  </div>;
}

function OrientationSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setOpen(false); playCue("close"); } };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const toggle = (next: boolean) => { if (next !== open) playCue(next ? "open" : "close"); setOpen(next); };
  const choose = (option: string) => { setValue(option); toggle(false); };
  const key = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") { toggle(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { toggle(true); setActive(Math.max(0, orientations.indexOf(value ?? ""))); return; }
      setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + orientations.length) % orientations.length);
    }
    if ((event.key === "Enter" || event.key === " ") && open) { event.preventDefault(); choose(orientations[active]); }
  };

  return <div className="la-field" ref={root}>
    <span className="la-field-label" id="la-roof-label">Roof orientation</span>
    <button type="button" className="la-field-box la-select" data-focus={open || undefined} aria-haspopup="listbox" aria-expanded={open} aria-labelledby="la-roof-label"
      data-sound="off" onClick={() => { toggle(!open); setActive(Math.max(0, orientations.indexOf(value ?? ""))); }} onKeyDown={key}>
      <span data-placeholder={!value || undefined}>{value ?? "Select orientation"}</span>
      <CaretDownIcon className="la-select-caret" weight="bold" data-open={open || undefined} />
    </button>
    {open && <ul className="la-menu" role="listbox" aria-labelledby="la-roof-label">
      {orientations.map((option, index) => <li key={option} role="option" data-sound="off" aria-selected={option === value} data-active={index === active || undefined}
        onPointerEnter={() => setActive(index)} onClick={() => choose(option)}>
        {option}{option === value && <CheckIcon weight="bold" />}
      </li>)}
    </ul>}
    <p className="la-field-note">Which way the main roof faces</p>
  </div>;
}

function StoreyToggles() {
  const [value, setValue] = useState("2");
  return <div className="la-field">
    <span className="la-field-label" id="la-storeys-label">Number of storeys</span>
    <div className="la-toggles" role="radiogroup" aria-labelledby="la-storeys-label">
      {storeys.map(option => <button key={option} type="button" role="radio" data-sound="toggle" aria-checked={option === value} onClick={() => setValue(option)}>{option}</button>)}
    </div>
    <p className="la-field-note">Taller homes need more scaffolding</p>
  </div>;
}

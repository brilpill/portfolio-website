"use client";

import { useState, type CSSProperties } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { playCue } from "@/components/ui-sound";
import "./askflow.css";
import "./answer-colour.css";

/**
 * AskFlow's answer colours (Figma 6513:151548, "Example of applying colour for answers"): one brand colour drives
 * every answer state. Each state's text, background, borders and fills are that colour at a set opacity, so picking a
 * colour re-tints the whole set. Pick a swatch or type a hex value; the question underneath is live to hover and pick.
 */
const swatches = [["Blue", "#0447be"], ["Green", "#0f7a4f"], ["Violet", "#6d28d9"], ["Coral", "#d9480f"], ["Teal", "#0e7490"], ["Ink", "#1f2937"]];
const states = ["Default", "Hover", "Active"] as const;
/** The tokens per state, as in the Figma board: [name, opacity of the brand colour]; 0 means white. */
const tokens: Record<(typeof states)[number], [string, number][]> = {
  Default: [["Answer text", 100], ["Answer background", 5], ["Answer border", 20], ["Radio border", 20], ["Radio fill", 0]],
  Hover: [["Answer text", 100], ["Answer background", 10], ["Answer border", 50], ["Radio border", 60], ["Radio fill", 0]],
  Active: [["Answer text", 100], ["Answer background", 10], ["Answer border", 80], ["Radio border", 100], ["Radio fill", 15], ["Check dot", 100]],
};
const options = ["No, all natural", "Yes, permanent all over", "Yes, pre-lightened"];
const hex = /^#?([0-9a-f]{6})$/i;

export function AnswerColour() {
  const [colour, setColour] = useState("#0447be");
  const [draft, setDraft] = useState("#0447be");
  const [focus, setFocus] = useState<(typeof states)[number]>("Active");
  const [picked, setPicked] = useState(0);
  const valid = hex.test(draft.trim());

  const choose = (value: string) => { setColour(value); setDraft(value); };
  const commit = () => {
    const match = draft.trim().match(hex);
    if (match) setColour(`#${match[1].toLowerCase()}`);
    else { playCue("error"); setDraft(colour); }
  };

  return <div className="af af-colour" style={{ "--c": colour } as CSSProperties}>
    <aside className="af-colour-panel">
      <h3>Answer colour</h3>
      <div className="af-colour-swatches" role="group" aria-label="Brand colour">
        {swatches.map(([name, value]) => <button key={value} type="button" aria-label={name} aria-pressed={colour === value} style={{ background: value }} onClick={() => choose(value)} data-sound="toggle">
          {colour === value && <CheckIcon weight="bold" />}
        </button>)}
      </div>
      <label className="af-colour-hex" data-invalid={!valid || undefined}>
        <span style={{ background: valid ? `#${draft.trim().replace("#", "")}` : colour }} aria-hidden />
        <input value={draft} onChange={event => { setDraft(event.target.value); const match = event.target.value.trim().match(hex); if (match) setColour(`#${match[1].toLowerCase()}`); }}
          onBlur={commit} onKeyDown={event => { if (event.key === "Enter") commit(); }} aria-label="Hex colour" spellCheck={false} maxLength={7} />
      </label>
      <div className="af-colour-tabs" role="tablist" aria-label="State">
        {states.map(state => <button key={state} type="button" role="tab" aria-selected={focus === state} onClick={() => setFocus(state)}>{state}</button>)}
      </div>
      <ul className="af-colour-tokens" aria-label={`${focus} state tokens`}>
        {tokens[focus].map(([name, amount]) => <li key={name}>
          <i style={{ background: amount ? `color-mix(in srgb, var(--c) ${amount}%, #fff)` : "#fff" }} />
          <span>{name}<small>{amount ? `${colour.toUpperCase()}${amount < 100 ? ` · ${amount}% opacity` : ""}` : "#FFFFFF"}</small></span>
        </li>)}
      </ul>
    </aside>

    <section className="af-colour-preview">
      <div className="af-colour-states">
        {states.map(state => <button key={state} type="button" className="af-colour-state" data-state={state.toLowerCase()} aria-pressed={focus === state} aria-label={`Show ${state.toLowerCase()} state tokens`} onClick={() => setFocus(state)}>
          <b>{state} state</b>
          <span className="af-answer" data-kind="radio"><i />No, all natural</span>
          <span className="af-answer" data-kind="check"><i>{state === "Active" && <CheckIcon weight="bold" />}</i>No, all natural</span>
        </button>)}
      </div>
      <div className="af-colour-live">
        <p>Is your hair colour treated in any way?</p>
        <div role="radiogroup" aria-label="Sample question">
          {options.map((option, i) => <label key={option} className="af-answer" data-kind="radio" data-live data-checked={picked === i || undefined}>
            <input type="radio" name="af-colour-question" checked={picked === i} onChange={() => setPicked(i)} />
            <i />{option}
          </label>)}
        </div>
      </div>
    </section>
  </div>;
}

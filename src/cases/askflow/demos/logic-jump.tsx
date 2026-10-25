"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowBendUpRightIcon, CalculatorIcon, CheckCircleIcon, DotsSixVerticalIcon, FlagIcon, GitForkIcon, InfoIcon, ListBulletsIcon, PlusIcon, ShuffleIcon, TrashIcon, XIcon } from "@phosphor-icons/react";
import { playCue } from "@/components/ui-sound";
import "./askflow.css";
import "./logic-jump.css";

/**
 * AskFlow's logic jump (Figma 21321:27011, rule dialog 21362:95783), rebuilt one level deep: a question card and a
 * logic jump card on the canvas. Drag from Answer one's dot to the logic jump card (or press Connect) to join them;
 * the rule dialog opens, and Save, Cancel or the cross come back to the two cards, with focus returned. No canvas
 * editor, generated quiz or publishing; the values are samples.
 */
const Q = { x: 200, y: 150 }, L = { x: 560, y: 158 }, W = 268;
const operators = ["is equal to", "is greater than", "is less than"];
const targets = ["Result step title", "Q2: What's your budget?"];

export function LogicJump() {
  const [linked, setLinked] = useState(false);
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(null);
  const [dialog, setDialog] = useState(false);
  const [rule, setRule] = useState({ field: "Score", operator: operators[0], value: "1", target: targets[0] });
  const [saved, setSaved] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const logic = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const first = useRef<HTMLSelectElement>(null);
  useEffect(() => { if (dialog) first.current?.focus(); }, [dialog]);
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(null), 2200);
    return () => window.clearTimeout(timer);
  }, [saved]);

  // Answer one's dot (its row sits under the 65px head) to the logic jump card's head.
  const start = { x: Q.x + W + 17, y: Q.y + 65 + 20 };
  const end = { x: L.x, y: L.y + 32 };
  const curve = (x2: number, y2: number) => { const mid = (start.x + x2) / 2; return `M${start.x} ${start.y} C${mid} ${start.y} ${mid} ${y2} ${x2} ${y2}`; };

  const connect = (from: HTMLElement | null) => {
    setLinked(true);
    playCue("success");
    opener.current = from;
    setDialog(true);
  };
  const close = (save: boolean) => {
    setDialog(false);
    if (save) { setSaved(`If ${rule.field.toLowerCase()} ${rule.operator} ${rule.value}, go to ${rule.target}`); playCue("success"); }
    else playCue("close");
    // Back to what opened the dialog, or to the rule itself when that button is gone (Connect, once linked).
    requestAnimationFrame(() => (opener.current?.isConnected ? opener.current : root.current?.querySelector<HTMLButtonElement>(".af-logic-rule"))?.focus());
  };
  const remove = () => { setDialog(false); setLinked(false); setSaved(null); playCue("erase"); requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>(".af-port")?.focus()); };

  const down = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (linked) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = root.current!.getBoundingClientRect();
    setDragging({ x: event.clientX - box.left, y: event.clientY - box.top });
  };
  const move = (event: ReactPointerEvent) => {
    if (!dragging) return;
    const box = root.current!.getBoundingClientRect();
    setDragging({ x: event.clientX - box.left, y: event.clientY - box.top });
  };
  const up = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    setDragging(null);
    const card = logic.current?.getBoundingClientRect();
    if (card && event.clientX >= card.left - 12 && event.clientX <= card.right && event.clientY >= card.top - 12 && event.clientY <= card.bottom + 12) connect(event.currentTarget);
  };

  return <div ref={root} className="af af-dots af-logic" onPointerMove={move}>
    <svg className="af-logic-lines" aria-hidden>
      {linked && <path d={curve(end.x, end.y)} />}
      {dragging && <path d={curve(dragging.x, dragging.y)} data-drag />}
    </svg>

    <span className="af-logic-flag" style={{ left: Q.x - 36, top: Q.y }} aria-hidden><FlagIcon weight="regular" /></span>
    <div className="af-card" style={{ left: Q.x, top: Q.y }}>
      <div className="af-card-head"><span className="af-icon"><ListBulletsIcon /></span>Q1: What do you need?</div>
      <div className="af-row"><DotsSixVerticalIcon weight="bold" />Answer one
        <button type="button" className="af-port" data-live={linked || dragging ? "" : undefined} aria-label="Drag from Answer one to the logic jump card"
          onPointerDown={down} onPointerUp={up} onPointerCancel={() => setDragging(null)} onKeyDown={event => { if ((event.key === "Enter" || event.key === " ") && !linked) { event.preventDefault(); connect(event.currentTarget); } }} />
      </div>
      <div className="af-row"><DotsSixVerticalIcon weight="bold" />Answer two<span className="af-port" aria-hidden /></div>
      <button type="button" className="af-add" tabIndex={-1} aria-hidden><PlusIcon weight="bold" />Add answer</button>
    </div>

    <div ref={logic} className="af-card" data-target={dragging ? "" : undefined} style={{ left: L.x, top: L.y }}>
      <div className="af-card-head"><span className="af-icon"><GitForkIcon /></span>Logic jump</div>
      <div className="af-row">
        <GitForkIcon />
        {linked
          ? <button type="button" className="af-logic-rule" onClick={event => { opener.current = event.currentTarget; setDialog(true); playCue("open"); }} data-sound="off">{saved ?? "Logic rule 1"}</button>
          : <span>Logic rule 1</span>}
        <span className="af-port" data-live="" aria-hidden />
        {!linked && <span className="af-chip af-logic-chip"><InfoIcon />Drag to set a rule</span>}
      </div>
      <div className="af-row"><ShuffleIcon />Otherwise, always go to<span className="af-port" aria-hidden /></div>
      <button type="button" className="af-add" tabIndex={-1} aria-hidden style={{ color: "var(--af-muted)" }}><PlusIcon weight="bold" />Add logic rule</button>
    </div>

    <div className="af-hint">
      {linked ? <span>Connected. Open the rule to change it.</span> : <><span>Drag from Answer one&apos;s dot to the logic jump</span><button type="button" className="af-btn" data-quiet onClick={event => connect(event.currentTarget)}>Connect</button></>}
    </div>
    {saved && !dialog && <div className="af-toast" role="status"><CheckCircleIcon weight="fill" />Rule saved</div>}

    {dialog && <div className="af-logic-scrim" onClick={event => { if (event.target === event.currentTarget) close(false); }}>
      <div className="af-logic-dialog" role="dialog" aria-modal="true" aria-labelledby="af-rule-title" onKeyDown={event => { if (event.key === "Escape") close(false); }}>
        <button type="button" className="af-logic-x" aria-label="Close" onClick={() => close(false)} data-sound="off"><XIcon /></button>
        <h3 id="af-rule-title">Logic rule 1</h3>
        <div className="af-logic-box">
          <span className="af-chip">If …</span>
          <label className="af-logic-field"><CalculatorIcon /><select ref={first} value={rule.field} onChange={event => setRule({ ...rule, field: event.target.value })} aria-label="Condition">
            <option>Score</option><option>Answer</option></select></label>
          <div className="af-logic-pair">
            <select value={rule.operator} onChange={event => setRule({ ...rule, operator: event.target.value })} aria-label="Comparison">{operators.map(item => <option key={item}>{item}</option>)}</select>
            <input value={rule.value} onChange={event => setRule({ ...rule, value: event.target.value })} aria-label="Value" inputMode="numeric" />
          </div>
          <span className="af-chip">… Then</span>
          <div className="af-logic-pair">
            <span className="af-logic-goto">Go to<ArrowBendUpRightIcon /></span>
            <select value={rule.target} onChange={event => setRule({ ...rule, target: event.target.value })} aria-label="Go to">{targets.map(item => <option key={item}>{item}</option>)}</select>
          </div>
        </div>
        <footer>
          <button type="button" className="af-logic-delete" onClick={remove} data-sound="off"><TrashIcon />Delete rule</button>
          <span>
            <button type="button" className="af-btn" data-quiet onClick={() => close(false)} data-sound="off">Cancel</button>
            <button type="button" className="af-btn" onClick={() => close(true)} data-sound="off">Save rule</button>
          </span>
        </footer>
      </div>
    </div>}
  </div>;
}

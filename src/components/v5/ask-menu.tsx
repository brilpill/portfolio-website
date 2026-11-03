"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { assistantPrompts } from "@/content/assistant-content";
import { playCue } from "@/components/ui-sound";
import { editRange } from "./edit-field";

/** A project or article the ask field can be pointed at with "@": its answer is the item's own summary. A project also
 * has `starters`, questions its case facts answer: on its own case study page they roll through the field's
 * suggestions, tag and all, to show "@" by example. */
export type AskTag = {
  id: string; kind: "Project" | "Article"; title: string; meta: string; href: string; external: boolean; answer: string;
  starters?: { q: string; a: string }[];
};

/** The tags, set once by the shell (they're read on the server: articles come off disk). */
export const AskTagsContext = createContext<AskTag[]>([]);

/** The "@ and /" tip shows on the first focus of an ask field on each page: once per page visit, so it's back after a
 * reload or on coming to the page again, and the hero and the dock share it. */
let tipSeen = false;
/** How long the tip stays if nothing else puts it away. */
const TIP_MS = 6000;

type Item = { key: string; label: string; meta: string; tag?: AskTag; question?: string };

/** The project or article the current page is about (a case study or an article), if any. */
export function usePageTag() {
  const tags = useContext(AskTagsContext);
  const [, section, slug] = usePathname().match(/^\/v5\/(projects|writing)\/([^/]+)/) ?? [];
  return section ? tags.find(tag => tag.id === `${section === "projects" ? "project" : "article"}-${slug}`) : undefined;
}

/** The question without its "@" mention, to match it against a tag's starters. */
export const stripMention = (q: string, tag?: AskTag) => tag ? q.replace(`@${tag.title}`, "").replace(/\s+/g, " ").trim() : q;

/** Text with its "@" mention set apart, in the field's mirror and in the chat. */
export function MentionText({ text, tag, className = "v5-ask-tag" }: { text: string; tag?: AskTag; className?: string }) {
  const at = tag ? text.indexOf(`@${tag.title}`) : -1;
  if (!tag || at < 0) return <>{text}</>;
  const end = at + tag.title.length + 1;
  const parts: ReactNode[] = [text.slice(0, at), <span key="m" className={className}>{text.slice(at, end)}</span>, text.slice(end)];
  return <>{parts}</>;
}

/** "@" at the caret (at the start or after a space) lists the work and articles to tag; "/" at the very start lists the
 * prepared questions. Arrows move, Enter or Tab picks, Esc closes it until the text changes. A tag goes into the text
 * as "@Title" right where it was typed and stays part of it: Backspace just after it takes the whole mention out, and
 * editing it away drops the tag. A question is asked straight away. One tag at a time: a new one replaces the old. */
export function useAskMenu({ draft, setDraft, input, onAsk }: {
  draft: string; setDraft: (text: string) => void; input: RefObject<HTMLInputElement | null>; onAsk: (question: string) => void;
}) {
  const tags = useContext(AskTagsContext);
  const id = useId();
  const [tag, setTag] = useState<AskTag>();
  const [active, setActive] = useState(0);
  const [dismissed, setDismissed] = useState<string>();
  const [tip, setTip] = useState(false);
  const pathname = usePathname();
  // Each page entered starts unseen again.
  useEffect(() => { tipSeen = false; }, [pathname]);
  // Typing, or the menu opening, takes the tip away; otherwise it leaves on its own.
  useEffect(() => { if (draft) setTip(false); }, [draft]);
  useEffect(() => {
    if (!tip) return;
    const timer = window.setTimeout(() => setTip(false), TIP_MS);
    return () => window.clearTimeout(timer);
  }, [tip]);

  // Where the caret is, so "@" works mid-sentence: the token runs from the last "@" before it.
  const [caret, setCaret] = useState(0);
  const before = draft.slice(0, caret);
  const from = before.lastIndexOf("@");
  const token = from >= 0 && (from === 0 || /\s/.test(before[from - 1])) ? before.slice(from + 1) : null;
  // The mention already in the text isn't a query.
  const mention = token !== null && token.length <= 32 && !(tag && draft.startsWith(`@${tag.title}`, from)) ? token : null;
  const kind = draft.startsWith("/") ? "slash" : mention !== null ? "mention" : undefined;
  const query = (kind === "slash" ? draft.slice(1) : mention ?? "").trim().toLowerCase();
  const items: Item[] = kind === "slash"
    ? assistantPrompts.filter(prompt => prompt.question.toLowerCase().includes(query)).map(prompt => ({ key: prompt.id, label: prompt.question, meta: "", question: prompt.question }))
    : kind === "mention"
      ? tags.filter(item => `${item.title} ${item.meta}`.toLowerCase().includes(query)).map(item => ({ key: item.id, label: item.title, meta: item.kind, tag: item }))
      : [];
  const open = !!kind && items.length > 0 && dismissed !== draft;
  const at = Math.min(active, Math.max(0, items.length - 1));

  // A new query starts at the top of the list.
  const last = useRef(draft);
  useEffect(() => { if (last.current !== draft) { last.current = draft; setActive(0); } }, [draft]);
  // Edited out of the text, the tag goes with it.
  useEffect(() => { if (tag && !draft.includes(`@${tag.title}`)) setTag(undefined); }, [draft, tag]);

  const readCaret = () => setCaret(input.current?.selectionStart ?? 0);

  const pick = (item: Item) => {
    if (item.question) { onAsk(item.question); return; }
    if (!item.tag) return;
    // The "@query" becomes the mention, in place; an earlier tag's mention turns back into plain text.
    if (tag && tag.id !== item.tag.id) {
      const old = draft.indexOf(`@${tag.title}`);
      if (old >= 0) editRange(input.current, old, old + 1, "", setDraft);
    }
    const shift = tag && tag.id !== item.tag.id && draft.indexOf(`@${tag.title}`) >= 0 && draft.indexOf(`@${tag.title}`) < from ? 1 : 0;
    const start = from - shift;
    const end = caret - shift;
    editRange(input.current, start, end, `@${item.tag.title} `, setDraft);
    setTag(item.tag);
    setCaret(start + item.tag.title.length + 2);
    playCue("click");
    input.current?.focus();
  };

  /** True when the key was the menu's (or Backspace taking the mention out), so the field doesn't act on it too. */
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const field = event.currentTarget;
    if (event.key === "Backspace" && tag && field.selectionStart === field.selectionEnd) {
      const at = draft.indexOf(`@${tag.title}`);
      const end = at + tag.title.length + 1;
      const pos = field.selectionStart ?? 0;
      // Just after the mention (or the space after it): it goes as one piece.
      if (at >= 0 && (pos === end || (pos === end + 1 && draft[end] === " "))) {
        event.preventDefault();
        // Its trailing space goes too, so no double space is left behind.
        editRange(field, at, Math.max(pos, draft[end] === " " ? end + 1 : end), "", setDraft);
        setTag(undefined);
        playCue("erase");
        return true;
      }
    }
    if (!open) return false;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((at + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length);
      playCue("key");
      return true;
    }
    if (event.key === "Enter" || (event.key === "Tab" && !event.shiftKey)) { event.preventDefault(); pick(items[at]); return true; }
    if (event.key === "Escape") {
      // Closes the menu only; the dock's Esc (on window) would put the whole field away.
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();
      setDismissed(draft);
      return true;
    }
    return false;
  };

  const onFocus = () => { if (!draft && !tipSeen) { tipSeen = true; setTip(true); } };
  const onBlur = () => setTip(false);

  return { id, open, kind, items, active: at, setActive, pick, onKeyDown, readCaret, tag, setTag, clearTag: () => setTag(undefined), tip: tip && !open, onFocus, onBlur };
}

export type AskMenuState = ReturnType<typeof useAskMenu>;

/** The list itself, laid out by the field it belongs to (under the hero field, over the dock's). */
export function AskMenu({ menu }: { menu: AskMenuState }) {
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => { list.current?.querySelector("[aria-selected='true']")?.scrollIntoView({ block: "nearest" }); }, [menu.active]);
  if (!menu.open) return null;
  return (
    <div ref={list} id={menu.id} className="v5-ask-menu" role="listbox" aria-label={menu.kind === "slash" ? "Questions" : "Projects and articles"}
      // A press keeps the caret in the field, so the list stays put until the click lands.
      onMouseDown={event => event.preventDefault()}>
      <p className="v5-ask-menu-head" aria-hidden>{menu.kind === "slash" ? "Questions" : "Projects and articles"}</p>
      {menu.items.map((item, i) => (
        <button key={item.key} id={`${menu.id}-${i}`} type="button" role="option" aria-selected={i === menu.active} data-sound="off"
          onMouseMove={() => menu.setActive(i)} onClick={() => menu.pick(item)}>
          <span>{item.tag ? `@${item.label}` : `/ ${item.label}`}</span>
          {item.meta && <small>{item.meta}</small>}
        </button>
      ))}
    </div>
  );
}

/** The one-time tip over the field, naming the two keys that open the lists. */
export function AskTip({ menu }: { menu: AskMenuState }) {
  if (!menu.tip) return null;
  return <p className="v5-ask-tip" role="status">Type <kbd>@</kbd> to ask about a project, <kbd>/</kbd> to see all questions</p>;
}

"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type MouseEvent, type RefObject } from "react";
import Link from "next/link";
import { assistantPrompts } from "@/content/assistant-content";
import { playCue } from "@/components/ui-sound";
import { match } from "./answers";
import { IconSparkle } from "./icons";
import { V5VaporText } from "./vapor-text";
import { useEnterMode } from "./enter-mode";
import { editField } from "./edit-field";
import { V5_HANDBACK, V5_HANDOFF, askChat, useChat, type Turn } from "./chat-store";
import { AskMenu, AskTip, MentionText, stripMention, useAskMenu, usePageTag, type AskMenuState, type AskTag } from "./ask-menu";


/** How long each suggested question stays in the empty field before the next rolls in. */
const SUGGEST_MS = 3200;

/** The home hero, after kirill.si: the headline and ask field, and once a question is sent, the conversation takes the
 * hero's place. The headline fades, the field glides to the foot of the hero, and the exchange fills the hero
 * above it, from its top edge down: the question as a bubble on the right, "Thinking", then the answer streaming in. */
export function V5HeroChat({ lines, placeholder, chips, owner }: {
  lines: [string, string]; placeholder: string; chips: { label: string; question: string }[]; owner: string;
}) {
  const { turns, thinking } = useChat();
  const [draft, setDraft] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const before = useRef<{ form: DOMRect; title: DOMRect | null; head: DOMRect } | null>(null);
  const chatting = turns.length > 0;
  // Option 1 condenses the title from vapour; option 2 leaves it plain for the generation skill to trace.
  const enter = useEnterMode();
  const menu = useAskMenu({ draft, setDraft, input, onAsk: question => ask(question) });
  // Held while there's text or a tag: the field then shows one steady line instead of re-rolling the same words.
  const hints = useSuggestions(placeholder, turns, !!draft || !!menu.tag);
  // A tag stands in for the suggestion: Enter on its own asks about the tagged item.
  const suggestion = menu.tag ? undefined : hints.suggestion;

  // FLIP: the field and headline start where they were, then ease to the chat layout.
  useLayoutEffect(() => {
    const was = before.current;
    before.current = null;
    // The conversation came from the dock: there's no "before" to ease from, so the headline just fades out.
    if (!was && chatting && title.current) title.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-out", fill: "forwards" });
    if (!was || !form.current) return;
    const now = form.current.getBoundingClientRect();
    form.current.animate([{ transform: `translateY(${was.form.top - now.top}px)` }, { transform: "none" }], { duration: 400, easing: "cubic-bezier(.2, .7, .2, 1)" });
    if (was.title && title.current) {
      title.current.style.top = `${was.title.top - was.head.top}px`;
      title.current.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }], { duration: 300, easing: "ease-out", fill: "forwards" });
    }
  }, [chatting]);

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" }); }, [turns, thinking]);
  // The dock hands over as the hero comes back into view: what was typed there carries on here, caret in.
  useEffect(() => {
    const handoff = (event: Event) => {
      const text = (event as CustomEvent<string>).detail;
      if (text) setDraft(text);
      input.current?.focus({ preventScroll: true });
    };
    // Scrolled away with the field in use: the dock has taken the text, so it's cleared here.
    const handback = () => { setDraft(""); input.current?.blur(); };
    window.addEventListener(V5_HANDOFF, handoff);
    window.addEventListener(V5_HANDBACK, handback);
    return () => { window.removeEventListener(V5_HANDOFF, handoff); window.removeEventListener(V5_HANDBACK, handback); };
  }, []);

  // The whole pill is the field: a press on its padding or the icon puts the caret in the input.
  const focusField = (event: MouseEvent) => {
    if (event.target === input.current) return;
    event.preventDefault();
    input.current?.focus();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    // A mention on its own asks about the item; an empty field asks the suggestion showing, tag and all.
    if (menu.tag) ask(stripMention(draft, menu.tag) ? draft.trim() : `Tell me about @${menu.tag.title}`, menu.tag);
    else if (draft.trim()) ask(draft.trim());
    else if (suggestion) ask(suggestion.tag ? `@${suggestion.tag.title} ${suggestion.q}` : suggestion.q, suggestion.tag);
  };

  /** Asks `q` about `tag`, if any. Questions from the "/" list and the pills go without one; the tag in the field stays. */
  const ask = (q: string, tag?: AskTag) => {
    if (!form.current) return;
    const field = form.current.getBoundingClientRect();
    if (!chatting) before.current = { form: field, title: title.current?.getBoundingClientRect() ?? null, head: form.current.closest(".v5-home-head")!.getBoundingClientRect() };
    askChat(q, undefined, tag);
    if (tag) menu.clearTag();
    // Cleared as an edit, so ⌘Z brings the question back.
    editField(input.current, "", setDraft);
    playCue("open");
  };

  return (
    <div className="v5-home-head" data-chat={chatting || undefined}>
      {chatting ? (
        <>
          <h1 ref={title} className="v5-hero v5-hero-leaving" aria-hidden>{lines[0]} <br />{lines[1]}</h1>
          <div className="v5-hero-box">
          <div ref={log} className="v5-hero-log" aria-live="polite">
            {turns.map(turn => (
              <div key={turn.id} className="v5-hero-turn">
                {turn.quote && <blockquote className="v5-hero-quote">{turn.quote}</blockquote>}
                <div className="v5-hero-q"><MentionText text={turn.q} tag={turn.tag} className="v5-hero-tag" /></div>
                {thinking === turn.id ? <p className="v5-hero-thinking">Thinking</p> : <HeroAnswer turn={turn} owner={owner} />}
              </div>
            ))}
          </div>
          </div>
        </>
      ) : (
        enter === "generate"
          ? <h1 ref={title} className="v5-hero">{lines[0]} <br />{lines[1]}</h1>
          : <V5VaporText as="h1" className="v5-hero" textRef={title}>{lines[0]} <br />{lines[1]}</V5VaporText>
      )}
      <div className="v5-ask-wrap" data-menu={menu.open || undefined}>
        <form ref={form} className="v5-ask" onSubmit={submit} onMouseDown={focusField}>
          <IconSparkle />
          <AskLine input={input} draft={draft} setDraft={setDraft} hints={{ ...hints, suggestion, leaving: menu.tag ? undefined : hints.leaving }} menu={menu}
            fallback={menu.tag ? `Ask about ${menu.tag.title}` : `Ask anything about ${owner}`} />
        </form>
        <AskMenu menu={menu} />
        <AskTip menu={menu} />
        {/* Suggested questions, shown only while the field is in use and nothing's been asked yet. A press keeps the
         * caret in the field, so the pills don't vanish under the pointer before the click lands. */}
        {!chatting && (
          <div className="v5-ask-chips">
            {chips.map((chip, i) => (
              <button key={chip.label} type="button" className="v5-ask-chip" data-sound="off" style={{ "--i": i } as CSSProperties}
                onMouseDown={event => event.preventDefault()} onClick={() => ask(chip.question)}>{chip.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** A suggested question, tagged when it's about one project. */
export type Hint = { q: string; tag?: AskTag };

/** The questions an empty ask field rolls through: ones with a prepared answer that haven't been asked yet, `first`
 * leading. On a case study page every other one is about that project, with its "@" tag, to show tagging by example.
 * With `lead` (the field holding only that tag's mention) they're just its own questions, to finish the line after it.
 * They roll on every few seconds while the field is empty and the page is in view; `paused` holds them. */
export function useSuggestions(first: string, asked: Turn[], paused: boolean, lead?: AskTag) {
  const here = usePageTag();
  const startersOf = (tag?: AskTag) => (tag?.starters ?? []).filter(starter => !asked.some(turn => turn.tag?.id === tag!.id && stripMention(turn.q, turn.tag) === starter.q));
  const plain = [first, ...assistantPrompts.map(prompt => prompt.question)]
    .filter((q, i, all) => q && all.indexOf(q) === i && match(q) && !asked.some(turn => turn.q === q && !turn.tag));
  const tagged = here?.kind === "Project" ? startersOf(here) : [];
  const list: Hint[] = lead
    ? startersOf(lead).map(starter => ({ q: starter.q, tag: lead }))
    : plain.flatMap((q, i) => [{ q }, ...(tagged[i] ? [{ q: tagged[i].q, tag: here }] : [])]);
  const [hint, setHint] = useState({ at: 0, was: -1 });
  const suggestion = list.length ? list[hint.at % list.length] : undefined;
  const leaving = hint.was >= 0 && list.length > 1 ? list[hint.was % list.length] : undefined;
  useEffect(() => {
    if (paused || list.length < 2) return;
    const tick = window.setInterval(() => { if (!document.hidden) setHint(({ at }) => ({ at: at + 1, was: at })); }, SUGGEST_MS);
    return () => window.clearInterval(tick);
  }, [paused, list.length]);
  return { suggestion, leaving, at: hint.at, was: hint.was, settle: () => setHint(current => ({ ...current, was: -1 })) };
}

/** The ask field's line: the input, the suggestion rolling through it while it's empty, and the Tab key cap. Tab puts
 * the suggestion showing into the field, ready to edit or send. */
export function AskLine({ input, draft, setDraft, hints, menu, fallback }: {
  input: RefObject<HTMLInputElement | null>; draft: string; setDraft: (text: string) => void;
  hints: Omit<ReturnType<typeof useSuggestions>, "suggestion" | "leaving"> & { suggestion?: Hint; leaving?: Hint }; menu: AskMenuState; fallback: string;
}) {
  const { suggestion, leaving } = hints;
  const mirror = !!menu.tag && draft.includes(`@${menu.tag.title}`);
  // Only a mention in the field (as the dock starts on a case study): the suggestion rolls on right after it.
  const lead = !!menu.tag && draft === `@${menu.tag.title} `;
  const mirrorLine = useRef<HTMLSpanElement>(null);
  // The mirror scrolls with the input, so a long line stays lined up under the caret.
  const follow = () => { if (mirrorLine.current && input.current) mirrorLine.current.style.transform = `translateX(${-input.current.scrollLeft}px)`; };
  useLayoutEffect(follow);
  const takeSuggestion = (event: KeyboardEvent<HTMLInputElement>) => {
    // The "@" and "/" menu has the keys first.
    if (menu.onKeyDown(event)) return;
    if (event.key !== "Tab" || event.shiftKey || (draft && !lead) || !suggestion) return;
    event.preventDefault();
    editField(input.current, lead ? `${draft}${suggestion.q}` : suggestion.tag ? `@${suggestion.tag.title} ${suggestion.q}` : suggestion.q, setDraft);
    if (suggestion.tag) menu.setTag(suggestion.tag);
    playCue("click");
  };
  return (
    <span className="v5-ask-line" data-empty={!draft || lead || undefined}>
      {/* The native placeholder carries the suggestion for screen readers; the animated copy below is what shows. With a
       * tag in the text, the input's own text turns clear and a mirror under it shows the same line, mention coloured. */}
      <span className="v5-ask-input" data-mirror={mirror || undefined}>
      {mirror && (
        <span className="v5-ask-mirror" aria-hidden>
          <span ref={mirrorLine}>
            <MentionText text={draft} tag={menu.tag} />
            {lead && (
              <span className="v5-ask-ghost">
                {leaving && <Suggestion key={`out-${hints.was}`} text={leaving.q} out onDone={hints.settle} />}
                <Suggestion key={`in-${hints.at}`} text={suggestion?.q ?? "ask anything about it"} />
              </span>
            )}
          </span>
        </span>
      )}
      <input ref={input} value={draft} onChange={event => { setDraft(event.target.value); menu.readCaret(); }} onSelect={() => { menu.readCaret(); follow(); }} onScroll={follow} onKeyDown={takeSuggestion} onFocus={menu.onFocus} onBlur={menu.onBlur} placeholder={suggestion ? `${suggestion.tag ? `@${suggestion.tag.title} ` : ""}${suggestion.q}` : fallback} aria-label="Ask the assistant"
        role="combobox" aria-autocomplete="list" aria-expanded={menu.open} aria-controls={menu.open ? menu.id : undefined} aria-activedescendant={menu.open ? `${menu.id}-${menu.active}` : undefined} />
      {!draft && (
        <span className="v5-ask-hint" aria-hidden>
          {leaving && <Suggestion key={`out-${hints.was}`} text={leaving.q} tag={leaving.tag} out onDone={hints.settle} />}
          <Suggestion key={`in-${hints.at}`} text={suggestion?.q ?? fallback} tag={suggestion?.tag} />
        </span>
      )}
      </span>
      {suggestion && <kbd className="v5-ask-tab" aria-hidden>Tab</kbd>}
    </span>
  );
}

/** One suggested question: rolls in word by word, rising out of a blur, and leaves as a line, rising away. A tagged one
 * leads with its "@" mention, set like the tag in the field. */
function Suggestion({ text, tag, out = false, onDone }: { text: string; tag?: AskTag; out?: boolean; onDone?: () => void }) {
  const parts = tag ? [`@${tag.title}`, ...text.split(" ")] : text.split(" ");
  return (
    <span className="v5-ask-suggestion" data-out={out || undefined} onAnimationEnd={event => { if (out && event.target === event.currentTarget) onDone?.(); }}>
      {parts.map((word, i) => <span key={i} className={tag && i === 0 ? "v5-ask-mention" : undefined} style={{ "--i": i } as CSSProperties}>{word}{i < parts.length - 1 ? " " : ""}</span>)}
    </span>
  );
}

/** The prepared answer, streamed in word by word. */
export function HeroAnswer({ turn, owner }: { turn: Turn; owner: string }) {
  // A tagged starter question gets its own fact; anything else asked about a tag gets the item's summary.
  const text = (turn.tag && (turn.tag.starters?.find(starter => starter.q === stripMention(turn.q, turn.tag))?.a ?? turn.tag.answer)) ?? turn.prompt?.answer ?? `I don't have a prepared answer for that one. Ask ${owner} directly: Copy Mail is in the footer.`;
  const parts = text.split(" ");
  return (
    <div className="v5-hero-a">
      {parts.map((word, i) => <span key={i} className="stream-word" style={{ animationDelay: `${i * 22}ms` }}>{word}{i < parts.length - 1 ? " " : ""}</span>)}
      {turn.tag && (turn.tag.external
        ? <a className="v5-hero-src" style={{ animation: `v5-stream-in .35s ease-out ${parts.length * 22}ms both` }} href={turn.tag.href} target="_blank" rel="noopener noreferrer">Open {turn.tag.title} ↗</a>
        : <Link className="v5-hero-src" style={{ animation: `v5-stream-in .35s ease-out ${parts.length * 22}ms both` }} href={turn.tag.href}>Open {turn.tag.title}</Link>)}
      {turn.prompt && <Link className="v5-hero-src" style={{ animation: `v5-stream-in .35s ease-out ${parts.length * 22}ms both` }} href={turn.prompt.source.href.replace(/^\/about/, "/v5/about")}>Source: {turn.prompt.source.label}</Link>}
    </div>
  );
}

import { useSyncExternalStore } from "react";
import type { AssistantPrompt } from "@/content/assistant-content";
import { match } from "./answers";
import type { AskTag } from "./ask-menu";

export type Turn = { id: number; q: string; quote?: string; tag?: AskTag; prompt?: AssistantPrompt };
type Chat = { turns: Turn[]; thinking: number | null };

/** How long "Thinking" shows before the prepared answer streams in. */
const THINK_MS = 700;

/** One conversation for the whole visit, shared by the hero chat and the Ask AI dock: a question asked in either shows in
 * both, so whatever was asked in the dock is in the hero chat on the way back to it. */
let chat: Chat = { turns: [], thinking: null };
const listeners = new Set<() => void>();
const set = (next: Chat) => { chat = next; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const EMPTY: Chat = { turns: [], thinking: null };

export const useChat = () => useSyncExternalStore(subscribe, () => chat, () => EMPTY);

/** Asks a question (with a quoted passage or a tagged project or article, if any): it shows at once with "Thinking",
 * then its prepared answer. A tagged question is answered from the tag itself. */
export function askChat(q: string, quote?: string, tag?: AskTag) {
  const id = Date.now();
  set({ turns: [...chat.turns, { id, q, quote, tag, prompt: tag ? undefined : match(quote ? `${q} ${quote}` : q) }], thinking: id });
  window.setTimeout(() => { if (chat.thinking === id) set({ ...chat, thinking: null }); }, THINK_MS);
}

export const clearChat = () => set({ turns: [], thinking: null });

/** The dock handing over to the hero field as it comes back into view, with whatever was typed in the dock. */
export const V5_HANDOFF = "v5-ask-handoff";

/** The hero field handing over to the dock as it scrolls away, before anything's been asked: the dock takes its text. */
export const V5_HANDBACK = "v5-ask-handback";

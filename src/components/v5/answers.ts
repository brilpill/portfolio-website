import { assistantPrompts, type AssistantPrompt } from "@/content/assistant-content";

const words = (text: string) => text.toLowerCase().match(/[a-z]{3,}/g) ?? [];
const STOP = new Set(["what", "you", "your", "the", "and", "how", "are", "can", "about", "tell", "with", "for", "this", "that", "does", "did", "have"]);

/** Prepared answers only: the closest one by shared words, or nothing when nothing fits. */
export function match(question: string): AssistantPrompt | undefined {
  const asked = new Set(words(question).filter(word => !STOP.has(word)));
  let best: AssistantPrompt | undefined, score = 0;
  for (const prompt of assistantPrompts) {
    const pool = words(`${prompt.question} ${prompt.answer}`);
    const hits = pool.filter(word => asked.has(word)).length + words(prompt.question).filter(word => asked.has(word)).length * 2;
    if (hits > score) { best = prompt; score = hits; }
  }
  return score >= 2 ? best : undefined;
}

/** Opens the Ask AI dock with a passage selected on the page attached as context for the next question. */
export const V5_QUOTE = "v5-quote";
export const quoteToAssistant = (text: string) => window.dispatchEvent(new CustomEvent(V5_QUOTE, { detail: text }));

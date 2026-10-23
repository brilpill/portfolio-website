"use client";

import Image from "next/image";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon, CheckIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";
import { profile } from "@/content/profile";

const questions = [
  { question: "What do you design?", answer: "I design web and mobile products, from flows and wireframes to polished interfaces and design systems. I also build the interfaces I design, so I can carry an idea through to a working experience.", source: "Profile", href: "#process", link: "Explore my process" },
  { question: "How do you work?", answer: "I start with the problem and the people using the product. Then I work through the structure, explore visual directions, and refine the interactions. The process slide takes a sample interface apart to show those layers of work.", source: "Design process", href: "#process", link: "See the layers" },
  { question: "Tell me about your design + code background.", answer: "I’m a product designer who designs interfaces and builds them. I work in Figma and use coding agents to bring the design into code. I make the decisions about layout, behaviour, and the details that make an interface feel right.", source: "Profile", href: "#process", link: "How I work" },
  { question: "Are you available for work?", answer: `I’m based in ${profile.location} and open to full-time, freelance, or contract work. Remote, hybrid, or on-site in Warsaw all work for me. If you have a project or role in mind, send me a message.`, source: "Availability", href: `mailto:${profile.email}`, link: "Get in touch" },
];
type Reply = { question: number; words: number; done: boolean };

/** Prepared replies for the interaction demo. No model or network calls. */
export function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reducedMotion = useReducedMotion();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [pending, setPending] = useState<number | null>(null);
  const [phase, setPhase] = useState("Gathering context");
  const closeButton = useRef<HTMLButtonElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const busy = pending !== null;

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented && !document.querySelector('[data-slot="dialog-content"][data-open], [data-slot="sheet-content"][data-open], [data-slot="dropdown-menu-content"][data-open]')) { event.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, onClose]);

  useEffect(() => {
    if (pending === null) return;
    const count = questions[pending].answer.split(" ").length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stream: ReturnType<typeof setInterval> | undefined;
    const preparing = setTimeout(() => setPhase("Preparing answer"), 650);
    const start = setTimeout(() => {
      setPhase("Answering");
      let words = 0;
      stream = setInterval(() => {
        words = reduced ? count : Math.min(count, words + 3);
        const done = words >= count;
        setReplies(items => items.map((item, index) => index === items.length - 1 ? { ...item, words, done } : item));
        if (done) { clearInterval(stream); setPending(null); }
      }, reduced ? 1 : 65);
    }, reduced ? 250 : 1200);
    return () => { clearTimeout(preparing); clearTimeout(start); clearInterval(stream); };
  }, [pending]);

  useEffect(() => {
    const container = transcript.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [replies, phase]);

  const ask = (question: number) => {
    if (busy) return;
    setPhase("Gathering context");
    setReplies(items => [...items, { question, words: 0, done: false }]);
    setPending(question);
  };

  return (
    <AnimatePresence initial={false}>{open && <motion.aside initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : 12 }} transition={{ duration: reducedMotion ? .08 : motionTokens.duration.panel }} id="portfolio-assistant" className="portfolio-assistant" inert={!open} aria-hidden={!open} role="complementary" aria-labelledby="assistant-title">
      <header className="assistant-header">
        <Button variant="quiet" size="icon" ref={closeButton} aria-label="Close Ask AI" onClick={onClose}><AssistantIcon name="collapse" size={16} /></Button>
        <span id="assistant-title">Ask me</span>
        <Tooltip><TooltipTrigger render={<Button variant="quiet" size="icon" aria-label="About this assistant" />}><AssistantIcon name="info" size={15} /></TooltipTrigger><TooltipContent side="bottom">Prepared answers about Oleh. Custom questions are coming later.</TooltipContent></Tooltip>
      </header>
      <div className="assistant-transcript" ref={transcript}>
        {replies.map((reply, index) => {
          const item = questions[reply.question];
          return <div className="assistant-turn" key={index}>
            <p className="assistant-question">{item.question}</p>
            <div className="assistant-answer">
              <Badge variant="secondary"><CheckIcon aria-hidden />{item.source}</Badge>
              {!reply.done && index === replies.length - 1 && <span className="assistant-progress" role="status">{phase}…</span>}
              {reply.words > 0 && <p>{item.answer.split(" ").slice(0, reply.words).join(" ")}</p>}
              {reply.done && <a href={item.href} onClick={onClose}>{item.link}<ArrowUpRightIcon size={13} aria-hidden /></a>}
              <span className="home-sr-only" role="status">{reply.done ? item.answer : ""}</span>
            </div>
          </div>;
        })}
      </div>
      <div className="assistant-bottom">
        {!replies.length && <div className="assistant-intro"><p>Hey, I’m <span className="assistant-name"><Image src="/figma/assistant/name-mark.svg" width={50.2894} height={21.5025} alt="" aria-hidden /><Image src="/figma/assistant/name-vector.svg" width={52.3782} height={19.4958} alt="" aria-hidden />Oleh</span>, or an AI version of me.</p><p>Ask about my work, how I work, or anything on this site.</p></div>}
        <div className="assistant-suggestions" aria-label="Preset questions">{questions.map((item, index) => <Button variant="suggestion" key={item.question} onClick={() => ask(index)} disabled={busy}><AssistantIcon name="question" size={14} />{item.question}</Button>)}</div>
        <div className="assistant-composer">
          <div className="assistant-composer-box">
            <label className="home-sr-only" htmlFor="assistant-input">Custom question — coming later</label><Input id="assistant-input" disabled placeholder="Ask about Oleh…" />
            <div className="assistant-composer-tools">
              <Button variant="quiet" size="icon" aria-label="Show suggested questions" onClick={() => document.querySelector<HTMLButtonElement>(".assistant-suggestions button:not(:disabled)")?.focus()}><AssistantIcon name="suggestions" size={14} /></Button>
              <Button variant="quiet" size="icon" aria-label="Browse case studies" onClick={() => { location.hash = "luminasset"; onClose(); }}><AssistantIcon name="cases" size={14} /></Button>
              <Button size="icon" variant="ink" disabled aria-label="Send custom question — coming later"><AssistantIcon name="send" size={16} /></Button>
            </div>
          </div>
          <p>Prepared answers · Custom questions coming later</p>
        </div>
      </div>
    </motion.aside>}</AnimatePresence>
  );
}

function AssistantIcon({ name, size }: { name: string; size: number }) {
  return <Image src={`/figma/assistant/${name}.svg`} alt="" width={size} height={size} aria-hidden />;
}

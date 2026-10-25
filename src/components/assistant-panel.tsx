"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { assistantPromptById, starterPromptIds } from "@/content/assistant-content";

/** A viewable preview while the chatbot is unavailable. Close and Escape remain active. */
export function AssistantPanel({ open, onClose }: {
  open: boolean;
  onClose: () => void;
  selectedText?: string | null;
  onClearSelectedText?: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (document.querySelector('[data-slot="dialog-content"][data-open], [data-slot="sheet-content"][data-open], [data-slot="dropdown-menu-content"][data-open]')) return;
      event.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, onClose]);

  return <aside id="portfolio-assistant" className="portfolio-assistant" inert={!open} aria-hidden={!open} role="complementary" aria-labelledby="assistant-title">
    <header className="assistant-header">
      <Button variant="quiet" size="icon" ref={closeButton} aria-label="Close Ask AI" onClick={onClose}><AssistantIcon name="collapse" size={16} /></Button>
      <span id="assistant-title">Ask me</span>
      <Tooltip><TooltipTrigger render={<Button variant="quiet" size="icon" aria-label="About this assistant" />}><AssistantIcon name="info" size={15} /></TooltipTrigger><TooltipContent side="bottom" align="end">Currently unavailable.</TooltipContent></Tooltip>
    </header>
    <div className="assistant-transcript" aria-label="Conversation" />
    <div className="assistant-bottom">
      <div className="assistant-intro"><p>Hey, I’m <span className="assistant-name"><Image src="/figma/assistant/name-mark.svg" width={50.2894} height={21.5025} alt="" aria-hidden /><Image src="/figma/assistant/name-vector.svg" width={52.3782} height={19.4958} alt="" aria-hidden />Oleh</span>, or an AI version of me.</p><p>Ask about my work, how I work, or anything on this site.</p></div>
      <div className="assistant-suggestions" aria-label="Preset questions">{starterPromptIds.map(id => {
        const prompt = assistantPromptById.get(id);
        return prompt ? <Tooltip key={id}><TooltipTrigger render={<Button variant="suggestion" aria-disabled="true" />}><AssistantIcon name="question" size={14} />{prompt.question}</TooltipTrigger><TooltipContent>Currently unavailable.</TooltipContent></Tooltip> : null;
      })}</div>
      <div className="assistant-composer">
        <div className="assistant-composer-box">
          <label className="home-sr-only" htmlFor="assistant-input">Ask about Oleh — currently unavailable</label>
          <Tooltip><TooltipTrigger render={<Input id="assistant-input" className="assistant-input-preview" readOnly aria-disabled="true" placeholder="Ask about Oleh…" />} /><TooltipContent>Currently unavailable.</TooltipContent></Tooltip>
          <div className="assistant-composer-tools">
            <Tooltip><TooltipTrigger render={<Button variant="quiet" size="icon" aria-label="Suggested questions — currently unavailable" aria-disabled="true" />}><AssistantIcon name="suggestions" size={14} /></TooltipTrigger><TooltipContent>Currently unavailable.</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger render={<Button variant="quiet" size="icon" aria-label="Project context — currently unavailable" aria-disabled="true" />}><AssistantIcon name="cases" size={14} /></TooltipTrigger><TooltipContent>Currently unavailable.</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger render={<Button size="icon" variant="ink" aria-label="Send question — currently unavailable" aria-disabled="true" />}><AssistantIcon name="send" size={16} /></TooltipTrigger><TooltipContent>Currently unavailable.</TooltipContent></Tooltip>
          </div>
        </div>
      </div>
    </div>
  </aside>;
}

function AssistantIcon({ name, size }: { name: string; size: number }) {
  return <Image src={`/figma/assistant/${name}.svg`} alt="" width={size} height={size} aria-hidden />;
}

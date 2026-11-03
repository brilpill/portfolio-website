"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { playCue } from "@/components/ui-sound";

type Link = { label: string; href: string };

/** The main site's contact panel, in v5's paper-and-serif voice: a quiet button that opens a modal. */
export function V5Contact({ email, status, links, plain }: { email: string; status: string; links: Link[]; plain?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  const open = () => { dialog.current?.showModal(); playCue("open"); };
  const close = () => { dialog.current?.close(); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); playCue("success"); setTimeout(() => setCopied(false), 1600); }
    catch { window.location.href = `mailto:${email}`; }
  };

  return (
    <>
      {plain ? (
        <button type="button" className="v5-tap" data-sound="off" data-cursor="Say hello" onClick={open}>Email</button>
      ) : (
        <button type="button" className="v5-pill" data-tone="blue" data-sound="off" data-cursor="Say hello" onClick={open}>
          <span className="v5-pill-icon"><img src="/v5/sprite/send.svg" alt="" width={15} height={15} /></span>Contact Me
        </button>
      )}

      <dialog ref={dialog} className="v5-contact" aria-labelledby="v5-contact-title" onClose={() => playCue("close")}
        onClick={event => { if (event.target === event.currentTarget) close(); }}>
        <div className="v5-contact-inner">
          <button type="button" className="v5-contact-close" aria-label="Close" data-sound="off" onClick={close}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="m2 2 10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.2" /></svg>
          </button>
          <p className="v5-contact-eyebrow"><i aria-hidden />{status}</p>
          <h2 id="v5-contact-title">Let&rsquo;s make something feel right.</h2>
          <p className="v5-contact-copy">Have a project in mind, or a role to talk about? Drop me a line.</p>
          <div className="v5-contact-email">
            <a href={`mailto:${email}`} data-cursor="Write">{email}</a>
            <button type="button" className="v5-tap" data-sound="off" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <div className="v5-contact-links">
            {links.map(link => <a key={link.label} className="v5-tap" href={link.href} target="_blank" rel="noopener noreferrer" data-cursor="Open">{link.label} ↗</a>)}
          </div>
        </div>
      </dialog>
    </>
  );
}

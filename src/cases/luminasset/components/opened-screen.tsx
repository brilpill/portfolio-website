"use client";

import Image from "next/image";
import { CaretLeftIcon } from "@phosphor-icons/react";
import "./opened-screen.css";

/**
 * One level deep: a screen the live demo opens (Help, Cancel, Details…), shown as its exported design with a back
 * button over the screen's own, so the demo never goes further than one tap. Escape goes back too.
 */
export function OpenedScreen({ src, alt, onBack }: { src: string; alt: string; onBack: () => void }) {
  return <div className="la-opened" role="dialog" aria-label={alt} onKeyDown={event => { if (event.key === "Escape") onBack(); }}>
    <Image src={src} alt={alt} fill sizes="340px" />
    <button type="button" className="la-opened-back" aria-label="Back" autoFocus onClick={onBack}><CaretLeftIcon weight="bold" /></button>
  </div>;
}

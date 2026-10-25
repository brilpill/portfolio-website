"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

/**
 * LuminAsset button, from the Figma "button" set: seven styles, each with Default, Pressed, Disabled and Loading.
 * 52pt tall, fully rounded, Small Medium (Geist 14/20). Pressed is the real :active state; `state="pressed"` only
 * pins it, for showing every state side by side.
 */
export type ButtonVariant = "white" | "blue" | "black" | "dark" | "ghost" | "outline" | "destructive";
export type ButtonState = "default" | "pressed" | "disabled" | "loading";

/** Eight dots, the Figma loading spinner. */
function Spinner() {
  return <svg className="la-button-spinner" viewBox="0 0 16 16" aria-hidden>
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x="7.25" y="1" width="1.5" height="4" rx=".75" transform={`rotate(${i * 45} 8 8)`} opacity={.25 + i * .1} />)}
  </svg>;
}

export function Button({ variant = "blue", state = "default", children, ...props }: { variant?: ButtonVariant; state?: ButtonState; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const loading = state === "loading";
  return <button type="button" {...props} className="la-button" data-variant={variant} data-state={state === "pressed" ? "pressed" : undefined}
    disabled={state === "disabled" || props.disabled} aria-busy={loading || undefined}>
    {loading ? <><Spinner />Loading..</> : children}
  </button>;
}

"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/content/profile";

/*
 * The greeting and the clock depend on the visitor's time, which the server can't know.
 * An inline script fills them in before the first paint; React then keeps them current.
 * The script mirrors `greeting()` and `clockLine()` below — change both together.
 */

export function greeting(hour = new Date().getHours()) {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function clockLine(now = new Date()) {
  const tz = profile.timezone;
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(now);
  const there = new Date(now.toLocaleString("en-US", { timeZone: tz })).getTime();
  const here = new Date(now.toLocaleString("en-US")).getTime();
  const diff = Math.round((there - here) / 900_000) / 4; // hours, to the quarter
  const abs = Math.abs(diff);
  const relation =
    diff === 0 ? "same time as you" : `${abs} hour${abs === 1 ? "" : "s"} ${diff > 0 ? "ahead of" : "behind"} you`;
  return `${time} in ${profile.city}, ${relation}.`;
}

const script = `(function(){try{var n=new Date(),h=n.getHours();var g=document.getElementById("greeting");if(g)g.textContent=h<5?"Good night":h<12?"Good morning":h<18?"Good afternoon":"Good evening";var c=document.getElementById("clock");if(!c)return;var tz=${JSON.stringify(profile.timezone)};var t=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:tz}).format(n);var d=Math.round((new Date(n.toLocaleString("en-US",{timeZone:tz}))-new Date(n.toLocaleString("en-US")))/9e5)/4,a=Math.abs(d);c.textContent=t+" in "+${JSON.stringify(profile.city)}+", "+(d===0?"same time as you":a+" hour"+(a===1?"":"s")+" "+(d>0?"ahead of":"behind")+" you")+".";}catch(e){}})()`;

function subscribeMinute(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

export function Greeting() {
  const text = useSyncExternalStore(subscribeMinute, () => greeting(), () => "Hello");
  return (
    <span id="greeting" suppressHydrationWarning>
      {text}
    </span>
  );
}

export function Clock({ className = "" }: { className?: string }) {
  const text = useSyncExternalStore(subscribeMinute, () => clockLine(), () => " ");
  return (
    <p id="clock" className={className} suppressHydrationWarning>
      {text}
    </p>
  );
}

/** Runs during HTML parsing on a full page load; inert on the client. */
export function ClockScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}

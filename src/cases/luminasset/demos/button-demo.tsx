"use client";

import { useEffect, useState } from "react";
import { geist } from "../font";
import { laVars } from "../tokens";
import { Button, type ButtonVariant } from "../components/button";
import "./button-demo.css";

/**
 * The button in its own frame: one at real size, centred, its style picked by the block's tabs (`value`). Hold it
 * to see Pressed, tap it for Loading; the Disabled switch sits in the frame's top-right corner. White and Dark are made for the app's dark screens, so the
 * surface turns dark for them.
 */
const dark: ButtonVariant[] = ["white", "dark"];

export function ButtonDemo({ value }: { value: string | number; onValueChange?: (value: string | number) => void }) {
  const variant = String(value) as ButtonVariant;
  const [busy, setBusy] = useState(false);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 1400);
    return () => window.clearTimeout(timer);
  }, [busy]);

  return <div className={`la-button-demo ${geist.variable}`} style={laVars} data-surface={dark.includes(variant) ? "dark" : "light"}>
    <div className="la-button-demo-live">
      <Button variant={variant} state={busy ? "loading" : disabled ? "disabled" : "default"} onClick={() => setBusy(true)}>Get Started</Button>
    </div>
    <div className="la-button-demo-row">
      <label className="la-button-demo-switch">
        <input type="checkbox" checked={disabled} onChange={event => { setDisabled(event.target.checked); setBusy(false); }} />
        <i aria-hidden />Disabled
      </label>
    </div>
  </div>;
}

"use client";

import { useState } from "react";
import { EstimateSheet } from "./estimate-sheet";
import { SystemSizeSlider } from "./system-size-slider";

/**
 * The estimate two ways, to compare (the block's tabs, `value`): with Solar API data, the aerial photo of the roof
 * under the draggable sheet; without it, the fallback that draws the system as blocks on a grid. Both are live:
 * the sheet and the ruler work in each, and each keeps its own state while you switch.
 */
export function Estimate({ value }: { value: string | number; onValueChange?: (value: string | number) => void }) {
  const [stop, setStop] = useState<string | number>("middle");
  const [panels, setPanels] = useState<string | number>(32);
  return value === "manual"
    ? <SystemSizeSlider value={Number(panels)} onValueChange={setPanels} />
    : <EstimateSheet value={stop} onValueChange={setStop} />;
}

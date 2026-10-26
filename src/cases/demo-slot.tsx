"use client";

import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * The block's bottom tab row, as a place a demo can put its own control group (rendered beside the block's tabs, the
 * whole row centred). ComponentStage provides it; outside a case block there's no row, so `fallback` renders instead.
 */
export const DemoTabRow = createContext<HTMLElement | null>(null);

export function InTabRow({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const row = useContext(DemoTabRow);
  return row ? createPortal(children, row) : <>{fallback}</>;
}

"use client";

import { MotionConfig } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motionTokens } from "@/lib/motion";

export function UIProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: motionTokens.duration.panel, ease: motionTokens.easeOut }}>
    <TooltipProvider delay={500} closeDelay={80}>{children}</TooltipProvider>
  </MotionConfig>;
}

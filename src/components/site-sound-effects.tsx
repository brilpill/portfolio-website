"use client";

import { useEffect } from "react";
import { playCue, type SoundCue } from "./ui-sound";

/** One cue for actions outside case media, whose interactive demos already own their sounds. */
export function SiteSoundEffects() {
  useEffect(() => {
    const outsideCaseMedia = (target: EventTarget | null): target is Element =>
      target instanceof Element && !target.closest(".case-media");

    const unavailable = (element: Element) =>
      element.closest('[aria-disabled="true"], [disabled], [inert], [data-sound-toggle]');

    const requestedCue = (element: Element): SoundCue | "off" | null =>
      element.closest("[data-sound]")?.getAttribute("data-sound") as SoundCue | "off" | null;

    const click = (event: MouseEvent) => {
      if (!outsideCaseMedia(event.target)) return;
      const target = event.target;
      if (unavailable(target)) return;

      // Native checkboxes and radios sound on change, so their labels cannot double-play.
      const field = target.closest("input, textarea, select");
      if (field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio")) return;
      if (field) { playCue("click"); return; }
      const label = target.closest("label");
      if (label instanceof HTMLLabelElement && label.control instanceof HTMLInputElement && ["checkbox", "radio"].includes(label.control.type)) return;

      const control = target.closest('button, a[href], summary, [role="button"], [role="tab"], [role="option"], [role="switch"], [role="menuitem"]');
      if (control) {
        const cue = requestedCue(control);
        if (cue === "off") return;
        if (cue) playCue(cue);
        else if (control.hasAttribute("aria-expanded")) playCue(control.getAttribute("aria-expanded") === "true" ? "close" : "open");
        else if (control.hasAttribute("aria-pressed") || control.getAttribute("role") === "switch") playCue("toggle");
        else playCue("click");
        return;
      }

      // The hero's open canvas is itself a tap target, even where there is no button.
      if (target.closest(".home-slide")) playCue("click");
    };

    const input = (event: Event) => {
      if (!outsideCaseMedia(event.target) || unavailable(event.target)) return;
      const field = event.target;
      if (!(field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) || field.readOnly || field instanceof HTMLInputElement && ["checkbox", "radio", "range"].includes(field.type)) return;
      const type = (event as InputEvent).inputType ?? "";
      if (type.startsWith("delete")) playCue("erase");
      else if (type.startsWith("insert")) playCue("key");
    };

    const change = (event: Event) => {
      if (!outsideCaseMedia(event.target) || unavailable(event.target)) return;
      const field = event.target;
      if (field instanceof HTMLSelectElement || field instanceof HTMLInputElement && ["checkbox", "radio", "range"].includes(field.type)) playCue("toggle");
    };

    document.addEventListener("click", click, true);
    document.addEventListener("input", input, true);
    document.addEventListener("change", change, true);
    return () => {
      document.removeEventListener("click", click, true);
      document.removeEventListener("input", input, true);
      document.removeEventListener("change", change, true);
    };
  }, []);

  return null;
}

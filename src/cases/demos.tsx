"use client";

import type { ComponentType } from "react";
import { MAX_PANELS, SystemSizeSlider } from "./luminasset/demos/system-size-slider";
import { ButtonDemo } from "./luminasset/demos/button-demo";
import { TokensPhone } from "./luminasset/demos/tokens-phone";
import { Variables } from "./luminasset/demos/variables";
import { CodeInputDemo, Inputs, PostcodeInputDemo, SelectDemo, TogglesDemo } from "./luminasset/demos/inputs";
import { EstimateSheet } from "./luminasset/demos/estimate-sheet";
import { Estimate } from "./luminasset/demos/estimate";
import { Moodboard, Wireframes } from "./luminasset/demos/moodboard";
import { CircleIcon, CpuIcon, DeviceMobileIcon, DropIcon, TriangleIcon } from "@phosphor-icons/react";
import { SiteSurvey } from "./luminasset/demos/site-survey";
import { LogicJump } from "./askflow/demos/logic-jump";
import { ProductPicker } from "./askflow/demos/product-picker";
import { KitButton, KitInput, KitMinimap, KitQuestionCard, KitSelect, KitSelection } from "./askflow/demos/kit";
import { CalendarDemo, ClassroomToolbar, HomeworkCard, ProgressCard } from "./tutor-iq/demos/kit";

/**
 * Live component demos for case studies (`kind: "component"`, see docs/case-template.md). Each demo is a
 * controlled component (`value` / `onValueChange`); `presets` become the block's tabs (a component's styles, a
 * screen's states). `frame`: device puts it in a phone; stage gives it the whole frame. Rebuilt in this codebase,
 * never copied from a client's code.
 */
type DemoValue = string | number;
export type Demo = {
  title: string;
  frame: "device" | "stage";
  initial: DemoValue;
  /** The tabs. `icon` replaces the number with an icon that plays `anim` (see .case-tabs-icon in home.css) when picked. */
  presets: { label: string; value: DemoValue; icon?: ComponentType<{ weight?: "regular" | "fill" }>; anim?: "drop" | "pulse" | "tilt" | "spin" | "bounce" }[];
  /** The frame's proportions in a case study (width / height); a phone needs a tall frame, one button a short one. */
  ratio?: string;
  /** Number the tabs (1 Start, 2 Onboarding…), like the step tabs on screens, instead of plain labels. */
  numbered?: boolean;
  /** Show the "Interactive" note (default): above the phone, or at the top of a stage frame. Off for frames that
   * aren't a component, like the moodboard. */
  badge?: boolean;
  /** Where the note sits in a stage frame (CSS `top`), to put it just above the mock instead of at the frame's top. */
  hintTop?: string;
  /** What the tabs pick, for screen readers ("Styles", "Sections"). */
  presetsLabel?: string;
  Component: ComponentType<{ value: DemoValue; onValueChange: (value: DemoValue) => void }>;
};

export const demos: Record<string, Demo> = {
  "luminasset/system-size-slider": {
    title: "System size slider",
    frame: "device",
    initial: 32,
    presets: [{ label: "Empty roof", value: 0 }, { label: "Half", value: 32 }, { label: "Whole roof", value: MAX_PANELS }],
    Component: SystemSizeSlider as Demo["Component"],
  },
  "luminasset/moodboard": {
    title: "Moodboard", frame: "stage", initial: "clear", presetsLabel: "Visual directions", ratio: "1152 / 724", badge: false,
    presets: [
      { label: "Clear", value: "clear", icon: DropIcon, anim: "drop" },
      { label: "Tech", value: "tech", icon: CpuIcon, anim: "pulse" },
      { label: "Apple Style", value: "apple", icon: DeviceMobileIcon, anim: "tilt" },
      { label: "Thin & Angled", value: "thin", icon: TriangleIcon, anim: "spin" },
      { label: "Rounded", value: "rounded", icon: CircleIcon, anim: "bounce" },
    ],
    Component: Moodboard as Demo["Component"],
  },
  "luminasset/wireframes": {
    title: "Wireframes", frame: "stage", initial: "start", presetsLabel: "Wireframe sections", ratio: "1152 / 724", badge: false, numbered: true,
    presets: [["Start", "start"], ["Onboarding", "onboarding"], ["Order tracking", "tracking"], ["New address", "address"], ["Monitoring", "monitoring"], ["Actions", "actions"]].map(([label, value]) => ({ label, value })),
    Component: Wireframes as Demo["Component"],
  },
  "luminasset/estimate": {
    title: "Estimate", frame: "device", initial: "api", presetsLabel: "Roof data",
    presets: [{ label: "With Solar API", value: "api" }, { label: "Without Solar API", value: "manual" }],
    Component: Estimate as Demo["Component"],
  },
  "luminasset/estimate-sheet": {
    title: "Estimate sheet", frame: "device", initial: "middle", presetsLabel: "Sheet",
    presets: [{ label: "Sheet down", value: "down" }, { label: "Middle", value: "middle" }, { label: "Sheet up", value: "up" }],
    Component: EstimateSheet as Demo["Component"],
  },
  "luminasset/site-survey": {
    title: "Site survey", frame: "device", initial: "direct", presetsLabel: "Order type",
    presets: [{ label: "Direct", value: "direct" }, { label: "PPA", value: "ppa" }],
    Component: SiteSurvey as Demo["Component"],
  },
  "luminasset/button": {
    title: "Button", frame: "stage", initial: "blue", presetsLabel: "Styles", ratio: "1152 / 320",
    presets: [["White", "white"], ["Blue", "blue"], ["Black", "black"], ["Dark", "dark"], ["Ghost", "ghost"], ["Outline", "outline"], ["Destructive", "destructive"]].map(([label, value]) => ({ label, value })),
    Component: ButtonDemo as Demo["Component"],
  },
  "luminasset/inputs": { title: "Inputs", frame: "stage", initial: "", presets: [], ratio: "1152 / 560", hintTop: "calc(50% - 206px)", Component: Inputs as Demo["Component"] },
  // The same components one per frame, for a grid of frames (kind "components"); the grid shows one Interactive note.
  "luminasset/input": { title: "Input", frame: "stage", initial: "", presets: [], ratio: "568 / 260", Component: PostcodeInputDemo as Demo["Component"] },
  "luminasset/select": { title: "Select", frame: "stage", initial: "", presets: [], ratio: "568 / 260", Component: SelectDemo as Demo["Component"] },
  "luminasset/otp": { title: "OTP input", frame: "stage", initial: "", presets: [], ratio: "568 / 260", Component: CodeInputDemo as Demo["Component"] },
  "luminasset/toggles": { title: "Toggles", frame: "stage", initial: "", presets: [], ratio: "568 / 260", Component: TogglesDemo as Demo["Component"] },
  "askflow/logic-jump": { title: "Logic jump", frame: "stage", initial: "", presets: [], ratio: "1152 / 560", Component: LogicJump as Demo["Component"] },
  "askflow/product-picker": { title: "Product picker", frame: "stage", initial: "", presets: [], ratio: "1152 / 600", Component: ProductPicker as Demo["Component"] },
  // AskFlow UI kit, one per frame, for a components grid (docs/cases/askflow.md, Components chapter).
  "askflow/button": {
    title: "Button", frame: "stage", initial: "primary", presetsLabel: "Styles", ratio: "1152 / 300",
    presets: [["Primary", "primary"], ["Secondary", "secondary"], ["Ghost", "ghost"], ["Toolbar", "toolbar"], ["Link", "link"], ["Toolbar - Highlighted", "highlighted"]].map(([label, value]) => ({ label, value })),
    Component: KitButton as Demo["Component"],
  },
  "askflow/input": { title: "Input", frame: "stage", initial: "", presets: [], ratio: "568 / 300", Component: KitInput as Demo["Component"] },
  "askflow/select": { title: "Select", frame: "stage", initial: "", presets: [], ratio: "568 / 300", Component: KitSelect as Demo["Component"] },
  "askflow/selection": { title: "Selection", frame: "stage", initial: "", presets: [], ratio: "568 / 300", Component: KitSelection as Demo["Component"] },
  "askflow/question-card": {
    title: "Question card", frame: "stage", initial: "builder", presetsLabel: "View", ratio: "568 / 380",
    presets: [{ label: "Builder", value: "builder" }, { label: "Insights", value: "insights" }],
    Component: KitQuestionCard as Demo["Component"],
  },
  "askflow/minimap": { title: "Minimap", frame: "stage", initial: "", presets: [], ratio: "568 / 380", Component: KitMinimap as Demo["Component"] },
  // Tutor IQ design-system parts (docs/cases/tutor-iq.md, System chapter): local sample data only.
  "tutor-iq/homework-card": {
    title: "Homework status card", frame: "stage", initial: "todo", presetsLabel: "Status", ratio: "568 / 360",
    presets: [["To-do", "todo"], ["Submitted", "submitted"], ["Waiting", "waiting"], ["Feedback", "feedback"], ["Overdue", "overdue"], ["Cancelled", "cancelled"]].map(([label, value]) => ({ label, value })),
    Component: HomeworkCard as Demo["Component"],
  },
  "tutor-iq/progress-card": {
    title: "Progress card", frame: "stage", initial: "lessons", presetsLabel: "View", ratio: "568 / 360",
    presets: [{ label: "Lessons", value: "lessons" }, { label: "Homework", value: "homework" }],
    Component: ProgressCard as Demo["Component"],
  },
  "tutor-iq/calendar": {
    title: "Calendar and availability", frame: "stage", initial: "week", presetsLabel: "View", ratio: "1152 / 600",
    presets: [{ label: "Week", value: "week" }, { label: "Availability", value: "availability" }],
    Component: CalendarDemo as Demo["Component"],
  },
  "tutor-iq/classroom-toolbar": {
    title: "Classroom toolbar", frame: "stage", initial: "desktop", presetsLabel: "Layout", ratio: "1152 / 620",
    presets: [{ label: "Desktop", value: "desktop" }, { label: "Mobile", value: "mobile" }],
    Component: ClassroomToolbar as Demo["Component"],
  },
  "luminasset/variables": { title: "Variables", frame: "stage", initial: "", presets: [], ratio: "1152 / 720", hintTop: "calc(14% - 30px)", Component: Variables as Demo["Component"] },
  "luminasset/tokens-phone": {
    title: "Tokens, in the phone", frame: "device", initial: "colour", presetsLabel: "Sections",
    presets: [{ label: "Colour", value: "colour" }, { label: "Type", value: "type" }, { label: "Shape", value: "shape" }],
    Component: TokensPhone as Demo["Component"],
  },
};

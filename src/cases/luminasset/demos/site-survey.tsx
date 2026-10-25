"use client";

import { useState, type ComponentType } from "react";
import { ArrowsLeftRightIcon, BankIcon, BatteryFullIcon, BellIcon, CalendarCheckIcon, CaretRightIcon, CellSignalFullIcon, ChatCircleIcon, CheckIcon, CurrencyGbpIcon, HouseIcon, InfoIcon, LightningIcon, PlugIcon, PlusIcon, SignatureIcon, SlidersHorizontalIcon, SolarPanelIcon, UserIcon, WifiHighIcon, XIcon } from "@phosphor-icons/react";
import { geist } from "../font";
import { laVars } from "../tokens";
import { OpenedScreen } from "../components/opened-screen";
import "./site-survey.css";

/**
 * The order screen at the Site survey stage (Figma 1007:13269, PPA 1028:44176), to try: the header stays put while
 * the page scrolls, the current stage pulses, every ⓘ opens that stage's tooltip, and each row or button opens its
 * screen one level deep (Help, Cancel, Details, Switch plan, Actions, Add address, Updates), with a back arrow.
 * `value` is the order type, set by the block's tabs: direct or ppa. Dates and amounts are samples.
 */
type Stage = { name: string; note: string; icon: ComponentType<{ weight?: "fill" | "bold" }>; shape?: "optional" | "payment"; tip: string };
const received: Stage = { name: "Order received", note: "2 Jun 2026", icon: CheckIcon, tip: "We've got your order and the estimate it's based on." };
const survey: Stage = { name: "Site survey", note: "1–2 weeks", icon: HouseIcon, tip: "An engineer visits to check your roof, electrics and access in person, so we can confirm the system design and final price before any work begins." };
const council: Stage = { name: "Council review", note: "8–12 weeks · £548", icon: BankIcon, shape: "optional", tip: "Some homes need planning permission. If yours does, the council takes 8–12 weeks and charges a fee." };
const grid: Stage = { name: "Grid connection", note: "8–12 weeks", icon: PlugIcon, tip: "Your local network operator approves the connection. It usually takes 8–12 weeks." };
const install: Stage = { name: "Installation", note: "1–3 days", icon: SolarPanelIcon, tip: "The fitting itself: scaffolding, panels and inverter, usually in one to three days." };
const journeys: Record<string, { stages: Stage[]; switchTo: string }> = {
  direct: {
    switchTo: "Switch to free installation",
    stages: [received, survey, council,
      { name: "Sign contract", note: "1–2 working days", icon: SignatureIcon, tip: "We send the final contract, with your confirmed design and price, to sign in the app." },
      { name: "Deposit", note: "£5,199 · 30%", icon: CurrencyGbpIcon, shape: "payment", tip: "Paid when we order your equipment. The share is set for each order, between 30% and 50%." },
      grid, install,
      { name: "Final payment", note: "£12,131", icon: CurrencyGbpIcon, shape: "payment", tip: "The balance, once your system is installed and switched on." }],
  },
  ppa: {
    switchTo: "Switch to buying your system",
    stages: [received, survey, council,
      { name: "PPA agreement", note: "1–2 working days", icon: SignatureIcon, tip: "You sign a power purchase agreement: nothing upfront, you pay for the power the panels make." },
      grid, install],
  },
};
const screens = {
  notifications: ["/cases/luminasset/notifications.png", "Notification centre"],
  address: ["/cases/luminasset/address-add.png", "Add a new address"],
  actions: ["/cases/luminasset/actions.png", "Order actions: edit, switch plan, ask, cancel"],
  change: ["/cases/luminasset/change-type.png", "Switching the order type"],
  help: ["/cases/luminasset/help.png", "Help and support"],
  cancel: ["/cases/luminasset/cancel.png", "Cancel order, with the refund shown first"],
  details: ["/cases/luminasset/order-details.png", "All order details"],
} as const;

export function SiteSurvey({ value }: { value: string | number; onValueChange?: (value: string | number) => void }) {
  const journey = journeys[String(value)] ?? journeys.direct;
  const [tip, setTip] = useState<string | null>(null);
  const [opened, setOpened] = useState<keyof typeof screens | null>(null);
  const open = (screen: keyof typeof screens) => { setTip(null); setOpened(screen); };
  const rows: { id: keyof typeof screens; title: string; note: string; icon: ComponentType<{ weight?: "fill" | "bold" }>; tone?: string }[] = [
    { id: "actions", title: "Edit system", note: "Add or remove panels", icon: SlidersHorizontalIcon },
    { id: "change", title: "Change order type", note: journey.switchTo, icon: ArrowsLeftRightIcon },
    { id: "help", title: "Have a question?", note: "Find answers or get in touch", icon: ChatCircleIcon, tone: "amber" },
    { id: "cancel", title: "Cancel order", note: "Request to cancel and get a refund", icon: XIcon, tone: "red" },
  ];

  return <div className={`la-survey ${geist.variable}`} style={laVars} onClick={() => setTip(null)}>
    <header className="la-survey-header">
      <div className="la-survey-status" aria-hidden><span>9:41</span><span><CellSignalFullIcon weight="fill" /><WifiHighIcon weight="bold" /><BatteryFullIcon weight="fill" /></span></div>
      <div className="la-survey-bar">
        <span className="la-survey-user"><span className="la-survey-round"><UserIcon weight="fill" /></span>User Name</span>
        <button type="button" className="la-survey-round" aria-label="Notifications" onClick={() => open("notifications")}><BellIcon weight="fill" /></button>
        <button type="button" className="la-survey-round la-survey-add" aria-label="Add new address" onClick={() => open("address")}><PlusIcon weight="bold" /></button>
      </div>
    </header>

    <div className="la-survey-scroll" key={String(value)}>
      <div className="la-survey-panel" aria-hidden />
      <p className="la-survey-address"><i>!</i>10 Downing Street, London</p>
      <h3 className="la-survey-title">32 Panels</h3>
      <ol className="la-survey-stages">
        {journey.stages.map((stage, index) => {
          const state = index === 0 ? "done" : index === 1 ? "current" : "upcoming";
          const Icon = stage.icon;
          return <li key={stage.name} data-state={state} data-shape={stage.shape}>
            <span className="la-survey-node"><Icon weight={state === "done" ? "bold" : "fill"} /></span>
            <span className="la-survey-text">
              <span className="la-survey-name">{stage.name}
                {index > 0 && <button type="button" aria-label={`About ${stage.name}`} aria-expanded={tip === stage.name} onClick={event => { event.stopPropagation(); setTip(tip === stage.name ? null : stage.name); }}><InfoIcon weight="fill" /></button>}
              </span>
              <span className="la-survey-note">{stage.note}</span>
            </span>
            {tip === stage.name && <span className="la-survey-tip" role="tooltip"><b>{stage.name}</b>{stage.tip}</span>}
          </li>;
        })}
      </ol>
      <div className="la-survey-rows">
        {rows.map(row => <button key={row.id} type="button" onClick={() => open(row.id)}>
          <span className="la-survey-row-icon" data-tone={row.tone}><row.icon weight="fill" /></span>
          <span><b>{row.title}</b><span>{row.note}</span></span>
          <CaretRightIcon className="la-survey-caret" weight="bold" />
        </button>)}
      </div>
      <dl className="la-survey-facts">
        <div><dt><SolarPanelIcon weight="fill" />System size</dt><dd>32/64 panels</dd></div>
        <div><dt><LightningIcon weight="fill" />Energy output</dt><dd>20,283 kWh</dd></div>
        <div><dt><CalendarCheckIcon weight="fill" />Est. installation</dt><dd>Sep 2026</dd></div>
      </dl>
      <button type="button" className="la-survey-details" onClick={() => open("details")}>View All Details</button>
    </div>

    {opened && <OpenedScreen src={screens[opened][0]} alt={screens[opened][1]} onBack={() => setOpened(null)} />}
  </div>;
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeftIcon, ArrowRightIcon, ArrowsInIcon, BookOpenIcon, CalendarBlankIcon, CameraRotateIcon, CaretDownIcon, ChatCircleDotsIcon, ChatCircleIcon,
  CheckIcon, CopyIcon, DotsThreeIcon, HandIcon, HashIcon, MicrophoneIcon, MicrophoneSlashIcon, MonitorArrowUpIcon, NoteIcon,
  NotePencilIcon, PencilSimpleIcon, PhoneSlashIcon, PowerIcon, SmileyIcon, StarIcon, VideoCameraIcon, VideoCameraSlashIcon, XIcon,
} from "@phosphor-icons/react";
import { inter } from "../font";
import "./kit.css";

/**
 * Four product-specific parts of the Tutor IQ design system (Figma file 5Hop6zexo63fTnqVvHwh7t), rebuilt to try: the
 * homework status card (8175:17630), the progress card (8220:11589), calendar events and availability (8503:6476) and
 * the classroom toolbar (8731:1555). Colours, type and radii come from those boards (Inter; ink #0D0B08; muted #7C7768;
 * surfaces #F7F6F2 / #EFEDE5; amber #D97706). Everything is local sample data: no homework, booking, call, camera,
 * microphone or recording is real. Specs: docs/cases/tutor-iq.md, section 4.
 */
function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`tqk ${inter.variable} ${className}`}>{children}</div>;
}
function Switch({ label, on, onChange, hideLabel = false }: { label: string; on: boolean; onChange: (on: boolean) => void; hideLabel?: boolean }) {
  return <label className="tqk-switch"><input type="checkbox" checked={on} onChange={event => onChange(event.target.checked)} aria-label={hideLabel ? label : undefined} /><i aria-hidden />{!hideLabel && label}</label>;
}
function Tabs<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { label: string; value: T }[]; value: T; onChange: (value: T) => void }) {
  return <div className="tqk-tabs" role="radiogroup" aria-label={label}>
    {options.map(option => <button key={option.value} type="button" role="radio" aria-checked={option.value === value} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}

/* Homework status card: the six source states as tabs; the card's own action moves it on, as a student would. */
type HomeworkStatus = "todo" | "submitted" | "waiting" | "feedback" | "overdue" | "cancelled";
export function HomeworkCard({ value, onValueChange }: { value: string | number; onValueChange: (value: string | number) => void }) {
  const status = String(value) as HomeworkStatus;
  // Feedback opened and a reschedule requested belong to the state they were made in; switching tabs resets them.
  const [openIn, setOpenIn] = useState<HomeworkStatus | null>(null);
  const [requestedIn, setRequestedIn] = useState<HomeworkStatus | null>(null);
  const open = openIn === status;
  const requested = requestedIn === status;
  // A submission settles into "waiting for feedback" after a moment, like the real hand-off to the tutor.
  useEffect(() => {
    if (status !== "submitted") return;
    const timer = window.setTimeout(() => onValueChange("waiting"), 1800);
    return () => window.clearTimeout(timer);
  }, [status, onValueChange]);
  const submittedOn = <span className="tqk-badge" data-tone="outline">Submitted: 5 February</span>;
  return <Surface className="tqk-center">
    <article className="tqk-hw" aria-live="polite">
      <div className="tqk-hw-head">
        <span className="tqk-hw-type" aria-hidden><NoteIcon /></span>
        <div><h4>Advanced Algebra</h4><p>Solve the ten equations on page 42 and show each step of your working.</p></div>
      </div>
      <hr />
      <div className="tqk-hw-foot">
        <div className="tqk-hw-meta">
          <span className="tqk-avatar" aria-label="Tutor Michael Chen">MC</span>
          {status === "todo" && <span className="tqk-badge">Due in 3 days</span>}
          {status === "overdue" && <span className="tqk-badge" data-tone="red">Overdue</span>}
          {status === "cancelled" && <><span className="tqk-badge" data-tone="red">Cancelled</span>{submittedOn}</>}
          {status === "feedback" && <><span className="tqk-badge"><StarIcon weight="fill" className="tqk-star" />4.5</span>{submittedOn}</>}
          {(status === "submitted" || status === "waiting") && submittedOn}
        </div>
        <div className="tqk-hw-actions">
          {status === "todo" && <button type="button" className="tqk-btn" data-tone="ink" onClick={() => onValueChange("submitted")} data-sound="success"><NotePencilIcon />Submit</button>}
          {status === "submitted" && <>
            <button type="button" className="tqk-btn" onClick={() => onValueChange("todo")}><NotePencilIcon />Edit</button>
            <span className="tqk-btn" data-tone="green"><CheckIcon weight="bold" />Submitted</span>
          </>}
          {status === "waiting" && <span className="tqk-waiting"><NotePencilIcon />Waiting for Feedback…</span>}
          {status === "feedback" && <button type="button" className="tqk-btn" data-tone="amber" aria-expanded={open} onClick={() => setOpenIn(open ? null : status)} data-sound={open ? "close" : "open"}><NoteIcon />{open ? "Hide Feedback" : "View Feedback"}</button>}
          {status === "overdue" && <button type="button" className="tqk-btn" disabled={requested} onClick={() => setRequestedIn(status)} data-sound="success"><ChatCircleDotsIcon />{requested ? "Reschedule requested" : "Request Reschedule"}</button>}
        </div>
      </div>
      {status === "feedback" && open && <div className="tqk-hw-feedback">
        <strong>Michael Chen · Tutor feedback</strong>
        <p>Clear working on the first seven. In questions 8–10, check the sign when you move a term across the equals sign.</p>
      </div>}
    </article>
  </Surface>;
}

/* Progress card: Lessons and Homework, as in the source. Hover a legend row to find its slice; hover the card for View Details. */
type ProgressView = "lessons" | "homework";
const progressData: Record<ProgressView, { label: string; count: number; color: string; star?: boolean }[]> = {
  lessons: [{ label: "Completed", count: 20, color: "#84cc16" }, { label: "Scheduled", count: 4, color: "#0d9488" }, { label: "Missed", count: 3, color: "#e11d48" }],
  homework: [{ label: "Completed", count: 20, color: "#84cc16" }, { label: "To do", count: 4, color: "#0d9488" }, { label: "Avg. Grade", count: 4.5, color: "#d97706", star: true }],
};
export function ProgressCard({ value, onValueChange }: { value: string | number; onValueChange: (value: string | number) => void }) {
  const view = String(value) as ProgressView;
  const [focus, setFocus] = useState<string | null>(null);
  const [details, setDetails] = useState(false);
  const rows = progressData[view];
  const slices = rows.filter(row => !row.star);
  const total = slices.reduce((sum, row) => sum + row.count, 0);
  // Donut slices as stroke-dash arcs on one circle (pathLength 100), so each animates its share.
  const arcs = slices.map((row, index) => ({ row, share: row.count / total * 100, start: slices.slice(0, index).reduce((sum, item) => sum + item.count / total * 100, 0) }));
  return <Surface className="tqk-center">
    <article className="tqk-progress">
      <div className="tqk-progress-head">
        <h4>Mathematics</h4>
        <Tabs label="Progress view" value={view} onChange={next => { setFocus(null); onValueChange(next); }} options={[{ label: "Lessons", value: "lessons" }, { label: "Homework", value: "homework" }]} />
      </div>
      <div className="tqk-progress-body">
        <ul className="tqk-legend">
          {rows.map(row => <li key={row.label} data-dim={focus && focus !== row.label ? "" : undefined} onPointerEnter={() => !row.star && setFocus(row.label)} onPointerLeave={() => setFocus(null)}>
            {row.star ? <StarIcon weight="fill" style={{ color: row.color }} /> : <i style={{ background: row.color }} />}
            <span>{row.label}</span><b>{row.count}</b>
          </li>)}
        </ul>
        <span className="tqk-sep" aria-hidden />
        <svg className="tqk-donut" viewBox="0 0 42 42" role="img" aria-label={`${total} ${view}: ${slices.map(row => `${row.count} ${row.label.toLowerCase()}`).join(", ")}`}>
          {arcs.map(({ row, share, start }) => <circle key={`${view}-${row.label}`} cx="21" cy="21" r="15.9" pathLength={100} strokeDasharray={`${Math.max(0, share - 1.2)} ${100 - share + 1.2}`} strokeDashoffset={25 - start}
            style={{ stroke: row.color }} data-dim={focus && focus !== row.label ? "" : undefined} />)}
          <text x="21" y="21">{total}</text>
        </svg>
      </div>
      <button type="button" className="tqk-details" onClick={() => setDetails(true)} data-sound="open"><BookOpenIcon />View Details</button>
      {details && <div className="tqk-progress-sheet" role="status">
        <p><strong>{view === "lessons" ? "20 of 27 lessons completed" : "20 tasks completed, 4 to do"}</strong>{view === "lessons" ? "Next lesson: Tuesday, 3:00 PM with Michael Chen." : "Average grade 4.5 across marked homework."}</p>
        <button type="button" className="tqk-btn" onClick={() => setDetails(false)} data-sound="close">Close</button>
      </div>}
    </article>
  </Surface>;
}

/* Calendar: a week of lessons (select, cancel or restore one) and the tutor's weekly availability with a booking link. */
type CalendarView = "week" | "availability";
type CalEvent = { id: string; day: number; time: string; name: string; subject: string; current?: boolean; special?: boolean };
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const calEvents: CalEvent[] = [
  { id: "a", day: 0, time: "09:00 – 10:00", name: "Alex Thompson", subject: "Algebra" },
  { id: "b", day: 0, time: "15:00 – 15:45", name: "Liza Thompson", subject: "Physics" },
  { id: "c", day: 1, time: "All day", name: "School holiday", subject: "Special event", special: true },
  { id: "d", day: 2, time: "10:00 – 11:00", name: "Alex Thompson", subject: "Algebra", current: true },
  { id: "e", day: 2, time: "16:00 – 17:00", name: "Emily Park", subject: "Chemistry" },
  { id: "f", day: 3, time: "14:00 – 14:30", name: "Intro call", subject: "30-min intro call" },
  { id: "g", day: 4, time: "11:00 – 12:00", name: "Liza Thompson", subject: "Physics" },
];
export function CalendarDemo({ value, onValueChange }: { value: string | number; onValueChange: (value: string | number) => void }) {
  const view = String(value) as CalendarView;
  const [week, setWeek] = useState(0);
  const [selected, setSelected] = useState<string>("d");
  const [cancelled, setCancelled] = useState<string[]>(["g"]);
  const [open, setOpen] = useState<boolean[]>([true, true, true, true, true, false, false]);
  const [linkOn, setLinkOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"schedule" | "links">("schedule");
  useEffect(() => { if (!copied) return; const timer = window.setTimeout(() => setCopied(false), 1500); return () => window.clearTimeout(timer); }, [copied]);
  // The sample week starts on Monday 4 May 2026; the arrows move whole weeks.
  const dateOf = (index: number) => new Date(2026, 4, 4 + week * 7 + index);
  const short = (date: Date) => date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const event = calEvents.find(item => item.id === selected);
  const isCancelled = !!event && cancelled.includes(event.id);
  return <Surface className="tqk-cal">
    {view === "week" && <div className="tqk-cal-bar">
      <div className="tqk-cal-nav">
        <button type="button" className="tqk-icon-btn" aria-label="Previous week" onClick={() => setWeek(week - 1)}><ArrowLeftIcon /></button>
        <strong>{short(dateOf(0))} – {short(dateOf(4))}</strong>
        <button type="button" className="tqk-icon-btn" aria-label="Next week" onClick={() => setWeek(week + 1)}><ArrowRightIcon /></button>
        <button type="button" className="tqk-btn" disabled={week === 0} onClick={() => setWeek(0)}>Today</button>
      </div>
      <button type="button" className="tqk-btn" data-tone="ink" onClick={() => onValueChange("availability")} data-sound="open"><CalendarBlankIcon />Availability</button>
    </div>}
    {view === "week" ? <div className="tqk-cal-body">
      <div className="tqk-week" role="grid" aria-label="Sample week of lessons">
        {days.map((day, index) => <div key={day} className="tqk-day" role="row">
          <div className="tqk-day-head" data-today={week === 0 && index === 2 ? "" : undefined}><span>{day.toUpperCase()}</span><b>{dateOf(index).getDate()}</b></div>
          {week === 0 ? calEvents.filter(item => item.day === index).map(item => <button key={item.id} type="button" role="gridcell" className="tqk-event"
            aria-selected={selected === item.id} data-current={item.current ? "" : undefined} data-cancelled={cancelled.includes(item.id) ? "" : undefined}
            onClick={() => setSelected(item.id)}>
            <b>{item.name}</b><span>{item.time}</span>
          </button>) : <span className="tqk-day-empty">No lessons</span>}
        </div>)}
      </div>
      <aside className="tqk-cal-side" aria-live="polite">
        {week === 0 && event ? <>
          <div className="tqk-event-card" data-cancelled={isCancelled ? "" : undefined}>
            <span className="tqk-muted">{event.time}</span>
            <strong>{event.special ? event.name : event.subject}</strong>
            <span className="tqk-event-meta">{event.special ? <>Birthday · All day</> : <><span className="tqk-avatar" data-size="xs">{event.name.split(" ").map(part => part[0]).join("")}</span>{event.name}<i className="tqk-dot" />Platform</>}</span>
          </div>
          {!event.special && <button type="button" className="tqk-btn" data-tone={isCancelled ? "ink" : undefined}
            onClick={() => setCancelled(isCancelled ? cancelled.filter(id => id !== event.id) : [...cancelled, event.id])} data-sound={isCancelled ? "success" : "erase"}>
            {isCancelled ? "Restore lesson" : "Cancel lesson"}
          </button>}
        </> : <p className="tqk-muted">Pick a lesson to see it here.</p>}
      </aside>
    </div> : <div className="tqk-avail">
      <div className="tqk-avail-panel">
        <h4>Weekly schedule</h4>
        <p className="tqk-muted">Set your available hours per day. Booking links use these as bookable hours.</p>
        <Tabs label="Availability settings" value={tab} onChange={setTab} options={[{ label: "Schedule", value: "schedule" }, { label: "Booking Links", value: "links" }]} />
        {tab === "schedule" ? <ul className="tqk-avail-days">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => <li key={day}>
            <Switch label={`Available on ${day}`} hideLabel on={open[index]} onChange={on => setOpen(open.map((value, i) => i === index ? on : value))} />
            <b>{day}</b>
            {open[index] ? <span className="tqk-time">09:00 – 17:00</span> : <span className="tqk-muted">Unavailable</span>}
          </li>)}
        </ul> : <div className="tqk-link">
          <div><strong>30-min intro call</strong><span className="tqk-muted"><i className="tqk-dot" data-off={linkOn ? undefined : ""} />{linkOn ? "Active" : "Inactive"} · 30 min</span></div>
          <button type="button" className="tqk-icon-btn" aria-label="Copy booking link" onClick={() => setCopied(true)} data-sound="success">{copied ? <CheckIcon /> : <CopyIcon />}</button>
          <button type="button" className="tqk-icon-btn" aria-label="Edit booking link (not available in this demo)" disabled><PencilSimpleIcon /></button>
          <button type="button" className="tqk-icon-btn" data-tone={linkOn ? "orange" : undefined} aria-pressed={linkOn} aria-label="Booking link active" onClick={() => setLinkOn(!linkOn)} data-sound="toggle"><PowerIcon /></button>
        </div>}
        <div className="tqk-avail-foot">
          <p className="tqk-avail-sum" aria-live="polite">{tab === "schedule" ? `${open.filter(Boolean).length} days open · ${open.filter(Boolean).length * 8} bookable hours a week` : copied ? "Link copied (sample)" : " "}</p>
          <button type="button" className="tqk-btn" data-tone="ink" onClick={() => onValueChange("week")} data-sound="close">Done</button>
        </div>
      </div>
    </div>}
  </Surface>;
}

/* Classroom toolbar: the desktop bar and the mobile bar (with its expanding row), over a small illustrative classroom. */
type ToolbarView = "desktop" | "mobile";
export function ClassroomToolbar({ value }: { value: string | number }) {
  const view = String(value) as ToolbarView;
  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [panel, setPanel] = useState<"none" | "share" | "board">("none");
  const [chat, setChat] = useState(false);
  const [hand, setHand] = useState(false);
  const [rec, setRec] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [left, setLeft] = useState(false);
  // The mobile bar's extra row; it belongs to the layout it was opened in.
  const [moreIn, setMoreIn] = useState<ToolbarView | null>(null);
  const more = moreIn === view;
  const [reaction, setReaction] = useState(0);
  const timer = useRef(0);
  useEffect(() => {
    if (!rec) return;
    timer.current = window.setInterval(() => setSeconds(value => value + 1), 1000);
    return () => window.clearInterval(timer.current);
  }, [rec]);
  const clock = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(part => String(part).padStart(2, "0")).join(":");
  const toggle = (name: string, on: boolean, onChange: () => void, icons: [ReactNode, ReactNode], tone?: string) =>
    <button type="button" className="tqk-tool" aria-pressed={on} aria-label={name} data-tone={tone} onClick={onChange}>{on ? icons[1] : icons[0]}</button>;
  const micBtn = toggle("Microphone", mic, () => setMic(!mic), [<MicrophoneSlashIcon key="off" />, <MicrophoneIcon key="on" />]);
  const camBtn = toggle("Camera", cam, () => setCam(!cam), [<VideoCameraSlashIcon key="off" />, <VideoCameraIcon key="on" />]);
  const shareBtn = toggle("Share screen", panel === "share", () => setPanel(panel === "share" ? "none" : "share"), [<MonitorArrowUpIcon key="a" />, <MonitorArrowUpIcon key="b" weight="fill" />], "sky");
  const boardBtn = toggle("Whiteboard", panel === "board", () => setPanel(panel === "board" ? "none" : "board"), [<HashIcon key="a" />, <HashIcon key="b" weight="bold" />], "purple");
  const reactBtn = <button type="button" className="tqk-tool" aria-label="Send a reaction" onClick={() => setReaction(value => value + 1)} data-sound="success"><SmileyIcon /></button>;
  const handBtn = toggle("Raise hand", hand, () => setHand(!hand), [<HandIcon key="a" />, <HandIcon key="b" weight="fill" />]);
  const chatBtn = toggle("Chat", chat, () => setChat(!chat), [<ChatCircleIcon key="a" />, <ChatCircleIcon key="b" weight="fill" />]);
  const leaveBtn = <button type="button" className="tqk-tool" data-tone="red" aria-label="Leave lesson" onClick={() => { setLeft(true); setRec(false); }} data-sound="close"><PhoneSlashIcon /></button>;
  return <Surface className={`tqk-class tqk-class-${view}`}>
    <div className="tqk-room">
      <div className="tqk-room-main" data-panel={panel}>
        {panel === "board" ? <div className="tqk-board" aria-label="Whiteboard (illustration)"><span>2x + 3 = 11</span><span>2x = 8</span><span>x = 4</span></div>
          : panel === "share" ? <div className="tqk-share" aria-label="Shared screen (illustration)"><b>Page 42 · Linear equations</b><i /><i /><i /></div>
          : <div className="tqk-tile" data-cam={cam ? "" : undefined}><span className="tqk-avatar" data-size="lg">AT</span><em>Alex · student{hand ? " ✋" : ""}</em></div>}
        <div className="tqk-tile tqk-tile-small"><span className="tqk-avatar">MC</span><em>Michael · tutor</em></div>
        {reaction > 0 && <span key={reaction} className="tqk-reaction" aria-hidden>👏</span>}
      </div>
      {chat && <aside className="tqk-chat" aria-label="Classroom chat (sample)">
        <b>Chat</b><p><strong>Michael</strong>Try question 3 on the board.</p><p data-me=""><strong>You</strong>Is it x = 4?</p>
      </aside>}
      {left && <div className="tqk-left" role="status"><p>You left the lesson.</p><button type="button" className="tqk-btn" data-tone="ink" onClick={() => setLeft(false)} data-sound="open">Rejoin</button></div>}
    </div>
    {view === "desktop" ? <div className="tqk-bar">
      <div className="tqk-bar-title"><button type="button" className="tqk-tool" data-tone="plain" aria-label="Minimise classroom (not available in this demo)" disabled><ArrowsInIcon /></button><div><b>Algebra Foundations</b><span>3:00 PM – 3:45 PM</span></div></div>
      <div className="tqk-bar-tools">
        <span className="tqk-group"><button type="button" className="tqk-tool" data-tone="plain" aria-label="Microphone options (not available in this demo)" disabled><CaretDownIcon /></button>{micBtn}</span>
        <span className="tqk-group"><button type="button" className="tqk-tool" data-tone="plain" aria-label="Camera options (not available in this demo)" disabled><CaretDownIcon /></button>{camBtn}</span>
        {shareBtn}{boardBtn}{reactBtn}{handBtn}{chatBtn}
      </div>
      <div className="tqk-bar-end">
        <button type="button" className="tqk-rec" aria-pressed={rec} onClick={() => setRec(!rec)}><i data-on={rec ? "" : undefined} />REC<span>{clock}</span></button>
        {leaveBtn}
      </div>
    </div> : <div className="tqk-mbar">
      {more && <div className="tqk-mbar-row">{shareBtn}{boardBtn}{reactBtn}{handBtn}</div>}
      <div className="tqk-mbar-row">
        <button type="button" className="tqk-tool" aria-expanded={more} aria-label={more ? "Fewer tools" : "More tools"} data-tone={more ? "pressed" : undefined} onClick={() => setMoreIn(more ? null : view)} data-sound={more ? "close" : "open"}>{more ? <XIcon /> : <DotsThreeIcon weight="bold" />}</button>
        <button type="button" className="tqk-tool" aria-label="Switch camera (not available in this demo)" disabled><CameraRotateIcon /></button>
        {micBtn}{camBtn}{chatBtn}{leaveBtn}
      </div>
    </div>}
  </Surface>;
}

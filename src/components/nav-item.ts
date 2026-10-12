// A sidebar row. A plain module (not "use client") so server components can use it too.
export const itemClass = (on: boolean) =>
  `flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[14px] transition-colors duration-150 ${
    on ? "bg-raised text-ink shadow-card" : "text-ink-2 hover:bg-line hover:text-ink"
  }`;

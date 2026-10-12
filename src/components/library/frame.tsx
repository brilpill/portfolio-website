import Link from "next/link";
import { profile } from "@/content/profile";
import { itemClass } from "../nav-item";
import { Monogram } from "../project-icon";
import { ThemeToggle } from "../theme-toggle";
import { LibraryIcon } from "./icons";

/** The site's left rail, holding the library's own rows. Same shape as the home page's sidebar. */
export function SidebarFrame({ children }: { children: React.ReactNode }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col p-2 lg:flex">
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto no-scrollbar">
        <Link href="/" className={itemClass(false)}>
          <Monogram size={14} />
          Home
        </Link>
        {children}
      </nav>

      <div className="flex items-center gap-2.5 px-2 pt-3">
        <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-[12px] font-semibold text-paper">
          OB
        </span>
        <div className="flex-1 leading-tight">
          <div className="text-[14px] font-medium">{profile.name}</div>
          <div className="text-[12px] text-muted">{profile.role}</div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

/** A labelled group of rows in the rail. */
export function RailGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 flex flex-col gap-0.5">
      <span className="label px-2.5 py-1.5">{label}</span>
      {children}
    </div>
  );
}

/** A rail row's count, right-aligned and quiet. */
export function Count({ n }: { n: number }) {
  return <span className="ml-auto font-mono text-[11px] tabular-nums text-muted">{n}</span>;
}

/** The phone's top bar: back home, where you are, the theme. */
export function MobileBar({ back = "/", title }: { back?: string; title: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/85 px-4 py-3 backdrop-blur lg:hidden">
      <Link href={back} className="flex items-center gap-3" aria-label="Back">
        <Monogram size={16} />
      </Link>
      <span className="flex items-center gap-2 text-[14px] font-medium">
        <LibraryIcon />
        {title}
      </span>
      <span className="ml-auto">
        <ThemeToggle />
      </span>
    </header>
  );
}

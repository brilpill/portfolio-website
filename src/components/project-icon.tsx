import type { Project } from "@/content/projects";

/** App-style icon for a project: its accent with the first letter. */
export function ProjectIcon({ project, size = 18 }: { project: Project; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center font-semibold text-white"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        fontSize: Math.round(size * 0.52),
        lineHeight: 1,
        background: `linear-gradient(160deg, color-mix(in oklab, ${project.accent} 88%, white), color-mix(in oklab, ${project.accent} 78%, black))`,
        boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.25)",
      }}
    >
      {project.title.charAt(0)}
    </span>
  );
}

/** My mark: a dark rounded square with "ob". */
export function Monogram({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center bg-[#121217] font-semibold text-white dark:bg-white dark:text-[#121217]"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        fontSize: Math.round(size * 0.44),
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}
    >
      ob
    </span>
  );
}

/** Round avatar with initials, for the profile button. */
export function Avatar({ size = 36 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-full bg-[#121217] font-medium text-white dark:bg-white dark:text-[#121217]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      OB
    </span>
  );
}

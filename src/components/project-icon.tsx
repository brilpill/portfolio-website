import type { Project } from "@/content/projects";

export function ProjectIcon({ project, size = 20 }: { project: Project; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-[6px] font-mono font-medium text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `linear-gradient(145deg, ${project.accent}, color-mix(in oklab, ${project.accent} 70%, black))`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
      }}
    >
      {project.title.charAt(0)}
    </span>
  );
}

export function Monogram({ size = 20 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-full bg-ink font-mono font-semibold text-paper"
      style={{ width: size * 1.6, height: size, fontSize: size * 0.48 }}
    >
      bp
    </span>
  );
}

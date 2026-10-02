"use client";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-line hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 2.75a5.25 5.25 0 0 1 0 10.5z" fill="currentColor" />
      </svg>
    </button>
  );
}

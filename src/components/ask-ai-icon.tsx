/** A rounded four-point star centred on (x, y) with radius r: concave sides, softened tips. */
const star = (x: number, y: number, r: number, k = .18) =>
  `M${x} ${y - r}Q${x + r * k} ${y - r * k} ${x + r} ${y}Q${x + r * k} ${y + r * k} ${x} ${y + r}Q${x - r * k} ${y + r * k} ${x - r} ${y}Q${x - r * k} ${y - r * k} ${x} ${y - r}Z`;

/**
 * Ask AI's mark, after ktz.dk: a big star and a small one. Inside an `.ask-ai-trigger`, hover and keyboard
 * focus spring the stars apart (the small one up and left, the big one down and right), and while the
 * trigger is expanded they fold into a cross. Styles live in home.css.
 */
export function AskAiIcon({ size = 16 }: { size?: number }) {
  return (
    <span className="ask-ai-icon" style={{ width: size, height: size }} aria-hidden>
      <svg className="ask-ai-stars" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path data-star="big" d={star(14, 14, 6.6)} />
        <path data-star="small" d={star(7, 7, 3.6)} />
      </svg>
      <svg className="ask-ai-close" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 7l10 10M17 7L7 17" /></svg>
    </span>
  );
}

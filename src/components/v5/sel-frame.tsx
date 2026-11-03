/** The selection frame from the design system, shown on hover and keyboard focus: a blue edge, square handles and an
 * optional tag on top. Project and article cards (Project Card 1326:24873) add handles at the edge midpoints and the
 * crossed lines Figma draws over a selected image; without `card` it has corner handles only. */
export function SelFrame({ tag, card = false }: { tag?: string; card?: boolean }) {
  return (
    <span className="v5-sel" data-card={card || undefined} aria-hidden>
      {card && (
        <svg className="v5-sel-x" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 0 100 100M100 0 0 100" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <i /><i /><i /><i />
      {card && <><i /><i /><i /><i /></>}
      {tag && <b>{tag}</b>}
    </span>
  );
}

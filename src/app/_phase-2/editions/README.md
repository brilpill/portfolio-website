# Editions layout (phase 2)

A parked layout experiment for a possible version 2 of the portfolio, after an editorial "editions" microsite:
full-bleed painted backgrounds (CSS gradients here), a framed index on the first screen, a flat section index
pinned bottom-left after the hero, giant section titles, a torn-paper edge into a cream reading area, and the
Ask AI assistant sliding in from the right.

The folder name starts with an underscore, so Next.js keeps it out of routing: nothing here has a URL and nothing
links to it.

## Bring it back

Move this folder into a routed path, for example `src/app/experiments/editions/`, and it is served at
`/experiments/editions` again. It needs nothing else: `home.css` still lists `.editions-shell` among the shells
that hide and slide the assistant panel.

## Known gaps

- The top bar's white text is hard to read over the cream areas.
- Backgrounds are gradients only; the original look relies on painted artwork, which would need images we own.
- Phones get only a basic adaptation.

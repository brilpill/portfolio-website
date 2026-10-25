# Dribbble playground import

Imported on 2026-10-25 from https://dribbble.com/brilpill. The owner confirmed that the 16 public shots are the full collection.

Each shot becomes one pin. The viewer preserves that shot's media order, including mixed image/video galleries. The complete import contains 44 images and 15 videos across 16 shots. Covers and video posters are additional local files. Videos only load when selected in the viewer; the board uses static covers.

- `docs/dribbble-import.json`: reviewed source URLs, titles, publication dates, descriptions, original dimensions and media sizes.
- `public/playground/dribbble/<shot-id>/`: original media, covers and video posters, served by the portfolio.
- `src/content/playground-dribbble.json`: generated records, with stable `dribbble-<shot-id>` IDs and local paths.
- `src/content/playground.ts`: typed data consumed by the board.

To restore the same import or regenerate its content after editing the reviewed manifest:

```sh
node scripts/import-dribbble.mjs
```

Requires Node.js 20+ and network access for missing files. Existing nonempty files are reused. The generated content is replaced only after every download succeeds. Re-running replaces the same shot records rather than appending duplicates. No credentials or paid API calls are required. This is a one-time import; it does not automatically discover future shots.

Source galleries were read through Dribbble's public browser interface, and original media URLs were checked against each shot's embedded `shotData`. No site cookies or account credentials are saved in the project.

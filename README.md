## Library (`/library`)

A public slice of my knowledge base: tools, references and UI kits, filterable by shelf,
subject, colour and page theme, with a page per item (its look, a recorded clip, a live
preview, and the closest items by meaning and by look).

The data is one file, `src/content/library.json`, written by the knowledge-base worker:

```bash
cd ~/Projects/kb/worker
pnpm export:public -- --dry                                                        # what would go out, and why the rest stays
pnpm export:public -- --out ~/Projects/portfolio-website/src/content/library.json  # write it
```

Then commit the file here. The site reads nothing else and calls no API: neighbours are
worked out at export. What may leave the base (no client research, nothing unreviewed, no
private notes) is decided in the knowledge base (`worker/src/lib/public-export.ts`), not here.

- `src/lib/library.ts` — types and labels; safe for client components.
- `src/lib/library-data.ts` — the data; **server only** (a client import would ship every item
  to the browser, and the `server-only` guard fails the build if one tries).
- `src/components/library/` — the grid, cards, item preview and the rail.

Pictures are served from the knowledge base's Supabase storage, so visitors use its bandwidth.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

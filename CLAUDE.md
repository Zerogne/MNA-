# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start development server
npm run build    # production build
npm run lint     # ESLint
npm run start    # serve production build
```

TypeScript errors are intentionally ignored during build (`ignoreBuildErrors: true` in `next.config.mjs`). Run `tsc --noEmit` separately to check types without building.

## Architecture

This is a **Next.js App Router** site for JapanCarsMongolia (JCM) — a Japanese used car exporter targeting Mongolia. The UI language is **Mongolian (Cyrillic)**.

### Data layer

All car data lives in `lib/cars.ts` as a static array (`carListings`). There is no database or API — the `dev.db` file in the repo root is unused by the application code. The admin page (`/admin`) is UI-only: add/edit/delete dialogs and status toggles are visual prototypes with no persistence. Adding a real backend means wiring up API routes and replacing the static `carListings` export.

### Routes

| Route | Rendering | Notes |
|---|---|---|
| `/` | Server | Marketing homepage; sections are assembled from components in `components/` |
| `/cars` | Client (`"use client"`) | Filterable/sortable car listing; all filtering is done in-memory via `useMemo` |
| `/cars/[slug]` | Server | Detail page; uses `generateStaticParams` to pre-render all cars at build time |
| `/admin` | Client (`"use client"`) | Admin UI with sidebar; views toggled via local state, no routing |

### Slugs

`getCarSlug(car)` in `lib/cars.ts` generates URL-safe slugs from `name + year`. Both `/cars` and `/cars/[slug]` import this helper to build and resolve links. When adding a car, the slug is automatically derived — no manual slug field.

### Navigation / scroll

`Navbar` handles cross-page anchor scrolling. When the user clicks "Холбоо барих" (Contact) from `/cars`, it stores the target hash in `sessionStorage` (`pendingScrollTarget`) before navigating to `/`, then a `useEffect` reads and executes the scroll after mount. This is the established pattern — don't replace it with URL hashes, which cause a scroll-jump on page load.

### UI components

shadcn/ui components live in `components/ui/`. They are Radix UI primitives styled with Tailwind. The full component set is installed; import from `@/components/ui/<name>`. Brand color tokens used throughout:
- `#1e3a8a` — primary blue (buttons, badges, accents)
- `#1a1a2e` — dark navy (body text, headings)
- `#172554` — hover state for primary blue

### Styling

Tailwind CSS v4 with PostCSS. Global styles are in `app/globals.css`. The `@/*` alias maps to the repo root, so `@/components/…`, `@/lib/…`, and `@/hooks/…` all resolve from there.

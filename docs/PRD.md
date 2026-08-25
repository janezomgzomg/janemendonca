# PRD: janemendonca.com React Revamp

- **Status:** Draft — pending review
- **Branch:** `aug-2026-website-revamp`
- **Date:** 2026-08-21

## 1. Background

The current site (`janemendonca.com`) is a bare static page: a header, a
"currently revamping" placeholder paragraph, and an unfinished/commented-out
game feature (`resources/scripts/game.js`). There is no build tooling, no
component structure, and no CI. This project replaces it with a React
single-page application, deployed automatically to GitHub Pages.

## 2. Goals

- Replace the static placeholder with a real personal site covering About,
  Resume, Music, and a technical writeup of how the site itself was built.
- Make content additions/edits low-friction by separating page data from
  page layout (schema-driven pages).
- Automate deployment so pushing to `master` publishes the live site with no
  manual build step.
- Restore `janemendonca.com` as the custom domain, now pointed at GitHub
  Pages.
- Go live early, as soon as page shells exist (before real content is
  filled in), showing a site-wide "under construction" banner until every
  page has real content.

## 3. Non-Goals (out of scope for this phase)

- Projects/portfolio page
- Contact page / contact form
- The old game Easter egg (player/land movement) — dropped, not carried
  forward
- Analytics integration
- Cleaning up stale branches (`aug-2021-website`, `game-site`) — left as-is

## 4. Repo Structure

```
/app          React + Vite + TypeScript source (new)
/legacy       Old static site files (index.html, index.js, resources/),
              archived as-is, deleted in a later cleanup once /app is
              confirmed working in production
/docs         PRD and related planning docs
```

The build output (`/app/dist`) is never committed to `master`. A GitHub
Actions workflow builds it and publishes it to the `gh-pages` branch, which
is what GitHub Pages actually serves.

## 5. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React (Vite scaffold) |
| Language | TypeScript |
| Styling | Tailwind CSS — utility classes directly in JSX, no component library (no shadcn/ui, no Headless UI); shared UI is plain React components in `/components` |
| Routing | React Router |
| Package manager | npm |
| Validation | Zod (schema is the source of truth; types are inferred from it) |
| Testing | Vitest + React Testing Library |
| Deployment | GitHub Actions → `gh-pages` branch → GitHub Pages |
| Domain | `janemendonca.com` (custom domain via `CNAME`) |

## 6. Page Architecture

Each page is defined by a config entry rather than being hand-assembled:

```ts
type PageConfig = {
  path: string;
  label: string;
  component: React.ComponentType<{ data: unknown }>;
  data: unknown; // parsed through the page's Zod schema
};
```

- A central page registry (`app/src/pages/registry.ts`) lists all
  `PageConfig` entries and feeds React Router's route table in `App.tsx`.
- Each page lives in its own folder under `app/src/pages/<PageName>/`,
  containing five files:
  - `<PageName>.tsx` — the presentational component
  - `<PageName>.schema.ts` — a Zod schema; this is the **source of truth**
    for the page's data shape
  - `<PageName>.types.ts` — a thin re-export,
    `type X = z.infer<typeof schema>`, so the type can never drift from the
    schema that actually validates the data
  - `<PageName>.data.json` — the page's content
  - `<PageName>.test.tsx` — Vitest + React Testing Library tests that parse
    the data through the schema and render the component
- The registry imports each page's raw JSON and calls `schema.parse(...)`
  on it before handing the result to `PageConfig.data` — a malformed data
  file fails loudly (build/dev time) instead of silently breaking the UI.
- Shared, reusable UI (e.g. `Nav`) lives in `app/src/components/`, separate
  from page-specific components.
- This keeps components reusable/presentational and content edits isolated
  to data files, without touching component code.
- Every page's schema requires a `placeholder: boolean` field (drives the
  under-construction banner — see §9). It starts `true` for every page and
  flips to `false` as real content replaces the placeholder, page by page.

Content/data for each page is supplied **after** the page shell/component is
built — pages start with realistic placeholder data and get real content
filled in per-page.

### 6.1 FacetedBrowser (Resume & Music)

Resume and Music are both presented as a faceted browser — facets in a left
sidebar, browsable result cards on the right, defaulting to showing every
item until a facet narrows it down. This doubles as a demonstration of
search/faceting skills while the visitor learns about Jane.

Built as `app/src/components/FacetedBrowser/`, a **generic, dataset-agnostic
shell** rather than something specific to Resume or Music:

```ts
type FacetedItem<T> = { id: string; facets: Record<string, string[]>; data: T };
type FacetedDataset<T> = { facetDefinitions: { key: string; label: string; multiSelect?: boolean }[]; items: FacetedItem<T>[] };
```

- `FacetedBrowser.schema.ts` exports a schema **factory**,
  `facetedDatasetSchema(itemDataSchema)`, that each page composes with its
  own item shape (e.g. Resume's `experienceEntrySchema`, Music's
  discriminated-union photo/gig schema) via `.merge(...)`. The page's
  `.data.json` is natively shaped as `{ facetDefinitions, items }` — there's
  no separate mapping/adapter layer.
- `FacetedBrowser` takes `{ dataset, renderResult }` — the page supplies its
  own result-card rendering, the shell only handles facet computation,
  selection state, and filtering. This is what makes it reusable across
  pages with completely different content.
- **Selection model: classic faceted search.** Categories combine with AND
  (an item must match every active category) and values within one category
  combine with OR. Each `FacetDefinition` carries its own `multiSelect` flag
  (default false): a single-select facet renders as buttons (pick one
  value, click again to clear); a multi-select facet renders as checkboxes
  (multiple values OR together, e.g. selecting two skills shows entries
  matching either). "Clear all filters" resets every active category at
  once. This arrived in two steps — single-facet-only, then per-category
  multi-select, then full cross-category AND — each a strict superset of
  the last, so nothing before it had to be restructured to get here.

## 7. Pages

### 7.1 About / bio — `/` — **content finalized**
A circular photo (`public/images/jane-musician.png`, a live performance
shot, cropped/positioned via CSS to center on her face) alongside a
real bio in three paragraphs: an introduction, her frontend engineering
background, and her work as a multi-instrumentalist (Right Proper, Gamelan
Sekar Jaya, SingJam/Sacred Music Fellowship). Data shape:
`{ heading, photo: { src, alt }, paragraphs: string[] }`.

### 7.2 Resume / experience — `/resume`
Presented as a faceted browser (see §6.1) rather than a static list: each
work experience entry is a result card, filterable by Role Type and Period
(single-select) and **Skill** (multi-select — e.g. selecting two skills
shows every role that used either). Content TBD (placeholder first).

### 7.3 Music — `/music`
- Links to external music platforms (Spotify/SoundCloud/etc.) — a separate,
  non-faceted list, since links don't fit the browsable-result model
- Photos and venue/gig history are combined into **one** faceted browser
  (see §6.1): each photo and each gig is a result card, filterable by:
  - Type (Photo/Gig), Venue, and Year — single-select
  - **Billing** (Opening Act / Supporting Act / Headlining Act) —
    single-select, filters to gigs played in that role
  - **Band** — multi-select, lists every band shared a bill with; a gig
    with no other acts (solo headline) simply has no band facet values
  so filtering to a venue surfaces both the photos taken there and the gigs
  played there together, and filtering to a band surfaces every gig shared
  with it regardless of venue.

Specific link URLs and real photos/gig history are TBD; the shape is
established, placeholder data demonstrates the faceted browsing itself.

### 7.4 How this Website was built — `/how-this-was-built`
Technical writeup: the stack (React/Vite/TypeScript/Tailwind), the
schema-driven page architecture, and the GitHub Actions → GitHub Pages
deployment pipeline. Effectively documents this exact project.

## 8. Design

Fresh design, no constraints from the old site — palette, typography, and
layout to be proposed during implementation and iterated on visually.

## 9. Under-Construction Banner

- A persistent banner is shown across every page (not a full-page
  interstitial — the real pages/nav stay reachable underneath) whenever
  **any** page's data still has `placeholder: true`.
- Driven automatically off page content, not a manual site-wide switch:
  `App.tsx` computes `pages.some((p) => p.placeholder)` from the registry
  and passes the result to an `UnderConstructionBanner` component in
  `app/src/components/`.
- As each page's real content replaces its placeholder data (Phase 7 of the
  implementation plan), that page's `placeholder` flips to `false`. Once
  every page is `false`, the banner disappears on the next deploy — no
  separate step required to "turn it off."

## 10. Deployment & Domain

- GitHub Actions workflow triggers on push to `master`, builds `/app`,
  publishes `dist/` to `gh-pages`.
- GitHub Pages configured to serve from the `gh-pages` branch.
- Goes live **early** — as soon as page shells exist (placeholder content,
  under-construction banner showing) — rather than waiting for real
  content. See the implementation plan for phase ordering.
- `janemendonca.com` DNS currently resolves to `13.52.188.95` /
  `52.52.192.191` — **not** GitHub Pages IPs. DNS needs to be repointed
  (A records to GitHub Pages' `185.199.108/109/110/111.153`, or apex
  handled per registrar) — this requires registrar access outside of this
  repo and happens as part of the early deploy, not deferred to the end.
- A `CNAME` file (containing `janemendonca.com`) will be added back to the
  published output so GitHub Pages recognizes the custom domain.

## 11. Open Questions

- Exact copy/content for the Resume page (TBD, supplied per-page during
  implementation). About's content is finalized (§7.1).
- Exact shape of remaining `music.json` content (photo sources, external
  link list) — the faceted item shape is established (§6.1, §7.3); actual
  photos and links are still TBD.
- Specific wording/depth for the "How this Website was built" writeup.
- Exact banner copy/wording (TBD when we build it).

## 12. Success Criteria

- `janemendonca.com` serves the new React site at all four routes with
  working client-side navigation.
- Pushing to `master` deploys automatically with no manual steps.
- Old static site files are archived in `/legacy`, no longer served.
- Each page's content is driven by its own data file, not hardcoded in
  components.
- The site goes live at `janemendonca.com` early, with an under-construction
  banner, before all real content is in place; the banner disappears on its
  own once every page's `placeholder` flag is `false`.

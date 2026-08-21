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

Content/data for each page is supplied **after** the page shell/component is
built — pages start with realistic placeholder data and get real content
filled in per-page.

## 7. Pages

### 7.1 About / bio — `/`
Short professional/personal intro. Content TBD (placeholder first).

### 7.2 Resume / experience — `/resume`
Work history, skills, education. Content TBD (placeholder first).

### 7.3 Music — `/music`
- Gallery of professional photos
- Links to external music platforms (Spotify/SoundCloud/etc. — specific
  links TBD)
- Detailed list of venues played, with gig/bill history per venue

This is the most data-heavy page; `music.json` will need a structured shape
for photos, external links, and a venues/gigs list (fields TBD when content
is supplied).

### 7.4 How this Website was built — `/how-this-was-built`
Technical writeup: the stack (React/Vite/TypeScript/Tailwind), the
schema-driven page architecture, and the GitHub Actions → GitHub Pages
deployment pipeline. Effectively documents this exact project.

## 8. Design

Fresh design, no constraints from the old site — palette, typography, and
layout to be proposed during implementation and iterated on visually.

## 9. Deployment & Domain

- GitHub Actions workflow triggers on push to `master`, builds `/app`,
  publishes `dist/` to `gh-pages`.
- GitHub Pages configured to serve from the `gh-pages` branch.
- `janemendonca.com` DNS currently resolves to `13.52.188.95` /
  `52.52.192.191` — **not** GitHub Pages IPs. DNS needs to be repointed
  (A records to GitHub Pages' `185.199.108/109/110/111.153`, or apex
  handled per registrar) — this requires registrar access outside of this
  repo and is a manual step alongside the code changes.
- A `CNAME` file (containing `janemendonca.com`) will be added back to the
  published output so GitHub Pages recognizes the custom domain.

## 10. Open Questions

- Exact copy/content for About and Resume pages (TBD, supplied per-page
  during implementation).
- Exact shape of `music.json` (photo sources, external link list, venue/gig
  fields) — to be finalized when Music page content is supplied.
- Specific wording/depth for the "How this Website was built" writeup.

## 11. Success Criteria

- `janemendonca.com` serves the new React site at all four routes with
  working client-side navigation.
- Pushing to `master` deploys automatically with no manual steps.
- Old static site files are archived in `/legacy`, no longer served.
- Each page's content is driven by its own data file, not hardcoded in
  components.

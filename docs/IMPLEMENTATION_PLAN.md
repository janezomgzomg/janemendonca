# Implementation Plan: janemendonca.com React Revamp

- **Status:** Draft — pending review
- **Branch:** `aug-2026-website-revamp`
- **Companion doc:** [PRD.md](./PRD.md)

Each phase ends with something checkable (app runs, page renders, deploy
succeeds) before moving on. We pause for your review at the end of every
phase rather than pushing straight through.

## Phase 0 — Housekeeping
- Move `index.html`, `index.js`, `resources/` into `/legacy` (git mv, so
  history is preserved).
- Confirm nothing at repo root still references the old paths.
- **Checkpoint:** repo root is clean except `/legacy`, `/docs`, and repo
  metadata files (README, LICENSE).

## Phase 1 — Scaffold the React app
- `npm create vite@latest app -- --template react-ts` to scaffold `/app`.
- Install and configure Tailwind CSS.
- Install React Router.
- Verify `npm run dev` serves a default page, `npm run build` produces
  `/app/dist`.
- **Checkpoint:** blank Vite+React+TS+Tailwind app runs locally.

## Phase 2 — Page architecture
- Define the `PageConfig` type (`path`, `component`, `data`) per the PRD.
- Create `app/src/pages/registry.ts` wiring React Router to four routes:
  `/`, `/resume`, `/music`, `/how-this-was-built`.
- Create one placeholder component per page (renders a heading + "coming
  soon"), each reading from a matching placeholder JSON file in
  `app/src/data/`.
- **Checkpoint:** all four routes navigate correctly with placeholder
  content, confirming the schema-driven wiring works end-to-end before any
  real design or content goes in.

## Phase 3 — Design pass
- Propose a palette, typography, and layout shell (nav, header/footer)
  using Tailwind.
- Apply it across the shared layout and all four placeholder pages.
- **Checkpoint:** you review the look in the browser and give direction
  (colors/fonts/layout adjustments) before we build out page-specific UI.

## Phase 4 — Page-by-page build (shell first, content after)
For each page, build the component to the shape its data will need, still
using placeholder data:
- **About/bio** (`/`) — simple text layout.
- **Resume** (`/resume`) — structured sections (experience, skills,
  education).
- **Music** (`/music`) — photo gallery grid, external links list, and a
  venues/gigs table (with bill history) — the most data-heavy page per the
  PRD.
- **How this Website was built** (`/how-this-was-built`) — long-form
  writeup layout.
- **Checkpoint:** all four pages are visually complete with placeholder
  data; component shapes are locked.

## Phase 5 — Real content
- You supply content per page (text, resume details, photos, music links,
  venue/gig history).
- We finalize each page's JSON data shape as content is supplied (this is
  where the open questions from the PRD — e.g. `music.json` fields — get
  resolved) and swap it in.
- **Checkpoint:** every page shows real content, no placeholders remain.

## Phase 6 — CI/CD (GitHub Actions → gh-pages)
- Add a workflow that on push to `master`: installs deps, builds `/app`,
  publishes `dist/` to the `gh-pages` branch.
- Configure GitHub Pages (repo settings) to serve from `gh-pages`.
- Add a `CNAME` file (`janemendonca.com`) to the published output so the
  custom domain persists across deploys.
- **Checkpoint:** a push to `master` results in a live deploy at the
  default `github.io` URL (before domain cutover).

## Phase 7 — Domain cutover
- You update DNS at the registrar: A records for the apex domain to
  GitHub Pages' IPs (`185.199.108.153`, `.109.153`, `.110.153`,
  `.111.153`), per GitHub's current custom-domain instructions at the time
  we do this step.
- Verify `janemendonca.com` resolves to GitHub Pages and HTTPS is issued
  (GitHub auto-provisions a cert once DNS is correctly pointed).
- **Checkpoint:** `janemendonca.com` serves the live site over HTTPS.

## Phase 8 — Final QA
- Click through all four routes in production, confirm deep links (e.g.
  loading `/resume` directly, not just navigating from `/`) work correctly
  under GitHub Pages' static hosting.
- Check mobile responsiveness.
- **Checkpoint:** sign-off, PR merged from `aug-2026-website-revamp` into
  `master`.

## Later / not in this plan
- Deleting `/legacy` outright (kept for now per PRD).
- Projects page, Contact page, analytics, stale branch cleanup — explicitly
  out of scope per the PRD.

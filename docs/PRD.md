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
- Each page lives in its own folder under `app/src/pages/<PageName>/`. The
  general pattern is five files (component, schema, types, data,
  test) — but every current page is a `PageRenderingTemplate` instance
  (§6.2), which has no page-specific component or type to own, so in
  practice each page folder today is just three files:
  - `<PageName>.schema.ts` — a re-export (or small `.extend()`) of
    whichever template schema (§6.2) the page uses; this is still the
    **source of truth** for the page's data shape
  - `<PageName>.data.json` — the page's content
  - `<PageName>.test.tsx` — Vitest + React Testing Library tests that parse
    the data through the schema and render it via `PageRenderingTemplate`
  - No `<PageName>.tsx`, `.css`, or `.types.ts`: there's no page-specific
    rendering logic to hold a component or style override, and a
    `type X = z.infer<typeof schema>` re-export with no consumer is dead
    code — add one back only if a page actually needs it (e.g. a future
    page with real custom logic beyond what a template offers).
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
  `facetedDatasetSchema(itemDataSchema)`. `SearchPage` (§6.2) is the only
  current caller, fixing `itemDataSchema` to one common result shape shared
  by every search page — see §6.2 for why per-page item shapes were
  dropped in favor of that.
- `FacetedBrowser` takes `{ dataset, renderResult }` — generic over the item
  payload type, so it stays reusable even though `SearchPage` currently
  only ever calls it with one concrete shape.
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

### 6.2 Page Templates

Every page is an instance of one of three reusable templates in
`app/src/templates/`. Pages have **no `.tsx`, `.css`, or `.types.ts` of
their own** — a page folder is just `.schema.ts` + `.data.json` +
`.test.tsx` (see §6 for why `.types.ts` is dropped when nothing consumes
it). Rendering is fully centralized:

- Each page's `data.json` carries a `template: "basic" | "search" |
  "documentation"` discriminator.
- `templates/PageRenderingTemplate/` is the **one component the route
  registry ever references** (`registry.ts`'s `component` field is
  `PageRenderingTemplate` for all four routes). Its schema, `pageSchema`,
  is a `z.discriminatedUnion('template', [...])` over the three template
  data schemas below.
- A page's own `.schema.ts` is just a re-export (or a small `.extend(...)`)
  of whichever template schema it uses — e.g. `export const aboutSchema =
  basicPageSchema`. No page-specific TypeScript rendering logic exists
  anywhere; adding a page means adding a data file and a schema re-export,
  nothing else.
- **A template's structure is itself data.** `BasicPage`, `SearchPage`, and
  `DocumentationPage` each have no `.tsx` — only `.schema.ts` (the page
  *data* shape), `.types.ts`, and a `.layout.json` (the page *structure*: an
  ordered list of named sections). `PageRenderingTemplate.tsx` is the only
  `.tsx` file across all three template folders: it picks the `.layout.json`
  matching `page.template`, renders `<h1>{page.heading}</h1>` (the one field
  every template shares), then maps each section through one
  `renderSection(section, data)` function with a case per section `kind`.
  A section names the data field(s) it reads by string (e.g.
  `{ kind: "imageWithText", imageField: "image", textField: "paragraphs" }`)
  — the trade-off is that field access there is dynamic (a string lookup
  cast at the point of use) rather than statically typed, in exchange for
  the structure itself being swappable data instead of hardcoded JSX. The
  page data underneath is still fully typed and Zod-validated at the
  registry loading boundary; only the *layout interpretation* step gives up
  static field-name checking.
- Current section kinds, each a case in `renderSection`:
  - `imageWithText` (`imageField`, `textField`) — **BasicPage**'s layout:
    `[{ kind: "imageWithText", imageField: "image", textField: "paragraphs" }]`
  - `linkList` (`field`) — renders nothing when the field is absent or an
    empty array. When populated, renders as **icon-only anchors positioned
    inline with the page's `<h1>`, right-aligned on the same row** (pulled
    out of the normal top-to-bottom section sequence specifically for this
    reason — `PageRenderingTemplate` hoists whichever section has
    `kind: "linkList"` into the heading row before rendering the rest).
    Each link's icon is explicit in the data (`icon: "linkedin" | "github"
    | "instagram"` on `pageLinkSchema`, defined once in
    `templates/pageLink.schema.ts` and shared by both `SearchPage` and
    `DocumentationPage` — living outside either so both can import it
    without a circular dependency through `PageRenderingTemplate.schema.ts`,
    which imports both), not inferred from `label` text. Every link opens
    in a new tab (`target="_blank"`, `rel="noopener noreferrer"`); `label`
    becomes the accessible name via `aria-label` (and a hover `title`)
    since there's no visible text.
  - `facetedSearch` (`facetsField`, `itemsField`) — renders `FacetedBrowser`
    (§6.1) off those two fields, using the commonized result shape below
  - `sectionList` (`field`) — **DocumentationPage**'s layout:
    `[{ kind: "linkList", field: "links" }, { kind: "sectionList", field:
    "sections" }]`. Each section's body is an ordered list of **content
    blocks** rather than just paragraphs — `{ kind: "paragraph"; text:
    string } | { kind: "code"; code: string; language?: string }` — so
    prose and code can interleave within one section. A `code` block
    renders as `<pre><code>` (an optional freeform `language` label shown
    above it, e.g. `"ts"` or a file path — no syntax highlighting, just a
    hint of what's shown) with `overflow-x-auto` so a wide folder tree
    scrolls inside its own box rather than breaking page layout.
  - Both **SearchPage** and **DocumentationPage** put `linkList` first in
    their layout: `[{ kind: "linkList", field: "links" }, ...]` — Resume's
    data simply omits `links`, so nothing renders in the heading row for it.

The three templates (data shape each page's `.schema.ts` composes):

- **BasicPage** — `{ template: "basic", heading, image: { src, alt,
  position? }, paragraphs: string[] }`. `position` is an optional CSS
  `object-position` value for off-center subjects; defaults to centered.
  Used by **About**.
- **SearchPage** — `{ template: "search", heading, links?:
  PageLink[], facetDefinitions, items }` — heading plus the faceted browse
  experience from §6.1, plus optional links. Used by **Resume** (LinkedIn,
  GitHub) and **Music** (Instagram).
- **DocumentationPage** — `{ template: "documentation", heading, links?:
  PageLink[], sections: { heading, content: ContentBlock[] }[] }`. Used by
  **How this Website was built** (links to its own GitHub repo; sections
  mix prose with real code/folder-structure blocks describing the project
  itself).

**Commonized search results.** Every `SearchPage` item's `data` conforms to
one shape — `{ title, titleUrl?, subtitle?, address?, category?, badge?,
description?, links?: { label, url }[], tags?: string[], tagsLabel?:
string, bullets?: string[], bulletsLabel?: string, image?: { src, alt } }`
— rendered by a single built-in card component inside `SearchPage`, not a
per-page `renderResult` function. `image` present renders an image card (a
placeholder box using `alt` as caption when `src` is empty, e.g. Music's
photo before a real asset exists); otherwise a text card. The item-level
`links` (e.g. Music's Soundwaves TV entry linking its official recap and
YouTube recording) is distinct from `SearchPage`'s page-level `links` (e.g.
Music's Instagram): simpler — no `icon` — since these are one-off
"watch/read this" links rather than social profiles, both open in a new
tab. Card body order: title (a plain link, opening in a new tab, when
`titleUrl` is present — e.g. Music's venue name linking to the venue's own
site) with `category` and `badge` pinned top-right of the title row, in
that order (e.g. Music's ensemble chip — neutral gray — immediately to the
left of its billing-type chip — amber — so the two read as related but
distinct at a glance), then `subtitle`, then `address`
immediately below it (e.g. Music's street address), then `description`,
then item `links`, then `tags` (a row of small chips — light blue
background, 6px border radius — under a `tagsLabel` heading, default
`"Skills"`; reused for Resume's per-role technologies and Music's gig
lineup, since both are "a labeled row of small display-only chips" even
though the content differs), then `bullets` (a collapsible native
`<details>`/`<summary>`, closed by default so a list of several dense
roles stays scannable, with `bulletsLabel` as the `<summary>` text —
`"Role & Responsibilities"` for Resume). Labels are page-supplied rather
than hardcoded into the shared card, since a future page reusing these
fields for something else might want different wording. `tags` is
deliberately distinct from `facets`: facets use coarse categories sized
for usable filtering (few, broad values, or many unique values meant to be
searched rather than skimmed), while `tags` is purely for display — e.g.
Resume's specific granular technologies per role (distinct from the
broader `facets.skill` categories), or Music's full gig lineup rendered as
chips (in addition to, not instead of, the separately-filterable `Band`
facet). This was a deliberate trade: Resume's experience entries and
Music's photo/gig entries used to have distinct, richly-typed shapes
(`role`/`company`/`period` vs. a `type: 'photo' | 'gig'` discriminated
union) rendered by page-specific JSX. Commonizing to one shape means every
page's content already fits the generic renderer in exchange for zero
custom rendering code per page. Faceting itself is unaffected: filtering
still runs on `facets`, which is independent of how `data` is shaped for
display.

Templates never own content (no `.data.json`) — same rule as any
component that's prop/data-driven rather than content-owning (see §6).
`PageRenderingTemplate` owns the only styles and tests left at the
template layer (`BasicPage`/`SearchPage`/`DocumentationPage` have neither,
having no `.tsx` to style or test), exercised with synthetic sample data
covering all three `template` kinds rather than a real page's content.

## 7. Pages

### 7.1 About / bio — `/` — **content finalized**
A **BasicPage** (§6.2). Photo is `public/images/jane-musician.png`, a live
performance shot, framed off-center via `image.position` to center on her
face rather than the image's geometric center. Real bio across four
paragraphs: an introduction, her frontend engineering background, her work
as a multi-instrumentalist (Right Proper, Gamelan Sekar Jaya, SingJam/Sacred
Music Fellowship), and hobbies.

### 7.2 Resume / experience — `/resume` — **content finalized**
A **SearchPage** (§6.2). Four real roles (Senior Software Engineer, UI
Engineer, and UI Engineer (Contract) at Lucidworks, plus Intern & Engineer
at Honeywell Technology Solutions Lab), each a result card with real
achievement bullets via the `bullets` field. Filterable by Role Type,
Location, and Period (single-select), and **Skill** (multi-select — seven
broad categories, e.g. "Search & AI-Powered Search", "Leadership",
curated from Jane's own skill list rather than one tag per specific
technology, since 30+ near-unique tags across only four roles would make
for a sparse, not-useful facet). `links` holds LinkedIn and GitHub — the
two profiles relevant to engineering work, distinct from Music's Instagram
(§7.3).

### 7.3 Music — `/music` — **gig history finalized**
A **SearchPage** (§6.2) using the optional `links` field, set to her
Instagram profile — the split (LinkedIn/GitHub on Resume, Instagram here)
makes which links relate to engineering vs. music evident from page
context alone, with no extra grouping/labeling needed.

20 real gigs across three ensembles: **Right Proper** (14, an
Oakland-based indie alt-pop/rock band), **Gamelan Sekar Jaya** (2,
Balinese gamelan), and **SingJam**/Sacred Music Fellowship (4, house band
— no billing or bill, since it's not a rock-show lineup), listed in true
chronological order (not grouped by ensemble). Each card's `subtitle` is
just the date; `address` holds the venue's street address rendered right
below it; `category` holds the ensemble name, rendered as a neutral chip
immediately to the left of `badge` so a visitor can tell at a glance which
group a gig belongs to without reading the Ensemble facet; `badge` holds
the billing type (omitted entirely for gigs where it doesn't apply —
gamelan, SingJam); `title` links via `titleUrl` to the venue's real
website (a Facebook/Instagram page where no dedicated site exists) opening
in a new tab; and the bill/lineup renders as `tags` under a `"Lineup"`
label, using the same chip styling as Resume's skill tags. Filterable by:
- **Genre** (indie Rock / Balinese Gamelan / Community Jam) — one value
  per ensemble; framed around musical style rather than the ensemble name
  itself since that's what a visitor unfamiliar with the specific groups
  is more likely to search by
- **Ensemble** — single-select (Right Proper / Gamelan Sekar Jaya /
  SingJam) — added once the data showed she performs with three distinct
  groups; lets a visitor see everything with one of them
- **Venue**, **City**, and **Year** — single-select
- **Billing** (Opening Act / Supporting Act / Headlining Act) —
  single-select; omitted entirely for gigs where it doesn't apply
  (gamelan, SingJam) rather than forced into the rock-show vocabulary
- **Band** — multi-select, every other act on each bill (~50 unique
  values, most appearing once) — deliberately *not* consolidated into
  broad categories the way Resume's Skill facet was, since here the
  point is finding a specific band she's shared a bill with, not
  filtering usably across a small set; kept distinct from the display-only
  `tags` lineup on each card (same underlying data, different purpose —
  one's for filtering, one's for reading)

So filtering to a venue surfaces every gig played there, filtering to an
ensemble surfaces everything with that group, and filtering to a band
surfaces every gig shared with it regardless of venue. One gig (a
Soundwaves TV recording) has real item-level `links` (§6.2) to the
official recap and the YouTube recording. Photos aren't in yet; real
photos and any additional external links (Spotify, Bandcamp, etc.) are
still TBD. Whether a card renders as a photo or a gig is driven entirely
by the presence of `image` in its `data` (§6.2), not by any facet value —
so adding photos later needs no changes to the Genre facet or its values.

### 7.4 How this Website was built — `/how-this-was-built` — **content finalized**
A **DocumentationPage** (§6.2), links to its own GitHub repo
(`janezomgzomg/janemendonca`, labeled "View Source on GitHub"). Four real
sections: Stack, Content architecture, Page templates, and The faceted
search experience — describing the project as it actually exists. A
Deployment section will be added once CI/CD (§10) is actually built,
rather than describing a pipeline that doesn't exist yet.

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

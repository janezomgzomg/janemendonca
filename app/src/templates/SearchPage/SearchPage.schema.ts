import { z } from 'zod'
import { facetedDatasetSchema } from '../../components/FacetedBrowser/FacetedBrowser.schema'
import { pageLinkSchema } from '../pageLink.schema'

// Every search result, across every page, conforms to this one shape so
// SearchPage can render results with a single built-in card renderer
// instead of each page supplying its own. `image` present renders as an
// image card (or a placeholder box when `src` is empty); otherwise it
// renders as a text card.
export const searchResultDataSchema = z.object({
  title: z.string(),
  // Makes the title a link (e.g. Music's venue name linking to its website).
  titleUrl: z.string().optional(),
  subtitle: z.string().optional(),
  // Rendered right after subtitle (e.g. Music's venue street address).
  address: z.string().optional(),
  // A neutral chip pinned to the top-right of the card, immediately to the
  // left of `badge` (e.g. Music's ensemble — Right Proper, Gamelan Sekar
  // Jaya, SingJam — identifying which group the gig belongs to).
  category: z.string().optional(),
  // A short status chip pinned to the top-right of the card, in a distinct
  // color from `tags` (e.g. Music's "Headlining Act" / "Supporting Act").
  badge: z.string().optional(),
  description: z.string().optional(),
  // A list of achievement/detail bullets (e.g. Resume's job responsibilities)
  // — kept distinct from `description` so a card can render a real bulleted
  // list rather than one run-on paragraph. Rendered as a collapsible
  // <details>; `bulletsLabel` is the <summary> text (page-supplied since
  // the right label — "Role & Responsibilities" for Resume — isn't
  // something a shared card should hardcode).
  bullets: z.array(z.string()).optional(),
  bulletsLabel: z.string().optional(),
  // A row of small tag chips (e.g. Resume's specific technologies per role,
  // or Music's supporting bands) — distinct from `facets`, which uses
  // coarser categories for filtering. This is purely for display.
  tags: z.array(z.string()).optional(),
  tagsLabel: z.string().optional(),
  // Contextual reference links for this specific result (e.g. a recording
  // of a specific gig) — distinct from SearchPage's page-level `links`
  // (e.g. Music's Instagram), and simpler (no icon) since these are
  // one-off "watch/read this" links rather than social profiles.
  links: z
    .array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
})

export const searchPageSchema = facetedDatasetSchema(searchResultDataSchema).extend({
  template: z.literal('search'),
  heading: z.string(),
  // Optional supplementary links (e.g. Music's external platform links).
  // Omitted entirely for pages with nothing to link to (e.g. Resume).
  links: z.array(pageLinkSchema).optional(),
})

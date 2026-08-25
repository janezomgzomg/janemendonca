import { z } from 'zod'
import { facetedDatasetSchema } from '../../components/FacetedBrowser/FacetedBrowser.schema'

const searchLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
})

// Every search result, across every page, conforms to this one shape so
// SearchPage can render results with a single built-in card renderer
// instead of each page supplying its own. `image` present renders as an
// image card (or a placeholder box when `src` is empty); otherwise it
// renders as a text card.
export const searchResultDataSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
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
  links: z.array(searchLinkSchema).optional(),
})

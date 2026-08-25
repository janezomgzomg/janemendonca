import { z } from 'zod'
import { facetedDatasetSchema } from '../../components/FacetedBrowser/FacetedBrowser.schema'

const musicLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
})

const musicResultDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('photo'),
    src: z.string(),
    alt: z.string(),
  }),
  z.object({
    type: z.literal('gig'),
    venue: z.string(),
    date: z.string(),
    billing: z.enum(['Opening Act', 'Supporting Act', 'Headlining Act']),
    bill: z.array(z.string()),
  }),
])

export const musicSchema = z
  .object({
    heading: z.string(),
    links: z.array(musicLinkSchema),
  })
  .merge(facetedDatasetSchema(musicResultDataSchema))

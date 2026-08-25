import { z } from 'zod'
import { facetedDatasetSchema } from '../../components/FacetedBrowser/FacetedBrowser.schema'

const experienceEntrySchema = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  description: z.string(),
})

export const resumeSchema = z
  .object({
    heading: z.string(),
  })
  .merge(facetedDatasetSchema(experienceEntrySchema))

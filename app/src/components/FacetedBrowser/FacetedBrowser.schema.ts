import { z } from 'zod'

export const facetDefinitionSchema = z.object({
  key: z.string(),
  label: z.string(),
  // Most facets are single-select buttons (pick one value, click again to
  // clear). A facet can opt into multi-select checkboxes (OR within the
  // category) by setting this to true.
  multiSelect: z.boolean().optional().default(false),
})

export function facetedItemSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    id: z.string(),
    // Optional ISO date (YYYY-MM-DD) for datasets ordered or grouped by
    // date, e.g. Music's gig date.
    date: z.iso.date().optional(),
    facets: z.record(z.string(), z.array(z.string())),
    data: dataSchema,
  })
}

export function facetedDatasetSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    facetDefinitions: z.array(facetDefinitionSchema),
    items: z.array(facetedItemSchema(dataSchema)),
  })
}

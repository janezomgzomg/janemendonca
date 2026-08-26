import type { z } from 'zod'
import type { facetDefinitionSchema } from './FacetedBrowser.schema'

export type FacetDefinition = z.infer<typeof facetDefinitionSchema>

// FacetedItem/FacetedDataset are generic over the per-page item payload, so
// they can't be derived with z.infer directly (that requires a concrete
// schema). They're hand-written to mirror exactly what
// facetedDatasetSchema(dataSchema) infers once dataSchema is fixed.
export type FacetedItem<T> = {
  id: string
  facets: Record<string, string[]>
  data: T
}

export type FacetedDataset<T> = {
  facetDefinitions: FacetDefinition[]
  items: FacetedItem<T>[]
}

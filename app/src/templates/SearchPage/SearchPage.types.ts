import type { z } from 'zod'
import type { searchPageSchema, searchResultDataSchema } from './SearchPage.schema'

export type SearchPageData = z.infer<typeof searchPageSchema>
export type SearchResultData = z.infer<typeof searchResultDataSchema>

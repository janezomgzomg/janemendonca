import type { z } from 'zod'
import type {
  pageSchema,
  sectionSchema,
  layoutSchema,
} from './PageRenderingTemplate.schema'

export type PageData = z.infer<typeof pageSchema>
export type Section = z.infer<typeof sectionSchema>
export type Layout = z.infer<typeof layoutSchema>

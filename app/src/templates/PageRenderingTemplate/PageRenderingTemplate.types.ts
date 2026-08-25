import type { z } from 'zod'
import type { pageSchema } from './PageRenderingTemplate.schema'

export type PageData = z.infer<typeof pageSchema>

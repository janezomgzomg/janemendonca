import type { z } from 'zod'
import type { documentationPageSchema } from './DocumentationPage.schema'

export type DocumentationPageData = z.infer<typeof documentationPageSchema>

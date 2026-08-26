import type { z } from 'zod'
import type { basicPageSchema } from './BasicPage.schema'

export type BasicPageData = z.infer<typeof basicPageSchema>

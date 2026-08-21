import type { z } from 'zod'
import type { aboutSchema } from './About.schema'

export type AboutData = z.infer<typeof aboutSchema>

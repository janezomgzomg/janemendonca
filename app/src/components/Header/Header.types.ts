import type { z } from 'zod'
import type { headerSchema } from './Header.schema'

export type HeaderData = z.infer<typeof headerSchema>

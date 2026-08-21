import type { z } from 'zod'
import type { howThisWasBuiltSchema } from './HowThisWasBuilt.schema'

export type HowThisWasBuiltData = z.infer<typeof howThisWasBuiltSchema>

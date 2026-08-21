import type { z } from 'zod'
import type { musicSchema } from './Music.schema'

export type MusicData = z.infer<typeof musicSchema>

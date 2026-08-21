import type { z } from 'zod'
import type { resumeSchema } from './Resume.schema'

export type ResumeData = z.infer<typeof resumeSchema>

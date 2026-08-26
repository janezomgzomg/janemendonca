import { z } from 'zod'

export const headerSchema = z.object({
  name: z.string(),
})

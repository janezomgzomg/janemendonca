import { z } from 'zod'

export const aboutSchema = z.object({
  heading: z.string(),
  body: z.string(),
})

import { z } from 'zod'

export const howThisWasBuiltSchema = z.object({
  heading: z.string(),
  body: z.string(),
})

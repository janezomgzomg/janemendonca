import { z } from 'zod'

export const navItemSchema = z.object({
  path: z.string(),
  label: z.string(),
})

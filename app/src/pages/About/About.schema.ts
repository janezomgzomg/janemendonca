import { z } from 'zod'

export const aboutSchema = z.object({
  heading: z.string(),
  photo: z.object({
    src: z.string(),
    alt: z.string(),
  }),
  paragraphs: z.array(z.string()),
})

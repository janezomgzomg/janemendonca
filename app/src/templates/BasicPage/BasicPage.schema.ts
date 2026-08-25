import { z } from 'zod'

export const basicPageSchema = z.object({
  template: z.literal('basic'),
  heading: z.string(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
    // CSS object-position value (e.g. "70% 38%"), for framing off-center
    // subjects. Defaults to centered if omitted.
    position: z.string().optional(),
  }),
  paragraphs: z.array(z.string()),
})

import { z } from 'zod'

const resumeSectionSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
})

export const resumeSchema = z.object({
  heading: z.string(),
  sections: z.array(resumeSectionSchema),
})

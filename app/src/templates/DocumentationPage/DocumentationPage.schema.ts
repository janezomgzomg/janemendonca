import { z } from 'zod'

const documentationSectionSchema = z.object({
  heading: z.string(),
  paragraphs: z.array(z.string()),
})

export const documentationPageSchema = z.object({
  template: z.literal('documentation'),
  heading: z.string(),
  sections: z.array(documentationSectionSchema),
})

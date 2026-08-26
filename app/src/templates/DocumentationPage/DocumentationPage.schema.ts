import { z } from 'zod'
import { pageLinkSchema } from '../pageLink.schema'

// A section's body is an ordered list of blocks rather than just
// paragraphs, so prose and code can be interleaved — e.g. a paragraph
// explaining a folder layout, followed by the actual tree, followed by
// more prose.
const contentBlockSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('paragraph'), text: z.string() }),
  z.object({
    kind: z.literal('code'),
    code: z.string(),
    // Freeform label shown above the block (e.g. "ts", "bash", a file
    // path) — no syntax highlighting, just a hint of what's being shown.
    language: z.string().optional(),
  }),
])

const documentationSectionSchema = z.object({
  heading: z.string(),
  content: z.array(contentBlockSchema),
})

export const documentationPageSchema = z.object({
  template: z.literal('documentation'),
  heading: z.string(),
  links: z.array(pageLinkSchema).optional(),
  sections: z.array(documentationSectionSchema),
})

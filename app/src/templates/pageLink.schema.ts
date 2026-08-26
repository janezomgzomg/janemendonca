import { z } from 'zod'

// Shared by any template section with `kind: "linkList"` (see
// PageRenderingTemplate.schema.ts's sectionSchema). Lives here rather than
// inside SearchPage or DocumentationPage so both can import it without a
// circular dependency through PageRenderingTemplate.schema.ts.
//
// `icon` is explicit rather than inferred from `label` text, so rendering
// doesn't depend on matching/parsing a display string that could change.
export const pageLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.enum(['linkedin', 'github', 'instagram']),
})

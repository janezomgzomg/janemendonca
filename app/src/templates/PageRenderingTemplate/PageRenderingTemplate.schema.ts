import { z } from 'zod'
import { basicPageSchema } from '../BasicPage/BasicPage.schema'
import { searchPageSchema } from '../SearchPage/SearchPage.schema'
import { documentationPageSchema } from '../DocumentationPage/DocumentationPage.schema'

// Every page's data declares which template renders it via `template`. A
// page's own schema.ts re-exports whichever of these three shapes it uses
// (or extends one, as Music does for its Links field via searchPageSchema).
export const pageSchema = z.discriminatedUnion('template', [
  basicPageSchema,
  searchPageSchema,
  documentationPageSchema,
])

// A template's *structure* is itself data: an ordered list of named
// sections, each naming which field(s) on that template's page data it
// reads. PageRenderingTemplate.tsx has one render function per `kind` —
// nothing about a template's layout lives in a .tsx file anymore.
export const sectionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('imageWithText'),
    imageField: z.string(),
    textField: z.string(),
  }),
  z.object({
    kind: z.literal('linkList'),
    field: z.string(),
  }),
  z.object({
    kind: z.literal('facetedSearch'),
    facetsField: z.string(),
    itemsField: z.string(),
  }),
  z.object({
    kind: z.literal('sectionList'),
    field: z.string(),
  }),
])

export const layoutSchema = z.array(sectionSchema)

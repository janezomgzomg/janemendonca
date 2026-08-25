import { z } from 'zod'
import { basicPageSchema } from '../BasicPage/BasicPage.schema'
import { searchPageSchema } from '../SearchPage/SearchPage.schema'
import { documentationPageSchema } from '../DocumentationPage/DocumentationPage.schema'

// Every page's data declares which template renders it via `template`. A
// page's own schema.ts re-exports whichever of these three shapes it uses
// (or extends one, as Music does for its Links field via searchPageSchema)
// — nothing about a page's `.tsx` is needed anymore, since dispatch happens
// here based on that one field.
export const pageSchema = z.discriminatedUnion('template', [
  basicPageSchema,
  searchPageSchema,
  documentationPageSchema,
])

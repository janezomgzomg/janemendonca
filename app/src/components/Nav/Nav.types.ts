import type { z } from 'zod'
import type { navItemSchema } from './Nav.schema'

export type NavItem = z.infer<typeof navItemSchema>

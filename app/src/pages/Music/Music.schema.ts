import { z } from 'zod'

const musicPhotoSchema = z.object({
  src: z.string(),
  alt: z.string(),
})

const musicLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
})

const musicGigSchema = z.object({
  date: z.string(),
  bill: z.string(),
})

const musicVenueSchema = z.object({
  name: z.string(),
  gigs: z.array(musicGigSchema),
})

export const musicSchema = z.object({
  heading: z.string(),
  photos: z.array(musicPhotoSchema),
  links: z.array(musicLinkSchema),
  venues: z.array(musicVenueSchema),
})

import type { ComponentType } from 'react'
import PageRenderingTemplate from '../templates/PageRenderingTemplate/PageRenderingTemplate'
import { aboutSchema } from './About/About.schema'
import aboutRawData from './About/About.data.json'
import { resumeSchema } from './Resume/Resume.schema'
import resumeRawData from './Resume/Resume.data.json'
import { musicSchema } from './Music/Music.schema'
import musicRawData from './Music/Music.data.json'
import { howThisWasBuiltSchema } from './HowThisWasBuilt/HowThisWasBuilt.schema'
import howThisWasBuiltRawData from './HowThisWasBuilt/HowThisWasBuilt.data.json'

export type PageConfig = {
  path: string
  label: string
  component: ComponentType<{ data: unknown }>
  data: unknown
}

export const pages: PageConfig[] = [
  {
    path: '/',
    label: 'About',
    component: PageRenderingTemplate,
    data: aboutSchema.parse(aboutRawData),
  },
  {
    path: '/resume',
    label: 'Resume',
    component: PageRenderingTemplate,
    data: resumeSchema.parse(resumeRawData),
  },
  {
    path: '/music',
    label: 'Music',
    component: PageRenderingTemplate,
    data: musicSchema.parse(musicRawData),
  },
  {
    path: '/how-this-was-built',
    label: 'How this was built',
    component: PageRenderingTemplate,
    data: howThisWasBuiltSchema.parse(howThisWasBuiltRawData),
  },
]

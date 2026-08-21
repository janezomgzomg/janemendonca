import type { ComponentType } from 'react'
import About from './About/About'
import { aboutSchema } from './About/About.schema'
import aboutRawData from './About/About.data.json'
import Resume from './Resume/Resume'
import { resumeSchema } from './Resume/Resume.schema'
import resumeRawData from './Resume/Resume.data.json'
import Music from './Music/Music'
import { musicSchema } from './Music/Music.schema'
import musicRawData from './Music/Music.data.json'
import HowThisWasBuilt from './HowThisWasBuilt/HowThisWasBuilt'
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
    component: About,
    data: aboutSchema.parse(aboutRawData),
  },
  {
    path: '/resume',
    label: 'Resume',
    component: Resume,
    data: resumeSchema.parse(resumeRawData),
  },
  {
    path: '/music',
    label: 'Music',
    component: Music,
    data: musicSchema.parse(musicRawData),
  },
  {
    path: '/how-this-was-built',
    label: 'How this was built',
    component: HowThisWasBuilt,
    data: howThisWasBuiltSchema.parse(howThisWasBuiltRawData),
  },
]

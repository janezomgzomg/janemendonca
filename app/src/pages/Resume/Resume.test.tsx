import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Resume from './Resume'
import { resumeSchema } from './Resume.schema'
import rawData from './Resume.data.json'

describe('Resume', () => {
  it('renders heading and every section title from valid data', () => {
    const data = resumeSchema.parse(rawData)
    render(<Resume data={data} />)

    expect(
      screen.getByRole('heading', { level: 1, name: data.heading }),
    ).toBeInTheDocument()

    for (const section of data.sections) {
      expect(
        screen.getByRole('heading', { level: 2, name: section.title }),
      ).toBeInTheDocument()
    }
  })
})

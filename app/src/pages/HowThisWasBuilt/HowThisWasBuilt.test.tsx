import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageRenderingTemplate from '../../templates/PageRenderingTemplate/PageRenderingTemplate'
import { howThisWasBuiltSchema } from './HowThisWasBuilt.schema'
import rawData from './HowThisWasBuilt.data.json'

describe('HowThisWasBuilt', () => {
  it('renders heading and every section from valid data', () => {
    const data = howThisWasBuiltSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    expect(
      screen.getByRole('heading', { level: 1, name: data.heading }),
    ).toBeInTheDocument()

    for (const section of data.sections) {
      expect(
        screen.getByRole('heading', { level: 2, name: section.heading }),
      ).toBeInTheDocument()
      for (const paragraph of section.paragraphs) {
        expect(screen.getByText(paragraph)).toBeInTheDocument()
      }
    }
  })
})

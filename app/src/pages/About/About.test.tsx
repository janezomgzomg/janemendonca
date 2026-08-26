import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageRenderingTemplate from '../../templates/PageRenderingTemplate/PageRenderingTemplate'
import { aboutSchema } from './About.schema'
import rawData from './About.data.json'

describe('About', () => {
  it('renders heading, image, and every paragraph from valid data', () => {
    const data = aboutSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    expect(
      screen.getByRole('heading', { name: data.heading }),
    ).toBeInTheDocument()

    expect(screen.getByRole('img', { name: data.image.alt })).toHaveAttribute(
      'src',
      data.image.src,
    )

    for (const paragraph of data.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })
})

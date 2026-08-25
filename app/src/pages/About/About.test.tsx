import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from './About'
import { aboutSchema } from './About.schema'
import rawData from './About.data.json'

describe('About', () => {
  it('renders heading, photo, and every paragraph from valid data', () => {
    const data = aboutSchema.parse(rawData)
    render(<About data={data} />)

    expect(
      screen.getByRole('heading', { name: data.heading }),
    ).toBeInTheDocument()

    expect(screen.getByRole('img', { name: data.photo.alt })).toHaveAttribute(
      'src',
      data.photo.src,
    )

    for (const paragraph of data.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })
})

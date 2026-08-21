import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from './About'
import { aboutSchema } from './About.schema'
import rawData from './About.data.json'

describe('About', () => {
  it('renders heading and body from valid data', () => {
    const data = aboutSchema.parse(rawData)
    render(<About data={data} />)

    expect(
      screen.getByRole('heading', { name: data.heading }),
    ).toBeInTheDocument()
    expect(screen.getByText(data.body)).toBeInTheDocument()
  })
})

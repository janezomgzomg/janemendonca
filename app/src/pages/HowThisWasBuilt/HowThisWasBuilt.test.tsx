import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HowThisWasBuilt from './HowThisWasBuilt'
import { howThisWasBuiltSchema } from './HowThisWasBuilt.schema'
import rawData from './HowThisWasBuilt.data.json'

describe('HowThisWasBuilt', () => {
  it('renders heading and body from valid data', () => {
    const data = howThisWasBuiltSchema.parse(rawData)
    render(<HowThisWasBuilt data={data} />)

    expect(
      screen.getByRole('heading', { name: data.heading }),
    ).toBeInTheDocument()
    expect(screen.getByText(data.body)).toBeInTheDocument()
  })
})

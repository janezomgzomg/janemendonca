import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Music from './Music'
import { musicSchema } from './Music.schema'
import rawData from './Music.data.json'

describe('Music', () => {
  it('shows "Coming soon" for links, since placeholder data has none', () => {
    const data = musicSchema.parse(rawData)
    render(<Music data={data} />)

    expect(screen.getByText('Coming soon.')).toBeInTheDocument()
  })

  it('renders every photo and gig from valid data', () => {
    const data = musicSchema.parse(rawData)
    render(<Music data={data} />)

    const photoItems = data.items.filter((item) => item.data.type === 'photo')
    const gigItems = data.items.filter((item) => item.data.type === 'gig')

    for (const item of photoItems) {
      if (item.data.type === 'photo') {
        expect(screen.getByText(item.data.alt)).toBeInTheDocument()
      }
    }

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
      gigItems.length,
    )
  })

  it('filters to a single venue when its facet is selected', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<Music data={data} />)

    await user.click(screen.getByRole('button', { name: /Placeholder Venue B \(/ }))

    expect(screen.getByText(/2024-11-15/)).toBeInTheDocument()
    expect(screen.queryByText(/2025-06-01/)).not.toBeInTheDocument()
    expect(screen.queryByText(/2025-09-10/)).not.toBeInTheDocument()
    expect(screen.queryByText('Placeholder photo at Venue A')).not.toBeInTheDocument()
  })

  it('filters to gigs matching a single-select billing facet', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<Music data={data} />)

    await user.click(screen.getByRole('button', { name: /Headlining Act \(/ }))

    expect(screen.getByText(/2024-11-15/)).toBeInTheDocument()
    expect(screen.queryByText(/2025-06-01/)).not.toBeInTheDocument()
    expect(screen.queryByText(/2025-09-10/)).not.toBeInTheDocument()
  })

  it('OR-combines multiple selected bands from the multi-select facet', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<Music data={data} />)

    await user.click(screen.getByRole('checkbox', { name: /Placeholder Band Y/ }))
    expect(screen.getByText(/2025-09-10/)).toBeInTheDocument()
    expect(screen.queryByText(/2025-06-01/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /Placeholder Band X \(/ }))
    expect(screen.getByText(/2025-09-10/)).toBeInTheDocument()
    expect(screen.getByText(/2025-06-01/)).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PageRenderingTemplate from '../../templates/PageRenderingTemplate/PageRenderingTemplate'
import { musicSchema } from './Music.schema'
import rawData from './Music.data.json'

describe('Music', () => {
  it('renders the Instagram link', () => {
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const instagram = screen.getByRole('link', { name: 'Instagram' })
    expect(instagram).toHaveAttribute(
      'href',
      'https://www.instagram.com/janemendoncakeys/',
    )
    expect(instagram).toHaveAttribute('target', '_blank')
  })

  it('renders every gig from valid data', () => {
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
      data.items.length,
    )
    for (const item of data.items) {
      expect(
        screen.getAllByRole('heading', { level: 3, name: item.data.title })
          .length,
      ).toBeGreaterThan(0)
    }
  })

  it('renders the reference links on the Soundwaves TV entry, opening in a new tab', () => {
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const link = screen.getByRole('link', { name: 'Watch on YouTube' })
    expect(link).toHaveAttribute(
      'href',
      'https://youtu.be/A4xXYbWjIUw?si=Bm4U4oL5RlOS3Eii',
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('filters to a single venue when its facet is selected', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    await user.click(screen.getByRole('button', { name: /Winters Tavern \(/ }))

    expect(screen.getByText(/Aug 23, 2025/)).toBeInTheDocument()
    expect(screen.queryByText(/Sep 27, 2025/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Jan 17, 2026/)).not.toBeInTheDocument()
  })

  it('filters to gigs matching a single-select billing facet', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const headliningItems = data.items.filter((item) =>
      item.facets.billing?.includes('Headlining Act'),
    )

    await user.click(screen.getByRole('button', { name: /Headlining Act \(/ }))

    for (const item of headliningItems) {
      expect(
        screen.getAllByRole('heading', { level: 3, name: item.data.title })
          .length,
      ).toBeGreaterThan(0)
    }
    expect(screen.queryByText(/Aug 23, 2025/)).not.toBeInTheDocument()
  })

  it('filters to a single genre', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const gamelanCount = data.items.filter((item) =>
      item.facets.genre?.includes('Balinese Gamelan'),
    ).length

    await user.click(screen.getByRole('button', { name: /Balinese Gamelan \(/ }))

    expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(
      gamelanCount,
    )
  })

  it('renders the venue address and billing badge on a gig card', async () => {
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    expect(
      screen.getAllByText('1840 Haight St, San Francisco, CA 94117').length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText('Supporting Act').length).toBeGreaterThan(0)
  })

  it('renders the venue name as a link to its website', () => {
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const venueLink = screen.getByRole('link', { name: 'Winters Tavern' })
    expect(venueLink).toHaveAttribute('href', 'https://winterstavern.com/')
    expect(venueLink).toHaveAttribute('target', '_blank')
  })

  it('lists gigs in chronological order', () => {
    const data = musicSchema.parse(rawData)
    const dates = data.items.map((item) => new Date(item.data.subtitle ?? ''))
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime())
    expect(dates).toEqual(sorted)
  })

  it('filters to a single ensemble', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const singJamCount = data.items.filter((item) =>
      item.facets.ensemble?.includes('SingJam'),
    ).length

    await user.click(screen.getByRole('button', { name: /SingJam \(/ }))

    expect(
      screen.getAllByRole('heading', { level: 3 }).length,
    ).toBe(singJamCount)
  })

  it('OR-combines multiple selected bands from the multi-select facet', async () => {
    const user = userEvent.setup()
    const data = musicSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    // "Greg Hoy & The Boys" appears on two different bills
    await user.click(
      screen.getByRole('checkbox', { name: /Greg Hoy & The Boys \(/ }),
    )
    expect(screen.getByText(/Aug 23, 2025/)).toBeInTheDocument()
    expect(screen.getByText(/Sep 27, 2025/)).toBeInTheDocument()
    expect(screen.queryByText(/Jan 17, 2026/)).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('checkbox', { name: /^Tell Me Tell Me \(/ }),
    )
    expect(screen.getByText(/Jan 17, 2026/)).toBeInTheDocument()
  })
})

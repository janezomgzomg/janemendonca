import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Music from './Music'
import { musicSchema } from './Music.schema'
import rawData from './Music.data.json'

describe('Music', () => {
  it('shows "Coming soon" for each empty section in placeholder data', () => {
    const data = musicSchema.parse(rawData)
    render(<Music data={data} />)

    expect(screen.getAllByText('Coming soon.')).toHaveLength(3)
  })

  it('renders links and venues when data is populated', () => {
    const data = musicSchema.parse({
      heading: 'Music',
      photos: [{ src: '/photo.jpg', alt: 'On stage' }],
      links: [{ label: 'Spotify', url: 'https://open.spotify.com/artist/x' }],
      venues: [
        {
          name: 'The Fillmore',
          gigs: [{ date: '2025-06-01', bill: 'Opened for Band X' }],
        },
      ],
    })
    render(<Music data={data} />)

    expect(screen.getByRole('link', { name: 'Spotify' })).toHaveAttribute(
      'href',
      'https://open.spotify.com/artist/x',
    )
    expect(
      screen.getByRole('heading', { level: 3, name: 'The Fillmore' }),
    ).toBeInTheDocument()
    expect(screen.getByText('2025-06-01 — Opened for Band X')).toBeInTheDocument()
  })
})

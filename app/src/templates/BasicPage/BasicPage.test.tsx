import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BasicPage from './BasicPage'
import { basicPageSchema } from './BasicPage.schema'

describe('BasicPage', () => {
  it('renders heading, image, and every paragraph', () => {
    const data = basicPageSchema.parse({
      template: 'basic',
      heading: 'Sample Page',
      image: { src: '/sample.png', alt: 'A sample subject' },
      paragraphs: ['First paragraph.', 'Second paragraph.'],
    })

    render(<BasicPage data={data} />)

    expect(
      screen.getByRole('heading', { name: 'Sample Page' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'A sample subject' })).toHaveAttribute(
      'src',
      '/sample.png',
    )
    expect(screen.getByText('First paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
  })

  it('defaults image position to centered when not specified', () => {
    const data = basicPageSchema.parse({
      template: 'basic',
      heading: 'Sample Page',
      image: { src: '/sample.png', alt: 'A sample subject' },
      paragraphs: ['Paragraph.'],
    })

    render(<BasicPage data={data} />)

    expect(screen.getByRole('img')).toHaveStyle({ objectPosition: '50% 50%' })
  })

  it('applies a custom image position when specified', () => {
    const data = basicPageSchema.parse({
      template: 'basic',
      heading: 'Sample Page',
      image: { src: '/sample.png', alt: 'A sample subject', position: '70% 38%' },
      paragraphs: ['Paragraph.'],
    })

    render(<BasicPage data={data} />)

    expect(screen.getByRole('img')).toHaveStyle({ objectPosition: '70% 38%' })
  })
})

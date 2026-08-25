import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SearchPage from './SearchPage'
import { searchPageSchema } from './SearchPage.schema'

describe('SearchPage', () => {
  it('renders the heading and every result by default, with no Links section when links is omitted', () => {
    const data = searchPageSchema.parse({
      template: 'search',
      heading: 'Fruits',
      facetDefinitions: [{ key: 'color', label: 'Color' }],
      items: [
        { id: '1', facets: { color: ['Red'] }, data: { title: 'Apple' } },
        { id: '2', facets: { color: ['Green'] }, data: { title: 'Lime' } },
      ],
    })

    render(<SearchPage data={data} />)

    expect(screen.getByRole('heading', { name: 'Fruits' })).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Lime')).toBeInTheDocument()
    expect(screen.queryByText('Links')).not.toBeInTheDocument()
  })

  it('renders a Links section when links is present, "Coming soon" when empty', () => {
    const data = searchPageSchema.parse({
      template: 'search',
      heading: 'Fruits',
      links: [],
      facetDefinitions: [{ key: 'color', label: 'Color' }],
      items: [{ id: '1', facets: { color: ['Red'] }, data: { title: 'Apple' } }],
    })

    render(<SearchPage data={data} />)

    expect(screen.getByRole('heading', { name: 'Links' })).toBeInTheDocument()
    expect(screen.getByText('Coming soon.')).toBeInTheDocument()
  })

  it('renders populated links as anchors', () => {
    const data = searchPageSchema.parse({
      template: 'search',
      heading: 'Fruits',
      links: [{ label: 'Store', url: 'https://example.com' }],
      facetDefinitions: [],
      items: [],
    })

    render(<SearchPage data={data} />)

    expect(screen.getByRole('link', { name: 'Store' })).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })

  it('renders subtitle and description when present on a result', () => {
    const data = searchPageSchema.parse({
      template: 'search',
      heading: 'Roles',
      facetDefinitions: [],
      items: [
        {
          id: '1',
          facets: {},
          data: {
            title: 'Engineer',
            subtitle: 'Company — 2020-2023',
            description: 'Did engineering things.',
          },
        },
      ],
    })

    render(<SearchPage data={data} />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Engineer' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Company — 2020-2023')).toBeInTheDocument()
    expect(screen.getByText('Did engineering things.')).toBeInTheDocument()
  })

  it('renders an image result as a placeholder box when src is empty', () => {
    const data = searchPageSchema.parse({
      template: 'search',
      heading: 'Photos',
      facetDefinitions: [],
      items: [
        {
          id: '1',
          facets: {},
          data: { title: 'A photo', image: { src: '', alt: 'A photo caption' } },
        },
      ],
    })

    render(<SearchPage data={data} />)

    expect(screen.getByText('A photo caption')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders an image result as a real image when src is present', () => {
    const data = searchPageSchema.parse({
      template: 'search',
      heading: 'Photos',
      facetDefinitions: [],
      items: [
        {
          id: '1',
          facets: {},
          data: { title: 'A photo', image: { src: '/photo.jpg', alt: 'A photo caption' } },
        },
      ],
    })

    render(<SearchPage data={data} />)

    expect(screen.getByRole('img', { name: 'A photo caption' })).toHaveAttribute(
      'src',
      '/photo.jpg',
    )
  })
})

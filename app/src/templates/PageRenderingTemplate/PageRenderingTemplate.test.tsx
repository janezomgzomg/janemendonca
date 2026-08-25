import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageRenderingTemplate from './PageRenderingTemplate'
import { pageSchema } from './PageRenderingTemplate.schema'

describe('PageRenderingTemplate', () => {
  it('dispatches basic-template data to BasicPage', () => {
    const data = pageSchema.parse({
      template: 'basic',
      heading: 'About',
      image: { src: '/photo.jpg', alt: 'A photo' },
      paragraphs: ['Hello.'],
    })

    render(<PageRenderingTemplate data={data} />)

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText('Hello.')).toBeInTheDocument()
  })

  it('dispatches search-template data to SearchPage', () => {
    const data = pageSchema.parse({
      template: 'search',
      heading: 'Resume',
      facetDefinitions: [],
      items: [{ id: '1', facets: {}, data: { title: 'A role' } }],
    })

    render(<PageRenderingTemplate data={data} />)

    expect(screen.getByRole('heading', { name: 'Resume' })).toBeInTheDocument()
    expect(screen.getByText('A role')).toBeInTheDocument()
  })

  it('dispatches documentation-template data to DocumentationPage', () => {
    const data = pageSchema.parse({
      template: 'documentation',
      heading: 'How this was built',
      sections: [{ heading: 'Stack', paragraphs: ['React and Vite.'] }],
    })

    render(<PageRenderingTemplate data={data} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'How this was built' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Stack' }),
    ).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageRenderingTemplate from './PageRenderingTemplate'
import { pageSchema } from './PageRenderingTemplate.schema'

describe('PageRenderingTemplate', () => {
  describe('basic template', () => {
    it('renders heading, image, and every paragraph', () => {
      const data = pageSchema.parse({
        template: 'basic',
        heading: 'About',
        image: { src: '/photo.jpg', alt: 'A photo' },
        paragraphs: ['First.', 'Second.'],
      })

      render(<PageRenderingTemplate data={data} />)

      expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'A photo' })).toHaveAttribute(
        'src',
        '/photo.jpg',
      )
      expect(screen.getByText('First.')).toBeInTheDocument()
      expect(screen.getByText('Second.')).toBeInTheDocument()
    })

    it('defaults image position to centered, applies a custom one when given', () => {
      const centered = pageSchema.parse({
        template: 'basic',
        heading: 'About',
        image: { src: '/photo.jpg', alt: 'A photo' },
        paragraphs: ['Text.'],
      })
      const { unmount } = render(<PageRenderingTemplate data={centered} />)
      expect(screen.getByRole('img')).toHaveStyle({ objectPosition: '50% 50%' })
      unmount()

      const positioned = pageSchema.parse({
        template: 'basic',
        heading: 'About',
        image: { src: '/photo.jpg', alt: 'A photo', position: '70% 38%' },
        paragraphs: ['Text.'],
      })
      render(<PageRenderingTemplate data={positioned} />)
      expect(screen.getByRole('img')).toHaveStyle({ objectPosition: '70% 38%' })
    })
  })

  describe('search template', () => {
    it('renders the heading and every result, with no Links section when links is omitted', () => {
      const data = pageSchema.parse({
        template: 'search',
        heading: 'Fruits',
        facetDefinitions: [{ key: 'color', label: 'Color' }],
        items: [
          { id: '1', facets: { color: ['Red'] }, data: { title: 'Apple' } },
          { id: '2', facets: { color: ['Green'] }, data: { title: 'Lime' } },
        ],
      })

      render(<PageRenderingTemplate data={data} />)

      expect(screen.getByRole('heading', { name: 'Fruits' })).toBeInTheDocument()
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Lime')).toBeInTheDocument()
      expect(screen.queryByText('Links')).not.toBeInTheDocument()
    })

    it('renders a Links section when links is present, "Coming soon" when empty', () => {
      const data = pageSchema.parse({
        template: 'search',
        heading: 'Fruits',
        links: [],
        facetDefinitions: [],
        items: [],
      })

      render(<PageRenderingTemplate data={data} />)

      expect(screen.getByRole('heading', { name: 'Links' })).toBeInTheDocument()
      expect(screen.getByText('Coming soon.')).toBeInTheDocument()
    })

    it('renders populated links as anchors', () => {
      const data = pageSchema.parse({
        template: 'search',
        heading: 'Fruits',
        links: [{ label: 'Store', url: 'https://example.com' }],
        facetDefinitions: [],
        items: [],
      })

      render(<PageRenderingTemplate data={data} />)

      expect(screen.getByRole('link', { name: 'Store' })).toHaveAttribute(
        'href',
        'https://example.com',
      )
    })

    it('renders subtitle and description when present on a result', () => {
      const data = pageSchema.parse({
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

      render(<PageRenderingTemplate data={data} />)

      expect(
        screen.getByRole('heading', { level: 3, name: 'Engineer' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Company — 2020-2023')).toBeInTheDocument()
      expect(screen.getByText('Did engineering things.')).toBeInTheDocument()
    })

    it('renders an image result as a placeholder box when src is empty, a real image when present', () => {
      const withoutSrc = pageSchema.parse({
        template: 'search',
        heading: 'Photos',
        facetDefinitions: [],
        items: [
          {
            id: '1',
            facets: {},
            data: { title: 'A photo', image: { src: '', alt: 'A caption' } },
          },
        ],
      })
      const { unmount } = render(<PageRenderingTemplate data={withoutSrc} />)
      expect(screen.getByText('A caption')).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      unmount()

      const withSrc = pageSchema.parse({
        template: 'search',
        heading: 'Photos',
        facetDefinitions: [],
        items: [
          {
            id: '1',
            facets: {},
            data: { title: 'A photo', image: { src: '/photo.jpg', alt: 'A caption' } },
          },
        ],
      })
      render(<PageRenderingTemplate data={withSrc} />)
      expect(screen.getByRole('img', { name: 'A caption' })).toHaveAttribute(
        'src',
        '/photo.jpg',
      )
    })
  })

  describe('documentation template', () => {
    it('renders the heading and every section with its paragraphs', () => {
      const sections = [
        { heading: 'Stack', paragraphs: ['React and Vite.'] },
        { heading: 'Deployment', paragraphs: ['GitHub Actions to gh-pages.'] },
      ]
      const data = pageSchema.parse({
        template: 'documentation',
        heading: 'How this was built',
        sections,
      })

      render(<PageRenderingTemplate data={data} />)

      expect(
        screen.getByRole('heading', { level: 1, name: 'How this was built' }),
      ).toBeInTheDocument()

      for (const section of sections) {
        expect(
          screen.getByRole('heading', { level: 2, name: section.heading }),
        ).toBeInTheDocument()
        for (const paragraph of section.paragraphs) {
          expect(screen.getByText(paragraph)).toBeInTheDocument()
        }
      }
    })
  })
})

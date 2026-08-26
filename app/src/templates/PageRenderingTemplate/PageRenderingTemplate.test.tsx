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
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders nothing for an empty links array', () => {
      const data = pageSchema.parse({
        template: 'search',
        heading: 'Fruits',
        links: [],
        facetDefinitions: [],
        items: [],
      })

      render(<PageRenderingTemplate data={data} />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders populated links as icon anchors that open in a new tab', () => {
      const data = pageSchema.parse({
        template: 'search',
        heading: 'Fruits',
        links: [
          { label: 'GitHub', url: 'https://example.com', icon: 'github' },
        ],
        facetDefinitions: [],
        items: [],
      })

      render(<PageRenderingTemplate data={data} />)

      const link = screen.getByRole('link', { name: 'GitHub' })
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
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
    it('renders the heading and every section with its content blocks', () => {
      const sections = [
        {
          heading: 'Stack',
          content: [{ kind: 'paragraph' as const, text: 'React and Vite.' }],
        },
        {
          heading: 'Deployment',
          content: [
            { kind: 'paragraph' as const, text: 'GitHub Actions to gh-pages.' },
          ],
        },
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
        for (const block of section.content) {
          expect(screen.getByText(block.text)).toBeInTheDocument()
        }
      }
    })

    it('renders a code block as <pre><code>, with its language label', () => {
      const data = pageSchema.parse({
        template: 'documentation',
        heading: 'How this was built',
        sections: [
          {
            heading: 'Stack',
            content: [
              {
                kind: 'code',
                language: 'ts',
                code: 'type X = { a: string }',
              },
            ],
          },
        ],
      })

      render(<PageRenderingTemplate data={data} />)

      expect(screen.getByText('ts')).toBeInTheDocument()
      const code = screen.getByText('type X = { a: string }')
      expect(code.tagName).toBe('CODE')
      expect(code.closest('pre')).not.toBeNull()
    })

    it('renders a links section inline with the heading, same as search pages', () => {
      const data = pageSchema.parse({
        template: 'documentation',
        heading: 'How this was built',
        links: [
          {
            label: 'View Source on GitHub',
            url: 'https://github.com/example/example',
            icon: 'github',
          },
        ],
        sections: [],
      })

      render(<PageRenderingTemplate data={data} />)

      const link = screen.getByRole('link', { name: 'View Source on GitHub' })
      expect(link).toHaveAttribute('href', 'https://github.com/example/example')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })
})

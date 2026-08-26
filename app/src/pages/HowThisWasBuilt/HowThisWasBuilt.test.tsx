import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageRenderingTemplate from '../../templates/PageRenderingTemplate/PageRenderingTemplate'
import { howThisWasBuiltSchema } from './HowThisWasBuilt.schema'
import rawData from './HowThisWasBuilt.data.json'

describe('HowThisWasBuilt', () => {
  it('renders heading and every section with its content blocks', () => {
    const data = howThisWasBuiltSchema.parse(rawData)
    const { container } = render(<PageRenderingTemplate data={data} />)

    expect(
      screen.getByRole('heading', { level: 1, name: data.heading }),
    ).toBeInTheDocument()

    // getByText normalizes whitespace, which breaks exact matching against
    // multi-line code — compare raw textContent of <code> elements instead.
    const codeTexts = [...container.querySelectorAll('pre code')].map(
      (el) => el.textContent,
    )

    for (const section of data.sections) {
      expect(
        screen.getByRole('heading', { level: 2, name: section.heading }),
      ).toBeInTheDocument()

      for (const block of section.content) {
        if (block.kind === 'paragraph') {
          expect(screen.getByText(block.text)).toBeInTheDocument()
        } else {
          expect(codeTexts).toContain(block.code)
        }
      }
    }
  })

  it('renders code blocks in a <pre><code> with their language label', () => {
    const data = howThisWasBuiltSchema.parse(rawData)
    const { container } = render(<PageRenderingTemplate data={data} />)

    const codeBlock = data.sections
      .flatMap((section) => section.content)
      .find((block) => block.kind === 'code')
    if (!codeBlock || codeBlock.kind !== 'code') {
      throw new Error('expected at least one code block in placeholder data')
    }

    expect(screen.getByText(codeBlock.language!)).toBeInTheDocument()

    const codeElement = container.querySelector('pre code')
    expect(codeElement?.textContent).toBe(codeBlock.code)
  })

  it('renders the GitHub source link, opening in a new tab', () => {
    const data = howThisWasBuiltSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const link = screen.getByRole('link', { name: 'View Source on GitHub' })
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/janezomgzomg/janemendonca',
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

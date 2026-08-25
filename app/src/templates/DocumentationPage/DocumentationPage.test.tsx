import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DocumentationPage from './DocumentationPage'
import { documentationPageSchema } from './DocumentationPage.schema'

describe('DocumentationPage', () => {
  it('renders the heading and every section with its paragraphs', () => {
    const data = documentationPageSchema.parse({
      template: 'documentation',
      heading: 'How this was built',
      sections: [
        { heading: 'Stack', paragraphs: ['React, Vite, TypeScript.'] },
        { heading: 'Deployment', paragraphs: ['GitHub Actions to gh-pages.'] },
      ],
    })

    render(<DocumentationPage data={data} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'How this was built' }),
    ).toBeInTheDocument()

    for (const section of data.sections) {
      expect(
        screen.getByRole('heading', { level: 2, name: section.heading }),
      ).toBeInTheDocument()
      for (const paragraph of section.paragraphs) {
        expect(screen.getByText(paragraph)).toBeInTheDocument()
      }
    }
  })
})

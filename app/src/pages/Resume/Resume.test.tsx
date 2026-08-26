import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PageRenderingTemplate from '../../templates/PageRenderingTemplate/PageRenderingTemplate'
import { resumeSchema } from './Resume.schema'
import rawData from './Resume.data.json'

describe('Resume', () => {
  it('renders heading and every experience entry from valid data', () => {
    const data = resumeSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    expect(
      screen.getByRole('heading', { level: 1, name: data.heading }),
    ).toBeInTheDocument()

    for (const item of data.items) {
      expect(
        screen.getByRole('heading', { level: 3, name: item.data.title }),
      ).toBeInTheDocument()
    }
  })

  it('renders the LinkedIn and GitHub links', () => {
    const data = resumeSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    const linkedin = screen.getByRole('link', { name: 'LinkedIn' })
    expect(linkedin).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jane-mendonca-ab218a43/',
    )
    expect(linkedin).toHaveAttribute('target', '_blank')

    const github = screen.getByRole('link', { name: 'GitHub' })
    expect(github).toHaveAttribute('href', 'https://github.com/janezomgzomg')
    expect(github).toHaveAttribute('target', '_blank')
  })

  it('filters experience entries via the multi-select skill facet', async () => {
    const user = userEvent.setup()
    const data = resumeSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    await user.click(screen.getByRole('checkbox', { name: /Placeholder Skill A \(/ }))

    const skillAItems = data.items.filter((item) =>
      item.facets.skill?.includes('Placeholder Skill A'),
    )
    const otherItems = data.items.filter(
      (item) => !item.facets.skill?.includes('Placeholder Skill A'),
    )

    for (const item of skillAItems) {
      expect(
        screen.getByRole('heading', { level: 3, name: item.data.title }),
      ).toBeInTheDocument()
    }
    for (const item of otherItems) {
      expect(
        screen.queryByRole('heading', { level: 3, name: item.data.title }),
      ).not.toBeInTheDocument()
    }

    // OR-combine with the second skill to bring back the excluded entries
    await user.click(screen.getByRole('checkbox', { name: /Placeholder Skill B \(/ }))
    for (const item of data.items) {
      expect(
        screen.getByRole('heading', { level: 3, name: item.data.title }),
      ).toBeInTheDocument()
    }
  })
})

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

  it("renders every entry's bullet list", () => {
    const data = resumeSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    for (const item of data.items) {
      for (const bullet of item.data.bullets ?? []) {
        expect(screen.getByText(bullet)).toBeInTheDocument()
      }
    }
  })

  it('renders bullets inside a collapsible <details>, closed by default, labeled "Role & Responsibilities"', () => {
    const data = resumeSchema.parse(rawData)
    const { container } = render(<PageRenderingTemplate data={data} />)

    const detailsElements = container.querySelectorAll('details')
    expect(detailsElements).toHaveLength(data.items.length)

    for (const details of detailsElements) {
      expect(details).not.toHaveAttribute('open')
      expect(details.querySelector('summary')?.textContent).toBe(
        'Role & Responsibilities',
      )
    }
  })

  it('renders each skill tag as a chip under a "Skills" label', () => {
    const data = resumeSchema.parse(rawData)
    render(<PageRenderingTemplate data={data} />)

    expect(screen.getAllByText('Skills').length).toBe(data.items.length)

    const uniqueSkills = new Set(
      data.items.flatMap((item) => item.data.skillTags ?? []),
    )
    for (const skill of uniqueSkills) {
      expect(screen.getAllByText(skill).length).toBeGreaterThan(0)
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

    const bySkill = (skill: string) =>
      data.items.filter((item) => item.facets.skill?.includes(skill))
    const notBySkill = (skill: string) =>
      data.items.filter((item) => !item.facets.skill?.includes(skill))

    // "AI-assisted Development" is unique to the Senior Software Engineer
    // role, so selecting it alone should isolate just that one entry.
    await user.click(
      screen.getByRole('checkbox', { name: /AI-assisted Development \(/ }),
    )

    for (const item of bySkill('AI-assisted Development')) {
      expect(
        screen.getByRole('heading', { level: 3, name: item.data.title }),
      ).toBeInTheDocument()
    }
    for (const item of notBySkill('AI-assisted Development')) {
      expect(
        screen.queryByRole('heading', { level: 3, name: item.data.title }),
      ).not.toBeInTheDocument()
    }

    // OR-combine with a skill two other roles share, bringing them back too
    await user.click(
      screen.getByRole('checkbox', { name: /Search & AI-Powered Search \(/ }),
    )
    const union = new Set([
      ...bySkill('AI-assisted Development').map((item) => item.id),
      ...bySkill('Search & AI-Powered Search').map((item) => item.id),
    ])
    for (const item of data.items) {
      const heading = screen.queryByRole('heading', {
        level: 3,
        name: item.data.title,
      })
      if (union.has(item.id)) {
        expect(heading).toBeInTheDocument()
      } else {
        expect(heading).not.toBeInTheDocument()
      }
    }
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Nav from './Nav'

describe('Nav', () => {
  it('renders a link for each item', () => {
    const items = [
      { path: '/', label: 'About' },
      { path: '/resume', label: 'Resume' },
    ]

    render(
      <MemoryRouter>
        <Nav items={items} />
      </MemoryRouter>,
    )

    for (const item of items) {
      expect(
        screen.getByRole('link', { name: item.label }),
      ).toHaveAttribute('href', item.path)
    }
  })
})

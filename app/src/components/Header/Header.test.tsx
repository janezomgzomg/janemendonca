import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

describe('Header', () => {
  it('renders the site name and the given nav items', () => {
    const items = [
      { path: '/', label: 'About' },
      { path: '/resume', label: 'Resume' },
    ]

    render(
      <MemoryRouter>
        <Header items={items} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Jane Mendonca')).toBeInTheDocument()
    for (const item of items) {
      expect(
        screen.getByRole('link', { name: item.label }),
      ).toHaveAttribute('href', item.path)
    }
  })
})

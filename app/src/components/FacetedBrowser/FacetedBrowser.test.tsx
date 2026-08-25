import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FacetedBrowser from './FacetedBrowser'
import type { FacetedDataset } from './FacetedBrowser.types'

type SampleData = { name: string }

const dataset: FacetedDataset<SampleData> = {
  facetDefinitions: [{ key: 'color', label: 'Color', multiSelect: false }],
  items: [
    { id: '1', facets: { color: ['Red'] }, data: { name: 'Apple' } },
    { id: '2', facets: { color: ['Green'] }, data: { name: 'Lime' } },
  ],
}

const multiSelectDataset: FacetedDataset<SampleData> = {
  facetDefinitions: [{ key: 'tag', label: 'Tag', multiSelect: true }],
  items: [
    { id: '1', facets: { tag: ['A'] }, data: { name: 'Apple' } },
    { id: '2', facets: { tag: ['B'] }, data: { name: 'Banana' } },
    { id: '3', facets: { tag: ['A', 'B'] }, data: { name: 'AB Fruit' } },
  ],
}

describe('FacetedBrowser', () => {
  it('shows every item by default', () => {
    render(
      <FacetedBrowser dataset={dataset} renderResult={(item) => item.data.name} />,
    )

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Lime')).toBeInTheDocument()
  })

  it('filters to matching items when a facet value is selected, and clears on second click', async () => {
    const user = userEvent.setup()
    render(
      <FacetedBrowser dataset={dataset} renderResult={(item) => item.data.name} />,
    )

    await user.click(screen.getByRole('button', { name: /Red/ }))
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.queryByText('Lime')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Red/ }))
    expect(screen.getByText('Lime')).toBeInTheDocument()
  })

  it('resets to showing every item via the Clear all filters button', async () => {
    const user = userEvent.setup()
    render(
      <FacetedBrowser dataset={dataset} renderResult={(item) => item.data.name} />,
    )

    await user.click(screen.getByRole('button', { name: /Red/ }))
    expect(screen.queryByText('Lime')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear all filters' }))
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Lime')).toBeInTheDocument()
  })

  it('OR-combines multiple checked values within a multi-select facet', async () => {
    const user = userEvent.setup()
    render(
      <FacetedBrowser
        dataset={multiSelectDataset}
        renderResult={(item) => item.data.name}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: /^A / }))
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('AB Fruit')).toBeInTheDocument()
    expect(screen.queryByText('Banana')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /^B / }))
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('AB Fruit')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /^A / }))
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('AB Fruit')).toBeInTheDocument()
  })

  it('AND-combines selections across different facet categories', async () => {
    const user = userEvent.setup()
    const twoCategoryDataset: FacetedDataset<SampleData> = {
      facetDefinitions: [
        { key: 'color', label: 'Color', multiSelect: false },
        { key: 'size', label: 'Size', multiSelect: false },
      ],
      items: [
        { id: '1', facets: { color: ['Red'], size: ['Small'] }, data: { name: 'Small Red' } },
        { id: '2', facets: { color: ['Red'], size: ['Large'] }, data: { name: 'Large Red' } },
        { id: '3', facets: { color: ['Green'], size: ['Small'] }, data: { name: 'Small Green' } },
      ],
    }

    render(
      <FacetedBrowser
        dataset={twoCategoryDataset}
        renderResult={(item) => item.data.name}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Red/ }))
    expect(screen.getByText('Small Red')).toBeInTheDocument()
    expect(screen.getByText('Large Red')).toBeInTheDocument()
    expect(screen.queryByText('Small Green')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Small/ }))
    expect(screen.getByText('Small Red')).toBeInTheDocument()
    expect(screen.queryByText('Large Red')).not.toBeInTheDocument()
    expect(screen.queryByText('Small Green')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear all filters' }))
    expect(screen.getByText('Small Red')).toBeInTheDocument()
    expect(screen.getByText('Large Red')).toBeInTheDocument()
    expect(screen.getByText('Small Green')).toBeInTheDocument()
  })
})

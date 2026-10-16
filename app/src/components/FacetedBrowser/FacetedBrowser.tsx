import { useState } from 'react'
import type { ReactNode } from 'react'
import type { FacetedDataset, FacetedItem } from './FacetedBrowser.types'
import './FacetedBrowser.css'

// Selected values keyed by facet category. Categories combine with AND
// (an item must match every active category); values within one category
// combine with OR. A single-select category's array never holds more than
// one value.
type Selection = Record<string, string[]>

// An optional highlighted group shown above the other results (e.g. Music's
// upcoming gigs). It respects the active filters like any other result;
// `compare` reorders just this group.
export type PinnedGroup<T> = {
  heading: string
  matches: (item: FacetedItem<T>) => boolean
  compare?: (a: FacetedItem<T>, b: FacetedItem<T>) => number
}

export default function FacetedBrowser<T>({
  dataset,
  renderResult,
  pinned,
}: {
  dataset: FacetedDataset<T>
  renderResult: (item: FacetedItem<T>) => ReactNode
  pinned?: PinnedGroup<T>
}) {
  const [selected, setSelected] = useState<Selection>({})
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeKeys = Object.keys(selected)
  const visibleItems =
    activeKeys.length === 0
      ? dataset.items
      : dataset.items.filter((item) =>
          activeKeys.every((key) =>
            item.facets[key]?.some((value) => selected[key].includes(value)),
          ),
        )

  const pinnedItems = pinned ? visibleItems.filter(pinned.matches) : []
  if (pinned?.compare) pinnedItems.sort(pinned.compare)
  const otherItems = pinned
    ? visibleItems.filter((item) => !pinned.matches(item))
    : visibleItems

  function toggleValue(facetKey: string, value: string, multiSelect: boolean) {
    setSelected((current) => {
      const currentValues = current[facetKey] ?? []

      const nextValues = !multiSelect
        ? currentValues[0] === value
          ? []
          : [value]
        : currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value]

      const next = { ...current }
      if (nextValues.length === 0) {
        delete next[facetKey]
      } else {
        next[facetKey] = nextValues
      }
      return next
    })
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-[200px_1fr]">
      <aside>
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          className="mb-4 flex w-full items-center justify-between text-xs font-semibold tracking-wide text-ink/50 uppercase sm:hidden"
        >
          Filters
          <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
        </button>
        <div className={`${filtersOpen ? 'block' : 'hidden'} sm:block`}>
          {dataset.facetDefinitions.map((facet) => {
            const values = Array.from(
              new Set(dataset.items.flatMap((item) => item.facets[facet.key] ?? [])),
            ).sort()

            if (values.length === 0) return null

            return (
              <fieldset key={facet.key} className="mb-6 border-0 p-0">
                <legend className="p-0 text-xs font-semibold tracking-wide text-ink/50 uppercase">
                  {facet.label}
                </legend>
                <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1 text-sm">
                  {values.map((value) => {
                    const count = dataset.items.filter((item) =>
                      item.facets[facet.key]?.includes(value),
                    ).length
                    const isActive = selected[facet.key]?.includes(value) ?? false

                    if (facet.multiSelect) {
                      const inputId = `facet-${facet.key}-${value}`
                      return (
                        <li key={value}>
                          <label htmlFor={inputId} className="flex items-center gap-2">
                            <input
                              id={inputId}
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleValue(facet.key, value, true)}
                            />
                            <span
                              className={
                                isActive ? 'font-medium text-accent' : 'text-ink/70'
                              }
                            >
                              {value} <span className="text-ink/40">({count})</span>
                            </span>
                          </label>
                        </li>
                      )
                    }

                    return (
                      <li key={value}>
                        <button
                          type="button"
                          onClick={() => toggleValue(facet.key, value, false)}
                          className={
                            isActive
                              ? 'font-medium text-accent'
                              : 'text-ink/70 hover:text-ink'
                          }
                        >
                          {value} <span className="text-ink/40">({count})</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </fieldset>
            )
          })}

          {activeKeys.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected({})}
              className="text-sm text-accent"
            >
              Clear all filters
            </button>
          )}
        </div>
      </aside>

      <div>
        {visibleItems.length === 0 ? (
          <p>No results.</p>
        ) : (
          <>
            {pinned && pinnedItems.length > 0 && (
              <section
                aria-labelledby="pinned-results-heading"
                className="mb-8 rounded-lg border border-accent/30 bg-accent/5 p-4"
              >
                <h2
                  id="pinned-results-heading"
                  className="mb-4 font-sans text-xs font-semibold tracking-wide text-accent uppercase"
                >
                  {pinned.heading}
                </h2>
                <ul className="space-y-6">
                  {pinnedItems.map((item) => (
                    <li key={item.id}>{renderResult(item)}</li>
                  ))}
                </ul>
              </section>
            )}
            {otherItems.length > 0 && (
              <ul className="space-y-6">
                {otherItems.map((item) => (
                  <li key={item.id}>{renderResult(item)}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}

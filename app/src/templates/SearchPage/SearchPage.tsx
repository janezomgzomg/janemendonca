import FacetedBrowser from '../../components/FacetedBrowser/FacetedBrowser'
import type { FacetedItem } from '../../components/FacetedBrowser/FacetedBrowser.types'
import type { SearchPageData, SearchResultData } from './SearchPage.types'
import './SearchPage.css'

function SearchResultCard({ data }: { data: SearchResultData }) {
  if (data.image) {
    return data.image.src ? (
      <img
        src={data.image.src}
        alt={data.image.alt}
        className="aspect-square w-full rounded object-cover"
      />
    ) : (
      <div className="flex aspect-square items-center justify-center border border-ink/10 bg-ink/5 text-sm text-ink/50">
        {data.image.alt}
      </div>
    )
  }

  return (
    <article>
      <h3 className="font-display text-lg font-medium">{data.title}</h3>
      {data.subtitle && <p className="text-sm text-ink/70">{data.subtitle}</p>}
      {data.description && <p className="mt-1">{data.description}</p>}
    </article>
  )
}

export default function SearchPage({ data }: { data: unknown }) {
  const { heading, links, facetDefinitions, items } = data as SearchPageData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      {links !== undefined && (
        <div className="mt-6">
          <h2 className="text-xl font-medium">Links</h2>
          {links.length === 0 ? (
            <p className="mt-2">Coming soon.</p>
          ) : (
            <ul className="mt-2 list-disc pl-5">
              {links.map((link) => (
                <li key={link.url}>
                  <a href={link.url}>{link.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="mt-6">
        <FacetedBrowser
          dataset={{ facetDefinitions, items }}
          renderResult={(item: FacetedItem<SearchResultData>) => (
            <SearchResultCard data={item.data} />
          )}
        />
      </div>
    </section>
  )
}

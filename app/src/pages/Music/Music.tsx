import FacetedBrowser from '../../components/FacetedBrowser/FacetedBrowser'
import type { MusicData } from './Music.types'
import './Music.css'

export default function Music({ data }: { data: unknown }) {
  const { heading, links, facetDefinitions, items } = data as MusicData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>

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

      <div className="mt-6">
        <h2 className="text-xl font-medium">Photos &amp; Gigs</h2>
        {items.length === 0 ? (
          <p className="mt-2">Coming soon.</p>
        ) : (
          <div className="mt-2">
            <FacetedBrowser
              dataset={{ facetDefinitions, items }}
              renderResult={(item) =>
                item.data.type === 'photo' ? (
                  <div className="flex aspect-square items-center justify-center border border-ink/10 bg-ink/5 text-sm text-ink/50">
                    {item.data.alt}
                  </div>
                ) : (
                  <article>
                    <h3 className="font-display text-lg font-medium">
                      {item.data.venue}
                    </h3>
                    <p className="text-sm text-ink/70">
                      {item.data.date} — {item.data.billing}
                    </p>
                    {item.data.bill.length > 0 && (
                      <p className="mt-1 text-sm text-ink/70">
                        With {item.data.bill.join(', ')}
                      </p>
                    )}
                  </article>
                )
              }
            />
          </div>
        )}
      </div>
    </section>
  )
}

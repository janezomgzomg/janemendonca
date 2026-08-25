import FacetedBrowser from '../../components/FacetedBrowser/FacetedBrowser'
import type { ResumeData } from './Resume.types'
import './Resume.css'

export default function Resume({ data }: { data: unknown }) {
  const { heading, facetDefinitions, items } = data as ResumeData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      <div className="mt-6">
        <FacetedBrowser
          dataset={{ facetDefinitions, items }}
          renderResult={(item) => (
            <article>
              <h3 className="font-display text-lg font-medium">
                {item.data.role}
              </h3>
              <p className="text-sm text-ink/70">
                {item.data.company} — {item.data.period}
              </p>
              <p className="mt-1">{item.data.description}</p>
            </article>
          )}
        />
      </div>
    </section>
  )
}

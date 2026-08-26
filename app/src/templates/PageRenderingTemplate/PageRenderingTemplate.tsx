import { Fragment } from 'react'
import type { ReactNode } from 'react'
import FacetedBrowser from '../../components/FacetedBrowser/FacetedBrowser'
import type {
  FacetDefinition,
  FacetedItem,
} from '../../components/FacetedBrowser/FacetedBrowser.types'
import type { SearchResultData } from '../SearchPage/SearchPage.types'
import basicLayoutRaw from '../BasicPage/BasicPage.layout.json'
import searchLayoutRaw from '../SearchPage/SearchPage.layout.json'
import documentationLayoutRaw from '../DocumentationPage/DocumentationPage.layout.json'
import { layoutSchema } from './PageRenderingTemplate.schema'
import type { PageData, Section } from './PageRenderingTemplate.types'
import './PageRenderingTemplate.css'

const layouts: Record<PageData['template'], Section[]> = {
  basic: layoutSchema.parse(basicLayoutRaw),
  search: layoutSchema.parse(searchLayoutRaw),
  documentation: layoutSchema.parse(documentationLayoutRaw),
}

// A section names its fields by string (imageField, textField, ...), so
// looking them up is inherently dynamic — the trade-off for making layout
// itself data-driven. The underlying page data is still fully typed and
// validated by each template's schema.ts at the registry loading boundary;
// this function is the one place that re-introduces a cast.
function getField(data: Record<string, unknown>, field: string): unknown {
  return data[field]
}

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

function renderSection(section: Section, data: Record<string, unknown>): ReactNode {
  switch (section.kind) {
    case 'imageWithText': {
      const image = getField(data, section.imageField) as {
        src: string
        alt: string
        position?: string
      }
      const paragraphs = getField(data, section.textField) as string[]

      return (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[240px_1fr]">
          <img
            src={image.src}
            alt={image.alt}
            className="aspect-3/4 w-full rounded-lg object-cover"
            style={{ objectPosition: image.position ?? '50% 50%' }}
          />
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )
    }

    case 'linkList': {
      const links = getField(data, section.field) as
        | { label: string; url: string }[]
        | undefined
      if (links === undefined) return null

      return (
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
      )
    }

    case 'facetedSearch': {
      const facetDefinitions = getField(data, section.facetsField) as FacetDefinition[]
      const items = getField(data, section.itemsField) as FacetedItem<SearchResultData>[]

      return (
        <div className="mt-6">
          <FacetedBrowser
            dataset={{ facetDefinitions, items }}
            renderResult={(item) => <SearchResultCard data={item.data} />}
          />
        </div>
      )
    }

    case 'sectionList': {
      const sections = getField(data, section.field) as {
        heading: string
        paragraphs: string[]
      }[]

      return (
        <>
          {sections.map((s, index) => (
            <div key={index} className="mt-6">
              <h2 className="text-xl font-medium">{s.heading}</h2>
              <div className="mt-2 space-y-4">
                {s.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </>
      )
    }
  }
}

export default function PageRenderingTemplate({ data }: { data: unknown }) {
  const page = data as PageData
  const layout = layouts[page.template]
  const fields = page as unknown as Record<string, unknown>

  return (
    <section>
      <h1 className="text-3xl font-semibold">{page.heading}</h1>
      {layout.map((section, index) => (
        <Fragment key={index}>{renderSection(section, fields)}</Fragment>
      ))}
    </section>
  )
}

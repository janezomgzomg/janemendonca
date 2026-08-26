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

// Minimal monochrome brand marks (matching the icon set convention used by
// Simple Icons/Font Awesome brands, CC0/permissively licensed), sized via
// currentColor so they inherit the surrounding text color.
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

const linkIcons = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
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
      {data.skillTags && data.skillTags.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-ink/70">
            {data.skillTagsLabel ?? 'Skills'}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {data.skillTags.map((skill, index) => (
              <span
                key={index}
                className="rounded-md bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.bullets && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm font-medium text-ink/70 hover:text-ink">
            {data.bulletsLabel ?? 'Details'}
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {data.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}

type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; code: string; language?: string }

function renderContentBlock(block: ContentBlock): ReactNode {
  if (block.kind === 'code') {
    return (
      <div>
        {block.language && (
          <p className="font-mono text-xs text-ink/50">{block.language}</p>
        )}
        <pre className="mt-1 overflow-x-auto rounded-lg border border-ink/10 bg-ink/5 p-4 font-mono text-sm">
          <code>{block.code}</code>
        </pre>
      </div>
    )
  }

  return <p>{block.text}</p>
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
        | { label: string; url: string; icon: keyof typeof linkIcons }[]
        | undefined
      if (!links || links.length === 0) return null

      return (
        <div className="flex gap-4">
          {links.map((link) => {
            const Icon = linkIcons[link.icon]
            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
                className="text-ink/70 hover:text-accent"
              >
                <Icon />
              </a>
            )
          })}
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
        content: ContentBlock[]
      }[]

      return (
        <>
          {sections.map((s, index) => (
            <div key={index} className="mt-6">
              <h2 className="text-xl font-medium">{s.heading}</h2>
              <div className="mt-2 space-y-4">
                {s.content.map((block, bIndex) => (
                  <Fragment key={bIndex}>{renderContentBlock(block)}</Fragment>
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

  // linkList renders inline with the heading (top-right) rather than as its
  // own stacked block, so it's pulled out of the normal section sequence.
  const linkListSection = layout.find((section) => section.kind === 'linkList')
  const remainingSections = layout.filter((section) => section.kind !== 'linkList')

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">{page.heading}</h1>
        {linkListSection && renderSection(linkListSection, fields)}
      </div>
      {remainingSections.map((section, index) => (
        <Fragment key={index}>{renderSection(section, fields)}</Fragment>
      ))}
    </section>
  )
}

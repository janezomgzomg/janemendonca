import type { DocumentationPageData } from './DocumentationPage.types'
import './DocumentationPage.css'

export default function DocumentationPage({ data }: { data: unknown }) {
  const { heading, sections } = data as DocumentationPageData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      {sections.map((section, index) => (
        <div key={index} className="mt-6">
          <h2 className="text-xl font-medium">{section.heading}</h2>
          <div className="mt-2 space-y-4">
            {section.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

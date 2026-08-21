import type { ResumeData } from './Resume.types'
import './Resume.css'

export default function Resume({ data }: { data: unknown }) {
  const { heading, sections } = data as ResumeData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      {sections.map((section) => (
        <div key={section.title} className="mt-6">
          <h2 className="text-xl font-medium">{section.title}</h2>
          <ul className="mt-2 list-disc pl-5">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

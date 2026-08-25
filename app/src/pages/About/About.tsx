import type { AboutData } from './About.types'
import './About.css'

export default function About({ data }: { data: unknown }) {
  const { heading, photo, paragraphs } = data as AboutData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[240px_1fr]">
        <img
          src={photo.src}
          alt={photo.alt}
          className="aspect-3/4 w-full rounded-lg object-cover object-[70%_38%]"
        />
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

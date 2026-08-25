import type { BasicPageData } from './BasicPage.types'
import './BasicPage.css'

export default function BasicPage({ data }: { data: unknown }) {
  const { heading, image, paragraphs } = data as BasicPageData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
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
    </section>
  )
}

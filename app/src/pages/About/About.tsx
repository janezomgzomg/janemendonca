import type { AboutData } from './About.types'
import './About.css'

export default function About({ data }: { data: unknown }) {
  const { heading, body } = data as AboutData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      <p className="mt-4">{body}</p>
    </section>
  )
}

import type { HowThisWasBuiltData } from './HowThisWasBuilt.types'
import './HowThisWasBuilt.css'

export default function HowThisWasBuilt({ data }: { data: unknown }) {
  const { heading, body } = data as HowThisWasBuiltData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      <p className="mt-4">{body}</p>
    </section>
  )
}

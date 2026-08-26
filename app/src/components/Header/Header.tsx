import { headerSchema } from './Header.schema'
import rawData from './Header.data.json'
import Nav from '../Nav/Nav'
import type { NavItem } from '../Nav/Nav.types'
import './Header.css'

const { name } = headerSchema.parse(rawData)

export default function Header({ items }: { items: NavItem[] }) {
  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4">
        <span className="whitespace-nowrap font-signature text-4xl">
          {name}
        </span>
        <Nav items={items} />
      </div>
    </header>
  )
}

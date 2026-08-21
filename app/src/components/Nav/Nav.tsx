import { NavLink } from 'react-router-dom'
import type { NavItem } from './Nav.types'
import './Nav.css'

export default function Nav({ items }: { items: NavItem[] }) {
  return (
    <nav className="flex gap-4 p-4">
      {items.map((item) => (
        <NavLink key={item.path} to={item.path} end={item.path === '/'}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

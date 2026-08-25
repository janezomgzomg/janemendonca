import { NavLink } from 'react-router-dom'
import type { NavItem } from './Nav.types'
import './Nav.css'

export default function Nav({ items }: { items: NavItem[] }) {
  return (
    <nav>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:gap-x-6">
        {items.map((item) => (
          <li key={item.path} className="whitespace-nowrap">
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'font-medium text-accent no-underline'
                  : 'text-ink/70 no-underline hover:text-ink'
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

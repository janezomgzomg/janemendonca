import { NavLink } from 'react-router-dom'

type NavItem = {
  path: string
  label: string
}

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

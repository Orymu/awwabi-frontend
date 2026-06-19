import WaitlistButton from './WaitlistButton'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Primary">
      <span className="navbar__brand">Awwabi</span>

      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <WaitlistButton />
    </nav>
  )
}

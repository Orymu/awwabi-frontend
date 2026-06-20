import { siteConfig } from '@/config/site'
import { WaitlistButton } from '@/components/ui/waitlist-button'

export function Navbar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 top-[46px] z-100 flex w-[min(698px,calc(100%-32px))] -translate-x-1/2 items-center justify-center gap-20 rounded-[35px] bg-white px-4 py-2 shadow-[0_8px_24px_rgba(24,24,27,0.08)]"
    >
      <span className="font-brand text-2xl font-semibold leading-7 whitespace-nowrap text-yellow-800">
        {siteConfig.name}
      </span>

      <ul className="flex flex-1 list-none items-center gap-[26px] font-ui text-base font-medium leading-6 whitespace-nowrap text-[var(--color-ink)] max-sm:hidden">
        {siteConfig.nav.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition-colors hover:text-yellow-800">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <WaitlistButton />
    </nav>
  )
}

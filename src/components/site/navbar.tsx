import { siteConfig } from '@/config/site'
import { WaitlistButton } from '@/components/ui/waitlist-button'

export function Navbar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 top-[46px] z-100 flex w-[min(698px,calc(100%-32px))] -translate-x-1/2 items-center justify-between gap-4 rounded-[35px] bg-white px-4 py-2 shadow-[0_8px_24px_rgba(24,24,27,0.08)] max-md:top-4 max-md:left-2 max-md:right-2 max-md:w-auto max-md:translate-x-0 max-md:mx-0 max-md:gap-2 max-md:px-5 max-md:py-3"
    >
      <span className="font-brand text-2xl font-semibold leading-7 whitespace-nowrap text-yellow-800 max-md:text-lg max-md:flex-1">
        {siteConfig.name}
      </span>

      <ul className="flex flex-1 list-none items-center justify-center gap-[26px] font-ui text-base font-medium leading-6 whitespace-nowrap text-[var(--color-ink)] max-lg:gap-4 max-md:hidden">
        {siteConfig.nav.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition-colors hover:text-yellow-800">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="max-md:flex-shrink-0">
        <WaitlistButton />
      </div>
    </nav>
  )
}

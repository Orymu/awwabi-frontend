'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import { SectionDivider } from '@/components/site/section-divider'
import { features, featuresIntro } from '@/app/home-content'

const CHIPS = [
  { icon: '/assets/icon-scroll-sm.svg', variant: 'rose', delay: '0.5s' },
  { icon: '/assets/icon-sidebar-sm.svg', variant: 'orange', delay: '0.7s' },
  { icon: '/assets/icon-userlist-sm.svg', variant: 'green', delay: '0.9s' },
] as const

const chipBg: Record<string, string> = {
  rose: 'var(--chip-rose)',
  orange: 'var(--chip-orange)',
  green: 'var(--chip-green)',
}

function Chip({
  icon,
  variant,
  delay,
  inView,
}: {
  icon: string
  variant: string
  delay: string
  inView: boolean
}) {
  return (
    <span
      className={cn(
        'chip-reveal mx-1 inline-flex size-12 items-center justify-center rounded-[10px] align-middle max-md:size-[38px]',
        variant !== 'green' && 'shadow-[inset_0_0_8px_1px_rgba(180,83,9,0.5)]',
        inView && 'chip-reveal--in'
      )}
      style={{ background: chipBg[variant], '--chip-delay': delay } as React.CSSProperties}
    >
      <Image src={icon} alt="" aria-hidden="true" width={24} height={24} className="size-6 max-md:size-5" />
    </span>
  )
}

export function About() {
  const [headlineRef, headlineInView] = useInView<HTMLParagraphElement>({
    threshold: 0.3,
  })
  const [featuresRef, featuresInView] = useInView<HTMLDivElement>({
    threshold: 0.15,
  })

  return (
    <section
      id="cara-kerja"
      className="flex flex-col items-center gap-25 bg-white px-20 py-25 max-md:gap-16 max-md:px-6 max-md:py-16"
    >
      {/* Mission statement */}
      <div className="flex w-full max-w-[1224px] flex-col items-center gap-12">
        <SectionDivider />
        <p
          ref={headlineRef}
          className={cn(
            'reveal-text text-center font-serif text-[56px] font-normal leading-[64px] max-md:text-[36px] max-md:leading-[44px]',
            headlineInView && 'reveal-text--in'
          )}
        >
          Awwabi hadir sebagai habit companion yang membantu{' '}
          <span className="inline">
            mencatat
            <Chip {...CHIPS[0]} inView={headlineInView} />,{' '}
            memantau
            <Chip {...CHIPS[1]} inView={headlineInView} />,{' '}
            dan menjaga niat
            <Chip {...CHIPS[2]} inView={headlineInView} />
          </span>{' '}
          secara sederhana dan visual, agar perjalanan istiqomah terasa lebih
          ringan dan konsisten.
        </p>
      </div>

      {/* Features */}
      <div
        ref={featuresRef}
        id="features"
        className="flex w-full max-w-[1280px] flex-col items-center gap-14"
      >
        <div className="flex w-full flex-col items-center gap-8">
          <SectionDivider />
          <div className="flex w-[min(714px,100%)] flex-col items-center gap-3 text-center">
            <h2
              className={cn(
                'feature-reveal m-0 font-serif text-[56px] font-normal leading-[64px] tracking-[-0.5px] text-[var(--color-ink)] max-md:text-[36px] max-md:leading-[44px]',
                featuresInView && 'feature-reveal--in'
              )}
            >
              {featuresIntro.title[0]}
              <br />
              {featuresIntro.title[1]}
            </h2>
            <p
              className={cn(
                'feature-reveal font-body text-2xl font-normal leading-8 text-muted max-md:text-lg max-md:leading-7',
                featuresInView && 'feature-reveal--in'
              )}
              style={{ '--feature-delay': '0.12s' } as React.CSSProperties}
            >
              {featuresIntro.subtitle}
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className={cn(
                'feature-reveal flex flex-col gap-12 overflow-hidden rounded-lg border border-[var(--color-border-hover)] bg-subtile p-6 transition-[transform,box-shadow,opacity] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(24,24,27,0.08)]',
                featuresInView && 'feature-reveal--in'
              )}
              style={
                { '--feature-delay': `${0.25 + i * 0.12}s` } as React.CSSProperties
              }
            >
              <Image
                src={feature.icon}
                alt=""
                aria-hidden="true"
                width={38}
                height={38}
                className="size-[38px]"
              />
              <div className="flex flex-col gap-2 text-left">
                <h3 className="m-0 font-serif text-[28px] font-normal leading-9 text-[var(--color-ink)]">
                  {feature.title}
                </h3>
                <p className="font-body text-base font-normal leading-6 text-muted">
                  {feature.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

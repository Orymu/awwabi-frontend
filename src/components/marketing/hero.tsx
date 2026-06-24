import Image from 'next/image'
import { hero } from '@/app/home-content'

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-subtile"
    >
      {/* Desktop Layout */}
      <div className="max-md:hidden relative aspect-[1440/926] [container-type:inline-size]">
        <Image
          src="/assets/hero-bg.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover"
        />

        {/* Phone mockup - Single device image */}
        <div className="hero-anim--device absolute left-1/2 bottom-0 w-[38cqw] -translate-x-1/2">
          <Image
            src="/assets/hero-device.png"
            alt="Tampilan aplikasi Awwabi di ponsel"
            width={1080}
            height={1080}
            priority
            className="w-full h-auto drop-shadow-[0_0_60px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Desktop Text Content - Bottom fade + headline */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--fade-bottom)' }}
        >
          <div className="pointer-events-auto absolute left-1/2 top-[12.222cqw] flex w-[56.6cqw] -translate-x-1/2 flex-col items-center gap-[0.833cqw] text-center">
            <h1 className="hero-anim--title m-0 font-serif text-[4.444cqw] font-normal leading-[5cqw] text-yellow-800">
              {hero.title}
            </h1>
            <p className="hero-anim--subtitle w-[52.7cqw] font-body text-[1.389cqw] font-normal leading-[1.944cqw] text-[var(--color-ink-hover)]">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative flex min-h-screen flex-col overflow-hidden">
        {/* Background image */}
        <Image
          src="/assets/hero-bg.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover"
        />

        {/* Text Content */}
        <div className="relative z-10 px-6 pt-[19%] text-center">
          <h1 className="hero-anim--title mx-auto w-[84%] max-w-[439px] font-serif text-[clamp(34px,9vw,48px)] font-normal leading-[1.16] tracking-[-0.5px] text-yellow-800">
            {hero.title}
          </h1>
          <p className="hero-anim--subtitle mx-auto mt-3 w-[84%] max-w-[439px] font-body text-[clamp(14px,3.6vw,18px)] font-normal leading-[1.36] text-[var(--color-ink-hover)]">
            {hero.subtitle}
          </p>
        </div>

        {/* Phone mockup - Single device image */}
        <div className="relative z-10 mt-auto flex justify-center">
          <div className="hero-anim--device relative w-[85%] max-w-[460px] translate-y-[6%]">
            <Image
              src="/assets/hero-device.png"
              alt="Tampilan aplikasi Awwabi di ponsel"
              width={1080}
              height={1080}
              className="w-full h-auto drop-shadow-[0_0_40px_rgba(0,0,0,0.2)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { hero } from '@/app/home-content'

export function Hero() {
  return (
    <section id="home" className="relative w-full overflow-hidden bg-subtile">
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

        {/* Phone mockup - Desktop positioning */}
        <div className="hero-anim--device absolute left-1/2 top-[30.903cqw] h-[61.875cqw] w-[30.208cqw] -translate-x-1/2">
          <div className="absolute inset-x-[1%] inset-y-0 rounded-[3.47cqw] bg-black opacity-[0.38] shadow-[0_0_4.7cqw_0_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-[1.94%_4.44%_1.94%_4.67%] overflow-hidden rounded-[1.04cqw]">
            <Image
              src="/assets/phone-screenshot.png"
              alt="Tampilan aplikasi Awwabi di ponsel"
              width={1236}
              height={2751}
              className="h-[102.83%] w-full object-cover"
            />
          </div>
          <Image
            src="/assets/iphone-frame.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="40vw"
            className="pointer-events-none object-cover"
          />
          <div className="absolute left-[14.097cqw] top-[2.569cqw] flex h-[2.292cqw] w-[7.569cqw] items-center justify-end rounded-[3.47cqw] bg-black pr-[0.55cqw]">
            <Image
              src="/assets/lens.svg"
              alt=""
              aria-hidden="true"
              width={14}
              height={14}
              className="h-[0.97cqw] w-[0.97cqw]"
            />
          </div>
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

      {/* Mobile Layout - Matches Figma frame 5091:60 (522×1102) proportions */}
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

        {/* Text Content - Figma: top 185/1102 ≈ 17%, width 439/522 ≈ 84% */}
        <div className="relative z-10 px-6 pt-[19%] text-center">
          <h1 className="hero-anim--title mx-auto w-[84%] max-w-[439px] font-serif text-[clamp(34px,9vw,48px)] font-normal leading-[1.16] tracking-[-0.5px] text-yellow-800">
            {hero.title}
          </h1>
          <p className="hero-anim--subtitle mx-auto mt-3 w-[84%] max-w-[439px] font-body text-[clamp(14px,3.6vw,18px)] font-normal leading-[1.36] text-[var(--color-ink-hover)]">
            {hero.subtitle}
          </p>
        </div>

        {/* Phone mockup - Figma: width 435/522 ≈ 83%, anchored bottom */}
        <div className="relative z-10 mt-auto flex justify-center">
          <div className="hero-anim--device relative w-[83%] max-w-[435px] aspect-[435/891] translate-y-[6%]">
            <div className="absolute inset-x-[1%] inset-y-0 rounded-[10%] bg-black opacity-[0.30] shadow-[0_0_50px_0_rgba(0,0,0,0.6)]" />
            <div className="absolute inset-[1.94%_4.44%_1.94%_4.67%] overflow-hidden rounded-[3.4%]">
              <Image
                src="/assets/phone-screenshot.png"
                alt="Tampilan aplikasi Awwabi di ponsel"
                width={1236}
                height={2751}
                className="absolute -left-[0.26%] -top-[0.06%] h-[102.83%] w-full object-cover"
              />
            </div>
            <Image
              src="/assets/iphone-frame.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="83vw"
              className="pointer-events-none object-cover"
            />
            {/* Dynamic Island */}
            <div className="absolute left-[46.7%] top-[4.1%] flex h-[3.7%] w-[25%] items-center justify-end rounded-[50px] bg-black pr-[6%]">
              <div className="relative h-[40%] w-[12%]">
                <Image
                  src="/assets/lens.svg"
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

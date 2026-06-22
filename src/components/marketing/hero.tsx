import Image from 'next/image'
import { hero } from '@/app/home-content'

export function Hero() {
  return (
    <section
      id="home"
      className="relative aspect-[1440/926] w-full overflow-hidden bg-subtile [container-type:inline-size] max-md:flex max-md:min-h-[100svh] max-md:flex-col max-md:justify-start max-md:aspect-auto max-md:pt-24"
    >
      <Image
        src="/assets/hero-bg.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover"
      />

      {/* Mobile Text Content - Above Phone */}
      <div className="hidden max-md:flex max-md:flex-col max-md:items-center max-md:px-6 max-md:pt-6 max-md:pb-8 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center max-w-[380px]">
          <h1 className="hero-anim--title m-0 font-serif text-[30px] font-normal leading-[38px] text-yellow-800 max-sm:text-[26px] max-sm:leading-[34px]">
            {hero.title}
          </h1>
          <p className="hero-anim--subtitle font-body text-[14px] font-normal leading-[20px] text-[var(--color-ink-hover)] max-sm:text-[13px] max-sm:leading-[19px]">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* Phone mockup - Desktop positioning, Mobile centered */}
      <div className="hero-anim--device absolute left-1/2 top-[30.903cqw] h-[61.875cqw] w-[30.208cqw] -translate-x-1/2 max-md:relative max-md:left-auto max-md:top-auto max-md:h-auto max-md:w-[min(65%,280px)] max-md:translate-x-0 max-md:aspect-[435/891] max-md:mx-auto max-md:flex-1 max-md:flex max-md:items-start max-md:justify-center max-sm:w-[min(70%,300px)]">
        <div className="absolute inset-x-[1%] inset-y-0 rounded-[3.47cqw] bg-black opacity-[0.38] shadow-[0_0_4.7cqw_0_rgba(0,0,0,0.8)] max-md:rounded-[32px] max-md:shadow-[0_0_40px_0_rgba(0,0,0,0.7)]" />
        <div className="absolute inset-[1.94%_4.44%_1.94%_4.67%] overflow-hidden rounded-[1.04cqw] max-md:rounded-[12px]">
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
          sizes="(max-width: 768px) 70vw, 40vw"
          className="pointer-events-none object-cover"
        />
        <div className="absolute left-[14.097cqw] top-[2.569cqw] flex h-[2.292cqw] w-[7.569cqw] items-center justify-end rounded-[3.47cqw] bg-black pr-[0.55cqw] max-md:left-[47%] max-md:top-[14px] max-md:h-6 max-md:w-20 max-md:rounded-[50px]">
          <Image
            src="/assets/lens.svg"
            alt=""
            aria-hidden="true"
            width={14}
            height={14}
            className="h-[0.97cqw] w-[0.97cqw] max-md:h-2 max-md:w-2"
          />
        </div>
      </div>

      {/* Desktop Text Content - Bottom fade + headline */}
      <div
        className="pointer-events-none absolute inset-0 max-md:hidden"
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

      {/* Mobile bottom spacer */}
      <div className="hidden max-md:block max-md:pb-12" />
    </section>
  )
}

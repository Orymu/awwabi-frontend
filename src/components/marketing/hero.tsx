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
      <div className="md:hidden relative flex flex-col overflow-hidden" style={{ minHeight: '100svh' }}>
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
        <div className="relative z-10 px-5 pt-[22%] text-center">
          <h1 className="hero-anim--title mx-auto font-serif text-[clamp(38px,11vw,56px)] font-normal leading-[1.12] tracking-[-0.5px] text-yellow-800">
            {hero.title}
          </h1>
          <p className="hero-anim--subtitle mx-auto mt-4 w-[92%] font-body text-[clamp(14px,3.8vw,18px)] font-normal leading-[1.45] text-[var(--color-ink-hover)]">
            {hero.subtitle}
          </p>
        </div>

        {/* Phone mockup - Layered frame + screenshot for mobile */}
        <div className="relative z-10 mt-auto flex justify-center">
          <div className="hero-anim--device relative w-[95%] max-w-[500px] aspect-[435/891] -translate-x-[2%] translate-y-[4%]">
            {/* Shadow behind phone */}
            <div className="absolute inset-x-[1%] inset-y-0 rounded-[10%] bg-black opacity-[0.25] shadow-[0_0_50px_0_rgba(0,0,0,0.5)]" />
            {/* Screenshot inside */}
            <div className="absolute inset-[1.94%_4.44%_1.94%_4.67%] overflow-hidden rounded-[3.4%]">
              <Image
                src="/assets/phone-screenshot.png"
                alt="Tampilan aplikasi Awwabi di ponsel"
                width={1236}
                height={2751}
                className="absolute -left-[0.26%] -top-[0.06%] h-[102.83%] w-full object-cover"
              />
            </div>
            {/* Phone frame */}
            <Image
              src="/assets/iphone-frame.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="95vw"
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

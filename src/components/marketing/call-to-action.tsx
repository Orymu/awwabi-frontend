'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import { TextInput } from '@/components/ui/text-input'
import { WaitlistButton } from '@/components/ui/waitlist-button'
import { siteConfig } from '@/config/site'
import { cta, footer } from '@/app/home-content'

export function CallToAction() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [footerRef, footerInView] = useInView<HTMLElement>({ threshold: 0.25 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: wire up to the real waiting-list API endpoint.
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="relative flex min-h-[934px] flex-col items-center gap-8 overflow-hidden bg-white px-20 pt-20 max-md:min-h-auto max-md:px-4 max-md:pt-12 max-sm:px-3"
    >
      <Image
        src="/assets/cta-bg.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-top"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #fafafa 0%, rgba(250,250,250,0) 10%)',
        }}
      />

      <div className="relative z-1 flex w-full max-w-[1280px] flex-col items-center gap-8 max-md:gap-6">
        <div className="flex flex-col items-center gap-3 pt-[60px] text-center max-md:pt-8 max-md:px-2">
          <h2 className="m-0 font-serif text-[56px] font-normal leading-[64px] tracking-[-0.5px] text-[var(--color-ink)] max-md:text-[32px] max-md:leading-[40px] max-sm:text-[28px] max-sm:leading-[36px]">
            {cta.title}
          </h2>
          <p className="font-body text-2xl font-normal leading-8 text-muted max-md:text-lg max-md:leading-6 max-sm:text-base max-sm:leading-6">
            {cta.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-[min(512px,100%)] flex-col gap-8 rounded-lg border border-[var(--color-border-hover)] bg-white p-8 max-md:gap-6 max-md:p-6 max-sm:p-4"
        >
          {submitted ? (
            <p role="status" className="text-center font-body text-lg leading-7 text-yellow-800 max-md:text-base max-md:leading-6">
              {cta.successMessage}
            </p>
          ) : (
            <>
              <TextInput
                label="Nama"
                name="name"
                icon="/assets/icon-user.svg"
                placeholder="Nama lengkap"
                value={form.name}
                onChange={handleChange}
                required
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                icon="/assets/icon-envelope.svg"
                placeholder="nama@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <WaitlistButton type="submit" fullWidth />
            </>
          )}
        </form>

        <footer
          ref={footerRef}
          className={cn(
            'mt-auto flex min-h-[209px] w-full items-start gap-8 pb-8 max-md:min-h-0 max-md:flex-col max-md:gap-4 max-md:pb-6',
            footerInView && 'footer-reveal--in'
          )}
        >
          <div
            className="footer-col-anim flex h-full flex-1 flex-col justify-end gap-2 max-md:gap-1"
            style={{ '--footer-delay': '0s' } as React.CSSProperties}
          >
            <p className="font-brand text-[28px] font-semibold leading-9 whitespace-nowrap text-yellow-800 max-md:text-[24px] max-md:leading-8 max-sm:text-[20px] max-sm:leading-7">
              {siteConfig.name}
            </p>
            <p className="font-body text-base font-normal leading-6 text-yellow-700 max-md:text-sm max-md:leading-5 max-sm:text-xs max-sm:leading-4">
              {footer.tagline}
            </p>
          </div>
          <div
            className="footer-col-anim flex h-full flex-1 flex-col items-end justify-end gap-2 text-right max-md:items-start max-md:text-left max-md:gap-1"
            style={{ '--footer-delay': '0.15s' } as React.CSSProperties}
          >
            <p className="w-full font-serif text-[28px] font-normal leading-9 text-yellow-800 max-md:text-[24px] max-md:leading-8 max-sm:text-[20px] max-sm:leading-7">
              {footer.contactTitle}
            </p>
            <p className="w-full font-body text-base font-normal leading-6 text-yellow-700 max-md:text-sm max-md:leading-5 max-sm:text-xs max-sm:leading-4">
              {siteConfig.contacts.join(' • ')}
            </p>
          </div>
        </footer>
      </div>
    </section>
  )
}

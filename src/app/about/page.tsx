import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Tentang — ${siteConfig.name}`,
  description: `Tentang ${siteConfig.product}, ${siteConfig.description}`,
}

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-24">
      <h1 className="font-serif text-5xl font-normal text-yellow-800">
        Tentang {siteConfig.product}
      </h1>
      <p className="font-body text-lg leading-8 text-muted">
        {siteConfig.description}
      </p>
      <p className="font-body text-base leading-7 text-[var(--color-ink-hover)]">
        Awwabi hadir sebagai habit companion yang membantu mencatat, memantau,
        dan menjaga niat secara sederhana dan visual, agar perjalanan istiqomah
        terasa lebih ringan dan konsisten.
      </p>
      <Link href="/" className="font-ui text-sm font-medium text-yellow-800 hover:underline">
        ← Kembali ke beranda
      </Link>
    </main>
  )
}

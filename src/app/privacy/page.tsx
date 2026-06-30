import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Kebijakan Privasi — ${siteConfig.name}`,
  description: `Kebijakan privasi ${siteConfig.product}.`,
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-24">
      <h1 className="font-serif text-5xl font-normal text-yellow-800">
        Kebijakan Privasi
      </h1>
      <p className="font-body text-base leading-7 text-muted">
        {siteConfig.name} menghormati privasimu. Data yang kamu daftarkan pada
        waiting list hanya digunakan untuk mengabarkan peluncuran{' '}
        {siteConfig.product} dan tidak dibagikan kepada pihak ketiga.
      </p>
      <Link
        href="/"
        className="font-ui text-sm font-medium text-yellow-800 hover:underline"
      >
        ← Kembali ke beranda
      </Link>
    </main>
  )
}

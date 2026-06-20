export const siteConfig = {
  name: 'Awwabi',
  product: 'Awwabi',
  description:
    'Habit tracker pertama yang dirancang khusus untuk muslimah melacak ibadah, produktivitas, dan pertumbuhan dirimu setiap hari.',
  url: 'https://awwabi.app',
  nav: [
    { label: 'Features', href: '#features' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Contact', href: '#contact' },
  ],
  contacts: ['Instagram', 'Gmail', 'WhatsApp'],
} as const

export type SiteConfig = typeof siteConfig

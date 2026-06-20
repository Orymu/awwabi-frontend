/**
 * Static content for the Niyyah landing page (home route).
 */

export const hero = {
  title: 'Mulai Harimu dengan Niyyah yang Penuh Makna',
  subtitle:
    'Habit tracker pertama yang dirancang khusus untuk muslimah melacak ibadah, produktivitas, dan pertumbuhan dirimu setiap hari.',
} as const

export const features = [
  {
    icon: '/assets/feat-scroll.svg',
    title: 'Ibadah Tracker',
    desc: 'Lacak ibadah dalam satu tampilan yang indah dan terorganisir.',
  },
  {
    icon: '/assets/feat-fire.svg',
    title: 'Streak System',
    desc: 'Visual Streak harian yang memotifasi untuk tidak putus asa',
  },
  {
    icon: '/assets/feat-chartbar.svg',
    title: 'Progress Analytics',
    desc: 'Grafik mingguan & bulanan untuk melihat perjalanan tumbuhmu',
  },
  {
    icon: '/assets/feat-crosshair.svg',
    title: 'Goal Setting',
    desc: 'Tentukan targetmu, bagi jadi langkah-langkah kecil',
  },
] as const

export const featuresIntro = {
  title: ['Dirancang untuk Perjalanan', 'Spiritualmu'],
  subtitle:
    'Setiap fitur dibuat dengan penuh pertimbangan, agar kamu bisa fokus tumbuh tanpa ribet.',
} as const

export const cta = {
  title: 'Jadilah yang Pertama Merasakan Niyyah',
  subtitle: 'Daftarkan emailmu sekarang dan dapatkan:',
  successMessage: 'Terima kasih! Kamu sudah masuk waiting list Niyyah.',
} as const

export const footer = {
  tagline: 'Tumbuh bersama, hari per hari. | © 2026 Niyyah.',
  contactTitle: 'Contact Us',
} as const

export type Feature = (typeof features)[number]

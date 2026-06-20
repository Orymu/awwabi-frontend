import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/marketing/hero'
import { About } from '@/components/marketing/about'
import { CallToAction } from '@/components/marketing/call-to-action'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <CallToAction />
      </main>
    </>
  )
}

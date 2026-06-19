import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import CallToAction from './sections/CallToAction'

export default function App() {
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

import heroBg from '../assets/hero-bg.png'
import iphoneFrame from '../assets/iphone-frame.png'
import phoneScreenshot from '../assets/phone-screenshot.png'
import lens from '../assets/lens.svg'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <img className="hero__bg" src={heroBg} alt="" aria-hidden="true" />

      {/* Phone mockup */}
      <div className="hero__device">
        <div className="hero__device-shadow" aria-hidden="true" />
        <div className="hero__device-screen">
          <img src={phoneScreenshot} alt="Tampilan aplikasi Niyyah di ponsel" />
        </div>
        <img className="hero__device-frame" src={iphoneFrame} alt="" aria-hidden="true" />
        <div className="hero__device-island" aria-hidden="true">
          <img src={lens} alt="" />
        </div>
      </div>

      {/* Bottom fade + headline */}
      <div className="hero__fade">
        <div className="hero__intro">
          <h1 className="hero__title">
            Mulai Harimu dengan Niyyah yang Penuh Makna
          </h1>
          <p className="hero__subtitle">
            Habit tracker pertama yang dirancang khusus untuk muslimah melacak
            ibadah, produktivitas, dan pertumbuhan dirimu setiap hari.
          </p>
        </div>
      </div>
    </section>
  )
}

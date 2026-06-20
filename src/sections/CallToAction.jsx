import { useState } from 'react'
import ctaBg from '../assets/cta-bg.png'
import iconUser from '../assets/icon-user.svg'
import iconEnvelope from '../assets/icon-envelope.svg'
import TextInput from '../components/TextInput'
import WaitlistButton from '../components/WaitlistButton'
import useInView from '../hooks/useInView'
import './CallToAction.css'

export default function CallToAction() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [footerRef, footerInView] = useInView({ threshold: 0.25 })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire up to the real waiting-list API endpoint.
    setSubmitted(true)
  }

  return (
    <section className="cta" id="contact">
      <img className="cta__bg" src={ctaBg} alt="" aria-hidden="true" />
      <div className="cta__overlay" aria-hidden="true" />

      <div className="cta__content">
        <div className="cta__intro">
          <h2 className="cta__title">Jadilah yang Pertama Merasakan Niyyah</h2>
          <p className="cta__sub">Daftarkan emailmu sekarang dan dapatkan:</p>
        </div>

        <form className="cta__card" onSubmit={handleSubmit}>
          {submitted ? (
            <p className="cta__success" role="status">
              Terima kasih! Kamu sudah masuk waiting list Niyyah.
            </p>
          ) : (
            <>
              <TextInput
                label="Nama"
                name="name"
                icon={iconUser}
                placeholder="Nama lengkap"
                value={form.name}
                onChange={handleChange}
                required
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                icon={iconEnvelope}
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
          className={`cta__footer footer-reveal${
            footerInView ? ' footer-reveal--in' : ''
          }`}
        >
          <div
            className="cta__footer-col footer-col-anim"
            style={{ '--footer-delay': '0s' }}
          >
            <p className="cta__footer-brand">Awwabi</p>
            <p className="cta__footer-text">
              Tumbuh bersama, hari per hari. | © 2026 Niyyah.
            </p>
          </div>
          <div
            className="cta__footer-col cta__footer-col--right footer-col-anim"
            style={{ '--footer-delay': '0.15s' }}
          >
            <p className="cta__footer-title">Contact Us</p>
            <p className="cta__footer-text">Instagram • Gmail • WhatsApp</p>
          </div>
        </footer>
      </div>
    </section>
  )
}

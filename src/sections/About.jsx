import divider from '../assets/divider.svg'
import iconScrollSm from '../assets/icon-scroll-sm.svg'
import iconSidebarSm from '../assets/icon-sidebar-sm.svg'
import iconUserlistSm from '../assets/icon-userlist-sm.svg'
import featScroll from '../assets/feat-scroll.svg'
import featFire from '../assets/feat-fire.svg'
import featChartbar from '../assets/feat-chartbar.svg'
import featCrosshair from '../assets/feat-crosshair.svg'
import useInView from '../hooks/useInView'
import './About.css'

const FEATURES = [
  {
    icon: featScroll,
    title: 'Ibadah Tracker',
    desc: 'Lacak ibadah dalam satu tampilan yang indah dan terorganisir.',
  },
  {
    icon: featFire,
    title: 'Streak System',
    desc: 'Visual Streak harian yang memotifasi untuk tidak putus asa',
  },
  {
    icon: featChartbar,
    title: 'Progress Analytics',
    desc: 'Grafik mingguan & bulanan untuk melihat perjalanan tumbuhmu',
  },
  {
    icon: featCrosshair,
    title: 'Goal Setting',
    desc: 'Tentukan targetmu, bagi jadi langkah-langkah kecil',
  },
]

function SectionDivider() {
  return <img className="about__divider" src={divider} alt="" aria-hidden="true" />
}

export default function About() {
  const [headlineRef, headlineInView] = useInView({ threshold: 0.3 })

  return (
    <section className="about" id="cara-kerja">
      {/* Mission statement with inline icon chips */}
      <div className="about__statement">
        <SectionDivider />
        <p
          ref={headlineRef}
          className={`about__headline reveal-text${
            headlineInView ? ' reveal-text--in' : ''
          }`}
        >
          Niyyah hadir sebagai habit companion yang membantu{' '}
          <span className="about__inline">
            mencatat
            <span className="about__chip about__chip--rose">
              <img src={iconScrollSm} alt="" aria-hidden="true" />
            </span>
            ,{' '}
            memantau
            <span className="about__chip about__chip--orange">
              <img src={iconSidebarSm} alt="" aria-hidden="true" />
            </span>
            ,{' '}
            dan menjaga niat
            <span className="about__chip about__chip--green">
              <img src={iconUserlistSm} alt="" aria-hidden="true" />
            </span>
          </span>{' '}
          secara sederhana dan visual, agar perjalanan istiqomah terasa lebih
          ringan dan konsisten.
        </p>
      </div>

      {/* Features */}
      <div className="about__features" id="features">
        <div className="about__features-head">
          <SectionDivider />
          <div className="about__intro">
            <h2 className="about__intro-title">
              Dirancang untuk Perjalanan
              <br />
              Spiritualmu
            </h2>
            <p className="about__intro-sub">
              Setiap fitur dibuat dengan penuh pertimbangan, agar kamu bisa
              fokus tumbuh tanpa ribet.
            </p>
          </div>
        </div>

        <div className="about__grid">
          {FEATURES.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <img className="feature-card__icon" src={feature.icon} alt="" aria-hidden="true" />
              <div className="feature-card__text">
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

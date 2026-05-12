import { useRef, useState, useEffect } from 'react'
import { GitHubIcon, LinkedInIcon } from './icons'
import Ripple     from './Ripple'
import Experience from './pages/Experience'
import Projects   from './pages/Projects'
import Contact    from './pages/Contact'

const NAV_LABELS = [
  { key: 'home',       label: 'Home'       },
  { key: 'projects',   label: 'Projects'   },
  { key: 'experience', label: 'Experience' },
  { key: 'contact',    label: 'Contact'    },
]

const GLASS = {
  margin: '0 16px 16px',
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(3px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(3px) saturate(1.2)',
  border: '1px solid rgba(255,255,255,0.65)',
  borderTop: '1px solid rgba(255,255,255,0.9)',
  borderRadius: '16px',
  boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 20px 48px rgba(0,0,0,0.06)',
  overflow: 'hidden',
}

const SHADOW = '0 0 24px #F0EBD6, 0 0 12px #F0EBD6'

// ── Mobile Home section ────────────────────────────────────────────────────
function MobileHome() {
  return (
    <div style={{ padding: 'clamp(32px, 6vw, 48px) clamp(16px, 4vw, 24px) clamp(24px, 4vw, 32px)' }}>
      {/* Name, title, social links */}
      <div
        className="text-center page-item"
        style={{ animationDelay: '0ms', marginBottom: '32px' }}
      >
        <h1
          className="font-ui font-semibold tracking-tight text-black"
          style={{ fontSize: 'clamp(1.8rem, 7.5vw, 3rem)', lineHeight: 1.1 }}
        >
          Brandon Hsu
        </h1>
        <p
          className="font-details tracking-widest text-black/65 uppercase mt-2"
          style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.95rem)' }}
        >
          Software Engineer
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <a
            href="https://github.com/branboyo"
            target="_blank"
            rel="noreferrer"
            className="text-black/60 hover:text-black inline-block"
            style={{ transition: 'color 150ms ease' }}
          >
            <GitHubIcon size={26} />
          </a>
          <a
            href="https://www.linkedin.com/in/bdehsu/"
            target="_blank"
            rel="noreferrer"
            className="text-black/60 hover:text-black inline-block"
            style={{ transition: 'color 150ms ease' }}
          >
            <LinkedInIcon size={26} />
          </a>
        </div>
      </div>

      {/* Bio glass card */}
      <div
        className="page-item"
        style={{
          animationDelay: '80ms',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(3px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(3px) saturate(1.2)',
          border: '1px solid rgba(255,255,255,0.65)',
          borderTop: '1px solid rgba(255,255,255,0.9)',
          borderRadius: '16px',
          boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 20px 48px rgba(0,0,0,0.06)',
          padding: '28px 24px',
        }}
      >
        <h2
          className="font-bio text-black"
          style={{ fontSize: 'clamp(1.6rem, 5.5vw, 2.2rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '1rem', textShadow: SHADOW }}
        >
          Howdy!
        </h2>
        <p
          className="font-bio text-black"
          style={{ fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)', lineHeight: 1.7, marginBottom: '1rem', textShadow: SHADOW }}
        >
          I'm a software engineer with an expertise in automating business operations.
          I enjoy developing workflows that save time and provide enhanced quality of life.
          My qualities shine when I work closely with the users, as cross collaboration
          is key to low friction adaptations.
        </p>
        <p
          className="font-bio text-black/75"
          style={{ fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)', lineHeight: 1.7, marginBottom: '1rem', textShadow: SHADOW }}
        >
          Currently, I'm studying emerging technologies in AI such as state propagations
          in multi-agent pipelines, as well as applying existing techniques in
          AI-assisted coding workflows.
        </p>
        <p
          className="font-bio text-black/55"
          style={{ fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)', lineHeight: 1.7, textShadow: SHADOW }}
        >
          In my spare time, you can find me weightlifting, developing SaaS products,
          or in the studio producing music.
        </p>
      </div>
    </div>
  )
}

// ── Mobile App ─────────────────────────────────────────────────────────────
export default function MobileApp() {
  const [activeSection, setActiveSection] = useState('home')

  const bgRef         = useRef(null) // no Orb panning on mobile; Ripple reads this
  const homeRef       = useRef(null)
  const projectsRef   = useRef(null)
  const experienceRef = useRef(null)
  const contactRef    = useRef(null)

  useEffect(() => {
    function onScroll() {
      const midY = window.innerHeight * 0.45
      const candidates = [
        { key: 'home',       el: homeRef.current       },
        { key: 'projects',   el: projectsRef.current   },
        { key: 'experience', el: experienceRef.current },
        { key: 'contact',    el: contactRef.current    },
      ]
      let best = 'home', bestDelta = Infinity
      for (const { key, el } of candidates) {
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= midY) {
          const d = midY - top
          if (d < bestDelta) { bestDelta = d; best = key }
        }
      }
      setActiveSection(best)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // set initial active section
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(key) {
    const map = {
      home: homeRef, projects: projectsRef,
      experience: experienceRef, contact: contactRef,
    }
    map[key]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: '#F0EBD6', minHeight: '100vh' }}>
      {/* Grid + waves — canvas is zIndex 2 */}
      <Ripple bgRef={bgRef} />

      {/* Scrollable content — zIndex 3 sits above the canvas */}
      <div style={{ position: 'relative', zIndex: 3, paddingBottom: '90px' }}>
        {/* Centered column — caps width on tablets so content doesn't sprawl */}
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div ref={homeRef}>
            <MobileHome />
          </div>

          <div ref={projectsRef} style={GLASS}>
            <Projects />
          </div>

          <div ref={experienceRef} style={GLASS}>
            <Experience />
          </div>

          <div ref={contactRef} style={GLASS}>
            <Contact />
          </div>
        </div>
      </div>

      {/* Fixed bottom tab bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '12px 0 16px',
          background: 'rgba(240,235,214,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {NAV_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => scrollTo(key)}
            className="font-details tracking-widest uppercase"
            style={{
              fontSize: '0.75rem',
              color: activeSection === key ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.35)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 10px',
              transition: 'color 150ms ease',
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

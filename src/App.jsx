import { useRef, useState, useCallback, useEffect } from 'react'

import Orb      from './Orb'
import Ripple   from './Ripple'
import MobileApp from './MobileApp'
import { GitHubIcon, LinkedInIcon } from './icons'
import Home       from './pages/Home'
import Projects   from './pages/Projects'
import Experience from './pages/Experience'
import Contact    from './pages/Contact'

// ── Mobile detection ───────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 1024)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

const PAGES = { home: Home, projects: Projects, experience: Experience, contact: Contact }

const NAV_LABELS = [
  { key: 'home',       label: 'Home'       },
  { key: 'projects',   label: 'Projects'   },
  { key: 'experience', label: 'Experience' },
  { key: 'contact',    label: 'Contact'    },
]

// ── Persistent quip ────────────────────────────────────────────────────────
const TAGLINES = [
  'What goes up...',
  'The world is your oyster.',
  'In a world full of signs, be the signal.',
  'Fortune favors the bold.',
  'Walls are there to prove you can climb over them.',
]

function pickNext(current) {
  const pool = TAGLINES.filter(t => t !== current)
  return pool[Math.floor(Math.random() * pool.length)]
}

function Quip({ navActive }) {
  const [tagline, setTagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)])
  const [phase, setPhase]     = useState('idle')
  const taglineRef = useRef(tagline)

  useEffect(() => {
    const FADE = 280
    const interval = setInterval(() => {
      setPhase('exit')
      setTimeout(() => {
        const next = pickNext(taglineRef.current)
        taglineRef.current = next
        setTagline(next)
        setPhase('enter')
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase('idle')))
      }, FADE)
    }, 10_000)
    return () => clearInterval(interval)
  }, [])

  const opacity    = navActive ? 0 : phase === 'idle' ? 1 : 0
  const translateY = phase === 'exit' ? '10px' : phase === 'enter' ? '-10px' : '0px'
  const transition = navActive
    ? 'opacity 0.25s ease'
    : phase === 'enter'
      ? 'none'
      : 'opacity 0.28s ease, transform 0.28s ease'

  return (
    <p
      className="fixed font-dialogue italic text-black/70"
      style={{
        zIndex: 6,
        pointerEvents: 'none',
        top: 'calc(50% + 30px)',
        left: '50%',
        whiteSpace: 'nowrap',
        fontSize: '1.2rem',
        opacity,
        transform: `translate(-50%, ${translateY})`,
        transition,
        textShadow: '0 0 18px #F0EBD6, 0 0 8px #F0EBD6',
      }}
    >
      {tagline}
    </p>
  )
}

// ── Desktop App ────────────────────────────────────────────────────────────
function DesktopApp() {
  const bgRef      = useRef(null)
  const contentRef = useRef(null)

  const [currentPage, setCurrentPage]       = useState('home')
  const [contentVisible, setContentVisible] = useState(true)
  const [navActive, setNavActive]           = useState(false)
  const [panelHeight, setPanelHeight]       = useState(0)

  // Measure the non-home page content each time the page changes
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const h = entries[0]?.borderBoxSize?.[0]?.blockSize
             ?? entries[0]?.contentRect?.height
             ?? 0
      setPanelHeight(h)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [currentPage])

  const handleNavigate = useCallback(() => {
    setContentVisible(false)
    setNavActive(true)
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    setNavActive(false)
    setTimeout(() => setContentVisible(true), 50)
  }, [])

  const handleQuickNav = useCallback((page) => {
    if (page === currentPage) return
    setContentVisible(false)
    setNavActive(true)
    setTimeout(() => {
      setCurrentPage(page)
      setNavActive(false)
      setTimeout(() => setContentVisible(true), 50)
    }, 130)
  }, [currentPage])

  const PageComponent = PAGES[currentPage]
  const isHome        = currentPage === 'home'
  const panelVisible  = contentVisible && !isHome
  const fadeDur       = contentVisible ? '0.22s' : '0.12s'

  return (
    <div
      ref={bgRef}
      className="w-screen h-screen"
      style={{ background: '#F0EBD6' }}
    >
      {/* ── Wave ripples + canvas grid ── */}
      <Ripple bgRef={bgRef} />

      {/* ── Vignette ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.18) 75%, rgba(0,0,0,0.38) 100%)',
        }}
      />

      {/* ── Glass panel — sized to measured content ── */}
      <div
        style={{
          position: 'fixed',
          zIndex: 4,
          top: '10vh',
          left: '48px',
          width: 'min(520px, 45vw)',
          height: panelHeight > 0 ? `${panelHeight}px` : 0,
          maxHeight: '80vh',
          background: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(3px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(3px) saturate(1.2)',
          border: '1px solid rgba(255, 255, 255, 0.65)',
          borderTop: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          boxShadow: [
            '0 1px 0 rgba(255,255,255,0.7) inset',
            '0 20px 48px rgba(0,0,0,0.06)',
          ].join(', '),
          pointerEvents: 'none',
          opacity: panelVisible ? 1 : 0,
          transition: `opacity ${fadeDur} ease`,
        }}
      />

      {/* ── Page content — fades in/out on navigation ── */}
      {isHome ? (
        /* Home uses full-screen fixed layout internally */
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: `opacity ${fadeDur} ease`,
            position: 'fixed',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <PageComponent />
        </div>
      ) : (
        /* Non-home pages: top-pinned column, measured for panel sizing */
        <div
          className="panel-scroll"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: `opacity ${fadeDur} ease`,
            position: 'fixed',
            top: '10vh',
            left: '48px',
            width: 'min(520px, 45vw)',
            maxHeight: '80vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: 5,
            pointerEvents: 'auto',
          }}
        >
          <div ref={contentRef}>
            <PageComponent />
          </div>
        </div>
      )}

      {/* Quip — always visible, fades during nav */}
      <Quip navActive={navActive} />

      {/* Right-side identity — name, title, icon links — persists on non-home pages */}
      {!isHome && (
        <div
          style={{
            position: 'fixed',
            top: '10vh',
            right: '3rem',
            zIndex: 6,
            textAlign: 'right',
            pointerEvents: 'none',
            opacity: contentVisible ? 1 : 0,
            transition: `opacity ${fadeDur} ease`,
          }}
        >
          <h2
            className="font-ui font-semibold tracking-tight text-black page-item"
            style={{ fontSize: 'clamp(2.4rem, 3.2vw, 3.84rem)', lineHeight: 1.1, animationDelay: '0ms', textShadow: '0 0 18px #F0EBD6, 0 0 8px #F0EBD6' }}
          >
            Brandon Hsu
          </h2>
          <p
            className="font-details tracking-widest text-black/65 uppercase mt-2 page-item"
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.44rem)', animationDelay: '50ms', textShadow: '0 0 18px #F0EBD6, 0 0 8px #F0EBD6' }}
          >
            Software Engineer
          </p>
          <div
            className="flex items-center justify-end gap-5 mt-4 page-item"
            style={{ pointerEvents: 'auto', animationDelay: '100ms' }}
          >
            <a
              href="https://github.com/branboyo"
              target="_blank"
              rel="noreferrer"
              className="text-black/55 hover:text-black hover:scale-110 hover:-translate-y-0.5 active:scale-95 inline-block"
              style={{ transition: 'color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1)' }}
            >
              <GitHubIcon size={32} />
            </a>
            <a
              href="https://www.linkedin.com/in/bdehsu/"
              target="_blank"
              rel="noreferrer"
              className="text-black/55 hover:text-black hover:scale-110 hover:-translate-y-0.5 active:scale-95 inline-block"
              style={{ transition: 'color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1)' }}
            >
              <LinkedInIcon size={32} />
            </a>
          </div>
        </div>
      )}

      {/* QuickNav — bottom right, all pages */}
      <nav
        className="flex items-center gap-6"
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '3rem',
          zIndex: 6,
          opacity: contentVisible ? 1 : 0,
          transition: `opacity ${fadeDur} ease`,
        }}
      >
        {NAV_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleQuickNav(key)}
            className="font-details tracking-widest uppercase hover:-translate-y-0.5 active:scale-95"
            style={{
              fontSize: '1.1rem',
              color: currentPage === key ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.35)',
              background: 'none',
              border: 'none',
              cursor: currentPage === key ? 'default' : 'pointer',
              padding: 0,
              textShadow: '0 0 18px #F0EBD6, 0 0 8px #F0EBD6',
              transition: 'color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <Orb
        bgRef={bgRef}
        onNavigate={handleNavigate}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  )
}

// ── Root — routes mobile vs desktop ───────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileApp /> : <DesktopApp />
}

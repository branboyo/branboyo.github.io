import { GitHubIcon, LinkedInIcon } from '../icons'

const SHADOW = '0 0 24px #F0EBD6, 0 0 16px #F0EBD6, 0 0 8px #F0EBD6'

export default function Home() {
  return (
    <>
      {/* ── Top-centre: name, title, icons ─────────────────────────────────── */}
      <div
        className="fixed"
        style={{ zIndex: 5, pointerEvents: 'none', top: '2.5rem', left: '50%', transform: 'translateX(-50%)' }}
      >
        <div
          className="page-item"
          style={{ animationDelay: '0ms', textAlign: 'center', whiteSpace: 'nowrap' }}
        >
          <h1
            className="font-ui font-semibold tracking-tight text-black"
            style={{ fontSize: 'clamp(3rem, 3.8vw, 4.65rem)', lineHeight: 1.1 }}
          >
            Brandon Hsu
          </h1>
          <p
            className="font-details tracking-widest text-black/65 uppercase mt-2"
            style={{ fontSize: 'clamp(1rem, 1.4vw, 1.62rem)' }}
          >
            Software Engineer
          </p>

          <div
            className="flex items-center justify-center gap-6 mt-6 page-item"
            style={{ pointerEvents: 'auto', animationDelay: '80ms' }}
          >
            <a
              href="https://github.com/branboyo"
              target="_blank"
              rel="noreferrer"
              className="text-black/60 hover:text-black hover:scale-110 hover:-translate-y-0.5 active:scale-95 inline-block"
              style={{ transition: 'color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1)' }}
            >
              <GitHubIcon size={30} />
            </a>
            <a
              href="https://www.linkedin.com/in/bdehsu/"
              target="_blank"
              rel="noreferrer"
              className="text-black/60 hover:text-black hover:scale-110 hover:-translate-y-0.5 active:scale-95 inline-block"
              style={{ transition: 'color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1)' }}
            >
              <LinkedInIcon size={30} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Left side, Y-centred: intro ────────────────────────────────────── */}
      <div
        className="fixed"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          left: 'max(48px, 8vw)',
          width: 'min(506px, 43vw)',
          zIndex: 5,
          pointerEvents: 'none',
          padding: '32px 36px',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(3px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(3px) saturate(1.2)',
          border: '1px solid rgba(255,255,255,0.65)',
          borderTop: '1px solid rgba(255,255,255,0.9)',
          borderRadius: '16px',
          boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 20px 48px rgba(0,0,0,0.06)',
        }}
      >
        <h2
          className="font-bio text-black page-item"
          style={{
            fontSize: 'clamp(2rem, 2.4vw, 2.8rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: '1rem',
            animationDelay: '80ms',
            textShadow: SHADOW,
          }}
        >
          Howdy!
        </h2>
        <p
          className="font-bio text-black page-item"
          style={{
            fontSize: 'clamp(1rem, 1.1vw, 1.25rem)',
            lineHeight: '1.75',
            marginBottom: '1.1rem',
            animationDelay: '120ms',
            textShadow: SHADOW,
          }}
        >
          I'm a software engineer with an expertise in automating business operations.
          I enjoy developing workflows that save time and provide enhanced quality of life.
          My qualities shine where I work closely with the users as cross collaboration
          is key to low friction adaptations.
        </p>
        <p
          className="font-bio text-black/75 page-item"
          style={{
            fontSize: 'clamp(1rem, 1.1vw, 1.25rem)',
            lineHeight: '1.75',
            marginBottom: '1.1rem',
            animationDelay: '190ms',
            textShadow: SHADOW,
          }}
        >
          Currently, I'm studying emerging technologies in AI such as state propagations
          in multi-agent pipelines, as well as applying existing techniques in
          AI-assisted coding workflows.
        </p>
        <p
          className="font-bio text-black/55 page-item"
          style={{
            fontSize: 'clamp(1rem, 1.1vw, 1.25rem)',
            lineHeight: '1.75',
            animationDelay: '260ms',
            textShadow: SHADOW,
          }}
        >
          In my spare time, you can find me weightlifting, developing SaaS products,
          or in the studio producing music.
        </p>
      </div>
    </>
  )
}

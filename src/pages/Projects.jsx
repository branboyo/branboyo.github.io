const EASE_OUT = 'cubic-bezier(0.23,1,0.32,1)'

function Badge({ label }) {
  return (
    <span className="font-details text-xs tracking-wide text-black/55 bg-black/[.06] rounded-full px-2.5 py-0.5">
      {label}
    </span>
  )
}

const PROJECTS = [
  {
    name: 'Sampler',
    type: 'Chrome Extension',
    desc: 'Real-time audio recorder built on Web Audio API and rubberband-wasm, with offscreen document logic for background processing and DAW-compatible exports.',
    stack: ['JavaScript', 'Web Audio API', 'Chrome APIs', 'rubberband-wasm'],
    href: 'https://chromewebstore.google.com/detail/sampler/lpfooebakgdefkbahlhbhjlhnodplpeb?pli=1',
    year: '2026',
  },
]

export default function Projects() {
  return (
    <div style={{ padding: '32px 36px' }}>
      <p
        className="font-details text-sm tracking-widest text-black/60 uppercase mb-8 page-item"
        style={{ animationDelay: '0ms' }}
      >
        Projects
      </p>

      {PROJECTS.map((project, i) => (
        <a
          key={project.name}
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="group block border-t border-black/10 page-item cursor-pointer"
          style={{
            animationDelay: `${(i + 1) * 65}ms`,
            pointerEvents: 'auto',
            transition: 'border-color 150ms ease, background 150ms ease',
            marginLeft: '-36px',
            marginRight: '-36px',
            paddingLeft: '36px',
            paddingRight: '36px',
            paddingTop: '20px',
            paddingBottom: '24px',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.025)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)' }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = '' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3 mb-1.5">
                <h2 className="font-ui font-semibold text-lg text-black tracking-tight">
                  {project.name}
                </h2>
                <span className="font-details text-sm text-black/45 tracking-widest uppercase">{project.type}</span>
                <span className="font-details text-sm text-black/40">{project.year}</span>
              </div>
              <p
                className="font-dialogue italic text-black/75"
                style={{ fontSize: '1.1rem', lineHeight: '1.55' }}
              >
                {project.desc}
              </p>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {project.stack.map(tag => <Badge key={tag} label={tag} />)}
              </div>
            </div>

            <span
              className="font-details text-base text-black/40 mt-0.5 shrink-0 inline-block group-hover:text-black"
              style={{ transition: `color 150ms ease, transform 150ms ${EASE_OUT}` }}
            >
              <span
                className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1"
                style={{ display: 'inline-block', transition: `transform 150ms ${EASE_OUT}` }}
              >
                ↗
              </span>
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

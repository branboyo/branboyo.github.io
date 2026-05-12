const EXPERIENCE = [
  {
    company: 'Capital One',
    role: 'Senior Associate Software Engineer',
    period: 'Jul 2023 — Jun 2025',
    stack: ['Angular', 'GraphQL', 'Spring Boot', 'Java', 'Docker'],
    bullets: [
      'Modernized the Angular frontend for internal transaction operations for tighter payment rail integrations.',
      'Designed a DMN-based traffic-switching layer for decisioning services, cutting release dependencies by 15%.',
    ],
  },
  {
    company: 'Capital One',
    role: 'Associate Software Engineer',
    period: 'Aug 2022 — Jul 2023',
    stack: ['Node.js', 'React', 'Express', 'TypeScript', 'AWS', 'PostgreSQL'],
    bullets: [
      'Built automated test scaffolding for parallelized browser tests running on AWS with request payload validation.',
      'Redesigned and shipped an internal React + Express dashboard servicing thousands of daily requests for test results.',
    ],
  },
  {
    company: 'Stellar Services',
    role: 'Software Engineer',
    period: 'Dec 2021 — Aug 2022',
    stack: ['ASP.NET', 'C#', 'Python', 'PowerApps', 'SharePoint'],
    bullets: [
      'Maintained the ASP.NET construction-tracking platform powering the DC Metro Silver Line extension project.',
      'Built inventory tooling with PowerApps and Python that meaningfully reduced manual overhead for the IT team.',
    ],
  },
]

const EDUCATION = [
  { degree: 'B.S. Computer Science', institution: 'University of Maryland, College Park', year: 'May 2022' },
  { degree: 'Associate Solutions Architect', institution: 'Amazon Web Services', year: 'Jun 2023' },
]

function Badge({ label }) {
  return (
    <span className="font-details text-xs tracking-wide text-black/55 bg-black/[.06] rounded-full px-2.5 py-0.5">
      {label}
    </span>
  )
}

export default function Experience() {
  return (
    <div style={{ padding: '32px 36px' }}>
      <div
        className="flex items-baseline justify-between mb-8 page-item"
        style={{ animationDelay: '0ms' }}
      >
        <p className="font-details text-sm tracking-widest text-black/60 uppercase">
          Experience
        </p>
        <a
          href="/brandon_hsu_resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="font-details text-xs tracking-widest text-black/40 uppercase hover:text-black transition-colors duration-150 inline-flex items-center gap-1"
          style={{ pointerEvents: 'auto' }}
        >
          Résumé ↗
        </a>
      </div>

      {EXPERIENCE.map((entry, i) => (
        <div
          key={`${entry.company}-${entry.role}`}
          className="border-t border-black/10 pt-5 pb-6 page-item"
          style={{ animationDelay: `${(i + 1) * 65}ms` }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-ui font-semibold text-lg text-black tracking-tight">
              {entry.company}
            </h2>
            <span className="font-details text-sm text-black/60">{entry.period}</span>
          </div>
          <p className="font-details text-sm tracking-widest text-black/60 uppercase mb-3">
            {entry.role}
          </p>
          <ul className="space-y-1.5">
            {entry.bullets.map((b, j) => (
              <li
                key={j}
                className="font-dialogue italic text-black/75"
                style={{ fontSize: '1.05rem', lineHeight: '1.6' }}
              >
                {b}
              </li>
            ))}
          </ul>
          <div className="flex gap-1.5 flex-wrap mt-3">
            {entry.stack.map(tag => <Badge key={tag} label={tag} />)}
          </div>
        </div>
      ))}

      {/* Education */}
      <div
        className="border-t border-black/10 pt-5 pb-6 page-item"
        style={{ animationDelay: `${(EXPERIENCE.length + 1) * 65}ms` }}
      >
        <p className="font-details text-sm tracking-widest text-black/60 uppercase mb-4">
          Education &amp; Certification
        </p>
        {EDUCATION.map(ed => (
          <div key={ed.degree} className="mb-3">
            <div className="flex items-baseline justify-between">
              <span className="font-ui font-semibold text-black text-base tracking-tight">{ed.degree}</span>
              <span className="font-details text-sm text-black/60 shrink-0 ml-4">{ed.year}</span>
            </div>
            <p className="font-dialogue italic text-black/55" style={{ fontSize: '0.9rem' }}>{ed.institution}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

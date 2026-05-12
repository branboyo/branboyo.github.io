import { useState } from 'react'
import { MailIcon, GitHubIcon, LinkedInIcon } from '../icons'

const LINKS = [
  { label: 'Email',    href: 'mailto:b.dehsu@gmail.com',            display: 'b.dehsu@gmail.com', Icon: MailIcon     },
  { label: 'GitHub',   href: 'https://github.com/branboyo',         display: 'github/branboyo',   Icon: GitHubIcon   },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bdehsu/', display: 'linkedin/bdehsu',   Icon: LinkedInIcon },
]

const FIELD = {
  width: '100%',
  background: 'transparent',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '0.9rem',
  color: 'rgba(0,0,0,0.75)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 150ms ease',
  pointerEvents: 'auto',
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const set   = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const focus = e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)' }
  const blur  = e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)' }

  function handleSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(form.name ? `Message from ${form.name}` : 'Message')
    const bodyParts = [
      form.message,
      '',
      form.name  && `— ${form.name}`,
      form.email && form.email,
    ].filter(Boolean).join('\n')
    window.location.href = `mailto:b.dehsu@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyParts)}`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-black/10 pt-5 pb-2 page-item"
      style={{ animationDelay: '260ms', display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          name="name" type="text" placeholder="Name"
          value={form.name} onChange={set('name')}
          style={FIELD} onFocus={focus} onBlur={blur}
        />
        <input
          name="email" type="email" placeholder="Email"
          value={form.email} onChange={set('email')}
          style={FIELD} onFocus={focus} onBlur={blur}
        />
      </div>
      <textarea
        name="message" placeholder="Message" rows={5}
        value={form.message} onChange={set('message')}
        style={{ ...FIELD, resize: 'none' }} onFocus={focus} onBlur={blur}
      />
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className="font-details text-xs tracking-widest uppercase active:scale-95 inline-block"
          style={{
            background: 'rgba(0,0,0,0.72)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 22px',
            cursor: 'pointer',
            pointerEvents: 'auto',
            transition: 'background 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.55)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.72)' }}
        >
          Send →
        </button>
      </div>
    </form>
  )
}

export default function Contact() {
  return (
    <div style={{ padding: '32px 36px' }}>
      <p
        className="font-details text-sm tracking-widest text-black/60 uppercase mb-8 page-item"
        style={{ animationDelay: '0ms' }}
      >
        Contact
      </p>

      <h2
        className="font-ui font-semibold text-black mb-8 page-item"
        style={{ fontSize: '2rem', lineHeight: '1.25', animationDelay: '60ms' }}
      >
        Let's build something together.
      </h2>

      <div className="flex flex-col gap-0">
        {LINKS.map(({ label, href, display, Icon }, i) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel="noreferrer"
            className="group flex items-center justify-between border-t border-black/10 py-4 page-item hover:border-black/25 transition-colors duration-150"
            style={{ pointerEvents: 'auto', animationDelay: `${(i + 2) * 60}ms` }}
          >
            <span className="font-details text-sm tracking-widest text-black/60 uppercase group-hover:text-black/70 transition-colors duration-150">
              {label}
            </span>
            <span
              className="font-dialogue italic text-black/80 group-hover:text-black group-hover:translate-x-1 flex items-center gap-2"
              style={{ fontSize: '1.2rem', transition: 'color 150ms ease, transform 150ms cubic-bezier(0.23,1,0.32,1)' }}
            >
              <span
                className="inline-block group-hover:scale-125 group-hover:-translate-y-0.5"
                style={{ transition: `transform 150ms cubic-bezier(0.23,1,0.32,1)` }}
              >
                <Icon size={18} />
              </span>
              {display}
            </span>
          </a>
        ))}
      </div>

      <ContactForm />
    </div>
  )
}

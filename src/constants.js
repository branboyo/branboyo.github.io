export const RING_RADIUS     = 167
export const LABEL_THRESHOLD = RING_RADIUS * 0.65

// World-space layout:
//
//          [Contact]
//              |
// [Experience] — [Home] — [Projects]

export const PAGES = {
  home:       { label: 'Home' },
  projects:   { label: 'Projects' },
  contact:    { label: 'Contact' },
  experience: { label: 'Experience' },
}

// From each page, which page lies in each cardinal direction?
// null means no neighbour — the orb snaps back instead of navigating.
export const NAV = {
  home:       { top: 'contact', right: 'projects', bottom: null, left: 'experience' },
  projects:   { top: null,      right: null,        bottom: null, left: 'home'       },
  contact:    { top: null,      right: null,        bottom: 'home', left: null        },
  experience: { top: null,      right: 'home',      bottom: null, left: null         },
}

export function getDirection(x, y) {
  const dist = Math.sqrt(x * x + y * y)
  if (dist < LABEL_THRESHOLD) return null
  const a   = Math.atan2(y, x)
  const PI4 = Math.PI / 4
  if (a > -PI4     && a <= PI4)     return 'right'
  if (a > PI4      && a <= PI4 * 3) return 'bottom'
  if (a > -PI4 * 3 && a <= -PI4)   return 'top'
  return 'left'
}

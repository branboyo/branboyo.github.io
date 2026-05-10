export const RING_RADIUS     = 250
export const LABEL_THRESHOLD = RING_RADIUS * 0.65

export const LABELS = {
  top:    { text: 'Placeholder Top' },
  right:  { text: 'Placeholder Right' },
  bottom: { text: 'Placeholder Bottom' },
  left:   { text: 'Placeholder Left' },
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

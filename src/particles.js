import { RING_RADIUS } from './constants'

export function spawnWhite() {
  const a = Math.random() * Math.PI * 2
  const r = Math.sqrt(Math.random()) * RING_RADIUS * 0.92
  return {
    x: Math.cos(a) * r, y: Math.sin(a) * r,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    size:  0.8 + Math.random() * 2.2,
    alpha: 0, max: 0.65 + Math.random() * 0.35, in: true,
  }
}

export function spawnTrail(orbX, orbY) {
  const dist = Math.sqrt(orbX * orbX + orbY * orbY)
  if (dist < 5) return null
  const t    = Math.random()
  const perp = Math.atan2(orbY, orbX) + Math.PI / 2
  const spr  = (Math.random() - 0.5) * 12
  return {
    x: orbX * t + Math.cos(perp) * spr,
    y: orbY * t + Math.sin(perp) * spr,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size:  0.5 + Math.random() * 2.0,
    alpha: 0, max: 0.5 + Math.random() * 0.45, in: true,
  }
}

export function updateP(p, fadeRate) {
  p.x += p.vx; p.y += p.vy
  if (p.in) {
    p.alpha = Math.min(p.alpha + 0.03, p.max)
    if (p.alpha >= p.max) p.in = false
  } else {
    p.alpha -= fadeRate
  }
}

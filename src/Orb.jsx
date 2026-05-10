import { useRef, useEffect } from 'react'

const RING_RADIUS     = 250
const LABEL_THRESHOLD = RING_RADIUS * 0.65

const LABELS = {
  top:    { text: 'Placeholder Top' },
  right:  { text: 'Placeholder Right' },
  bottom: { text: 'Placeholder Bottom' },
  left:   { text: 'Placeholder Left' },
}

function getDirection(x, y) {
  const dist = Math.sqrt(x * x + y * y)
  if (dist < LABEL_THRESHOLD) return null
  const a   = Math.atan2(y, x)
  const PI4 = Math.PI / 4
  if (a > -PI4     && a <= PI4)     return 'right'
  if (a > PI4      && a <= PI4 * 3) return 'bottom'
  if (a > -PI4 * 3 && a <= -PI4)   return 'top'
  return 'left'
}

// ── Shard helpers ──────────────────────────────────────────────
function makeShard(cx, cy, scatterAngle) {
  const numV  = 3 + Math.floor(Math.random() * 2)
  const size  = 55 + Math.random() * 130
  const base  = Math.random() * Math.PI * 2
  const verts = Array.from({ length: numV }, (_, i) => {
    const a = base + (i / numV) * Math.PI * 2 + (Math.random() - 0.5) * 0.9
    const r = size * (0.45 + Math.random() * 0.55)
    return { x: Math.cos(a) * r, y: Math.sin(a) * r }
  })

  const angle = scatterAngle + (Math.random() - 0.5) * Math.PI * 1.4
  const speed = 4 + Math.random() * 11
  // Spread spawn position perpendicular to scatter direction
  const perpX = Math.sin(scatterAngle) * (Math.random() - 0.5) * 80
  const perpY = Math.cos(scatterAngle) * (Math.random() - 0.5) * 80
  return {
    x: cx + perpX,
    y: cy + perpY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 2,
    verts,
    rot:      Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.12,
    alpha:    0.85 + Math.random() * 0.15,
    gx:        6 + Math.random() * 9,
    gy:        3 + Math.random() * 6,
    stutterX:  0,
    stutterY:  0,
    stutterTimer: 0,
  }
}

function drawShard(ctx, s) {
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.rotate(s.rot)

  const gx = s.stutterX
  const gy = s.stutterY

  function path() {
    ctx.beginPath()
    ctx.moveTo(s.verts[0].x, s.verts[0].y)
    for (let i = 1; i < s.verts.length; i++) ctx.lineTo(s.verts[i].x, s.verts[i].y)
    ctx.closePath()
  }

  // R accent
  ctx.save(); ctx.translate(gx, -gy * 0.6); path()
  ctx.fillStyle = `rgba(255,0,0,${(s.alpha * 0.62).toFixed(3)})`; ctx.fill(); ctx.restore()

  // G accent
  ctx.save(); ctx.translate(-gx * 0.4, gy); path()
  ctx.fillStyle = `rgba(0,255,80,${(s.alpha * 0.5).toFixed(3)})`; ctx.fill(); ctx.restore()

  // B accent
  ctx.save(); ctx.translate(-gx, -gy); path()
  ctx.fillStyle = `rgba(0,40,255,${(s.alpha * 0.62).toFixed(3)})`; ctx.fill(); ctx.restore()

  // White — dominant
  path()
  ctx.fillStyle   = `rgba(255,255,255,${(s.alpha * 0.94).toFixed(3)})`; ctx.fill()
  ctx.strokeStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`
  ctx.lineWidth   = 1.5; ctx.stroke()

  ctx.restore()
}

// ──────────────────────────────────────────────────────────────

export default function Orb() {
  const orbRef    = useRef(null)
  const canvasRef = useRef(null)
  const ringRef   = useRef(null)
  const labelRefs = {
    top:    useRef(null),
    right:  useRef(null),
    bottom: useRef(null),
    left:   useRef(null),
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const orbEl  = orbRef.current
    const ringEl = ringRef.current
    const labels = Object.fromEntries(
      Object.entries(labelRefs).map(([k, r]) => [k, r.current])
    )

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let orbX = 0, orbY = 0
    let active = false, isDragging = false, isAnimating = false
    let whiteParticles = [], trailParticles = [], shards = []
    let rafId      = null
    let holdTimer  = null
    let shineAngle = -Math.PI * 0.25

    // ── Labels ──
    function updateLabels(x, y) {
      const dir = active ? getDirection(x, y) : null
      for (const [key, el] of Object.entries(labels)) {
        el.style.opacity = key === dir ? '1' : '0'
      }
    }

    // ── Particles ──
    function spawnWhite() {
      const a = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * RING_RADIUS * 0.92
      return {
        x: Math.cos(a) * r, y: Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: 0.8 + Math.random() * 2.2,
        alpha: 0, max: 0.65 + Math.random() * 0.35, in: true,
      }
    }

    function spawnTrail() {
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
        size: 0.5 + Math.random() * 2.0,
        alpha: 0, max: 0.5 + Math.random() * 0.45, in: true,
      }
    }

    function updateP(p, fadeRate) {
      p.x += p.vx; p.y += p.vy
      if (p.in) {
        p.alpha = Math.min(p.alpha + 0.03, p.max)
        if (p.alpha >= p.max) p.in = false
      } else {
        p.alpha -= fadeRate
      }
    }

    // ── Animation loop ──
    function tick() {
      const cx   = canvas.width  / 2
      const cy   = canvas.height / 2
      const dist = Math.sqrt(orbX * orbX + orbY * orbY)

      if (active) {
        if (whiteParticles.length < 100)
          for (let i = 0; i < 3; i++) whiteParticles.push(spawnWhite())
        if (dist > 5 && trailParticles.length < 80)
          for (let i = 0; i < 5; i++) { const p = spawnTrail(); if (p) trailParticles.push(p) }
      }

      for (const p of whiteParticles) updateP(p, active ? 0.005 : 0.03)
      for (const p of trailParticles) updateP(p, (active && dist > 5) ? 0.01 : 0.045)
      whiteParticles = whiteParticles.filter(p => p.alpha > 0)
      trailParticles = trailParticles.filter(p => p.alpha > 0)

      // Update shards
      for (const s of shards) {
        s.x  += s.vx;  s.y  += s.vy
        s.vy += 0.22;  s.vx *= 0.993
        s.rot    += s.rotSpeed
        s.stutterTimer--
        if (s.stutterTimer <= 0) {
          const big = Math.random() < 0.12
          const m   = big ? 3 + Math.random() * 4 : 1
          s.stutterX = (Math.random() - 0.5) * 2 * s.gx * m
          s.stutterY = (Math.random() - 0.5) * 2 * s.gy * m
          s.stutterTimer = Math.floor(2 + Math.random() * 6)
        }
        s.alpha  -= 0.006
      }
      shards = shards.filter(s => s.alpha > 0)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // White particles + glow inside ring
      if (active || whiteParticles.length > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, RING_RADIUS - 2, 0, Math.PI * 2)
        ctx.clip()

        if (active) {
          const eg = ctx.createRadialGradient(cx, cy, RING_RADIUS * 0.55, cx, cy, RING_RADIUS)
          eg.addColorStop(0, 'rgba(255,255,255,0)')
          eg.addColorStop(1, 'rgba(255,255,255,0.13)')
          ctx.fillStyle = eg
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          shineAngle += 0.006
          const sx = cx + Math.cos(shineAngle) * RING_RADIUS * 0.82
          const sy = cy + Math.sin(shineAngle) * RING_RADIUS * 0.82
          const sh = ctx.createRadialGradient(sx, sy, 0, sx, sy, 90)
          sh.addColorStop(0,   'rgba(255,255,255,0.55)')
          sh.addColorStop(0.4, 'rgba(255,255,255,0.15)')
          sh.addColorStop(1,   'rgba(255,255,255,0)')
          ctx.fillStyle = sh
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        for (const p of whiteParticles) {
          ctx.beginPath()
          ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${p.alpha.toFixed(3)})`
          ctx.fill()
        }
        ctx.restore()
      }

      // Black trail particles
      for (const p of trailParticles) {
        ctx.beginPath()
        ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,0,0,${p.alpha.toFixed(3)})`
        ctx.fill()
      }

      // Glass shards (full-screen, no clip)
      for (const s of shards) drawShard(ctx, s)

      const busy = active || whiteParticles.length > 0 || trailParticles.length > 0 || shards.length > 0
      rafId = busy ? requestAnimationFrame(tick) : null
    }

    function startLoop() { if (!rafId) rafId = requestAnimationFrame(tick) }

    // ── Orb position ──
    function positionOrb(x, y) {
      orbEl.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
    }

    function clamp(clientX, clientY) {
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      let dx = clientX - cx, dy = clientY - cy
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d > RING_RADIUS) { dx = dx / d * RING_RADIUS; dy = dy / d * RING_RADIUS }
      return { dx, dy }
    }

    // ── Activate / deactivate ──
    function activate() {
      active = true; isDragging = true
      ringEl.style.opacity   = '1'
      ringEl.style.transform = 'translate(-50%, -50%) scale(1)'
      orbEl.style.cursor = 'grabbing'
      startLoop()
    }

    function snapToCenter() {
      orbX = 0; orbY = 0
      orbEl.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)'
      positionOrb(0, 0)
      setTimeout(() => { orbEl.style.transition = ''; isAnimating = false }, 560)
    }

    function triggerEdgeAnimation(dir) {
      isAnimating = true

      // Map each direction to the opposite edge
      const W = window.innerWidth, H = window.innerHeight
      const targets = {
        top:    { tx: 0,    ty: H / 2,  ix: canvas.width / 2, iy: canvas.height,     scatter: -Math.PI / 2 },
        bottom: { tx: 0,    ty: -H / 2, ix: canvas.width / 2, iy: 0,                 scatter:  Math.PI / 2 },
        left:   { tx: W / 2, ty: 0,     ix: canvas.width,      iy: canvas.height / 2, scatter:  Math.PI     },
        right:  { tx: -W / 2, ty: 0,    ix: 0,                 iy: canvas.height / 2, scatter:  0           },
      }
      const { tx, ty, ix, iy, scatter } = targets[dir]

      orbEl.style.transition = 'transform 0.38s cubic-bezier(0.4,0,1,1)'
      orbEl.style.transform  = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`

      // On impact: hide orb, spawn shards, then restore
      setTimeout(() => {
        orbEl.style.opacity    = '0'
        orbEl.style.transition = ''

        shards = Array.from({ length: 14 }, () => makeShard(ix, iy, scatter))
        startLoop()

        // Return orb to centre after shards settle
        setTimeout(() => {
          orbEl.style.transition = 'opacity 0.35s ease, transform 0.55s cubic-bezier(0.4,0,0.2,1)'
          orbEl.style.transform  = 'translate(-50%, -50%)'
          orbEl.style.opacity    = '1'
          orbX = 0; orbY = 0
          setTimeout(() => { orbEl.style.transition = ''; isAnimating = false }, 560)
        }, 1100)
      }, 380)
    }

    function deactivate() {
      clearTimeout(holdTimer)
      const dir  = getDirection(orbX, orbY)
      active     = false
      isDragging = false
      ringEl.style.opacity   = '0'
      ringEl.style.transform = 'translate(-50%, -50%) scale(0.85)'
      orbEl.style.cursor = 'grab'
      updateLabels(0, 0)

      if (dir) {
        triggerEdgeAnimation(dir)
      } else {
        snapToCenter()
      }
    }

    // ── Events ──
    function onMouseDown(e) {
      if (isAnimating) return
      e.preventDefault()
      holdTimer = setTimeout(activate, 100)
    }
    function onMouseMove(e) {
      if (!isDragging) return
      const { dx, dy } = clamp(e.clientX, e.clientY)
      orbX = dx; orbY = dy
      positionOrb(orbX, orbY)
      updateLabels(orbX, orbY)
    }
    function onMouseUp() {
      clearTimeout(holdTimer)
      if (isDragging) deactivate()
    }
    function onTouchStart() { if (!isAnimating) holdTimer = setTimeout(activate, 500) }
    function onTouchMove(e) {
      if (!isDragging) return
      const { dx, dy } = clamp(e.touches[0].clientX, e.touches[0].clientY)
      orbX = dx; orbY = dy
      positionOrb(orbX, orbY)
      updateLabels(orbX, orbY)
    }
    function onTouchEnd() {
      clearTimeout(holdTimer)
      if (isDragging) deactivate()
    }

    orbEl.addEventListener('mousedown',  onMouseDown)
    orbEl.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend',  onTouchEnd)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(holdTimer)
      window.removeEventListener('resize',    resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onTouchEnd)
      orbEl.removeEventListener('mousedown',  onMouseDown)
      orbEl.removeEventListener('touchstart', onTouchStart)
    }
  }, [])

  const labelBase = {
    position: 'fixed',
    opacity: 0,
    zIndex: 25,
    pointerEvents: 'none',
    transition: 'opacity 0.12s ease',
  }

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }} />

      <div
        ref={ringRef}
        className="fixed rounded-full pointer-events-none"
        style={{
          top: '50%', left: '50%',
          width: 500, height: 500,
          border: '3px solid rgba(255,255,255,0.9)',
          transform: 'translate(-50%, -50%) scale(0.85)',
          opacity: 0, zIndex: 15,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      />

      <div
        ref={orbRef}
        className="fixed rounded-full bg-black select-none"
        style={{
          top: '50%', left: '50%',
          width: 50, height: 50,
          cursor: 'grab',
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
          boxShadow: [
            '0 0 0 3px rgba(0,0,0,1)',
            '0 0 16px 8px rgba(0,0,0,1)',
            '0 0 42px 20px rgba(0,0,0,0.82)',
            '0 0 85px 48px rgba(0,0,0,0.45)',
            '0 0 155px 85px rgba(0,0,0,0.18)',
          ].join(', '),
        }}
      />

      <span ref={labelRefs.top}    className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, top: `calc(50% - ${RING_RADIUS + 22}px)`, left: '50%', transform: 'translateX(-50%)' }}>
        {LABELS.top.text}
      </span>
      <span ref={labelRefs.bottom} className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, top: `calc(50% + ${RING_RADIUS + 10}px)`, left: '50%', transform: 'translateX(-50%)' }}>
        {LABELS.bottom.text}
      </span>
      <span ref={labelRefs.left}   className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, left: `calc(50% - ${RING_RADIUS + 16}px)`, top: '50%', transform: 'translate(-100%, -50%)' }}>
        {LABELS.left.text}
      </span>
      <span ref={labelRefs.right}  className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, left: `calc(50% + ${RING_RADIUS + 16}px)`, top: '50%', transform: 'translateY(-50%)' }}>
        {LABELS.right.text}
      </span>
    </>
  )
}

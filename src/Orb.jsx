import { useRef, useEffect } from 'react'
import { RING_RADIUS, LABEL_THRESHOLD, LABELS, getDirection } from './constants'
import { makeShard, drawShard } from './shard'
import { spawnWhite, spawnTrail, updateP } from './particles'

export default function Orb({ bgRef }) {
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
    const bgEl   = bgRef.current
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
    let gridX  = 0, gridY  = 0
    let gridEase = null // { startX, startY, endX, endY, orbStartX, orbStartY, frame, frames }

    function updateLabels(x, y) {
      const dir = active ? getDirection(x, y) : null
      for (const [key, el] of Object.entries(labels)) {
        el.style.opacity = key === dir ? '1' : '0'
      }
    }

    function tick() {
      const cx   = canvas.width  / 2
      const cy   = canvas.height / 2
      const dist = Math.sqrt(orbX * orbX + orbY * orbY)

      if (active) {
        if (whiteParticles.length < 100)
          for (let i = 0; i < 3; i++) whiteParticles.push(spawnWhite())
        if (dist > 5 && trailParticles.length < 80)
          for (let i = 0; i < 5; i++) { const p = spawnTrail(orbX, orbY); if (p) trailParticles.push(p) }
      }

      for (const p of whiteParticles) updateP(p, active ? 0.005 : 0.03)
      for (const p of trailParticles) updateP(p, (active && dist > 5) ? 0.01 : 0.045)
      whiteParticles = whiteParticles.filter(p => p.alpha > 0)
      trailParticles = trailParticles.filter(p => p.alpha > 0)

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
        s.alpha -= 0.006
      }
      shards = shards.filter(s => s.alpha > 0)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

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

      for (const p of trailParticles) {
        ctx.beginPath()
        ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,0,0,${p.alpha.toFixed(3)})`
        ctx.fill()
      }

      for (const s of shards) drawShard(ctx, s)

      if (gridEase) {
        gridEase.frame++
        const t = Math.min(gridEase.frame / gridEase.frames, 1)
        const e = t * t * t * t // quartic ease-in — long still pause, then surges into center

        gridX = gridEase.startX + (gridEase.endX - gridEase.startX) * e
        gridY = gridEase.startY + (gridEase.endY - gridEase.startY) * e
        bgEl.style.backgroundPosition = `${gridX}px ${gridY}px`

        orbX = gridEase.orbStartX * (1 - e)
        orbY = gridEase.orbStartY * (1 - e)
        positionOrb(orbX, orbY)

        if (t >= 1) {
          gridEase = null
          orbX = 0; orbY = 0
          positionOrb(0, 0)
          isAnimating = false
        }
      }

      const busy = active || whiteParticles.length > 0 || trailParticles.length > 0 || shards.length > 0 || gridEase !== null
      rafId = busy ? requestAnimationFrame(tick) : null
    }

    function startLoop() { if (!rafId) rafId = requestAnimationFrame(tick) }

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
      const W = window.innerWidth, H = window.innerHeight
      const FRAMES = 75 // ~1.25s — quartic ease-in needs room for the slow buildup

      // Shards still spawn at the screen edge; orb travels a full viewport to next page center
      const config = {
        top:    { flyTx: 0,  flyTy: H,  ix: canvas.width / 2, iy: canvas.height,     scatter: -Math.PI / 2 },
        bottom: { flyTx: 0,  flyTy: -H, ix: canvas.width / 2, iy: 0,                 scatter:  Math.PI / 2 },
        left:   { flyTx: W,  flyTy: 0,  ix: canvas.width,      iy: canvas.height / 2, scatter:  Math.PI     },
        right:  { flyTx: -W, flyTy: 0,  ix: 0,                 iy: canvas.height / 2, scatter:  0           },
      }
      const { flyTx, flyTy, ix, iy, scatter } = config[dir]

      // Phase 1: orb flies past the edge to the center of the next page (off-screen)
      orbEl.style.transition = 'transform 0.42s cubic-bezier(0.4,0,1,1)'
      orbEl.style.transform  = `translate(calc(-50% + ${flyTx}px), calc(-50% + ${flyTy}px))`

      setTimeout(() => {
        // Phase 2: impact — spawn shards at edge, place orb at off-screen destination
        orbEl.style.transition = ''
        orbEl.style.opacity    = '1' // orb is off-screen so this is invisible — restores it for re-entry
        shards = Array.from({ length: 14 }, () => makeShard(ix, iy, scatter))
        orbX = flyTx; orbY = flyTy
        startLoop()

        // Ease-in camera travel starts immediately — orb drifts into view as camera moves
        gridEase = {
          startX: gridX, startY: gridY,
          endX: gridX - flyTx, endY: gridY - flyTy,
          orbStartX: flyTx, orbStartY: flyTy,
          frame: 0, frames: FRAMES,
        }
      }, 420)
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
      if (dir) triggerEdgeAnimation(dir)
      else snapToCenter()
    }

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
          width: 30, height: 30,
          cursor: 'grab',
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
          boxShadow: [
            '0 0 0 2px rgba(0,0,0,1)',
            '0 0 10px 5px rgba(0,0,0,1)',
            '0 0 25px 12px rgba(0,0,0,0.82)',
            '0 0 51px 29px rgba(0,0,0,0.45)',
            '0 0 93px 51px rgba(0,0,0,0.18)',
          ].join(', '),
        }}
      />

      <span ref={labelRefs.top} className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, top: `calc(50% - ${RING_RADIUS + 22}px)`, left: '50%', transform: 'translateX(-50%)' }}>
        {LABELS.top.text}
      </span>
      <span ref={labelRefs.bottom} className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, top: `calc(50% + ${RING_RADIUS + 10}px)`, left: '50%', transform: 'translateX(-50%)' }}>
        {LABELS.bottom.text}
      </span>
      <span ref={labelRefs.left} className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, left: `calc(50% - ${RING_RADIUS + 16}px)`, top: '50%', transform: 'translate(-100%, -50%)' }}>
        {LABELS.left.text}
      </span>
      <span ref={labelRefs.right} className="font-ui font-semibold tracking-widest uppercase text-xs text-black/70"
        style={{ ...labelBase, left: `calc(50% + ${RING_RADIUS + 16}px)`, top: '50%', transform: 'translateY(-50%)' }}>
        {LABELS.right.text}
      </span>
    </>
  )
}

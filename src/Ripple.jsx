import { useRef, useEffect } from 'react'

const GRID       = 40
const SEGS       = 8           // smooth enough at current wavelength
const SEG_PX     = GRID / SEGS // 5 px per sub-segment
const AMPLITUDE  = 40
const WAVELENGTH = 140
const N_CRESTS   = 2
const TRAIN_LEN  = N_CRESTS * WAVELENGTH  // 280 px — two full cycles

export default function Ripple({ bgRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const bgEl   = bgRef?.current

    // ── All mutable state up front so every function below can close over it ──
    const ripples   = []
    let rafId       = null
    let lastNow     = null
    let lastOx      = null   // null = "never drawn"
    let lastOy      = null
    let stableCount = 0
    // Shared output for displace() — eliminates per-point heap allocation
    let _dx = 0
    let _dy = 0

    // ── Canvas sizing ────────────────────────────────────────────────────────
    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      lastOx = null  // force a full redraw on next tick
      startLoop()
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Ripple spawning ───────────────────────────────────────────────────────
    function spawnRipple() {
      const W = canvas.width, H = canvas.height
      const perim = 2 * (W + H)
      let t = Math.random() * perim
      let ox, oy
      if      (t < W)         { ox = t;            oy = 0 }
      else if (t < W + H)     { ox = W;            oy = t - W }
      else if (t < 2 * W + H) { ox = W - (t-W-H); oy = H }
      else                     { ox = 0;            oy = H - (t-2*W-H) }

      const baseAngle = Math.atan2(H / 2 - oy, W / 2 - ox)
      const angle     = baseAngle + (Math.random() - 0.5) * 0.52
      ripples.push({
        ox, oy,
        wdx: Math.cos(angle),
        wdy: Math.sin(angle),
        r: 0,
        maxR:  Math.sqrt(W * W + H * H) * 1.1,
        speed: 4 + Math.random() * 3,
      })
      startLoop()
    }

    // ── Displacement — writes _dx/_dy, allocates nothing ─────────────────────
    function displace(px, py) {
      _dx = 0; _dy = 0
      for (const rip of ripples) {
        const proj   = (px - rip.ox) * rip.wdx + (py - rip.oy) * rip.wdy
        const behind = rip.r - proj
        if (behind < 0 || behind > TRAIN_LEN) continue
        const env      = Math.sin((behind / TRAIN_LEN) * Math.PI)
        const fade     = 1 - rip.r / rip.maxR
        const wave     = Math.sin((behind / WAVELENGTH) * 2 * Math.PI)
        const strength = wave * AMPLITUDE * env * fade
        _dx += -rip.wdy * strength
        _dy +=  rip.wdx * strength
      }
    }

    // ── Grid pan offset (written by Orb during navigation) ───────────────────
    function getOffset() {
      const pos = bgEl?.style.backgroundPosition || '0px 0px'
      const sp  = pos.indexOf(' ')
      return {
        ox: parseFloat(pos) || 0,
        oy: parseFloat(pos.slice(sp + 1)) || 0,
      }
    }

    // ── Grid drawing ──────────────────────────────────────────────────────────
    function drawGrid(ox, oy) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'
      ctx.lineWidth   = 2

      const x0 = ((ox % GRID) + GRID) % GRID
      const y0 = ((oy % GRID) + GRID) % GRID

      if (!ripples.length) {
        // ── Fast path: static grid — one moveTo+lineTo per line, no math ──
        ctx.beginPath()
        for (let gx = x0 - GRID; gx < canvas.width + GRID; gx += GRID) {
          ctx.moveTo(gx, -GRID)
          ctx.lineTo(gx, canvas.height + GRID)
        }
        ctx.stroke()

        ctx.beginPath()
        for (let gy = y0 - GRID; gy < canvas.height + GRID; gy += GRID) {
          ctx.moveTo(-GRID, gy)
          ctx.lineTo(canvas.width + GRID, gy)
        }
        ctx.stroke()
        return
      }

      // ── Active ripples: sub-segmented displaced lines ─────────────────────
      // Vertical lines
      ctx.beginPath()
      for (let gx = x0 - GRID; gx < canvas.width + GRID; gx += GRID) {
        let first = true
        for (let t = -SEG_PX; t <= canvas.height + SEG_PX; t += SEG_PX) {
          displace(gx, t)
          if (first) { ctx.moveTo(gx + _dx, t + _dy); first = false }
          else        ctx.lineTo(gx + _dx, t + _dy)
        }
      }
      ctx.stroke()

      // Horizontal lines — separate stroke call keeps each path manageable
      ctx.beginPath()
      for (let gy = y0 - GRID; gy < canvas.height + GRID; gy += GRID) {
        let first = true
        for (let t = -SEG_PX; t <= canvas.width + SEG_PX; t += SEG_PX) {
          displace(t, gy)
          if (first) { ctx.moveTo(t + _dx, gy + _dy); first = false }
          else        ctx.lineTo(t + _dx, gy + _dy)
        }
      }
      ctx.stroke()
    }

    // ── On-demand rAF loop ────────────────────────────────────────────────────
    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    function tick(now) {
      const dt     = lastNow !== null ? Math.min(now - lastNow, 50) : 16.667
      const factor = dt / 16.667
      lastNow = now

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += ripples[i].speed * factor
        if (ripples[i].r >= ripples[i].maxR) ripples.splice(i, 1)
      }

      const { ox, oy } = getOffset()
      const hasRipples = ripples.length > 0
      const gridMoved  = ox !== lastOx || oy !== lastOy

      if (hasRipples || gridMoved) {
        drawGrid(ox, oy)
        lastOx = ox
        lastOy = oy
        stableCount = 0
      } else {
        stableCount++
      }

      // Park the loop when idle; MutationObserver + spawnRipple wake it back up
      if (hasRipples || gridMoved || stableCount < 4) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId   = null
        lastNow = null  // reset so the next wakeup doesn't trigger the tab-resume flush
      }
    }

    // ── Wake loop when Orb pans the grid (writes backgroundPosition) ──────────
    let mo = null
    if (bgEl) {
      mo = new MutationObserver(startLoop)
      mo.observe(bgEl, { attributes: true, attributeFilter: ['style'] })
    }

    // ── Spawn timer ───────────────────────────────────────────────────────────
    let scheduleTimer = null
    let isHidden      = document.hidden

    function schedule() {
      if (isHidden) return                          // don't queue while inactive
      const delay = 4000 + Math.random() * 4000    // 4 – 8 s between waves
      scheduleTimer = setTimeout(() => { spawnRipple(); schedule() }, delay)
    }

    // ── Page-visibility: pause when tabbed out, resume when back ─────────────
    function onVisibilityChange() {
      if (document.hidden) {
        isHidden = true
        if (rafId) { cancelAnimationFrame(rafId); rafId = null }
        clearTimeout(scheduleTimer); scheduleTimer = null
        lastNow = null    // prevent a huge dt spike on resume
      } else {
        isHidden = false
        if (ripples.length > 0) startLoop()  // resume mid-flight waves
        schedule()                            // restart spawn cadence
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    startLoop()
    // Spawn one soon after load so the grid feels alive immediately
    scheduleTimer = setTimeout(() => { spawnRipple(); schedule() }, 800)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(scheduleTimer)
      mo?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}
    />
  )
}

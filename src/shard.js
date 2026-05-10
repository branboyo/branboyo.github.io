export function makeShard(cx, cy, scatterAngle) {
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
  const perpX = Math.sin(scatterAngle) * (Math.random() - 0.5) * 80
  const perpY = Math.cos(scatterAngle) * (Math.random() - 0.5) * 80
  return {
    x: cx + perpX,
    y: cy + perpY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 2,
    verts,
    rot:          Math.random() * Math.PI * 2,
    rotSpeed:     (Math.random() - 0.5) * 0.12,
    alpha:        0.85 + Math.random() * 0.15,
    gx:           6 + Math.random() * 9,
    gy:           3 + Math.random() * 6,
    stutterX:     0,
    stutterY:     0,
    stutterTimer: 0,
  }
}

export function drawShard(ctx, s) {
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

  ctx.save(); ctx.translate(gx, -gy * 0.6); path()
  ctx.fillStyle = `rgba(255,0,0,${(s.alpha * 0.62).toFixed(3)})`; ctx.fill(); ctx.restore()

  ctx.save(); ctx.translate(-gx * 0.4, gy); path()
  ctx.fillStyle = `rgba(0,255,80,${(s.alpha * 0.5).toFixed(3)})`; ctx.fill(); ctx.restore()

  ctx.save(); ctx.translate(-gx, -gy); path()
  ctx.fillStyle = `rgba(0,40,255,${(s.alpha * 0.62).toFixed(3)})`; ctx.fill(); ctx.restore()

  path()
  ctx.fillStyle   = `rgba(255,255,255,${(s.alpha * 0.94).toFixed(3)})`; ctx.fill()
  ctx.strokeStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`
  ctx.lineWidth   = 1.5; ctx.stroke()

  ctx.restore()
}

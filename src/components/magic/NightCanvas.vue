<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Toile de nuit plein écran : neige à plusieurs profondeurs + braises chaudes
 * qui montent de la lampe. Un seul rAF, ~140 particules, drawImage/arc seulement
 * — le compositeur reste libre pour le reste de la page. 60 fps facile.
 */
const canvasEl = ref<HTMLCanvasElement | null>(null)

interface Flake { x: number; y: number; r: number; vy: number; drift: number; phase: number; depth: number }
interface Ember { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number }

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const canvas = canvasEl.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  let w = 0, h = 0, raf = 0
  const dpr = Math.min(2, devicePixelRatio || 1)
  const flakes: Flake[] = []
  const embers: Ember[] = []

  const spawnFlake = (top = false): Flake => ({
    x: Math.random() * w,
    y: top ? -8 : Math.random() * h,
    r: .8 + Math.random() * 2.2,
    vy: 14 + Math.random() * 26,
    drift: .4 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    depth: .4 + Math.random() * .6, // lointaines = petites, lentes, plus transparentes
  })
  const spawnEmber = (): Ember => ({
    x: w * (.08 + Math.random() * .84),
    y: h * (.72 + Math.random() * .3),
    vx: (Math.random() - .5) * 6,
    vy: -(8 + Math.random() * 16),
    life: 0,
    max: 5 + Math.random() * 6,
    r: .7 + Math.random() * 1.6,
  })

  const resize = () => {
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const target = Math.min(130, Math.round((w * h) / 14000))
    while (flakes.length < target) flakes.push(spawnFlake())
    flakes.length = Math.min(flakes.length, target)
    while (embers.length < 14) embers.push(spawnEmber())
  }
  resize()
  window.addEventListener('resize', resize)

  let last = performance.now()
  const frame = (now: number) => {
    const dt = Math.min(.05, (now - last) / 1000)
    last = now
    ctx.clearRect(0, 0, w, h)

    // neige : les couches profondes tombent plus lentement
    for (const f of flakes) {
      f.y += f.vy * f.depth * dt
      f.phase += dt * .8
      f.x += Math.sin(f.phase) * f.drift * dt * 12
      if (f.y > h + 8) Object.assign(f, spawnFlake(true))
      if (f.x < -8) f.x = w + 8
      if (f.x > w + 8) f.x = -8
      ctx.globalAlpha = .25 + f.depth * .5
      ctx.fillStyle = '#f4ecd8'
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r * f.depth, 0, Math.PI * 2)
      ctx.fill()
    }

    // braises : elles montent de la zone bureau, scintillent, s'éteignent
    for (let i = 0; i < embers.length; i++) {
      const e = embers[i]
      e.life += dt
      e.x += e.vx * dt + Math.sin(e.life * 2.1) * .25
      e.y += e.vy * dt
      if (e.life > e.max || e.y < -10) embers[i] = spawnEmber()
      const t = e.life / e.max
      const flicker = .75 + Math.sin(e.life * 9 + i) * .25
      ctx.globalAlpha = Math.max(0, (t < .15 ? t / .15 : 1 - t) * .7 * flicker)
      ctx.fillStyle = '#ffd98e'
      ctx.beginPath()
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas ref="canvasEl" class="night-canvas" aria-hidden="true" />
</template>

<style scoped>
.night-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>

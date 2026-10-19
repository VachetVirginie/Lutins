<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useIsDesktop } from '../../composables/useBreakpoints'

/**
 * Le curseur devient une lanterne : un point de flamme vive suivi d'un
 * halo chaud et d'une traînée de poussière d'étoiles. Le halo s'amplifie
 * au survol des éléments interactifs. Desktop + pointer:fine uniquement.
 */
const isDesktop = useIsDesktop()
const fine = matchMedia('(pointer: fine)').matches
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const canvasEl = ref<HTMLCanvasElement | null>(null)

interface Dust { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number }

let cleanup: (() => void) | null = null

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  let w = innerWidth, h = innerHeight
  const dpr = Math.min(2, devicePixelRatio || 1)
  const resize = () => {
    w = innerWidth
    h = innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)

  const mouse = { x: w / 2, y: h / 2, seen: false }
  const lamp = { x: w / 2, y: h / 2 }
  let glowBoost = 0
  const dust: Dust[] = []

  const onMove = (e: MouseEvent) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    mouse.seen = true
    for (let i = 0; i < 3; i++) {
      dust.push({
        x: lamp.x + (Math.random() - .5) * 12,
        y: lamp.y + (Math.random() - .5) * 12,
        vx: (Math.random() - .5) * 20,
        vy: -10 - Math.random() * 18,
        life: 0,
        max: .8 + Math.random() * 1,
        r: 1 + Math.random() * 1.8,
      })
      if (dust.length > 200) dust.shift()
    }
  }

  const onOver = (e: MouseEvent) => {
    glowBoost = (e.target as HTMLElement).closest('a,button,[role="button"]') ? 1 : 0
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseover', onOver, { passive: true })

  let raf = 0
  let boost = 0
  let last = performance.now()
  const frame = (now: number) => {
    const dt = Math.min(.05, (now - last) / 1000)
    last = now
    ctx.clearRect(0, 0, w, h)

    boost += (glowBoost - boost) * Math.min(1, dt * 8)
    lamp.x += (mouse.x - lamp.x) * Math.min(1, dt * 11)
    lamp.y += (mouse.y - lamp.y) * Math.min(1, dt * 11)

    if (mouse.seen) {
      const r = 150 + boost * 70
      const g = ctx.createRadialGradient(lamp.x, lamp.y, 0, lamp.x, lamp.y, r)
      g.addColorStop(0, `rgba(255,230,160,${.42 + boost * .16})`)
      g.addColorStop(.3, `rgba(255,205,115,${.2 + boost * .1})`)
      g.addColorStop(1, 'rgba(255,190,90,0)')
      ctx.fillStyle = g
      ctx.fillRect(lamp.x - r, lamp.y - r, r * 2, r * 2)

      // l'anneau de la lanterne — repère doré qui cerne le pointeur
      ctx.globalAlpha = .75 + boost * .25
      ctx.strokeStyle = 'rgba(255,214,120,.9)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.arc(lamp.x, lamp.y, 12 + boost * 5, 0, Math.PI * 2)
      ctx.stroke()

      // la flamme
      ctx.globalAlpha = 1
      ctx.fillStyle = '#fff6dc'
      ctx.beginPath()
      ctx.arc(lamp.x, lamp.y, 2.4, 0, Math.PI * 2)
      ctx.fill()
    }

    for (let i = dust.length - 1; i >= 0; i--) {
      const p = dust[i]
      p.life += dt
      if (p.life > p.max) {
        dust.splice(i, 1)
        continue
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy -= 8 * dt
      const t = p.life / p.max
      ctx.globalAlpha = (1 - t) * .9
      ctx.fillStyle = t < .35 ? '#ffe9b0' : '#d9a94e'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * (1 - t * .55), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseover', onOver)
  }
}

// le canvas n'existe qu'une fois isDesktop vrai — on attend sa montée réelle
watch(canvasEl, (el) => {
  cleanup?.()
  cleanup = null
  if (el && fine && !reduceMotion) cleanup = init(el)
}, { immediate: true })

onBeforeUnmount(() => {
  cleanup?.()
  cleanup = null
})
</script>

<template>
  <canvas v-if="isDesktop && fine && !reduceMotion" ref="canvasEl" class="cursor-lantern" aria-hidden="true" />
</template>

<style scoped>
.cursor-lantern {
  position: fixed;
  inset: 0;
  z-index: 75;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>

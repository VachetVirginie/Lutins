<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { TresCanvas } from '@tresjs/core'
import * as THREE from 'three'

// Rafale de neige volumétrique : le sceau déverrouillé relâche l'hiver.
// La bourrasque balaie l'écran pendant que l'aventure remplace l'ouverture.
const COUNT = 900
const RANGE_X = 8.5
const RANGE_Y = 5.5
const RANGE_Z = 6

const positions = new Float32Array(COUNT * 3)
const speed = new Float32Array(COUNT)
const fall = new Float32Array(COUNT)
const phase = new Float32Array(COUNT)

for (let i = 0; i < COUNT; i++) {
  positions[i * 3] = (Math.random() * 2 - 1) * RANGE_X
  positions[i * 3 + 1] = (Math.random() * 2 - 1) * RANGE_Y
  positions[i * 3 + 2] = -Math.random() * RANGE_Z + 1
  speed[i] = 0.6 + Math.random() * 1.6
  fall[i] = 0.35 + Math.random() * 0.8
  phase[i] = Math.random() * Math.PI * 2
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Sprite doux généré au runtime — pas d'asset externe
const sprite = document.createElement('canvas')
sprite.width = sprite.height = 64
const g = sprite.getContext('2d')!
const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32)
rg.addColorStop(0, 'rgba(255,252,240,1)')
rg.addColorStop(0.45, 'rgba(255,246,220,.75)')
rg.addColorStop(1, 'rgba(255,244,214,0)')
g.fillStyle = rg
g.fillRect(0, 0, 64, 64)

const material = new THREE.PointsMaterial({
  size: 0.14,
  map: new THREE.CanvasTexture(sprite),
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  opacity: 0.9,
  sizeAttenuation: true,
})

const flakes = new THREE.Points(geometry, material)
flakes.frustumCulled = false

const t0 = performance.now()
let last = t0

// Enveloppe de vent : montée → bourrasque → apaisement
function windAt(t: number): number {
  if (t < 0.15) return t / 0.15
  if (t < 0.85) return 1
  return Math.max(0, 1 - (t - 0.85) / 0.7)
}

function tick() {
  const now = performance.now()
  const dt = Math.min(0.05, (now - last) / 1000)
  const t = (now - t0) / 1000
  last = now
  const wind = windAt(t)
  const p = geometry.attributes.position.array as Float32Array
  for (let i = 0; i < COUNT; i++) {
    const depth = (p[i * 3 + 2] + RANGE_Z) / RANGE_Z // 0 = lointain, 1 = proche
    p[i * 3] += dt * speed[i] * (1.2 + wind * 26) * (0.5 + depth)
    p[i * 3 + 1] +=
      dt * (-fall[i] * (0.4 + depth * 0.8) + Math.sin(t * 2.4 + phase[i]) * 0.5 * (1 - wind * 0.6))
    if (p[i * 3] > RANGE_X) p[i * 3] = -RANGE_X
    if (p[i * 3 + 1] < -RANGE_Y) p[i * 3 + 1] = RANGE_Y
  }
  geometry.attributes.position.needsUpdate = true
}

onBeforeUnmount(() => {
  geometry.dispose()
  material.map?.dispose()
  material.dispose()
})
</script>

<template>
  <div class="snow-transition" aria-hidden="true">
    <TresCanvas :alpha="true" :antialias="false" :depth="false" :stencil="false" @loop="tick">
      <TresPerspectiveCamera :position="[0, 0, 8]" :fov="50" />
      <primitive :object="flakes" />
    </TresCanvas>
  </div>
</template>

<style scoped>
.snow-transition {
  position:fixed;
  inset:0;
  z-index:85;
  pointer-events:none;
  animation:gust-out .5s ease 1.35s both
}

@keyframes gust-out {
  to {
    opacity:0
  }
}

@media (prefers-reduced-motion:reduce) {
  .snow-transition {
    display:none
  }
}
</style>

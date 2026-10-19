<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'

/**
 * Le tunnel d'étincelles de la traversée : un cylindre de braises d'or
 * tourne en vortex différentiel (le cœur file plus vite que les bords),
 * puis la caméra plonge À TRAVERS — les étincelles fouettent l'écran.
 */
const COUNT = 1700
const Z_NEAR = 7
const Z_FAR = -26

const angles = new Float32Array(COUNT)
const radii = new Float32Array(COUNT)
const depths = new Float32Array(COUNT)
const spin = new Float32Array(COUNT)
const positions = new Float32Array(COUNT * 3)
const colors = new Float32Array(COUNT * 3)

const GOLD = [1, .8, .42]
const HOT = [1, .96, .82]
const FROST = [.62, .8, 1]

for (let i = 0; i < COUNT; i++) {
  angles[i] = Math.random() * Math.PI * 2
  // rayon creux : un vrai tunnel, rien au centre — on passe dedans
  radii[i] = .9 + Math.pow(Math.random(), .75) * 6.8
  depths[i] = Z_NEAR - Math.random() * (Z_NEAR - Z_FAR)
  spin[i] = .55 + Math.random() * .9
  const roll = Math.random()
  const c = roll < .68 ? GOLD : roll < .86 ? HOT : FROST
  const lum = .3 + Math.random() * .7
  colors[i * 3] = c[0] * lum
  colors[i * 3 + 1] = c[1] * lum
  colors[i * 3 + 2] = c[2] * lum
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

function sparkSprite(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  rg.addColorStop(0, 'rgba(255,255,255,1)')
  rg.addColorStop(.25, 'rgba(255,244,214,.85)')
  rg.addColorStop(1, 'rgba(255,214,140,0)')
  g.fillStyle = rg
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

const material = new THREE.PointsMaterial({
  size: .17,
  map: sparkSprite(),
  vertexColors: true,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  opacity: 0,
  sizeAttenuation: true,
})
const sparks = new THREE.Points(geometry, material)
sparks.frustumCulled = false

const t0 = performance.now()
const DIVE_AT = .62 // le sceau lâche — on plonge
const easeInCubic = (x: number) => x * x * x
const easeInOut = (x: number) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

const { onRender } = useLoop()
onRender(({ camera }) => {
  const cam3 = camera.value
  if (!cam3) return
  const t = (performance.now() - t0) / 1000
  const dive = Math.max(0, Math.min(1, (t - DIVE_AT) / .68))
  const diveEase = easeInCubic(dive)

  for (let i = 0; i < COUNT; i++) {
    const r = radii[i]
    // vortex différentiel : le cœur tourne plus vite ; tout accélère en plongée
    angles[i] += spin[i] * (1.4 - r / 9) * (1 + diveEase * 2.6) * .016 * 3.2
    const breathe = dive > 0 ? .028 * diveEase : -.0016 // converge, puis s'ouvre
    radii[i] = Math.max(.5, r + breathe * (1 + (1 - r / 8)))
    positions[i * 3] = Math.cos(angles[i]) * radii[i]
    positions[i * 3 + 1] = Math.sin(angles[i]) * radii[i] * .72
    positions[i * 3 + 2] = depths[i] + Math.sin(t * 1.6 + angles[i] * 3) * .18
  }
  geometry.attributes.position.needsUpdate = true

  // la caméra traverse le tunnel : z 9 → -30, fov s'ouvre = sensation de vitesse
  const settle = easeInOut(Math.min(1, t / .6))
  cam3.position.z = 9 - settle * .8 - diveEase * 39
  cam3.position.x = Math.sin(t * .7) * .25 * (1 - dive)
  cam3.position.y = Math.cos(t * .55) * .18 * (1 - dive)
  const persp = cam3 as THREE.PerspectiveCamera
  persp.fov = 55 + diveEase * 30
  persp.updateProjectionMatrix()
  cam3.lookAt(0, 0, cam3.position.z - 10)
  cam3.rotateZ(diveEase * .5 + Math.sin(t * .9) * .05) // roulis du vortex

  material.opacity = Math.min(1, t / .18) * (t > 1.35 ? Math.max(0, 1 - (t - 1.35) / .4) : 1)
  material.size = .17 + diveEase * .16 // étincelles qui s'étirent en passant
})

onBeforeUnmount(() => {
  geometry.dispose()
  material.map?.dispose()
  material.dispose()
})
</script>

<template>
  <primitive :object="sparks" />
</template>

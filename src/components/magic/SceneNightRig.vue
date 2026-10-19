<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'

/**
 * Le décor de la veillée, en vrai WebGL : neige volumétrique à deux
 * profondeurs, braises d'or qui montent, lune-halo. La caméra vit :
 * elle suit la souris, dérive d'elle-même, et le SCROLL de la page
 * l'envoie plonger à travers la neige (camera travel).
 */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

function softSprite(inner = '255,252,240', outer = '255,244,214'): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  rg.addColorStop(0, `rgba(${inner},1)`)
  rg.addColorStop(.4, `rgba(${outer},.7)`)
  rg.addColorStop(1, `rgba(${outer},0)`)
  g.fillStyle = rg
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

/* ---------- la neige, deux couches de profondeur ----------
   Chaque flocon a sa luminosité propre (vertex colors) : avec le blending
   additif, les plus sombres disparaissent presque — vraie profondeur. */
function makeSnow(count: number, size: number, opacity: number) {
  const RANGE_X = 14
  const RANGE_Y = 7
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const speed = new Float32Array(count)
  const phase = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() * 2 - 1) * RANGE_X
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * RANGE_Y
    positions[i * 3 + 2] = -Math.random() * 14 + 2 // z : 2 → -12, un tunnel
    const lum = .2 + Math.random() * .8 // 20 % quasi invisibles, 20 % brillants
    const warm = Math.random() < .3 // 30 % de flocons tièdes, teinte bougie
    colors[i * 3] = lum
    colors[i * 3 + 1] = lum * (warm ? .82 : 1)
    colors[i * 3 + 2] = lum * (warm ? .58 : 1)
    speed[i] = .4 + Math.random() * 1.1
    phase[i] = Math.random() * Math.PI * 2
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size,
    map: softSprite(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    opacity,
    sizeAttenuation: true,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return { points, geometry, positions, speed, phase, RANGE_X, RANGE_Y }
}

const snowFar = makeSnow(90, .15, .55)
const snowNear = makeSnow(80, .28, .9)

/* ---------- les braises d'or ---------- */
const EMBER_COUNT = 55
const emberPos = new Float32Array(EMBER_COUNT * 3)
const emberSpeed = new Float32Array(EMBER_COUNT)
const emberPhase = new Float32Array(EMBER_COUNT)
for (let i = 0; i < EMBER_COUNT; i++) {
  emberPos[i * 3] = (Math.random() * 2 - 1) * 12
  emberPos[i * 3 + 1] = -7 + Math.random() * 10
  emberPos[i * 3 + 2] = -Math.random() * 9
  emberSpeed[i] = .2 + Math.random() * .55
  emberPhase[i] = Math.random() * Math.PI * 2
}
const emberGeo = new THREE.BufferGeometry()
emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3))
const emberMat = new THREE.PointsMaterial({
  size: .18,
  map: softSprite('255,224,150', '255,190,90'),
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  opacity: .65,
  sizeAttenuation: true,
})
const embers = new THREE.Points(emberGeo, emberMat)
embers.frustumCulled = false

/* ---------- la lune n'est plus qu'une brume feutrée ---------- */
const moonMat = new THREE.SpriteMaterial({
  map: softSprite('255,240,190', '255,210,120'),
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  opacity: .16,
})
const moon = new THREE.Sprite(moonMat)
moon.position.set(5.5, 3, -8)
moon.scale.setScalar(3.4)

/* ---------- la boucle ---------- */
const mouse = { x: 0, y: 0 }
const onMouse = (e: MouseEvent) => {
  mouse.x = (e.clientX / innerWidth - .5) * 2
  mouse.y = (e.clientY / innerHeight - .5) * 2
}
if (!reduceMotion) window.addEventListener('mousemove', onMouse, { passive: true })

const sway = { x: 0, y: 0 }
let travel = 0 // 0 = haut de page, 1 = fond — la caméra plonge
let last = performance.now()

function scrollProgress() {
  const max = document.documentElement.scrollHeight - innerHeight
  return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
}

const { onRender } = useLoop()
onRender(({ camera }) => {
  const cam3 = camera.value
  if (!cam3) return
  const now = performance.now()
  const dt = Math.min(.05, (now - last) / 1000)
  const t = now / 1000
  last = now

  if (reduceMotion) return

  for (const snow of [snowFar, snowNear]) {
    const p = snow.positions
    for (let i = 0; i < p.length / 3; i++) {
      const depth = (p[i * 3 + 2] + 12) / 14
      p[i * 3] += Math.sin(t * .8 + snow.phase[i]) * .4 * dt
      p[i * 3 + 1] -= snow.speed[i] * (.35 + depth * .9) * dt
      if (p[i * 3 + 1] < -snow.RANGE_Y) p[i * 3 + 1] = snow.RANGE_Y
      if (p[i * 3] < -snow.RANGE_X) p[i * 3] = snow.RANGE_X
      if (p[i * 3] > snow.RANGE_X) p[i * 3] = -snow.RANGE_X
    }
    snow.geometry.attributes.position.needsUpdate = true
  }

  const ep = emberPos
  for (let i = 0; i < EMBER_COUNT; i++) {
    ep[i * 3] += Math.sin(t * .6 + emberPhase[i]) * .35 * dt
    ep[i * 3 + 1] += emberSpeed[i] * dt
    if (ep[i * 3 + 1] > 5) ep[i * 3 + 1] = -7
  }
  emberGeo.attributes.position.needsUpdate = true
  emberMat.opacity = .75 + Math.sin(t * 1.7) * .2

  // caméra vivante : parallaxe souris forte + dérive autonome
  sway.x += (mouse.x * 1.3 - sway.x) * dt * 2.4
  sway.y += (mouse.y * .8 - sway.y) * dt * 2.4

  // camera travel : scroller, c'est plonger dans la nuit
  travel += (scrollProgress() - travel) * Math.min(1, dt * 3.2)
  const dive = travel * 5.5 // z : 9 → 3.5, on traverse la neige

  cam3.position.x = sway.x + Math.sin(t * .11) * .7
  cam3.position.y = -sway.y + Math.sin(t * .07) * .3 - travel * 1.2
  cam3.position.z = 9 - dive
  cam3.lookAt(sway.x * .4, .2 - travel * 1.5, -6)
  cam3.rotateZ(sway.x * .04) // léger roulis après le lookAt — sensation de vol

  // la lune s'éloigne quand on plonge — la parallaxe vend la profondeur
  moon.position.x = 5.5 - sway.x * 1.8
  moon.position.y = 3 + sway.y * .9
})

onBeforeUnmount(() => {
  if (!reduceMotion) window.removeEventListener('mousemove', onMouse)
  for (const s of [snowFar, snowNear]) {
    s.geometry.dispose()
    ;(s.points.material as THREE.PointsMaterial).map?.dispose()
    ;(s.points.material as THREE.PointsMaterial).dispose()
  }
  emberGeo.dispose()
  emberMat.map?.dispose()
  emberMat.dispose()
  moonMat.map?.dispose()
  moonMat.dispose()
})
</script>

<template>
  <primitive :object="snowFar.points" />
  <primitive :object="snowNear.points" />
  <primitive :object="embers" />
  <primitive :object="moon" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits<{ unlocked: [] }>()

const HOLD_MS = 1500
const FLASH_MS = 550

const holding = ref(false)
const excited = ref(false)
const done = ref(false)
const progress = ref(0)

const orbitA = ref<HTMLElement>()
const orbitB = ref<HTMLElement>()

let raf = 0
let holdStart = 0
let flashTimer: number | undefined
const orbitAnims: Animation[] = []

const active = computed(() => holding.value || done.value)
const pull = computed(() => (holding.value ? progress.value / 100 : 0))

// L0 — glow: brightness ramps and contracts as energy builds (hold only; idle/hover handled in CSS)
const glowStyle = computed(() => {
  if (!holding.value) return undefined
  const p = pull.value
  return {
    opacity: 0.24 + p * 0.6,
    transform: `scale(${1 - p * 0.3})`,
    filter: `blur(6px) brightness(${1 + p * 0.9})`,
  }
})

function syncOrbitRate() {
  const rate = done.value ? 0.4 : holding.value ? 1 + pull.value * 1.4 : excited.value ? 1.5 : 1
  orbitAnims.forEach((a) => (a.playbackRate = rate))
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (orbitA.value) orbitAnims.push(orbitA.value.animate({ transform: ['rotate(0deg)', 'rotate(360deg)'] }, { duration: 26000, iterations: Infinity }))
  if (orbitB.value) orbitAnims.push(orbitB.value.animate({ transform: ['rotate(0deg)', 'rotate(-360deg)'] }, { duration: 33000, iterations: Infinity }))
})

function startHold() {
  if (done.value || raf) return
  holding.value = true
  holdStart = performance.now()
  const tick = (now: number) => {
    progress.value = Math.min(100, ((now - holdStart) / HOLD_MS) * 100)
    syncOrbitRate()
    if (progress.value >= 100) return completeUnlock()
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function cancelHold() {
  if (done.value) return
  cancelAnimationFrame(raf)
  raf = 0
  holding.value = false
  excited.value = false
  progress.value = 0
  syncOrbitRate()
}

function completeUnlock() {
  cancelAnimationFrame(raf)
  raf = 0
  holding.value = false
  progress.value = 100
  done.value = true
  syncOrbitRate()
  navigator.vibrate?.([15, 35, 15])
  flashTimer = window.setTimeout(() => emit('unlocked'), FLASH_MS)
}

function tapFallback() {
  if (!active.value) completeUnlock()
}

function onEnter() {
  excited.value = true
  syncOrbitRate()
}

function onLeave() {
  excited.value = false
  cancelHold()
}

onBeforeUnmount(() => {
  cancelHold()
  if (flashTimer) window.clearTimeout(flashTimer)
  orbitAnims.forEach((a) => a.cancel())
})
</script>

<template>
  <button
    class="magic-seal"
    :class="{ 'is-excited': excited && !active, 'is-holding': holding, 'is-done': done }"
    :style="{ '--p': progress }"
    type="button"
    aria-label="Maintenir pour ouvrir l’aventure"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @pointerdown="startHold"
    @pointerup="cancelHold"
    @pointercancel="cancelHold"
    @click="tapFallback"
  >
    <!-- L0 · halo diffus -->
    <span class="seal-glow" :style="glowStyle" />

    <!-- L1 · orbites & poussière d'étoiles -->
    <span class="seal-orbits" :style="{ '--pull': pull }">
      <span ref="orbitA" class="orbit orbit--a"><i v-for="n in 6" :key="`a${n}`" /></span>
      <span ref="orbitB" class="orbit orbit--b"><i v-for="n in 5" :key="`b${n}`" /></span>
      <i v-for="n in 3" :key="`m${n}`" class="mote" />
    </span>

    <!-- L2 · anneau de progression + comète -->
    <span class="seal-ring" />
    <span class="seal-comet" />

    <!-- L3 · empreinte & éclats -->
    <span class="seal-core">
      <i class="seal-fingerprint mdi mdi-fingerprint" aria-hidden="true"></i>
    </span>
    <span class="seal-flare seal-flare--l" />
    <span class="seal-flare seal-flare--r" />

    <!-- Unlock · flash, onde de choc, pluie de particules -->
    <template v-if="done">
      <span class="seal-flash" />
      <span class="seal-shock" />
      <span class="seal-burst"><i v-for="n in 12" :key="n" /></span>
    </template>
  </button>
</template>

<style scoped>
.magic-seal  {
  --mg1:#ffd700;
  --mg2:#ffa500;
  --mg3:#fff2a1;
  position:relative;
  display:grid;
  place-items:center;
  width:86px;
  height:86px;
  border:0;
  border-radius:50%;
  background:transparent;
  color:var(--color-forest);
  cursor:pointer;
  isolation:isolate;
  -webkit-tap-highlight-color:transparent;
  user-select:none;
  -webkit-user-select:none;
  touch-action:none;
}

.magic-seal:focus-visible  {
  outline:2px solid #fff;
  outline-offset:5px
}

.magic-seal>span  {
  position:absolute;
  inset:0;
  border-radius:50%;
  pointer-events:none
}

/* ---- L0 · halo ---- */ .seal-glow  {
  inset:-32%;
  background:radial-gradient(circle,rgba(255,215,0,.55) 0%,rgba(255,165,0,.26) 42%,transparent 68%);
  filter:blur(6px);
  mix-blend-mode:screen;
  opacity:.18;
  transition:opacity .45s ease,transform .45s ease,filter .45s ease;
  animation:glow-breathe 3.6s ease-in-out infinite;
}

.is-excited .seal-glow  {
  animation:none;
  opacity:.55;
  transform:scale(.93);
  filter:blur(5px) brightness(1.25)
}

.is-holding .seal-glow,.is-done .seal-glow  {
  animation:none;
  transition:none
}

.is-done .seal-glow  {
  opacity:0;
  transform:scale(1.4);
  transition:opacity .3s,transform .3s
}

@keyframes glow-breathe  {
  0%,100%  {
    opacity:.15;
    transform:scale(1)
  }
  50%  {
    opacity:.3;
    transform:scale(1.05)
  }
}

/* ---- L1 · orbites & particules ---- */ .seal-orbits  {
  inset:0;
  transform:scale(calc(1 - var(--pull)*.35));
  transition:transform .3s ease
}

.is-holding .seal-orbits  {
  transition:none
}

.is-done .seal-orbits  {
  opacity:0;
  transition:opacity .15s
}

.orbit  {
  position:absolute;
  border-radius:50%
}

.orbit--a  {
  inset:-9px;
  border:1px solid rgba(var(--rgb-seal),.3);
  --r:52px
}

.orbit--b  {
  inset:-16px;
  border:1px dashed rgba(var(--rgb-seal),.22);
  --r:59px
}

.orbit i  {
  position:absolute;
  left:50%;
  top:50%;
  width:3px;
  height:3px;
  margin:-1.5px;
  border-radius:50%;
  background:var(--mg3);
  box-shadow:0 0 5px var(--mg1);
  transform:rotate(var(--a)) translateX(calc(var(--r)*(1 - var(--pull)))) scale(calc(1 - var(--pull)*.6));
  animation:twinkle 1.1s linear infinite alternate;
  animation-delay:var(--d,0s);
}

.is-holding .orbit i  {
  animation-duration:.45s
}

.orbit--a i:nth-child(1)  {
  --a:0deg;
  --d:0s
}

.orbit--a i:nth-child(2)  {
  --a:60deg;
  --d:.18s;
  width:2px;
  height:2px
}

.orbit--a i:nth-child(3)  {
  --a:120deg;
  --d:.5s
}

.orbit--a i:nth-child(4)  {
  --a:180deg;
  --d:.3s;
  width:4px;
  height:4px
}

.orbit--a i:nth-child(5)  {
  --a:240deg;
  --d:.7s
}

.orbit--a i:nth-child(6)  {
  --a:300deg;
  --d:.12s;
  width:2px;
  height:2px
}

.orbit--b i:nth-child(1)  {
  --a:20deg;
  --d:.4s;
  width:2px;
  height:2px
}

.orbit--b i:nth-child(2)  {
  --a:92deg;
  --d:.9s
}

.orbit--b i:nth-child(3)  {
  --a:164deg;
  --d:.22s;
  width:4px;
  height:4px
}

.orbit--b i:nth-child(4)  {
  --a:236deg;
  --d:.6s;
  width:2px;
  height:2px
}

.orbit--b i:nth-child(5)  {
  --a:308deg;
  --d:.8s
}

@keyframes twinkle  {
  from  {
    opacity:.25
  }
  to  {
    opacity:1
  }
}

/* poussière qui s'échappe vers le haut */ .mote {
  position:absolute;
  left:50%;
  top:62%;
  width:2px;
  height:2px;
  border-radius:50%;
  background:var(--mg3);
  box-shadow:0 0 4px var(--mg1);
  opacity:0;
  animation:mote-rise 2.8s ease-out infinite
}

.mote:nth-of-type(1) {
  margin-left:-26px;
  animation-delay:.4s
}

.mote:nth-of-type(2) {
  margin-left:8px;
  animation-delay:1.5s
}

.mote:nth-of-type(3) {
  margin-left:22px;
  animation-delay:2.3s
}

.is-done .mote {
  opacity:0;
  animation:none
}

@keyframes mote-rise {
  0% {
    opacity:0;
    transform:translateY(6px)
  }
  25% {
    opacity:.8
  }
  100% {
    opacity:0;
    transform:translateY(-34px)
  }
}

/* ---- L2 · anneau de progression ---- */ .seal-ring {
  inset:0;
  background:conic-gradient(var(--mg1) calc(var(--p)*1%),rgba(var(--rgb-seal),.22) 0);
  mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px));
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px));
}

.is-holding .seal-ring {
  filter:drop-shadow(0 0 5px rgba(255,215,0,.9))
}

.is-done .seal-ring {
  opacity:0;
  transition:opacity .15s
}

.seal-comet {
  inset:0;
  opacity:0;
  transform:rotate(calc(var(--p)*3.6deg))
}

.is-holding .seal-comet {
  opacity:1
}

.is-done .seal-comet {
  opacity:0;
  transition:opacity .15s
}

.seal-comet::before {
  content:'';
  position:absolute;
  left:50%;
  top:-3px;
  width:9px;
  height:9px;
  margin-left:-4.5px;
  border-radius:50%;
  background:#fff;
  box-shadow:0 0 10px 4px rgba(255,242,161,.95)
}

/* ---- L3 · empreinte ---- */ .seal-core {
  margin:auto;
  display:grid;
  place-items:center;
  width:68px;
  height:68px;
  background:radial-gradient(circle at 38% 30%,#1e4d40,#0e2a22 72%);
  box-shadow:inset 0 0 0 1px rgba(var(--rgb-seal),.55),inset 0 0 14px rgba(var(--rgb-seal),.22),0 0 18px rgba(0,0,0,.35);
  transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s;
}

.seal-fingerprint {
  font-size:38px;
  line-height:1;
  color:var(--color-gold);
  filter:drop-shadow(0 0 5px rgba(241,204,122,.6));
  animation:ember 2.6s ease-in-out infinite
}

.is-excited .seal-core,.is-holding .seal-core {
  transform:scale(1.06);
  box-shadow:inset 0 0 0 1px rgba(255,242,161,.8),inset 0 0 18px rgba(var(--rgb-seal),.4),0 0 26px rgba(255,215,0,.35)
}

.is-holding .seal-fingerprint {
  animation:none;
  filter:drop-shadow(0 0 9px rgba(241,204,122,.95))
}

@keyframes ember {
  0%,100% {
    filter:drop-shadow(0 0 4px rgba(241,204,122,.5))
  }
  50% {
    filter:drop-shadow(0 0 8px rgba(241,204,122,.8))
  }
}

/* éclats latéraux */ .seal-flare {
  inset:auto;
  top:50%;
  margin-top:-15px;
  width:16px;
  height:30px;
  border-radius:50%;
  background:radial-gradient(ellipse,rgba(255,242,161,.9),transparent 70%);
  filter:blur(3px);
  mix-blend-mode:screen;
  opacity:.25;
  animation:flare-flicker 1.9s ease-in-out infinite alternate
}

.seal-flare--l {
  left:-8px
}

.seal-flare--r {
  left:auto;
  right:-8px;
  animation-delay:.95s
}

.is-excited .seal-flare,.is-holding .seal-flare {
  opacity:.8
}

.is-done .seal-flare {
  opacity:0
}

@keyframes flare-flicker {
  from {
    transform:scaleY(.7);
    opacity:.18
  }
  to {
    transform:scaleY(1.15);
    opacity:.55
  }
}

/* ---- Unlock · explosion ---- */ .is-done .seal-core {
  animation:core-pop .35s cubic-bezier(.2,.8,.2,1) forwards
}

.is-done .seal-fingerprint {
  opacity:0;
  animation:none;
  transition:opacity .12s
}

@keyframes core-pop {
  0% {
    transform:scale(1.05)
  }
  40% {
    transform:scale(1.28);
    background:#fff2a1
  }
  100% {
    transform:scale(1.15);
    background:#fff2a1;
    box-shadow:0 0 40px rgba(255,215,0,.9)
  }
}

.seal-flash {
  inset:-12px;
  background:radial-gradient(circle,#fff 0%,rgba(255,242,161,.85) 38%,transparent 70%);
  mix-blend-mode:screen;
  opacity:0;
  animation:seal-flash .45s ease-out forwards
}

@keyframes seal-flash {
  0% {
    opacity:0;
    transform:scale(.55)
  }
  18% {
    opacity:1
  }
  100% {
    opacity:0;
    transform:scale(1.7)
  }
}

.seal-shock {
  inset:-4px;
  border:3px solid var(--mg3);
  box-shadow:0 0 18px rgba(255,215,0,.8);
  opacity:0;
  mix-blend-mode:screen;
  animation:seal-shock .55s cubic-bezier(.2,.7,.3,1) forwards
}

@keyframes seal-shock {
  0% {
    opacity:.95;
    transform:scale(.7)
  }
  100% {
    opacity:0;
    transform:scale(3)
  }
}

.seal-burst {
  inset:0
}

.seal-burst i {
  position:absolute;
  left:50%;
  top:50%;
  width:4px;
  height:4px;
  margin:-2px;
  border-radius:50%;
  background:var(--mg3);
  box-shadow:0 0 6px var(--mg1);
  opacity:0;
  animation:seal-burst .8s cubic-bezier(.15,.6,.3,1) forwards;
  animation-delay:var(--bd-delay,0s)
}

.seal-burst i:nth-child(1) {
  --ba:8deg;
  --bd:96px;
  --bd-delay:.02s
}

.seal-burst i:nth-child(2) {
  --ba:38deg;
  --bd:64px
}

.seal-burst i:nth-child(3) {
  --ba:67deg;
  --bd:110px;
  --bd-delay:.05s;
  width:3px;
  height:3px
}

.seal-burst i:nth-child(4) {
  --ba:99deg;
  --bd:78px
}

.seal-burst i:nth-child(5) {
  --ba:131deg;
  --bd:105px;
  --bd-delay:.03s
}

.seal-burst i:nth-child(6) {
  --ba:163deg;
  --bd:70px;
  width:3px;
  height:3px
}

.seal-burst i:nth-child(7) {
  --ba:194deg;
  --bd:98px;
  --bd-delay:.06s
}

.seal-burst i:nth-child(8) {
  --ba:226deg;
  --bd:60px
}

.seal-burst i:nth-child(9) {
  --ba:258deg;
  --bd:108px;
  --bd-delay:.04s;
  width:3px;
  height:3px
}

.seal-burst i:nth-child(10) {
  --ba:289deg;
  --bd:74px
}

.seal-burst i:nth-child(11) {
  --ba:321deg;
  --bd:102px;
  --bd-delay:.07s
}

.seal-burst i:nth-child(12) {
  --ba:349deg;
  --bd:66px;
  width:3px;
  height:3px
}

@keyframes seal-burst {
  0% {
    opacity:1;
    transform:rotate(var(--ba)) translateX(8px) scale(1)
  }
  70% {
    opacity:1
  }
  100% {
    opacity:0;
    transform:translateY(16px) rotate(var(--ba)) translateX(var(--bd)) scale(.25)
  }
}

@media (prefers-reduced-motion:reduce) {
  .magic-seal *,.magic-seal::before,.magic-seal::after {
    animation:none!important
  }
  .seal-glow {
    opacity:.25
  }
}

</style>

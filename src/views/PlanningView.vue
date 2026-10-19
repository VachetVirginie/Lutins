<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentAdventure, narrativeMilestones } from '../data/adventure'
import { useIsDesktop } from '../composables/useBreakpoints'
import DesktopPlanning from './planning/DesktopPlanning.vue'
import { haptic } from '../utils/haptics'

const isDesktop = useIsDesktop()

const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/home')
}

const CURRENT = currentAdventure.currentDay
const TOTAL = currentAdventure.totalDays
const ROW_H = 86
const MAP_H = TOTAL * ROW_H + 110

const milestoneByDay = new Map<number, (typeof narrativeMilestones.value)[number]>(narrativeMilestones.value.map((m) => [m.day as number, m]))

/* chaque jalon porte l'emblème de son chapitre */
const PHASE_ICON: Record<string, string> = {
  voyage: 'mdi-mailbox-open-outline',
  arrivee: 'mdi-door-open',
  farce: 'mdi-emoticon-wink-outline',
  depart: 'mdi-exit-to-app',
  conclusion: 'mdi-ornament',
}

const stops = Array.from({ length: TOTAL }, (_, i) => {
  const day = i + 1
  const milestone = milestoneByDay.get(day)
  return {
    day,
    x: i % 2 === 0 ? 26 : 74,
    y: i * ROW_H + 96,
    title: milestone?.title,
    detail: milestone?.detail,
    milestone: Boolean(milestone),
    icon: milestone ? PHASE_ICON[milestone.phase] : null,
    state: day < CURRENT ? 'past' : day === CURRENT ? 'current' : 'future',
  }
})

function trailSegment(fromIdx: number, toIdx: number): string {
  let d = `M ${stops[fromIdx].x} ${stops[fromIdx].y}`
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    const p = stops[i - 1]
    const c = stops[i]
    const mid = (p.y + c.y) / 2
    d += ` C ${p.x} ${mid}, ${c.x} ${mid}, ${c.x} ${c.y}`
  }
  return d
}

const pastPath = computed(() => trailSegment(0, Math.max(CURRENT - 1, 0)))
const futurePath = computed(() => trailSegment(Math.max(CURRENT - 1, 0), TOTAL - 1))

/* ---- paysage de fond : la vallée de nuit glisse au fil du scroll ---- */

// Parallaxe douce : l'image descend du château vers la lanterne (transform → compositeur)
const landscapeEl = ref<HTMLElement>()
let raf = 0

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    if (landscapeEl.value) landscapeEl.value.style.transform = `translate3d(0, ${-Math.min(140, window.scrollY * 0.025)}px, 0)`
  })
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <DesktopPlanning v-if="isDesktop" />
  <main v-else class="app-screen planning-screen">
    <div class="planning-bg" aria-hidden="true"><img ref="landscapeEl" src="/assets/landscapes/journey-map.jpg" alt="" /></div>
    <header class="planning-header"><button class="back-link" type="button" @click="goBack"><i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour</button><p class="planning-overline">LA CARTE DU VOYAGE</p><h1>Le planning</h1><p>La route des lutins, du premier courrier jusqu’au retour au Pôle Nord.</p></header>
    <section class="planning-progress"><div><strong>Jour {{ CURRENT }}</strong><span>sur {{ TOTAL }}</span></div><div class="planning-progress-bar"><i :style="{ width: (CURRENT / TOTAL) * 100 + '%' }" /></div><small>Le voyage commence</small></section>

    <section class="map" :style="{ height: MAP_H + 'px' }" aria-label="Carte des 70 jours">
      <svg class="map-svg" :viewBox="`0 0 100 ${MAP_H}`" preserveAspectRatio="none" aria-hidden="true">
        <path class="trail-future" :d="futurePath" vector-effect="non-scaling-stroke" />
        <path class="trail-past" :d="pastPath" vector-effect="non-scaling-stroke" />
      </svg>

      <div class="map-fog" :style="{ top: stops[CURRENT - 1].y + 'px' }" aria-hidden="true" />

      <RouterLink
        v-for="s in stops"
        :key="s.day"
        class="map-stop"
        :class="[s.state, { milestone: s.milestone, 'on-left': s.x < 50 }]"
        :style="{ left: s.x + '%', top: s.y + 'px' }"
        :to="`/activites/jour-${s.day}`"
        @click="haptic(8)"
      >
        <span class="stop-dot"><i v-if="s.icon" class="mdi" :class="s.icon" aria-hidden="true" /></span>
        <span class="stop-card">
          <span class="stop-day">J{{ s.day }}</span>
          <strong v-if="s.title">{{ s.title }}</strong>
          <small v-if="s.detail">{{ s.detail }}</small>
          <span v-if="s.state === 'current'" class="stop-cta">Ouvrir la journée<i class="mdi mdi-chevron-right" aria-hidden="true" /></span>
        </span>
        <img v-if="s.state === 'current'" class="stop-elf" src="/assets/imgs/lutin.png" alt="" aria-hidden="true" />
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.planning-header {
  padding-top:4px
}

.back-link {
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:0;
  border:0;
  background:none;
  color:var(--color-gold);
  font-family:inherit;
  font-size:12px;
  cursor:pointer;
  text-decoration:none
}

.planning-overline {
  margin:28px 0 0;
  color:var(--color-gold);
  font-size:9px;
  font-weight:700;
  letter-spacing:.18em
}

.planning-header h1 {
  margin:8px 0;
  color:#f8f0dd;
  font:500 38px/.95 var(--font-serif)
}

.planning-header>p:last-child {
  max-width:320px;
  margin:0;
  color:#a9bcae;
  font-size:14px;
  line-height:1.5
}

.planning-progress {
  margin:27px 0 10px;
  padding:17px 0;
  border-top:1px solid #ffffff1f;
  border-bottom:1px solid #ffffff1f
}

.planning-progress>div:first-child {
  display:flex;
  align-items:baseline;
  gap:6px
}

.planning-progress strong {
  font:500 24px var(--font-serif);
  color:#f5edd9
}

.planning-progress span,.planning-progress small {
  color:#a9bcae;
  font-size:11px
}

.planning-progress-bar {
  height:4px;
  margin:10px 0 7px;
  background:#ffffff1c;
  border-radius:4px;
  overflow:hidden
}

.planning-progress-bar i {
  display:block;
  height:100%;
  background:linear-gradient(90deg,#ffd700,#ffe9a8);
  border-radius:4px;
  box-shadow:0 0 8px rgba(255,215,0,.5);
  animation:bar-grow 1.1s cubic-bezier(.65,0,.2,1) .25s both
}

@keyframes bar-grow {
  from {
    width:0
  }
}

/* ---- carte au trésor ---- */
.map {
  position:relative;
  margin-top:10px;
  isolation:isolate;
  overflow:hidden;
  border-radius:26px;
  background:linear-gradient(180deg,rgba(10,28,21,.18),rgba(7,20,14,.68));
  box-shadow:inset 0 1px 0 rgba(255,244,214,.08),0 18px 38px rgba(0,0,0,.2)
}

/* vignette latérale : assombrit les bords par-dessus le paysage */
.map::before {
  content:'';
  position:absolute;
  inset:0;
  z-index:1;
  pointer-events:none;
  background:linear-gradient(90deg,rgba(7,20,14,.54),transparent 28%,transparent 72%,rgba(7,20,14,.54))
}

/* la vallée de nuit en fond fixe : le parchemin défile par-dessus */
.planning-bg {
  position:fixed;
  inset:0;
  z-index:0;
  overflow:hidden;
  pointer-events:none
}

.planning-bg img {
  width:100%;
  height:118%;
  object-fit:cover;
  object-position:center top;
  opacity:.55;
  will-change:transform
}

.planning-screen > *:not(.planning-bg) {
  position:relative;
  z-index:1
}

.map-svg {
  position:absolute;
  z-index:1;
  inset:0;
  width:100%;
  height:100%
}

.trail-future {
  fill:none;
  stroke:rgba(255,255,255,.2);
  stroke-width:2;
  stroke-linecap:round;
  stroke-dasharray:6 6
}

/* le sentier déjà parcouru : fil d'or plein et lumineux */
.trail-past {
  fill:none;
  stroke:#e6c280;
  stroke-width:3;
  stroke-linecap:round;
  filter:drop-shadow(0 0 6px rgba(230,194,128,.8))
}

/* brouillard de guerre sur les jours à venir : flou progressif + voile */
.map-fog {
  position:absolute;
  z-index:3;
  right:-30px;
  bottom:0;
  left:-30px;
  background:linear-gradient(180deg,rgba(180,210,215,0) 0,rgba(170,205,215,.09) 18%,rgba(175,210,220,.17) 60%,rgba(185,215,225,.24) 100%);
  backdrop-filter:blur(5px);
  -webkit-backdrop-filter:blur(5px);
  mask-image:linear-gradient(180deg,transparent 0,#000 140px);
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 140px);
  pointer-events:none
}

/* la brume scintille doucement, comme de la neige en suspension */
.map-fog::after {
  content:'';
  position:absolute;
  inset:0;
  background-image:radial-gradient(circle,rgba(255,255,255,.6) 1px,transparent 1.6px);
  background-size:52px 52px;
  animation:fog-twinkle 5s ease-in-out infinite
}

@keyframes fog-twinkle {
  0%,100% {
    opacity:.07
  }
  50% {
    opacity:.2
  }
}

/* ---- étapes ---- */
.map-stop {
  position:absolute;
  z-index:2;
  display:flex;
  align-items:center;
  gap:13px;
  max-width:46%;
  text-decoration:none;
  /* le dot est ancré sur le sentier, la carte s'étend vers l'intérieur */
  transform:translate(-14px,-50%)
}

.map-stop:not(.on-left) {
  transform:translate(calc(-100% + 14px),-50%)
}

.map-stop:not(.on-left) {
  flex-direction:row-reverse;
  text-align:right
}

.stop-dot {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:22px;
  height:22px;
  border:2px solid rgba(230,194,128,.45);
  border-radius:50%;
  background:rgba(10,28,20,.85);
  color:rgba(230,194,128,.6);
  font-size:11px;
  box-shadow:0 0 8px rgba(230,194,128,.18)
}

.stop-card {
  display:grid;
  gap:2px;
  max-width:184px;
  padding:9px 12px;
  border:1px solid rgba(230,194,128,.3);
  border-radius:16px;
  background:rgba(15,35,26,.88);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  box-shadow:0 8px 24px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,244,214,.05);
  transition:filter .3s,opacity .3s,transform .35s var(--spring)
}

/* le numéro du jour en petit badge d'or */
.stop-day {
  justify-self:start;
  padding:2px 8px;
  border:1px solid rgba(230,194,128,.5);
  border-radius:999px;
  color:#e6c280;
  font-size:9px;
  font-weight:800;
  letter-spacing:.1em
}

.map-stop:not(.on-left) .stop-day {
  justify-self:end
}

.map-stop:active .stop-card {
  transform:scale(.95)
}

.stop-card strong {
  color:#f5edd9;
  font-size:12px;
  font-weight:600;
  line-height:1.3
}

.stop-card small {
  color:#a9bcae;
  font-size:10px;
  line-height:1.35
}

/* jours passés : illuminés */
.map-stop.past .stop-dot {
  border-color:#e6c280;
  background:#e6c280;
  color:#173b32;
  box-shadow:0 0 10px rgba(230,194,128,.6)
}

.map-stop.past .stop-card {
  border-color:rgba(230,194,128,.3);
  background:rgba(230,194,128,.08)
}

.map-stop.past .stop-card strong {
  color:#ffe9a8
}

/* jour courant : halo + lutin */
.map-stop.current .stop-dot {
  width:30px;
  height:30px;
  border-color:#ffe9a8;
  background:radial-gradient(circle,#fff3d1,#e6c280);
  box-shadow:0 0 18px rgba(255,215,0,.8),0 0 44px rgba(255,215,0,.35);
  animation:node-pulse 2.8s ease-in-out infinite
}

@keyframes node-pulse {
  0%,100% {
    box-shadow:0 0 18px rgba(255,215,0,.8),0 0 44px rgba(255,215,0,.35);
    transform:scale(1)
  }
  50% {
    box-shadow:0 0 24px rgba(255,230,160,1),0 0 56px rgba(255,215,0,.5);
    transform:scale(1.07)
  }
}

.map-stop.current .stop-card {
  border-color:rgba(255,233,168,.45);
  background:rgba(230,194,128,.12)
}

.map-stop.current .stop-card strong {
  color:#ffe9a8
}

/* pilule dorée d'action dans la bulle active */
.stop-cta {
  display:inline-flex;
  align-items:center;
  justify-self:start;
  margin-top:7px;
  padding:7px 12px;
  border-radius:999px;
  background:linear-gradient(135deg,#e6c280,#d4af37);
  color:#0a1c14;
  font-size:10px;
  font-weight:800;
  letter-spacing:.03em;
  box-shadow:0 4px 12px rgba(230,194,128,.35);
  transition:transform .15s cubic-bezier(.34,1.56,.64,1)
}

.map-stop:active .stop-cta {
  transform:scale(.95)
}

.map-stop:not(.on-left) .stop-cta {
  justify-self:end
}

.map-stop:not(.on-left) .stop-cta {
  justify-self:end
}

.stop-cta i {
  margin-left:2px;
  font-size:14px
}

/* étincelles de lanterne autour du lutin */
.map-stop.current::after {
  content:'';
  position:absolute;
  bottom:calc(50% + 4px);
  left:14px;
  width:74px;
  height:64px;
  margin-left:-37px;
  background-image:
    radial-gradient(circle,#ffe9a8 1.6px,transparent 2.2px),
    radial-gradient(circle,#ffe9a8 1.2px,transparent 1.8px),
    radial-gradient(circle,#ffd97a 1px,transparent 1.6px);
  background-position:18% 34%,80% 16%,54% 6%;
  background-repeat:no-repeat;
  animation:elf-glint 3.4s ease-in-out infinite;
  pointer-events:none
}

@keyframes elf-glint {
  0%,100% {
    opacity:.25
  }
  50% {
    opacity:.9
  }
}

.map-stop:not(.on-left)::after {
  left:auto;
  right:14px;
  margin-left:0;
  margin-right:-37px
}

/* le lutin se tient sur le jalon actif, pas au-dessus de la carte */
.stop-elf {
  --ex:-50%;
  position:absolute;
  bottom:calc(50% + 12px);
  left:14px;
  width:44px;
  transform:translateX(var(--ex));
  transform-origin:50% 100%;
  z-index:1;
  filter:drop-shadow(0 4px 10px rgba(0,0,0,.5)) drop-shadow(0 0 14px rgba(255,215,0,.4));
  pointer-events:none;
  animation:elf-sway 5s ease-in-out infinite
}

.map-stop:not(.on-left) .stop-elf {
  --ex:50%;
  left:auto;
  right:14px
}

@keyframes elf-sway {
  0%,100% {
    transform:translateX(var(--ex)) rotate(-1.6deg) translateY(0)
  }
  50% {
    transform:translateX(var(--ex)) rotate(1.6deg) translateY(-2px)
  }
}

/* jours futurs : la brume seule les voile — pas de double flou */
.map-stop.future .stop-card {
  opacity:.8
}

.map-stop.future .stop-dot {
  opacity:.75
}

/* jalons : repères plus grands */
.map-stop.milestone .stop-dot {
  width:28px;
  height:28px;
  border-width:1.5px
}


@media (min-width:1100px) {
  .planning-header,.planning-progress,.map {
    max-width:840px;
    margin-inline:auto
  }
}

@media (prefers-reduced-motion:reduce) {
  .stop-elf,.map-stop.current .stop-dot,.map-stop.current::after,.map-fog::after,.planning-progress-bar i {
    animation:none
  }
}

.back-link:focus-visible,.map-stop:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px;
  border-radius:8px
}
</style>

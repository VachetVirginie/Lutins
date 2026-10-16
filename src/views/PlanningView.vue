<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentAdventure, narrativeMilestones } from '../data/adventure'

const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/home')
}

const CURRENT = currentAdventure.currentDay
const TOTAL = currentAdventure.totalDays
const ROW_H = 86
const MAP_H = TOTAL * ROW_H + 60

const milestoneByDay = new Map<number, (typeof narrativeMilestones)[number]>(narrativeMilestones.map((m) => [m.day as number, m]))

const stops = Array.from({ length: TOTAL }, (_, i) => {
  const day = i + 1
  const milestone = milestoneByDay.get(day)
  return {
    day,
    x: i % 2 === 0 ? 26 : 74,
    y: i * ROW_H + 60,
    title: milestone?.title,
    detail: milestone?.detail,
    milestone: Boolean(milestone),
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
</script>

<template>
  <main class="app-screen planning-screen">
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
      >
        <span class="stop-dot"><i v-if="s.milestone" class="mdi mdi-pine-tree" aria-hidden="true" /></span>
        <span class="stop-card">
          <strong>J{{ s.day }}<template v-if="s.title"> · {{ s.title }}</template></strong>
          <small v-if="s.detail">{{ s.detail }}</small>
        </span>
        <img v-if="s.state === 'current'" class="stop-elf" src="/assets/imgs/lutin.png" alt="" aria-hidden="true" />
      </RouterLink>
    </section>

    <p class="planning-note">Chaque relais s’illumine au fil des jours. Touchez une étape pour ouvrir sa fiche.</p>
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
  box-shadow:0 0 8px rgba(255,215,0,.5)
}

/* ---- carte au trésor ---- */
.map {
  position:relative;
  margin-top:10px
}

.map-svg {
  position:absolute;
  inset:0;
  width:100%;
  height:100%
}

.trail-future {
  fill:none;
  stroke:rgba(190,180,140,.28);
  stroke-width:3.5;
  stroke-linecap:round;
  stroke-dasharray:.5 7
}

.trail-past {
  fill:none;
  stroke:#e6c280;
  stroke-width:4;
  stroke-linecap:round;
  stroke-dasharray:.5 7;
  filter:drop-shadow(0 0 6px rgba(255,215,0,.55))
}

/* brouillard de guerre sur les jours à venir */
.map-fog {
  position:absolute;
  right:-30px;
  bottom:0;
  left:-30px;
  background:linear-gradient(180deg,rgba(180,210,215,0) 0,rgba(170,205,215,.09) 18%,rgba(175,210,220,.17) 60%,rgba(185,215,225,.24) 100%);
  pointer-events:none
}

/* ---- étapes ---- */
.map-stop {
  position:absolute;
  z-index:2;
  display:flex;
  align-items:center;
  gap:9px;
  max-width:46%;
  text-decoration:none;
  transform:translate(-50%,-50%)
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
  border:2px solid rgba(190,180,140,.4);
  border-radius:50%;
  background:#0e241d;
  color:rgba(190,180,140,.6);
  font-size:11px
}

.stop-card {
  display:grid;
  gap:2px;
  padding:8px 12px;
  border:1px solid rgba(255,255,255,.1);
  border-radius:14px;
  background:rgba(255,255,255,.05);
  backdrop-filter:blur(10px);
  transition:filter .3s,opacity .3s,transform .35s var(--spring)
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
  background:radial-gradient(circle,#ffe9a8,#e6c280);
  box-shadow:0 0 18px rgba(255,215,0,.8),0 0 44px rgba(255,215,0,.35)
}

.map-stop.current .stop-card {
  border-color:rgba(255,233,168,.45);
  background:rgba(230,194,128,.12)
}

.map-stop.current .stop-card strong {
  color:#ffe9a8
}

.stop-elf {
  position:absolute;
  bottom:calc(100% + 12px);
  left:50%;
  width:44px;
  transform:translateX(-50%);
  filter:drop-shadow(0 4px 10px rgba(0,0,0,.5)) drop-shadow(0 0 14px rgba(255,215,0,.4));
  pointer-events:none
}

/* jours futurs : sous la brume */
.map-stop.future .stop-card {
  opacity:.45;
  filter:blur(1.6px) saturate(.7)
}

.map-stop.future .stop-dot {
  opacity:.6
}

/* jalons : repères plus grands */
.map-stop.milestone .stop-dot {
  width:28px;
  height:28px;
  border-width:1.5px
}

.planning-note {
  margin:26px 0 0;
  color:#718a7b;
  font-size:11px;
  font-style:italic;
  font-family:var(--font-literary);
  line-height:1.5
}

.back-link:focus-visible,.map-stop:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px;
  border-radius:8px
}
</style>

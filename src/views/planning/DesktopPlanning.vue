<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentAdventure, journeyMilestones } from '../../data/adventure'
import { sheetForDay } from '../../data/farces'

/**
 * « L'Atlas du Voyage » — la carte desktop n'est plus un serpentin
 * vertical : le récit se lit chapitre par chapitre, chaque chapitre
 * est un paysage traversé par un sentier organique. Les haltes
 * éditoriales (jalons) sont des cartes, les jours des lanternes.
 */
const router = useRouter()
const current = computed(() => currentAdventure.currentDay)
const total = computed(() => currentAdventure.totalDays)
const milestones = journeyMilestones

/* ---------- les chapitres, découpés sur les jalons ---------- */
interface Chapter {
  roman: string
  label: string
  from: number
  to: number
  decor: 'pole' | 'foret' | 'village' | 'lyon' | 'noel'
  phase: string
  visual: string
}

// un chapitre par jalon : la phase du jalon porte la sémantique,
// sans second lutin les chapitres « farce »/« départ » n'existent pas
const PHASE_META: Record<string, { label: string; decor: Chapter['decor'] }> = {
  voyage: { label: 'Le voyage', decor: 'pole' },
  arrivee: { label: 'Un lutin parmi vous', decor: 'foret' },
  farce: { label: 'Les deux lutins', decor: 'village' },
  depart: { label: 'Le dernier voyage', decor: 'lyon' },
  conclusion: { label: 'La lettre du Père Noël', decor: 'noel' },
}
const PHASE_VISUAL: Record<string, string> = {
  voyage: '/assets/visuels/planning/01-voyage.png',
  arrivee: '/assets/visuels/planning/02-arrivee.png',
  farce: '/assets/visuels/planning/03-farces.png',
  depart: '/assets/visuels/planning/04-depart.png',
  conclusion: '/assets/visuels/planning/05-conclusion.png',
}
const ROMANS = ['I', 'II', 'III', 'IV', 'V']

const chapters = computed<Chapter[]>(() => {
  const ms = milestones.value
  return ms
    .map((m, i) => ({
      roman: ROMANS[i],
      ...PHASE_META[m.phase],
      phase: m.phase,
      visual: PHASE_VISUAL[m.phase],
      from: m.day,
      to: (ms[i + 1]?.day ?? total.value + 1) - 1,
    }))
    .filter((c) => c.from <= c.to)
})

// le chapitre ouvert = celui du jour courant
const currentChapterIdx = computed(() => {
  const idx = chapters.value.findIndex((c) => current.value >= c.from && current.value <= c.to)
  return Math.max(0, idx)
})
const openIdx = ref(currentChapterIdx.value)
const chapter = computed(() => chapters.value[openIdx.value])

function chapterState(c: Chapter) {
  return c.to < current.value ? 'done' : c.from <= current.value ? 'active' : 'upcoming'
}

/* ---------- le sentier : courbe organique à travers le paysage ---------- */
const PW = 1200
const PH = 380

// t paramétré 0→1 → position sur le sentier (serpente horizontalement, 2 vallées)
function pathPoint(t: number) {
  const x = 60 + t * (PW - 120)
  const y = PH * .5 + Math.sin(t * Math.PI * 2.4) * 105 + Math.sin(t * Math.PI * 5.2 + 1) * 26
  return { x, y }
}

function trailPath() {
  let d = ''
  for (let i = 0; i <= 80; i++) {
    const p = pathPoint(i / 80)
    d += `${d ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }
  return d
}
const trail = computed(trailPath)

const stops = computed(() => {
  if (!chapter.value) return []
  const { from, to } = chapter.value
  const n = to - from
  const mileByDay = new Map(milestones.value.map((m) => [m.day, m]))
  return Array.from({ length: n + 1 }, (_, i) => {
    const day = from + i
    const t = n === 0 ? .5 : .05 + (i / n) * .9
    const p = pathPoint(t)
    const milestone = mileByDay.get(day)
    return {
      day,
      ...p,
      milestone,
      title: milestone?.title ?? sheetForDay(day)?.title,
      state: day < current.value ? 'past' : day === current.value ? 'current' : 'future',
    }
  })
})

// la portion du sentier déjà parcourue (en t paramétré)
const progressT = computed(() => {
  if (!chapter.value) return 0
  const { from, to } = chapter.value
  if (current.value <= from) return 0
  if (current.value > to) return 1
  return .05 + ((current.value - from) / Math.max(1, to - from)) * .9
})

// un tracé doré partiel : on redessine la courbe jusqu'au jour courant
const pastTrail = computed(() => {
  const tEnd = progressT.value
  if (tEnd <= 0) return ''
  let d = ''
  for (let i = 0; i <= Math.round(80 * tEnd); i++) {
    const p = pathPoint(i / 80)
    d += `${d ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }
  return d
})

function next() {
  if (openIdx.value < chapters.value.length - 1) openIdx.value++
}
function prev() {
  if (openIdx.value > 0) openIdx.value--
}
function open(day: number) {
  router.push(`/activites/jour-${day}`)
}
</script>

<template>
  <main class="atlas">
    <header class="atlas-head">
      <p class="atlas-over">L'ATLAS DU VOYAGE</p>
      <h1>La route des lutins</h1>
      <p class="atlas-sub">Le récit se lit chapitre par chapitre — {{ chapters.length }} actes, {{ total }} nuits.</p>
    </header>

    <div class="atlas-body">
      <!-- la table des chapitres : onglets gravés -->
      <nav class="atlas-rail" aria-label="Les chapitres">
        <button
          v-for="(c, i) in chapters" :key="c.roman"
          class="rail-tab" :class="[{ open: i === openIdx }, chapterState(c)]"
          type="button" @click="openIdx = i"
        >
          <b>{{ c.roman }}</b>
          <span class="rail-name">{{ c.label }}</span>
          <span class="rail-days">J{{ c.from }} — J{{ c.to }}</span>
        </button>
      </nav>

      <!-- le paysage du chapitre -->
      <section v-if="chapter" class="atlas-scene" :class="`decor-${chapter.decor}`" :key="chapter.roman" aria-live="polite">
        <i class="scene-sky" aria-hidden="true" />
        <i class="scene-stars" aria-hidden="true" />
        <svg class="scene-forest" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 80 L0 58 L40 58 L56 28 L72 58 L120 58 L138 36 L154 58 L220 58 L220 80 Z
                   M250 80 L250 54 L290 54 L308 22 L326 54 L380 54 L396 40 L412 54 L470 54 L470 80 Z
                   M500 80 L500 60 L552 60 L570 32 L588 60 L646 60 L662 44 L678 60 L740 60 L740 80 Z
                   M770 80 L770 52 L820 52 L836 24 L852 52 L912 52 L928 38 L944 52 L1006 52 L1006 80 Z
                   M1030 80 L1030 56 L1084 56 L1102 26 L1120 56 L1180 56 L1200 56 L1200 80 Z" />
        </svg>
        <p class="scene-chapter">CHAPITRE {{ chapter.roman }} — {{ chapter.label.toUpperCase() }}</p>

        <!-- le sentier -->
        <svg class="scene-trail" :viewBox="`0 0 ${PW} ${PH}`" aria-hidden="true">
          <path :d="trail" class="trail-line" vector-effect="non-scaling-stroke" />
          <path v-if="pastTrail" :d="pastTrail" class="trail-done" vector-effect="non-scaling-stroke" />
        </svg>

        <!-- les étapes -->
        <button
          v-for="s in stops" :key="s.day"
          class="stop" :class="[s.state, { mile: s.milestone }]"
          :style="{ left: `${(s.x / PW) * 100}%`, top: `${(s.y / PH) * 100}%` }"
          type="button"
          :aria-label="`J${s.day}${s.title ? ' · ' + s.title : ''}`"
          @click="open(s.day)"
        >
          <i class="stop-dot" />
          <span v-if="s.milestone" class="stop-card">
            <b>J{{ s.day }}</b><span> {{ s.milestone.title }}</span>
          </span>
          <span v-else class="stop-tip"><b>J{{ s.day }}</b>{{ s.title }}</span>
          <i v-if="s.state === 'current'" class="stop-halo" aria-hidden="true" />
        </button>

        <!-- la halte éditoriale du chapitre -->
        <figure v-if="chapter" class="scene-postcard">
          <img :src="chapter.visual" :alt="`Illustration : ${chapter.label}`" loading="lazy" />
          <figcaption>{{ chapter.label }}<small>J{{ chapter.from }} — J{{ chapter.to }}</small></figcaption>
        </figure>

        <!-- le passage au chapitre suivant -->
        <footer class="scene-foot">
          <button v-if="openIdx > 0" class="scene-nav" type="button" @click="prev">
            <i class="mdi mdi-chevron-left" aria-hidden="true" /> Chapitre {{ chapters[openIdx - 1].roman }}
          </button>
          <span v-else />
          <button v-if="openIdx < chapters.length - 1" class="scene-nav next" type="button" @click="next">
            Chapitre {{ chapters[openIdx + 1].roman }} — {{ chapters[openIdx + 1].label }} <i class="mdi mdi-chevron-right" aria-hidden="true" />
          </button>
        </footer>
      </section>
    </div>
  </main>
</template>

<style scoped>
.atlas {
  min-height: 100svh;
  padding: 110px 48px 60px;
  color: #f2ead8;
  background: linear-gradient(180deg, #0a1e22 0%, #0d221b 55%, #081410 100%);
}
.atlas-head {
  max-width: 1280px;
  margin: 0 auto 26px;
}
.atlas-over {
  margin: 0;
  color: var(--color-gold);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .22em;
}
.atlas-head h1 {
  margin: 10px 0 0;
  font: 500 clamp(40px, 4vw, 58px)/1 var(--font-serif);
  letter-spacing: -.02em;
}
.atlas-sub {
  margin: 12px 0 0;
  color: #a9bcae;
  font-size: 14.5px;
}

/* ---------- corps : rail des chapitres + scène ---------- */
.atlas-body {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 26px;
  max-width: 1280px;
  margin: 0 auto;
  align-items: start;
}
.atlas-rail {
  display: grid;
  gap: 8px;
  position: sticky;
  top: 110px;
}
.rail-tab {
  display: grid;
  gap: 3px;
  padding: 14px 16px;
  border: 1px solid rgba(224,194,131,.16);
  border-radius: 12px;
  background: rgba(12,26,20,.55);
  color: #a9bcae;
  text-align: left;
  cursor: pointer;
  transition: all .3s;
}
.rail-tab b {
  color: #e0c283;
  font: 600 15px var(--font-serif);
}
.rail-name { font-size: 12.5px; font-weight: 600; }
.rail-days { font-size: 10.5px; letter-spacing: .1em; opacity: .7; }
.rail-tab:hover {
  border-color: rgba(224,194,131,.45);
  transform: translateX(3px);
}
.rail-tab.open {
  border-color: rgba(224,194,131,.6);
  background: rgba(224,194,131,.09);
  color: #e8e3d5;
}
.rail-tab.done b { color: #8a9a8e; }
.rail-tab.done .rail-name { color: #8a9a8e; }

/* ---------- la scène ---------- */
.atlas-scene {
  position: relative;
  min-height: 560px;
  border: 1px solid rgba(224,194,131,.18);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,244,214,.06);
  animation: scene-in .65s cubic-bezier(.3,.9,.35,1) both;
}
@keyframes scene-in {
  from { opacity: 0; transform: translateY(18px) scale(.985); }
  to { opacity: 1; transform: none; }
}

/* le décor change avec le chapitre */
.scene-sky {
  position: absolute;
  inset: 0;
  transition: background .8s;
}
.decor-pole .scene-sky { background: linear-gradient(180deg, #12303f 0%, #0f2830 55%, #0c2028 100%); }
.decor-foret .scene-sky { background: linear-gradient(180deg, #0e2b28 0%, #0c241d 55%, #0a1c16 100%); }
.decor-village .scene-sky { background: linear-gradient(180deg, #1c2b45 0%, #142540 55%, #101e33 100%); }
.decor-lyon .scene-sky { background: linear-gradient(180deg, #2a2a3e 0%, #1e2438 55%, #141c2c 100%); }
.decor-noel .scene-sky { background: linear-gradient(180deg, #26201e 0%, #1f1a16 55%, #161310 100%); }

.scene-stars {
  position: absolute;
  inset: 0 0 40%;
  background-image:
    radial-gradient(circle, rgba(255,246,220,.7) 1px, transparent 1.5px),
    radial-gradient(circle, rgba(255,246,220,.4) 1.2px, transparent 1.8px);
  background-size: 190px 130px, 290px 210px;
  background-position: 12% 18%, 66% 8%;
  opacity: .5;
}
.scene-forest {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 34%;
  width: 100%;
  height: 70px;
  fill: rgba(5,14,10,.85);
}
.scene-chapter {
  position: absolute;
  top: 22px;
  left: 26px;
  margin: 0;
  color: rgba(224,194,131,.75);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .2em;
}

/* le sentier */
.scene-trail {
  position: absolute;
  inset: 12% 3% 22%;
  width: 94%;
  height: 66%;
}
.trail-line {
  fill: none;
  stroke: rgba(233,220,187,.16);
  stroke-width: 1.6;
  stroke-dasharray: 2 8;
  stroke-linecap: round;
}
.trail-done {
  fill: none;
  stroke: rgba(241,204,122,.75);
  stroke-width: 2.2;
  stroke-linecap: round;
  filter: drop-shadow(0 0 5px rgba(241,204,122,.5));
}

/* les étapes : lanternes et haltes */
.stop {
  position: absolute;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.stop-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #c9b78a;
  opacity: .4;
  transition: transform .3s var(--spring), opacity .3s, box-shadow .3s;
}
.stop:hover .stop-dot {
  transform: scale(1.8);
  opacity: 1;
  box-shadow: 0 0 12px rgba(255,225,140,.7);
}
.stop.past .stop-dot {
  background: radial-gradient(circle, #ffe9a8, #d9a94e);
  box-shadow: 0 0 7px rgba(255,215,120,.6);
  opacity: 1;
}
.stop.current .stop-dot {
  width: 14px;
  height: 14px;
  background: radial-gradient(circle at 35% 30%, #fff8dc, #f1cc7a 55%, #c8954a);
  opacity: 1;
  box-shadow: 0 0 14px rgba(255,225,140,1), 0 0 36px rgba(255,190,80,.55);
}
.stop-halo {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,225,140,.5);
  animation: stop-halo 2.4s ease-out infinite;
}
@keyframes stop-halo {
  0% { transform: scale(.55); opacity: .9; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* les haltes : cartes-titres des jalons */
.stop.mile .stop-dot {
  width: 13px;
  height: 13px;
}
.stop-card {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  display: grid;
  gap: 2px;
  min-width: 150px;
  max-width: 200px;
  padding: 9px 13px;
  border: 1px solid rgba(224,194,131,.45);
  border-radius: 10px;
  background: rgba(10,22,17,.94);
  box-shadow: 0 14px 30px rgba(0,0,0,.5);
  color: #e9dcbb;
  font: 500 12.5px/1.4 var(--font-literary);
  text-align: center;
  transform: translateX(-50%);
  white-space: normal;
  pointer-events: none;
}
.stop-card b {
  color: var(--color-gold);
  font-size: 9.5px;
  letter-spacing: .14em;
}
/* tooltip des jours ordinaires */
.stop-tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  z-index: 5;
  display: grid;
  gap: 1px;
  min-width: 110px;
  max-width: 180px;
  padding: 7px 11px;
  border: 1px solid rgba(224,194,131,.35);
  border-radius: 8px;
  background: rgba(10,22,17,.95);
  color: #e9dcbb;
  font: 400 11.5px/1.35 var(--font-literary);
  text-align: center;
  transform: translateX(-50%) translateY(3px);
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s, transform .2s;
}
.stop-tip b {
  color: var(--color-gold);
  font-size: 9px;
  letter-spacing: .12em;
}
.stop:hover .stop-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* la carte postale : halte éditoriale du chapitre */
.scene-postcard {
  position: absolute;
  right: 26px;
  bottom: 76px;
  margin: 0;
  width: 190px;
  padding: 9px 9px 6px;
  border-radius: 4px;
  background: linear-gradient(170deg, #fffef7, #f0e6cc);
  box-shadow: 0 18px 36px rgba(0,0,0,.5);
  transform: rotate(2.5deg);
  transition: transform .4s var(--spring);
}
.scene-postcard:hover {
  transform: rotate(0deg) scale(1.05);
  z-index: 5;
}
.scene-postcard img {
  display: block;
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 2px;
}
.scene-postcard figcaption {
  padding: 8px 4px 8px;
  color: #6b5a38;
  font: italic 500 13px var(--font-literary);
  text-align: center;
}
.scene-postcard figcaption small {
  display: block;
  margin-top: 2px;
  font-style: normal;
  font-size: 10px;
  color: #8a6f3a;
  letter-spacing: .1em;
}

/* le passage de chapitre */
.scene-foot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(180deg, transparent, rgba(6,15,11,.85) 60%);
}
.scene-nav {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 1px solid rgba(224,194,131,.3);
  border-radius: 999px;
  background: rgba(9,22,17,.6);
  color: #e8e3d5;
  font: 500 12.5px var(--font-serif);
  letter-spacing: .08em;
  cursor: pointer;
  transition: all .3s;
}
.scene-nav:hover {
  border-color: rgba(224,194,131,.7);
  color: #ffe9a8;
  transform: translateX(3px);
}
.scene-nav.next {
  background: rgba(224,194,131,.12);
  border-color: rgba(224,194,131,.5);
  color: #ffe9a8;
}

@media (prefers-reduced-motion: reduce) {
  .atlas-scene, .stop-halo { animation: none; }
}
</style>

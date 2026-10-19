<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { currentAdventure, journeyMilestones } from '../../data/adventure'
import { sheetForDay } from '../../data/farces'
import { adventureStart } from '../../data/calendar'
import { visualForDay } from '../../data/dayVisuals'

/**
 * Le voyage dessiné en constellation : chaque jour est une étoile,
 * les jalons des étoiles plus grosses. Le ciel raconte la progression —
 * les jours vécus brillent d'or, le jour courant file comme une comète.
 * La souris attire les étoiles proches (curseur aimanté).
 */
const W = 1000
const H = 240

const total = computed(() => currentAdventure.totalDays)
const current = computed(() => currentAdventure.currentDay)

// Position pseudo-organique et déterministe d'une étoile : la bande ondule
// comme la Voie lactée, jamais deux étoiles à la même hauteur
const starPos = (day: number) => {
  const i = day - 1
  const n = Math.max(1, total.value - 1)
  return {
    x: 34 + (i / n) * (W - 68),
    y: H * .52 + Math.sin(i * .55) * 44 + Math.sin(i * 1.37 + .8) * 20,
  }
}

const milestoneDays = computed(() => new Map(journeyMilestones.value.map((m) => [m.day, m])))

const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' })
const dayDate = (day: number) => {
  const d = new Date(adventureStart.value)
  d.setDate(d.getDate() + day - 1)
  return fmt.format(d)
}

const stars = computed(() =>
  Array.from({ length: total.value }, (_, i) => {
    const day = i + 1
    const milestone = milestoneDays.value.get(day)
    return {
      day,
      ...starPos(day),
      milestone,
      decade: day % 10 === 0 && !milestone,
      title: milestone?.title ?? sheetForDay(day)?.title ?? `Jour ${day}`,
      date: dayDate(day),
      visual: visualForDay(day),
      state: day === current.value ? 'active' : day < current.value ? 'done' : day === current.value + 1 ? 'tomorrow' : 'upcoming',
    }
  }),
)

// Deux tracés : la route déjà parcourue (or) et celle à venir (poussière d'étoile)
const path = (from: number, to: number) => {
  let d = ''
  for (let i = from; i <= to && i <= total.value; i++) {
    const p = starPos(i)
    d += `${d ? 'L' : 'M'}${p.x} ${p.y}`
  }
  return d
}
const pastPath = computed(() => path(1, current.value))
const futurePath = computed(() => (current.value < total.value ? path(current.value, total.value) : ''))

// Quelques étoiles de fond, fixes
const skyStars = [
  [7, 8], [14, 26], [22, 6], [31, 18], [40, 4], [48, 22], [57, 8], [66, 16], [75, 5], [83, 20], [91, 10], [97, 28],
]

/* ---------- curseur aimanté : les étoiles proches tirent vers la souris ---------- */
const field = ref<HTMLElement>()
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const MAGNET_R = 90 // rayon d'attraction, px écran
const MAGNET_F = .32 // force : l'étoile couvre ~1/3 de la distance

function onFieldMove(e: MouseEvent) {
  if (reduceMotion || !field.value) return
  const box = field.value.getBoundingClientRect()
  const mx = e.clientX - box.left
  const my = e.clientY - box.top
  const sx = box.width / W
  const sy = box.height / H
  for (const el of field.value.querySelectorAll<HTMLElement>('.star')) {
    const dx = mx - el.offsetLeft
    const dy = my - el.offsetTop
    const dist = Math.hypot(dx * sx, dy * sy) // distance en px écran
    const pull = dist < MAGNET_R ? (1 - dist / MAGNET_R) * MAGNET_F : 0
    el.style.setProperty('--mx', `${dx * pull}px`)
    el.style.setProperty('--my', `${dy * pull}px`)
  }
}
function onFieldLeave() {
  if (!field.value) return
  for (const el of field.value.querySelectorAll<HTMLElement>('.star')) {
    el.style.setProperty('--mx', '0px')
    el.style.setProperty('--my', '0px')
  }
}

onBeforeUnmount(() => onFieldLeave())
</script>

<template>
  <div
    ref="field"
    class="constellation"
    role="navigation"
    aria-label="La route des lutins dans le ciel"
    @mousemove.passive="onFieldMove"
    @mouseleave="onFieldLeave"
  >
    <svg class="constellation-svg" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
      <path v-if="futurePath" :d="futurePath" class="trail-future" vector-effect="non-scaling-stroke" />
      <path :d="pastPath" class="trail-past" vector-effect="non-scaling-stroke" />
      <circle
        v-for="([sx, sy], i) in skyStars" :key="`sky-${i}`"
        :cx="(sx / 100) * W" :cy="(sy / 32) * H" r="1.3"
        class="sky-star" :class="{ gold: i % 3 === 2 }" :style="{ '--tw': `${(i % 5) * .7}s` }"
      />
    </svg>

    <RouterLink
      v-for="s in stars"
      :key="s.day"
      class="star"
      :class="[`is-${s.state}`, { 'is-milestone': s.milestone }]"
      :style="{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }"
      :to="`/activites/jour-${s.day}`"
      :aria-label="`J${s.day} · ${s.title}`"
    >
      <i v-if="s.state === 'active'" class="star-halo" aria-hidden="true" />
      <i v-if="s.state === 'active'" class="star-tail" aria-hidden="true" />
      <i class="star-dot" />
      <span v-if="s.milestone" class="star-flag" aria-hidden="true"><b>J{{ s.day }}</b><span> {{ s.milestone.title }}</span></span>
      <span v-else-if="s.decade" class="star-tick" aria-hidden="true">J{{ s.day }}</span>
      <span class="star-tip" aria-hidden="true">
        <img v-if="s.visual" :src="s.visual" alt="" loading="lazy" />
        <b>{{ s.state === 'tomorrow' ? 'Demain' : `J${s.day}` }} · {{ s.date }}</b>{{ s.title }}
      </span>
    </RouterLink>
  </div>
</template>

<style scoped>
.constellation {
  position: relative;
  height: 240px;
}
.constellation-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.trail-future {
  fill: none;
  stroke: rgba(233,220,187,.32);
  stroke-width: 1;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(224,194,131,.4));
}
.trail-past {
  fill: none;
  stroke: rgba(241,204,122,.8);
  stroke-width: 1.6;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(241,204,122,.55));
}
.sky-star {
  fill: #f4eae1; /* blanc cassé doux */
  opacity: .35;
  animation: twinkle 3.4s ease-in-out var(--tw, 0s) infinite;
}
.sky-star.gold {
  fill: #e0c283; /* 30 % d'or chaud dans le ciel */
  opacity: .5;
}
@keyframes twinkle {
  50% { opacity: .1; }
}

.star {
  --mx: 0px;
  --my: 0px;
  position: absolute;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  transform: translate(-50%, -50%) translate(var(--mx), var(--my));
  transition: transform .35s var(--spring);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
/* jours à venir : étoiles blanches translucides, présentes dans le ciel */
.star-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.95), rgba(232,227,213,.4));
  box-shadow: 0 0 7px rgba(255,255,255,.28);
  opacity: .72;
  transition: transform .3s var(--spring), opacity .3s, box-shadow .3s;
}
.star.is-done .star-dot {
  background: radial-gradient(circle, #ffe9a8, #d9a94e);
  box-shadow: 0 0 9px rgba(255,215,120,.75);
  opacity: 1;
}
.star.is-milestone .star-dot {
  width: 12px;
  height: 12px;
}
.star.is-done.is-milestone .star-dot {
  box-shadow: 0 0 12px rgba(255,215,120,.85);
}
.star.is-milestone:not(.is-done):not(.is-active) .star-dot {
  width: 13px;
  height: 13px;
  box-shadow: 0 0 0 1.5px rgba(233,220,187,.45), 0 0 10px rgba(255,255,255,.35);
  opacity: .9;
}
/* demain : l'étoile suivante luit faiblement, elle annonce */
.star.is-tomorrow .star-dot {
  opacity: .85;
  background: radial-gradient(circle, #f2ddb0, #c9a860);
  box-shadow: 0 0 10px rgba(255,220,150,.45);
}

/* le jour actif : une étoile filante — noyau brûlant, traîne qui file */
.star.is-active .star-dot {
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 35% 30%, #fff8dc, #f1cc7a 55%, #c8954a);
  opacity: 1;
  box-shadow: 0 0 16px rgba(255,225,140,1), 0 0 42px rgba(255,190,80,.6);
  animation: comet-burn 2.1s ease-in-out infinite;
}
@keyframes comet-burn {
  50% { box-shadow: 0 0 22px rgba(255,235,160,1), 0 0 58px rgba(255,200,100,.75); }
}
.star-tail {
  position: absolute;
  right: 60%;
  top: 50%;
  width: 34px;
  height: 2.5px;
  margin-top: -1px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,222,140,.85));
  transform: rotate(32deg);
  transform-origin: right center;
  filter: blur(.4px);
  animation: comet-tail 1.7s ease-in-out infinite;
  pointer-events: none;
}
@keyframes comet-tail {
  0%, 100% { opacity: .5; transform: rotate(32deg) scaleX(.7); }
  50% { opacity: 1; transform: rotate(32deg) scaleX(1.25); }
}
.star-halo {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,225,140,.5);
  animation: halo 2.4s ease-out infinite;
}
@keyframes halo {
  0% { transform: scale(.55); opacity: .9; }
  100% { transform: scale(1.5); opacity: 0; }
}
.star:hover .star-dot {
  transform: scale(1.7);
  opacity: 1;
  box-shadow: 0 0 14px rgba(255,235,170,.8);
}

/* ---- repères : les jalons portent leur nom, les dizaines leur numéro ---- */
.star-flag {
  position: absolute;
  top: calc(100% + 7px);
  left: 50%;
  display: grid;
  justify-items: center;
  width: max-content;
  max-width: 130px;
  transform: translateX(-50%);
  color: rgba(233,220,187,.85);
  font: 400 9px/1.35 var(--font-literary);
  letter-spacing: .1em;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 0 1px 6px rgba(0,0,0,.9), 0 0 3px rgba(0,0,0,.8);
  pointer-events: none;
}
/* le J du jalon reste visible — seul son titre s'ouvre au survol */
.star-flag > span {
  opacity: 0;
  transform: translateY(3px);
  transition: opacity .22s ease, transform .22s ease;
}
.star:hover .star-flag > span, .star:focus-visible .star-flag > span {
  transform: none;
  opacity: 1;
}
.star-flag b {
  color: var(--color-gold);
  font-size: 9.5px;
  letter-spacing: .18em;
}
.star.is-done .star-flag { color: rgba(233,220,187,.95); }
.star.is-upcoming .star-flag, .star.is-tomorrow .star-flag { color: rgba(233,220,187,.55); }
.star-tick {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  color: rgba(233,220,187,.85);
  font: 400 9px var(--font-literary);
  letter-spacing: .14em;
  text-shadow: 0 1px 5px rgba(0,0,0,.85), 0 0 3px rgba(0,0,0,.7);
  pointer-events: none;
}
.star.is-done .star-tick { color: rgba(241,204,122,.8); }

/* l'étiquette : date en fine typographie, miniature du jour */
.star-tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  z-index: 6;
  display: grid;
  gap: 3px;
  justify-items: center;
  min-width: 130px;
  max-width: 220px;
  padding: 10px 13px 9px;
  border: 1px solid rgba(241,204,122,.4);
  border-radius: 10px;
  background: rgba(12,26,20,.96);
  box-shadow: 0 12px 28px rgba(0,0,0,.5);
  color: #e9dcbb;
  font: 400 12.5px/1.45 var(--font-literary);
  text-align: center;
  transform: translateX(-50%) translateY(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s, transform .2s;
}
.star-tip img {
  width: 72px;
  height: 72px;
  margin: -2px 0 2px;
  border-radius: 7px;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(241,204,122,.35), 0 4px 12px rgba(0,0,0,.5);
}
.star-tip b {
  color: var(--color-gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
}
.star:hover .star-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .star-halo, .sky-star, .star.is-active .star-dot, .star-tail { animation: none; }
}
</style>

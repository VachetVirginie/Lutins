<script setup lang="ts">
import { computed } from 'vue'
import { currentAdventure, journeyMilestones } from '../../data/adventure'
import { sheetForDay } from '../../data/farces'

/**
 * Le voyage dessiné en constellation : chaque jour est une étoile,
 * les jalons des étoiles plus grosses. Le ciel raconte la progression —
 * les jours vécus brillent d'or, le jour courant pulse.
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

const stars = computed(() =>
  Array.from({ length: total.value }, (_, i) => {
    const day = i + 1
    const milestone = milestoneDays.value.get(day)
    return {
      day,
      ...starPos(day),
      milestone,
      title: milestone?.title ?? sheetForDay(day)?.title ?? `Jour ${day}`,
      state: day === current.value ? 'active' : day < current.value ? 'done' : 'upcoming',
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
</script>

<template>
  <div class="constellation" role="navigation" aria-label="La route des lutins dans le ciel">
    <svg class="constellation-svg" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
      <path v-if="futurePath" :d="futurePath" class="trail-future" vector-effect="non-scaling-stroke" />
      <path :d="pastPath" class="trail-past" vector-effect="non-scaling-stroke" />
      <circle
        v-for="([sx, sy], i) in skyStars" :key="`sky-${i}`"
        :cx="(sx / 100) * W" :cy="(sy / 32) * H" r="1.3"
        class="sky-star" :style="{ '--tw': `${(i % 5) * .7}s` }"
      />
    </svg>

    <RouterLink
      v-for="s in stars"
      :key="s.day"
      class="star"
      :class="[`is-${s.state}`, { 'is-milestone': s.milestone }]"
      :style="{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }"
      :to="`/activites/jour-${s.day}`"
      :aria-label="`Jour ${s.day} · ${s.title}`"
    >
      <i class="star-dot" />
      <i v-if="s.state === 'active'" class="star-halo" aria-hidden="true" />
      <span class="star-tip" aria-hidden="true"><b>J{{ s.day }}</b>{{ s.title }}</span>
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
  stroke: rgba(241,204,122,.14);
  stroke-width: 1.4;
  stroke-dasharray: 1 7;
  stroke-linecap: round;
}
.trail-past {
  fill: none;
  stroke: rgba(241,204,122,.5);
  stroke-width: 1.6;
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px rgba(241,204,122,.4));
}
.sky-star {
  fill: #e9dcbb;
  opacity: .35;
  animation: twinkle 3.4s ease-in-out var(--tw, 0s) infinite;
}
@keyframes twinkle {
  50% { opacity: .1; }
}

.star {
  position: absolute;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.star-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c9b78a;
  opacity: .45;
  transition: transform .3s var(--spring), opacity .3s, background .3s;
}
.star.is-done .star-dot {
  background: radial-gradient(circle, #ffe9a8, #d9a94e);
  box-shadow: 0 0 8px rgba(255,215,120,.7);
  opacity: 1;
}
.star.is-milestone .star-dot {
  width: 11px;
  height: 11px;
}
.star.is-done.is-milestone .star-dot {
  box-shadow: 0 0 12px rgba(255,215,120,.85);
}
.star.is-active .star-dot {
  width: 14px;
  height: 14px;
  background: radial-gradient(circle at 35% 30%, #fff8dc, #f1cc7a 55%, #c8954a);
  opacity: 1;
  box-shadow: 0 0 14px rgba(255,225,140,1), 0 0 34px rgba(255,190,80,.55);
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
}

.star-tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  z-index: 6;
  display: grid;
  gap: 1px;
  min-width: 130px;
  max-width: 210px;
  padding: 9px 13px;
  border: 1px solid rgba(241,204,122,.4);
  border-radius: 10px;
  background: rgba(12,26,20,.96);
  box-shadow: 0 12px 28px rgba(0,0,0,.5);
  color: #e9dcbb;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  transform: translateX(-50%) translateY(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s, transform .2s;
}
.star-tip b {
  color: var(--color-gold);
  font-size: 10px;
  letter-spacing: .14em;
}
.star:hover .star-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .star-halo, .sky-star { animation: none; }
}
</style>

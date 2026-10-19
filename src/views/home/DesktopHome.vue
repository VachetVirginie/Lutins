<script setup lang="ts">
import { computed, ref } from 'vue'
import { currentAdventure, journeyMilestones, remainingDays } from '../../data/adventure'
import { adventure } from '../../data/adventureStore'
import { sheetForDay } from '../../data/farces'
import { preparationCatalog } from '../../data/preparationCatalog'
import NightCanvas from '../../components/magic/NightCanvas.vue'
import ConstellationMap from '../../components/home/ConstellationMap.vue'

/**
 * « La veillée » — l'accueil desktop n'est pas une page, c'est une scène :
 * le ciel de nuit porte le récit (constellation du voyage), le bureau
 * éclairé à la lampe porte les objets du lendemain.
 */
const chapter = computed(() => currentAdventure.chapter)
const current = computed(() => currentAdventure.currentDay)
const total = computed(() => currentAdventure.totalDays)
const milestones = journeyMilestones

/* ---- la semaine de préparation, résumée en une carte ---- */
const weekPrep = computed(() => {
  const items = preparationCatalog.value.filter((i) => i.day > current.value && i.day <= current.value + 7)
  const done = items.filter((i) => adventure.prepDone.has(i.id)).length
  return { count: items.length, done }
})

const tomorrow = computed(() =>
  current.value < total.value ? { day: current.value + 1, title: sheetForDay(current.value + 1)?.title } : null,
)

/* ---- parallaxe : la lune et la lampe dérivent avec le curseur ---- */
const scene = ref<HTMLElement | null>(null)
function onMouse(e: MouseEvent) {
  if (!scene.value || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { innerWidth: w, innerHeight: h } = window
  scene.value.style.setProperty('--px', String((e.clientX / w - 0.5) * 2))
  scene.value.style.setProperty('--py', String((e.clientY / h - 0.5) * 2))
}
</script>

<template>
  <main ref="scene" class="veille" @mousemove.passive="onMouse">
    <!-- le ciel : aurore, lune, neige -->
    <div class="sky" aria-hidden="true">
      <i class="aurora aurora--a" /><i class="aurora aurora--b" />
      <i class="moon" />
      <NightCanvas />
      <svg class="forest" viewBox="0 0 1200 90" preserveAspectRatio="none">
        <path d="M0 90 L0 62 L38 62 L52 30 L66 62 L110 62 L128 38 L146 62 L210 62 L210 90 Z
                 M230 90 L230 58 L268 58 L286 24 L304 58 L352 58 L366 42 L380 58 L430 58 L430 90 Z
                 M450 90 L450 64 L500 64 L518 34 L536 64 L590 64 L606 44 L622 64 L680 64 L680 90 Z
                 M700 90 L700 56 L748 56 L764 26 L780 56 L836 56 L852 40 L868 56 L920 56 L920 90 Z
                 M940 90 L940 60 L992 60 L1010 28 L1028 60 L1086 60 L1102 44 L1118 60 L1200 60 L1200 90 Z" />
      </svg>
    </div>

    <!-- le récit, suspendu dans le ciel -->
    <header class="veille-hero">
      <p class="veille-overline">JOUR {{ current }} · {{ remainingDays }} NUITS AVANT NOËL</p>
      <h1>{{ chapter.heroA }}<br /><em>{{ chapter.heroEm }}</em></h1>
      <p class="veille-tag">{{ chapter.tagline }}</p>
    </header>

    <!-- le voyage en constellation -->
    <section class="veille-sky-map" aria-label="La route des lutins">
      <ConstellationMap />
      <ul class="veille-miles">
        <li v-for="m in milestones" :key="m.day">
          <RouterLink :to="`/activites/jour-${m.day}`" class="mile" :class="m.status">
            <i class="mdi mdi-star-four-points" aria-hidden="true" /> {{ m.title }}
          </RouterLink>
        </li>
      </ul>
    </section>

    <!-- le bureau : objets de papier sous la lampe -->
    <div class="desk" aria-hidden="false">
      <i class="lamp-glow" aria-hidden="true" />

      <section class="desk-row">
        <!-- la dépêche du jour, posée au centre de la lumière -->
        <RouterLink to="/aujourdhui" class="paper letter-card">
          <span class="paper-seal"><b>J{{ current }}</b></span>
          <p class="paper-over">LA DÉPÊCHE DU JOUR</p>
          <h2>{{ currentAdventure.currentTitle }}</h2>
          <p class="paper-desc">{{ currentAdventure.currentDescription }}</p>
          <span class="paper-cta">Briser le sceau <i class="mdi mdi-arrow-right" aria-hidden="true" /></span>
        </RouterLink>

        <!-- le carnet de préparation, épinglé -->
        <RouterLink to="/prepare" class="paper carnet-card">
          <i class="carnet-pin" aria-hidden="true" />
          <p class="paper-over">LA RÉSERVE · CETTE SEMAINE</p>
          <h2>{{ weekPrep.count ? `${weekPrep.done}/${weekPrep.count} colis embarqués` : 'Rien à préparer' }}</h2>
          <p class="paper-desc">{{ weekPrep.count ? 'La réserve vous attend — tout cocher avant le soir.' : 'La semaine est légère, profitez-en.' }}</p>
          <span class="paper-cta">Ouvrir la réserve <i class="mdi mdi-arrow-right" aria-hidden="true" /></span>
        </RouterLink>

        <!-- la carte du voyage, roulée -->
        <RouterLink to="/planning" class="paper map-card">
          <p class="paper-over">LA CARTE DU VOYAGE</p>
          <h2>La route complète</h2>
          <p class="paper-desc">{{ total }} jours de dépêches, jalons et détours.</p>
          <span class="paper-cta">Dérouler la carte <i class="mdi mdi-arrow-right" aria-hidden="true" /></span>
        </RouterLink>
      </section>

      <RouterLink v-if="tomorrow" class="tomorrow-slip" :to="`/activites/jour-${tomorrow.day}`">
        <i class="mdi mdi-weather-night" aria-hidden="true" />
        <span>Et demain — <em>{{ tomorrow.title }}</em></span>
        <i class="mdi mdi-chevron-right" aria-hidden="true" />
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
/* ================= LA VEILLÉE ================= */
.veille {
  --px: 0;
  --py: 0;
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  color: #f2ead8;
  background: linear-gradient(180deg, #0a1e22 0%, #0c2526 34%, #0d221b 60%, #0a1b13 78%, #081410 100%);
}

/* ---------- le ciel ---------- */
.sky {
  position: absolute;
  inset: 0 0 38%;
  overflow: hidden;
  pointer-events: none;
}
.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  mix-blend-mode: screen;
}
.aurora--a {
  top: -18%;
  left: -8%;
  width: 62vw;
  height: 46vh;
  background: radial-gradient(ellipse, rgba(64,190,150,.28), transparent 70%);
  animation: aurora-a 22s ease-in-out infinite alternate;
}
.aurora--b {
  top: -10%;
  right: -12%;
  width: 55vw;
  height: 40vh;
  background: radial-gradient(ellipse, rgba(90,140,220,.2), transparent 70%);
  animation: aurora-b 27s ease-in-out infinite alternate;
}
@keyframes aurora-a {
  to { transform: translate3d(9vw, 5vh, 0) scale(1.12); }
}
@keyframes aurora-b {
  to { transform: translate3d(-8vw, 4vh, 0) scale(1.08); }
}
.moon {
  position: absolute;
  top: 7%;
  right: 9%;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 34%, #fff9e0, #f0d894 52%, #d9b465 82%);
  box-shadow: 0 0 40px rgba(255,230,160,.5), 0 0 120px rgba(255,200,100,.22);
  transform: translate3d(calc(var(--px) * -14px), calc(var(--py) * -8px), 0);
}
.forest {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  width: 100%;
  height: 90px;
  fill: rgba(6,17,13,.92);
  transform: translate3d(calc(var(--px) * 5px), 0, 0);
}

/* ---------- le héros dans le ciel ---------- */
.veille-hero {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto;
  padding: 120px 48px 0;
}
.veille-overline {
  margin: 0;
  color: var(--color-gold);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .22em;
}
.veille-hero h1 {
  margin: 14px 0 0;
  font: 500 clamp(46px, 4.8vw, 68px)/1.02 var(--font-serif);
  letter-spacing: -.03em;
  color: #f7efdb;
  text-shadow: 0 4px 30px rgba(0,0,0,.4);
}
.veille-hero h1 em {
  color: var(--color-gold);
  font-style: italic;
}
.veille-tag {
  margin: 16px 0 0;
  max-width: 46ch;
  color: #b7c8bb;
  font-size: 15.5px;
  line-height: 1.6;
}

/* ---------- la constellation ---------- */
.veille-sky-map {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 18px auto 0;
  padding: 0 48px;
}
.veille-miles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}
.mile {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid rgba(241,204,122,.22);
  border-radius: 999px;
  color: #a9bcae;
  font-size: 12.5px;
  text-decoration: none;
  transition: all .3s;
}
.mile:hover {
  color: var(--color-gold);
  border-color: rgba(241,204,122,.6);
  background: rgba(241,204,122,.07);
}
.mile.active {
  color: #ffe9a8;
  border-color: rgba(241,204,122,.6);
  background: rgba(241,204,122,.1);
}
.mile i { color: var(--color-gold); font-size: 12px; }

/* ---------- le bureau ---------- */
.desk {
  position: relative;
  z-index: 2;
  margin-top: 30px;
  padding: 64px 48px 72px;
  background:
    radial-gradient(ellipse 70% 80% at 28% 0%, rgba(255,196,96,.1), transparent 60%),
    linear-gradient(180deg, rgba(13,26,20,.35) 0%, #0d1f17 30%, #0a1710 100%);
  box-shadow: inset 0 1px 0 rgba(241,204,122,.1);
}
/* la lampe : lumière chaude qui respire doucement, suit un peu le curseur */
.lamp-glow {
  position: absolute;
  top: -180px;
  left: 12%;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,205,110,.22), rgba(255,180,80,.07) 50%, transparent 70%);
  filter: blur(30px);
  transform: translate3d(calc(var(--px) * 16px), calc(var(--py) * 9px), 0);
  animation: lamp-breathe 6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes lamp-breathe {
  50% { opacity: .75; }
}
.desk-row {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 28px;
  max-width: 1180px;
  margin: 0 auto;
  align-items: stretch;
}

/* objets de papier posés sur le bureau */
.paper {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 30px 28px 22px;
  border-radius: 6px 18px 10px 24px / 18px 8px 24px 10px;
  background:
    radial-gradient(ellipse 60% 40% at 18% 10%, rgba(255,252,238,.7), transparent 60%),
    repeating-linear-gradient(0deg, transparent 0 3px, rgba(110,72,26,.03) 3px 4px),
    linear-gradient(158deg, #f4ead2 0%, #ead9b4 58%, #dcc593 100%);
  box-shadow: 0 22px 46px rgba(0,0,0,.5), inset 0 0 0 1px rgba(150,110,50,.3), inset 0 0 26px rgba(120,78,28,.12);
  color: #43331c;
  text-decoration: none;
  transition: transform .45s var(--spring), box-shadow .45s;
}
.paper:hover {
  transform: translateY(-6px) rotate(-.4deg);
  box-shadow: 0 34px 60px rgba(0,0,0,.55), inset 0 0 0 1px rgba(150,110,50,.35), inset 0 0 26px rgba(120,78,28,.12);
}
.paper-over {
  margin: 0;
  color: #8a6a2f;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .18em;
}
.paper h2 {
  margin: 8px 0 0;
  font: 500 23px/1.15 var(--font-serif);
  color: #33260f;
}
.paper-desc {
  margin: 10px 0 0;
  font: 500 13.5px/1.55 var(--font-literary);
  color: #5c4620;
  flex: 1;
}
.paper-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid rgba(140,105,45,.3);
  color: #6d5220;
  font-size: 12.5px;
  font-weight: 700;
}
.paper:hover .paper-cta {
  color: #9a6f1e;
}
.paper-seal {
  position: absolute;
  top: -18px;
  right: 26px;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 47% 53% 51% 49% / 52% 48% 52% 48%;
  background: radial-gradient(circle at 34% 30%, #e2684a 0%, #b83b2a 46%, #8c2718 100%);
  box-shadow: 0 6px 16px rgba(0,0,0,.45), inset 0 2px 4px rgba(255,190,160,.4);
  color: #ffd9b8;
  font: 600 14px/1 var(--font-serif);
  transform: rotate(8deg);
}
.carnet-pin {
  position: absolute;
  top: -8px;
  left: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f7e6b8, #b98a3e);
  box-shadow: 0 3px 6px rgba(0,0,0,.4);
  transform: translateX(-50%);
}
.map-card {
  transform: rotate(.7deg);
}
.carnet-card {
  transform: rotate(-.8deg);
}
.carnet-card:hover, .map-card:hover {
  transform: translateY(-6px) rotate(0deg);
}

/* la promesse du lendemain : bande de papier glissée sous la lampe */
.tomorrow-slip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 680px;
  margin: 30px auto 0;
  padding: 14px 24px;
  border: 1px dashed rgba(140,105,45,.5);
  border-radius: 4px 14px 6px 16px / 12px 5px 14px 6px;
  background: linear-gradient(160deg, rgba(244,234,210,.92), rgba(224,205,159,.92));
  box-shadow: 0 12px 26px rgba(0,0,0,.4);
  color: #5c4620;
  font-size: 14px;
  text-decoration: none;
  transform: rotate(-.5deg);
  transition: transform .4s var(--spring);
}
.tomorrow-slip:hover {
  transform: rotate(0deg) translateY(-3px);
}
.tomorrow-slip em {
  color: #33260f;
  font: italic 500 14.5px var(--font-literary);
}
.tomorrow-slip i:first-child { color: #a67d34; }

@media (prefers-reduced-motion: reduce) {
  .aurora--a, .aurora--b, .lamp-glow { animation: none; }
  .moon, .forest { transform: none !important; }
  .paper:hover, .tomorrow-slip:hover { transform: none; }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentAdventure, journeyMilestones, remainingDays } from '../../data/adventure'
import { adventure } from '../../data/adventureStore'
import { sheetForDay } from '../../data/farces'
import { preparationCatalog } from '../../data/preparationCatalog'
import SceneNight from '../../components/magic/SceneNight.vue'
import ConstellationMap from '../../components/home/ConstellationMap.vue'
import { waxCrack } from '../../utils/sound'

/**
 * « La veillée » — l'accueil desktop n'est pas une page, c'est une scène :
 * le ciel de nuit porte le récit (constellation du voyage), le bureau
 * éclairé à la lampe porte les objets du lendemain.
 */
const chapter = computed(() => currentAdventure.chapter)
const current = computed(() => currentAdventure.currentDay)
const total = computed(() => currentAdventure.totalDays)
const milestones = journeyMilestones

/* le tagline vit : il cite la dépêche du soir, pas l'ouverture passée */
const tagline = computed(() => {
  const sheet = sheetForDay(current.value)
  return sheet ? `Ce soir — « ${sheet.title} »` : chapter.value.tagline
})

/* ---- la semaine de préparation, résumée en une carte ---- */
const weekPrep = computed(() => {
  const items = preparationCatalog.value.filter((i) => i.day > current.value && i.day <= current.value + 7)
  const done = items.filter((i) => adventure.prepDone.has(i.id)).length
  return { count: items.length, done, preview: items.slice(0, 3) }
})

/* la lettre est adressée aux enfants — comme un vrai courrier */
const addressee = computed(() => {
  const noms = adventure.prenoms_enfants.filter(Boolean)
  return noms.length ? noms.join(' et ') : 'la famille'
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

/* ---- briser le sceau : la cire se fend, puis on entre ---- */
const router = useRouter()
const cracking = ref(false)
function breakSeal() {
  if (cracking.value) return
  cracking.value = true
  waxCrack()
  window.setTimeout(() => router.push('/aujourdhui'), 520)
}
</script>

<template>
  <main ref="scene" class="veille" @mousemove.passive="onMouse">
    <!-- le ciel : aurore, lune, neige -->
    <div class="sky" aria-hidden="true">
      <img class="sky-photo" src="/assets/created/journey-station.png" alt="" />
      <i class="sky-mask" />
      <i class="aurora aurora--a" /><i class="aurora aurora--b" />
      <i class="ambient-glow" />
      <i class="moon" />
      <SceneNight />
      <svg class="forest" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
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
      <p class="veille-tag">{{ tagline }}</p>
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
        <!-- la dépêche du jour, en verre dans le ciel -->
        <a href="/aujourdhui" class="glass-card letter-card" :class="{ 'is-cracking': cracking }" @click.prevent="breakSeal">
          <span class="day-orb" aria-hidden="true"><b>J{{ current }}</b></span>
          <p class="glass-over">✦ LA DÉPÊCHE DU JOUR</p>
          <h2>{{ currentAdventure.currentTitle }}</h2>
          <p class="letter-to">À l'attention de {{ addressee }}</p>
          <p class="glass-desc">{{ currentAdventure.currentDescription }}</p>
          <span class="glass-cta">Lire la dépêche <i class="mdi mdi-arrow-right" aria-hidden="true" /></span>
        </a>

        <!-- la préparation, même verre -->
        <RouterLink to="/prepare" class="glass-card carnet-card">
          <p class="glass-over">VOTRE PRÉPARATION</p>
          <h2>{{ weekPrep.count ? `${weekPrep.done}/${weekPrep.count} colis embarqués` : 'Rien à préparer' }}</h2>
          <ul v-if="weekPrep.preview.length" class="carnet-list">
            <li v-for="item in weekPrep.preview" :key="item.id" :class="{ done: adventure.prepDone.has(item.id) }">
              <i aria-hidden="true" />{{ item.title }}
            </li>
          </ul>
          <p v-else class="glass-desc">La semaine est légère, profitez-en.</p>
          <span class="glass-cta">Ouvrir la réserve <i class="mdi mdi-arrow-right" aria-hidden="true" /></span>
        </RouterLink>
      </section>

      <!-- demain : un mot discret sous la dépêche, pas une quatrième carte -->
      <div v-if="tomorrow" class="tomorrow-wrap">
        <RouterLink class="tomorrow-link" :to="`/activites/jour-${tomorrow.day}`">
          Et demain — <em>{{ tomorrow.title }}</em> <i class="mdi mdi-arrow-right" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>

    <RouterLink to="/personnalisation" class="veille-gear">
      <i class="mdi mdi-cog-outline" aria-hidden="true" />
      <span class="sr-only">Personnaliser l'aventure</span>
    </RouterLink>
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
  /* l'ambiance de l'affiche : mur vert forêt très sombre, lumière de
     bougie en haut à droite, reflet chaud du parquet en bas à gauche */
  background:
    radial-gradient(ellipse 85% 50% at 80% -6%, rgba(224,160,60,.16), transparent 62%),
    radial-gradient(ellipse 95% 55% at 15% 112%, rgba(190,120,55,.13), transparent 62%),
    linear-gradient(180deg, #10221b 0%, #0b1a15 55%, #071310 100%);
}

/* ---------- le ciel : l'illustration de la gare en fond, voilée ---------- */
.sky {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.sky-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 28%;
  filter: brightness(.62) saturate(.92);
}
/* les masques : la photo devient une atmosphère, jamais un fond d'écran —
   voile nuit en haut pour le titre, profondeur douce au centre,
   tombé vert forêt en bas sous le bureau */
.sky-mask {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(9,20,16,.86) 0%, rgba(9,20,16,.52) 34%, rgba(9,20,16,.58) 60%, rgba(7,16,13,.92) 100%),
    linear-gradient(90deg, rgba(7,16,13,.55) 0%, transparent 42%, transparent 72%, rgba(7,16,13,.6) 100%);
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
  background: radial-gradient(ellipse, rgba(52,140,105,.24), transparent 70%);
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
/* la chaleur des bougies : un halo ambré qui veille en haut à droite */
.ambient-glow {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(224,160,60,.22) 0%, transparent 70%);
  filter: blur(80px);
}
/* la lune : un croissant fin dessiné par l'ombre interne décalée */
.moon {
  position: absolute;
  top: 7%;
  right: 9%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow:
    inset -22px 9px 0 0 #f0d894,
    inset -22px 9px 6px 2px rgba(255,242,190,.7);
  filter: drop-shadow(0 0 12px rgba(255,230,160,.45)) drop-shadow(0 0 40px rgba(255,200,100,.18));
  opacity: .85;
  transform: translate3d(calc(var(--px) * -22px), calc(var(--py) * -12px), 0);
  transition: transform .6s ease-out;
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

/* ---------- la zone basse : l'HUD magique, dans le même ciel ---------- */
.desk {
  position: relative;
  z-index: 2;
  margin-top: 30px;
  padding: 46px 48px 88px;
}
/* une lueur chaude discrète derrière les panneaux — la lampe devient un halo */
.lamp-glow {
  position: absolute;
  top: -60px;
  left: 8%;
  width: 560px;
  height: 560px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,205,110,.14), rgba(255,180,80,.05) 50%, transparent 70%);
  filter: blur(40px);
  transform: translate3d(calc(var(--px) * 16px), calc(var(--py) * 9px), 0);
  animation: lamp-breathe 6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes lamp-breathe {
  50% { opacity: .7; }
}
.desk-row {
  display: flex;
  align-items: stretch;
  gap: 24px;
  max-width: 980px;
  margin: 0 auto;
}

/* les panneaux de verre dépoli — le contenu flotte dans la nuit */
.glass-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 30px 30px 24px;
  border: 1px solid rgba(224,194,131,.2);
  border-radius: 16px;
  background: rgba(10,28,22,.55);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 30px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1);
  color: #f4eae1;
  text-decoration: none;
  transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s;
}
.glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(224,194,131,.6);
  box-shadow: 0 30px 60px rgba(0,0,0,.6), 0 0 24px rgba(224,194,131,.15);
}
/* poussière d'étoiles qui s'agglomère au survol */
.glass-card::after {
  content: '';
  position: absolute;
  inset: -14px;
  border-radius: 26px;
  background:
    radial-gradient(circle 1.5px at 8% 30%, rgba(255,236,170,.9), transparent 100%),
    radial-gradient(circle 1px at 22% -4%, rgba(255,236,170,.7), transparent 100%),
    radial-gradient(circle 1.3px at 96% 22%, rgba(255,236,170,.85), transparent 100%),
    radial-gradient(circle 1px at 88% 96%, rgba(255,236,170,.6), transparent 100%),
    radial-gradient(circle 1.2px at 45% 104%, rgba(255,236,170,.75), transparent 100%),
    radial-gradient(circle 1px at -3% 78%, rgba(255,236,170,.65), transparent 100%);
  opacity: 0;
  transition: opacity .45s;
  pointer-events: none;
}
.glass-card:hover::after { opacity: 1; }

.glass-over {
  margin: 0;
  color: var(--color-gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .22em;
}
.glass-card h2 {
  margin: 10px 0 0;
  font: 500 26px/1.12 var(--font-serif);
  color: #e0c283; /* l'or chaud des bougies, rappel du « la vôtre. » */
  letter-spacing: -.01em;
}
.glass-card:hover h2 {
  color: #ffe9a8;
  text-shadow: 0 0 18px rgba(255,215,120,.35);
}
.glass-desc {
  margin: 12px 0 0;
  font: 500 15.5px/1.6 var(--font-literary);
  color: #c9d4c9;
  flex: 1;
}
/* les actions : capsules de verre qui se remplissent de lumière */
.glass-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 10px 18px;
  border: 1px solid rgba(224,194,131,.35);
  border-radius: 999px;
  background: rgba(224,194,131,.05);
  color: #e8ddc0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  transition: background .35s, box-shadow .35s, color .35s, border-color .35s;
  width: fit-content;
}
.glass-card:hover .glass-cta {
  background: rgba(224,194,131,.18);
  border-color: rgba(224,194,131,.7);
  color: #ffe9a8;
  box-shadow: 0 0 22px rgba(224,194,131,.3), inset 0 0 12px rgba(255,225,140,.12);
}

/* ---- la dépêche : l'orbe du jour remplace la cire ---- */
.letter-card {
  flex: 1.35;
  min-height: 280px;
}
/* rétro-éclairée : un halo d'or feutré veille derrière la dépêche */
.letter-card::before {
  content: '';
  position: absolute;
  inset: -22px -18px;
  z-index: -1;
  border-radius: 30px;
  background: radial-gradient(ellipse 70% 60% at 50% 40%, rgba(224,160,60,.16), transparent 70%);
  filter: blur(18px);
  pointer-events: none;
}
.day-orb {
  position: absolute;
  top: -20px;
  right: 26px;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px solid rgba(255,222,140,.5);
  background:
    radial-gradient(circle at 36% 30%, #f4d98f 0%, #c8954a 48%, #7a4f1a 100%);
  box-shadow: 0 8px 22px rgba(0,0,0,.5), 0 0 26px rgba(255,205,100,.4), inset 0 2px 5px rgba(255,244,200,.55);
  color: #3a2708;
  font: 600 15px/1 var(--font-serif);
  transition: transform .3s var(--spring);
}
.letter-card:hover .day-orb {
  transform: scale(1.08);
  box-shadow: 0 8px 22px rgba(0,0,0,.5), 0 0 40px rgba(255,205,100,.65), inset 0 2px 5px rgba(255,244,200,.55);
}
/* l'orbe appelle : une onde dorée invite à le briser */
.day-orb::after {
  content: '';
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,215,120,.5);
  animation: orb-beckon 2.6s ease-out infinite;
}
@keyframes orb-beckon {
  0% { transform: scale(.82); opacity: .9; }
  100% { transform: scale(1.5); opacity: 0; }
}
.is-cracking .day-orb {
  animation: orb-burst .5s cubic-bezier(.3,.7,.4,1) forwards;
}
@keyframes orb-burst {
  0% { transform: scale(1); }
  30% { transform: scale(1.25); filter: brightness(1.8); }
  100% { transform: scale(.3) translateY(26px); opacity: 0; filter: brightness(2.5); }
}
.is-cracking {
  animation: panel-dissolve .55s cubic-bezier(.5,0,.7,.3) .1s forwards;
}
@keyframes panel-dissolve {
  to { transform: translateY(10px) scale(.97); opacity: 0; }
}
.letter-to {
  margin: 7px 0 0;
  color: rgba(233,220,187,.6);
  font: italic 500 14.5px var(--font-literary);
}

/* ---- la préparation : checklist en verre ---- */
.carnet-card {
  flex: 1;
}
.carnet-list {
  display: grid;
  gap: 9px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  flex: 1;
}
.carnet-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #eef1e6;
  font: 500 13.5px/1.35 var(--font-literary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.carnet-list li i {
  flex: none;
  width: 13px;
  height: 13px;
  border: 1.5px solid rgba(224,194,131,.55);
  border-radius: 4px;
}
.carnet-list li.done {
  color: rgba(201,212,201,.5);
  text-decoration: line-through;
  text-decoration-color: rgba(224,194,131,.4);
}
.carnet-list li.done i {
  border-color: rgba(224,194,131,.9);
  background: radial-gradient(circle at 50% 50%, #e0c283 45%, #a67d34);
  box-shadow: 0 0 8px rgba(224,194,131,.5);
}

/* demain : un mot discret sous la dépêche, pas une quatrième carte */
/* demain : un murmure doré au bas du bureau, directement sur la nuit */
.tomorrow-wrap {
  margin: 26px 0 0;
  text-align: center;
}
.tomorrow-link {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  color: #d8b96e;
  font: 400 14px/1 var(--font-literary);
  letter-spacing: .1em;
  text-decoration: none;
  transition: color .3s;
}
.tomorrow-link:hover { color: #ffe9a8; }
.tomorrow-link em {
  font: italic 500 15px var(--font-literary);
  color: #e8e3d5;
}
.tomorrow-link:hover em { color: #fff4d6; }
.tomorrow-link i { font-size: 12px; }

/* l'engrenage des réglages : un bouton de laiton, en haut à droite */
.veille-gear {
  position: fixed;
  top: 22px;
  right: clamp(18px, 3vw, 40px);
  z-index: 9;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(224,194,131,.3);
  border-radius: 50%;
  background: rgba(9,22,17,.58);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #a0b2a6;
  font-size: 20px;
  text-decoration: none;
  box-shadow: 0 10px 26px rgba(0,0,0,.4);
  transition: color .3s, border-color .3s;
}
.veille-gear i {
  transition: transform .6s cubic-bezier(.3,.85,.35,1.05);
}
.veille-gear:hover {
  color: #e0c283;
  border-color: rgba(224,194,131,.6);
}
.veille-gear:hover i {
  transform: rotate(120deg);
}

@media (prefers-reduced-motion: reduce) {
  .aurora--a, .aurora--b, .lamp-glow, .day-orb::after { animation: none; }
  .moon, .forest { transform: none !important; }
  .glass-card:hover { transform: none; }
}
</style>

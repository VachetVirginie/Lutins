<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { currentAdventure } from '../data/adventure'
import { adventure } from '../data/adventureStore'
import { preparationCatalog, type PreparationCategory } from '../data/preparationCatalog'
import { haptic } from '../utils/haptics'

const router = useRouter()

function goBack(): void {
  if (window.history.state?.back) router.back()
  else router.push('/home')
}

type Filter = 'all' | PreparationCategory
const filter = ref<Filter>('all')

// La réserve fait partie de l'état partagé — les coches voyagent entre appareils
const done = computed<Set<string>>({
  get: () => adventure.prepDone,
  set: (value) => (adventure.prepDone = value),
})

const groups: { id: PreparationCategory; label: string }[] = [
  { id: 'print', label: 'À imprimer' },
  { id: 'food', label: 'Aliments' },
  { id: 'gift', label: 'Cadeaux' },
  { id: 'material', label: 'Matériel & scène' },
]

const visibleGroups = computed(() => groups
  .filter((group) => filter.value === 'all' || group.id === filter.value)
  .map((group) => ({ ...group, items: preparationCatalog.filter((item) => item.category === group.id) }))
  .filter((group) => group.items.length))

// La réserve se lit d'abord à l'horizon d'une semaine — le reste reste plié
const currentDay = currentAdventure.currentDay
const totalDays = currentAdventure.totalDays
const showLater = ref(false)
const showPast = ref(false)

type CatalogGroup = { id: PreparationCategory; label: string; items: typeof preparationCatalog }

function splitGroups(minExclusive: number, maxInclusive: number): Ref<CatalogGroup[]> {
  return computed(() => visibleGroups.value
    .map((group) => ({ ...group, items: group.items.filter((item) => item.day > minExclusive && item.day <= maxInclusive) }))
    .filter((group) => group.items.length))
}

const weekEnd = Math.min(currentDay + 7, totalDays)
const weekGroups = splitGroups(currentDay, weekEnd)
const laterGroups = splitGroups(weekEnd, totalDays)
const pastGroups = splitGroups(0, currentDay)

const lineCount = (gs: CatalogGroup[]) => gs.reduce((n, g) => n + g.items.length, 0)

interface ManifestSection {
  key: string
  label: string
  groups: CatalogGroup[]
  open: boolean
  toggle: Ref<boolean> | null
}

const sections = computed<ManifestSection[]>(() => [
  { key: 'week', label: `Cette semaine — J${currentDay + 1} à J${weekEnd}`, groups: weekGroups.value, open: true, toggle: null },
  { key: 'later', label: 'Plus loin dans le voyage', groups: laterGroups.value, open: showLater.value, toggle: showLater },
  { key: 'past', label: 'Déjà passé', groups: pastGroups.value, open: showPast.value, toggle: showPast },
].filter((section) => section.groups.length))

function toggleSection(toggle: Ref<boolean> | null): void {
  if (toggle) {
    toggle.value = !toggle.value
    haptic(6)
  }
}

const readyCount = computed(() => done.value.size)
const totalCount = preparationCatalog.length
const fillPct = computed(() => (totalCount ? readyCount.value / totalCount : 0))

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const sackEl = ref<HTMLElement>()

function toggle(id: string): void {
  const next = new Set(done.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  done.value = next
  haptic(12)
}

// Le colis s'envole dans la réserve — le geste signature de la page
function embark(id: string, ev: MouseEvent): void {
  const wasDone = done.value.has(id)
  toggle(id)
  if (wasDone || reduceMotion) return
  const fromEl = ev.currentTarget as HTMLElement
  const toEl = sackEl.value?.querySelector('.sack-figure') as HTMLElement | null
  if (!toEl) return
  const a = fromEl.getBoundingClientRect()
  const b = toEl.getBoundingClientRect()
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const fly = document.createElement('i')
  fly.style.cssText = `position:fixed;z-index:60;left:${a.left + a.width / 2 - 7}px;top:${a.top + a.height / 2 - 5}px;width:15px;height:11px;border-radius:2px;background:linear-gradient(160deg,#f0e4c3,#d8c08e);box-shadow:0 2px 8px rgba(0,0,0,.45),inset 0 0 0 1px rgba(150,110,50,.4);pointer-events:none`
  document.body.appendChild(fly)
  fly.animate([
    { transform: 'translate3d(0,0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate3d(${dx * 0.5}px,${dy * 0.5 - 70}px,0) scale(.75) rotate(8deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate3d(${dx}px,${dy}px,0) scale(.15) rotate(16deg)`, opacity: 0.4 },
  ], { duration: 950, easing: 'cubic-bezier(.5,.05,.3,1)' }).onfinish = () => {
    fly.remove()
    toEl.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.09)' },
      { transform: 'scale(1)' },
    ], { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' })
  }
}
</script>

<template>
  <main class="app-screen prepare-screen">
    <i class="warm-glow" aria-hidden="true" />
    <header class="prepare-header">
      <button class="back-link" type="button" @click="goBack"><i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour</button>
      <p class="prepare-overline">LA RÉSERVE DE L'EXPÉDITION</p>
      <h1>À <em>prévoir.</em></h1>
      <p>Cochez un colis pour l'embarquer — la réserve se remplit au fur et à mesure.</p>
    </header>

    <!-- la réserve : le sac se remplit colis après colis -->
    <section ref="sackEl" class="sack" aria-label="Progression de la réserve">
      <svg class="sack-figure" viewBox="0 0 64 72" aria-hidden="true">
        <defs>
          <clipPath id="sack-clip"><path d="M32 7c-5.5 0-9.5 2.5-11.5 6.5-4-1-7 1-6 5-5 6-8 13-8 21 0 14 10 24 25.5 24S57.5 53.5 57.5 39.5c0-8-3-15-8-21 1-4-2-6-6-5-2-4-6-6.5-11.5-6.5z" /></clipPath>
          <linearGradient id="sack-glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8" /><stop offset="1" stop-color="#a67d34" /></linearGradient>
          <linearGradient id="sack-leather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5228" /><stop offset=".55" stop-color="#553517" /><stop offset="1" stop-color="#3a210e" /></linearGradient>
        </defs>
        <path d="M32 7c-5.5 0-9.5 2.5-11.5 6.5-4-1-7 1-6 5-5 6-8 13-8 21 0 14 10 24 25.5 24S57.5 53.5 57.5 39.5c0-8-3-15-8-21 1-4-2-6-6-5-2-4-6-6.5-11.5-6.5z" fill="url(#sack-leather)" />
        <g clip-path="url(#sack-clip)">
          <rect x="0" :y="68 - 60 * fillPct" width="64" :height="60 * fillPct" fill="url(#sack-glow)" opacity=".38" />
          <rect x="0" :y="68 - 60 * fillPct" width="64" height="2.5" fill="#ffe9a8" :style="{ opacity: fillPct > 0 ? .85 : 0 }" />
        </g>
        <path d="M32 7c-5.5 0-9.5 2.5-11.5 6.5-4-1-7 1-6 5-5 6-8 13-8 21 0 14 10 24 25.5 24S57.5 53.5 57.5 39.5c0-8-3-15-8-21 1-4-2-6-6-5-2-4-6-6.5-11.5-6.5z" fill="none" stroke="#d8a94e" stroke-width="1.4" opacity=".85" />
        <path d="M12.5 24.5c-4.5 6-7 12.5-7 19 0 12.5 9 22.5 26 22.5" fill="none" stroke="rgba(230,194,128,.45)" stroke-width="1" stroke-dasharray="3 3.5" />
        <path d="M14 19.5c6 4 30 4 36 0" fill="none" stroke="#e6c280" stroke-width="1.3" />
        <path d="M32 39l2.1 4.4 4.8.7-3.5 3.3.8 4.8-4.2-2.3-4.2 2.3.8-4.8-3.5-3.3 4.8-.7z" fill="#e6c280" opacity=".9" />
      </svg>
      <div class="sack-copy">
        <p class="sack-overline">LA RÉSERVE</p>
        <strong>{{ readyCount }}<em>/{{ totalCount }}</em></strong>
        <span>{{ readyCount === totalCount ? 'Tout est embarqué — la route peut commencer.' : 'colis à bord' }}</span>
      </div>
    </section>

    <nav class="scope-tabs" aria-label="Filtrer par type">
      <button type="button" :class="{ active: filter === 'all' }" @click="filter = 'all'; haptic(6)">
        <motion.span v-if="filter === 'all'" layoutId="filter-pill" class="tab-pill" :transition="{ type: 'spring', stiffness: 380, damping: 32 }" aria-hidden="true" />
        <span class="tab-label">Tout</span>
      </button>
      <button v-for="group in groups" :key="group.id" type="button" :class="{ active: filter === group.id }" @click="filter = group.id; haptic(6)">
        <motion.span v-if="filter === group.id" layoutId="filter-pill" class="tab-pill" :transition="{ type: 'spring', stiffness: 380, damping: 32 }" aria-hidden="true" />
        <span class="tab-label">{{ group.label }}</span>
      </button>
    </nav>

    <section class="manifest" :key="filter" aria-label="Colis de la réserve">
      <template v-for="section in sections" :key="section.key">
        <h3 class="manifest-divider"><span>{{ section.label }}</span></h3>
        <button v-if="section.toggle" class="manifest-more" type="button" @click="toggleSection(section.toggle)">
          <i class="mdi" :class="section.open ? 'mdi-chevron-up' : 'mdi-chevron-down'" aria-hidden="true" />
          {{ section.open ? 'Replier' : `${lineCount(section.groups)} colis plus loin` }}
        </button>
        <template v-if="section.open">
          <template v-for="group in section.groups" :key="group.id">
            <h4 class="manifest-group">{{ group.label }}</h4>
            <ul class="parcels">
              <li v-for="(item, i) in group.items" :key="item.id" class="parcel" :class="{ done: done.has(item.id) }" :style="{ '--i': Math.min(i, 12) }">
                <button class="parcel-check" type="button" :aria-label="done.has(item.id) ? `Remettre ${item.title} au sol` : `Embarquer ${item.title}`" @click="embark(item.id, $event)"><i class="mdi" :class="done.has(item.id) ? 'mdi-check' : ''" aria-hidden="true" /></button>
                <RouterLink class="parcel-tag" :to="`/activites/${item.activityId}`">
                  <span class="parcel-day">J{{ item.day }}</span>
                  <span class="parcel-copy"><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></span>
                  <i class="mdi mdi-chevron-right parcel-go" aria-hidden="true" />
                </RouterLink>
              </li>
            </ul>
          </template>
        </template>
      </template>
    </section>
  </main>
</template>

<style scoped>
.prepare-screen {
  overflow:hidden
}

.warm-glow {
  position:absolute;
  top:-70px;
  right:-60px;
  width:300px;
  height:300px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(255,190,80,.14),transparent 65%);
  filter:blur(4px);
  pointer-events:none
}

/* ---- header ---- */
.prepare-header {
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

.prepare-overline {
  margin:26px 0 0;
  color:var(--color-gold);
  font-size:9px;
  font-weight:700;
  letter-spacing:.18em
}

.prepare-header h1 {
  margin:8px 0;
  color:#f8f0dd;
  font:500 38px/.95 var(--font-serif)
}

.prepare-header h1 em {
  color:var(--color-gold)
}

.prepare-header>p:last-child {
  max-width:330px;
  margin:0;
  color:#a9bcae;
  font-size:13px;
  line-height:1.5
}

/* ---- la réserve : sac qui se remplit ---- */
.sack {
  display:flex;
  align-items:center;
  gap:18px;
  margin-top:24px;
  padding:16px 20px;
  border:1px solid transparent;
  border-radius:22px;
  background:
    linear-gradient(165deg,#172e25 0%,#0e1f17 60%,#0c1a13 100%) padding-box,
    linear-gradient(155deg,rgba(241,204,122,.45),rgba(241,204,122,.1) 40%,rgba(241,204,122,.25) 100%) border-box;
  box-shadow:0 18px 42px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,244,214,.07)
}

.sack-figure {
  width:60px;
  height:68px;
  flex:0 0 auto;
  filter:drop-shadow(0 6px 14px rgba(0,0,0,.4))
}

.sack-figure rect {
  transition:y .5s cubic-bezier(.5,0,.2,1),height .5s cubic-bezier(.5,0,.2,1),opacity .3s
}

.sack-copy {
  min-width:0
}

.sack-overline {
  margin:0 0 6px;
  color:var(--color-gold);
  font-size:9px;
  font-weight:700;
  letter-spacing:.18em
}

.sack-copy strong {
  font:500 30px/1 var(--font-serif);
  color:#ffe9a8
}

.sack-copy strong em {
  font-style:normal;
  font-size:15px;
  color:#a9bcae
}

.sack-copy span {
  display:block;
  margin-top:5px;
  color:#a9bcae;
  font-size:11.5px
}

/* ---- filtres ---- */
.scope-tabs {
  display:flex;
  gap:7px;
  margin:22px 0 2px;
  overflow-x:auto;
  padding-bottom:2px;
  scrollbar-width:none
}

.scope-tabs::-webkit-scrollbar {
  display:none
}

.scope-tabs button {
  position:relative;
  flex:0 0 auto;
  padding:8px 15px;
  border:1px solid rgba(230,194,128,.25);
  border-radius:999px;
  background:rgba(255,255,255,.04);
  color:#a9bcae;
  font-family:inherit;
  font-size:11px;
  font-weight:600;
  cursor:pointer;
  transition:color .25s,border-color .25s,transform .35s var(--spring)
}

/* la pilule d'or glisse de filtre en filtre (layoutId) */
.tab-pill {
  position:absolute;
  inset:0;
  border-radius:999px;
  background:#e6c280;
  box-shadow:0 0 14px rgba(230,194,128,.4);
  pointer-events:none
}

.tab-label {
  position:relative;
  z-index:1
}

.scope-tabs button:active {
  transform:scale(.94)
}

.scope-tabs button.active {
  border-color:#e6c280;
  color:#12251e;
  font-weight:800
}

/* ---- manifeste : colis-étiquettes ---- */
.manifest-divider {
  display:flex;
  align-items:center;
  gap:10px;
  margin:24px 0 12px;
  color:#e6c280;
  font:700 10px/1 var(--font-sans);
  letter-spacing:.16em;
  text-transform:uppercase
}

.manifest-divider::after {
  content:'';
  flex:1;
  height:1px;
  background:linear-gradient(90deg,rgba(241,204,122,.35),transparent)
}

.manifest-group {
  margin:14px 0 8px;
  color:#8fa79a;
  font:italic 600 11px/1 var(--font-literary);
  letter-spacing:.14em;
  text-transform:uppercase
}

.manifest-more {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  width:100%;
  padding:11px;
  border:1px dashed rgba(230,194,128,.35);
  border-radius:999px;
  background:transparent;
  color:#e6c280;
  font-family:inherit;
  font-size:11.5px;
  font-weight:600;
  cursor:pointer;
  transition:background .25s
}

.manifest-more:hover {
  background:rgba(230,194,128,.08)
}

.manifest-more i {
  font-size:15px
}

.parcels {
  display:grid;
  gap:8px;
  list-style:none;
  margin:0;
  padding:0
}

/* colis : carte sombre translucide, le fond nuit respire dessous */
.parcel {
  display:flex;
  align-items:center;
  gap:12px;
  padding:11px 12px;
  border:1px solid rgba(230,194,128,.16);
  border-radius:15px;
  background:rgba(255,255,255,.045);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  box-shadow:0 10px 22px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.06);
  animation:parcel-in .7s var(--spring) calc(var(--i,0)*60ms) both;
  transition:opacity .3s
}

@keyframes parcel-in {
  from {
    opacity:0;
    transform:translateY(14px) scale(.98)
  }
}

.parcel.done {
  opacity:.45
}

/* le cercle de coche, irrégulier comme la cire — or plein à l'embarquement */
.parcel-check {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:24px;
  height:24px;
  padding:0;
  border:1.5px solid rgba(230,194,128,.75);
  border-radius:46% 54% 50% 50% / 52% 47% 55% 45%;
  background:transparent;
  color:#0c1b14;
  font-size:13px;
  cursor:pointer;
  transform:rotate(-4deg);
  transition:background .25s,box-shadow .25s,transform .3s var(--spring)
}

.parcel-check:active {
  transform:rotate(-4deg) scale(.85)
}

.parcel.done .parcel-check {
  background:#e6c280;
  box-shadow:0 0 12px rgba(230,194,128,.55)
}

.parcel-tag {
  display:flex;
  align-items:center;
  gap:11px;
  flex:1;
  min-width:0;
  color:#f2ead6;
  text-decoration:none
}

.parcel-tag:active {
  transform:scale(.98);
  transition:transform .35s var(--spring)
}

/* pastille jour */
.parcel-day {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:28px;
  height:28px;
  border:1px solid #e6c280;
  border-radius:50%;
  color:#e6c280;
  font-size:11px;
  font-weight:700
}

.parcel-copy {
  display:grid;
  flex:1;
  gap:1px;
  min-width:0;
  overflow:hidden
}

.parcel-copy strong {
  justify-self:start;
  position:relative;
  max-width:100%;
  overflow:hidden;
  color:#f2ead6;
  font-size:13.5px;
  font-weight:600;
  text-overflow:ellipsis;
  white-space:nowrap;
  transition:color .3s
}

.parcel-copy strong::after {
  content:'';
  position:absolute;
  left:-2px;
  right:-2px;
  top:54%;
  height:1.6px;
  border-radius:2px;
  background:rgba(230,194,128,.7);
  transform:scaleX(0);
  transform-origin:left center;
  transition:transform .4s cubic-bezier(.5,0,.2,1)
}

.parcel.done .parcel-copy strong {
  color:#7d948a
}

.parcel.done .parcel-copy strong::after {
  transform:scaleX(1)
}

.parcel-copy small {
  overflow:hidden;
  color:#cdbd92;
  font:italic 500 12px/1.4 var(--font-literary);
  text-overflow:ellipsis;
  white-space:nowrap;
  opacity:.95
}

.parcel-go {
  flex:0 0 auto;
  color:rgba(230,194,128,.5);
  font-size:18px
}

@media (prefers-reduced-motion:reduce) {
  .parcel {
    animation:none
  }

  .parcel-copy strong::after {
    transition:none
  }
}

.back-link:focus-visible,.scope-tabs button:focus-visible,.manifest-more:focus-visible,.parcel-check:focus-visible,.parcel-tag:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px;
  border-radius:8px
}
</style>

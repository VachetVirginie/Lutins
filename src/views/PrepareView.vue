<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { preparationCatalog, type PreparationCategory } from '../data/preparationCatalog'
import { haptic } from '../utils/haptics'

const router = useRouter()

function goBack(): void {
  if (window.history.state?.back) router.back()
  else router.push('/home')
}

type Filter = 'all' | PreparationCategory
const filter = ref<Filter>('all')
const done = ref<Set<string>>(new Set())

const groups: { id: PreparationCategory; label: string; icon: string }[] = [
  { id: 'print', label: 'À imprimer', icon: 'mdi-printer-outline' },
  { id: 'food', label: 'Aliments', icon: 'mdi-food-apple-outline' },
  { id: 'gift', label: 'Cadeaux', icon: 'mdi-gift-outline' },
  { id: 'material', label: 'Matériel & scène', icon: 'mdi-home-edit-outline' },
]

const visibleGroups = computed(() => groups
  .filter((group) => filter.value === 'all' || group.id === filter.value)
  .map((group) => ({ ...group, items: preparationCatalog.filter((item) => item.category === group.id) }))
  .filter((group) => group.items.length))
const readyCount = computed(() => done.value.size)
const totalCount = preparationCatalog.length

function toggle(id: string): void {
  const next = new Set(done.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  done.value = next
  haptic(12)
}
</script>

<template>
  <main class="app-screen prepare-screen">
    <i class="warm-glow" aria-hidden="true" />
    <header class="prepare-header">
      <button class="back-link" type="button" @click="goBack"><i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour</button>
      <p class="prepare-overline">TOUT LE KIT, AU BON ENDROIT</p>
      <h1>À prévoir</h1>
      <p>Impressions, aliments, cadeaux et matériel, classés par type puis par jour.</p>
    </header>

    <section class="prepare-summary" aria-label="Progression de la préparation">
      <div class="summary-top"><strong>{{ readyCount }}<em>/{{ totalCount }}</em></strong><span>éléments prêts</span></div>
      <div class="summary-bar"><i :style="{ width: (readyCount / totalCount) * 100 + '%' }" /></div>
    </section>

    <div class="prepare-filters" aria-label="Filtrer par type">
      <button type="button" :class="{ active: filter === 'all' }" @click="filter = 'all'">Tout</button>
      <button v-for="group in groups" :key="group.id" type="button" :class="{ active: filter === group.id }" @click="filter = group.id"><i :class="['mdi', group.icon]" aria-hidden="true" /> {{ group.label }}</button>
    </div>

    <section v-for="group in visibleGroups" :key="group.id" class="app-card prepare-group" :aria-labelledby="`group-${group.id}`">
      <header class="group-heading"><div><span class="group-icon"><i :class="['mdi', group.icon]" aria-hidden="true" /></span><h2 :id="`group-${group.id}`">{{ group.label }}</h2></div><span class="group-count">{{ group.items.length }}</span></header>
      <ul class="prepare-list">
        <li v-for="item in group.items" :key="item.id" class="prepare-item" :class="{ done: done.has(item.id) }">
          <button class="prepare-check" type="button" :aria-label="done.has(item.id) ? `Marquer ${item.title} comme non prêt` : `Marquer ${item.title} comme prêt`" @click="toggle(item.id)"><i class="mdi" :class="done.has(item.id) ? 'mdi-check' : ''" aria-hidden="true" /></button>
          <RouterLink class="prepare-item-copy" :to="`/activites/${item.activityId}`"><span class="prepare-day">J{{ item.day }}</span><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></RouterLink>
        </li>
      </ul>
    </section>

    <p class="prepare-note">Chaque élément reste relié à sa fiche du jour. Les textes et annexes proviennent du kit Louis.</p>
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

.prepare-header>p:last-child {
  max-width:330px;
  margin:0;
  color:#a9bcae;
  font-size:13px;
  line-height:1.5
}

/* ---- résumé progression ---- */
.prepare-summary {
  margin-top:24px;
  padding:18px 18px 16px;
  border:1px solid rgba(241,204,122,.22);
  border-radius:20px;
  background:rgba(255,255,255,.05);
  backdrop-filter:blur(16px);
  box-shadow:0 14px 36px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.07)
}

.summary-top {
  display:flex;
  align-items:baseline;
  gap:8px
}

.summary-top strong {
  font:500 26px var(--font-serif);
  color:#ffe9a8
}

.summary-top strong em {
  font-style:normal;
  font-size:14px;
  color:#a9bcae
}

.summary-top span {
  color:#a9bcae;
  font-size:11px
}

.summary-bar {
  height:5px;
  margin-top:12px;
  border-radius:4px;
  background:rgba(255,255,255,.09);
  overflow:hidden
}

.summary-bar i {
  display:block;
  height:100%;
  border-radius:4px;
  background:linear-gradient(90deg,#ffd700,#ffe9a8);
  box-shadow:0 0 8px rgba(255,215,0,.55);
  transition:width .4s ease
}

/* ---- filtres ---- */
.prepare-filters {
  display:flex;
  gap:7px;
  margin:20px 0 4px;
  overflow-x:auto;
  padding-bottom:2px;
  scrollbar-width:none
}

.prepare-filters::-webkit-scrollbar {
  display:none
}

.prepare-filters button {
  display:inline-flex;
  align-items:center;
  gap:6px;
  flex:0 0 auto;
  padding:8px 14px;
  border:1px solid rgba(255,255,255,.15);
  border-radius:999px;
  background:rgba(255,255,255,.05);
  color:#a9bcae;
  font-size:11px;
  font-weight:500;
  cursor:pointer;
  transition:background .25s,color .25s,border-color .25s,transform .35s var(--spring)
}

.prepare-filters button:active {
  transform:scale(.94)
}

.prepare-filters button i {
  font-size:14px
}

.prepare-filters button.active {
  border-color:#e6c280;
  background:#e6c280;
  color:#173b32;
  font-weight:700
}

/* ---- groupes ---- */
.prepare-group {
  margin-top:20px;
  padding:16px 16px 8px
}

.group-heading {
  display:flex;
  align-items:center;
  justify-content:space-between
}

.group-heading>div {
  display:flex;
  align-items:center;
  gap:10px
}

.group-icon {
  display:grid;
  place-items:center;
  width:32px;
  height:32px;
  border-radius:10px;
  background:rgba(230,194,128,.14);
  color:#e6c280;
  font-size:17px
}

.group-heading h2 {
  margin:0;
  color:#f5edd9;
  font:500 20px var(--font-serif)
}

.group-count {
  padding:4px 10px;
  border:1px solid rgba(241,204,122,.3);
  border-radius:999px;
  color:#e6c280;
  font-size:11px;
  font-weight:600
}

/* ---- items ---- */
.prepare-list {
  list-style:none;
  margin:12px 0 0;
  padding:0;
  border-top:1px solid rgba(255,255,255,.06)
}

.prepare-item {
  display:flex;
  align-items:center;
  gap:11px;
  padding:11px 0;
  border-bottom:1px solid rgba(255,255,255,.05)
}

.prepare-item:last-child {
  border-bottom:0
}

.prepare-check {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:24px;
  height:24px;
  padding:0;
  border:1.5px solid rgba(255,255,255,.3);
  border-radius:50%;
  background:transparent;
  color:#1c3a30;
  font-size:13px;
  cursor:pointer;
  transition:background .25s,border-color .25s,box-shadow .25s,transform .35s var(--spring)
}

.prepare-check:active {
  transform:scale(.85)
}

.prepare-item-copy:active {
  transform:scale(.98);
  transition:transform .35s var(--spring)
}

.prepare-item.done .prepare-check {
  border-color:#e6c280;
  background:#e6c280;
  box-shadow:0 0 10px rgba(230,194,128,.45)
}

.prepare-item-copy {
  display:grid;
  flex:1;
  gap:2px;
  min-width:0;
  color:#fff;
  text-decoration:none
}

.prepare-day {
  color:#e6c280;
  font-size:9px;
  font-weight:700;
  letter-spacing:.1em
}

.prepare-item-copy strong {
  overflow:hidden;
  font-size:14px;
  font-weight:600;
  text-overflow:ellipsis;
  white-space:nowrap
}

.prepare-item-copy small {
  overflow:hidden;
  color:#a9bcae;
  font-size:11px;
  line-height:1.4;
  text-overflow:ellipsis;
  white-space:nowrap
}

.prepare-item.done strong {
  color:#8ba195;
  text-decoration:line-through
}

.prepare-note {
  margin:26px 0 0;
  color:#718a7b;
  font-size:11px;
  font-style:italic;
  font-family:var(--font-serif);
  line-height:1.5
}

.back-link:focus-visible,.prepare-filters button:focus-visible,.prepare-check:focus-visible,.prepare-item-copy:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px;
  border-radius:6px
}
</style>

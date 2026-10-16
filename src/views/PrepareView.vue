<script setup lang="ts">
import { computed, ref } from 'vue'
import { HomeNav } from '../components/home'
import { preparationNext7Days } from '../data/adventure'

type Filter = 'all' | 'print' | 'buy' | 'gather'
interface UpcomingItem { id: string; day: string; title: string; type: Exclude<Filter, 'all'>; detail: string; activityId: string; done: boolean }
const filter = ref<Filter>('all')
const kindLabels: Record<Exclude<Filter, 'all'>, string> = { print: 'À imprimer', buy: 'À acheter', gather: 'À rassembler' }
const items = ref<UpcomingItem[]>(preparationNext7Days.map((item) => ({
  ...item,
  type: item.kind,
  day: `${item.day} · ${item.due.toLowerCase()}`,
  detail: kindLabels[item.kind],
  done: false,
})))
const visibleItems = computed(() => items.value.filter((item) => filter.value === 'all' || item.type === filter.value))
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tout' }, { id: 'print', label: 'À imprimer' }, { id: 'buy', label: 'À acheter' }, { id: 'gather', label: 'À rassembler' },
]
</script>

<template>
  <main class="prepare-screen">
    <header class="prepare-header"><RouterLink class="back-link" to="/"><i class="mdi mdi-chevron-left" /> Aventure</RouterLink><p class="prepare-overline">ANTICIPER SANS SE PRESSER</p><h1>À prévoir</h1><p>Les prochains éléments, du plus urgent au moins urgent.</p></header>
    <div class="prepare-filters" aria-label="Filtrer les éléments"><button v-for="item in filters" :key="item.id" type="button" :class="{ active: filter === item.id }" @click="filter = item.id">{{ item.label }}</button></div>
    <section class="prepare-list" aria-label="Éléments à prévoir"><div v-if="visibleItems.length === 0" class="prepare-empty">Aucun élément dans ce filtre.</div><article v-for="item in visibleItems" :key="item.id" class="prepare-item" :class="{ done: item.done }"><button class="prepare-check" type="button" :aria-label="item.done ? `Marquer ${item.title} comme non terminé` : `Marquer ${item.title} comme terminé`" @click="item.done = !item.done"><i class="mdi" :class="item.done ? 'mdi-check' : 'mdi-circle-outline'" /></button><div class="prepare-item-copy"><span class="prepare-day">{{ item.day }}</span><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></div><RouterLink class="prepare-link" :to="`/activites/${item.activityId}`" :aria-label="`Ouvrir la journée liée à ${item.title}`"><i class="mdi mdi-arrow-up-right" /></RouterLink></article></section>
    <p class="prepare-note">Chaque élément reste lié à sa journée. Quand la journée est prête, son matériel passe automatiquement en terminé.</p>
    <HomeNav />
  </main>
</template>

<style scoped>
.prepare-screen  {
  min-height:100svh;
  max-width:540px;
  margin:auto;
  padding:calc(22px + env(safe-area-inset-top)) 22px calc(92px + env(safe-area-inset-bottom));
  background:var(--color-night);
  color:#fff
}

.prepare-header  {
  padding-top:4px
}

.back-link  {
  display:inline-flex;
  align-items:center;
  gap:4px;
  color:var(--color-gold);
  font-size:12px;
  text-decoration:none
}

.prepare-overline  {
  margin:28px 0 0;
  color:var(--color-gold);
  font-size:9px;
  font-weight:700;
  letter-spacing:.18em
}

.prepare-header h1  {
  margin:8px 0;
  color:#f8f0dd;
  font:500 38px/.95 var(--font-serif)
}

.prepare-header>p:last-child  {
  max-width:300px;
  margin:0;
  color:#a9bcae;
  font-size:14px;
  line-height:1.5
}

.prepare-filters  {
  display:flex;
  gap:7px;
  margin:26px 0 18px;
  overflow-x:auto;
  padding-bottom:2px
}

.prepare-filters button  {
  flex:0 0 auto;
  padding:8px 12px;
  border:1px solid #ffffff25;
  border-radius:999px;
  background:#ffffff08;
  color:#a9bcae;
  font-size:11px
}

.prepare-filters button.active  {
  border-color:#e6c280;
  background:#e6c280;
  color:#173b32;
  font-weight:600
}

.prepare-list  {
  border-top:1px solid #ffffff1f
}

.prepare-item  {
  display:flex;
  align-items:center;
  gap:11px;
  padding:14px 0;
  border-bottom:1px solid #ffffff18
}

.prepare-check  {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:25px;
  height:25px;
  border:0;
  background:none;
  color:#e6c280;
  font-size:21px
}

.prepare-item.done .prepare-check  {
  color:#9ebca3
}

.prepare-item-copy  {
  display:grid;
  flex:1;
  gap:3px
}

.prepare-day  {
  color:#e6c280;
  font-size:9px;
  font-weight:700;
  letter-spacing:.1em
}

.prepare-item strong  {
  font-size:14px;
  font-weight:600
}

.prepare-item small  {
  color:#a9bcae;
  font-size:11px
}

.prepare-item.done strong  {
  color:#8ba195;
  text-decoration:line-through
}

.prepare-link  {
  display:grid;
  place-items:center;
  width:30px;
  height:30px;
  border-radius:50%;
  background:#ffffff0b;
  color:#e6c280;
  text-decoration:none
}

.prepare-note  {
  margin:24px 0;
  color:#718a7b;
  font-size:11px;
  line-height:1.5
}

</style>

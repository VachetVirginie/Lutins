<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { narrativeMilestones, upcomingJourneyActivities } from '../data/adventure'

const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/home')
}

type Phase = 'all' | 'voyage' | 'arrivee' | 'farce' | 'depart' | 'conclusion'
const phase = ref<Phase>('all')
const phaseLabels: { id: Phase; label: string }[] = [
  { id: 'all', label: 'Tout' }, { id: 'voyage', label: 'Voyage' }, { id: 'arrivee', label: 'Arrivée' }, { id: 'farce', label: 'Farces' },
]
const visibleMilestones = computed(() => phase.value === 'all' ? narrativeMilestones : narrativeMilestones.filter((item) => item.phase === phase.value))
</script>

<template>
  <main class="planning-screen">
    <header class="planning-header"><button class="back-link" type="button" @click="goBack"><i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour</button><p class="planning-overline">LE FIL DE L’HISTOIRE</p><h1>Le planning</h1><p>Les étapes essentielles de l’aventure, dans l’ordre du récit.</p></header>
    <section class="planning-progress"><div><strong>Jour 1</strong><span>sur 70</span></div><div class="planning-progress-bar"><i /></div><small>Le voyage commence</small></section>
    <section class="upcoming-days" aria-labelledby="upcoming-title"><div class="section-heading"><div><p class="planning-overline">À VENIR</p><h2 id="upcoming-title">Les prochains jours</h2></div><span>Voyage</span></div><ol class="day-list"><li v-for="activity in upcomingJourneyActivities" :key="activity.id" :class="{ current: activity.day === 'J1' }"><span class="day-marker">{{ activity.day }}</span><RouterLink :to="`/activites/${activity.id}`"><strong>{{ activity.title }}</strong><small>{{ activity.detail }}</small></RouterLink><i v-if="activity.day === 'J1'" class="mdi mdi-check-circle-outline current-icon" aria-hidden="true" /></li></ol></section>
    <section class="milestones" aria-labelledby="milestones-title"><div class="section-heading"><div><p class="planning-overline">LES REPÈRES</p><h2 id="milestones-title">Les grandes étapes</h2></div><span>Essentiel</span></div><div class="phase-filters" aria-label="Filtrer les phases"><button v-for="item in phaseLabels" :key="item.id" type="button" :class="{ active: phase === item.id }" @click="phase = item.id">{{ item.label }}</button></div><ol class="milestone-list"><li v-for="item in visibleMilestones" :key="item.day" :class="{ current: item.status === 'active' }"><span class="milestone-day">J{{ item.day }}</span><div><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></div><span v-if="item.status === 'active'" class="current-badge">En cours</span></li></ol></section>
    <p class="planning-note">Les journées peuvent être déplacées ou remplacées depuis leur fiche, sans modifier le fil narratif de référence.</p>
  </main>
</template>

<style scoped>
.planning-screen  {
  min-height:100svh;
  max-width:540px;
  margin:auto;
  padding:calc(22px + env(safe-area-inset-top)) 22px calc(92px + env(safe-area-inset-bottom));
  background:var(--color-night);
  color:#fff
}

.planning-header  {
  padding-top:4px
}

.back-link  {
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

.planning-overline  {
  margin:28px 0 0;
  color:var(--color-gold);
  font-size:9px;
  font-weight:700;
  letter-spacing:.18em
}

.planning-header h1  {
  margin:8px 0;
  color:#f8f0dd;
  font:500 38px/.95 var(--font-serif)
}

.planning-header>p:last-child  {
  max-width:320px;
  margin:0;
  color:#a9bcae;
  font-size:14px;
  line-height:1.5
}

.planning-progress  {
  margin:27px 0 30px;
  padding:17px 0;
  border-top:1px solid #ffffff1f;
  border-bottom:1px solid #ffffff1f
}

.planning-progress>div:first-child  {
  display:flex;
  align-items:baseline;
  gap:6px
}

.planning-progress strong  {
  font:500 24px var(--font-serif);
  color:#f5edd9
}

.planning-progress span,.planning-progress small  {
  color:#a9bcae;
  font-size:11px
}

.planning-progress-bar  {
  height:4px;
  margin:10px 0 7px;
  background:#ffffff1c;
  border-radius:4px;
  overflow:hidden
}

.planning-progress-bar i  {
  display:block;
  width:3%;
  height:100%;
  background:#e6c280;
  border-radius:4px
}

.section-heading  {
  display:flex;
  align-items:flex-end;
  justify-content:space-between
}

.section-heading h2  {
  margin:6px 0 0;
  color:#f5edd9;
  font:500 25px var(--font-serif)
}

.section-heading>span  {
  color:#e6c280;
  font-size:11px
}

.day-list,.milestone-list  {
  list-style:none;
  margin:14px 0 0;
  padding:0;
  border-top:1px solid #ffffff1f
}

.day-list li,.milestone-list li  {
  display:flex;
  align-items:center;
  gap:12px;
  padding:13px 0;
  border-bottom:1px solid #ffffff18
}

.day-marker,.milestone-day  {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:35px;
  height:35px;
  border:1px solid #e6c28066;
  border-radius:11px;
  color:#e6c280;
  font-size:10px;
  font-weight:700
}

.day-list li.current .day-marker  {
  background:#e6c280;
  color:#173b32
}

.day-list a  {
  display:grid;
  flex:1;
  gap:3px;
  color:#fff;
  text-decoration:none
}

.day-list strong,.milestone-list strong  {
  font-size:14px;
  font-weight:600
}

.day-list small,.milestone-list small  {
  color:#a9bcae;
  font-size:11px;
  line-height:1.4
}

.current-icon  {
  color:#e6c280;
  font-size:18px
}

.milestones  {
  margin-top:32px
}

.phase-filters  {
  display:flex;
  gap:7px;
  margin:16px 0 12px;
  overflow-x:auto
}

.phase-filters button  {
  flex:0 0 auto;
  padding:8px 12px;
  border:1px solid #ffffff25;
  border-radius:999px;
  background:#ffffff08;
  color:#a9bcae;
  font-size:11px
}

.phase-filters button.active  {
  border-color:#e6c280;
  background:#e6c280;
  color:#173b32;
  font-weight:600
}

.milestone-list li  {
  align-items:flex-start
}

.milestone-list li.current  {
  border-left:2px solid #e6c280;
  padding-left:10px
}

.milestone-list li>div  {
  display:grid;
  flex:1;
  gap:3px
}

.milestone-day  {
  width:auto;
  min-width:35px;
  height:27px;
  border-radius:8px
}

.current-badge  {
  padding:5px 7px;
  border-radius:6px;
  background:#e6c280;
  color:#173b32;
  font-size:9px;
  font-weight:700
}

.planning-note  {
  margin:26px 0 0;
  color:#718a7b;
  font-size:11px;
  line-height:1.5
}

</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { preparationNext7Days } from '../../data/adventure'
import { dailySheets } from '../../data/dailySheets'

const items = ref(preparationNext7Days.map((item) => ({ ...item, done: false })))
const TOTAL_PREP = items.value.length
const isOpen = ref(false)
const doneCount = computed(() => items.value.filter((item) => item.done).length)

const upcomingDays = computed(() => Array.from({ length: 7 }, (_, index) => {
  const day = index + 1
  const dayItems = items.value.filter((item) => item.day === `J${day}`)
  return {
    day,
    title: dailySheets[day].title,
    detail: dayItems.length ? `${dayItems.length} élément${dayItems.length > 1 ? 's' : ''} à préparer` : 'Voir la fiche du jour',
    done: dayItems.length > 0 && dayItems.every((item) => item.done),
    activityId: day === 1 ? 'jour-1-alerte-pole-nord' : day === 2 ? 'jour-2-preparation-sac' : day === 3 ? 'jour-3-depart-traineau' : day === 4 ? 'jour-4-pause-gouter' : `jour-${day}`,
  }
}))
</script>

<template>
  <section class="home-prep" :class="{ collapsed: !isOpen }">
    <button class="section-heading" type="button" :aria-expanded="isOpen" aria-controls="upcoming-preparation" @click="isOpen = !isOpen">
      <div><p class="home-overline">DANS LES 7 PROCHAINS JOURS</p><h2>À anticiper</h2></div>
      <span>{{ doneCount }}/{{ TOTAL_PREP }} prêts</span><i class="section-toggle mdi" :class="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" aria-hidden="true" />
    </button>
    <div v-show="isOpen" id="upcoming-preparation">
      <ul class="prep-list">
        <li v-for="day in upcomingDays" :key="day.day">
          <div class="prep-row" :class="{ 'is-done': day.done }">
            <span class="prep-day" :class="{ done: day.done }">J{{ day.day }}</span>
            <RouterLink class="prep-text" :to="`/activites/${day.activityId}`"><strong>{{ day.title }}</strong><small>{{ day.detail }}</small></RouterLink>
            <RouterLink class="prep-chevron" :to="`/activites/${day.activityId}`" :aria-label="`Ouvrir la fiche du jour ${day.day}`"><i class="mdi mdi-arrow-up-right" aria-hidden="true" /></RouterLink>
          </div>
        </li>
      </ul>
    </div>
    <RouterLink class="prep-link" to="/prepare">Voir tout le kit par type <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
  </section>
</template>

<style scoped>
.home-prep{margin-top:28px}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;width:100%;padding:0;border:0;background:none;text-align:left;cursor:pointer}.section-heading .home-overline{font-size:11px;letter-spacing:.12em;color:rgba(255,255,255,.6)}.home-prep h2{margin:6px 0 0;font:500 26px var(--font-serif);color:#fff}.section-heading>span{margin-left:auto;font-size:13px;color:#e6c280}.section-toggle{margin-left:10px;color:#e6c280;font-size:18px}.prep-list{list-style:none;margin:14px 0 0;padding:0;border-top:1px solid rgba(255,255,255,.05)}.prep-row{display:flex;align-items:center;gap:10px;width:100%;padding:11px 2px;border-bottom:1px solid rgba(255,255,255,.05)}.prep-day{display:grid;place-items:center;flex:0 0 auto;width:29px;height:25px;border:1px solid #e6c28066;border-radius:8px;color:#e6c280;font-size:9px;font-weight:700}.prep-day.done{background:#e6c280;color:#173b32}.prep-text{flex:1;display:grid;gap:3px;text-decoration:none}.prep-text strong{font-size:14px;font-weight:500;color:#fff}.prep-text small{font-size:11px;color:rgba(255,255,255,.5)}.prep-row.is-done .prep-text strong{color:rgba(255,255,255,.45)}.prep-chevron{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;color:rgba(255,255,255,.5);font-size:15px;text-decoration:none}.prep-link{display:flex;align-items:center;gap:7px;margin-top:16px;color:#e6c280;font-size:12px;text-decoration:none}.section-heading:focus-visible,.prep-text:focus-visible,.prep-chevron:focus-visible{outline:2px solid #ffe9a8;outline-offset:3px;border-radius:6px}
</style>

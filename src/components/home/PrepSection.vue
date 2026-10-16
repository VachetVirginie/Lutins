<script setup lang="ts">
import { computed, ref } from 'vue'

interface PrepItem {
  label: string
  detail: string
  done: boolean
}

const TOTAL_PREP = 1

const items = ref<PrepItem[]>([
  { label: 'Alerte du Pôle Nord', detail: 'Courrier essentiel · aujourd’hui', done: false },
])

const doneCount = computed(() => items.value.filter((i) => i.done).length)
</script>

<template>
  <section class="home-prep">
    <div class="section-heading">
      <div>
        <p class="home-overline">DANS LES 7 PROCHAINS JOURS</p>
        <h2>À anticiper</h2>
      </div>
      <span>{{ doneCount }}/{{ TOTAL_PREP }} prêts</span>
    </div>
    <ul class="prep-list">
      <li v-for="item in items" :key="item.label">
        <button class="prep-row" type="button" :class="{ 'is-done': item.done }" @click="item.done = !item.done">
          <span class="prep-check"><i v-if="item.done" class="mdi mdi-check" aria-hidden="true" /></span>
          <span class="prep-text"><strong>{{ item.label }}</strong><small>{{ item.detail }}</small></span>
          <i class="prep-chevron mdi mdi-chevron-right" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <RouterLink class="prep-link" to="/prepare">Voir toute la préparation <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
  </section>
</template>

<style scoped>
.home-prep{margin-top:28px}
.section-heading{display:flex;align-items:flex-end;justify-content:space-between}
.section-heading .home-overline{font-size:11px;letter-spacing:.12em;color:rgba(255,255,255,.6)}
.home-prep h2{margin:6px 0 0;font:500 26px var(--font-serif);color:#fff}
.section-heading>span{font-size:13px;color:#e6c280}
.prep-list{list-style:none;margin:14px 0 0;padding:0;border-top:1px solid rgba(255,255,255,.05)}
.prep-row{display:flex;align-items:center;gap:13px;width:100%;padding:13px 2px;border:0;border-bottom:1px solid rgba(255,255,255,.05);background:none;text-align:left;cursor:pointer}
.prep-check{display:grid;place-items:center;width:24px;height:24px;flex:0 0 auto;border:1.5px solid rgba(255,255,255,.3);border-radius:50%;background:transparent;color:#1c3a30;font-size:13px;transition:background .25s,border-color .25s,box-shadow .25s}
.prep-row.is-done .prep-check{background:#e6c280;border-color:#e6c280;box-shadow:0 0 10px rgba(230,194,128,.4)}
.prep-text{flex:1;display:grid;gap:3px}
.prep-text strong{font-size:16px;font-weight:500;color:#fff;transition:color .25s}
.prep-text small{font-size:11px;color:rgba(255,255,255,.5)}
.prep-row.is-done .prep-text strong{color:rgba(255,255,255,.45)}
.prep-chevron{color:rgba(255,255,255,.5);font-size:15px}
.prep-link{display:flex;align-items:center;gap:7px;margin-top:16px;color:#e6c280;font-size:12px;text-decoration:none}
</style>

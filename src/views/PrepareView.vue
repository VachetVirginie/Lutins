<script setup lang="ts">
import { computed, ref } from 'vue'
import { HomeNav } from '../components/home'

interface Item {
  label: string
  detail: string
  done: boolean
}

const tasks = ref<Item[]>([
  { label: 'Écrire la lettre de bienvenue', detail: 'Échéance · J-6', done: true },
  { label: 'Préparer la scène du salon', detail: 'Échéance · J-3', done: false },
  { label: 'Cacher le sac du lutin', detail: 'Échéance · J-2', done: false },
  { label: 'Briefer les grands-parents', detail: 'Échéance · J-7', done: true },
])

const material = ref<{ group: string; items: Item[] }[]>([
  {
    group: 'Papeterie',
    items: [
      { label: 'Papier cartonné doré', detail: 'Pour la carte du voyage', done: true },
      { label: 'Encre rouge & plume', detail: 'Pour les lettres du lutin', done: false },
    ],
  },
  {
    group: 'Gourmandises',
    items: [
      { label: 'Biscuits de Noël', detail: 'Farce du matin J+3', done: false },
      { label: 'Mini marshmallows', detail: 'Scène du chocolat chaud', done: false },
    ],
  },
  {
    group: 'Décor',
    items: [
      { label: 'Petite échelle', detail: 'Accès à l’étagère du salon', done: true },
      { label: 'Fil doré', detail: 'Décors suspendus', done: false },
    ],
  },
])

const prints = ref<Item[]>([
  { label: 'Carte du voyage', detail: 'A5 · recto-verso', done: true },
  { label: 'Lettre du Père Noël', detail: 'A4 · parchemin', done: false },
  { label: 'Étiquettes cadeaux', detail: 'Planche de 8', done: false },
])

const allItems = computed(() => [...tasks.value, ...material.value.flatMap((g) => g.items), ...prints.value])
const doneCount = computed(() => allItems.value.filter((i) => i.done).length)
const progress = computed(() => Math.round((doneCount.value / allItems.value.length) * 100))
</script>

<template>
  <main class="app-screen">
    <header class="app-header">
      <p class="home-overline">PRÉPARATION</p>
      <h1>Tout prévoir</h1>
      <p>Matériel, impressions et petites attentions avant l’arrivée.</p>
    </header>
    <HomeNav />

    <section class="app-card countdown">
      <div class="count-left">
        <span class="count-badge">J-7</span>
        <div><strong>Arrivée dans 7 jours</strong><small>{{ doneCount }}/{{ allItems.length }} prêts</small></div>
      </div>
      <div class="count-bar"><i :style="{ width: progress + '%' }" /></div>
    </section>

    <section class="app-card">
      <p class="home-overline">TÂCHES</p>
      <h2>Cette semaine</h2>
      <ul class="prep-list">
        <li v-for="item in tasks" :key="item.label">
          <button class="prep-row" type="button" :class="{ 'is-done': item.done }" @click="item.done = !item.done">
            <span class="prep-check"><i v-if="item.done" class="mdi mdi-check" aria-hidden="true" /></span>
            <span class="prep-text"><strong>{{ item.label }}</strong><small>{{ item.detail }}</small></span>
          </button>
        </li>
      </ul>
    </section>

    <section v-for="g in material" :key="g.group" class="app-card">
      <p class="home-overline">MATÉRIEL</p>
      <h2>{{ g.group }}</h2>
      <ul class="prep-list">
        <li v-for="item in g.items" :key="item.label">
          <button class="prep-row" type="button" :class="{ 'is-done': item.done }" @click="item.done = !item.done">
            <span class="prep-check"><i v-if="item.done" class="mdi mdi-check" aria-hidden="true" /></span>
            <span class="prep-text"><strong>{{ item.label }}</strong><small>{{ item.detail }}</small></span>
          </button>
        </li>
      </ul>
    </section>

    <section class="app-card">
      <p class="home-overline">IMPRESSIONS</p>
      <h2>À imprimer</h2>
      <ul class="prep-list">
        <li v-for="item in prints" :key="item.label">
          <button class="prep-row" type="button" :class="{ 'is-done': item.done }" @click="item.done = !item.done">
            <span class="prep-check"><i v-if="item.done" class="mdi mdi-check" aria-hidden="true" /></span>
            <span class="prep-text"><strong>{{ item.label }}</strong><small>{{ item.detail }}</small></span>
            <i class="mdi mdi-printer-outline print-ico" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
/* ---- échéance ---- */
.countdown{display:grid;gap:14px}
.count-left{display:flex;align-items:center;gap:14px}
.count-badge{display:grid;place-items:center;width:52px;height:52px;flex:0 0 auto;border-radius:16px;background:linear-gradient(180deg,#f5d78f,#d9ac54);color:#1c3a30;font:700 15px var(--font-serif);box-shadow:0 8px 20px rgba(217,172,84,.35)}
.count-left strong{display:block;font:500 17px var(--font-serif);color:#f5edd9}
.count-left small{font-size:12px;color:#e6c280}
.count-bar{height:5px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden}
.count-bar i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#ffd700,#ffe9a8);box-shadow:0 0 8px rgba(255,215,0,.6);transition:width .4s ease}

/* ---- checklists ---- */
.prep-list{list-style:none;margin:0;padding:0;border-top:1px solid rgba(255,255,255,.05)}
.prep-row{display:flex;align-items:center;gap:13px;width:100%;padding:12px 2px;border:0;border-bottom:1px solid rgba(255,255,255,.05);background:none;text-align:left;cursor:pointer}
.prep-list li:last-child .prep-row{border-bottom:0}
.prep-check{display:grid;place-items:center;width:24px;height:24px;flex:0 0 auto;border:1.5px solid rgba(255,255,255,.3);border-radius:50%;background:transparent;color:#1c3a30;font-size:13px;transition:background .25s,border-color .25s,box-shadow .25s}
.prep-row.is-done .prep-check{background:#e6c280;border-color:#e6c280;box-shadow:0 0 10px rgba(230,194,128,.4)}
.prep-text{flex:1;display:grid;gap:3px}
.prep-text strong{font-size:15px;font-weight:500;color:#fff;transition:color .25s}
.prep-text small{font-size:11px;color:rgba(255,255,255,.5)}
.prep-row.is-done .prep-text strong{color:rgba(255,255,255,.45)}
.print-ico{color:rgba(255,255,255,.45);font-size:17px}
</style>

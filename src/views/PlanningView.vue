<script setup lang="ts">
import { HomeNav } from '../components/home'

const phases = [
  { day: 'J1', title: 'Alerte du Pôle Nord', detail: 'Un premier courrier donne le signal du départ.', active: true },
  { day: 'J30', title: 'Arrivée du premier lutin', detail: 'La rencontre lance les farces quotidiennes.', done: false },
  { day: 'J46', title: 'Arrivée du second lutin', detail: 'Un nouveau personnage rejoint l’aventure.', done: false },
  { day: 'J60', title: 'Départ du second lutin', detail: 'Une transition importante dans le récit.', done: false },
  { day: 'J70', title: 'Lettre finale du Père Noël', detail: 'La conclusion de l’aventure.', done: false },
]

const activities = [
  { id: 'jour-1-alerte-pole-nord', date: 'J1', title: 'Alerte du Pôle Nord', detail: 'Courrier essentiel · aujourd’hui.' },
  { id: 'jour-2-preparation-sac', date: 'J2', title: 'Préparation du sac', detail: 'Carte et petit élément de voyage.' },
  { id: 'jour-3-depart-traineau', date: 'J3', title: 'Départ en traîneau', detail: 'Carte et coloriage.' },
  { id: 'jour-4-pause-gouter', date: 'J4', title: 'Première pause goûter', detail: 'Courrier.' },
]

const events = [
  { date: 'J30', title: 'Arrivée du premier lutin', detail: 'Événement essentiel.', icon: 'mdi-star-four-points' },
  { date: 'J46', title: 'Arrivée du second lutin', detail: 'Événement essentiel.', icon: 'mdi-account-multiple-outline' },
  { date: 'J70', title: 'Lettre finale du Père Noël', detail: 'Conclusion essentielle.', icon: 'mdi-email-heart-outline' },
]

const customizations = [
  { icon: 'mdi-tag-heart', title: 'Prénom du lutin', detail: 'À personnaliser' },
  { icon: 'mdi-map-marker-outline', title: 'Ville et destination', detail: 'À personnaliser' },
  { icon: 'mdi-calendar-edit-outline', title: 'Date de début', detail: 'À définir' },
]
</script>

<template>
  <main class="app-screen">
    <header class="app-header">
      <p class="home-overline">PLANNING</p>
      <h1>Le grand voyage</h1>
      <p>Toute l’aventure, jour après jour, jusqu’au retour au Pôle Nord.</p>
    </header>
    <section class="app-card">
      <p class="home-overline">TIMELINE NARRATIVE</p>
      <h2>Les grandes étapes</h2>
      <ol class="timeline">
        <li v-for="p in phases" :key="p.day" :class="{ 'is-done': p.done, 'is-active': p.active }">
          <span class="tl-dot" aria-hidden="true" />
          <div class="tl-body">
            <span class="tl-day">{{ p.day }}</span>
            <strong>{{ p.title }}</strong>
            <small>{{ p.detail }}</small>
          </div>
        </li>
      </ol>
    </section>

    <section class="app-card">
      <p class="home-overline">ACTIVITÉS</p>
      <h2>Farces prévues</h2>
      <ul class="row-list">
        <li v-for="a in activities" :key="a.id">
          <RouterLink class="row-link" :to="`/activites/${a.id}`">
            <span class="date-chip">{{ a.date }}</span>
            <div class="row-body"><strong>{{ a.title }}</strong><small>{{ a.detail }}</small></div>
            <i class="mdi mdi-chevron-right row-chev" aria-hidden="true" />
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="app-card">
      <p class="home-overline">ÉVÉNEMENTS</p>
      <h2>Dates fortes</h2>
      <ul class="row-list">
        <li v-for="e in events" :key="e.title">
          <span class="ev-icon"><i :class="['mdi', e.icon]" aria-hidden="true" /></span>
          <div class="row-body"><strong>{{ e.title }}</strong><small>{{ e.date }} · {{ e.detail }}</small></div>
        </li>
      </ul>
    </section>

    <section class="app-card">
      <p class="home-overline">PERSONNALISATION</p>
      <h2>Votre histoire, vos règles</h2>
      <ul class="row-list">
        <li v-for="c in customizations" :key="c.title">
          <span class="ev-icon"><i :class="['mdi', c.icon]" aria-hidden="true" /></span>
          <div class="row-body"><strong>{{ c.title }}</strong><small>{{ c.detail }}</small></div>
          <i class="mdi mdi-chevron-right row-chev" aria-hidden="true" />
        </li>
      </ul>
    </section>
    <HomeNav />
  </main>
</template>

<style scoped>
/* ---- timeline narrative ---- */
.timeline{position:relative;list-style:none;margin:4px 0 0;padding:0 0 0 2px}
.timeline::before{content:'';position:absolute;left:10px;top:8px;bottom:8px;width:2px;border-radius:2px;background:rgba(170,160,110,.16)}
.timeline li{position:relative;display:flex;gap:14px;padding:11px 0 11px 28px}
.timeline li::before{content:'';position:absolute;left:10px;top:0;width:2px;height:100%;background:linear-gradient(180deg,#ffd700,#ffe9a8);box-shadow:0 0 8px rgba(255,215,0,.55);opacity:0;transition:opacity .3s}
.timeline li.is-done::before,.timeline li.is-active::before{opacity:1}
.timeline li.is-active::before{height:50%}
.tl-dot{position:absolute;left:5px;top:15px;width:12px;height:12px;border-radius:50%;border:2px solid rgba(241,204,122,.4);background:#0e241d}
.is-done .tl-dot{background:#e6c280;border-color:#e6c280;box-shadow:0 0 8px rgba(230,194,128,.5)}
.is-active .tl-dot{width:16px;height:16px;left:3px;top:13px;background:#ffe9a8;border-color:#ffd700;box-shadow:0 0 12px rgba(255,215,0,.8),0 0 30px rgba(255,215,0,.4)}
.tl-body{display:grid;gap:2px}
.tl-day{font-size:9px;font-weight:700;letter-spacing:.14em;color:rgba(255,255,255,.4)}
.is-active .tl-day,.is-done .tl-day{color:var(--color-gold)}
.tl-body strong{font-size:15px;font-weight:600;color:rgba(255,255,255,.5)}
.is-done .tl-body strong,.is-active .tl-body strong{color:#fff}
.is-active .tl-body strong{color:#ffe9a8}
.tl-body small{font-size:11px;color:rgba(255,255,255,.45);line-height:1.4}

/* ---- listes ---- */
.row-list{list-style:none;margin:0;padding:0}
.row-list li{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.row-link{display:flex;flex:1;align-items:center;gap:12px;text-decoration:none}
.row-list li:last-child{border-bottom:0;padding-bottom:2px}
.date-chip{flex:0 0 auto;min-width:44px;padding:6px 0;border:1px solid rgba(241,204,122,.35);border-radius:10px;background:rgba(241,204,122,.08);color:var(--color-gold);font-size:10px;font-weight:700;text-align:center}
.ev-icon{display:grid;place-items:center;flex:0 0 auto;width:34px;height:34px;border-radius:12px;background:rgba(241,204,122,.1);color:var(--color-gold);font-size:17px}
.row-body{flex:1;display:grid;gap:2px}
.row-body strong{font-size:14px;font-weight:600;color:#fff}
.row-body small{font-size:11px;color:rgba(255,255,255,.5);line-height:1.4}
.row-chev{color:rgba(255,255,255,.45);font-size:15px}
</style>

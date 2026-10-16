<script setup lang="ts">
import { HomeNav } from '../components/home'

const phases = [
  { day: 'J1', title: 'Départ du Pôle Nord', detail: 'Le lutin quitte l’atelier du Père Noël.', done: true },
  { day: 'J30', title: 'Le grand voyage', detail: 'En route vers votre maison.', active: true },
  { day: 'J58', title: 'La rencontre', detail: 'Premier matin dans le salon.', done: false },
  { day: 'J62', title: 'Deux lutins', detail: 'Un compagnon le rejoint.', done: false },
  { day: 'J70', title: 'Retour au Pôle Nord', detail: 'Au revoir jusqu’à l’année prochaine.', done: false },
]

const activities = [
  { id: 'farce-reveil', date: '2 déc', title: 'Farce du réveil', detail: 'Des empreintes de pas en farine jusqu’à la cuisine.' },
  { id: 'chasse-tresor', date: '5 déc', title: 'Chasse au trésor', detail: 'Indices cachés dans la maison, trésor : chocolats.' },
  { id: 'nuit-guirlandes', date: '9 déc', title: 'Nuit des guirlandes', detail: 'Le lutin enroule les câbles autour du sapin.' },
  { id: 'atelier-biscuits', date: '14 déc', title: 'Atelier biscuits', detail: 'Il prépare la pâte pendant la nuit.' },
]

const events = [
  { date: '1 déc', title: 'Arrivée du premier lutin', detail: 'Lettre de bienvenue + scène du salon.', icon: 'mdi-star-four-points' },
  { date: '15 déc', title: 'Veillée contes', detail: 'Le lutin apporte un nouveau livre de Noël.', icon: 'mdi-book-open-variant' },
  { date: '24 déc', title: 'Nuit du départ', detail: 'Note d’adieu posée près du sapin.', icon: 'mdi-moon-waning-crescent' },
]

const customizations = [
  { icon: 'mdi-tag-heart', title: 'Prénom du lutin', detail: 'Flocon — choisi en famille' },
  { icon: 'mdi-home-heart', title: 'Règles de la maison', detail: 'On regarde, on ne touche pas' },
  { icon: 'mdi-gift', title: 'Touches personnelles', detail: 'Références aux passions des enfants' },
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

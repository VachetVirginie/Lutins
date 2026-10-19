<script setup lang="ts">
import { motion } from 'motion-v'

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true, margin: '-40px' as const },
  transition: { type: 'spring' as const, stiffness: 170, damping: 25 },
}

const doneActivities = [
  { date: '12 nov', title: 'Lecture de la première lettre', detail: 'Découverte du voyage à venir.' },
  { date: '8 nov', title: 'Préparation du carnet', detail: 'Les enfants ont décoré le carnet du lutin.' },
  { date: '2 nov', title: 'Choix du prénom', detail: 'Vote en famille : ce sera Flocon.' },
]

const photos = [
  { src: '/assets/created/arrival-living-room.png', caption: 'Le salon prêt' },
  { src: '/assets/created/journey-station.png', caption: 'Le voyage' },
  { src: '/assets/created/journey-backpack.png', caption: 'Le sac du lutin' },
  { src: '/assets/created/arrival-mobile-hero.png', caption: 'La forêt' },
]

const notes = [
  { author: 'Léa', date: '12 nov', text: 'J’espère que le lutin aimera nos biscuits. J’ai laissé un verre de lait près de la cheminée.' },
  { author: 'Papa', date: '8 nov', text: 'Scène du salon presque prête. Manque plus que la petite échelle — commande passée.' },
]
</script>

<template>
  <main class="app-screen">
    <header class="app-header">
      <p class="home-overline">SOUVENIRS</p>
      <h1>La mémoire du voyage</h1>
      <p>Ce que votre famille a déjà vécu — et ce qu’il reste à écrire.</p>
    </header>
    <motion.section class="app-card" v-bind="reveal">
      <p class="home-overline">ACTIVITÉS RÉALISÉES</p>
      <h2>Déjà accompli</h2>
      <ul class="done-list">
        <li v-for="a in doneActivities" :key="a.title">
          <span class="done-check"><i class="mdi mdi-check" aria-hidden="true" /></span>
          <div class="done-body"><strong>{{ a.title }}</strong><small>{{ a.date }} · {{ a.detail }}</small></div>
        </li>
      </ul>
    </motion.section>

    <motion.section class="app-card" v-bind="reveal">
      <p class="home-overline">PHOTOS</p>
      <h2>L’album du voyage</h2>
      <div class="photo-grid">
        <figure v-for="(p, i) in photos" :key="p.src">
          <img :src="p.src" :alt="p.caption" :aria-labelledby="`photo-cap-${i}`" loading="lazy" />
          <figcaption :id="`photo-cap-${i}`">{{ p.caption }}</figcaption>
        </figure>
        <button class="photo-add" type="button" aria-label="Ajouter une photo">
          <i class="mdi mdi-camera-plus-outline" aria-hidden="true" />
          <span>Ajouter</span>
        </button>
      </div>
    </motion.section>

    <motion.section class="app-card" v-bind="reveal">
      <p class="home-overline">NOTES FAMILIALES</p>
      <h2>Le mot de chacun</h2>
      <article v-for="n in notes" :key="n.date" class="note">
        <header><strong>{{ n.author }}</strong><small>{{ n.date }}</small></header>
        <p>{{ n.text }}</p>
      </article>
      <button class="note-add" type="button"><i class="mdi mdi-plus" aria-hidden="true" /> Ajouter une note</button>
    </motion.section>
  </main>
</template>

<style scoped>
/* ---- activités réalisées ---- */ .done-list  {
  list-style:none;
  margin:0;
  padding:0
}

.done-list li  {
  display:flex;
  gap:12px;
  padding:11px 0;
  border-bottom:1px solid rgba(255,255,255,.05)
}

.done-list li:last-child  {
  border-bottom:0;
  padding-bottom:2px
}

.done-check  {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:22px;
  height:22px;
  margin-top:1px;
  border-radius:50%;
  background:rgba(230,194,128,.16);
  color:#e6c280;
  font-size:12px;
  box-shadow:0 0 8px rgba(230,194,128,.25)
}

.done-body  {
  display:grid;
  gap:2px
}

.done-body strong  {
  font-size:14px;
  font-weight:600;
  color:#fff
}

.done-body small  {
  font-size:11px;
  color:rgba(255,255,255,.5)
}

/* ---- photos ---- */ .photo-grid  {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-top:2px
}

.photo-grid figure  {
  position:relative;
  margin:0;
  border-radius:14px;
  overflow:hidden;
  border:1px solid rgba(241,204,122,.22);
  box-shadow:0 8px 20px rgba(0,0,0,.3)
}

.photo-grid img  {
  display:block;
  width:100%;
  aspect-ratio:1;
  object-fit:cover
}

.photo-grid figcaption  {
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  padding:16px 9px 7px;
  background:linear-gradient(180deg,transparent,rgba(7,20,14,.85));
  color:#f5edd9;
  font-size:10px;
  font-weight:600;
  letter-spacing:.04em
}

.photo-add  {
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:6px;
  aspect-ratio:1;
  border:1.5px dashed rgba(241,204,122,.4);
  border-radius:14px;
  background:rgba(241,204,122,.04);
  color:var(--color-gold);
  font-size:10px;
  font-weight:600;
  letter-spacing:.06em;
  cursor:pointer;
  transition:background .25s,border-color .25s
}

.photo-add:hover  {
  background:rgba(241,204,122,.1)
}

.photo-add i  {
  font-size:22px
}

/* ---- notes ---- */ .note  {
  padding:12px 0;
  border-bottom:1px solid rgba(255,255,255,.05)
}

.note header  {
  display:flex;
  align-items:baseline;
  gap:8px
}

.note header strong  {
  font-size:13px;
  font-weight:700;
  color:#e6c280
}

.note header small  {
  font-size:10px;
  color:rgba(255,255,255,.4)
}

.note p  {
  margin:5px 0 0;
  font-size:13px;
  line-height:1.55;
  color:rgba(255,255,255,.75)
}

.note-add  {
  display:flex;
  align-items:center;
  gap:7px;
  margin-top:14px;
  padding:10px 16px;
  border:1px solid rgba(241,204,122,.35);
  border-radius:999px;
  background:rgba(241,204,122,.06);
  color:#e6c280;
  font-size:12px;
  font-weight:600;
  cursor:pointer;
  transition:background .25s
}

.note-add:hover  {
  background:rgba(241,204,122,.12)
}

.note-add i  {
  font-size:14px
}

@media (min-width:1100px)  {
  .photo-grid  {
    grid-template-columns:repeat(auto-fill,minmax(180px,1fr))
  }
  .done-list  {
    display:grid;
    grid-template-columns:1fr 1fr;
    column-gap:32px
  }
}

</style>

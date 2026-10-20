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
  { src: '/assets/created/arrival-living-room.webp', caption: 'Le salon prêt', tilt: '-2deg' },
  { src: '/assets/created/journey-station.webp', caption: 'Le voyage', tilt: '3deg' },
  { src: '/assets/created/journey-backpack.webp', caption: 'Le sac du lutin', tilt: '-1.5deg' },
  { src: '/assets/created/arrival-mobile-hero.webp', caption: 'La forêt', tilt: '2.5deg' },
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
      <h2>Les farces déjà jouées</h2>
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
        <figure v-for="(p, i) in photos" :key="p.src" :style="{ '--tilt': p.tilt }">
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
/* le décor feutré : l'atelier chaud floute derrière les cartes + la lampe ambrée */
.app-screen::before  {
  content:'';
  position:fixed;
  inset:0;
  z-index:-2;
  background:url('/assets/created/reserve-atelier.webp') center/cover no-repeat;
  filter:blur(12px);
  opacity:.25;
  transform:scale(1.06);
  pointer-events:none
}

.app-screen::after  {
  content:'';
  position:fixed;
  top:-8vh;
  right:-8vw;
  z-index:-1;
  width:44vw;
  height:44vw;
  min-width:320px;
  min-height:320px;
  background:radial-gradient(closest-side,rgba(224,160,60,.2),transparent 70%);
  filter:blur(40px);
  pointer-events:none
}

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

/* mini sceau de laiton : chaque farce jouée est estampillée, pas cochée */
.done-check  {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:26px;
  height:26px;
  margin-top:1px;
  border-radius:47% 53% 51% 49%/52% 48% 55% 45%;
  background:radial-gradient(circle at 34% 28%,#f7e0a0 0%,#d9ab4f 52%,#7a5518 100%);
  color:#3a2a10;
  font-size:13px;
  text-shadow:0 1px 1px rgba(255,236,190,.6);
  box-shadow:inset 0 -2px 4px rgba(60,38,8,.55),inset 0 1px 2px rgba(255,244,200,.9),0 0 10px rgba(230,194,128,.4),0 2px 5px rgba(0,0,0,.4)
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
  color:#e0c283
}

/* ---- photos ---- */ .photo-grid  {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-top:2px
}

/* polaroids posés sur la table : cadre crème, inclinaison propre à chaque cliché */
.photo-grid figure  {
  position:relative;
  margin:0;
  padding:7px 7px 30px;
  border-radius:4px;
  background:linear-gradient(165deg,#fbf4e3 0%,#f0e4c9 100%);
  transform:rotate(var(--tilt));
  box-shadow:0 3px 6px rgba(0,0,0,.3),0 14px 26px rgba(0,0,0,.45);
  transition:transform .35s cubic-bezier(.2,.7,.3,1.2),box-shadow .35s
}

.photo-grid figure:hover  {
  z-index:2;
  transform:rotate(0deg) translateY(-4px) scale(1.02);
  box-shadow:0 5px 10px rgba(0,0,0,.35),0 20px 34px rgba(0,0,0,.55)
}

.photo-grid img  {
  display:block;
  width:100%;
  aspect-ratio:1;
  object-fit:cover;
  border-radius:2px
}

/* la légende écrite à la plume, dans la marge du cliché */
.photo-grid figcaption  {
  position:absolute;
  left:8px;
  right:8px;
  bottom:3px;
  padding:0;
  text-align:center;
  font-family:'La Belle Aurore',cursive;
  font-size:15px;
  line-height:1.3;
  color:#2e1f0c;
  transform:rotate(-1.2deg)
}

/* l'emplacement vide : verre teinté d'or plutôt que pointillés verts */
.photo-add  {
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:6px;
  aspect-ratio:1;
  border:1.5px dashed rgba(224,194,131,.45);
  border-radius:10px;
  background:rgba(224,194,131,.06);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  color:#f0dcae;
  text-shadow:0 0 12px rgba(224,194,131,.45);
  font-size:11px;
  font-weight:600;
  letter-spacing:.06em;
  cursor:pointer;
  transition:background .25s,border-color .25s,box-shadow .25s,transform .25s
}

.photo-add:hover  {
  background:rgba(224,194,131,.14);
  border-color:rgba(224,194,131,.7);
  box-shadow:0 0 22px rgba(224,194,131,.3);
  transform:translateY(-3px)
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
  color:#e0c283;
  opacity:.75
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

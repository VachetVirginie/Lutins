<script setup lang="ts">
import { useRouter } from 'vue-router'
import MagicSeal from '../../components/MagicSeal.vue'
import NightCanvas from '../../components/magic/NightCanvas.vue'

/**
 * L'entrée en desktop : l'affiche devient un cinéma — la nuit couvre tout
 * l'écran, la neige tombe sur l'illustration, le sceau se brise au centre.
 */
const router = useRouter()

function enter() {
  sessionStorage.setItem('lutins-unlocked', '1')
  router.push('/home')
}
</script>

<template>
  <main class="opening-desk">
    <img class="opening-image" src="/assets/created/arrival-mobile-hero.png" alt="Un lutin se prépare à commencer son aventure de Noël" />
    <i class="aurora aurora--a" aria-hidden="true" /><i class="aurora aurora--b" aria-hidden="true" />
    <div class="opening-overlay" aria-hidden="true" />
    <NightCanvas class="opening-snow" />

    <section class="opening-copy">
      <p class="opening-chapter"><i /> UNE HISTOIRE À VIVRE <i /></p>
      <p class="opening-kicker">L’aventure de Louis</p>
      <h1>La magie<br /><em>commence ici.</em></h1>
      <p class="opening-subtitle">Un voyage de lutins, pensé pour votre famille.</p>
      <div class="opening-entry" aria-label="Entrer dans l’aventure">
        <MagicSeal @unlocked="enter" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.opening-desk {
  position: relative;
  display: grid;
  min-height: 100svh;
  overflow: hidden;
  background: var(--color-forest-deep);
  color: #fff;
}
.opening-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 62% 32%;
  filter: brightness(1.05) contrast(1.05) saturate(1.05);
}
/* les aurores passent par-dessus l'image — le ciel est vivant */
.aurora {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  filter: blur(70px);
  mix-blend-mode: screen;
  pointer-events: none;
}
.aurora--a {
  top: -20%;
  left: -10%;
  width: 60vw;
  height: 50vh;
  background: radial-gradient(ellipse, rgba(64,190,150,.3), transparent 70%);
  animation: aurora-a 24s ease-in-out infinite alternate;
}
.aurora--b {
  top: -8%;
  right: -14%;
  width: 55vw;
  height: 44vh;
  background: radial-gradient(ellipse, rgba(110,150,230,.22), transparent 70%);
  animation: aurora-b 30s ease-in-out infinite alternate;
}
@keyframes aurora-a {
  to { transform: translate3d(10vw, 6vh, 0) scale(1.14); }
}
@keyframes aurora-b {
  to { transform: translate3d(-9vw, 5vh, 0) scale(1.1); }
}
.opening-overlay {
  position: absolute;
  z-index: 2;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(4,18,15,.86) 0%, rgba(4,18,15,.5) 42%, rgba(4,18,15,.12) 68%, rgba(4,18,15,.35) 100%),
    linear-gradient(180deg, rgba(7,26,22,.55) 0%, transparent 40%, rgba(7,26,22,.7) 100%);
}
.opening-snow {
  z-index: 3;
}

/* le texte respire à gauche, l'illustration vit à droite */
.opening-copy {
  position: relative;
  z-index: 4;
  align-self: center;
  max-width: 640px;
  padding: 0 48px 0 clamp(48px, 8vw, 120px);
}
.opening-chapter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 34px;
  color: var(--color-gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .26em;
  opacity: .85;
}
.opening-chapter i {
  width: 28px;
  height: 1px;
  background: var(--color-gold);
}
.opening-kicker {
  margin: 0 0 10px;
  font-size: 16px;
  letter-spacing: .01em;
  color: #fff;
  opacity: .92;
}
.opening-copy h1 {
  margin: 0;
  font: 500 clamp(56px, 6.4vw, 88px)/.95 var(--font-serif);
  letter-spacing: -.05em;
  text-shadow: 0 6px 40px rgba(0,0,0,.5);
}
.opening-copy h1 em {
  color: var(--color-gold);
  font-style: italic;
}
.opening-subtitle {
  margin: 26px 0 0;
  font-size: 17px;
  line-height: 1.5;
  color: #fff;
  opacity: .85;
}
.opening-entry {
  margin-top: 46px;
  transform-origin: left center;
}

@media (prefers-reduced-motion: reduce) {
  .aurora--a, .aurora--b { animation: none; }
}
</style>

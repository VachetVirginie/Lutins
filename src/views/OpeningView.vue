<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MagicSeal from '../components/MagicSeal.vue'
import { useIsDesktop } from '../composables/useBreakpoints'
import { adventure } from '../data/adventureStore'
import { totalDays } from '../data/adventure'
import DesktopOpening from './opening/DesktopOpening.vue'

const isDesktop = useIsDesktop()
const router = useRouter()

const kicker = computed(() => {
  const noms = adventure.prenoms_enfants.filter(Boolean)
  if (noms.length === 0) return 'L’aventure de votre famille'
  if (noms.length === 1) return `L’aventure de ${noms[0]}`
  return `L’aventure de ${noms.slice(0, -1).join(', ')} et ${noms[noms.length - 1]}`
})

function enter() {
  sessionStorage.setItem('lutins-unlocked', '1')
  router.push('/home')
}
</script>

<template>
  <DesktopOpening v-if="isDesktop" />
  <main v-else class="opening-screen">
    <img class="opening-image" src="/assets/created/arrival-mobile-hero.webp" alt="Un lutin se prépare à commencer son aventure de Noël" />
    <div class="opening-overlay" />
    <section class="opening-copy">
      <p class="opening-chapter"><i /> {{ totalDays }} NUITS DE MERVEILLES <i /></p>
      <p class="opening-kicker">{{ kicker }}</p>
      <h1>La magie a une adresse :<br /><em>la vôtre.</em></h1>
      <p class="opening-subtitle">Chaque nuit, une dépêche du Pôle Nord. Une aventure de lutins qui s’écrit chez vous, en famille.</p>
    </section>
    <section class="opening-entry" aria-label="Entrer dans l’aventure">
      <MagicSeal @unlocked="enter" />
      <p class="entry-hint"><b>Briser le sceau</b><span>Maintenez un instant — la porte s’ouvre</span></p>
    </section>
  </main>
</template>

<style scoped>
.opening-screen  {
  position:relative;
  display:grid;
  grid-template-rows:auto minmax(0,1fr) auto auto;
  min-height:100svh;
  max-width:540px;
  margin:auto;
  padding-bottom:calc(38px + env(safe-area-inset-bottom));
  overflow:hidden;
  background:var(--color-forest-deep);
  color:#fff
}

.opening-image  {
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:58% 78%;
  filter:brightness(1.09) contrast(1.06) saturate(1.04)
}

.opening-overlay  {
  position:absolute;
  inset:0;
  background:linear-gradient(90deg,rgba(4,18,15,.72) 0%,rgba(4,18,15,.36) 48%,rgba(4,18,15,.08) 78%),linear-gradient(180deg,rgba(7,26,22,.62) 0%,rgba(7,26,22,.08) 42%,rgba(7,26,22,.78) 100%)
}

.opening-copy  {
  position:relative;
  z-index:1;
  grid-row:2;
  align-self:start;
  padding:clamp(28px,6vh,58px) 28px 24px
}

.opening-chapter  {
  display:flex;
  align-items:center;
  gap:9px;
  margin-bottom:30px;
  color:var(--color-gold);
  font-size:8px;
  font-weight:700;
  letter-spacing:.24em;
  opacity:.82
}

.opening-chapter i  {
  width:22px;
  height:1px;
  background:var(--color-gold)
}

.opening-kicker  {
  max-width:310px;
  margin:0 0 8px;
  font-size:14px;
  letter-spacing:.01em;
  color:#fff;
  opacity:.92
}

.opening-copy h1  {
  max-width:300px;
  margin:0;
  font:500 clamp(40px,10vw,58px)/.93 var(--font-serif);
  letter-spacing:-.065em
}

.opening-copy h1 em  {
  color:var(--color-gold);
  font-style:italic
}

.opening-subtitle  {
  max-width:235px;
  margin:22px 0 0;
  font-size:14px;
  line-height:1.4;
  color:#fff;
  opacity:.82
}

.opening-entry  {
  position:relative;
  z-index:1;
  grid-row:3;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:9px;
  margin:0 28px
}

.entry-hint  {
  display:grid;
  gap:3px;
  margin:2px 0 0;
  justify-items:center;
  text-align:center
}

.entry-hint b  {
  color:var(--color-gold);
  font-size:9.5px;
  font-weight:700;
  letter-spacing:.22em;
  text-transform:uppercase
}

.entry-hint span  {
  color:rgba(255,255,255,.7);
  font:italic 400 13.5px var(--font-literary)
}

@media(min-width:700px)  {
  .opening-screen  {
    box-shadow:0 0 80px #0008
  }
}

@media(max-width:380px)  {
  .opening-image  {
    object-position:58% 74%
  }
  .opening-copy  {
    padding-right:24px;
    padding-left:24px
  }
  .opening-copy h1  {
    font-size:40px
  }
}

@media(max-height:700px)  {
  .opening-copy  {
    padding-top:24px;
    padding-bottom:16px
  }
  .opening-subtitle  {
    margin-top:20px
  }
}

</style>

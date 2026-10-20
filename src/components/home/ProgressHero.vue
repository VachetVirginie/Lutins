<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { currentAdventure, remainingDays } from '../../data/adventure'

const chapter = currentAdventure.chapter

// Parallaxe douce : la scène dérive plus lentement que le scroll (transform → compositeur)
const sceneEl = ref<HTMLElement>()
let raf = 0

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    if (sceneEl.value) sceneEl.value.style.transform = `translate3d(0, ${Math.min(70, window.scrollY * 0.14)}px, 0) scale(1.1)`
  })
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section class="progress-hero">
    <div class="hero-scene" aria-hidden="true">
      <img ref="sceneEl" src="/assets/created/arrival-mobile-hero.webp" alt="" />
      <i class="hero-veil" />
    </div>

    <i class="hero-spark hero-spark--tl" aria-hidden="true" /><i class="hero-spark hero-spark--br" aria-hidden="true" />

    <div class="progress-copy">
      <p class="home-overline">JOUR {{ currentAdventure.currentDay }} · {{ remainingDays }} JOURS AVANT NOËL</p>
      <h2>{{ chapter.heroA }}<br /><em>{{ chapter.heroEm }}</em></h2>
      <p>{{ chapter.tagline }}</p>
    </div>
  </section>
</template>

<style scoped>
/* ---- la scène : l'illustration de l'ouverture continue sous le héros ---- */
.progress-hero  {
  position:relative;
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:16px;
  min-height:338px;
  margin:0 -20px;
  padding:0 22px 30px
}

.hero-scene  {
  position:absolute;
  inset:-55px 0 0;
  overflow:hidden;
  mask-image:linear-gradient(180deg,#000 42%,rgba(0,0,0,.55) 68%,transparent 97%);
  -webkit-mask-image:linear-gradient(180deg,#000 42%,rgba(0,0,0,.55) 68%,transparent 97%)
}

.hero-scene img  {
  display:block;
  width:100%;
  height:112%;
  object-fit:cover;
  object-position:58% 62%;
  transform:scale(1.1);
  filter:brightness(.96) contrast(1.05) saturate(1.08)
}

.hero-veil  {
  position:absolute;
  inset:0;
  background:linear-gradient(180deg,rgba(10,25,19,.3) 0%,rgba(10,25,19,.18) 34%,rgba(10,26,19,.68) 78%,rgba(10,28,21,.9) 100%)
}

/* ---- copie monumentale : même voix que l'écran d'ouverture ---- */
.progress-copy  {
  position:relative;
  z-index:2;
  min-width:0
}

.progress-copy .home-overline  {
  font-size:9px;
  color:#ffe9a8;
  text-shadow:0 1px 8px rgba(0,0,0,.6);
  animation:hero-in .7s var(--spring) .05s both
}

.progress-copy h2  {
  margin:10px 0 10px;
  font:500 clamp(38px,10vw,50px)/.96 var(--font-serif);
  letter-spacing:-.045em;
  color:#f9f1de;
  text-shadow:0 2px 22px rgba(0,0,0,.55);
  animation:hero-in .75s var(--spring) .14s both
}

.progress-copy h2 em  {
  color:var(--color-gold);
  font-style:italic;
  text-shadow:0 0 24px rgba(255,215,0,.35),0 2px 18px rgba(0,0,0,.5)
}

.progress-copy>p:last-child  {
  max-width:240px;
  margin:0;
  color:#c3d2c7;
  font-size:13px;
  line-height:1.5;
  text-shadow:0 1px 10px rgba(0,0,0,.7);
  animation:hero-in .7s var(--spring) .24s both
}

@keyframes hero-in  {
  from  {
    opacity:0;
    transform:translateY(16px)
  }
}

.hero-spark  {
  position:absolute;
  z-index:2;
  width:5px;
  height:5px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 9px #ffd97a;
  animation:hero-twinkle 2.4s ease-in-out infinite
}

.hero-spark--tl  {
  left:26px;
  top:22%
}

.hero-spark--br  {
  right:30%;
  bottom:18%;
  animation-delay:1.2s
}

@keyframes hero-twinkle  {
  0%,100%  {
    opacity:.15;
    transform:scale(.7)
  }
  50%  {
    opacity:1;
    transform:scale(1.15)
  }
}

@media (prefers-reduced-motion:reduce)  {
  .progress-copy>*  {
    animation:none
  }
}
</style>

<script setup lang="ts">
import { motion } from 'motion-v'
import { NextStep, ProgressHero, StoryPhase } from '../components/home'
import { currentAdventure } from '../data/adventure'
import { dailySheets } from '../data/dailySheets'

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 190, damping: 26, delay },
})
const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true, margin: '-50px' as const },
  transition: { type: 'spring' as const, stiffness: 170, damping: 25 },
}

// Teaser du lendemain : la page se referme sur une promesse, pas sur une liste
const tomorrowTitle =
  currentAdventure.currentDay < currentAdventure.totalDays
    ? dailySheets[currentAdventure.currentDay + 1]?.title
    : undefined
</script>

<template>
  <main class="app-screen">
    <svg class="home-ornament" viewBox="0 0 60 96" aria-hidden="true">
      <defs>
        <radialGradient id="orn-ball" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#fff4cf" />
          <stop offset="42%" stop-color="#f1cc7a" />
          <stop offset="100%" stop-color="#9c6f2e" />
        </radialGradient>
      </defs>
      <line class="orn-thread" x1="30" y1="-4" x2="30" y2="32" />
      <rect class="orn-cap" x="24" y="32" width="12" height="8" rx="2.5" />
      <circle class="orn-ball" cx="30" cy="62" r="22" fill="url(#orn-ball)" />
      <ellipse class="orn-shine" cx="22" cy="52" rx="6.5" ry="4" transform="rotate(-28 22 52)" />
      <path class="orn-glitter" d="M40 50 L41.6 54 L45.6 55.6 L41.6 57.2 L40 61.2 L38.4 57.2 L34.4 55.6 L38.4 54 Z" />
    </svg>
    <ProgressHero />
    <motion.div v-bind="rise(0.1)"><StoryPhase /></motion.div>
    <motion.div v-bind="reveal"><NextStep /></motion.div>
    <motion.footer v-if="tomorrowTitle" class="home-signoff" v-bind="reveal">
      <i aria-hidden="true" /><p>Et demain — <em>{{ tomorrowTitle }}</em></p><i aria-hidden="true" />
    </motion.footer>
    <motion.div class="home-personalize" v-bind="reveal">
      <RouterLink to="/personnalisation"><i class="mdi mdi-feather" aria-hidden="true" /> Personnaliser l'aventure</RouterLink>
    </motion.div>
  </main>
</template>

<style scoped>
.home-ornament {
  display:block;
  position:relative;
  z-index:3;
  width:44px;
  margin:-4px auto -36px;
  overflow:visible;
  transform-origin:50% 0;
  animation:orn-sway 7s ease-in-out infinite;
  filter:drop-shadow(0 0 9px rgba(255,215,120,.75)) drop-shadow(0 5px 14px rgba(255,180,70,.4))
}

@keyframes orn-sway {
  0%,100% {
    transform:rotate(-2.4deg)
  }
  50% {
    transform:rotate(2.4deg)
  }
}

.orn-thread {
  stroke:rgba(241,204,122,.55);
  stroke-width:1
}

.orn-cap {
  fill:#b98a3e
}

.orn-shine {
  fill:rgba(255,255,255,.55)
}

.orn-glitter {
  fill:#fff8dd;
  animation:orn-twinkle 2.8s ease-in-out infinite
}

@keyframes orn-twinkle {
  0%,100% {
    opacity:.3;
    transform:scale(.85)
  }
  50% {
    opacity:1;
    transform:scale(1.05)
  }
}

/* signature de fin : filets d'encre + promesse du lendemain */
.home-signoff {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  margin-top:34px
}

.home-signoff i {
  width:34px;
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(241,204,122,.5))
}

.home-signoff i:last-child {
  transform:scaleX(-1)
}

.home-signoff p {
  margin:0;
  color:#8fa79a;
  font:italic 500 14px/1.4 var(--font-literary);
  text-align:center
}

.home-signoff em {
  color:var(--color-gold);
  font-style:italic
}

/* l'entrée discrète vers le formulaire de l'expédition */
.home-personalize {
  display:flex;
  justify-content:center;
  margin-top:20px
}

.home-personalize a {
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:8px 15px;
  border:1px dashed rgba(241,204,122,.35);
  border-radius:999px;
  color:#9db4a8;
  font:600 11.5px var(--font-ui);
  letter-spacing:.05em;
  text-decoration:none;
  transition:color .3s,border-color .3s;
  -webkit-tap-highlight-color:transparent
}

.home-personalize a:active {
  color:var(--color-gold);
  border-color:rgba(241,204,122,.6)
}
</style>

<script setup lang="ts">
import { motion } from 'motion-v'
import { useRouter } from 'vue-router'
import { NextStep, ProgressHero, StoryPhase } from '../components/home'
import { currentAdventure } from '../data/adventure'
import { sheetForDay } from '../data/farces'
import { useIsDesktop } from '../composables/useBreakpoints'
import DesktopHome from './home/DesktopHome.vue'

const isDesktop = useIsDesktop()
import { haptic } from '../utils/haptics'

const router = useRouter()

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
    ? sheetForDay(currentAdventure.currentDay + 1)?.title
    : undefined

// L'engrenage tourne d'un tour complet au tap — la navigation suit l'enclenchement
function spinGear(event: MouseEvent) {
  haptic([8, 30, 8])
  const icon = (event.currentTarget as HTMLElement).querySelector('i')
  icon?.classList.remove('is-spinning')
  void icon?.getBoundingClientRect() // reflow pour rejouer l'animation
  icon?.classList.add('is-spinning')
  window.setTimeout(() => router.push('/personnalisation'), 180)
}
</script>

<template>
  <DesktopHome v-if="isDesktop" />
  <main v-else class="app-screen">
    <RouterLink to="/personnalisation" class="home-gear" @click.prevent="spinGear">
      <i class="mdi mdi-cog-outline" aria-hidden="true" />
      <span class="sr-only">Personnaliser l'aventure</span>
    </RouterLink>
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
    <div class="home-duo">
      <motion.div v-bind="rise(0.1)"><StoryPhase /></motion.div>
      <motion.div v-bind="reveal"><NextStep /></motion.div>
    </div>
    <motion.footer v-if="tomorrowTitle" class="home-signoff" v-bind="reveal">
      <i aria-hidden="true" /><p>Et demain — <em>{{ tomorrowTitle }}</em></p><i aria-hidden="true" />
    </motion.footer>
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

/* l'engrenage d'accès au formulaire de l'expédition */
.home-gear {
  position:absolute;
  z-index:6;
  top:calc(12px + env(safe-area-inset-top));
  right:14px;
  display:grid;
  place-items:center;
  width:40px;
  height:40px;
  border:1px solid rgba(241,204,122,.3);
  border-radius:50%;
  background:linear-gradient(165deg,#1a332a,#0f211a);
  color:#9db4a8;
  font-size:19px;
  text-decoration:none;
  box-shadow:0 8px 20px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,244,214,.08);
  transition:color .3s,transform .35s var(--spring);
  -webkit-tap-highlight-color:transparent
}

.home-gear:active {
  color:var(--color-gold);
  transform:scale(.92)
}

/* le tour complet au tap */
.home-gear i.is-spinning {
  animation:gear-spin .65s cubic-bezier(.3,.85,.35,1.05) both
}

@keyframes gear-spin {
  from {
    transform:rotate(0)
  }
  to {
    transform:rotate(360deg)
  }
}

@media (prefers-reduced-motion:reduce) {
  .home-gear i.is-spinning {
    animation:none
  }
}
</style>

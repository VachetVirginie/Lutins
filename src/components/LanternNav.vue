<script setup lang="ts">
import { useRoute } from 'vue-router'
import { motion } from 'motion-v'
import { haptic } from '../utils/haptics'

const route = useRoute()

// La piste relie les lanternes : chaque écran est une étape du voyage
const items = [
  { label: 'Aujourd’hui', icon: 'mdi-mailbox-open-outline', to: '/home' },
  { label: 'Le kit', icon: 'mdi-package-variant-closed', to: '/prepare' },
  { label: 'La carte', icon: 'mdi-map-outline', to: '/planning' },
  { label: 'Souvenirs', icon: 'mdi-image-multiple-outline', to: '/souvenirs' },
]

function isActive(to: string): boolean {
  const p = route.path
  if (to === '/home') return p === '/home' || p.startsWith('/activites')
  return p.startsWith(to)
}
</script>

<template>
  <nav class="lantern-nav" aria-label="Navigation principale">
    <i class="nav-scrim" aria-hidden="true" />
    <i class="nav-trail" aria-hidden="true" />
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-lantern"
      :class="{ 'is-active': isActive(item.to) }"
      @click="haptic(6)"
    >
      <span class="lantern-body">
        <motion.span
          v-if="isActive(item.to)"
          layoutId="lantern-glow"
          class="lantern-glow"
          :transition="{ type: 'spring', stiffness: 320, damping: 30 }"
          aria-hidden="true"
        />
        <i class="mdi" :class="item.icon" aria-hidden="true" />
      </span>
      <span class="lantern-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.lantern-nav {
  position:fixed;
  z-index:50;
  left:50%;
  bottom:calc(12px + env(safe-area-inset-bottom));
  display:flex;
  align-items:center;
  gap:2px;
  padding:7px 10px;
  border:1px solid transparent;
  border-radius:999px;
  background:
    linear-gradient(165deg,#1a332a 0%,#0f211a 60%,#0b1a13 100%) padding-box,
    linear-gradient(160deg,rgba(241,204,122,.5),rgba(241,204,122,.12) 45%,rgba(241,204,122,.3)) border-box;
  box-shadow:0 16px 40px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,244,214,.1);
  transform:translateX(-50%);
  animation:nav-rise .7s var(--spring) .35s both
}

@keyframes nav-rise {
  from {
    opacity:0;
    transform:translateX(-50%) translateY(18px)
  }
  to {
    opacity:1;
    transform:translateX(-50%) translateY(0)
  }
}

/* voile de nuit qui ancre la barre : le contenu s'éteint en glissant dessous */
.nav-scrim {
  position:absolute;
  z-index:-1;
  left:50%;
  bottom:calc(-12px - env(safe-area-inset-bottom));
  width:100vw;
  height:calc(100% + 12px + env(safe-area-inset-bottom) + 30px);
  background:linear-gradient(180deg,transparent,rgba(8,19,14,.68) 52%,rgba(5,13,9,.95));
  transform:translateX(-50%);
  pointer-events:none
}

/* la piste dorée relie les lanternes */
.nav-trail {
  position:absolute;
  left:34px;
  right:34px;
  top:50%;
  border-top:1.5px dashed rgba(241,204,122,.22);
  pointer-events:none
}

.nav-lantern {
  position:relative;
  z-index:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:1px;
  min-width:64px;
  padding:3px 4px 2px;
  color:#8fa79a;
  text-decoration:none;
  -webkit-tap-highlight-color:transparent
}

.lantern-body {
  position:relative;
  display:grid;
  place-items:center;
  width:44px;
  height:30px;
  transition:transform .35s var(--spring)
}

.nav-lantern:active .lantern-body {
  transform:scale(.88)
}

.lantern-body i {
  position:relative;
  z-index:1;
  font-size:20px;
  transition:color .3s,filter .3s
}

.nav-lantern.is-active i {
  color:#ffe9a8;
  filter:drop-shadow(0 0 7px rgba(255,215,0,.8)) drop-shadow(0 0 16px rgba(255,180,60,.35))
}

/* la lanterne allumée glisse d'une étape à l'autre (layoutId) */
.lantern-glow {
  position:absolute;
  inset:-7px -13px;
  border-radius:50%;
  background:radial-gradient(ellipse at 50% 42%,rgba(255,215,0,.42) 0%,rgba(255,183,70,.16) 52%,transparent 74%);
  mix-blend-mode:screen;
  pointer-events:none
}

.lantern-label {
  font-size:9px;
  font-weight:600;
  letter-spacing:.07em
}

.nav-lantern.is-active .lantern-label {
  color:var(--color-gold)
}

.nav-lantern:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px;
  border-radius:14px
}

/* ---- bureau : la piste de lanternes devient un header ---- */
@media (min-width:1024px) {
  .lantern-nav {
    top:0;
    bottom:auto;
    left:0;
    width:100%;
    transform:none;
    justify-content:center;
    gap:40px;
    padding:16px 48px;
    border-left:0;
    border-right:0;
    border-top:0;
    border-radius:0;
    background:linear-gradient(180deg,rgba(12,26,20,.92),rgba(10,22,16,.78));
    backdrop-filter:blur(10px);
    animation:none
  }
  .nav-scrim {
    display:none
  }
  .nav-trail {
    left:15%;
    right:15%
  }
  .nav-lantern {
    flex-direction:row;
    gap:9px;
    min-width:0;
    padding:6px 14px;
    font-size:14px
  }
  .lantern-body {
    width:auto;
    height:auto
  }
  .lantern-body i {
    font-size:20px
  }
  .lantern-label {
    font-size:13.5px
  }
  .nav-lantern.is-active .lantern-label {
    color:#ffe9a8
  }
}

@media (prefers-reduced-motion:reduce) {
  .lantern-nav {
    animation:none
  }
}
</style>

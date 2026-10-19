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

/* ---- bureau : pill flottante en verre dépoli, typographie seule ---- */
@media (min-width:1024px) {
  .lantern-nav {
    top:22px;
    bottom:auto;
    left:50%;
    width:auto;
    transform:translateX(-50%);
    justify-content:center;
    gap:2px;
    padding:6px 8px;
    border:1px solid rgba(224,194,131,.22);
    border-radius:999px;
    background:rgba(9,22,17,.58);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:0 18px 42px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,244,214,.07);
    animation:none
  }
  /* ni scrim, ni piste pointillée — la pill flotte, elle ne barre pas */
  .nav-scrim,.nav-trail {
    display:none
  }
  .nav-lantern {
    position:relative;
    flex-direction:row;
    min-width:0;
    padding:9px 18px;
    border-radius:999px;
    transition:background .3s
  }
  .nav-lantern:hover {
    background:rgba(224,194,131,.07)
  }
  /* les icônes SaaS sortent du paysage : la typo suffit */
  .lantern-body {
    display:none
  }
  /* ni le gros halo jaune — l'actif se signale par une étincelle */
  .lantern-glow {
    display:none
  }
  .lantern-label {
    font:500 12.5px var(--font-serif);
    letter-spacing:.16em;
    text-transform:uppercase;
    color:#a0b2a6;
    transition:color .3s
  }
  .nav-lantern:hover .lantern-label {
    color:#e0c283
  }
  .nav-lantern.is-active .lantern-label {
    color:#fff6dc
  }
  /* ✦ : le signe magique, pas une ampoule */
  .nav-lantern.is-active::before {
    content:'✦';
    position:absolute;
    top:-11px;
    left:50%;
    color:#e0c283;
    font-size:10px;
    text-shadow:0 0 9px rgba(224,194,131,.95);
    transform:translateX(-50%);
    animation:sparkle-breathe 2.6s ease-in-out infinite;
    pointer-events:none
  }
  @keyframes sparkle-breathe {
    50% {
      opacity:.55;
      transform:translateX(-50%) translateY(-1.5px)
    }
  }
}

@media (prefers-reduced-motion:reduce) {
  .lantern-nav {
    animation:none
  }
}
</style>

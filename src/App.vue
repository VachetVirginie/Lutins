<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MotionConfig } from 'motion-v'
import AmbientDust from './components/AmbientDust.vue'
import LanternNav from './components/LanternNav.vue'
import SealStamp from './components/SealStamp.vue'

// La neige 3D reste hors du bundle initial : chargée en tâche de fond sur
// l'écran d'ouverture, prête avant que le sceau ne soit déverrouillé
const SnowTransition = defineAsyncComponent(() => import('./components/SnowTransition.vue'))

// Ciel horaire : aube dorée, jour froid, crépuscule ambré, nuit bleutée
onMounted(() => {
  const h = new Date().getHours()
  const [rgb, alpha] =
    h >= 5 && h < 9
      ? ['255,206,132', '.15']
      : h >= 9 && h < 17
        ? ['158,205,196', '.1']
        : h >= 17 && h < 22
          ? ['255,178,94', '.13']
          : ['138,178,205', '.06']
  document.documentElement.style.setProperty('--sky-rgb', rgb)
  document.documentElement.style.setProperty('--sky-alpha', alpha)

  if (route.name === 'opening') {
    const warm = () => import('./components/SnowTransition.vue')
    if ('requestIdleCallback' in window) requestIdleCallback(warm)
    else setTimeout(warm, 700)
  }
})

const router = useRouter()
const route = useRoute()
const fromName = ref<string>()

router.beforeEach((_to, from) => {
  fromName.value = from.name as string
})

// Transition uniquement entre l'écran d'ouverture (/) et l'Aventure (/home)
const transitionName = computed(() => (fromName.value === 'opening' ? 'page' : ''))
const showNav = computed(() => route.name !== 'opening')

// Ouverture → aventure : la bourrasque couvre l'échange de pages
const gusting = ref(false)
let gustTimer: number | undefined

watch(
  () => route.name,
  (name, prev) => {
    if (prev !== 'opening' || name !== 'home') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gusting.value = true
    window.clearTimeout(gustTimer)
    gustTimer = window.setTimeout(() => (gusting.value = false), 1900)
  },
)
</script>

<template>
  <MotionConfig :reducedMotion="'user'">
    <div class="app-shell">
      <AmbientDust />
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
      <LanternNav v-if="showNav" />
      <SealStamp />
      <SnowTransition v-if="gusting" />
    </div>
  </MotionConfig>
</template>

<style scoped>
.app-shell  {
  min-height:100svh;
  background:var(--color-night)
}

.page-enter-active  {
  transition:opacity .45s ease,transform .5s cubic-bezier(.22,1,.36,1)
}

.page-leave-active  {
  transition:opacity .3s ease
}

.page-enter-from  {
  opacity:0;
  transform:scale(1.03)
}

.page-leave-to  {
  opacity:0
}

</style>

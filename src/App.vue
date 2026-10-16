<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AmbientDust from './components/AmbientDust.vue'

// Lumière ambiante modulée selon l'heure : plus vive le jour, feutrée le soir
onMounted(() => {
  const h = new Date().getHours()
  const glow = h >= 7 && h < 18 ? 0.11 : h >= 18 && h < 22 ? 0.08 : 0.05
  document.documentElement.style.setProperty('--ambient-glow', String(glow))
})

const router = useRouter()
const fromName = ref<string>()

router.beforeEach((_to, from) => {
  fromName.value = from.name as string
})

// Transition uniquement entre l'écran d'ouverture (/) et l'Aventure (/home)
const transitionName = computed(() => (fromName.value === 'opening' ? 'page' : ''))
</script>

<template>
  <div class="app-shell">
    <AmbientDust />
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
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

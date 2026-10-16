<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fromName = ref<string>()

router.beforeEach((_to, from) => {
  fromName.value = from.name as string
})

// Transition uniquement entre l'écran d'ouverture (/) et l'Aventure (/home)
const transitionName = computed(() => (fromName.value === 'opening' ? 'page' : ''))
</script>

<template>
  <v-app class="app-shell">
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </v-app>
</template>

<style scoped>
.app-shell  {
  background:var(--color-night)!important
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

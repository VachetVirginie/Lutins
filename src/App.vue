<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
const started = ref(false)
const unlocking = ref(false)
const unlockProgress = ref(0)
let unlockTimer: number | undefined
function startUnlock() { if (started.value || unlockTimer) return; unlocking.value = true; unlockProgress.value = 0; unlockTimer = window.setInterval(() => { unlockProgress.value += 8; if (unlockProgress.value >= 100) finishUnlock() }, 42) }
function cancelUnlock() { if (started.value) return; if (unlockTimer) window.clearInterval(unlockTimer); unlockTimer = undefined; unlocking.value = false; unlockProgress.value = 0 }
function finishUnlock() { if (unlockTimer) window.clearInterval(unlockTimer); unlockTimer = undefined; unlockProgress.value = 100; unlocking.value = false; started.value = true; navigator.vibrate?.([15, 35, 15]) }
function tapFallback() { if (!unlocking.value && !started.value) finishUnlock() }
onBeforeUnmount(cancelUnlock)
</script>
<template>
  <v-app class="opening-app"><main class="opening-screen" :class="{ 'opening-screen--unlocked': started }"><img class="opening-image" src="/assets/created/arrival-mobile-hero.png" alt="Un lutin se prépare à commencer son aventure de Noël" /><div class="opening-overlay" /><section class="opening-copy"><p class="opening-chapter"><i /> UNE HISTOIRE À VIVRE <i /></p><p class="opening-kicker">L’aventure de Louis</p><h1>La magie<br /><em>commence ici.</em></h1><p class="opening-subtitle">Un voyage de lutins, pensé pour votre famille.</p></section><section class="opening-entry" aria-label="Entrer dans l’aventure"><button class="magic-seal" type="button" :aria-label="started ? 'Aventure ouverte' : 'Maintenir pour ouvrir l’aventure'" @pointerdown="startUnlock" @pointerup="cancelUnlock" @pointerleave="cancelUnlock" @pointercancel="cancelUnlock" @click="tapFallback"><span class="seal-ring" :style="{ '--unlock': `${unlockProgress}%` }" /><span class="seal-core"><v-icon :icon="started ? 'mdi-check' : 'mdi-fingerprint'" size="42" /></span></button></section></main></v-app>
</template>

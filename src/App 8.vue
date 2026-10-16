<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const started = ref(false)
const unlocking = ref(false)
const unlockProgress = ref(0)
let unlockTimer: number | undefined

function startUnlock() {
  if (started.value || unlockTimer) return
  unlocking.value = true
  unlockProgress.value = 0
  unlockTimer = window.setInterval(() => {
    unlockProgress.value += 8
    if (unlockProgress.value >= 100) finishUnlock()
  }, 42)
}
function cancelUnlock() {
  if (started.value) return
  if (unlockTimer) window.clearInterval(unlockTimer)
  unlockTimer = undefined
  unlocking.value = false
  unlockProgress.value = 0
}
function finishUnlock() {
  if (unlockTimer) window.clearInterval(unlockTimer)
  unlockTimer = undefined
  unlockProgress.value = 100
  unlocking.value = false
  started.value = true
  navigator.vibrate?.([15, 35, 15])
}
function tapFallback() {
  if (!unlocking.value && !started.value) finishUnlock()
}
onBeforeUnmount(cancelUnlock)
</script>

<template>
  <v-app class="opening-app"><main class="opening-screen" :class="{ 'opening-screen--unlocked': started }"><img class="opening-image" src="/assets/created/arrival-mobile-hero.png" alt="Un lutin se prépare à commencer son aventure de Noël" /><div class="opening-overlay" /><header class="opening-header"><div class="opening-brand"><span class="brand-fingerprint" aria-hidden="true"><v-icon icon="mdi-fingerprint" size="25" /></span><strong>Mon aventure</strong></div><time datetime="2026-11-15">15 NOV. 2026</time></header><section class="opening-copy"><p class="opening-chapter"><i /> UNE NOUVELLE AVENTURE <i /></p><p class="opening-kicker">L’aventure de Louis</p><h1>Une surprise<br /><em>chaque matin.</em></h1><p class="opening-subtitle">Le voyage de vos lutins commence ici.</p></section><section class="opening-entry" aria-label="Entrer dans l’aventure"><button class="magic-seal" type="button" :aria-label="started ? 'Aventure ouverte' : 'Maintenir pour ouvrir l’aventure'" @pointerdown="startUnlock" @pointerup="cancelUnlock" @pointerleave="cancelUnlock" @pointercancel="cancelUnlock" @click="tapFallback"><span class="seal-ring" :style="{ '--unlock': `${unlockProgress}%` }" /><span class="seal-core"><v-icon :icon="started ? 'mdi-check' : 'mdi-sparkles'" size="23" /></span></button><span class="seal-label">{{ started ? 'L’aventure est ouverte' : unlocking ? 'La magie s’éveille…' : 'Maintenir pour ouvrir' }}</span><small>ou toucher le sceau</small></section><footer class="opening-footer"><span>LOUIS <i /> 2026</span><span>UNE HISTOIRE À VIVRE</span></footer></main></v-app>
</template>

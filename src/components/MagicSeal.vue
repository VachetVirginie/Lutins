<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const emit = defineEmits<{ unlocked: [] }>()

const unlocking = ref(false)
const unlockProgress = ref(0)
let unlockTimer: number | undefined

function startUnlock() {
  if (unlockTimer) return
  unlocking.value = true
  unlockProgress.value = 0
  unlockTimer = window.setInterval(() => {
    unlockProgress.value += 8
    if (unlockProgress.value >= 100) finishUnlock()
  }, 42)
}

function cancelUnlock() {
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
  emit('unlocked')
}

function tapFallback() {
  if (!unlocking.value) finishUnlock()
}

onBeforeUnmount(cancelUnlock)
</script>

<template>
  <button
    class="magic-seal"
    type="button"
    aria-label="Maintenir pour ouvrir l’aventure"
    @pointerdown="startUnlock"
    @pointerup="cancelUnlock"
    @pointerleave="cancelUnlock"
    @pointercancel="cancelUnlock"
    @click="tapFallback"
  >
    <span class="seal-ring" :style="{ '--unlock': `${unlockProgress}%` }" />
    <span class="seal-core"><v-icon icon="mdi-fingerprint" size="42" /></span>
  </button>
</template>

<style scoped>
.magic-seal{position:relative;display:grid;place-items:center;width:86px;height:86px;border:0;border-radius:50%;background:transparent;color:var(--color-forest);cursor:pointer;filter:drop-shadow(0 12px 22px rgba(0,0,0,.3));-webkit-tap-highlight-color:transparent;isolation:isolate}
.magic-seal:focus-visible{outline:2px solid #fff;outline-offset:5px}
.magic-seal::before,.magic-seal::after{position:absolute;inset:0;content:'';border:1px solid rgba(var(--rgb-seal),.48);border-radius:50%;z-index:-1;animation:seal-breathe 2.8s ease-out infinite}
.magic-seal::after{animation-delay:1.4s}
.seal-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(rgb(var(--rgb-seal)) var(--unlock),rgba(var(--rgb-seal),.25) var(--unlock));mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));transition:background .08s linear}
.seal-core{display:grid;place-items:center;width:68px;height:68px;border-radius:50%;background-color:rgba(var(--rgb-seal),.78);backdrop-filter:blur(8px);color:var(--color-forest);box-shadow:inset 0 0 0 1px rgba(255,255,255,.55),0 0 0 8px rgba(var(--rgb-seal),.13);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
.seal-core .v-icon{transform:translateY(4px)}
.magic-seal:hover .seal-core,.magic-seal:active .seal-core{transform:scale(1.07);box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 0 0 12px rgba(var(--rgb-seal),.18)}

@keyframes seal-breathe{0%{transform:scale(.86);opacity:0}35%{opacity:.6}100%{transform:scale(1.3);opacity:0}}

@media (prefers-reduced-motion:reduce){
  .magic-seal::before,.magic-seal::after{animation:none}
  .seal-core{transition:none}
}
</style>

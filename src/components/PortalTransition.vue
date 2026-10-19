<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { TresCanvas } from '@tresjs/core'
import PortalRig from './magic/PortalRig.vue'
import { portalWhoosh } from '../utils/sound'

/**
 * La traversée du sceau : l'énergie relâchée forme un vortex d'étincelles
 * d'or, la caméra plonge à travers, et le flash révèle la veillée.
 * ~1,7 s — calé sur la fenêtre `is-gusting` d'App.vue (1,9 s).
 */
const root = useTemplateRef('root')
onMounted(() => {
  portalWhoosh()
  root.value?.querySelector('canvas')?.setAttribute('aria-hidden', 'true')
})
</script>

<template>
  <div ref="root" class="portal" aria-hidden="true">
    <!-- le tunnel d'étincelles WebGL -->
    <TresCanvas :alpha="true" :antialias="false" :depth="false" :stencil="false">
      <TresPerspectiveCamera :position="[0, 0, 9]" :fov="55" />
      <PortalRig />
    </TresCanvas>

    <!-- l'anneau du sceau qui s'ouvre -->
    <i class="portal-ring" />
    <!-- le flash de la traversée -->
    <i class="portal-flash" />
    <!-- vignette : les bords restent dans la nuit -->
    <i class="portal-vignette" />
  </div>
</template>

<style scoped>
.portal {
  position: fixed;
  inset: 0;
  z-index: 85;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, #0a1d17 0%, #04120e 78%);
  animation: portal-out .45s ease 1.5s both;
}

/* l'anneau doré qui s'ouvre quand le sceau lâche */
.portal-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 90px;
  height: 90px;
  margin: -45px 0 0 -45px;
  border: 2px solid rgba(255,226,150,.9);
  border-radius: 50%;
  box-shadow: 0 0 24px rgba(255,215,120,.7), inset 0 0 18px rgba(255,215,120,.4);
  opacity: 0;
  animation: ring-burst .6s cubic-bezier(.15,.7,.3,1) .5s both;
}
@keyframes ring-burst {
  0% { opacity: 0; transform: scale(.3); }
  18% { opacity: 1; }
  100% { opacity: 0; transform: scale(16); }
}

/* le cœur du vortex : se gonfle, puis flash blanc-or à la traversée */
.portal-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, #fffdf2 0%, rgba(255,242,190,.95) 18%, rgba(255,214,120,.6) 38%, transparent 68%);
  opacity: 0;
  transform: scale(.15);
  animation: flash 1.7s ease both;
}
@keyframes flash {
  0% { opacity: 0; transform: scale(.12); }
  30% { opacity: .35; transform: scale(.2); }
  46% { opacity: .55; transform: scale(.34); }
  62% { opacity: 1; transform: scale(1.15); }
  78% { opacity: .85; transform: scale(1.6); }
  100% { opacity: 0; transform: scale(1.9); }
}

/* bords sombres — le tunnel garde sa profondeur */
.portal-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(3,10,8,.8) 100%);
  animation: vignette 1.7s ease both;
}
@keyframes vignette {
  0%, 55% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes portal-out {
  to { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .portal { display: none; }
}
</style>

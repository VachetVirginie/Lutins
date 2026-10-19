<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { TresCanvas } from '@tresjs/core'
import SceneNightRig from './SceneNightRig.vue'

/**
 * La nuit en WebGL : rendu 3D atmosphérique derrière le DOM.
 * Le canvas ne capte aucun événement — toute l'interaction reste dans le DOM.
 */
const root = useTemplateRef('root')

// le canvas est généré par TresJS : on le déclare décoratif pour les AT
onMounted(() => {
  root.value?.querySelector('canvas')?.setAttribute('aria-hidden', 'true')
})
</script>

<template>
  <div ref="root" class="scene-night" aria-hidden="true">
    <TresCanvas :alpha="true" :antialias="false" :depth="false" :stencil="false" :power-preference="'low-power'">
      <TresPerspectiveCamera :position="[0, 0, 9]" :fov="48" />
      <SceneNightRig />
    </TresCanvas>
  </div>
</template>

<style scoped>
.scene-night {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>

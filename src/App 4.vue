<script setup lang="ts">
import { ref } from 'vue'
const showPrep = ref(false)
const done = ref(false)
const items = ref(['Biscuits préparés', 'Mot imprimé', 'Scène installée'])
const checked = ref<boolean[]>([false, false, false])
const touchStartX = ref<number | null>(null)
const swipeMessage = ref('')
function buzz(pattern: number | number[] = 12) { navigator.vibrate?.(pattern) }
function toggle(index: number) { checked.value[index] = !checked.value[index]; buzz(checked.value[index] ? 16 : 8) }
function copyMessage() { void navigator.clipboard?.writeText('Coucou Louis ! C’est moi ! On fête mon arrivée avec des biscuits ?') }
function markDone() { done.value = !done.value; buzz(done.value ? [18, 30, 18] : 10) }
function startSwipe(event: TouchEvent) { touchStartX.value = event.changedTouches[0]?.clientX ?? null }
function endSwipe(event: TouchEvent) {
  if (touchStartX.value === null) return
  const delta = (event.changedTouches[0]?.clientX ?? touchStartX.value) - touchStartX.value
  if (Math.abs(delta) > 70) {
    swipeMessage.value = delta < 0 ? 'Journée suivante' : 'Journée précédente'
    window.setTimeout(() => { swipeMessage.value = '' }, 900)
    buzz(10)
  }
  touchStartX.value = null
}
</script>

<template>
  <v-app class="story-app">
    <main class="story-screen" @touchstart.passive="startSwipe" @touchend.passive="endSwipe">
      <img class="story-screen__image" src="/assets/created/arrival-mobile-hero.png" alt="Un petit lutin vient d’arriver près du sapin de Noël" />
      <div class="story-screen__gradient" />
      <header class="story-header"><div class="mini-brand"><span>✦</span><strong>Mon aventure</strong></div><div class="header-actions"><span>15 nov. 2026</span><v-btn icon variant="text" aria-label="Ouvrir les réglages"><v-icon icon="mdi-tune-variant" /></v-btn></div></header>
      <div class="story-screen__chapter"><span>CHAPITRE II</span><i /> <span>LA RENCONTRE</span></div>
      <section class="story-intro"><p class="story-intro__eyebrow">Ce soir, dans la maison</p><h1>Le lutin<br /><em>est arrivé.</em></h1><p class="story-intro__sub">Une première nuit à préparer.<br />Une histoire qui commence demain matin.</p></section>
      <button class="reveal-hint" type="button" @click="showPrep = !showPrep"><span>{{ showPrep ? 'Refermer les préparatifs' : 'Préparer la scène' }}</span><span class="reveal-hint__circle"><v-icon :icon="showPrep ? 'mdi-chevron-up' : 'mdi-arrow-down'" size="18" /></span></button>
      <Transition name="toast"><div v-if="swipeMessage" class="swipe-toast"><v-icon icon="mdi-swap-horizontal" size="17" /> {{ swipeMessage }}</div></Transition>
      <Transition name="backdrop"><button v-if="showPrep" class="sheet-backdrop" type="button" aria-label="Fermer les préparatifs" @click="showPrep = false" /></Transition>

      <Transition name="sheet"><section v-if="showPrep" class="prep-sheet" aria-label="Préparatifs du soir"><button class="sheet-close" type="button" aria-label="Fermer les préparatifs" @click="showPrep = false"><v-icon icon="mdi-close" size="18" /></button><div class="sheet-handle" /><div class="sheet-top"><div><p class="sheet-kicker">La scène prend vie</p><h2>Trois petits gestes.</h2></div><span class="sheet-count">{{ checked.filter(Boolean).length }}/3</span></div><button v-for="(item, index) in items" :key="item" class="prep-item" :class="{ active: checked[index] }" type="button" @click="toggle(index)"><span class="prep-check"><v-icon v-if="checked[index]" icon="mdi-check" size="15" /></span><span>{{ item }}</span><v-icon icon="mdi-arrow-up-right" size="17" /></button><v-btn class="finish-button" block rounded="xl" size="large" :color="done ? 'secondary' : 'primary'" @click="markDone"><v-icon :icon="done ? 'mdi-check-circle-outline' : 'mdi-sparkles'" start />{{ done ? 'Journée réalisée' : 'Tout est prêt' }}</v-btn></section></Transition>

      <div class="story-footer"><span>JOUR 30 <i /> 1 LUTIN</span><button type="button" @click="copyMessage"><v-icon icon="mdi-content-copy" size="15" /> Copier le mot</button></div>
    </main>
  </v-app>
</template>

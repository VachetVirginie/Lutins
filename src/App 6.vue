<script setup lang="ts">
import { computed, ref } from 'vue'
type Mode = 'home' | 'discover' | 'prepare'
const mode = ref<Mode>('home')
const focus = ref<'elf' | 'letter' | 'bag' | null>(null)
const checked = ref([false, false, false])
const done = ref(false)
const progress = computed(() => Math.round((checked.value.filter(Boolean).length / 3) * 100))
const labels = ['Biscuits préparés', 'Mot imprimé', 'Scène installée']
function openMode(next: Mode, object: 'elf' | 'letter' | 'bag') { focus.value = object; mode.value = next; navigator.vibrate?.(12) }
function closeMode() { mode.value = 'home'; focus.value = null }
function toggle(index: number) { checked.value[index] = !checked.value[index]; navigator.vibrate?.(12) }
function copyMessage() { void navigator.clipboard?.writeText('Coucou Louis ! C’est moi ! On fête mon arrivée avec des biscuits ?') }
</script>

<template>
  <v-app class="scene-app">
    <main class="scene-screen" :class="`scene-screen--${mode}`">
      <img class="scene-screen__image" src="/assets/created/arrival-mobile-hero.png" alt="Un lutin vient d’arriver près du sapin de Noël" />
      <div class="scene-screen__veil" />
      <header class="scene-header">
        <button class="scene-brand" type="button" aria-label="Revenir à l’accueil" @click="closeMode"><span class="scene-brand__mark">✦</span><span><small>MON AVENTURE</small><strong>des lutins</strong></span></button>
        <span class="scene-date">15 NOV. <b>2026</b></span>
      </header>
      <section v-if="mode === 'home'" class="scene-intro">
        <p class="scene-eyebrow"><span /> CHAPITRE II <i /> LA RENCONTRE</p><p class="scene-kicker">L’aventure de Louis · Jour 30</p><h1>Une surprise<br /><em>chaque matin.</em></h1><p class="scene-subtitle">Le carnet de bord des lutins, préparé avec amour.</p>
      </section>
      <section v-if="mode === 'home'" class="scene-stage" aria-label="La scène interactive du jour">
        <button class="scene-object scene-object--elf" type="button" @click="openMode('discover', 'elf')"><span class="object-pulse" /><span class="object-tag">Le lutin</span><span class="object-action">Découvrir <v-icon icon="mdi-arrow-up-right" size="16" /></span></button>
        <button class="scene-object scene-object--letter" type="button" @click="openMode('discover', 'letter')"><span class="letter-mark">✦</span><span class="object-tag">Son message</span><span class="object-action">Lire le mot <v-icon icon="mdi-arrow-up-right" size="16" /></span></button>
        <button class="scene-object scene-object--bag" type="button" @click="openMode('prepare', 'bag')"><v-icon icon="mdi-bag-personal-outline" size="24" /><span class="object-tag">Ce soir</span><span class="object-action">Préparer <v-icon icon="mdi-arrow-up-right" size="16" /></span></button>
      </section>
      <section v-if="mode === 'home'" class="scene-bottom"><div><small>LA SCÈNE D’AUJOURD’HUI</small><strong>3 choses à explorer</strong></div><button type="button" class="scene-explore" @click="openMode('prepare', 'bag')">Explorer <v-icon icon="mdi-arrow-up" size="17" /></button></section>
      <Transition name="scene-reveal">
        <section v-if="mode !== 'home'" class="scene-panel" :class="`scene-panel--${mode}`" :aria-label="mode === 'discover' ? 'Découvrir la journée' : 'Préparer la journée'">
          <div class="panel-handle" /><button class="panel-close" type="button" aria-label="Fermer" @click="closeMode"><v-icon icon="mdi-close" size="19" /></button><div class="panel-topline"><span>JOUR 30</span><i /><span>DIMANCHE 15 NOV.</span></div>
          <template v-if="mode === 'discover'"><p class="panel-kicker">LA RENCONTRE</p><h2>Le lutin<br /><em>est arrivé.</em></h2><p class="panel-intro">Cette nuit, il s’est installé dans le salon. Une première présence à découvrir demain matin.</p><div class="message-object"><span class="message-star">✦</span><small>LE MOT À LAISSER</small><blockquote>« Coucou Louis ! C’est moi ! On fête mon arrivée avec des biscuits ? »</blockquote><button type="button" @click="copyMessage">Copier le mot <v-icon icon="mdi-content-copy" size="15" /></button></div><button class="panel-cta" type="button" @click="openMode('prepare', 'bag')">Préparer la scène <v-icon icon="mdi-arrow-right" size="19" /></button></template>
          <template v-else><p class="panel-kicker">AVANT LE RÉVEIL</p><h2>Tout est prêt<br /><em>pour demain.</em></h2><div class="prepare-progress"><span><b>{{ progress }}%</b> de la scène préparée</span><div><i :style="{ width: `${progress}%` }" /></div></div><div class="prep-list"><button v-for="(label, index) in labels" :key="label" type="button" @click="toggle(index)"><i :class="{ checked: checked[index] }"><v-icon v-if="checked[index]" icon="mdi-check" size="14" /></i><span>{{ label }}</span><v-icon :icon="checked[index] ? 'mdi-check-circle-outline' : 'mdi-arrow-up-right'" size="18" /></button></div><div class="materials"><small>À RASSEMBLER · 4 ÉLÉMENTS</small><div><span>🍪 Biscuits</span><span>✉ Mot imprimé</span><span>✦ Enveloppe</span><span>🧸 1 lutin</span></div></div><p class="safety"><v-icon icon="mdi-shield-check-outline" size="16" /> Lumière LED recommandée · petits éléments hors de portée</p><button class="panel-cta" :class="{ completed: done }" type="button" @click="done = !done"><v-icon :icon="done ? 'mdi-check' : 'mdi-sparkles'" size="18" />{{ done ? 'Scène prête pour demain' : 'Marquer comme prêt' }}</button></template>
        </section>
      </Transition>
    </main>
  </v-app>
</template>

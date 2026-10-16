<script setup lang="ts">
import { computed, ref } from 'vue'

const mode = ref<'home' | 'discover' | 'prepare'>('home')
const checked = ref([false, false, false])
const done = ref(false)
const progress = computed(() => Math.round((checked.value.filter(Boolean).length / checked.value.length) * 100))
function toggle(index: number) { checked.value[index] = !checked.value[index]; navigator.vibrate?.(12) }
function copyMessage() { void navigator.clipboard?.writeText('Coucou Louis ! C’est moi ! On fête mon arrivée avec des biscuits ?') }
</script>

<template>
  <v-app class="home-app">
    <main class="home-screen">
      <img class="home-screen__image" src="/assets/created/arrival-mobile-hero.png" alt="Un lutin vient d’arriver près du sapin de Noël" />
      <div class="home-screen__veil" />
      <header class="home-header"><div class="home-brand"><span class="home-brand__mark">✦</span><div><small>MON AVENTURE</small><strong>des lutins</strong></div></div><v-btn icon variant="text" aria-label="Ouvrir les réglages"><v-icon icon="mdi-tune-variant" /></v-btn></header>

      <section class="home-cover"><p class="home-kicker">L’aventure de Louis · 2026</p><h1>Une surprise<br /><em>chaque matin.</em></h1><p class="home-subtitle">Le carnet de bord des lutins, préparé avec amour.</p><div class="journey-progress" aria-label="Progression de l’aventure"><div v-for="n in 10" :key="n" class="journey-dot" :class="{ filled: n <= 4, current: n === 4 }" /></div><span class="journey-label">Jour 30 <i /> 70</span></section>

      <section class="home-cards" aria-label="Résumé de l’aventure">
        <button class="today-card" type="button" @click="mode = 'discover'"><span class="card-index">30</span><span class="card-content"><span class="card-overline">AUJOURD’HUI · DIMANCHE 15 NOV.</span><strong>Le lutin est arrivé</strong><span class="card-caption">Découvrir l’histoire du jour</span></span><span class="card-arrow"><v-icon icon="mdi-arrow-up-right" size="20" /></span></button>
        <button class="tonight-card" type="button" @click="mode = 'prepare'"><span class="tonight-icon"><v-icon icon="mdi-format-list-checks" size="19" /></span><span class="tonight-copy"><small>À PRÉPARER CE SOIR</small><strong>3 gestes · 4 éléments</strong></span><v-icon class="tonight-arrow" icon="mdi-chevron-right" size="21" /></button>
      </section>

      <Transition name="sheet"><section v-if="mode !== 'home'" class="home-sheet" :class="{ 'home-sheet--discover': mode === 'discover' }" :aria-label="mode === 'discover' ? 'Découvrir la journée' : 'Préparer la journée'"><button class="sheet-close" type="button" aria-label="Fermer" @click="mode = 'home'"><v-icon icon="mdi-close" size="18" /></button><p class="home-kicker">Jour 30 · La rencontre</p><template v-if="mode === 'discover'"><h2>Le lutin est arrivé.</h2><p class="sheet-intro">Cette nuit, il s’est installé dans le salon. Demain matin, les enfants découvriront sa première lettre et une petite surprise.</p><div class="discovery-scene"><img src="/assets/created/arrival-mobile-hero.png" alt="Le lutin près du sapin" /><span>UNE NOUVELLE PRÉSENCE</span></div><div class="sheet-message"><span>LE MOT À LAISSER <button type="button" @click="copyMessage">Copier</button></span><blockquote>« Coucou Louis ! C’est moi ! On fête mon arrivée avec des biscuits ? »</blockquote></div><v-btn class="home-finish" block rounded="xl" size="large" color="primary" @click="mode = 'prepare'"><v-icon icon="mdi-arrow-down" start />Passer aux préparatifs</v-btn></template><template v-else><h2>Préparer la scène.</h2><p class="sheet-intro">Tout ce qu’il faut rassembler et faire avant le réveil.</p><div class="sheet-section"><div><small>À FAIRE CE SOIR</small><strong>La scène prend vie</strong></div><span>{{ checked.filter(Boolean).length }}/3</span></div><div class="sheet-list"><button v-for="(label, index) in ['Biscuits préparés', 'Mot imprimé', 'Scène installée']" :key="label" type="button" @click="toggle(index)"><i :class="{ checked: checked[index] }"><v-icon v-if="checked[index]" icon="mdi-check" size="14" /></i><span>{{ label }}</span><v-icon icon="mdi-arrow-up-right" size="16" /></button></div><div class="sheet-section material-section"><div><small>MATÉRIEL NÉCESSAIRE</small><strong>À rassembler</strong></div><span class="material-count">4 éléments</span></div><div class="material-chips"><span><v-icon icon="mdi-cookie-outline" size="15" /> Biscuits</span><span><v-icon icon="mdi-card-text-outline" size="15" /> Pancarte</span><span><v-icon icon="mdi-envelope-outline" size="15" /> Enveloppe</span><span><v-icon icon="mdi-teddy-bear" size="15" /> 1 lutin</span></div><p class="sheet-note"><v-icon icon="mdi-shield-check-outline" size="16" /> Utiliser une lumière LED et garder les petits éléments hors de portée.</p><v-btn class="home-finish" block rounded="xl" size="large" :color="done ? 'secondary' : 'primary'" @click="done = !done"><v-icon :icon="done ? 'mdi-check-circle-outline' : 'mdi-sparkles'" start />{{ done ? 'Journée réalisée' : 'Tout est prêt' }}</v-btn></template></section></Transition>
    </main>
  </v-app>
</template>

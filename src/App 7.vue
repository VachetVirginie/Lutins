<script setup lang="ts">
import { ref } from 'vue'
const started = ref(false)
</script>
<template>
  <v-app class="opening-app"><main class="opening-screen"><img class="opening-image" src="/assets/created/arrival-mobile-hero.png" alt="Un lutin se prépare à commencer son aventure de Noël" /><div class="opening-overlay" /><header class="opening-header"><div class="opening-brand"><span>✦</span><strong>Mon aventure</strong></div><time datetime="2026-11-15">15 NOV. 2026</time></header><section class="opening-copy"><p class="opening-chapter"><i /> UNE NOUVELLE AVENTURE <i /></p><p class="opening-kicker">L’aventure de Louis</p><h1>Une surprise<br /><em>chaque matin.</em></h1><p class="opening-subtitle">Le voyage de vos lutins commence ici.</p></section><section class="opening-entry" aria-label="Entrer dans l’aventure"><p>70 jours de magie à préparer<br />au rythme de votre famille.</p><button class="opening-slider" type="button" @click="started = !started"><span>{{ started ? 'L’aventure est ouverte' : 'Commencer l’aventure' }}</span><b><v-icon :icon="started ? 'mdi-check' : 'mdi-arrow-right'" size="20" /></b></button></section><footer class="opening-footer"><span>LOUIS <i /> 2026</span><span>UNE HISTOIRE À VIVRE</span></footer></main></v-app>
</template>

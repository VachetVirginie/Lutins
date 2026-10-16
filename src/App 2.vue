<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type ChecklistKey = 'material' | 'support' | 'message' | 'scene'

interface ChecklistItem {
  key: ChecklistKey
  label: string
  hint: string
  done: boolean
}

const today = ref('2026-11-15')
const completed = ref(localStorage.getItem('lutins-day-30-done') === 'true')
const checklist = ref<ChecklistItem[]>([
  { key: 'material', label: 'Préparer les biscuits', hint: 'Une petite gourmandise adaptée à la famille', done: false },
  { key: 'support', label: 'Préparer la pancarte', hint: 'Le support est prêt à imprimer', done: false },
  { key: 'message', label: 'Préparer le mot', hint: 'Le texte est prêt à être copié', done: false },
  { key: 'scene', label: 'Installer la scène', hint: 'À faire ce soir, hors de portée des petites pièces', done: false },
])

watch(completed, (value) => localStorage.setItem('lutins-day-30-done', String(value)))

const progress = computed(() => Math.round((checklist.value.filter((item) => item.done).length / checklist.value.length) * 100))
const checklistLabel = computed(() => `${checklist.value.filter((item) => item.done).length}/${checklist.value.length} préparatifs`)

function toggleDone(item: ChecklistItem) {
  item.done = !item.done
}

function markCompleted() {
  completed.value = !completed.value
}

function copyMessage() {
  void navigator.clipboard?.writeText('COUCOU LOUIS ! C’est moi ! On fête mon arrivée avec des biscuits ?')
}
</script>

<template>
  <v-app>
    <v-app-bar class="app-bar" flat height="76">
      <v-container class="app-bar__inner">
        <div class="brand-mark" aria-hidden="true">✦</div>
        <div>
          <div class="brand-kicker">Mon aventure</div>
          <div class="brand-name">des lutins</div>
        </div>
        <v-spacer />
        <v-btn icon variant="text" aria-label="Ouvrir les réglages">
          <v-icon icon="mdi-cog-outline" />
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="page-shell">
        <section class="hero-intro" aria-labelledby="page-title">
          <div>
            <p class="eyebrow">Dimanche 15 novembre 2026 · Jour 30</p>
            <h1 id="page-title">L’arrivée du lutin</h1>
            <p class="hero-copy">Ce soir, préparez une arrivée douce et joyeuse. Demain matin, l’aventure commence vraiment.</p>
          </div>
          <div class="progress-orb" aria-label="Progression des préparatifs">
            <span>{{ progress }}%</span>
            <small>prêt</small>
          </div>
        </section>

        <v-row class="main-grid" align="stretch">
          <v-col cols="12" lg="7">
            <v-card class="story-card" elevation="0">
              <div class="story-card__image">
                <img src="/assets/created/journey-backpack.png" alt="Un lutin voyageur dans un paysage enneigé" />
                <div class="image-badge"><v-icon icon="mdi-sparkles" size="16" /> Arrivée</div>
              </div>
              <v-card-text class="story-card__body">
                <div class="story-meta"><span>1 lutin</span><span>•</span><span>Mise en scène</span></div>
                <h2>Le lutin s’installe chez vous</h2>
                <p>Les enfants vont découvrir le premier lutin assis au milieu du salon, avec une pancarte et une petite surprise.</p>
                <div class="message-card">
                  <div class="message-card__top"><span>Le mot à laisser</span><v-btn size="small" variant="text" prepend-icon="mdi-content-copy" @click="copyMessage">Copier</v-btn></div>
                  <p>« Coucou Louis ! C’est moi ! On fête mon arrivée avec des biscuits ? »</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="5">
            <v-card class="prep-card" elevation="0">
              <div class="section-heading">
                <div><p class="eyebrow">Pour ce soir</p><h2>Les préparatifs</h2></div>
                <span class="prep-count">{{ checklistLabel }}</span>
              </div>
              <div class="checklist" role="group" aria-label="Checklist des préparatifs">
                <button v-for="item in checklist" :key="item.key" class="check-row" :class="{ 'check-row--done': item.done }" type="button" @click="toggleDone(item)">
                  <span class="check-box" aria-hidden="true"><v-icon v-if="item.done" icon="mdi-check" size="16" /></span>
                  <span class="check-copy"><strong>{{ item.label }}</strong><small>{{ item.hint }}</small></span>
                </button>
              </div>
              <v-btn class="complete-btn" block size="large" rounded="xl" :color="completed ? 'secondary' : 'primary'" @click="markCompleted">
                <v-icon :icon="completed ? 'mdi-check-circle-outline' : 'mdi-star-four-points-outline'" start />
                {{ completed ? 'Journée réalisée' : 'Marquer la journée réalisée' }}
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <section class="anticipation-section" aria-labelledby="anticipation-title">
          <div class="section-heading section-heading--wide"><div><p class="eyebrow">Ne pas attendre la veille</p><h2 id="anticipation-title">À anticiper cette semaine</h2></div><v-btn variant="text" append-icon="mdi-arrow-right">Tout voir</v-btn></div>
          <v-row>
            <v-col v-for="item in [{icon:'mdi-paperclip',title:'Papier cartonné',day:'dans 3 jours',tag:'À acheter'},{icon:'mdi-printer-outline',title:'Carte du voyage',day:'dans 5 jours',tag:'À imprimer'},{icon:'mdi-cookie-outline',title:'Biscuits emballés',day:'dans 6 jours',tag:'Déjà disponible'}]" :key="item.title" cols="12" sm="4">
              <v-card class="anticipation-card" elevation="0"><v-avatar class="anticipation-icon" size="42"><v-icon :icon="item.icon" /></v-avatar><div><strong>{{ item.title }}</strong><span>{{ item.day }}</span></div><v-chip size="small" variant="tonal">{{ item.tag }}</v-chip></v-card>
            </v-col>
          </v-row>
        </section>
      </v-container>
    </v-main>

    <v-bottom-navigation class="bottom-nav" grow color="primary">
      <v-btn value="today"><v-icon icon="mdi-sparkles" /><span>Aujourd’hui</span></v-btn>
      <v-btn value="planning"><v-icon icon="mdi-calendar-month-outline" /><span>Planning</span></v-btn>
      <v-btn value="prep"><v-icon icon="mdi-basket-outline" /><span>Préparatifs</span></v-btn>
      <v-btn value="memories"><v-icon icon="mdi-image-multiple-outline" /><span>Souvenirs</span></v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

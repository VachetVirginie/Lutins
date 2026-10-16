<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HomeNav } from '../components/home'

interface Sheet {
  date: string
  title: string
  tagline: string
  duration: string
  level: string
  description: string
  steps: string[]
  material: { label: string; done: boolean }[]
  tip: string
}

const sheets: Record<string, Sheet> = {
  'farce-reveil': {
    date: '2 décembre',
    title: 'Farce du réveil',
    tagline: 'Le lutin sème des empreintes de pas en farine jusqu’à la cuisine.',
    duration: '10 min la veille',
    level: 'Facile',
    description:
      'Pendant la nuit, le lutin s’est promené dans la farine et a laissé de petites empreintes depuis l’étagère du salon jusqu’au plan de travail de la cuisine. Au matin, les enfants suivent la piste pour découvrir ce qu’il a préparé.',
    steps: [
      'Verser un peu de farine dans une soucoupe.',
      'Dessiner des traces de pas du bout du doigt (ou avec le poing fermé pour les semelles).',
      'Tracer un chemin de l’étagère à la cuisine, en variant la direction.',
      'Poser le lutin près du bol de farine, les pieds légèrement poudrés.',
    ],
    material: [
      { label: 'Farine ou sucre glace', done: false },
      { label: 'Soucoupe', done: true },
      { label: 'Le lutin Flocon', done: true },
    ],
    tip: 'Une trace qui monte sur le rebord de la table rend la scène beaucoup plus crédible — les enfants adorent reconstituer le trajet.',
  },
  'chasse-tresor': {
    date: '5 décembre',
    title: 'Chasse au trésor',
    tagline: 'Des indices cachés dans la maison, un trésor de chocolats à la clé.',
    duration: '20 min la veille',
    level: 'Moyen',
    description:
      'Le lutin a glissé quatre petites énigmes dans la maison. Chaque indice mène au suivant et le dernier révèle une cachette remplie de chocolats pour le goûter.',
    steps: [
      'Écrire 4 énigmes courtes adaptées à l’âge des enfants.',
      'Cacher les indices : sous un coussin, dans une chaussure, derrière le sapin, dans la boîte aux lettres.',
      'Déposer le trésor (chocolats) dans la cachette finale.',
      'Installer le lutin à côté du premier indice, une loupe en papier à la main.',
    ],
    material: [
      { label: '4 cartes d’énigmes', done: false },
      { label: 'Chocolats pour le trésor', done: false },
      { label: 'Ruban doré (facultatif)', done: false },
    ],
    tip: 'Prévoyez un indice « de secours » verbal si les enfants calent — la magie doit rester légère.',
  },
  'nuit-guirlandes': {
    date: '9 décembre',
    title: 'Nuit des guirlandes',
    tagline: 'Le lutin s’est emmêlé dans les câbles du sapin.',
    duration: '5 min la veille',
    level: 'Facile',
    description:
      'En voulant ajouter une guirlande, le lutin s’est retrouvé suspendu dans les câbles lumineux du sapin. Les enfants le découvrent coincé au petit matin.',
    steps: [
      'Dérouler une guirlande supplémentaire autour du sapin.',
      'Suspendre le lutin par un fil doré dans les branches.',
      'Éparpiller quelques boules autour de lui.',
      'Laisser un petit mot : « À l’aide ! »',
    ],
    material: [
      { label: 'Guirlande lumineuse', done: true },
      { label: 'Fil doré', done: false },
      { label: 'Petit mot manuscrit', done: false },
    ],
    tip: 'Pensez à garder la guirlande éteinte la nuit — le rendu au réveil n’en sera que plus drôle.',
  },
  'atelier-biscuits': {
    date: '14 décembre',
    title: 'Atelier biscuits',
    tagline: 'Le lutin a préparé la pâte pendant la nuit.',
    duration: '15 min la veille',
    level: 'Facile',
    description:
      'Sur le plan de travail : un petit rouleau, des emporte-pièces et une pâte sablée entamée. Le lutin a déjà coupé trois étoiles — il ne reste qu’à finir la fournée ensemble.',
    steps: [
      'Préparer (ou acheter) une pâte sablée la veille.',
      'Disposer rouleau et emporte-pièces sur le plan de travail.',
      'Couper 2-3 formes et saupoudrer légèrement de farine.',
      'Poser le lutin, un peu de farine sur le bonnet.',
    ],
    material: [
      { label: 'Pâte sablée', done: false },
      { label: 'Emporte-pièces étoile', done: true },
      { label: 'Petit rouleau', done: true },
    ],
    tip: 'Planifiez cette farce un week-end : elle débouche naturellement sur un vrai atelier pâtisserie en famille.',
  },
}

const route = useRoute()
const sheet = computed(() => sheets[String(route.params.activityId)])
const material = ref<Sheet['material']>([])

watch(sheet, (s) => { material.value = s ? s.material.map((m) => ({ ...m })) : [] }, { immediate: true })

const doneCount = computed(() => material.value.filter((m) => m.done).length)
</script>

<template>
  <main class="app-screen">
    <header class="activity-head">
      <RouterLink class="back-link" to="/planning"><i class="mdi mdi-arrow-left" aria-hidden="true" /> Planning</RouterLink>
      <template v-if="sheet">
        <p class="home-overline">FICHE DU JOUR · {{ sheet.date.toUpperCase() }}</p>
        <h1>{{ sheet.title }}</h1>
        <p class="activity-tagline">{{ sheet.tagline }}</p>
      </template>
      <template v-else>
        <p class="home-overline">FICHE DU JOUR</p>
        <h1>Introuvable</h1>
        <p class="activity-tagline">Cette fiche n’existe pas encore.</p>
      </template>
    </header>

    <template v-if="sheet">
      <div class="activity-meta">
        <span><i class="mdi mdi-timer-outline" aria-hidden="true" /> {{ sheet.duration }}</span>
        <span><i class="mdi mdi-star-outline" aria-hidden="true" /> {{ sheet.level }}</span>
      </div>

      <section class="app-card">
        <p class="home-overline">LA SCÈNE</p>
        <p class="activity-desc">{{ sheet.description }}</p>
      </section>

      <section class="app-card">
        <p class="home-overline">MATÉRIEL · {{ doneCount }}/{{ material.length }}</p>
        <ul class="mat-list">
          <li v-for="m in material" :key="m.label">
            <button class="mat-row" type="button" :class="{ 'is-done': m.done }" @click="m.done = !m.done">
              <span class="mat-check"><i v-if="m.done" class="mdi mdi-check" aria-hidden="true" /></span>
              <strong>{{ m.label }}</strong>
            </button>
          </li>
        </ul>
      </section>

      <section class="app-card">
        <p class="home-overline">MISE EN PLACE</p>
        <ol class="step-list">
          <li v-for="(s, i) in sheet.steps" :key="i"><span class="step-num">{{ i + 1 }}</span>{{ s }}</li>
        </ol>
      </section>

      <aside class="activity-tip">
        <i class="mdi mdi-lightbulb-on-outline" aria-hidden="true" />
        <p><strong>Astuce du lutin.</strong> {{ sheet.tip }}</p>
      </aside>
    </template>

    <HomeNav />
  </main>
</template>

<style scoped>
.activity-head{margin-top:6px}
.back-link{display:inline-flex;align-items:center;gap:5px;margin-bottom:16px;color:rgba(255,255,255,.6);font-size:12px;text-decoration:none}
.back-link:hover{color:#e6c280}
.activity-head h1{margin:6px 0 0;font:500 30px/1.05 var(--font-serif);letter-spacing:-.02em;color:#f7efdb}
.activity-tagline{margin:8px 0 0;color:#a9bcae;font-size:13px;line-height:1.5}
.activity-meta{display:flex;gap:10px;margin-top:14px}
.activity-meta span{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid rgba(241,204,122,.3);border-radius:999px;background:rgba(241,204,122,.06);color:#e6c280;font-size:11px;font-weight:600}
.activity-meta i{font-size:14px}
.activity-desc{margin:8px 0 0;font-size:13px;line-height:1.65;color:rgba(255,255,255,.78)}
.mat-list{list-style:none;margin:8px 0 0;padding:0;border-top:1px solid rgba(255,255,255,.05)}
.mat-row{display:flex;align-items:center;gap:12px;width:100%;padding:11px 2px;border:0;border-bottom:1px solid rgba(255,255,255,.05);background:none;text-align:left;cursor:pointer}
.mat-list li:last-child .mat-row{border-bottom:0}
.mat-check{display:grid;place-items:center;width:22px;height:22px;flex:0 0 auto;border:1.5px solid rgba(255,255,255,.3);border-radius:50%;background:transparent;color:#1c3a30;font-size:12px;transition:background .25s,border-color .25s}
.mat-row.is-done .mat-check{background:#e6c280;border-color:#e6c280}
.mat-row strong{font-size:14px;font-weight:500;color:#fff;transition:color .25s}
.mat-row.is-done strong{color:rgba(255,255,255,.45)}
.step-list{list-style:none;margin:8px 0 0;padding:0;counter-reset:steps}
.step-list li{display:flex;gap:11px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;line-height:1.55;color:rgba(255,255,255,.78)}
.step-list li:last-child{border-bottom:0}
.step-num{display:grid;place-items:center;flex:0 0 auto;width:22px;height:22px;margin-top:1px;border-radius:50%;background:rgba(241,204,122,.14);color:#e6c280;font-size:11px;font-weight:700}
.activity-tip{display:flex;gap:11px;margin-top:22px;padding:15px 16px;border:1px solid rgba(255,215,0,.3);border-radius:18px;background:linear-gradient(180deg,rgba(255,215,0,.08),rgba(255,215,0,.03));box-shadow:0 0 24px rgba(255,215,0,.08)}
.activity-tip i{flex:0 0 auto;margin-top:2px;color:#ffd700;font-size:19px}
.activity-tip p{margin:0;font-size:12px;line-height:1.55;color:rgba(255,255,255,.8)}
.activity-tip strong{color:#ffe9a8}
</style>

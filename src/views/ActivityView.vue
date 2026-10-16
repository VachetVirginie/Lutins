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
  'jour-1-alerte-pole-nord': {
    date: 'Jour 1',
    title: 'Alerte du Pôle Nord',
    tagline: 'Un premier courrier donne le signal du départ.',
    duration: '15 min',
    level: 'Essentiel',
    description:
      'L’aventure commence par un courrier officiel du Pôle Nord : le Père Noël annonce qu’un lutin a été choisi pour rejoindre votre maison. Le voyage durera 70 jours — cette lettre plante le décor et fait naître l’attente.',
    steps: [
      'Imprimer ou écrire le courrier du Pôle Nord.',
      'Personnaliser le message (prénom des enfants, nom de la ville).',
      'Glisser la lettre dans une belle enveloppe cachetée.',
      'La déposer dans la boîte aux lettres ou sur le paillasson.',
    ],
    material: [
      { label: 'Courrier du Pôle Nord (imprimé)', done: false },
      { label: 'Enveloppe + cachet', done: false },
      { label: 'Tampon ou cire dorée (facultatif)', done: false },
    ],
    tip: 'Cachet à la cire ou simple autocollant doré : le détail qui fait tout, les enfants examinent toujours l’enveloppe en premier.',
  },
  'jour-2-preparation-sac': {
    date: 'Jour 2',
    title: 'Préparation du sac',
    tagline: 'Le lutin prépare son sac de voyage — carte et petit indice.',
    duration: '10 min',
    level: 'Facile',
    description:
      'Deuxième jour : le voyage devient concret. Une petite carte du trajet et un indice matériel (un bouton, un fil doré) montrent que le lutin fait déjà son sac pour vous rejoindre.',
    steps: [
      'Imprimer la carte du voyage (Pôle Nord → votre ville).',
      'Ajouter un petit élément de voyage à côté (ficelle, bouton doré).',
      'Poser le tout sur la table, comme tombé d’un sac.',
    ],
    material: [
      { label: 'Carte du voyage (imprimée)', done: false },
      { label: 'Petit bouton ou fil doré', done: false },
    ],
    tip: 'La carte gagne à être légèrement froissée et cornée — elle a fait un bout de route.',
  },
  'jour-3-depart-traineau': {
    date: 'Jour 3',
    title: 'Départ en traîneau',
    tagline: 'Le grand départ : carte à compléter et coloriage.',
    duration: '10 min',
    level: 'Facile',
    description:
      'Le lutin a officiellement quitté le Pôle Nord en traîneau. Pour marquer le coup, les enfants reçoivent une carte à suivre jour après jour et un coloriage du départ.',
    steps: [
      'Imprimer la carte de suivi du voyage.',
      'Imprimer le coloriage du traîneau.',
      'Les disposer avec des crayons près du sapin ou dans la chambre.',
    ],
    material: [
      { label: 'Carte de suivi (imprimée)', done: false },
      { label: 'Coloriage traîneau (imprimé)', done: false },
      { label: 'Crayons de couleur', done: true },
    ],
    tip: 'Prévoyez un petit cadre ou une pince pour accrocher la carte de suivi — elle servira pendant 70 jours.',
  },
  'jour-4-pause-gouter': {
    date: 'Jour 4',
    title: 'Première pause goûter',
    tagline: 'Un mot du lutin depuis sa première halte.',
    duration: '10 min',
    level: 'Facile',
    description:
      'Le lutin écrit depuis sa première pause : un petit mot racontant le paysage traversé et annonçant la suite. Le courrier devient un rituel.',
    steps: [
      'Écrire ou imprimer le mot du lutin.',
      'Signer d’une petite empreinte ou d’un dessin.',
      'Le déposer au même endroit que la veille pour créer l’habitude.',
    ],
    material: [
      { label: 'Mot du lutin (imprimé ou manuscrit)', done: false },
      { label: 'Enveloppe', done: false },
    ],
    tip: 'Gardez toujours le même point de dépôt pour le courrier — le rituel rassure et fait venir les enfants d’eux-mêmes.',
  },
}

function genericSheet(id: string): Sheet | undefined {
  const m = /^jour-(\d+)/.exec(id)
  if (!m) return undefined
  return {
    date: `Jour ${m[1]}`,
    title: `Journée ${m[1]}`,
    tagline: 'L’aventure continue vers Noël.',
    duration: '10 min',
    level: 'À venir',
    description: 'Cette journée du voyage sera détaillée prochainement.',
    steps: ['La fiche de cette journée arrive bientôt.'],
    material: [],
    tip: 'Revenez bientôt — le voyage continue.',
  }
}

const route = useRoute()
const sheet = computed(() => sheets[String(route.params.activityId)] ?? genericSheet(String(route.params.activityId)))
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

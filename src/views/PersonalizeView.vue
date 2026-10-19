<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { haptic } from '../utils/haptics'
import { adventure, createFamily, familyCode, fileToDataUrl, joinFamily, leaveFamily, syncStatus, uploadPhoto } from '../data/adventureStore'
import { syncAvailable } from '../lib/supabase'

const router = useRouter()

// Le formulaire écrit directement dans l'état partagé de l'aventure
const form = adventure

/* ---- étapes ---- */
const STEPS = [
  { id: 'famille', overline: 'Étape 1 / 6', title: 'Les destinataires' },
  { id: 'lutins', overline: 'Étape 2 / 6', title: 'Les voyageurs' },
  { id: 'voyage', overline: 'Étape 3 / 6', title: 'Le trajet' },
  { id: 'calendrier', overline: 'Étape 4 / 6', title: 'Le calendrier' },
  { id: 'pieces', overline: 'Étape 5 / 6', title: 'Les pièces jointes' },
  { id: 'recap', overline: 'Dernière étape', title: 'La dépêche est prête' },
] as const

// La porte d'entrée : code ou nouvelle aventure — toujours posée
const step = ref(-1)
const dir = ref<'sheet-next' | 'sheet-prev'>('sheet-next')
const current = computed(() => STEPS[Math.max(0, step.value)])
const isLast = computed(() => step.value === STEPS.length - 1)
const isGate = computed(() => step.value === -1)

function next() {
  if (isLast.value) return
  dir.value = 'sheet-next'
  haptic(8)
  step.value++
}
function prev() {
  dir.value = 'sheet-prev'
  haptic(6)
  if (step.value <= 0) router.push('/home')
  else step.value--
}

/* ---- listes à lignes : enfants & proches, une ligne chacun ---- */
if (!form.prenoms_enfants.length) form.prenoms_enfants = ['']
if (!form.proches.length) form.proches = ['']

function addRow(field: 'prenoms_enfants' | 'proches') {
  form[field].push('')
  haptic(8)
}

function removeRow(field: 'prenoms_enfants' | 'proches', index: number) {
  form[field].splice(index, 1)
  if (!form[field].length) form[field].push('')
  haptic(6)
}

/* ---- durée calculée entre les deux dates ---- */
const joursDisponibles = computed(() => {
  if (!form.date_debut || !form.date_fin) return null
  const d = Math.round((new Date(form.date_fin).getTime() - new Date(form.date_debut).getTime()) / 86_400_000) + 1
  return d > 0 ? d : null
})

/* ---- photos : aperçu instantané, upload si l'expédition est partagée ---- */
async function pickPhoto(field: 'photo_entree' | 'photo_lutins', event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  form[field] = await fileToDataUrl(file) // aperçu immédiat + persistance locale
  haptic(10)
  const remote = await uploadPhoto(field, file)
  if (remote) form[field] = remote // remplacé par l'URL distante, visible de l'autre parent
}

/* ---- partage famille : un code relie les deux appareils ---- */
const joinOpen = ref(false)
const joinInput = ref('')
const joinError = ref(false)
const busy = ref(false)
const copied = ref(false)

async function shareCode() {
  const text = `Rejoins l'aventure des lutins avec le code ${familyCode.value}`
  try {
    await navigator.share({ title: 'Lutin farceur', text })
  } catch {
    await navigator.clipboard?.writeText(text).catch(() => {})
    copied.value = true
    window.setTimeout(() => (copied.value = false), 2200)
  }
}

async function onCreateFamily() {
  busy.value = true
  const code = await createFamily()
  busy.value = false
  if (code) {
    haptic([12, 40, 8])
    shareCode()
  }
}

async function onJoin() {
  if (!joinInput.value.trim()) return
  busy.value = true
  joinError.value = !(await joinFamily(joinInput.value))
  busy.value = false
  if (!joinError.value) {
    joinInput.value = ''
    haptic([12, 40, 8])
    step.value = 0 // l'état partagé remplit le formulaire — on le montre
  }
}

function onLeave() {
  leaveFamily()
  haptic(6)
}

const syncLabel = computed(
  () =>
    ({
      local: 'enregistré sur cet appareil',
      connecting: 'connexion…',
      synced: 'synchronisé en direct',
      error: 'erreur de synchronisation',
    })[syncStatus.value],
)

const recap = computed(() => {
  const rows: { label: string; value: string }[] = []
  const kids = form.prenoms_enfants.filter(Boolean)
  if (kids.length) rows.push({ label: 'Destinataires', value: kids.join(', ') })
  const kin = form.proches.filter(Boolean)
  if (kin.length) rows.push({ label: 'Proches', value: kin.join(', ') })
  if (form.nom_lutin) rows.push({ label: 'Premier lutin', value: form.nom_lutin })
  if (form.deuxieme_lutin && form.nom_second_lutin) rows.push({ label: 'Second lutin', value: form.nom_second_lutin })
  if (form.ville) rows.push({ label: 'Ville', value: form.ville })
  if (form.quartier) rows.push({ label: 'Quartier', value: form.quartier })
  if (form.destination) rows.push({ label: 'Destination', value: form.destination })
  if (joursDisponibles.value) rows.push({ label: 'Fenêtre du voyage', value: `${form.date_debut} → ${form.date_fin} · ${joursDisponibles.value} jours` })
  if (form.jours_sans_activite) rows.push({ label: 'Jours de pause', value: form.jours_sans_activite })
  if (form.lieux_sejour) rows.push({ label: 'Lieux de séjour', value: form.lieux_sejour })
  if (form.activites_modifiees) rows.push({ label: 'Ajustements', value: form.activites_modifiees })
  if (form.photo_entree) rows.push({ label: 'J25', value: 'photo de l’entrée jointe' })
  if (form.photo_lutins) rows.push({ label: 'J59 · J61', value: 'portrait des lutins joint' })
  return rows
})
</script>

<template>
  <main class="app-screen personalize-screen">
    <header class="pz-header">
      <button class="pz-back" type="button" @click="prev">
        <i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour
      </button>
      <div class="pz-emblem" aria-hidden="true"><i class="mdi mdi-feather" /><b /><b /></div>
      <p class="pz-overline">LE FORMULAIRE DE L'EXPÉDITION</p>
      <h1>Votre aventure,<br />à vos couleurs</h1>
    </header>

    <!-- le ruban de progression : une piste de cire -->
    <ol v-if="!isGate" class="pz-track" aria-hidden="true">
      <li v-for="(s, i) in STEPS" :key="s.id" :class="{ done: i < step, now: i === step }"><i /></li>
    </ol>

    <!-- la feuille tourne comme une dépêche : transition directionnelle -->
    <Transition :name="dir" mode="out-in" appear>
    <section :key="step" class="pz-sheet" :class="{ 'pz-gate': isGate }" aria-live="polite">
      <i class="pz-spark s1" aria-hidden="true" /><i class="pz-spark s2" aria-hidden="true" />
      <!-- la porte d'entrée : code ou nouvelle expédition -->
      <template v-if="isGate">
      <template v-if="familyCode">
        <p class="pz-step-over">VOTRE EXPÉDITION</p>
        <h2 class="pz-step-title">Vous voyagez déjà à deux</h2>
        <div class="pz-gate-opt pz-gate-linked">
          <i class="mdi mdi-link-variant" aria-hidden="true" />
          <span><b>{{ familyCode }}</b><small>{{ syncLabel }}</small></span>
        </div>
        <button type="button" class="pz-gate-opt" @click="next">
          <i class="mdi mdi-feather" aria-hidden="true" />
          <span><b>Reprendre le formulaire</b><small>vos réglages sont déjà partagés</small></span>
          <i class="mdi mdi-arrow-right" aria-hidden="true" />
        </button>
        <button type="button" class="pz-gate-link" @click="onLeave">Quitter cette expédition</button>
      </template>
      <template v-else>
        <p class="pz-step-over">AVANT TOUT</p>
        <h2 class="pz-step-title">Rejoignez-vous une expédition ?</h2>
        <button
          type="button"
          class="pz-gate-opt"
          :class="{ open: joinOpen }"
          @click="joinOpen = !joinOpen; haptic(8)"
        >
          <i class="mdi mdi-key-variant" aria-hidden="true" />
          <span><b>J'ai un code famille</b><small>l'autre parent m'a invité</small></span>
          <i class="mdi mdi-chevron-down pz-gate-caret" aria-hidden="true" />
        </button>
        <div v-if="joinOpen" class="pz-gate-join">
          <span class="pz-join">
            <input v-model="joinInput" type="text" placeholder="LUTIN-XXXX" maxlength="9" autocapitalize="characters" autofocus />
            <button type="button" class="pz-family-btn" :disabled="busy || !joinInput.trim()" @click="onJoin">Rejoindre</button>
          </span>
          <p v-if="joinError" class="pz-error">Ce code n'existe pas — vérifiez les 4 lettres.</p>
        </div>
        <button type="button" class="pz-gate-opt" @click="next">
          <i class="mdi mdi-feather" aria-hidden="true" />
          <span><b>Je crée notre aventure</b><small>je remplis le formulaire</small></span>
          <i class="mdi mdi-arrow-right" aria-hidden="true" />
        </button>
        <p v-if="!syncAvailable" class="pz-note">La synchronisation n'est pas encore configurée — tout restera sur cet appareil.</p>
      </template>
      </template>

      <!-- les six feuilles de la dépêche -->
      <template v-else>
      <p class="pz-step-over">{{ current.overline }}</p>
      <h2 class="pz-step-title">{{ current.title }}</h2>

      <!-- 1 · la famille -->
      <template v-if="current.id === 'famille'">
        <div class="pz-field">
          <span>Prénom(s) des enfants</span>
          <div v-for="(name, i) in form.prenoms_enfants" :key="i" class="pz-row">
            <input v-model="form.prenoms_enfants[i]" type="text" placeholder="Prénom de l'enfant" autocomplete="off" />
            <button
              v-if="form.prenoms_enfants.length > 1"
              type="button"
              class="pz-row-del"
              aria-label="Retirer cet enfant"
              @click="removeRow('prenoms_enfants', i)"
            >
              <i class="mdi mdi-close" aria-hidden="true" />
            </button>
          </div>
          <button type="button" class="pz-add-row" @click="addRow('prenoms_enfants')">
            <i class="mdi mdi-plus" aria-hidden="true" /> Ajouter un enfant
          </button>
        </div>
        <div class="pz-field">
          <span>Les proches qui apparaissent dans l'histoire</span>
          <div v-for="(name, i) in form.proches" :key="i" class="pz-row">
            <input v-model="form.proches[i]" type="text" placeholder="ex : Papi, Mamie, Tata Lise…" autocomplete="off" />
            <button
              v-if="form.proches.length > 1"
              type="button"
              class="pz-row-del"
              aria-label="Retirer ce proche"
              @click="removeRow('proches', i)"
            >
              <i class="mdi mdi-close" aria-hidden="true" />
            </button>
          </div>
          <button type="button" class="pz-add-row" @click="addRow('proches')">
            <i class="mdi mdi-plus" aria-hidden="true" /> Ajouter un proche
          </button>
        </div>
      </template>

      <!-- 2 · les lutins -->
      <template v-else-if="current.id === 'lutins'">
        <label class="pz-field">
          <span>Le nom du lutin</span>
          <input v-model="form.nom_lutin" type="text" placeholder="ex : Farfadet" />
        </label>
        <label class="pz-switch">
          <input v-model="form.deuxieme_lutin" type="checkbox" @change="haptic(8)" />
          <i aria-hidden="true" />
          <span>Un deuxième lutin rejoint l'aventure</span>
        </label>
        <label v-if="form.deuxieme_lutin" class="pz-field pz-field--in">
          <span>Le nom du second lutin</span>
          <input v-model="form.nom_second_lutin" type="text" placeholder="ex : Gribouille" />
        </label>
        <p v-else class="pz-note">Un seul lutin voyagera — le second chapitre des farces sera adapté.</p>
      </template>

      <!-- 3 · le trajet -->
      <template v-else-if="current.id === 'voyage'">
        <label class="pz-field">
          <span>La ville d'arrivée</span>
          <input v-model="form.ville" type="text" placeholder="ex : Lyon" />
        </label>
        <label class="pz-field">
          <span>La destination du voyage</span>
          <input v-model="form.destination" type="text" placeholder="ex : la maison familiale" />
        </label>
        <label class="pz-field">
          <span>Le quartier</span>
          <input v-model="form.quartier" type="text" placeholder="ex : Croix-Rousse" />
        </label>
      </template>

      <!-- 4 · le calendrier -->
      <template v-else-if="current.id === 'calendrier'">
        <div class="pz-duo">
          <label class="pz-field">
            <span>Départ</span>
            <input v-model="form.date_debut" type="date" />
          </label>
          <label class="pz-field">
            <span>Retour</span>
            <input v-model="form.date_fin" type="date" />
          </label>
        </div>
        <p v-if="joursDisponibles" class="pz-computed">
          <i class="mdi mdi-calendar-star" aria-hidden="true" /> {{ joursDisponibles }} jours d'aventure
        </p>
        <label class="pz-field">
          <span>Jours sans activité</span>
          <input v-model="form.jours_sans_activite" type="text" placeholder="ex : 14 nov., 3 déc." />
        </label>
        <label class="pz-field">
          <span>Lieux de séjour ou déplacement</span>
          <textarea v-model="form.lieux_sejour" rows="2" placeholder="ex : 3 jours chez Papi et Mamie à la mi-parcours" />
        </label>
        <label class="pz-field">
          <span>Activités remplacées ou déplacées</span>
          <textarea v-model="form.activites_modifiees" rows="2" placeholder="ex : la chasse au trésor du J40 déplacée au lendemain" />
        </label>
      </template>

      <!-- 5 · les pièces jointes -->
      <template v-else-if="current.id === 'pieces'">
        <article class="pz-piece">
          <header><b>J23</b><span>Le plan du quartier</span></header>
          <p>Le quartier renseigné au trajet sera dessiné sur la carte, la flèche tracée jusqu'à la maison.</p>
          <label class="pz-field">
            <span>Confirmer le quartier</span>
            <input v-model="form.quartier" type="text" placeholder="ex : Croix-Rousse" />
          </label>
        </article>
        <article class="pz-piece">
          <header><b>J25</b><span>L'entrée de la maison</span></header>
          <p>La porte, le portail ou le paillasson — le repère que le lutin reconnaîtra.</p>
          <label class="pz-photo" :class="{ filled: form.photo_entree }">
            <input type="file" accept="image/*" @change="pickPhoto('photo_entree', $event)" />
            <img v-if="form.photo_entree" :src="form.photo_entree" alt="Aperçu de l'entrée" />
            <span v-else><i class="mdi mdi-camera-outline" aria-hidden="true" /> Joindre une photo</span>
          </label>
        </article>
        <article class="pz-piece">
          <header><b>J59 · J61</b><span>Le portrait des lutins</span></header>
          <p>La photo des lutins ou le portrait fourni dans le kit.</p>
          <label class="pz-photo" :class="{ filled: form.photo_lutins }">
            <input type="file" accept="image/*" @change="pickPhoto('photo_lutins', $event)" />
            <img v-if="form.photo_lutins" :src="form.photo_lutins" alt="Aperçu des lutins" />
            <span v-else><i class="mdi mdi-camera-outline" aria-hidden="true" /> Joindre une photo</span>
          </label>
        </article>
      </template>

      <!-- 6 · le récapitulatif -->
      <template v-else>
        <article class="pz-piece pz-family">
          <header><b><i class="mdi mdi-account-group-outline" aria-hidden="true" /></b><span>L'expédition à deux</span></header>
          <template v-if="!familyCode">
            <p>Deux appareils, une seule aventure — chaque réglage et chaque coche se synchronise en direct.</p>
            <div class="pz-family-actions">
              <button type="button" class="pz-family-btn" :disabled="busy || !syncAvailable" @click="onCreateFamily">
                Créer un code famille
              </button>
              <span class="pz-join">
                <input v-model="joinInput" type="text" placeholder="LUTIN-XXXX" maxlength="9" autocapitalize="characters" />
                <button type="button" class="pz-family-btn" :disabled="busy || !joinInput.trim()" @click="onJoin">Rejoindre</button>
              </span>
            </div>
            <p v-if="joinError" class="pz-error">Ce code n'existe pas — vérifiez les 4 lettres.</p>
            <p v-if="!syncAvailable" class="pz-note">La synchronisation n'est pas encore configurée — tout reste sur cet appareil.</p>
          </template>
          <template v-else>
            <p class="pz-code">{{ familyCode }}</p>
            <div class="pz-family-actions">
              <button type="button" class="pz-family-btn" @click="shareCode">
                <i class="mdi mdi-share-variant-outline" aria-hidden="true" /> {{ copied ? 'Copié !' : 'Partager' }}
              </button>
              <button type="button" class="pz-family-btn pz-family-btn--ghost" @click="onLeave">Quitter</button>
            </div>
            <p class="pz-sync"><i :class="syncStatus" aria-hidden="true" />{{ syncLabel }}</p>
          </template>
        </article>

        <ul v-if="recap.length" class="pz-recap">
          <li v-for="row in recap" :key="row.label">
            <span>{{ row.label }}</span>
            <b>{{ row.value }}</b>
          </li>
        </ul>
        <p v-else class="pz-note">La dépêche est encore vierge — remontez pour la remplir.</p>
        <p class="pz-private">
          <i class="mdi mdi-lock-outline" aria-hidden="true" />
          Ces informations ne quittent jamais votre appareil.
        </p>
      </template>
      </template>
    </section>
    </Transition>

    <footer class="pz-footer">
      <button v-if="!isLast && !isGate" type="button" class="pz-cta" @click="next">
        Continuer <i class="mdi mdi-arrow-right" aria-hidden="true" />
      </button>
      <RouterLink v-else to="/home" class="pz-cta pz-cta--seal" @click="haptic([12, 40, 8])">
        Sceller la dépêche <i class="mdi mdi-seal" aria-hidden="true" />
      </RouterLink>
    </footer>
  </main>
</template>

<style scoped>
.pz-header {
  padding-top:6px;
  text-align:center
}

.pz-back {
  display:flex;
  align-items:center;
  gap:4px;
  margin-bottom:14px;
  padding:0;
  border:0;
  background:none;
  color:var(--color-gold);
  font-family:inherit;
  font-size:12px;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent
}

.pz-overline {
  margin:0 0 6px;
  color:var(--color-gold);
  font:800 10px/1 var(--font-ui);
  letter-spacing:.22em
}

.pz-header h1 {
  margin:0;
  font:400 clamp(30px,8.5vw,38px)/1.05 var(--font-literary);
  letter-spacing:-.01em
}

/* le cachet-plume qui préside le formulaire */
.pz-emblem {
  position:relative;
  display:grid;
  place-items:center;
  width:58px;
  height:58px;
  margin:0 auto 14px;
  border:1px solid rgba(230,194,128,.5);
  border-radius:50%;
  background:radial-gradient(circle at 32% 28%,#2a4a3a,#0d1f18 72%);
  box-shadow:0 0 0 4px rgba(230,194,128,.06),0 8px 22px rgba(0,0,0,.4),inset 0 0 14px rgba(230,194,128,.12);
  animation:emblem-in 1s var(--spring) both .1s
}

.pz-emblem::after {
  content:'';
  position:absolute;
  inset:-5px;
  border-radius:50%;
  border:1px dashed rgba(230,194,128,.28);
  animation:emblem-spin 24s linear infinite
}

.pz-emblem > i {
  color:#e6c280;
  font-size:24px;
  text-shadow:0 0 12px rgba(230,194,128,.55);
  animation:emblem-sway 4.5s ease-in-out infinite
}

.pz-emblem b {
  position:absolute;
  width:4px;
  height:4px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 8px #e6c280;
  animation:spark-twinkle 2.8s ease-in-out infinite
}

.pz-emblem b:nth-of-type(1) {
  top:4px;
  right:6px
}

.pz-emblem b:nth-of-type(2) {
  bottom:6px;
  left:2px;
  animation-delay:1.4s;
  width:3px;
  height:3px
}

@keyframes emblem-in {
  from {
    opacity:0;
    transform:scale(.4) rotate(-30deg)
  }
  to {
    opacity:1;
    transform:none
  }
}

@keyframes emblem-spin {
  to {
    transform:rotate(360deg)
  }
}

@keyframes emblem-sway {
  0%,100% {
    transform:rotate(-6deg)
  }
  50% {
    transform:rotate(8deg) translateY(-1px)
  }
}

@keyframes spark-twinkle {
  0%,100% {
    opacity:.15;
    transform:scale(.6)
  }
  50% {
    opacity:1;
    transform:scale(1.2)
  }
}

/* la piste de cire relie les six étapes */
.pz-track {
  display:flex;
  gap:6px;
  justify-content:center;
  margin:18px 0 20px;
  padding:0;
  list-style:none
}

.pz-track i {
  display:block;
  width:22px;
  height:4px;
  border-radius:4px;
  background:rgba(255,255,255,.14);
  transition:background .4s,width .4s var(--spring)
}

.pz-track .done i {
  background:#e6c280
}

.pz-track .now i {
  width:34px;
  background:linear-gradient(90deg,#e6c280,#ffe9a8);
  box-shadow:0 0 10px rgba(230,194,128,.6);
  animation:track-glow 2.6s ease-in-out infinite
}

@keyframes track-glow {
  50% {
    box-shadow:0 0 18px rgba(230,194,128,.95)
  }
}

/* la feuille du formulaire */
.pz-sheet {
  position:relative;
  padding:20px 18px 22px;
  border:1px solid rgba(241,204,122,.16);
  border-radius:20px;
  background:linear-gradient(165deg,#162b22,#0d1f18 70%);
  box-shadow:0 18px 38px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,244,214,.05);
  overflow:hidden
}

/* deux étincelles vagabondent en coin de feuille */
.pz-spark {
  position:absolute;
  width:5px;
  height:5px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 10px 2px rgba(230,194,128,.55);
  pointer-events:none;
  animation:spark-drift 5s ease-in-out infinite
}

.pz-spark.s1 {
  top:16px;
  right:22px
}

.pz-spark.s2 {
  top:34px;
  right:38px;
  width:3px;
  height:3px;
  animation-delay:2.4s;
  animation-duration:6.5s
}

@keyframes spark-drift {
  0%,100% {
    opacity:.1;
    transform:translate(0,0) scale(.5)
  }
  50% {
    opacity:.9;
    transform:translate(-6px,7px) scale(1)
  }
}

/* le feuilletage : chaque feuille entre par le côté et pivote comme un papier qu'on tourne */
.sheet-next-enter-active,
.sheet-prev-enter-active {
  transition:opacity .55s var(--spring),transform .55s var(--spring)
}

.sheet-next-leave-active,
.sheet-prev-leave-active {
  transition:opacity .3s ease,transform .3s ease
}

.sheet-next-enter-from {
  opacity:0;
  transform:translateX(54px) rotate(1.6deg) scale(.97)
}

.sheet-next-leave-to {
  opacity:0;
  transform:translateX(-40px) rotate(-1.2deg)
}

.sheet-prev-enter-from {
  opacity:0;
  transform:translateX(-54px) rotate(-1.6deg) scale(.97)
}

.sheet-prev-leave-to {
  opacity:0;
  transform:translateX(40px) rotate(1.2deg)
}

/* les champs se posent en cascade, comme l'encre qui sèche ligne à ligne */
.pz-sheet > .pz-field,
.pz-sheet > .pz-row,
.pz-sheet > .pz-duo,
.pz-sheet > .pz-note,
.pz-sheet > .pz-computed,
.pz-sheet > .pz-piece,
.pz-sheet > .pz-switch,
.pz-sheet > .pz-recap,
.pz-sheet > .pz-private,
.pz-sheet > .pz-gate-opt,
.pz-sheet > .pz-gate-join,
.pz-sheet > .pz-gate-link,
.pz-sheet > .pz-step-over,
.pz-sheet > .pz-step-title,
.pz-sheet > .pz-family-actions {
  animation:field-in .5s var(--spring) both
}

.pz-sheet > *:nth-child(3) { animation-delay:.06s }
.pz-sheet > *:nth-child(4) { animation-delay:.12s }
.pz-sheet > *:nth-child(5) { animation-delay:.18s }
.pz-sheet > *:nth-child(6) { animation-delay:.24s }
.pz-sheet > *:nth-child(7) { animation-delay:.3s }
.pz-sheet > *:nth-child(8) { animation-delay:.36s }
.pz-sheet > *:nth-child(n+9) { animation-delay:.42s }

.pz-step-over {
  margin:0 0 4px;
  color:#8fa79a;
  font:700 10px/1 var(--font-ui);
  letter-spacing:.18em;
  text-transform:uppercase
}

.pz-step-title {
  margin:0 0 18px;
  font:italic 500 22px/1.15 var(--font-literary)
}

/* champs à l'encre : liseré pointillé qui s'illumine au focus */
.pz-field {
  display:grid;
  gap:7px;
  margin-bottom:16px
}

.pz-field:last-child {
  margin-bottom:0
}

.pz-field > span {
  color:#9db4a8;
  font:600 11.5px/1.3 var(--font-ui);
  letter-spacing:.04em
}

.pz-field input,
.pz-field textarea {
  width:100%;
  padding:9px 2px;
  border:0;
  border-bottom:1.5px dashed rgba(241,204,122,.3);
  border-radius:0;
  background:transparent;
  color:#f4ead4;
  caret-color:#e6c280;
  font:italic 500 17px/1.35 var(--font-literary);
  transition:border-color .3s;
  -webkit-appearance:none;
  appearance:none
}

.pz-field input:focus,
.pz-field textarea:focus {
  outline:none;
  border-bottom-color:#e6c280;
  border-bottom-style:solid
}

/* l'encre prend : le libellé s'or et le liseré devient plein une fois rempli */
.pz-field:focus-within > span {
  color:#e6c280;
  transition:color .3s
}

.pz-field input[type='text']:not(:placeholder-shown),
.pz-field textarea:not(:placeholder-shown) {
  border-bottom-style:solid;
  border-bottom-color:rgba(230,194,128,.55)
}

.pz-field input::placeholder,
.pz-field textarea::placeholder {
  color:rgba(159,180,168,.4)
}

.pz-field input[type='date'] {
  font-family:var(--font-ui);
  font-style:normal;
  font-size:15px;
  color-scheme:dark
}

.pz-field textarea {
  resize:none
}

.pz-field--in {
  animation:field-in .4s var(--spring) both
}

@keyframes field-in {
  from {
    opacity:0;
    transform:translateY(-8px)
  }
  to {
    opacity:1;
    transform:none
  }
}

.pz-duo {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px
}

/* la porte d'entrée : rejoindre ou créer */
.pz-gate {
  display:grid;
  gap:12px
}

.pz-gate .pz-step-title {
  margin-bottom:6px
}

.pz-gate-opt {
  display:flex;
  align-items:center;
  gap:13px;
  padding:15px 16px;
  border:1px solid rgba(241,204,122,.22);
  border-radius:16px;
  background:rgba(255,255,255,.03);
  color:#f4ead4;
  text-align:left;
  cursor:pointer;
  transition:transform .2s var(--spring),border-color .3s,background .3s;
  -webkit-tap-highlight-color:transparent
}

.pz-gate-opt:active {
  transform:scale(.98)
}

.pz-gate-opt.open {
  border-color:rgba(230,194,128,.5);
  background:rgba(230,194,128,.07)
}

.pz-gate-opt > i:first-child {
  color:#e6c280;
  font-size:22px
}

.pz-gate-opt > span {
  flex:1;
  display:grid;
  gap:2px
}

.pz-gate-opt b {
  font:600 15px var(--font-ui)
}

.pz-gate-opt small {
  color:#8fa79a;
  font:italic 500 12.5px var(--font-literary)
}

.pz-gate-opt > i:last-child {
  color:#8fa79a;
  transition:transform .3s var(--spring)
}

.pz-gate-opt.open .pz-gate-caret {
  transform:rotate(180deg)
}

.pz-gate-join {
  padding:2px 4px 8px;
  animation:field-in .4s var(--spring) both
}

.pz-gate-linked {
  cursor:default;
  border-color:rgba(230,194,128,.45);
  background:rgba(230,194,128,.08)
}

.pz-gate-linked b {
  font-family:var(--font-ui);
  letter-spacing:.08em
}

.pz-gate-link {
  justify-self:center;
  margin-top:4px;
  padding:6px 12px;
  border:none;
  background:none;
  color:#8fa79a;
  font:italic 500 13px var(--font-literary);
  text-decoration:underline dotted;
  cursor:pointer
}

/* lignes de destinataires : un champ par enfant */
.pz-row {
  display:flex;
  align-items:center;
  gap:8px;
  animation:row-in .35s var(--spring) both
}

@keyframes row-in {
  from {
    opacity:0;
    transform:translateY(-6px)
  }
  to {
    opacity:1;
    transform:none
  }
}

.pz-row input {
  flex:1
}

.pz-row-del {
  display:grid;
  place-items:center;
  flex:none;
  width:26px;
  height:26px;
  padding:0;
  border:0;
  border-radius:50%;
  background:rgba(232,138,110,.14);
  color:#e8a08a;
  font-size:13px;
  cursor:pointer;
  transition:transform .2s var(--spring);
  -webkit-tap-highlight-color:transparent
}

.pz-row-del:active {
  transform:scale(.85)
}

.pz-add-row {
  display:inline-flex;
  align-items:center;
  gap:6px;
  justify-self:start;
  margin-top:2px;
  padding:8px 14px;
  border:1px dashed rgba(230,194,128,.4);
  border-radius:999px;
  background:transparent;
  color:#e6c280;
  font:700 11.5px var(--font-ui);
  cursor:pointer;
  transition:transform .2s var(--spring);
  -webkit-tap-highlight-color:transparent
}

.pz-add-row:active {
  transform:scale(.95)
}

/* l'interrupteur du second lutin */
.pz-switch {
  display:flex;
  align-items:center;
  gap:12px;
  margin:4px 0 16px;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent
}

.pz-switch input {
  position:absolute;
  opacity:0
}

.pz-switch i {
  position:relative;
  flex:none;
  width:44px;
  height:25px;
  border:1px solid rgba(230,194,128,.4);
  border-radius:999px;
  background:rgba(255,255,255,.05);
  transition:background .3s
}

.pz-switch i::after {
  content:'';
  position:absolute;
  top:3px;
  left:3px;
  width:17px;
  height:17px;
  border-radius:50%;
  background:#8fa79a;
  transition:transform .35s var(--spring),background .3s
}

.pz-switch input:checked + i {
  background:rgba(230,194,128,.22)
}

.pz-switch input:checked + i::after {
  transform:translateX(19px);
  background:linear-gradient(135deg,#ffe9a8,#e6c280);
  box-shadow:0 0 10px rgba(230,194,128,.7)
}

.pz-switch > span {
  font:italic 500 15px/1.35 var(--font-literary);
  color:#d8e4dc
}

.pz-note {
  margin:0;
  color:#8fa79a;
  font:italic 500 13.5px/1.5 var(--font-literary)
}

.pz-computed {
  display:flex;
  align-items:center;
  gap:8px;
  margin:-4px 0 16px;
  color:#ffe9a8;
  font:700 12.5px var(--font-ui)
}

/* les pièces jointes */
.pz-piece {
  margin-bottom:14px;
  padding:14px;
  border:1px dashed rgba(241,204,122,.28);
  border-radius:14px;
  background:rgba(255,255,255,.03)
}

.pz-piece:last-child {
  margin-bottom:0
}

.pz-piece header {
  display:flex;
  align-items:center;
  gap:9px;
  margin-bottom:5px
}

.pz-piece header b {
  padding:2px 8px;
  border:1px solid rgba(230,194,128,.5);
  border-radius:999px;
  color:#e6c280;
  font:800 9px/1.4 var(--font-ui);
  letter-spacing:.1em
}

.pz-piece header span {
  font:italic 500 15px var(--font-literary)
}

.pz-piece p {
  margin:0 0 11px;
  color:#8fa79a;
  font:500 12px/1.45 var(--font-ui)
}

.pz-piece .pz-field {
  margin-bottom:0
}

.pz-photo {
  display:grid;
  place-items:center;
  min-height:86px;
  border:1.5px dashed rgba(241,204,122,.4);
  border-radius:12px;
  color:#e6c280;
  font:700 12px var(--font-ui);
  cursor:pointer;
  overflow:hidden;
  transition:border-color .3s
}

.pz-photo input {
  position:absolute;
  width:1px;
  height:1px;
  opacity:0
}

.pz-photo span {
  display:inline-flex;
  align-items:center;
  gap:7px
}

.pz-photo img {
  width:100%;
  height:120px;
  object-fit:cover
}

.pz-photo.filled {
  border-style:solid
}

/* la carte famille */
.pz-family {
  margin-bottom:18px;
  border-color:rgba(230,194,128,.4);
  background:rgba(230,194,128,.05)
}

.pz-family-actions {
  display:grid;
  gap:10px
}

.pz-family-btn {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  padding:10px 16px;
  border:1px solid rgba(230,194,128,.5);
  border-radius:999px;
  background:rgba(230,194,128,.12);
  color:#ffe9a8;
  font:700 12px var(--font-ui);
  cursor:pointer;
  transition:transform .2s var(--spring),opacity .2s;
  -webkit-tap-highlight-color:transparent
}

.pz-family-btn:active {
  transform:scale(.96)
}

.pz-family-btn:disabled {
  opacity:.35
}

.pz-family-btn--ghost {
  background:transparent;
  color:#9db4a8;
  border-color:rgba(255,255,255,.18)
}

.pz-join {
  display:flex;
  gap:8px;
  align-items:center
}

.pz-join input {
  flex:1;
  min-width:0;
  padding:10px 12px;
  border:1px dashed rgba(241,204,122,.35);
  border-radius:12px;
  background:transparent;
  color:#f4ead4;
  font:700 14px var(--font-ui);
  letter-spacing:.14em;
  text-transform:uppercase
}

.pz-join input::placeholder {
  color:rgba(159,180,168,.4);
  letter-spacing:.14em
}

.pz-code {
  margin:0 0 12px;
  color:#ffe9a8;
  font:800 22px/1 var(--font-ui);
  letter-spacing:.18em;
  text-align:center;
  text-shadow:0 0 14px rgba(230,194,128,.5)
}

.pz-sync {
  display:flex;
  align-items:center;
  gap:7px;
  margin:12px 0 0;
  color:#8fa79a;
  font:600 11px var(--font-ui);
  letter-spacing:.04em
}

.pz-sync i {
  width:7px;
  height:7px;
  border-radius:50%;
  background:#8fa79a
}

.pz-sync i.synced {
  background:#7fd99a;
  box-shadow:0 0 8px rgba(127,217,154,.8);
  animation:sync-breathe 2.4s ease-in-out infinite
}

.pz-sync i.connecting {
  background:#e6c280
}

.pz-sync i.error {
  background:#e88
}

@keyframes sync-breathe {
  0%,100% {
    opacity:1
  }
  50% {
    opacity:.45
  }
}

.pz-error {
  margin:8px 0 0;
  color:#e8a08a;
  font:600 11.5px var(--font-ui)
}

/* le récapitulatif */
.pz-recap {
  margin:0;
  padding:0;
  list-style:none
}

.pz-recap li {
  display:grid;
  gap:2px;
  padding:9px 0;
  border-bottom:1px dashed rgba(241,204,122,.18)
}

.pz-recap li:last-child {
  border-bottom:0
}

.pz-recap span {
  color:#8fa79a;
  font:700 9.5px/1 var(--font-ui);
  letter-spacing:.14em;
  text-transform:uppercase
}

.pz-recap b {
  color:#f4ead4;
  font:italic 500 16px/1.35 var(--font-literary)
}

.pz-private {
  display:flex;
  align-items:center;
  gap:8px;
  margin:16px 0 0;
  padding:10px 12px;
  border-radius:12px;
  background:rgba(230,194,128,.07);
  color:#b8ccbe;
  font:500 12px/1.4 var(--font-ui)
}

.pz-private i {
  color:#e6c280
}

/* le pied : bouton-cire */
.pz-footer {
  display:flex;
  justify-content:center;
  margin-top:22px
}

.pz-cta {
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:13px 24px;
  border:0;
  border-radius:999px;
  background:linear-gradient(135deg,#e6c280,#d4af37);
  color:#0a1c14;
  font:800 13.5px var(--font-ui);
  letter-spacing:.02em;
  text-decoration:none;
  cursor:pointer;
  box-shadow:0 5px 16px rgba(230,194,128,.35);
  transition:transform .15s cubic-bezier(.34,1.56,.64,1);
  -webkit-tap-highlight-color:transparent
}

.pz-cta:active {
  transform:scale(.95)
}

/* le sceau final : un reflet de cire qui passe */
.pz-cta--seal {
  position:relative;
  overflow:hidden
}

.pz-cta--seal::after {
  content:'';
  position:absolute;
  top:-30%;
  bottom:-30%;
  left:-40%;
  width:34%;
  background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);
  transform:skewX(-18deg);
  animation:seal-sheen 3.4s ease-in-out infinite
}

@keyframes seal-sheen {
  0%,55% {
    left:-45%
  }
  85%,100% {
    left:115%
  }
}

@media (prefers-reduced-motion:reduce) {
  .pz-sheet > *,
  .pz-emblem,
  .pz-emblem::after,
  .pz-emblem > i,
  .pz-emblem b,
  .pz-spark,
  .pz-track .now i,
  .pz-cta--seal::after,
  .pz-field--in {
    animation:none
  }

  .sheet-next-enter-active,
  .sheet-next-leave-active,
  .sheet-prev-enter-active,
  .sheet-prev-leave-active {
    transition:opacity .15s ease
  }
}
</style>

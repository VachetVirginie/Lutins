<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { haptic } from '../utils/haptics'

const router = useRouter()

/**
 * Le formulaire de l'expédition : tout reste en mémoire vive,
 * aucune donnée n'est persistée ni envoyée.
 */
const form = reactive({
  prenoms_enfants: [] as string[],
  nom_proche: '',
  nom_lutin: '',
  deuxieme_lutin: false,
  nom_second_lutin: '',
  ville: '',
  destination: '',
  quartier: '',
  date_debut: '',
  date_fin: '',
  jours_sans_activite: '',
  lieux_sejour: '',
  activites_modifiees: '',
  photo_entree: '',
  photo_lutins: '',
})

/* ---- étapes ---- */
const STEPS = [
  { id: 'famille', overline: 'Étape 1 / 6', title: 'Les destinataires' },
  { id: 'lutins', overline: 'Étape 2 / 6', title: 'Les voyageurs' },
  { id: 'voyage', overline: 'Étape 3 / 6', title: 'Le trajet' },
  { id: 'calendrier', overline: 'Étape 4 / 6', title: 'Le calendrier' },
  { id: 'pieces', overline: 'Étape 5 / 6', title: 'Les pièces jointes' },
  { id: 'recap', overline: 'Dernière étape', title: 'La dépêche est prête' },
] as const

const step = ref(0)
const current = computed(() => STEPS[step.value])
const isLast = computed(() => step.value === STEPS.length - 1)

function next() {
  if (isLast.value) return
  haptic(8)
  step.value++
}
function prev() {
  haptic(6)
  if (step.value === 0) router.push('/home')
  else step.value--
}

/* ---- prénoms : une liste de destinataires ---- */
const draftName = ref('')

function addChild() {
  const names = draftName.value.split(',').map((n) => n.trim()).filter(Boolean)
  for (const n of names) if (!form.prenoms_enfants.includes(n)) form.prenoms_enfants.push(n)
  draftName.value = ''
  if (names.length) haptic(10)
}

function removeChild(name: string) {
  form.prenoms_enfants = form.prenoms_enfants.filter((n) => n !== name)
  haptic(6)
}

/* ---- durée calculée entre les deux dates ---- */
const joursDisponibles = computed(() => {
  if (!form.date_debut || !form.date_fin) return null
  const d = Math.round((new Date(form.date_fin).getTime() - new Date(form.date_debut).getTime()) / 86_400_000) + 1
  return d > 0 ? d : null
})

/* ---- photos : aperçu local, rien n'est téléversé ---- */
function pickPhoto(field: 'photo_entree' | 'photo_lutins', event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (form[field]) URL.revokeObjectURL(form[field])
  form[field] = URL.createObjectURL(file)
  haptic(10)
}

const recap = computed(() => {
  const rows: { label: string; value: string }[] = []
  if (form.prenoms_enfants.length) rows.push({ label: 'Destinataires', value: form.prenoms_enfants.join(', ') })
  if (form.nom_proche) rows.push({ label: 'Proches', value: form.nom_proche })
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
        <i class="mdi mdi-chevron-left" aria-hidden="true" /> {{ step === 0 ? 'Retour' : 'Précédent' }}
      </button>
      <p class="pz-overline">LE FORMULAIRE DE L'EXPÉDITION</p>
      <h1>Votre aventure,<br />à vos couleurs</h1>
    </header>

    <!-- le ruban de progression : une piste de cire -->
    <ol class="pz-track" aria-hidden="true">
      <li v-for="(s, i) in STEPS" :key="s.id" :class="{ done: i < step, now: i === step }"><i /></li>
    </ol>

    <section :key="step" class="pz-sheet" aria-live="polite">
      <p class="pz-step-over">{{ current.overline }}</p>
      <h2 class="pz-step-title">{{ current.title }}</h2>

      <!-- 1 · la famille -->
      <template v-if="current.id === 'famille'">
        <label class="pz-field">
          <span>Prénom(s) des enfants</span>
          <span class="pz-add">
            <input
              v-model="draftName"
              type="text"
              placeholder="ex : Louis, Emma"
              enterkeyhint="done"
              @keydown.enter.prevent="addChild"
            />
            <button type="button" class="pz-add-btn" :disabled="!draftName.trim()" @click="addChild">
              <i class="mdi mdi-plus" aria-hidden="true" /> Ajouter
            </button>
          </span>
        </label>
        <ul v-if="form.prenoms_enfants.length" class="pz-chips">
          <li v-for="name in form.prenoms_enfants" :key="name">
            {{ name }}
            <button type="button" aria-label="Retirer" @click="removeChild(name)"><i class="mdi mdi-close" /></button>
          </li>
        </ul>
        <label class="pz-field">
          <span>Un proche qui apparaît dans l'histoire</span>
          <input v-model="form.nom_proche" type="text" placeholder="ex : Papi et Mamie" />
        </label>
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
    </section>

    <footer class="pz-footer">
      <button v-if="!isLast" type="button" class="pz-cta" @click="next">
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
  display:inline-flex;
  align-items:center;
  gap:2px;
  margin:0 auto 14px;
  padding:6px 12px;
  border:0;
  border-radius:999px;
  background:rgba(255,255,255,.05);
  color:#9db4a8;
  font:600 12px var(--font-ui);
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
  box-shadow:0 0 10px rgba(230,194,128,.6)
}

/* la feuille du formulaire */
.pz-sheet {
  padding:20px 18px 22px;
  border:1px solid rgba(241,204,122,.16);
  border-radius:20px;
  background:linear-gradient(165deg,#162b22,#0d1f18 70%);
  box-shadow:0 18px 38px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,244,214,.05);
  animation:sheet-in .6s var(--spring) both
}

@keyframes sheet-in {
  from {
    opacity:0;
    transform:translateY(20px) rotate(.6deg)
  }
  to {
    opacity:1;
    transform:none
  }
}

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

/* l'ajout de destinataire */
.pz-add {
  display:flex;
  gap:8px;
  align-items:flex-end
}

.pz-add input {
  flex:1
}

.pz-add-btn {
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:8px 13px;
  border:1px solid rgba(230,194,128,.4);
  border-radius:999px;
  background:transparent;
  color:#e6c280;
  font:700 11.5px var(--font-ui);
  cursor:pointer;
  transition:transform .2s var(--spring),opacity .2s;
  -webkit-tap-highlight-color:transparent
}

.pz-add-btn:active {
  transform:scale(.94)
}

.pz-add-btn:disabled {
  opacity:.35
}

.pz-chips {
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin:-6px 0 16px;
  padding:0;
  list-style:none
}

.pz-chips li {
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:6px 8px 6px 13px;
  border:1px solid rgba(230,194,128,.45);
  border-radius:999px;
  background:rgba(230,194,128,.08);
  color:#ffe9a8;
  font:italic 500 14px var(--font-literary);
  animation:chip-in .35s var(--spring) both
}

@keyframes chip-in {
  from {
    opacity:0;
    transform:scale(.8)
  }
  to {
    opacity:1;
    transform:none
  }
}

.pz-chips button {
  display:grid;
  place-items:center;
  width:18px;
  height:18px;
  padding:0;
  border:0;
  border-radius:50%;
  background:rgba(230,194,128,.2);
  color:#e6c280;
  font-size:11px;
  cursor:pointer
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

@media (prefers-reduced-motion:reduce) {
  .pz-sheet,
  .pz-chips li,
  .pz-field--in {
    animation:none
  }
}
</style>

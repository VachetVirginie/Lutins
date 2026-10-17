<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentAdventure } from '../data/adventure'
import { contentGapByDay } from '../data/contentGaps'
import { dailySheetsByActivityId } from '../data/dailySheets'
import { haptic } from '../utils/haptics'

const route = useRoute()
const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/home')
}
const activityId = computed(() => String(route.params.activityId))
const dayNumber = computed(() => Number(activityId.value.match(/jour-(\d+)/)?.[1] ?? 0))
const sheet = computed(() => dailySheetsByActivityId[activityId.value] ?? dailySheetsByActivityId[`jour-${dayNumber.value}`])
const gap = computed(() => contentGapByDay[dayNumber.value])
const preparationDone = ref(false)
const copied = ref(false)

const chapter = currentAdventure.chapter
const totalDays = currentAdventure.totalDays

// La dépêche arrive scellée : un geste sur la cire l'ouvre — écho du sceau d'ouverture
const opened = ref(false)
const cracking = ref(false)

watch(sheet, () => {
  preparationDone.value = false
  opened.value = false
  cracking.value = false
}, { immediate: true })

function unseal() {
  if (cracking.value || opened.value) return
  cracking.value = true
  haptic([12, 40, 8])
  window.setTimeout(() => {
    opened.value = true
    haptic(10)
  }, 500)
}

// Feuilleter les dépêches : swipe horizontal = jour précédent / suivant
let touchX = 0
let touchY = 0

function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0].clientX
  touchY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchX
  const dy = e.changedTouches[0].clientY - touchY
  if (Math.abs(dx) < 70 || Math.abs(dy) > 50) return
  const target = dx < 0 ? dayNumber.value + 1 : dayNumber.value - 1
  if (target < 1 || target > totalDays) return
  haptic(6)
  router.push(`/activites/jour-${target}`)
}

// Parallaxe gyroscopique : la lettre bouge de 2-3px, le sceau davantage (premier plan)
const letterTilt = ref({ x: 0, y: 0 })

function onTilt(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return
  letterTilt.value = {
    x: Math.max(-1, Math.min(1, e.gamma / 28)) * 3,
    y: Math.max(-1, Math.min(1, (e.beta - 45) / 28)) * 2.5,
  }
}

// iOS : requestPermission() exige un geste utilisateur → demandé au 1er toucher
async function requestOrientation() {
  const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
  if (typeof DOE.requestPermission === 'function') {
    try {
      if (await DOE.requestPermission() === 'granted') window.addEventListener('deviceorientation', onTilt)
    } catch { /* refusé : pas de tilt */ }
  }
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const DOE = DeviceOrientationEvent as unknown as { requestPermission?: unknown }
  if (typeof DOE.requestPermission === 'function') {
    window.addEventListener('pointerdown', requestOrientation, { once: true })
  } else {
    window.addEventListener('deviceorientation', onTilt)
  }
})
onBeforeUnmount(() => window.removeEventListener('deviceorientation', onTilt))

function togglePreparation() {
  preparationDone.value = !preparationDone.value
  haptic(12)
}

async function copyMessage() {
  if (!sheet.value) return
  await navigator.clipboard?.writeText(sheet.value.message)
  haptic(8)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}

// Distinction d'usage : découper le mot, imprimer le support, écrire à la main
function assetKind(label: string): string {
  if (/coloriage/i.test(label)) return 'À imprimer puis colorier'
  if (/carte|pancarte|image|illustration/i.test(label)) return 'À imprimer puis découper'
  return 'À imprimer'
}

/** Imprime la fiche complète (lettre + annexes) via la vue d'impression */
function printSheet() {
  haptic(8)
  window.print()
}

/** Imprime une seule annexe dans une fenêtre dédiée */
function printAsset(file: string) {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!doctype html><html><head><title>Annexe</title></head><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#fff"><img src="${file}" style="max-width:100%;max-height:100vh;object-fit:contain" onload="setTimeout(()=>window.print(),150)" /></body></html>`)
  w.document.close()
}
</script>

<template>
  <main class="app-screen activity-screen" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <i class="warm-glow" aria-hidden="true" />
    <i class="warm-spark warm-spark--a" aria-hidden="true" />
    <i class="warm-spark warm-spark--b" aria-hidden="true" />

    <header class="activity-head">
      <button class="back-link" type="button" @click="goBack"><i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour</button>
      <template v-if="sheet">
        <div class="activity-hero">
          <p class="home-overline">CHAPITRE {{ chapter.roman }} · JOUR {{ sheet.day }} / {{ totalDays }}</p>
          <h1>{{ sheet.title }}</h1>
          <p class="activity-date">{{ sheet.date }}</p>
        </div>
      </template>
      <template v-else>
        <p class="home-overline">FICHE DU JOUR</p>
        <h1 class="activity-missing">Fiche introuvable</h1>
      </template>
    </header>

    <template v-if="sheet">
      <!-- La dépêche arrive scellée : la cire se brise, la lettre se déplie -->
      <section v-if="!opened" class="envelope" :class="{ 'is-cracking': cracking }" aria-label="Dépêche scellée">
        <i class="env-flap" aria-hidden="true" />
        <button
          class="env-seal"
          type="button"
          :disabled="cracking"
          :aria-label="`Briser le sceau pour lire la fiche du jour ${sheet.day}`"
          @click="unseal"
        ><b>J{{ sheet.day }}</b></button>
        <span class="env-burst" aria-hidden="true">
          <i v-for="n in 8" :key="n" :style="{ '--a': `${n * 45}deg`, '--dd': `${42 + n * 7}px` }" />
        </span>
        <p class="env-hint">Touchez la cire pour ouvrir la dépêche</p>
      </section>

      <!-- Le mot du lutin : parchemin chaud -->
      <section v-else class="letter" :style="{ '--tx': letterTilt.x + 'px', '--ty': letterTilt.y + 'px' }" aria-labelledby="message-title">
        <span class="wax-seal" aria-hidden="true"><b>J{{ sheet.day }}</b></span>
        <span class="postmark" aria-hidden="true"><b>POSTE DU<br />PÔLE NORD</b><small>{{ sheet.date }}</small></span>
        <div class="letter-label"><span id="message-title">LE MOT DU LUTIN</span></div>
        <blockquote>{{ sheet.message }}</blockquote>
        <div class="letter-foot">
          <span class="letter-sign">— depuis la route <em class="letter-usage">À découper et glisser</em></span>
          <button class="copy-button" type="button" :class="{ copied }" @click="copyMessage">
            <i class="mdi" :class="copied ? 'mdi-check' : 'mdi-content-copy'" aria-hidden="true" />
            {{ copied ? 'Copié !' : 'Copier le texte' }}
          </button>
        </div>
      </section>

      <section class="carnet" :class="{ done: preparationDone }" aria-labelledby="prep-title">
        <i class="carnet-pin" aria-hidden="true" />
        <i class="carnet-burst" aria-hidden="true" />
        <i class="carnet-stamp" aria-hidden="true"><b>PRÊT</b><small>POUR DEMAIN</small></i>
        <div class="section-label"><span id="prep-title">LE CARNET SECRET DES LUTINS</span></div>
        <p class="activity-copy">{{ sheet.adultPreparation }}</p>
        <button class="done-row" type="button" :class="{ done: preparationDone }" @click="togglePreparation">
          <span class="done-check"><i v-if="preparationDone" class="mdi mdi-check" aria-hidden="true" /></span>
          <span>{{ preparationDone ? 'Tout est prêt pour demain' : 'Marquer la préparation comme faite' }}</span>
        </button>
      </section>

      <section v-if="sheet.assets.length" class="annexes" aria-labelledby="assets-title">
        <div class="section-label"><span id="assets-title">LES ANNEXES — À DÉCOUPER</span><i class="mdi mdi-content-cut" aria-hidden="true" /></div>
        <div class="asset-grid">
          <div v-for="asset in sheet.assets" :key="asset.file" class="stamp">
            <a class="stamp-frame" :href="asset.file" target="_blank" rel="noreferrer"><img :src="asset.file" :alt="asset.label" loading="lazy"></a>
            <span>{{ asset.label }}</span>
            <small>Annexe · p. {{ asset.page }} — {{ assetKind(asset.label) }}</small>
            <div class="stamp-actions">
              <button type="button" @click="printAsset(asset.file)"><i class="mdi mdi-printer" aria-hidden="true" /> Imprimer</button>
              <a :href="asset.file" download><i class="mdi mdi-download" aria-hidden="true" /> Télécharger</a>
            </div>
          </div>
        </div>
        <button class="print-all" type="button" @click="printSheet"><i class="mdi mdi-printer-check" aria-hidden="true" /> Imprimer la fiche complète (lettre + annexes)</button>
      </section>

      <section v-if="sheet.gifts.length" class="slip" aria-labelledby="gift-title">
        <div class="section-label"><span id="gift-title">À GLISSER DANS LA SCÈNE</span></div>
        <ul class="slip-list">
          <li v-for="gift in sheet.gifts" :key="gift"><b class="slip-dot" aria-hidden="true">✳</b>{{ gift }}</li>
        </ul>
      </section>

      <aside v-if="gap" class="gap-note" aria-label="Élément à produire"><i class="mdi mdi-pencil-outline" aria-hidden="true" /><div><strong>Visuel de scène à créer</strong><p>{{ gap.detail }}</p></div></aside>
    </template>

    <!-- feuilleter les dépêches : jour précédent / suivant -->
    <nav v-if="sheet && dayNumber" class="day-pager" aria-label="Feuilleter les dépêches">
      <RouterLink v-if="dayNumber > 1" class="pager-link" :to="`/activites/jour-${dayNumber - 1}`">
        <i class="mdi mdi-chevron-left" aria-hidden="true" /> Dépêche J{{ dayNumber - 1 }}
      </RouterLink>
      <span v-else class="pager-ghost" />
      <RouterLink v-if="dayNumber < totalDays" class="pager-link pager-next" :to="`/activites/jour-${dayNumber + 1}`">
        Dépêche J{{ dayNumber + 1 }} <i class="mdi mdi-chevron-right" aria-hidden="true" />
      </RouterLink>
    </nav>

    <!-- vue imprimable : lettre + annexes regroupés -->
    <div v-if="sheet" class="print-sheet" aria-hidden="true">
      <h1>J{{ sheet.day }} · {{ sheet.title }}</h1>
      <p class="print-date">{{ sheet.date }}</p>
      <h2>Le mot du lutin <small>(à découper)</small></h2>
      <p class="print-message">{{ sheet.message }}</p>
      <template v-if="sheet.assets.length">
        <h2>Annexes <small>(à imprimer)</small></h2>
        <div class="print-assets"><figure v-for="asset in sheet.assets" :key="asset.file"><img :src="asset.file" :alt="asset.label"><figcaption>{{ asset.label }} — p. {{ asset.page }}</figcaption></figure></div>
      </template>
    </div>

  </main>
</template>

<style scoped>
.activity-screen {
  overflow:hidden
}

/* ---- chaleur ambiante ---- */
.warm-glow {
  position:absolute;
  top:-60px;
  left:-40px;
  width:280px;
  height:280px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(255,190,80,.16),transparent 65%);
  filter:blur(4px);
  pointer-events:none
}

.warm-spark {
  position:absolute;
  width:4px;
  height:4px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 8px #ffd97a;
  animation:sparkle 3s ease-in-out infinite;
  pointer-events:none
}

.warm-spark--a {
  top:90px;
  right:34px
}

.warm-spark--b {
  top:150px;
  right:70px;
  width:3px;
  height:3px;
  animation-delay:1.4s
}

@keyframes sparkle {
  0%,100% {
    opacity:.2;
    transform:scale(.7)
  }
  50% {
    opacity:1;
    transform:scale(1.15)
  }
}

/* ---- en-tête ---- */
.activity-head {
  margin-top:6px
}

.back-link {
  display:inline-flex;
  align-items:center;
  gap:5px;
  margin-bottom:26px;
  padding:0;
  border:0;
  background:none;
  color:rgba(255,255,255,.8);
  font-family:inherit;
  font-size:12px;
  cursor:pointer;
  text-decoration:none
}

.back-link:hover {
  color:#e6c280
}

.activity-hero {
  display:flex;
  flex-direction:column
}

.activity-hero .home-overline {
  font-size:11px;
  letter-spacing:.14em
}

.activity-hero h1 {
  margin:6px 0 0;
  font:500 26px/1.08 var(--font-serif);
  letter-spacing:-.02em;
  color:#fff
}

.activity-date {
  margin:9px 0 0;
  color:var(--color-gold);
  font-size:12px;
  font-weight:600;
  letter-spacing:.1em;
  text-transform:uppercase
}

.activity-missing {
  margin:10px 0 0;
  font:500 30px/1.05 var(--font-serif);
  color:#f7efdb
}

/* ---- entrées étagées (staggered) ---- */
.activity-head {
  animation:rise-in .55s var(--spring) both
}

.letter {
  animation:letter-in .6s var(--spring) .1s both
}

.carnet {
  animation:paper-in .6s var(--spring) .2s both
}

.annexes {
  animation:paper-in .6s var(--spring) .3s both
}

.slip {
  animation:paper-in .6s var(--spring) .38s both
}

.gap-note {
  animation:paper-in .6s var(--spring) .44s both
}

@keyframes paper-in {
  from {
    opacity:0;
    transform:translateY(26px) rotate(0deg) scale(.985)
  }
  to {
    opacity:1;
    transform:translateY(0) rotate(var(--r,0deg))
  }
}

@keyframes rise-in {
  from {
    opacity:0;
    transform:translateY(18px) scale(.985)
  }
  to {
    opacity:1;
    transform:none
  }
}

/* la lettre se déplie depuis le haut et finit sur sa pose gyroscopique */
@keyframes letter-in {
  from {
    opacity:0;
    transform:perspective(900px) rotateX(9deg) translateY(22px) scale(.98)
  }
  to {
    opacity:1;
    transform:perspective(900px) rotateX(0deg) translate3d(var(--tx,0),var(--ty,0),0)
  }
}

@media (prefers-reduced-motion:reduce) {
  .activity-head,.letter,.carnet,.annexes,.slip,.gap-note {
    animation:none
  }
}

/* ---- la dépêche scellée : kraft, rabat, cire ---- */
.envelope {
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-end;
  min-height:214px;
  margin-top:30px;
  padding:0 20px 18px;
  border-radius:8px 18px 10px 22px / 18px 8px 22px 10px;
  background:
    repeating-linear-gradient(0deg,transparent 0 3px,rgba(90,55,20,.035) 3px 4px),
    linear-gradient(165deg,#dcba8a 0%,#c89d68 58%,#b2854f 100%);
  box-shadow:0 22px 44px rgba(0,0,0,.5),inset 0 0 0 1px rgba(150,105,50,.45),inset 0 1px 0 rgba(255,240,210,.35);
  overflow:hidden;
  animation:rise-in .6s var(--spring) .1s both
}

.envelope.is-cracking {
  animation:rise-in .6s var(--spring) .1s both,env-away .45s ease-in .4s forwards
}

@keyframes env-away {
  to {
    transform:translateY(28px) rotate(-1.4deg);
    opacity:0
  }
}

.env-flap {
  position:absolute;
  z-index:1;
  left:-1px;
  right:-1px;
  top:-1px;
  height:60%;
  background:linear-gradient(180deg,#e4c08f,#c2945c);
  clip-path:polygon(0 0,100% 0,50% 100%);
  transform-origin:50% 0;
  transition:transform .5s cubic-bezier(.65,0,.3,1) .06s;
  box-shadow:0 5px 9px rgba(70,42,12,.28)
}

.is-cracking .env-flap {
  transform:perspective(700px) rotateX(-98deg)
}

.env-seal {
  position:absolute;
  z-index:3;
  left:50%;
  top:56%;
  display:grid;
  place-items:center;
  width:62px;
  height:62px;
  margin:-31px 0 0 -31px;
  padding:0;
  border:0;
  border-radius:46% 54% 50% 50%/52% 47% 55% 45%;
  background:radial-gradient(circle at 34% 28%,#c1503a,#8a2b1a 52%,#5e150c 85%);
  box-shadow:0 8px 16px rgba(0,0,0,.45),inset 0 2px 4px rgba(255,255,255,.3),inset 0 -5px 9px rgba(0,0,0,.4),0 0 0 2px rgba(94,21,12,.22);
  color:#f4d8c0;
  cursor:pointer;
  transform:rotate(-7deg);
  transition:transform .25s ease,filter .25s ease;
  -webkit-tap-highlight-color:transparent
}

.env-seal::before {
  content:'';
  position:absolute;
  inset:7px;
  border:2px solid rgba(255,222,190,.32);
  border-radius:52% 48% 55% 45%/48% 53% 47% 52%
}

.env-seal b {
  font:700 16px/1 var(--font-literary);
  text-shadow:0 -1px 1px rgba(0,0,0,.5)
}

.env-seal:hover {
  transform:rotate(-7deg) scale(1.06);
  filter:brightness(1.08)
}

.env-seal:active {
  transform:rotate(-7deg) scale(.94)
}

.env-seal:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:4px
}

.is-cracking .env-seal {
  animation:seal-crack .42s cubic-bezier(.2,.8,.3,1) forwards
}

@keyframes seal-crack {
  30% {
    transform:rotate(-7deg) scale(1.16);
    opacity:1
  }
  100% {
    transform:rotate(-7deg) scale(1.6);
    opacity:0
  }
}

/* étincelles au bris de cire */
.env-burst {
  position:absolute;
  z-index:4;
  left:50%;
  top:56%;
  pointer-events:none
}

.env-burst i {
  position:absolute;
  width:4px;
  height:4px;
  margin:-2px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 6px #ffd97a;
  opacity:0
}

.is-cracking .env-burst i {
  animation:env-pop .65s cubic-bezier(.15,.6,.3,1) .08s forwards
}

@keyframes env-pop {
  0% {
    opacity:1;
    transform:rotate(var(--a)) translateX(8px) scale(1)
  }
  100% {
    opacity:0;
    transform:rotate(var(--a)) translateX(var(--dd)) scale(.3)
  }
}

.env-hint {
  position:relative;
  z-index:1;
  margin:0;
  color:#6d4a20;
  font:italic 500 12.5px var(--font-literary);
  letter-spacing:.02em;
  opacity:.85;
  transition:opacity .2s
}

.is-cracking .env-hint {
  opacity:0
}

/* ---- feuilleter les dépêches ---- */
.day-pager {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-top:24px
}

.pager-link {
  display:inline-flex;
  align-items:center;
  gap:3px;
  padding:8px 2px;
  color:rgba(230,194,128,.65);
  font-family:var(--font-serif);
  font-style:italic;
  font-size:13px;
  letter-spacing:.03em;
  text-decoration:none;
  transition:color .25s
}

.pager-link:hover {
  color:var(--color-gold)
}

.pager-link i {
  font-size:16px
}

.pager-ghost {
  width:1px
}

.pager-link:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px;
  border-radius:8px
}

/* ---- le mot du lutin : artefact parchemin ---- */
.letter {
  position:relative;
  margin-top:30px;
  transform-origin:50% 0;
  transform:translate3d(var(--tx,0),var(--ty,0),0);
  transition:transform .3s ease-out;
  padding:34px 24px 20px;
  border-radius:5px 20px 8px 26px / 20px 7px 26px 9px;
  background:
    radial-gradient(ellipse 60% 40% at 18% 10%,rgba(255,252,238,.75),transparent 60%),
    radial-gradient(ellipse 50% 45% at 88% 92%,rgba(196,152,82,.28),transparent 60%),
    repeating-linear-gradient(0deg,transparent 0 3px,rgba(120,80,30,.022) 3px 4px),
    repeating-linear-gradient(90deg,transparent 0 5px,rgba(120,80,30,.018) 5px 6px),
    linear-gradient(160deg,#f6ecd2 0%,#eedfb8 55%,#e2cd9e 100%);
  color:#3a2d18;
  box-shadow:
    0 22px 44px rgba(0,0,0,.5),
    inset 0 0 0 1px rgba(150,110,50,.4),
    inset 0 0 34px rgba(120,78,28,.22),
    inset 0 1px 0 rgba(255,255,255,.65);
  overflow:visible
}

/* bord "brûlé" irrégulier */
.letter::after {
  content:'';
  position:absolute;
  inset:0;
  border-radius:inherit;
  box-shadow:
    inset 0 0 14px rgba(96,58,16,.3),
    inset 0 -6px 18px rgba(120,72,22,.28),
    inset 4px 0 14px rgba(96,58,16,.18);
  pointer-events:none
}

.letter::before {
  content:'';
  position:absolute;
  inset:8px;
  border:1px solid rgba(140,105,45,.3);
  border-radius:4px 14px 6px 18px / 14px 5px 18px 7px;
  pointer-events:none
}

/* sceau de cire */
.wax-seal {
  position:absolute;
  z-index:2;
  top:-10px;
  left:16px;
  display:grid;
  place-items:center;
  width:62px;
  height:62px;
  border-radius:46% 54% 50% 50% / 52% 47% 55% 45%;
  background:radial-gradient(circle at 34% 28%,#c1503a,#8a2b1a 52%,#5e150c 85%);
  box-shadow:
    0 8px 16px rgba(0,0,0,.45),
    inset 0 2px 4px rgba(255,255,255,.3),
    inset 0 -5px 9px rgba(0,0,0,.4);
  filter:drop-shadow(0 4px 8px rgba(0,0,0,.5));
  transform:rotate(-7deg) translate(calc(var(--tx,0)*1.7),calc(var(--ty,0)*1.7))
}

.wax-seal::before {
  content:'';
  position:absolute;
  inset:7px;
  border:2px solid rgba(255,222,190,.32);
  border-radius:52% 48% 55% 45% / 48% 53% 47% 52%
}

.wax-seal b {
  color:#f4d8c0;
  font:700 19px/1 var(--font-literary);
  letter-spacing:.02em;
  text-shadow:0 -1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,220,190,.2)
}

/* tampon postal vintage */
.postmark {
  position:absolute;
  z-index:1;
  top:16px;
  right:14px;
  display:grid;
  place-items:center;
  align-content:center;
  gap:3px;
  width:88px;
  height:88px;
  border:2px solid rgba(96,62,20,.42);
  border-radius:50%;
  box-shadow:inset 0 0 0 1.5px rgba(96,62,20,.28);
  color:rgba(96,62,20,.7);
  font:700 7.5px/1.3 var(--font-sans);
  letter-spacing:.13em;
  text-align:center;
  transform:rotate(-12deg);
  opacity:.6;
  mix-blend-mode:multiply;
  pointer-events:none
}

.postmark small {
  font:italic 500 8.5px var(--font-literary);
  letter-spacing:.02em
}

.letter-label {
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:#8a6a2f;
  font-size:9px;
  font-weight:700;
  letter-spacing:.16em
}

.letter blockquote {
  margin:18px 0 0;
  font:italic 500 19px/1.62 var(--font-literary);
  color:#3a2818
}

/* lettrine à la feuille d'or */
.letter blockquote::first-letter {
  float:left;
  margin:6px 10px 2px 0;
  padding:2px 4px;
  background:linear-gradient(160deg,#ffe9a8 0%,#d9ad55 45%,#a67d34 75%,#7a5a20 100%);
  -webkit-background-clip:text;
  background-clip:text;
  font:700 52px/.75 var(--font-literary);
  -webkit-text-fill-color:transparent;
  filter:drop-shadow(0 1px 0 rgba(255,246,214,.6)) drop-shadow(0 0 6px rgba(212,175,95,.35))
}

.letter-foot {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-top:18px;
  padding-top:12px;
  border-top:1px solid rgba(140,105,45,.25)
}

.letter-sign {
  font:italic 400 13px var(--font-serif);
  color:#8a6a2f
}

.copy-button {
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:9px 16px;
  border:1px solid #8c6b3d;
  border-radius:999px;
  background:#e6c280;
  color:#3a2818;
  font-size:11px;
  font-weight:700;
  cursor:pointer;
  box-shadow:0 4px 12px rgba(90,60,15,.25),inset 0 1px 0 rgba(255,255,255,.5);
  transition:transform .2s ease,box-shadow .2s ease
}

.copy-button:hover {
  transform:translateY(-1px);
  box-shadow:0 7px 16px rgba(90,60,15,.32),inset 0 1px 0 rgba(255,255,255,.5)
}

.copy-button.copied {
  background:#4a5d35;
  border-color:#4a5d35;
  color:#eef5d8;
  box-shadow:none
}

/* ---- carnet secret : note pliée épinglée sous la lettre ---- */
.carnet {
  --r:-.9deg;
  position:relative;
  margin-top:34px;
  padding:22px 20px 16px;
  border-radius:3px 12px 5px 14px / 12px 4px 14px 6px;
  transform:rotate(var(--r));
  background:
    repeating-linear-gradient(0deg,transparent 0 3px,rgba(110,72,26,.025) 3px 4px),
    linear-gradient(155deg,#ece0be 0%,#e0cd9f 58%,#cfb681 100%);
  box-shadow:0 16px 36px rgba(0,0,0,.45),inset 0 0 0 1px rgba(150,110,50,.35),inset 0 0 26px rgba(120,78,28,.18);
  color:#43331c
}

.carnet .section-label {
  color:#8a6a2f
}

.carnet.done {
  box-shadow:0 16px 36px rgba(0,0,0,.45),inset 0 0 0 1px rgba(150,110,50,.35),inset 0 0 26px rgba(120,78,28,.18),0 0 28px rgba(255,215,0,.16)
}

/* épingle laiton qui retient la note */
.carnet-pin {
  position:absolute;
  z-index:2;
  top:-8px;
  left:50%;
  width:16px;
  height:16px;
  margin-left:-8px;
  border-radius:50%;
  background:radial-gradient(circle at 36% 30%,#ffe9a8,#c99e4e 55%,#6e4f1e);
  box-shadow:0 3px 5px rgba(0,0,0,.4),inset 0 -1px 3px rgba(0,0,0,.4),inset 0 1px 1px rgba(255,255,255,.5);
  pointer-events:none
}

/* tampon « PRÊT » apposé à l'encre rouge quand la mission est faite */
.carnet-stamp {
  position:absolute;
  z-index:1;
  top:12px;
  right:12px;
  display:grid;
  place-items:center;
  align-content:center;
  width:76px;
  height:46px;
  border:2px solid rgba(138,43,26,.5);
  border-radius:7px;
  box-shadow:inset 0 0 0 1px rgba(138,43,26,.22);
  color:rgba(138,43,26,.72);
  font:700 8.5px/1.3 var(--font-sans);
  letter-spacing:.16em;
  text-align:center;
  transform:rotate(-13deg);
  opacity:0;
  pointer-events:none
}

.carnet.done .carnet-stamp {
  animation:stamp-in .45s cubic-bezier(.3,1.5,.5,1) both
}

@keyframes stamp-in {
  from {
    opacity:0;
    transform:rotate(-13deg) scale(1.7)
  }
  to {
    opacity:1;
    transform:rotate(-13deg) scale(1)
  }
}

/* onde de lumière à la validation */
.carnet-burst {
  position:absolute;
  inset:-30px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(255,233,168,.55) 0%,rgba(255,215,0,.25) 45%,transparent 70%);
  mix-blend-mode:screen;
  opacity:0;
  pointer-events:none
}

.carnet.done .carnet-burst {
  animation:carnet-burst .8s ease-out
}

@keyframes carnet-burst {
  0% {
    opacity:1;
    transform:scale(.3)
  }
  100% {
    opacity:0;
    transform:scale(1.6)
  }
}

.carnet .activity-copy {
  color:rgba(58,40,24,.92);
  font:italic 500 15px/1.6 var(--font-literary)
}

.carnet .done-row {
  border-top:1px solid rgba(140,105,45,.3)
}

.section-label {
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:#e6c280;
  font-size:9px;
  font-weight:700;
  letter-spacing:.15em
}

.section-label i {
  font-size:17px;
  font-weight:400
}

.activity-copy {
  margin:14px 0 0;
  color:rgba(255,255,255,.92);
  font-size:14px;
  line-height:1.7
}

.done-row {
  display:flex;
  align-items:center;
  gap:10px;
  width:100%;
  margin-top:18px;
  padding:11px 0 0;
  border:0;
  border-top:1px solid rgba(140,105,45,.3);
  background:none;
  color:#6e532a;
  text-align:left;
  font-size:12px;
  cursor:pointer
}

.done-check {
  display:grid;
  place-items:center;
  width:21px;
  height:21px;
  border:1.5px solid #7a5a20;
  border-radius:50%;
  color:#ece0be;
  transition:background .25s,box-shadow .25s,border-color .25s
}

.done-check i {
  animation:check-pop .3s var(--spring)
}

@keyframes check-pop {
  from {
    transform:scale(.4);
    opacity:0
  }
  to {
    transform:scale(1);
    opacity:1
  }
}

.done-row.done {
  color:#5e4318
}

.done-row.done .done-check {
  border-color:#7a5a20;
  background:#7a5a20;
  box-shadow:0 0 10px rgba(122,90,32,.45)
}

/* ---- annexes : planche de timbres à découper ---- */
.annexes {
  --r:.7deg;
  position:relative;
  margin-top:30px;
  padding:20px 18px 16px;
  border-radius:4px 14px 6px 18px / 14px 5px 18px 7px;
  transform:rotate(var(--r));
  background:
    repeating-linear-gradient(90deg,transparent 0 4px,rgba(110,72,26,.02) 4px 5px),
    linear-gradient(158deg,#f1e6c8 0%,#e6d5ab 60%,#d8c190 100%);
  box-shadow:0 16px 36px rgba(0,0,0,.45),inset 0 0 0 1px rgba(150,110,50,.32),inset 0 0 26px rgba(120,78,28,.15);
  color:#3a2d18
}

.annexes .section-label {
  color:#8a6a2f
}

.annexes .section-label i {
  color:#8a6a2f
}

.asset-grid {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:14px 12px;
  margin-top:16px
}

.stamp {
  display:grid;
  gap:5px;
  color:#3a2d18
}

.stamp:nth-child(4n+1) {
  transform:rotate(-1.1deg)
}

.stamp:nth-child(4n+2) {
  transform:rotate(.8deg)
}

.stamp:nth-child(4n+3) {
  transform:rotate(-.6deg)
}

.stamp:nth-child(4n) {
  transform:rotate(1.2deg)
}

/* dentelure du timbre */
.stamp-frame {
  display:block;
  padding:5px;
  border:1.5px dashed rgba(122,90,32,.55);
  border-radius:3px;
  background:#fbf5e4;
  transition:transform .25s ease
}

.stamp-frame:hover {
  transform:scale(1.02)
}

.stamp-frame img {
  display:block;
  width:100%;
  aspect-ratio:1.42;
  object-fit:cover;
  border-radius:2px
}

.stamp span {
  font-size:12px;
  font-weight:600;
  line-height:1.3
}

.stamp small {
  color:#8a6a2f;
  font-size:10px;
  font-style:italic
}

.stamp-actions {
  display:flex;
  gap:6px;
  margin-top:3px
}

.stamp-actions button,.stamp-actions a {
  display:inline-flex;
  align-items:center;
  gap:5px;
  flex:1;
  justify-content:center;
  padding:7px 8px;
  border:1px solid rgba(122,90,32,.5);
  border-radius:999px;
  background:transparent;
  color:#7a5a20;
  font-family:inherit;
  font-size:10px;
  font-weight:600;
  cursor:pointer;
  text-decoration:none;
  transition:background .25s,transform .35s var(--spring)
}

.stamp-actions button:hover,.stamp-actions a:hover {
  background:rgba(122,90,32,.12)
}

.stamp-actions button:active,.stamp-actions a:active {
  transform:scale(.94)
}

/* impression fiche complète : ligne de découpe du coupon */
.print-all {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  width:100%;
  margin-top:16px;
  padding:12px;
  border:1.5px dashed rgba(122,90,32,.55);
  border-radius:10px;
  background:transparent;
  color:#5e4318;
  font-family:inherit;
  font-size:12px;
  font-weight:700;
  cursor:pointer;
  transition:background .25s,transform .35s var(--spring)
}

.print-all:hover {
  background:rgba(122,90,32,.1)
}

.print-all:active {
  transform:scale(.97)
}

.letter-usage {
  display:block;
  margin-top:2px;
  color:#8a6a2f;
  font:italic 500 10px var(--font-literary);
  letter-spacing:.04em;
  opacity:.85
}

/* ---- vue imprimable (écran : masquée, print : seule visible) ---- */
.print-sheet {
  display:none
}

@media print {
  .print-sheet {
    display:block;
    padding:12px 4mm;
    color:#222;
    background:#fff;
    font-family:Georgia,serif
  }

  .print-sheet h1 {
    margin:0;
    font-size:20pt
  }

  .print-date {
    margin:2mm 0 6mm;
    font-size:9pt;
    letter-spacing:.14em;
    text-transform:uppercase
  }

  .print-sheet h2 {
    margin:7mm 0 3mm;
    font-size:12pt;
    border-bottom:1px solid #999
  }

  .print-sheet h2 small {
    font-weight:400;
    font-style:italic;
    color:#666
  }

  .print-message {
    padding:4mm;
    border:1.5px dashed #8a6a2f;
    font-size:11pt;
    line-height:1.6;
    white-space:pre-line
  }

  .print-assets {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:5mm
  }

  .print-assets figure {
    margin:0;
    break-inside:avoid
  }

  .print-assets img {
    width:100%;
    border:1px solid #ccc
  }

  .print-assets figcaption {
    font-size:8pt;
    color:#555
  }
}

/* ---- cadeaux : bande de papier déchirée ---- */
.slip {
  --r:-.5deg;
  position:relative;
  margin-top:30px;
  padding:16px 20px 24px;
  transform:rotate(var(--r));
  background:
    repeating-linear-gradient(0deg,transparent 0 3px,rgba(110,72,26,.02) 3px 4px),
    linear-gradient(160deg,#e9dcba,#dcc795);
  color:#43331c;
  clip-path:polygon(0 0,100% 0,100% calc(100% - 7px),94% 100%,88% calc(100% - 6px),80% 100%,73% calc(100% - 7px),66% 100%,58% calc(100% - 6px),50% 100%,42% calc(100% - 7px),34% 100%,27% calc(100% - 6px),19% 100%,12% calc(100% - 7px),6% 100%,0 calc(100% - 7px))
}

.slip .section-label {
  color:#8a6a2f
}

.slip-list {
  list-style:none;
  margin:12px 0 0;
  padding:0
}

.slip-list li {
  display:flex;
  align-items:baseline;
  gap:9px;
  padding:5px 0;
  color:#43331c;
  font:italic 500 14.5px/1.4 var(--font-literary)
}

.slip-dot {
  color:#a67d34;
  font-size:11px
}

/* ---- gap : annotation au crayon en marge ---- */
.gap-note {
  --r:.8deg;
  display:flex;
  gap:10px;
  margin-top:26px;
  padding:13px 15px;
  transform:rotate(var(--r));
  border:1.5px dashed rgba(200,175,120,.4);
  border-radius:4px 10px 6px 12px;
  background:rgba(226,205,158,.06);
  color:rgba(230,214,175,.85)
}

.gap-note>i {
  font-size:17px;
  color:#d8b96e
}

.gap-note strong {
  font-size:12px
}

.gap-note p {
  margin:3px 0 0;
  color:rgba(230,214,175,.7);
  font:italic 500 11.5px/1.5 var(--font-literary)
}

.back-link:focus-visible,.copy-button:focus-visible,.done-row:focus-visible,.stamp-frame:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px
}
</style>

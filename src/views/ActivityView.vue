<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

watch(sheet, () => { preparationDone.value = false }, { immediate: true })

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
  <main class="app-screen activity-screen">
    <i class="warm-glow" aria-hidden="true" />
    <i class="warm-spark warm-spark--a" aria-hidden="true" />
    <i class="warm-spark warm-spark--b" aria-hidden="true" />

    <header class="activity-head">
      <button class="back-link" type="button" @click="goBack"><i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour</button>
      <template v-if="sheet">
        <div class="activity-hero">
          <p class="home-overline">JOUR {{ sheet.day }} · FICHE DU JOUR</p>
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
      <!-- Le mot du lutin : parchemin chaud -->
      <section class="letter" :style="{ '--tx': letterTilt.x + 'px', '--ty': letterTilt.y + 'px' }" aria-labelledby="message-title">
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
        <i class="carnet-ribbon" aria-hidden="true" />
        <i class="carnet-burst" aria-hidden="true" />
        <div class="section-label"><span id="prep-title">LE CARNET SECRET DES LUTINS</span><i class="mdi mdi-book-lock-outline" aria-hidden="true" /></div>
        <p class="activity-copy">{{ sheet.adultPreparation }}</p>
        <button class="done-row" type="button" :class="{ done: preparationDone }" @click="togglePreparation">
          <span class="done-check"><i v-if="preparationDone" class="mdi mdi-check" aria-hidden="true" /></span>
          <span>{{ preparationDone ? 'Tout est prêt pour demain' : 'Marquer la préparation comme faite' }}</span>
        </button>
      </section>

      <section v-if="sheet.assets.length" class="app-card" aria-labelledby="assets-title">
        <div class="section-label"><span id="assets-title">DANS LE KIT</span><i class="mdi mdi-printer-outline" aria-hidden="true" /></div>
        <div class="asset-grid">
          <div v-for="asset in sheet.assets" :key="asset.file" class="asset-item">
            <a class="asset-thumb" :href="asset.file" target="_blank" rel="noreferrer"><img :src="asset.file" :alt="asset.label" loading="lazy"></a>
            <span>{{ asset.label }}</span>
            <small>Annexe · p. {{ asset.page }} — {{ assetKind(asset.label) }}</small>
            <div class="asset-actions">
              <button type="button" @click="printAsset(asset.file)"><i class="mdi mdi-printer" aria-hidden="true" /> Imprimer</button>
              <a :href="asset.file" download><i class="mdi mdi-download" aria-hidden="true" /> Télécharger</a>
            </div>
          </div>
        </div>
        <button class="print-all" type="button" @click="printSheet"><i class="mdi mdi-printer-check" aria-hidden="true" /> Imprimer la fiche complète (lettre + annexes)</button>
      </section>

      <section v-if="sheet.gifts.length" class="app-card" aria-labelledby="gift-title">
        <div class="section-label"><span id="gift-title">CADEAU, ALIMENT OU SURPRISE</span><i class="mdi mdi-gift-outline" aria-hidden="true" /></div>
        <ul class="gift-list">
          <li v-for="gift in sheet.gifts" :key="gift"><span class="gift-chip"><i class="mdi mdi-gift-open-outline" aria-hidden="true" /></span>{{ gift }}</li>
        </ul>
      </section>

      <aside v-if="gap" class="content-gap" aria-label="Élément à produire"><i class="mdi mdi-image-plus-outline" aria-hidden="true" /><div><strong>Visuel de scène à créer</strong><p>{{ gap.detail }}</p></div></aside>
    </template>

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
  color:rgba(255,255,255,.62);
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

.activity-hero h1 {
  margin:6px 0 0;
  font:500 27px/1.08 var(--font-serif);
  letter-spacing:-.02em;
  color:#f7efdb
}

.activity-date {
  margin:9px 0 0;
  color:var(--color-gold);
  font-size:10px;
  font-weight:600;
  letter-spacing:.15em;
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
  animation:rise-in .6s var(--spring) .2s both
}

.app-card {
  animation:rise-in .6s var(--spring) .28s both
}

.app-card + .app-card {
  animation-delay:.34s
}

.content-gap {
  animation:rise-in .6s var(--spring) .4s both
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

/* la lettre finit sur sa pose gyroscopique pour ne pas casser le tilt */
@keyframes letter-in {
  from {
    opacity:0;
    transform:translateY(18px) scale(.985)
  }
  to {
    opacity:1;
    transform:translate3d(var(--tx,0),var(--ty,0),0)
  }
}

@media (prefers-reduced-motion:reduce) {
  .activity-head,.letter,.carnet,.app-card,.content-gap {
    animation:none
  }
}

/* ---- le mot du lutin : artefact parchemin ---- */
.letter {
  position:relative;
  margin-top:30px;
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
  top:-20px;
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
  transform:rotate(10deg);
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
  color:#39290f
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
  background:linear-gradient(135deg,#e6c280,#d4af5f);
  color:#3a2d18;
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

/* ---- carnet secret des lutins ---- */
.carnet {
  position:relative;
  margin-top:22px;
  padding:20px 20px 16px;
  border:1px dashed rgba(230,194,128,.4);
  border-radius:6px 16px 10px 18px / 16px 6px 18px 10px;
  background:
    repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,0,0,.06) 3px 4px),
    linear-gradient(150deg,#3d2f1d 0%,#322513 55%,#2a1d0e 100%);
  box-shadow:0 14px 34px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,240,210,.1);
  color:#e8d9b8;
  transition:border-color .3s,box-shadow .3s
}

.carnet .section-label {
  color:#e6c280
}

.carnet.done {
  border-color:rgba(230,194,128,.6);
  box-shadow:0 14px 34px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,240,210,.1),0 0 26px rgba(255,215,0,.14)
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

.carnet-ribbon {
  position:absolute;
  top:-7px;
  right:30px;
  width:15px;
  height:42px;
  background:linear-gradient(180deg,#b03a2b,#7e2417);
  clip-path:polygon(0 0,100% 0,100% 100%,50% 80%,0 100%);
  box-shadow:0 3px 6px rgba(0,0,0,.35)
}

.carnet .activity-copy {
  color:rgba(240,225,190,.92)
}

.carnet .done-row {
  border-top:1px dashed rgba(230,194,128,.25)
}

/* ---- sections verre ---- */
.app-card {
  margin-top:18px
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
  border-top:1px solid #ffffff12;
  background:none;
  color:#a9bcae;
  text-align:left;
  font-size:12px;
  cursor:pointer
}

.done-check {
  display:grid;
  place-items:center;
  width:21px;
  height:21px;
  border:1px solid #ffffff45;
  border-radius:50%;
  color:#173b32;
  transition:background .25s,box-shadow .25s,border-color .25s
}

.done-row.done {
  color:#e6c280
}

.done-row.done .done-check {
  border-color:#e6c280;
  background:#e6c280;
  box-shadow:0 0 10px rgba(230,194,128,.5)
}

/* ---- kit ---- */
.asset-grid {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
  margin-top:14px
}

.asset-item {
  display:grid;
  gap:5px;
  color:#fff;
  text-decoration:none
}

.asset-thumb img {
  width:100%;
  aspect-ratio:1.42;
  border:1px solid rgba(241,204,122,.25);
  border-radius:12px;
  object-fit:cover;
  background:#f6f0df;
  transition:transform .25s ease
}

.asset-thumb:hover img {
  transform:scale(1.02)
}

.asset-item span {
  font-size:12px;
  line-height:1.25
}

.asset-item small {
  color:#a9bcae;
  font-size:10px
}

.asset-actions {
  display:flex;
  gap:6px;
  margin-top:3px
}

.asset-actions button,.asset-actions a {
  display:inline-flex;
  align-items:center;
  gap:5px;
  flex:1;
  justify-content:center;
  padding:7px 8px;
  border:1px solid rgba(230,194,128,.35);
  border-radius:999px;
  background:rgba(230,194,128,.1);
  color:#e6c280;
  font-family:inherit;
  font-size:10px;
  font-weight:600;
  cursor:pointer;
  text-decoration:none;
  transition:background .25s,transform .35s var(--spring)
}

.asset-actions button:hover,.asset-actions a:hover {
  background:rgba(230,194,128,.2)
}

.asset-actions button:active,.asset-actions a:active {
  transform:scale(.94)
}

/* impression fiche complète */
.print-all {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  width:100%;
  margin-top:14px;
  padding:12px;
  border:1px solid rgba(230,194,128,.45);
  border-radius:14px;
  background:rgba(230,194,128,.12);
  color:#ffe9a8;
  font-family:inherit;
  font-size:12px;
  font-weight:700;
  cursor:pointer;
  transition:background .25s,transform .35s var(--spring)
}

.print-all:hover {
  background:rgba(230,194,128,.2)
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

/* ---- cadeaux ---- */
.gift-list {
  list-style:none;
  margin:14px 0 0;
  padding:0
}

.gift-list li {
  display:flex;
  align-items:center;
  gap:10px;
  padding:6px 0;
  color:rgba(255,255,255,.82);
  font-size:13px
}

.gift-chip {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:28px;
  height:28px;
  border-radius:9px;
  background:rgba(230,194,128,.14);
  color:#e6c280;
  font-size:15px
}

/* ---- gap ---- */
.content-gap {
  display:flex;
  gap:11px;
  margin-top:18px;
  padding:14px;
  border:1px dashed #e6c28066;
  border-radius:16px;
  background:#e6c28008;
  color:#e6c280
}

.content-gap>i {
  font-size:20px
}

.content-gap strong {
  font-size:12px
}

.content-gap p {
  margin:4px 0 0;
  color:#a9bcae;
  font-size:11px;
  line-height:1.45
}

.back-link:focus-visible,.copy-button:focus-visible,.done-row:focus-visible,.asset-item:focus-visible {
  outline:2px solid #ffe9a8;
  outline-offset:3px
}
</style>

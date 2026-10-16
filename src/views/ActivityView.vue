<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { contentGapByDay } from '../data/contentGaps'
import { dailySheetsByActivityId } from '../data/dailySheets'

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

function togglePreparation() {
  preparationDone.value = !preparationDone.value
  navigator.vibrate?.(12)
}

async function copyMessage() {
  if (!sheet.value) return
  await navigator.clipboard?.writeText(sheet.value.message)
  navigator.vibrate?.(8)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
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
          <span class="day-medal" aria-hidden="true">J{{ sheet.day }}</span>
          <div>
            <p class="home-overline">FICHE DU JOUR</p>
            <h1>{{ sheet.title }}</h1>
            <p class="activity-date">{{ sheet.date }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="home-overline">FICHE DU JOUR</p>
        <h1 class="activity-missing">Fiche introuvable</h1>
      </template>
    </header>

    <template v-if="sheet">
      <!-- Le mot du lutin : parchemin chaud -->
      <section class="letter" aria-labelledby="message-title">
        <i class="letter-quote mdi mdi-format-quote-open" aria-hidden="true" />
        <div class="letter-label"><span id="message-title">LE MOT DU LUTIN</span><i class="mdi mdi-message-text-outline" aria-hidden="true" /></div>
        <blockquote>{{ sheet.message }}</blockquote>
        <div class="letter-foot">
          <span class="letter-sign">— depuis la route</span>
          <button class="copy-button" type="button" :class="{ copied }" @click="copyMessage">
            <i class="mdi" :class="copied ? 'mdi-check' : 'mdi-content-copy'" aria-hidden="true" />
            {{ copied ? 'Copié !' : 'Copier le texte' }}
          </button>
        </div>
      </section>

      <section class="app-card prep-card" :class="{ done: preparationDone }" aria-labelledby="prep-title">
        <div class="section-label"><span id="prep-title">LA VEILLE, CÔTÉ ADULTES</span><i class="mdi mdi-eye-off-outline" aria-hidden="true" /></div>
        <p class="activity-copy">{{ sheet.adultPreparation }}</p>
        <button class="done-row" type="button" :class="{ done: preparationDone }" @click="togglePreparation">
          <span class="done-check"><i v-if="preparationDone" class="mdi mdi-check" aria-hidden="true" /></span>
          <span>{{ preparationDone ? 'Tout est prêt pour demain' : 'Marquer la préparation comme faite' }}</span>
        </button>
      </section>

      <section v-if="sheet.assets.length" class="app-card" aria-labelledby="assets-title">
        <div class="section-label"><span id="assets-title">DANS LE KIT</span><i class="mdi mdi-printer-outline" aria-hidden="true" /></div>
        <div class="asset-grid">
          <a v-for="asset in sheet.assets" :key="asset.file" class="asset-item" :href="asset.file" target="_blank" rel="noreferrer">
            <img :src="asset.file" :alt="asset.label" loading="lazy">
            <span>{{ asset.label }}</span>
            <small>Annexe · p. {{ asset.page }}</small>
          </a>
        </div>
      </section>

      <section v-if="sheet.gifts.length" class="app-card" aria-labelledby="gift-title">
        <div class="section-label"><span id="gift-title">CADEAU, ALIMENT OU SURPRISE</span><i class="mdi mdi-gift-outline" aria-hidden="true" /></div>
        <ul class="gift-list">
          <li v-for="gift in sheet.gifts" :key="gift"><span class="gift-chip"><i class="mdi mdi-gift-open-outline" aria-hidden="true" /></span>{{ gift }}</li>
        </ul>
      </section>

      <aside v-if="gap" class="content-gap" aria-label="Élément à produire"><i class="mdi mdi-image-plus-outline" aria-hidden="true" /><div><strong>Visuel de scène à créer</strong><p>{{ gap.detail }}</p></div></aside>
    </template>

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
  align-items:center;
  gap:16px
}

.day-medal {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:62px;
  height:62px;
  border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#ffe9a8,#e6c280 55%,#b8914a);
  color:#3d2b12;
  font:700 17px var(--font-serif);
  letter-spacing:-.01em;
  box-shadow:0 0 0 4px rgba(230,194,128,.15),0 0 22px rgba(255,215,0,.35),inset 0 2px 3px rgba(255,255,255,.5),inset 0 -3px 6px rgba(120,80,20,.35)
}

.activity-hero h1 {
  margin:6px 0 0;
  font:500 27px/1.08 var(--font-serif);
  letter-spacing:-.02em;
  color:#f7efdb
}

.activity-date {
  margin:7px 0 0;
  color:#a9bcae;
  font-size:12px;
  font-style:italic;
  font-family:var(--font-serif);
  text-transform:capitalize
}

.activity-missing {
  margin:10px 0 0;
  font:500 30px/1.05 var(--font-serif);
  color:#f7efdb
}

/* ---- le mot du lutin : parchemin ---- */
.letter {
  position:relative;
  margin-top:24px;
  padding:22px 20px 18px;
  border-radius:18px;
  background:linear-gradient(160deg,#f8eed8,#efe0bd 70%,#e9d5ac);
  color:#3a2d18;
  box-shadow:0 18px 40px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(160,120,60,.25);
  overflow:hidden
}

.letter::before {
  content:'';
  position:absolute;
  inset:6px;
  border:1px solid rgba(140,105,45,.28);
  border-radius:12px;
  pointer-events:none
}

.letter-quote {
  position:absolute;
  top:14px;
  right:16px;
  color:rgba(140,105,45,.35);
  font-size:30px
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

.letter-label i {
  font-size:16px;
  font-weight:400
}

.letter blockquote {
  margin:16px 0 0;
  font:400 17px/1.55 var(--font-serif);
  color:#3d2f16
}

.letter blockquote::first-letter {
  float:left;
  margin:3px 8px 0 0;
  font:500 44px/.8 var(--font-serif);
  color:#9a742e
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
  border:1px solid #b98e3e;
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

.prep-card.done {
  border-color:rgba(230,194,128,.45);
  box-shadow:0 14px 36px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.07),0 0 24px rgba(255,215,0,.12)
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

.asset-item img {
  width:100%;
  aspect-ratio:1.42;
  border:1px solid rgba(241,204,122,.25);
  border-radius:12px;
  object-fit:cover;
  background:#f6f0df;
  transition:transform .25s ease
}

.asset-item:hover img {
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

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HomeNav } from '../components/home'
import { contentGapByDay } from '../data/contentGaps'
import { dailySheetsByActivityId } from '../data/dailySheets'

const route = useRoute()
const activityId = computed(() => String(route.params.activityId))
const dayNumber = computed(() => Number(activityId.value.match(/jour-(\d+)/)?.[1] ?? 0))
const sheet = computed(() => dailySheetsByActivityId[activityId.value] ?? dailySheetsByActivityId[`jour-${dayNumber.value}`])
const gap = computed(() => contentGapByDay[dayNumber.value])
const preparationDone = ref(false)
const copied = ref(false)

watch(sheet, () => { preparationDone.value = false }, { immediate: true })

async function copyMessage() {
  if (!sheet.value) return
  await navigator.clipboard?.writeText(sheet.value.message)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}
</script>

<template>
  <main class="app-screen activity-screen">
    <header class="activity-head">
      <RouterLink class="back-link" to="/planning"><i class="mdi mdi-arrow-left" aria-hidden="true" /> Planning</RouterLink>
      <template v-if="sheet">
        <div class="activity-kicker"><span>FICHE DU JOUR</span><strong>J{{ sheet.day }}</strong></div>
        <h1>{{ sheet.title }}</h1>
        <p class="activity-date">{{ sheet.date }}</p>
      </template>
      <template v-else>
        <p class="home-overline">FICHE DU JOUR</p>
        <h1>Fiche introuvable</h1>
      </template>
    </header>

    <template v-if="sheet">
      <section class="activity-message app-card" aria-labelledby="message-title">
        <div class="section-label"><span id="message-title">LE TEXTE À UTILISER</span><i class="mdi mdi-message-text-outline" aria-hidden="true" /></div>
        <blockquote>{{ sheet.message }}</blockquote>
        <button class="copy-button" type="button" @click="copyMessage"><i class="mdi" :class="copied ? 'mdi-check' : 'mdi-content-copy'" aria-hidden="true" /> {{ copied ? 'Copié !' : 'Copier le texte' }}</button>
      </section>

      <section class="app-card" aria-labelledby="prep-title">
        <div class="section-label"><span id="prep-title">PRÉPARATION ADULTE</span><i class="mdi mdi-eye-off-outline" aria-hidden="true" /></div>
        <p class="activity-copy">{{ sheet.adultPreparation }}</p>
        <button class="done-row" type="button" :class="{ done: preparationDone }" @click="preparationDone = !preparationDone"><span class="done-check"><i v-if="preparationDone" class="mdi mdi-check" aria-hidden="true" /></span><span>{{ preparationDone ? 'Préparation terminée' : 'Marquer la préparation comme faite' }}</span></button>
      </section>

      <section v-if="sheet.assets.length" class="app-card" aria-labelledby="assets-title">
        <div class="section-label"><span id="assets-title">DANS LE KIT</span><i class="mdi mdi-file-image-outline" aria-hidden="true" /></div>
        <div class="asset-grid"><a v-for="asset in sheet.assets" :key="asset.file" class="asset-item" :href="asset.file" target="_blank" rel="noreferrer"><img :src="asset.file" :alt="asset.label" loading="lazy"><span>{{ asset.label }}</span><small>Annexe · p. {{ asset.page }}</small></a></div>
      </section>

      <section v-if="sheet.gifts.length" class="app-card" aria-labelledby="gift-title">
        <div class="section-label"><span id="gift-title">CADEAU, ALIMENT OU SURPRISE</span><i class="mdi mdi-gift-outline" aria-hidden="true" /></div>
        <ul class="simple-list"><li v-for="gift in sheet.gifts" :key="gift"><i class="mdi mdi-circle-small" aria-hidden="true" />{{ gift }}</li></ul>
      </section>

      <aside v-if="gap" class="content-gap" aria-label="Élément à produire"><i class="mdi mdi-image-plus-outline" aria-hidden="true" /><div><strong>Visuel de scène à créer</strong><p>{{ gap.detail }}</p></div></aside>
    </template>

    <HomeNav />
  </main>
</template>

<style scoped>
.activity-screen {
  padding-bottom:calc(100px + env(safe-area-inset-bottom))
}

.activity-head {
  margin-top:6px
}

.back-link {
  display:inline-flex;
  align-items:center;
  gap:5px;
  margin-bottom:22px;
  color:rgba(255,255,255,.62);
  font-size:12px;
  text-decoration:none
}

.back-link:hover {
  color:#e6c280
}

.activity-kicker {
  display:flex;
  align-items:center;
  gap:10px;
  color:#e6c280;
  font-size:10px;
  font-weight:700;
  letter-spacing:.16em
}

.activity-kicker strong {
  padding:4px 7px;
  border:1px solid #e6c28066;
  border-radius:7px;
  font-size:9px
}

.activity-head h1 {
  margin:10px 0 0;
  font:500 30px/1.05 var(--font-serif);
  letter-spacing:-.02em;
  color:#f7efdb
}

.activity-date {
  margin:8px 0 0;
  color:#a9bcae;
  font-size:12px;
  text-transform:capitalize
}

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

.activity-message {
  background:linear-gradient(145deg,rgba(230,194,128,.14),rgba(255,255,255,.04))
}

.activity-message blockquote {
  margin:16px 0 18px;
  color:#fff5df;
  font:400 19px/1.42 var(--font-serif)
}

.copy-button {
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:8px 0;
  border:0;
  background:none;
  color:#e6c280;
  font-size:11px;
  cursor:pointer
}

.activity-copy {
  margin:14px 0 0;
  color:rgba(255,255,255,.8);
  font-size:14px;
  line-height:1.65
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
  color:#173b32
}

.done-row.done {
  color:#e6c280
}

.done-row.done .done-check {
  border-color:#e6c280;
  background:#e6c280
}

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
  border-radius:12px;
  object-fit:cover;
  background:#f6f0df
}

.asset-item span {
  font-size:12px;
  line-height:1.25
}

.asset-item small {
  color:#a9bcae;
  font-size:10px
}

.simple-list {
  list-style:none;
  margin:14px 0 0;
  padding:0
}

.simple-list li {
  display:flex;
  align-items:center;
  gap:5px;
  padding:5px 0;
  color:rgba(255,255,255,.82);
  font-size:13px
}

.simple-list i {
  color:#e6c280;
  font-size:16px
}

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

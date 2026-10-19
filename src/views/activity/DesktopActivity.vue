<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDaySheet } from '../../composables/useDaySheet'
import PrintSheet from '../../components/activity/PrintSheet.vue'

const {
  sheet, gap, dayVisual, annexes, preparationDone, chapter, totalDays, dayNumber,
  goBack, goToDay, copied, copyMessage, assetKind, printSheet, printAsset, togglePreparation,
} = useDaySheet()

/* ---- le sceau : même rituel qu'au mobile, mais au clic ---- */
const opened = ref(false)
const cracking = ref(false)

watch(sheet, () => {
  opened.value = false
  cracking.value = false
}, { immediate: true })

function unseal() {
  if (cracking.value || opened.value) return
  cracking.value = true
  window.setTimeout(() => (opened.value = true), 720)
}

/* ---- parallaxe souris : la scène respire, jamais plus de quelques pixels ---- */
const desk = ref<HTMLElement | null>(null)

function onMouse(e: MouseEvent) {
  if (!desk.value || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { innerWidth: w, innerHeight: h } = window
  desk.value.style.setProperty('--px', String((e.clientX / w - 0.5) * 2))
  desk.value.style.setProperty('--py', String((e.clientY / h - 0.5) * 2))
}

/* ---- flèches clavier : feuilleter les dépêches ---- */
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') goToDay(dayNumber.value - 1)
  if (e.key === 'ArrowRight') goToDay(dayNumber.value + 1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <main ref="desk" class="desk" @mousemove.passive="onMouse">
    <!-- la lampe : une flaque de lumière chaude, la scène vit dessous -->
    <i class="desk-lamp" aria-hidden="true" />
    <i class="desk-lamp-glow" aria-hidden="true" />

    <header class="desk-top">
      <button class="desk-back" type="button" @click="goBack">
        <i class="mdi mdi-chevron-left" aria-hidden="true" /> L'expédition
      </button>
      <p class="desk-overline">LA DÉPÊCHE · CHAPITRE {{ chapter.roman }}</p>
      <nav class="desk-nav" aria-label="Feuilleter les dépêches">
        <button type="button" :disabled="dayNumber <= 1" @click="goToDay(dayNumber - 1)">
          <i class="mdi mdi-chevron-left" aria-hidden="true" /> J{{ dayNumber - 1 }}
        </button>
        <span class="desk-nav-day">Jour {{ dayNumber }} <em>/ {{ totalDays }}</em></span>
        <button type="button" :disabled="dayNumber >= totalDays" @click="goToDay(dayNumber + 1)">
          J{{ dayNumber + 1 }} <i class="mdi mdi-chevron-right" aria-hidden="true" />
        </button>
        <button class="desk-print" type="button" title="Imprimer la fiche" @click="printSheet">
          <i class="mdi mdi-printer-outline" aria-hidden="true" />
        </button>
      </nav>
    </header>

    <p class="desk-date">{{ sheet?.date }}</p>

    <!-- L'enveloppe scellée, posée dans la lumière -->
    <section v-if="sheet && !opened" class="desk-stage" aria-label="Dépêche scellée">
      <div class="env-scene" :class="{ 'is-cracking': cracking }">
        <div class="env-body">
          <i class="env-flap" aria-hidden="true" />
          <button class="env-seal" type="button" :disabled="cracking" :aria-label="`Briser le sceau pour lire la fiche du jour ${sheet.day}`" @click="unseal">
            <b>J{{ sheet.day }}</b>
          </button>
          <span class="env-burst" aria-hidden="true"><i v-for="n in 8" :key="n" :style="{ '--a': `${n * 45}deg`, '--dd': `${46 + n * 8}px` }" /></span>
        </div>
        <i class="env-shadow" aria-hidden="true" />
        <p class="env-hint"><i class="mdi mdi-cursor-default-click-outline" aria-hidden="true" /> Cliquez sur la cire pour décacheter la dépêche</p>
      </div>
    </section>

    <!-- Le bureau ouvert : lettre au centre, marges épinglées -->
    <section v-else-if="sheet" class="desk-open" aria-label="Fiche du jour">
      <article class="paper letter" data-depth="10">
        <span class="wax-seal" aria-hidden="true"><b>J{{ sheet.day }}</b></span>
        <span class="postmark" aria-hidden="true"><b>POSTE DU<br />PÔLE NORD</b><small>{{ sheet.date }}</small></span>
        <p class="paper-label">LE MOT DU LUTIN</p>
        <h1 class="letter-title">{{ sheet.title }}</h1>
        <blockquote>{{ sheet.message }}</blockquote>
        <footer class="letter-actions">
          <button type="button" :class="{ copied }" @click="copyMessage">
            <i class="mdi" :class="copied ? 'mdi-check' : 'mdi-content-copy'" aria-hidden="true" /> {{ copied ? 'Copié !' : 'Copier' }}
          </button>
          <button type="button" @click="printSheet"><i class="mdi mdi-printer-outline" aria-hidden="true" /> Imprimer la fiche</button>
        </footer>
      </article>

      <aside class="desk-margins">
        <article class="paper carnet" data-depth="6" :class="{ done: preparationDone }">
          <i class="carnet-pin" aria-hidden="true" />
          <i v-if="preparationDone" class="carnet-stamp" aria-hidden="true"><b>PRÊT</b></i>
          <p class="paper-label dark">LE CARNET SECRET DES LUTINS</p>
          <p class="carnet-copy">{{ sheet.adultPreparation }}</p>
          <button class="done-row" type="button" :class="{ done: preparationDone }" @click="togglePreparation">
            <span class="done-check"><i v-if="preparationDone" class="mdi mdi-check" aria-hidden="true" /></span>
            <span>{{ preparationDone ? 'Tout est prêt' : 'Marquer comme préparé' }}</span>
          </button>
        </article>

        <section v-if="annexes.length" class="paper annexes" data-depth="14" aria-label="Annexes à découper">
          <p class="paper-label dark">LES ANNEXES — À DÉCOUPER</p>
          <div class="desk-stamps">
            <figure v-for="(asset, i) in annexes" :key="asset.file" class="stamp" :style="{ '--r': `${(i % 2 ? 1 : -1) * (1.5 + i * 0.8)}deg` }">
              <a class="stamp-frame" :href="asset.file" target="_blank" rel="noreferrer"><img :src="asset.file" :alt="asset.label" loading="lazy"></a>
              <figcaption>{{ asset.label }}<small>{{ asset.page ? `Annexe · p. ${asset.page}` : 'Visuel du jour' }} — {{ assetKind(asset.label) }}</small></figcaption>
              <div class="stamp-actions">
                <button type="button" @click="printAsset(asset.file)"><i class="mdi mdi-printer" aria-hidden="true" /> Imprimer</button>
                <a :href="asset.file" download><i class="mdi mdi-download" aria-hidden="true" /></a>
              </div>
            </figure>
          </div>
        </section>

        <article v-if="sheet.gifts.length" class="paper slip" data-depth="4" aria-label="À glisser dans la scène">
          <p class="paper-label dark">À GLISSER DANS LA SCÈNE</p>
          <ul>
            <li v-for="gift in sheet.gifts" :key="gift"><b aria-hidden="true">✳</b>{{ gift }}</li>
          </ul>
        </article>

        <aside v-if="gap && !dayVisual" class="gap-note" aria-label="Élément à produire">
          <i class="mdi mdi-pencil-outline" aria-hidden="true" />
          <div><strong>Visuel de scène à créer</strong><p>{{ gap.detail }}</p></div>
        </aside>
      </aside>
    </section>

    <section v-else class="desk-stage">
      <p class="desk-missing">Fiche introuvable</p>
    </section>

    <p class="desk-keys" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> feuilleter les dépêches</p>

    <PrintSheet v-if="sheet" :sheet="sheet" :annexes="annexes" />
  </main>
</template>

<style scoped>
/* ================= la scène de bureau ================= */
.desk {
  --px: 0;
  --py: 0;
  position: relative;
  min-height: 100svh;
  padding: 0 48px 64px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 90% 55% at 30% -10%, rgba(255,196,96,.14), transparent 55%),
    radial-gradient(ellipse 120% 80% at 50% 120%, #0d211a 0%, #081712 55%, #050f0b 100%);
  color: #f2ead8;
}

/* la lampe, hors champ : son halo descend sur le bureau */
.desk-lamp {
  position: absolute;
  top: -140px;
  left: 6%;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,205,110,.32), rgba(255,180,80,.1) 45%, transparent 68%);
  filter: blur(18px);
  transform: translate3d(calc(var(--px) * 14px), calc(var(--py) * 8px), 0);
  pointer-events: none;
}
.desk-lamp-glow {
  position: absolute;
  top: -4%;
  left: 9%;
  width: 340px;
  height: 60vh;
  background: linear-gradient(180deg, rgba(255,214,130,.1), transparent 80%);
  clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%);
  pointer-events: none;
}

/* ---------- barre de haut ---------- */
.desk-top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 26px;
}
.desk-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border: 1px solid rgba(241,204,122,.28);
  border-radius: 999px;
  background: transparent;
  color: #cbb98d;
  font-size: 13px;
  cursor: pointer;
  transition: color .3s, border-color .3s, transform .3s;
}
.desk-back:hover {
  color: var(--color-gold);
  border-color: rgba(241,204,122,.6);
  transform: translateX(-2px);
}
.desk-overline {
  margin: 0;
  color: var(--color-gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .22em;
}
.desk-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.desk-nav button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border: 1px solid rgba(241,204,122,.22);
  border-radius: 999px;
  background: rgba(20,40,32,.5);
  color: #cbb98d;
  font-size: 12.5px;
  cursor: pointer;
  transition: all .3s;
}
.desk-nav button:hover:not(:disabled) {
  color: var(--color-gold);
  border-color: rgba(241,204,122,.55);
  background: rgba(30,54,44,.7);
}
.desk-nav button:disabled {
  opacity: .3;
  cursor: default;
}
.desk-nav-day {
  padding: 0 10px;
  font: 500 15px var(--font-serif);
  color: #f5edd9;
}
.desk-nav-day em {
  color: #8fa79a;
  font-size: 12px;
  font-style: normal;
}
.desk-print {
  width: 36px;
  height: 36px;
  justify-content: center;
  padding: 0 !important;
}
.desk-date {
  position: relative;
  z-index: 2;
  margin: 10px 0 0;
  text-align: center;
  color: #a9bcae;
  font-size: 11.5px;
  letter-spacing: .14em;
}

/* ---------- l'enveloppe sous la lampe ---------- */
.desk-stage {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: calc(100svh - 220px);
}
.env-scene {
  display: grid;
  justify-items: center;
  animation: env-settle .9s cubic-bezier(.3,.9,.35,1) .15s both;
}
@keyframes env-settle {
  from { opacity: 0; transform: translateY(26px) rotate(-1.5deg); }
  to { opacity: 1; transform: none; }
}
.env-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: min(560px, 62vw);
  height: 340px;
  padding-bottom: 30px;
  border-radius: 10px 22px 14px 28px / 24px 10px 28px 14px;
  background:
    repeating-linear-gradient(0deg, transparent 0 3px, rgba(90,55,20,.035) 3px 4px),
    linear-gradient(165deg, #dcba8a 0%, #c89d68 58%, #b2854f 100%);
  box-shadow: 0 30px 60px rgba(0,0,0,.55), inset 0 0 0 1px rgba(150,105,50,.45), inset 0 1px 0 rgba(255,240,210,.35);
  transform: translate3d(calc(var(--px) * 8px), calc(var(--py) * 5px), 0);
  transition: transform .5s cubic-bezier(.3,.9,.35,1);
}
.env-scene:hover .env-body {
  transform: translate3d(calc(var(--px) * 8px), calc(var(--py) * 5px - 6px), 0) rotate(-.6deg);
}
.env-flap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 52%;
  background: linear-gradient(180deg, #cfa875 0%, #c09261 100%);
  clip-path: polygon(0 0, 100% 0, 50% 88%);
  border-radius: 10px 22px 0 0;
  box-shadow: inset 0 -1px 0 rgba(120,80,35,.4);
}
.env-seal {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 108px;
  height: 108px;
  margin-bottom: 6px;
  border: 0;
  border-radius: 47% 53% 51% 49% / 52% 48% 52% 48%;
  background:
    radial-gradient(circle at 34% 30%, #e2684a 0%, #b83b2a 46%, #8c2718 100%);
  box-shadow: 0 8px 20px rgba(0,0,0,.5), inset 0 2px 5px rgba(255,190,160,.4), inset 0 -4px 8px rgba(80,15,5,.55);
  color: #ffd9b8;
  font: 600 26px/1 var(--font-serif);
  cursor: pointer;
  transition: transform .4s var(--spring), filter .4s;
}
.env-seal:hover {
  transform: scale(1.06) rotate(-2deg);
  filter: brightness(1.1);
}
.env-seal:active {
  transform: scale(.94);
}
.env-seal::after {
  content: '';
  position: absolute;
  inset: 9px;
  border: 1.5px dashed rgba(255,220,190,.5);
  border-radius: inherit;
}
.is-cracking .env-seal {
  animation: seal-pop .55s ease-out forwards;
}
@keyframes seal-pop {
  40% { transform: scale(1.16); filter: brightness(1.3); }
  100% { transform: scale(0); opacity: 0; }
}
.is-cracking .env-body {
  animation: env-sink .7s ease-in .1s forwards;
}
@keyframes env-sink {
  to { transform: translateY(46px); opacity: 0; }
}
.env-burst {
  position: absolute;
  z-index: 3;
  width: 0;
  height: 0;
  bottom: 96px;
  pointer-events: none;
}
.env-burst i {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: #c0392b;
  opacity: 0;
}
.is-cracking .env-burst i {
  animation: shard .6s ease-out .08s forwards;
}
@keyframes shard {
  0% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(calc(var(--dd) * -1)) rotate(80deg); }
}
.env-shadow {
  width: 78%;
  height: 26px;
  margin-top: -4px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%);
  filter: blur(6px);
}
.env-hint {
  margin-top: 26px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #cbb98d;
  font-size: 12.5px;
  letter-spacing: .06em;
  opacity: .8;
}
.env-hint i { color: var(--color-gold); }

/* ---------- le bureau ouvert ---------- */
.desk-open {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 380px);
  gap: 40px;
  max-width: 1240px;
  margin: 34px auto 0;
  align-items: start;
}

/* papier commun : même texture que le mobile, échelle bureau */
.paper {
  position: relative;
  border-radius: 6px 20px 10px 26px / 20px 8px 26px 10px;
  background:
    radial-gradient(ellipse 60% 40% at 18% 10%, rgba(255,252,238,.75), transparent 60%),
    repeating-linear-gradient(0deg, transparent 0 3px, rgba(110,72,26,.03) 3px 4px),
    linear-gradient(158deg, #f4ead2 0%, #ead9b4 58%, #dcc593 100%);
  box-shadow: 0 26px 54px rgba(0,0,0,.5), inset 0 0 0 1px rgba(150,110,50,.3), inset 0 0 30px rgba(120,78,28,.14);
  color: #43331c;
  transform: translate3d(calc(var(--px) * var(--dx, 6px)), calc(var(--py) * var(--dy, 4px)), 0);
  transition: transform .5s cubic-bezier(.3,.9,.35,1);
}
[data-depth="10"] { --dx: 10px; --dy: 6px; }
[data-depth="6"] { --dx: 6px; --dy: 4px; }
[data-depth="14"] { --dx: 14px; --dy: 9px; }
[data-depth="4"] { --dx: 4px; --dy: 3px; }

.paper-label {
  margin: 0;
  color: #8a6a2f;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .18em;
}

/* la lettre */
.letter {
  padding: 52px 56px 30px;
  animation: letter-unfold .9s cubic-bezier(.25,.9,.3,1) .1s both;
  transform-origin: 50% 0;
}
@keyframes letter-unfold {
  from { opacity: 0; transform: perspective(1200px) rotateX(-28deg) translateY(-24px); }
  to { opacity: 1; transform: perspective(1200px) none; }
}
.wax-seal {
  position: absolute;
  top: -26px;
  right: 44px;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 47% 53% 51% 49% / 52% 48% 52% 48%;
  background: radial-gradient(circle at 34% 30%, #e2684a 0%, #b83b2a 46%, #8c2718 100%);
  box-shadow: 0 6px 14px rgba(0,0,0,.4), inset 0 2px 4px rgba(255,190,160,.4);
  color: #ffd9b8;
  font: 600 15px/1 var(--font-serif);
  transform: rotate(8deg);
}
.postmark {
  position: absolute;
  top: 20px;
  left: 40px;
  display: grid;
  justify-items: center;
  gap: 2px;
  color: rgba(90,60,25,.55);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .14em;
  text-align: center;
  transform: rotate(-9deg);
}
.postmark b { font-size: 9px; }
.letter-title {
  margin: 8px 0 18px;
  font: 500 34px/1.05 var(--font-serif);
  color: #33260f;
}
.letter blockquote {
  margin: 0;
  white-space: pre-line;
  font: italic 500 19px/1.75 var(--font-literary);
  color: #4a3a20;
}
.letter-actions {
  display: flex;
  gap: 10px;
  margin-top: 26px;
  padding-top: 16px;
  border-top: 1px solid rgba(140,105,45,.3);
}
.letter-actions button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border: 1px solid rgba(140,105,45,.4);
  border-radius: 999px;
  background: transparent;
  color: #6d5220;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all .3s;
}
.letter-actions button:hover {
  background: rgba(140,105,45,.12);
  border-color: rgba(140,105,45,.7);
}
.letter-actions button.copied {
  color: #2f6b3a;
  border-color: #2f6b3a;
}

/* la marge : carnet, timbres, bande */
.desk-margins {
  display: grid;
  gap: 22px;
}
.carnet {
  padding: 26px 24px 18px;
  transform: rotate(.8deg) translate3d(calc(var(--px) * var(--dx, 6px)), calc(var(--py) * var(--dy, 4px)), 0);
  animation: margin-in .7s cubic-bezier(.3,.9,.35,1) .3s both;
}
.annexes { animation: margin-in .7s cubic-bezier(.3,.9,.35,1) .42s both; padding: 24px 22px 20px; }
.slip { animation: margin-in .7s cubic-bezier(.3,.9,.35,1) .54s both; padding: 20px 22px 16px; transform: rotate(-1.2deg) translate3d(calc(var(--px) * var(--dx, 4px)), calc(var(--py) * var(--dy, 3px)), 0); }
@keyframes margin-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; }
}
.carnet-pin {
  position: absolute;
  top: -9px;
  left: 50%;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f7e6b8, #b98a3e);
  box-shadow: 0 3px 6px rgba(0,0,0,.4);
  transform: translateX(-50%);
}
.carnet-stamp {
  position: absolute;
  top: 12px;
  right: 16px;
  padding: 4px 8px;
  border: 1.5px solid rgba(50,110,60,.55);
  border-radius: 4px;
  color: #2f6b3a;
  font: 700 9px var(--font-sans);
  letter-spacing: .14em;
  transform: rotate(9deg);
}
.carnet-copy {
  margin: 12px 0 14px;
  font: 500 14.5px/1.6 var(--font-literary);
}
.done-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 0 4px;
  border: 0;
  border-top: 1px solid rgba(140,105,45,.3);
  background: none;
  color: #6d5220;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.done-check {
  display: grid;
  place-items: center;
  width: 19px;
  height: 19px;
  border: 1.5px solid rgba(140,105,45,.6);
  border-radius: 50%;
  color: #2f6b3a;
}
.done-row.done .done-check {
  background: rgba(50,110,60,.18);
  border-color: #2f6b3a;
}

/* timbres éparpillés */
.desk-stamps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 14px;
}
.stamp {
  margin: 0;
  display: grid;
  gap: 6px;
  transform: rotate(var(--r));
  transition: transform .35s var(--spring);
}
.stamp:hover {
  transform: rotate(0deg) scale(1.04);
  z-index: 2;
}
.stamp-frame {
  display: block;
  padding: 7px;
  background: #fdf8ea;
  border-radius: 3px;
  box-shadow: 0 8px 18px rgba(0,0,0,.35), inset 0 0 0 1px rgba(140,105,45,.3);
}
.stamp-frame img {
  display: block;
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 2px;
}
.stamp figcaption {
  font-size: 10.5px;
  font-weight: 600;
  color: #5c4620;
  text-align: center;
}
.stamp figcaption small {
  display: block;
  font-weight: 400;
  color: #8a6f3a;
}
.stamp-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
}
.stamp-actions button, .stamp-actions a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid rgba(140,105,45,.35);
  border-radius: 999px;
  background: rgba(255,250,235,.5);
  color: #6d5220;
  font-size: 10.5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all .25s;
}
.stamp-actions button:hover, .stamp-actions a:hover {
  background: rgba(140,105,45,.15);
}
.stamp-actions a {
  padding: 5px 9px;
}

/* la bande déchirée */
.slip ul {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 7px 16px;
}
.slip li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: italic 500 13px var(--font-literary);
  color: #4a3a20;
}
.slip li b { color: #a67d34; font-style: normal; }

/* la note à produire */
.gap-note {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed rgba(241,204,122,.35);
  border-radius: 14px;
  color: #e6d5af;
  font-size: 12px;
  animation: margin-in .7s cubic-bezier(.3,.9,.35,1) .62s both;
}
.gap-note i { color: var(--color-gold); }
.gap-note strong { font-size: 12px; }
.gap-note p {
  margin: 3px 0 0;
  color: rgba(230,214,175,.7);
  font: italic 500 11.5px/1.5 var(--font-literary);
}

.desk-missing {
  color: #a9bcae;
  font: 500 22px var(--font-serif);
}

.desk-keys {
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(169,188,174,.55);
  font-size: 11px;
  letter-spacing: .06em;
  pointer-events: none;
}
.desk-keys kbd {
  padding: 3px 7px;
  border: 1px solid rgba(241,204,122,.25);
  border-radius: 5px;
  font-family: inherit;
}

/* focus clavier */
button:focus-visible, a:focus-visible {
  outline: 2px solid #ffe9a8;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .env-scene, .letter, .carnet, .annexes, .slip, .gap-note { animation: none; }
  .env-body, .paper { transform: none !important; transition: none; }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentAdventure } from '../data/adventure'
import { haptic } from '../utils/haptics'

const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/home')
}

type ActionKey = 'scene' | 'print' | 'write' | 'gather'

const completed = ref<Record<ActionKey, boolean>>({ scene: false, print: false, write: false, gather: false })
const doneCount = computed(() => Object.values(completed.value).filter(Boolean).length)
const isReady = computed(() => doneCount.value === 4)

function toggle(key: ActionKey) {
  completed.value[key] = !completed.value[key]
  haptic(10)
}
</script>

<template>
  <main class="today-screen">
    <header class="today-header">
      <button class="back-link" type="button" @click="goBack"><i class="mdi mdi-chevron-left" aria-hidden="true" /> Retour</button>
      <p class="today-overline">JOUR {{ currentAdventure.currentDay }} · AUJOURD’HUI</p>
      <h1>{{ currentAdventure.currentTitle }}</h1>
      <p class="today-intro">{{ currentAdventure.currentDescription }}</p>
    </header>

    <section class="today-progress" aria-label="Progression de la préparation">
      <span><strong>{{ doneCount }}/4</strong> actions terminées</span><div><i :style="{ width: `${doneCount * 25}%` }" /></div>
    </section>

    <section class="today-actions" aria-labelledby="actions-title">
      <div class="today-section-heading"><p class="today-overline">LE MINIMUM POUR CE SOIR</p><h2 id="actions-title">À faire aujourd’hui</h2></div>
      <button class="today-action" :class="{ done: completed.scene }" type="button" @click="toggle('scene')"><span class="today-action-icon"><i class="mdi mdi-email-outline" aria-hidden="true" /></span><span><strong>Préparer le courrier</strong><small>Le premier signal du voyage</small></span><i class="mdi" :class="completed.scene ? 'mdi-check-circle' : 'mdi-chevron-right'" aria-hidden="true" /></button>
      <button class="today-action" :class="{ done: completed.write }" type="button" @click="toggle('write')"><span class="today-action-icon"><i class="mdi mdi-pencil-outline" aria-hidden="true" /></span><span><strong>Écrire le message</strong><small>Texte à personnaliser</small></span><i class="mdi" :class="completed.write ? 'mdi-check-circle' : 'mdi-chevron-right'" aria-hidden="true" /></button>
    </section>

    <section class="today-resource" aria-labelledby="print-title"><div class="today-section-heading"><p class="today-overline">SUPPORT</p><h2 id="print-title">À imprimer</h2></div><div class="resource-row"><span class="resource-icon"><i class="mdi mdi-printer-outline" aria-hidden="true" /></span><span><strong>Support du courrier du Pôle Nord</strong><small>Le contenu du kit sera disponible ici</small></span><button type="button" aria-label="Ouvrir le support à imprimer"><i class="mdi mdi-arrow-up-right" aria-hidden="true" /></button></div><button class="check-resource" :class="{ done: completed.print }" type="button" @click="toggle('print')"><i class="mdi" :class="completed.print ? 'mdi-check-circle' : 'mdi-circle-outline'" aria-hidden="true" /> {{ completed.print ? 'Support marqué comme imprimé' : 'Marquer comme imprimé' }}</button></section>

    <section class="today-resource" aria-labelledby="gather-title"><div class="today-section-heading"><p class="today-overline">AVANT DE COMMENCER</p><h2 id="gather-title">À rassembler</h2></div><div class="gather-list"><span><i class="mdi mdi-email-outline" aria-hidden="true" /> Une enveloppe</span><span><i class="mdi mdi-file-document-outline" aria-hidden="true" /> Le courrier</span></div><button class="check-resource" :class="{ done: completed.gather }" type="button" @click="toggle('gather')"><i class="mdi" :class="completed.gather ? 'mdi-check-circle' : 'mdi-circle-outline'" aria-hidden="true" /> {{ completed.gather ? 'Tout est rassemblé' : 'Marquer comme rassemblé' }}</button></section>

    <section class="today-footer"><p v-if="!isReady">Pas besoin de tout faire maintenant. L’essentiel est de préparer le premier courrier.</p><p v-else>La journée est prête. Le voyage peut commencer.</p><RouterLink to="/planning">Parcourir les 70 jours <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink></section>
  </main>
</template>

<style scoped>
.today-screen  {
  min-height:100svh;
  max-width:540px;
  margin:auto;
  padding:calc(22px + env(safe-area-inset-top)) 22px calc(92px + env(safe-area-inset-bottom));
  background:var(--color-night);
  color:#fff
}

.today-header  {
  padding-top:4px
}

.back-link  {
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:0;
  border:0;
  background:none;
  color:var(--color-gold);
  font-family:inherit;
  font-size:12px;
  cursor:pointer;
  text-decoration:none
}

.today-overline  {
  margin:0;
  color:var(--color-gold);
  font-size:9px;
  font-weight:700;
  letter-spacing:.18em
}

.today-header>.today-overline  {
  margin-top:30px
}

.today-header h1  {
  margin:8px 0 8px;
  font:500 38px/.95 var(--font-serif);
  color:#f8f0dd;
  letter-spacing:-.04em
}

.today-intro  {
  max-width:320px;
  margin:0;
  color:#a9bcae;
  font-size:14px;
  line-height:1.5
}

.today-progress  {
  margin:26px 0 30px;
  padding:14px 0;
  border-top:1px solid rgba(255,255,255,.12);
  border-bottom:1px solid rgba(255,255,255,.12);
  color:#a9bcae;
  font-size:11px
}

.today-progress strong  {
  color:#f5d78f;
  font-weight:600
}

.today-progress div  {
  height:4px;
  margin-top:9px;
  background:rgba(255,255,255,.12);
  border-radius:8px;
  overflow:hidden
}

.today-progress i  {
  display:block;
  height:100%;
  background:#e6c280;
  border-radius:8px;
  transition:width .25s
}

.today-section-heading h2  {
  margin:6px 0 14px;
  font:500 25px var(--font-serif);
  color:#f5edd9
}

.today-action,.resource-row  {
  display:flex;
  align-items:center;
  gap:12px;
  width:100%;
  padding:14px 0;
  border:0;
  border-bottom:1px solid rgba(255,255,255,.08);
  background:transparent;
  color:#fff;
  text-align:left
}

.today-action-icon,.resource-icon  {
  display:grid;
  place-items:center;
  flex:0 0 auto;
  width:38px;
  height:38px;
  border:1px solid rgba(241,204,122,.3);
  border-radius:12px;
  color:var(--color-gold)
}

.today-action>span:nth-child(2),.resource-row>span:nth-child(2)  {
  flex:1;
  display:grid;
  gap:3px
}

.today-action strong,.resource-row strong  {
  font-size:14px;
  font-weight:600
}

.today-action small,.resource-row small  {
  font-size:11px;
  color:rgba(255,255,255,.5)
}

.today-action>.mdi:last-child,.resource-row button  {
  color:rgba(255,255,255,.55);
  font-size:18px
}

.today-action.done strong  {
  color:rgba(255,255,255,.48);
  text-decoration:line-through
}

.today-action.done .today-action-icon  {
  background:#e6c280;
  color:#173b32
}

.today-resource  {
  margin-top:30px
}

.resource-row button  {
  border:0;
  background:none
}

.check-resource  {
  display:inline-flex;
  align-items:center;
  gap:7px;
  margin-top:13px;
  border:0;
  background:none;
  color:#e6c280;
  font-size:11px
}

.check-resource.done  {
  color:#9ebca3
}

.gather-list  {
  display:flex;
  flex-wrap:wrap;
  gap:8px
}

.gather-list span  {
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:9px 11px;
  border-radius:10px;
  background:rgba(255,255,255,.07);
  color:#dce3d9;
  font-size:12px
}

.gather-list i  {
  color:var(--color-gold)
}

.today-footer  {
  margin-top:34px;
  padding-top:18px;
  border-top:1px solid rgba(255,255,255,.1)
}

.today-footer p  {
  margin:0;
  color:#849b8d;
  font-size:12px;
  line-height:1.5
}

.today-footer a  {
  display:inline-flex;
  align-items:center;
  gap:7px;
  margin-top:15px;
  color:var(--color-gold);
  font-size:12px;
  text-decoration:none
}

</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MagicSeal from '../components/MagicSeal.vue'

const router = useRouter()

function enter() {
  sessionStorage.setItem('lutins-unlocked', '1')
  router.push('/')
}
</script>

<template>
  <main class="opening-screen">
    <img class="opening-image" src="/assets/created/arrival-mobile-hero.png" alt="Un lutin se prépare à commencer son aventure de Noël" />
    <div class="opening-overlay" />
    <section class="opening-copy">
      <p class="opening-chapter"><i /> UNE HISTOIRE À VIVRE <i /></p>
      <p class="opening-kicker">L’aventure de Louis</p>
      <h1>La magie<br /><em>commence ici.</em></h1>
      <p class="opening-subtitle">Un voyage de lutins, pensé pour votre famille.</p>
    </section>
    <section class="opening-entry" aria-label="Entrer dans l’aventure">
      <MagicSeal @unlocked="enter" />
    </section>
  </main>
</template>

<style scoped>
.opening-screen{position:relative;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;min-height:100svh;max-width:540px;margin:auto;padding-bottom:calc(22px + env(safe-area-inset-bottom));overflow:hidden;background:var(--color-forest-deep);color:#fff}
.opening-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:58% 78%;filter:brightness(1.09) contrast(1.06) saturate(1.04)}
.opening-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,18,15,.72) 0%,rgba(4,18,15,.36) 48%,rgba(4,18,15,.08) 78%),linear-gradient(180deg,rgba(7,26,22,.62) 0%,rgba(7,26,22,.08) 42%,rgba(7,26,22,.78) 100%)}

.opening-copy{position:relative;z-index:1;grid-row:2;align-self:start;padding:clamp(28px,6vh,58px) 28px 24px}
.opening-chapter{display:flex;align-items:center;gap:9px;margin-bottom:30px;color:var(--color-gold);font-size:8px;font-weight:700;letter-spacing:.24em;opacity:.82}
.opening-chapter i{width:22px;height:1px;background:var(--color-gold)}
.opening-kicker{max-width:310px;margin:0 0 8px;font-size:14px;letter-spacing:.01em;color:#fff;opacity:.92}
.opening-copy h1{max-width:300px;margin:0;font:500 clamp(40px,10vw,58px)/.93 var(--font-serif);letter-spacing:-.065em}
.opening-copy h1 em{color:var(--color-gold);font-style:italic}
.opening-subtitle{max-width:235px;margin:22px 0 0;font-size:14px;line-height:1.4;color:#fff;opacity:.82}

.opening-entry{position:relative;z-index:1;grid-row:3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;margin:0 28px}

@media(min-width:700px){
  .opening-screen{box-shadow:0 0 80px #0008}
}
@media(max-width:380px){
  .opening-image{object-position:58% 74%}
  .opening-copy{padding-right:24px;padding-left:24px}
  .opening-copy h1{font-size:40px}
}
@media(max-height:700px){
  .opening-copy{padding-top:24px;padding-bottom:16px}
  .opening-subtitle{margin-top:20px}
}
</style>

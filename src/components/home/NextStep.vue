<script setup lang="ts">
import { currentAdventure } from '../../data/adventure'
</script>

<template>
  <section class="home-next">
    <div class="next-art">
      <img src="/assets/created/journey-station.png" alt="La traversée des lutins" /><span class="next-tag">LA PROCHAINE HALTE</span>
      <span class="next-postmark" aria-hidden="true">POSTE DU<br />PÔLE NORD</span>
    </div>
    <span class="next-seal" aria-hidden="true"><b>J{{ currentAdventure.currentDay }}</b></span>
    <div class="next-copy">
      <p class="home-overline">LA DÉPÊCHE DU JOUR</p>
      <h2>{{ currentAdventure.currentTitle }}</h2>
      <p>{{ currentAdventure.currentDescription }}</p>
      <RouterLink class="next-cta" to="/aujourdhui">Ouvrir la dépêche <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-next  {
  position:relative;
  display:grid;
  grid-template-columns:38% 62%;
  margin-top:26px;
  overflow:visible;
  border:1px solid transparent;
  border-radius:22px;
  background:
    linear-gradient(150deg,#1a3128 0%,#102219 55%,#0c1b14 100%) padding-box,
    linear-gradient(150deg,rgba(241,204,122,.45),rgba(241,204,122,.1) 40%,rgba(241,204,122,.25)) border-box;
  box-shadow:0 18px 42px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,244,214,.08)
}

.next-art  {
  position:relative;
  min-height:196px;
  border-radius:21px 0 0 21px;
  overflow:hidden
}

.next-art img  {
  width:100%;
  height:100%;
  object-fit:cover;
  filter:brightness(1.02) saturate(1.06)
}

.next-art::after  {
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(90deg,transparent 50%,rgba(14,36,29,.7))
}

.next-tag  {
  position:absolute;
  z-index:1;
  left:10px;
  top:10px;
  padding:5px 7px;
  border-radius:6px;
  background:rgba(10,28,20,.82);
  color:var(--color-gold);
  font-size:8px;
  letter-spacing:.13em
}

/* tampon postal de la dépêche, écho à la lettre du lutin */
.next-postmark  {
  position:absolute;
  z-index:1;
  right:8px;
  bottom:10px;
  padding:5px 7px;
  border:1.5px solid rgba(255,240,210,.5);
  border-radius:4px;
  color:rgba(255,240,210,.75);
  font-size:6px;
  font-weight:700;
  letter-spacing:.14em;
  line-height:1.5;
  text-align:center;
  transform:rotate(-8deg);
  mix-blend-mode:screen
}

/* mini cachet de cire sur le coin supérieur gauche de la dépêche */
.next-seal  {
  position:absolute;
  z-index:2;
  left:16px;
  top:-11px;
  display:grid;
  place-items:center;
  width:38px;
  height:38px;
  border-radius:46% 54% 50% 50%/52% 47% 55% 45%;
  background:radial-gradient(circle at 34% 28%,#c1503a,#8a2b1a 52%,#5e150c 85%);
  box-shadow:0 5px 10px rgba(0,0,0,.5),inset 0 1px 3px rgba(255,255,255,.3),inset 0 -3px 6px rgba(0,0,0,.4);
  transform:rotate(-6deg)
}

.next-seal::before  {
  content:'';
  position:absolute;
  inset:4px;
  border:1.5px solid rgba(255,222,190,.32);
  border-radius:52% 48% 55% 45%/48% 53% 47% 52%
}

.next-seal b  {
  color:#f4d8c0;
  font:700 12px/1 var(--font-literary);
  text-shadow:0 -1px 1px rgba(0,0,0,.5)
}

.next-copy  {
  display:flex;
  flex-direction:column;
  justify-content:center;
  padding:20px 18px 20px 26px
}

.next-copy h2  {
  margin:7px 0 6px;
  font:500 21px/1.05 var(--font-serif);
  color:#f5edd9
}

.next-copy p:not(.home-overline)  {
  margin:0;
  color:#a9bcae;
  font-size:12px;
  line-height:1.5
}

/* bouton-cire : le langage du sceau réduit à un geste */
.next-cta  {
  display:inline-flex;
  align-items:center;
  align-self:flex-start;
  gap:9px;
  margin-top:16px;
  padding:9px 8px 9px 16px;
  border-radius:999px;
  background:radial-gradient(circle at 32% 28%,#ffe9a8 0%,#ecc985 52%,#b08a45 100%);
  color:#3a2d18;
  font-size:12px;
  font-weight:700;
  letter-spacing:.01em;
  text-decoration:none;
  box-shadow:0 7px 20px rgba(230,194,128,.35),inset 0 1px 0 rgba(255,255,255,.5),inset 0 -2px 4px rgba(120,80,20,.25);
  transition:transform .35s var(--spring),box-shadow .2s ease
}

.next-cta i  {
  display:grid;
  place-items:center;
  width:24px;
  height:24px;
  border-radius:50%;
  background:rgba(58,45,24,.14);
  color:#3a2d18;
  font-size:14px;
  transition:transform .2s ease
}

.next-cta:hover  {
  transform:translateY(-1px);
  box-shadow:0 10px 24px rgba(230,194,128,.45),inset 0 1px 0 rgba(255,255,255,.5),inset 0 -2px 4px rgba(120,80,20,.25)
}

.next-cta:hover i  {
  transform:translateX(2px)
}

.next-cta:active  {
  transform:scale(.96)
}
</style>

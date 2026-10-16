<template>
  <section class="home-next">
    <div class="next-art">
      <img src="/assets/created/journey-station.png" alt="Le trajet des lutins" /><span class="next-tag">PROCHAINE ÉTAPE</span>
    </div>
    <div class="next-copy">
      <p class="home-overline">À PRÉPARER AUJOURD’HUI</p>
      <h2>Alerte du Pôle Nord</h2>
      <p>Un premier courrier donne le signal du départ.</p>
      <RouterLink class="next-cta" to="/aujourdhui">Ouvrir la journée <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-next  {
  display:grid;
  grid-template-columns:38% 62%;
  margin-top:26px;
  overflow:hidden;
  border:1px solid rgba(241,204,122,.3);
  border-radius:22px;
  background:linear-gradient(150deg,rgba(255,255,255,.05),transparent 45%),rgba(10,28,20,.82);
  backdrop-filter:blur(16px);
  box-shadow:0 14px 36px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.09)
}

.next-art  {
  position:relative;
  min-height:180px
}

.next-art img  {
  width:100%;
  height:100%;
  object-fit:cover
}

.next-art::after  {
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(90deg,transparent 55%,rgba(14,36,29,.55))
}

.next-tag  {
  position:absolute;
  z-index:1;
  left:10px;
  top:10px;
  padding:5px 7px;
  border-radius:6px;
  background:rgba(10,28,20,.78);
  color:var(--color-gold);
  font-size:8px;
  letter-spacing:.13em;
  backdrop-filter:blur(6px)
}

.next-copy  {
  display:flex;
  flex-direction:column;
  justify-content:center;
  padding:18px 16px
}

.next-copy h2  {
  margin:7px 0 6px;
  font:500 21px/1 var(--font-serif);
  color:#f5edd9
}

.next-copy p:not(.home-overline)  {
  margin:0;
  color:#a9bcae;
  font-size:12px;
  line-height:1.5
}

.next-cta  {
  display:inline-flex;
  align-items:center;
  align-self:flex-start;
  gap:9px;
  margin-top:16px;
  padding:9px 8px 9px 16px;
  border-radius:999px;
  background:linear-gradient(135deg,#f1cc7a,#e6c280);
  color:#173b32;
  font-size:12px;
  font-weight:700;
  letter-spacing:.01em;
  text-decoration:none;
  box-shadow:0 6px 18px rgba(230,194,128,.3),inset 0 1px 0 rgba(255,255,255,.45);
  transition:transform .35s var(--spring),box-shadow .2s ease
}

.next-cta i  {
  display:grid;
  place-items:center;
  width:24px;
  height:24px;
  border-radius:50%;
  background:rgba(23,59,50,.16);
  color:#173b32;
  font-size:14px;
  transition:transform .2s ease
}

.next-cta:hover  {
  transform:translateY(-1px);
  box-shadow:0 9px 22px rgba(230,194,128,.4),inset 0 1px 0 rgba(255,255,255,.45)
}

.next-cta:hover i  {
  transform:translateX(2px)
}

.next-cta:active  {
  transform:scale(.97)
}

</style>

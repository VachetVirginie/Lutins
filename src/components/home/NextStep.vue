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
  border:1px solid rgba(241,204,122,.24);
  border-radius:22px;
  background:rgba(255,255,255,.05);
  backdrop-filter:blur(16px);
  box-shadow:0 14px 36px rgba(0,0,0,.28)
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
  color:#f1cc7a;
  font-size:12px;
  font-weight:600;
  letter-spacing:.01em;
  text-decoration:none;
  transition:color .2s ease
}

.next-cta i  {
  display:grid;
  place-items:center;
  width:27px;
  height:27px;
  border-radius:50%;
  color:#e6c280;
  font-size:14px;
  transition:transform .2s ease
}

.next-cta:hover  {
  color:#fff4d7
}

.next-cta:hover i  {
  transform:translate(2px,-2px)
}

.next-cta:active i  {
  transform:scale(.94)
}

</style>

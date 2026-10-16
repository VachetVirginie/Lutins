<template>
  <section class="home-next">
    <div class="next-art">
      <img src="/assets/created/journey-station.png" alt="Le trajet des lutins" /><span>PROCHAINE ÉTAPE</span>
    </div>
    <div class="next-copy">
      <p class="home-overline">À DÉCOUVRIR BIENTÔT</p>
      <h2>L’arrivée du premier lutin</h2>
      <p>Le voyage touche à sa fin. Les farces quotidiennes vont commencer.</p>
      <button type="button">Ouvrir le planning <v-icon icon="mdi-arrow-right" size="16" /></button>
    </div>
  </section>
</template>

<style scoped>
.home-next{display:grid;grid-template-columns:40% 60%;margin-top:30px;overflow:hidden;border-radius:18px;background:var(--color-paper);box-shadow:0 8px 22px #173b3210}
.next-art{position:relative;min-height:170px}
.next-art img{width:100%;height:100%;object-fit:cover}
.next-art span{position:absolute;left:10px;top:10px;color:var(--color-gold);font-size:8px;letter-spacing:.13em}
.next-copy{padding:18px 15px}
.next-copy h2{margin:7px 0;font:500 22px/.95 var(--font-serif)}
.next-copy p:not(.home-overline){margin:0;color:var(--color-muted);font-size:11px;line-height:1.45}
.next-copy button{display:flex;align-items:center;gap:7px;margin-top:14px;border:0;background:none;color:var(--color-gold-deep);font-size:11px}
</style>

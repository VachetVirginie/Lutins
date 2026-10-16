<template>
  <section class="home-next">
    <div class="next-art">
      <img src="/assets/created/journey-station.png" alt="Le trajet des lutins" /><span class="next-tag">PROCHAINE ÉTAPE</span>
    </div>
    <div class="next-copy">
      <p class="home-overline">À DÉCOUVRIR BIENTÔT</p>
      <h2>L’arrivée du premier lutin</h2>
      <p>Le voyage touche à sa fin. Les farces quotidiennes vont commencer.</p>
      <RouterLink class="next-cta" to="/planning">Ouvrir le planning <i class="mdi mdi-chevron-right" aria-hidden="true" /></RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-next{display:grid;grid-template-columns:38% 62%;margin-top:26px;overflow:hidden;border:1px solid rgba(241,204,122,.24);border-radius:22px;background:rgba(255,255,255,.05);backdrop-filter:blur(16px);box-shadow:0 14px 36px rgba(0,0,0,.28)}
.next-art{position:relative;min-height:180px}
.next-art img{width:100%;height:100%;object-fit:cover}
.next-art::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 55%,rgba(14,36,29,.55))}
.next-tag{position:absolute;z-index:1;left:10px;top:10px;padding:5px 7px;border-radius:6px;background:rgba(10,28,20,.78);color:var(--color-gold);font-size:8px;letter-spacing:.13em;backdrop-filter:blur(6px)}
.next-copy{display:flex;flex-direction:column;justify-content:center;padding:18px 16px}
.next-copy h2{margin:7px 0 6px;font:500 21px/1 var(--font-serif);color:#f5edd9}
.next-copy p:not(.home-overline){margin:0;color:#a9bcae;font-size:12px;line-height:1.5}
.next-cta{display:inline-flex;align-items:center;justify-content:center;gap:5px;margin-top:14px;padding:11px 16px;border-radius:999px;background:linear-gradient(180deg,#f5d78f,#d9ac54);color:#1c3a30;font-size:12px;font-weight:700;text-decoration:none;box-shadow:0 8px 20px rgba(217,172,84,.35);transition:transform .2s ease,box-shadow .2s ease}
.next-cta:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(217,172,84,.45)}
.next-cta:active{transform:translateY(0) scale(.98)}
</style>

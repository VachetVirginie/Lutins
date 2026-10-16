<template>
  <section class="home-prep">
    <div class="section-heading">
      <div>
        <p class="home-overline">DANS LES 7 PROCHAINS JOURS</p>
        <h2>À anticiper</h2>
      </div>
      <span>2/5 prêts</span>
    </div>
    <div class="prep-preview">
      <div><v-icon icon="mdi-paperclip" /><strong>Papier cartonné</strong><small>À acheter · dans 3 jours</small></div>
      <div><v-icon icon="mdi-printer-outline" /><strong>Carte du voyage</strong><small>À imprimer · dans 5 jours</small></div>
      <div><v-icon icon="mdi-cookie-outline" /><strong>Biscuits</strong><small>À prévoir · dans 6 jours</small></div>
    </div>
    <button class="prep-link" type="button">Voir toute la préparation <v-icon icon="mdi-arrow-right" size="16" /></button>
  </section>
</template>

<style scoped>
.home-prep{margin-top:30px}
.section-heading{display:flex;align-items:flex-end;justify-content:space-between}
.home-prep h2{margin:6px 0 0;font:500 25px var(--font-serif)}
.section-heading>span{font-size:11px;color:var(--color-gold-deep)}
.prep-preview{margin-top:16px;border-top:1px solid var(--color-line)}
.prep-preview>div{display:grid;grid-template-columns:28px 1fr auto;grid-template-rows:auto auto;align-items:center;column-gap:8px;padding:12px 0;border-bottom:1px solid var(--color-line)}
.prep-preview .v-icon{grid-row:1/3;display:grid;place-items:center;width:28px;height:28px;background:#e9e0d1;border-radius:9px;color:var(--color-gold-deep)}
.prep-preview strong{font-size:12px}
.prep-preview small{grid-column:2;font-size:10px;color:#8a958d}
.prep-preview>div::after{content:'›';grid-column:3;grid-row:1/3;color:var(--color-gold-deep);font-size:20px}
.prep-link{display:flex;align-items:center;gap:7px;margin-top:14px;border:0;background:none;color:var(--color-gold-deep);font-size:11px}
</style>

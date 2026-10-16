<template>
  <section class="home-progress-hero">
    <div class="home-progress-copy">
      <p class="home-overline">DIMANCHE 15 NOVEMBRE</p>
      <h2>Votre histoire<br /><em>est en route.</em></h2>
      <p>Le voyage continue jusqu’à Noël.</p>
    </div>
    <div class="progress-orb"><strong>30</strong><span>/ 70</span><small>JOURS</small></div>
  </section>
</template>

<style scoped>
.home-progress-hero{display:flex;align-items:center;justify-content:space-between;margin:36px -22px 0;padding:27px 26px;background:var(--color-forest);color:#fffaf0}
.home-progress-copy h2{margin:8px 0;font:500 34px/.9 var(--font-serif);letter-spacing:-.06em}
.home-progress-copy h2 em{color:#edc878;font-style:italic}
.home-progress-copy>p:last-child{margin:0;color:#b9c8bf;font-size:12px}
.progress-orb{display:flex;flex-direction:column;align-items:center;justify-content:center;width:98px;height:98px;border:1px solid #edc878;border-radius:50%;color:#edc878}
.progress-orb strong{font:500 34px/.8 var(--font-serif)}
.progress-orb span{font-size:10px;color:#cad7cf}
.progress-orb small{margin-top:6px;font-size:8px;letter-spacing:.15em}
</style>

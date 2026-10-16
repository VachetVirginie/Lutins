<template>
  <section class="story-phase">
    <div class="phase-top">
      <div>
        <p class="home-overline">PHASE ACTUELLE</p>
        <h2>La rencontre</h2>
      </div>
      <span>JOUR 30</span>
    </div>
    <div class="phase-track">
      <i class="phase-track__fill" /><b class="phase-marker phase-marker--active" /><b class="phase-marker phase-marker--next" /><b class="phase-marker phase-marker--end" />
    </div>
    <div class="phase-labels"><span>Le voyage</span><strong>La rencontre</strong><span>Deux lutins</span></div>
  </section>
</template>

<style scoped>
.story-phase{padding:27px 0 0}
.phase-top{display:flex;align-items:flex-end;justify-content:space-between}
.story-phase h2{margin:6px 0 0;font:500 25px var(--font-serif)}
.phase-top>span{font-size:11px;color:var(--color-gold-deep)}
.phase-track{position:relative;height:5px;margin:24px 7px 10px;background:#dfd5c3;border-radius:10px}
.phase-track__fill{position:absolute;inset:0 auto 0 0;width:43%;background:#c89d52;border-radius:10px}
.phase-marker{position:absolute;top:50%;width:12px;height:12px;border:2px solid var(--color-cream);background:#c89d52;border-radius:50%;transform:translate(-50%,-50%)}
.phase-marker--active{left:43%}
.phase-marker--next{left:68%;background:var(--color-cream);border-color:#c89d52}
.phase-marker--end{left:100%;background:var(--color-cream);border-color:#c8bdab}
.phase-labels{display:flex;justify-content:space-between;color:#8a958d;font-size:9px}
.phase-labels strong{color:var(--color-gold-deep)}
</style>

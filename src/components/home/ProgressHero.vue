<template>
  <section class="progress-hero">
    <i class="hero-spark hero-spark--tl" aria-hidden="true" /><i class="hero-spark hero-spark--br" aria-hidden="true" />
    <div class="progress-copy">
      <p class="home-overline">JOUR 1 · DÉBUT DE L’AVENTURE</p>
      <h2>Le voyage<br /><em>commence.</em></h2>
      <p>Une première étape vers Noël.</p>
    </div>
    <div class="progress-orb"><strong>1</strong><span>/ 70</span><small>JOURS</small></div>
  </section>
</template>

<style scoped>
.progress-hero  {
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  padding:24px 22px;
  border:1px solid rgba(241,204,122,.26);
  border-radius:26px;
  background:rgba(255,255,255,.05);
  backdrop-filter:blur(18px);
  box-shadow:0 18px 45px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.08)
}

.progress-copy h2  {
  margin:8px 0 10px;
  font:500 30px/.95 var(--font-serif);
  letter-spacing:-.04em;
  color:#f7efdb
}

.progress-copy h2 em  {
  color:var(--color-gold);
  font-style:italic
}

.progress-copy>p:last-child  {
  margin:0;
  color:#a9bcae;
  font-size:13px;
  line-height:1.45
}

.progress-orb  {
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  width:96px;
  height:96px;
  flex:0 0 auto
}

.progress-orb::before  {
  content:'';
  position:absolute;
  inset:0;
  border-radius:50%;
  background:conic-gradient(var(--color-gold) 43%,rgba(241,204,122,.13) 0);
  mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px));
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px));
  filter:drop-shadow(0 0 5px rgba(241,204,122,.55))
}

.progress-orb strong  {
  font:500 31px/.85 var(--font-serif);
  color:var(--color-gold)
}

.progress-orb span  {
  margin-top:2px;
  font-size:10px;
  color:#9db0a4
}

.progress-orb small  {
  margin-top:5px;
  font-size:8px;
  letter-spacing:.16em;
  color:var(--color-gold);
  opacity:.85
}

.hero-spark  {
  position:absolute;
  width:5px;
  height:5px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 9px #ffd97a;
  animation:hero-twinkle 2.4s ease-in-out infinite
}

.hero-spark--tl  {
  left:-3px;
  top:16px
}

.hero-spark--br  {
  right:-2px;
  bottom:34%;
  animation-delay:1.2s
}

@keyframes hero-twinkle  {
  0%,100%  {
    opacity:.15;
    transform:scale(.7)
  }
  50%  {
    opacity:1;
    transform:scale(1.15)
  }
}

</style>

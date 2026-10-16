<template>
  <section class="story-phase">
    <div class="phase-top">
      <div>
        <p class="home-overline">PHASE ACTUELLE</p>
        <h2>Le voyage<i class="phase-dot" /></h2>
      </div>
      <span>JOUR 1</span>
    </div>
    <div class="phase-track">
      <svg class="phase-wave" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 7 Q6.25 1 12.5 7 T25 7 T37.5 7 T50 7 T62.5 7 T75 7 T87.5 7 T100 7 T112.5 7 T125 7 T137.5 7 T150 7 T162.5 7 T175 7 T187.5 7 T200 7" />
      </svg>
      <i class="phase-fill" />
      <span v-for="n in 11" :key="n" class="phase-dust" aria-hidden="true" />
      <b class="phase-marker phase-marker--done" />
      <b class="phase-marker phase-marker--active"><i class="elf-halo" /><img class="phase-elf" src="/assets/imgs/lutin.png" alt="" /></b>
      <b class="phase-marker phase-marker--next" />
      <b class="phase-marker phase-marker--end" />
    </div>
    <div class="phase-labels"><strong>Le voyage</strong><span>La rencontre</span><span>Les farces</span></div>
  </section>
</template>

<style scoped>
.story-phase{padding:26px 0 0}
.phase-top{display:flex;align-items:flex-end;justify-content:space-between}
.story-phase h2{margin:6px 0 0;font:500 24px var(--font-serif);color:#f5edd9}
.phase-dot{display:inline-block;width:7px;height:7px;margin-left:9px;border-radius:50%;background:var(--color-gold);box-shadow:0 0 7px rgba(241,204,122,.6)}
.phase-top>span{font-size:11px;letter-spacing:.12em;color:var(--color-gold)}

/* base = futur : très fine, sombre, désaturée */
.phase-track{position:relative;height:2px;margin:46px 10px 12px;background:rgba(170,160,110,.14);border-radius:10px}

/* sillage ondulé de points d'or vers la prochaine étape */
.phase-wave{position:absolute;left:38%;right:-2px;top:50%;height:20px;transform:translateY(-50%);overflow:visible;mask:linear-gradient(90deg,transparent 0%,#000 14%,#000 62%,transparent 95%);-webkit-mask:linear-gradient(90deg,transparent 0%,#000 14%,#000 62%,transparent 95%)}
.phase-wave path{fill:none;stroke:rgba(241,204,122,.85);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:.1 9}

/* accompli : épais, chaud, très lumineux */
.phase-fill{
  position:absolute;left:0;top:50%;width:43%;height:6px;transform:translateY(-50%);overflow:hidden;border-radius:10px;
  background:linear-gradient(90deg,rgba(255,215,0,.45) 0%,var(--color-gold) 55%,#ffe9a8 100%);
  box-shadow:0 0 10px rgba(241,204,122,.7),0 0 26px rgba(255,200,80,.4),inset 0 1px 0 rgba(255,242,161,.7);
}
.phase-fill::after{content:'';position:absolute;top:0;bottom:0;left:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);animation:fill-sheen 2.8s ease-in-out infinite}
@keyframes fill-sheen{0%{transform:translateX(-120%)}60%,100%{transform:translateX(280%)}}

/* fairy dust : tailles 1-5px, opacités variables, certaines floues */
.phase-dust{position:absolute;top:50%;width:3px;height:3px;border-radius:50%;background:#ffe9a8;box-shadow:0 0 6px #ffd97a;animation:dust-twinkle 1.7s ease-in-out infinite alternate}
.phase-dust:nth-of-type(1){left:8%;top:45%;width:2px;height:2px;--o:.55}
.phase-dust:nth-of-type(2){left:17%;top:65%;width:3px;height:3px;--o:.75;animation-delay:.5s}
.phase-dust:nth-of-type(3){left:27%;top:30%;width:2px;height:2px;--o:.5;animation-delay:.9s}
.phase-dust:nth-of-type(4){left:35%;top:60%;width:4px;height:4px;--o:.9;animation-delay:.2s}
.phase-dust:nth-of-type(5){left:39%;top:18%;width:3px;height:3px;--o:.85;animation-delay:1.1s}
.phase-dust:nth-of-type(6){left:41.5%;top:80%;width:2px;height:2px;--o:.7;animation-delay:.35s}
.phase-dust:nth-of-type(7){left:44.5%;top:22%;width:5px;height:5px;--o:.95;filter:blur(.6px);animation-delay:.65s}
.phase-dust:nth-of-type(8){left:47%;top:70%;width:2px;height:2px;--o:.6;animation-delay:1.3s}
.phase-dust:nth-of-type(9){left:43%;top:-16px;width:3px;height:3px;--o:.8;animation:spark-rise 2.4s ease-in infinite}
.phase-dust:nth-of-type(10){left:60%;top:40%;width:2px;height:2px;--o:.3;filter:blur(1.2px);animation-delay:.15s}
.phase-dust:nth-of-type(11){left:76%;top:60%;width:1px;height:1px;--o:.22;filter:blur(1.2px);animation-delay:.95s}
@keyframes dust-twinkle{from{opacity:calc(var(--o,1)*.15);transform:scale(.6)}to{opacity:var(--o,1);transform:scale(1.2)}}
@keyframes spark-rise{0%{opacity:0;transform:translateY(6px) scale(.5)}30%{opacity:var(--o,.8)}100%{opacity:0;transform:translateY(-26px) scale(1)}}

.phase-marker{position:absolute;top:50%;width:10px;height:10px;border:2px solid #0e241d;background:var(--color-gold);border-radius:50%;transform:translate(-50%,-50%)}
.phase-marker--done{left:0}
/* nœud actif : ×1.5, irradiation forte */
.phase-marker--active{
  left:43%;width:26px;height:26px;border-width:2.5px;border-color:var(--color-gold);
  background:radial-gradient(circle,#fff 0%,#fff2a1 45%,#ffd75e 100%);
  box-shadow:0 0 0 6px rgba(241,204,122,.15),0 0 18px 6px rgba(255,215,0,.75),0 0 44px 14px rgba(255,190,60,.4);
}
.phase-marker--next{left:70%;width:8px;height:8px;background:#1d332b;border-color:rgba(170,160,110,.35)}
.phase-marker--end{left:100%;width:8px;height:8px;background:#1d332b;border-color:rgba(170,160,110,.28)}

/* halo chaud sous les pieds du lutin */
.elf-halo{position:absolute;left:50%;top:-3px;width:52px;height:18px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(255,215,0,.75),rgba(255,180,60,.25) 55%,transparent 75%);filter:blur(3px);mix-blend-mode:screen}
.phase-elf{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);width:44px;height:auto;filter:brightness(1.12) contrast(1.12) saturate(1.3) drop-shadow(0 4px 5px rgba(0,0,0,.55))}

.phase-labels{display:flex;justify-content:space-between;color:#7d8f85;font-size:10px}
.phase-labels strong{color:var(--color-gold)}
</style>

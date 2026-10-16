<script setup lang="ts">
import { computed } from 'vue'
import { currentAdventure, narrativeMilestones } from '../../data/adventure'

const STEP = 58
const PAD_X = 60
const TOTAL_DAYS = currentAdventure.totalDays
const TRACK_W = PAD_X * 2 + STEP * (TOTAL_DAYS - 1)

const milestoneByDay = new Map<number, string>(narrativeMilestones.map((m) => [m.day, m.title]))

const nodes = computed(() =>
  Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const day = i + 1
    return {
      day,
      title: milestoneByDay.get(day),
      x: PAD_X + i * STEP,
      state: day === currentAdventure.currentDay ? 'active' : day < currentAdventure.currentDay ? 'done' : 'upcoming',
    }
  }),
)

const activeX = computed(() => nodes.value.find((n) => n.state === 'active')?.x ?? PAD_X)

// La vague de points couvre tout le reste de la piste (échelle 1:1, points non déformés)
const waveLen = computed(() => TRACK_W - activeX.value)
const wavePath = computed(() => {
  let d = 'M0 7'
  for (let x = 20; x <= waveLen.value + 20; x += 20) d += ` Q${x - 10} 1 ${x} 7`
  return d
})
</script>

<template>
  <section class="story-phase">
    <div class="phase-top">
      <div>
        <p class="home-overline">PHASE ACTUELLE</p>
        <h2>Le voyage<i class="phase-dot" /></h2>
      </div>
      <span>JOUR {{ currentAdventure.currentDay }}</span>
    </div>

    <div class="phase-scroller">
      <div class="phase-track" :style="{ width: TRACK_W + 'px' }">
        <i class="phase-line" />
        <i class="phase-fill" :style="{ width: activeX + 'px' }" />
        <svg class="phase-wave" :viewBox="`0 0 ${waveLen} 14`" :width="waveLen" height="14" aria-hidden="true" :style="{ left: activeX + 'px' }">
          <path :d="wavePath" />
        </svg>
        <span v-for="n in 8" :key="n" class="phase-dust" aria-hidden="true" />

        <RouterLink
          v-for="n in nodes"
          :key="n.day"
          class="phase-node"
          :class="[`is-${n.state}`, { 'is-milestone': n.title }]"
          :style="{ left: n.x + 'px' }"
          :to="`/activites/jour-${n.day}`"
          :aria-label="`Jour ${n.day}${n.title ? ' · ' + n.title : ''}`"
        >
          <template v-if="n.state === 'active'">
            <i class="elf-halo" aria-hidden="true" />
            <i v-for="s in 3" :key="s" class="elf-spark" :class="`elf-spark--${s}`" aria-hidden="true" />
            <img class="phase-elf" src="/assets/imgs/lutin.png" alt="" />
          </template>
          <b class="node-dot" aria-hidden="true" />
          <span class="node-label"><strong>J{{ n.day }}</strong><em v-if="n.title">{{ n.title }}</em></span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-phase {
  padding:26px 0 0
}

.phase-top {
  display:flex;
  align-items:flex-end;
  justify-content:space-between
}

.story-phase h2 {
  margin:6px 0 0;
  font:500 24px var(--font-serif);
  color:#f5edd9
}

.phase-dot {
  display:inline-block;
  width:7px;
  height:7px;
  margin-left:9px;
  border-radius:50%;
  background:var(--color-gold);
  box-shadow:0 0 7px rgba(241,204,122,.6)
}

.phase-top>span {
  font-size:11px;
  letter-spacing:.12em;
  color:var(--color-gold)
}

/* ---- zone défilable ---- */
.phase-scroller {
  margin:0px -20px 0;
  overflow-x:auto;
  overflow-y:hidden;
  scrollbar-width:none;
  scroll-snap-type:x proximity;
  -webkit-overflow-scrolling:touch;
  mask:linear-gradient(90deg,#000 82%,transparent 99%);
  -webkit-mask:linear-gradient(90deg,#000 82%,transparent 99%)
}

.phase-scroller::-webkit-scrollbar {
  display:none
}

.phase-track {
  position:relative;
  height:150px;
  margin:0 20px
}

/* base = futur : très fine, sombre, désaturée */
.phase-line {
  position:absolute;
  left:0;
  right:0;
  top:70px;
  height:2px;
  background:rgba(170,160,110,.14);
  border-radius:10px
}

/* sillage ondulé de points d'or vers les prochaines étapes */
.phase-wave {
  position:absolute;
  top:63px;
  height:14px;
  overflow:visible;
  mask:linear-gradient(90deg,transparent 0%,#000 4%,#000 96%,transparent 100%);
  -webkit-mask:linear-gradient(90deg,transparent 0%,#000 4%,#000 96%,transparent 100%)
}

.phase-wave path {
  fill:none;
  stroke:rgba(241,204,122,.85);
  stroke-width:2.2;
  stroke-linecap:round;
  stroke-dasharray:.1 9
}

/* accompli : épais, chaud, très lumineux */
.phase-fill {
  position:absolute;
  left:0;
  top:67px;
  height:6px;
  overflow:hidden;
  border-radius:10px;
  background:linear-gradient(90deg,rgba(255,215,0,.45) 0%,var(--color-gold) 55%,#ffe9a8 100%);
  box-shadow:0 0 10px rgba(241,204,122,.7),0 0 26px rgba(255,200,80,.4),inset 0 1px 0 rgba(255,242,161,.7)
}

.phase-fill::after {
  content:'';
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  width:45%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);
  animation:fill-sheen 2.8s ease-in-out infinite
}

@keyframes fill-sheen {
  0% {
    transform:translateX(-120%)
  }
  60%,100% {
    transform:translateX(280%)
  }
}

/* fairy dust autour du nœud actif */
.phase-dust {
  position:absolute;
  top:70px;
  width:3px;
  height:3px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 6px #ffd97a;
  animation:dust-twinkle 1.7s ease-in-out infinite alternate
}

.phase-dust:nth-of-type(1) {
  left:12px;
  margin-top:-8px;
  width:2px;
  height:2px;
  --o:.55
}

.phase-dust:nth-of-type(2) {
  left:60px;
  margin-top:9px;
  --o:.75;
  animation-delay:.5s
}

.phase-dust:nth-of-type(3) {
  left:95px;
  margin-top:-14px;
  width:2px;
  height:2px;
  --o:.5;
  animation-delay:.9s
}

.phase-dust:nth-of-type(4) {
  left:118px;
  margin-top:12px;
  width:4px;
  height:4px;
  --o:.9;
  animation-delay:.2s
}

.phase-dust:nth-of-type(5) {
  left:140px;
  margin-top:-22px;
  --o:.85;
  animation-delay:1.1s
}

.phase-dust:nth-of-type(6) {
  left:70px;
  margin-top:-34px;
  width:2px;
  height:2px;
  --o:.7;
  animation-delay:.35s
}

.phase-dust:nth-of-type(7) {
  left:150px;
  margin-top:20px;
  width:5px;
  height:5px;
  --o:.95;
  filter:blur(.6px);
  animation-delay:.65s
}

.phase-dust:nth-of-type(8) {
  left:34px;
  margin-top:-40px;
  width:3px;
  height:3px;
  --o:.8;
  animation:spark-rise 2.4s ease-in infinite
}

@keyframes dust-twinkle {
  from {
    opacity:calc(var(--o,1)*.15);
    transform:scale(.6)
  }
  to {
    opacity:var(--o,1);
    transform:scale(1.2)
  }
}

@keyframes spark-rise {
  0% {
    opacity:0;
    transform:translateY(6px) scale(.5)
  }
  30% {
    opacity:var(--o,.8)
  }
  100% {
    opacity:0;
    transform:translateY(-26px) scale(1)
  }
}

/* ---- nœuds d'étape ---- */
.phase-node {
  position:absolute;
  top:70px;
  display:flex;
  flex-direction:column;
  align-items:center;
  width:110px;
  margin-left:-55px;
  text-decoration:none;
  scroll-snap-align:center
}

.node-dot {
  width:10px;
  height:10px;
  border:2px solid #0e241d;
  border-radius:50%;
  background:#1d332b;
  border-color:rgba(170,160,110,.35);
  transform:translateY(-50%)
}

.is-done .node-dot {
  background:var(--color-gold);
  border-color:#0e241d;
  box-shadow:0 0 8px rgba(230,194,128,.55)
}

/* nœud actif : ×1.5, irradiation forte */
.is-active .node-dot {
  width:26px;
  height:26px;
  border-width:2.5px;
  border-color:var(--color-gold);
  background:radial-gradient(circle,#fff 0%,#fff2a1 45%,#ffd75e 100%);
  box-shadow:0 0 0 6px rgba(241,204,122,.15),0 0 18px 6px rgba(255,215,0,.75),0 0 44px 14px rgba(255,190,60,.4)
}

.node-label {
  display:grid;
  gap:2px;
  margin-top:14px;
  text-align:center;
  font-size:10px;
  line-height:1.3;
  color:#7d8f85
}

.node-label strong {
  color:rgba(241,204,122,.55);
  font-size:9px;
  letter-spacing:.12em;
  font-weight:600
}

.node-label em {
  font-style:normal;
  font-size:10px;
  color:#c9d6cc
}

.is-milestone .node-dot {
  width:12px;
  height:12px;
  border-color:rgba(241,204,122,.5)
}

.is-milestone .node-label strong {
  color:var(--color-gold)
}

.is-done .node-label strong {
  color:rgba(241,204,122,.8)
}

.is-active .node-label,
.is-active .node-label em {
  color:#f5edd9
}

/* halo chaud sous les pieds du lutin */
.elf-halo {
  position:absolute;
  left:50%;
  top:-14px;
  width:52px;
  height:18px;
  transform:translateX(-50%);
  border-radius:50%;
  background:radial-gradient(ellipse,rgba(255,215,0,.75),rgba(255,180,60,.25) 55%,transparent 75%);
  filter:blur(3px);
  mix-blend-mode:screen;
  animation:halo-breathe 3.4s ease-in-out infinite
}

@keyframes halo-breathe {
  0%,100% {
    transform:translateX(-50%) scale(.92);
    opacity:.75
  }
  50% {
    transform:translateX(-50%) scale(1.12);
    opacity:1
  }
}

/* étincelles en orbite autour du lutin */
.elf-spark {
  position:absolute;
  left:50%;
  top:-30px;
  width:4px;
  height:4px;
  border-radius:50%;
  background:#ffe9a8;
  box-shadow:0 0 7px #ffd97a;
  animation:elf-orbit 5s ease-in-out infinite
}

.elf-spark--2 {
  animation-delay:-1.7s;
  width:3px;
  height:3px
}

.elf-spark--3 {
  animation-delay:-3.4s;
  width:2px;
  height:2px
}

@keyframes elf-orbit {
  0%,100% {
    transform:translate(-28px,4px) scale(.7);
    opacity:.3
  }
  25% {
    transform:translate(-6px,-14px) scale(1.1);
    opacity:1
  }
  50% {
    transform:translate(22px,-8px) scale(.8);
    opacity:.6
  }
  75% {
    transform:translate(-2px,10px) scale(1.15);
    opacity:.95
  }
}

.phase-elf {
  position:absolute;
  left:50%;
  top:-52px;
  transform:translateX(-50%);
  width:44px;
  height:auto;
  filter:brightness(1.12) contrast(1.12) saturate(1.3) drop-shadow(0 4px 5px rgba(0,0,0,.55))
}
</style>

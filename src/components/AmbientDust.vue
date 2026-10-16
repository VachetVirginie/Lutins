<script setup lang="ts">
// Deterministic pseudo-random particles so layout is stable across renders
const particles = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 61 + 13) % 100,
  y: (i * 37 + 23) % 100,
  size: 1.5 + ((i * 7) % 4),
  delay: -((i * 1.7) % 12),
  duration: 9 + (i % 5) * 2.4,
  opacity: 0.25 + ((i * 11) % 60) / 100,
}))

// Orbes bokeh : grandes taches de lumière floues, concentrées vers le haut,
// dérive lente = sensation de profondeur (lucioles / poussière d'étoiles)
const bokeh = Array.from({ length: 7 }, (_, i) => ({
  x: (i * 47 + 11) % 100,
  y: (i * 31 + 4) % 72,
  size: 24 + ((i * 41) % 66),
  delay: -((i * 2.9) % 18),
  duration: 17 + (i % 4) * 6,
  opacity: 0.05 + ((i * 13) % 13) / 100,
}))
</script>

<template>
  <div class="ambient-dust" aria-hidden="true">
    <b
      v-for="(b, i) in bokeh"
      :key="'b' + i"
      class="bokeh"
      :style="{
        left: b.x + '%',
        top: b.y + '%',
        width: b.size + 'px',
        height: b.size + 'px',
        animationDelay: b.delay + 's',
        animationDuration: b.duration + 's',
        '--o': b.opacity,
      }"
    />
    <i
      v-for="(p, i) in particles"
      :key="i"
      :style="{
        left: p.x + '%',
        top: p.y + '%',
        width: p.size + 'px',
        height: p.size + 'px',
        animationDelay: p.delay + 's',
        animationDuration: p.duration + 's',
        '--o': p.opacity,
      }"
    />
  </div>
</template>

<style scoped>
.ambient-dust {
  position:fixed;
  inset:0;
  z-index:60;
  overflow:hidden;
  pointer-events:none
}

.ambient-dust i {
  position:absolute;
  display:block;
  border-radius:50%;
  background:#ffe9a8;
  opacity:var(--o);
  box-shadow:0 0 6px rgba(255,215,0,.7);
  animation:dust-drift ease-in-out infinite
}

.ambient-dust i:nth-of-type(4n) {
  filter:blur(1px)
}

.bokeh {
  position:absolute;
  display:block;
  border-radius:50%;
  background:radial-gradient(circle,rgba(255,216,140,.9) 0%,rgba(255,200,110,.35) 45%,transparent 72%);
  opacity:var(--o);
  filter:blur(14px);
  animation:bokeh-drift ease-in-out infinite
}

.bokeh:nth-of-type(3n) {
  background:radial-gradient(circle,rgba(190,255,210,.55) 0%,rgba(140,220,170,.2) 45%,transparent 72%)
}

@keyframes bokeh-drift {
  0%,100% {
    transform:translate3d(0,0,0) scale(.85);
    opacity:calc(var(--o) * .55)
  }
  50% {
    transform:translate3d(24px,-38px,0) scale(1.12);
    opacity:var(--o)
  }
}

@keyframes dust-drift {
  0%,100% {
    transform:translate3d(0,0,0) scale(.7);
    opacity:calc(var(--o) * .4)
  }
  50% {
    transform:translate3d(10px,-26px,0) scale(1.1);
    opacity:var(--o)
  }
}

@media (prefers-reduced-motion:reduce) {
  .ambient-dust i {
    animation:none
  }
}
</style>

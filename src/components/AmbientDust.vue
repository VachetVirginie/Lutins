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
</script>

<template>
  <div class="ambient-dust" aria-hidden="true">
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

.ambient-dust i:nth-child(4n) {
  filter:blur(1px)
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

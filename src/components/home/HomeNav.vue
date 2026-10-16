<template>
  <nav class="home-nav" aria-label="Navigation principale">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="nav-item">
      <i :class="['mdi', item.icon]" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
const items = [
  { label: 'Aventure', to: '/', icon: 'mdi-compass-rose' },
  { label: 'Aujourd’hui', to: '/aujourdhui', icon: 'mdi-calendar-today' },
  { label: 'À prévoir', to: '/prepare', icon: 'mdi-clipboard-check-outline' },
  { label: 'Souvenirs', to: '/souvenirs', icon: 'mdi-image-multiple-outline' },
]
</script>

<style scoped>
.home-nav{position:fixed;z-index:20;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;grid-template-columns:repeat(4,1fr);gap:2px;width:min(500px,calc(100% - 28px));padding:6px;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:rgba(16,35,28,.78);backdrop-filter:blur(20px);box-shadow:0 14px 40px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.07)}
.nav-item{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:52px;padding:8px 4px;border-radius:18px;color:rgba(255,255,255,.55);font-size:10px;font-weight:500;letter-spacing:.02em;text-decoration:none;transition:background .25s,color .25s}
.nav-item i{font-size:19px}
.nav-item.router-link-exact-active{background:rgba(255,255,255,.13);color:#ffe9a8;font-weight:600}
.nav-item.router-link-exact-active i{color:var(--color-gold);text-shadow:0 0 10px rgba(255,215,0,.6)}
.nav-item.router-link-exact-active::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:14px;height:2px;border-radius:2px;background:#ffe9a8;box-shadow:0 0 8px rgba(255,215,0,.9)}
</style>

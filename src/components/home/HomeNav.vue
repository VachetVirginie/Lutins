<template>
  <nav class="home-nav" aria-label="Navigation principale">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="nav-item">
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
const items = [
  { label: 'Aventure', to: '/home' },
  { label: 'Planning', to: '/planning' },
  { label: 'Préparer', to: '/preparer' },
  { label: 'Souvenirs', to: '/souvenirs' },
]
</script>

<style scoped>
.home-nav{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin-top:18px;padding:4px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:rgba(255,255,255,.05)}
.nav-item{position:relative;display:flex;align-items:center;justify-content:center;min-height:40px;padding:10px 4px;border-radius:16px;color:rgba(255,255,255,.6);font-size:12px;font-weight:500;text-decoration:none;transition:background .25s,color .25s}
.nav-item.router-link-active{background:rgba(255,255,255,.15);color:#fff;font-weight:600}
.nav-item.router-link-active::after{content:'';position:absolute;bottom:5px;left:50%;transform:translateX(-50%);width:16px;height:2px;border-radius:2px;background:#fff;box-shadow:0 0 8px rgba(255,215,0,.9)}
</style>

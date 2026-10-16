<template>
  <nav class="home-nav" aria-label="Navigation principale">
    <button class="active" type="button"><v-icon icon="mdi-sparkles" /><span>Aventure</span></button>
    <button type="button"><v-icon icon="mdi-calendar-blank-outline" /><span>Planning</span></button>
    <button type="button"><v-icon icon="mdi-basket-outline" /><span>Préparer</span></button>
    <button type="button"><v-icon icon="mdi-book-open-page-variant-outline" /><span>Souvenirs</span></button>
  </nav>
</template>

<style scoped>
.home-nav{position:fixed;z-index:4;bottom:0;left:50%;display:grid;grid-template-columns:repeat(4,1fr);width:min(540px,100%);padding:10px 12px calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#fffdf9eb;backdrop-filter:blur(18px);border-top:1px solid #e1d8ca}
.home-nav button{display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:none;color:#a0aaa3;font-size:10px}
.home-nav button.active{color:var(--color-forest)}
.home-nav button.active .v-icon{color:#b4873d}
.home-nav .v-icon{font-size:20px}
</style>

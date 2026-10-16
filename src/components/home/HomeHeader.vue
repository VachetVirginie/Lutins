<template>
  <header class="app-home-header">
    <div>
      <p class="home-overline">MON AVENTURE</p>
      <h1>Bonjour Louis <span>✦</span></h1>
    </div>
    <button class="home-settings" type="button" aria-label="Réglages"><v-icon icon="mdi-tune-variant" size="20" /></button>
  </header>
</template>

<style scoped>
.app-home-header{display:flex;align-items:flex-start;justify-content:space-between}
.app-home-header h1{margin:7px 0 0;font:500 25px var(--font-serif)}
.app-home-header h1 span{color:#c79c50}
.home-settings{display:grid;place-items:center;width:40px;height:40px;border:1px solid #d8cebd;border-radius:50%;background:#fffaf2;color:var(--color-forest)}
</style>

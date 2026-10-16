<template>
  <v-app class="app-shell">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </v-app>
</template>

<style scoped>
.app-shell{background:var(--color-night)!important}

.page-enter-active{transition:opacity .45s ease,transform .5s cubic-bezier(.22,1,.36,1)}
.page-leave-active{transition:opacity .3s ease}
.page-enter-from{opacity:0;transform:scale(1.03)}
.page-leave-to{opacity:0}
</style>

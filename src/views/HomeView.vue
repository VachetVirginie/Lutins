<script setup lang="ts">
import { HomeHeader, HomeNav, NextStep, PrepSection, ProgressHero, StoryPhase } from '../components/home'
</script>

<template>
  <main class="home-screen">
    <HomeHeader />
    <ProgressHero />
    <StoryPhase />
    <NextStep />
    <PrepSection />
    <HomeNav />
  </main>
</template>

<style scoped>
.home-screen{min-height:100svh;max-width:540px;margin:auto;padding:calc(24px + env(safe-area-inset-top)) 22px calc(86px + env(safe-area-inset-bottom));background:var(--color-cream);color:var(--color-forest)}
@media(min-width:700px){.home-screen{box-shadow:0 0 50px #173b3220}}
</style>

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'

export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // vendor séparé : téléchargement en parallèle + cache stable
        // d'un déploiement à l'autre (vue change rarement, l'app souvent)
        manualChunks: {
          vue: ['vue', 'vue-router'],
          motion: ['motion-v'],
        },
      },
    },
  },
})

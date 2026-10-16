import { createApp } from 'vue'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import App from './App.vue'
import './styles.css'
import './motion.css'
import './art-direction.css'
import './pwa.css'
import './home.css'
import './home-overrides.css'
import './home-discovery.css'
import './scene.css'
import './fresh-home.css'
import './opening-home.css'
import './opening-tweaks.css'
import './mobile-finish.css'
import './hero-framing.css'
import './spacing-fix.css'
import './layout-correction.css'
import './readability-fix.css'
import './spacing-tight.css'
import './opening-layout.css'
import './app-home-polish.css'
import './da-final-pass.css'
import './magic-seal.css'
import './fingerprint-pulse.css'
import './opening-minimal-header.css'
import './opening-no-header.css'
import './seal-refinement.css'
import './seal-clean.css'
import './seal-fingerprint-fix.css'
import './seal-fingerprint-visible.css'
import './seal-fingerprint-scale.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'lutins',
    themes: {
      lutins: {
        dark: false,
        colors: {
          background: '#F7F3EA',
          surface: '#FFFCF7',
          primary: '#173B32',
          secondary: '#9B3440',
          accent: '#C9A96A',
          onBackground: '#24221F',
          onSurface: '#24221F',
        },
      },
    },
  },
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
})

createApp(App).use(vuetify).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
}

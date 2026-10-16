import { createApp } from 'vue'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import App from './App.vue'
import { router } from './router'
import './styles/base.css'

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

createApp(App).use(vuetify).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
}

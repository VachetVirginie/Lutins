import { createApp } from 'vue'
import './styles/mdi.css'
import App from './App.vue'
import { router } from './router'
import './styles/base.css'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
  } else {
    // en dev le SW fige les assets en cache — on le désinstalle
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()))
  }
}

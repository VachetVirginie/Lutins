import { createApp } from 'vue'
import './styles/mdi.css'
import App from './App.vue'
import { router } from './router'
import './styles/base.css'

createApp(App).use(router).mount('#app')

// La suite du voyage se prépare pendant que l'écran d'ouverture brille :
// les écrans les plus probables se téléchargent au repos du navigateur
const warmRoutes = () => {
  void import('./views/HomeView.vue')
  void import('./views/PersonalizeView.vue')
}
const ric = (window as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback
if (ric) ric.call(window, warmRoutes, { timeout: 4000 })
else window.setTimeout(warmRoutes, 2500)

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
  } else {
    // en dev le SW fige les assets en cache — on le désinstalle
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()))
  }
}

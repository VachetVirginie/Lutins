import { createRouter, createWebHistory } from 'vue-router'
import OpeningView from '../views/OpeningView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'opening', component: OpeningView },
    { path: '/home', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/planning', name: 'planning', component: () => import('../views/PlanningView.vue') },
    { path: '/preparer', name: 'preparer', component: () => import('../views/PrepareView.vue') },
    { path: '/souvenirs', name: 'souvenirs', component: () => import('../views/SouvenirsView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

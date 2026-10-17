import { createRouter, createWebHistory } from 'vue-router'
import OpeningView from '../views/OpeningView.vue'
import { currentAdventure } from '../data/adventure'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'opening', component: OpeningView },
    { path: '/home', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/planning', name: 'planning', component: () => import('../views/PlanningView.vue') },
    { path: '/aujourdhui', name: 'aujourdhui', redirect: () => `/activites/jour-${currentAdventure.currentDay}` },
    { path: '/prepare', name: 'preparer', component: () => import('../views/PrepareView.vue') },
    { path: '/souvenirs', name: 'souvenirs', component: () => import('../views/SouvenirsView.vue') },
    { path: '/personnalisation', name: 'personnalisation', component: () => import('../views/PersonalizeView.vue') },
    { path: '/activites/:activityId', name: 'activite', component: () => import('../views/ActivityView.vue') },
    { path: '/entree', redirect: '/' },
    { path: '/preparer', redirect: '/prepare' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (!sessionStorage.getItem('lutins-unlocked') && to.name !== 'opening') {
    return { name: 'opening' }
  }
})

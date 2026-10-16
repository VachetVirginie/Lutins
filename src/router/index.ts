import { createRouter, createWebHistory } from 'vue-router'
import OpeningView from '../views/OpeningView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/planning', name: 'planning', component: () => import('../views/PlanningView.vue') },
    { path: '/aujourdhui', name: 'aujourdhui', component: () => import('../views/TodayView.vue') },
    { path: '/prepare', name: 'preparer', component: () => import('../views/PrepareView.vue') },
    { path: '/souvenirs', name: 'souvenirs', component: () => import('../views/SouvenirsView.vue') },
    { path: '/activites/:activityId', name: 'activite', component: () => import('../views/ActivityView.vue') },
    { path: '/entree', name: 'opening', component: OpeningView },
    { path: '/home', redirect: '/' },
    { path: '/preparer', redirect: '/prepare' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (!sessionStorage.getItem('lutins-unlocked') && to.name !== 'opening') {
    return { name: 'opening' }
  }
})

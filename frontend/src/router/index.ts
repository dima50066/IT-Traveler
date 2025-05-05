import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';

const routes = [
  {
    path: '/',
    name: 'greeting',
    component: () => import('../views/GreetingView.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/AuthView.vue')
  },
  {
    path: '/map',
    name: 'homepage',
    component: () => import('../views/HomepageView.vue'),
    beforeEnter: authGuard
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

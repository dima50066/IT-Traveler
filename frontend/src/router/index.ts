import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';
import { useAuthStore } from '../stores/auth';

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
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const authStore = useAuthStore();
      const token = authStore.token || localStorage.getItem('token');
      if (token) {
        next();
      } else {
        next('/auth');
      }
    }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

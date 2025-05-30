import { useAuthStore } from '../../stores/auth';
import { fetchOrCreateUser } from '../user/user';
import { router } from '../../router';

export const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth`;
};

export const initUser = async () => {
  const authStore = useAuthStore();

  const token = authStore.token || localStorage.getItem('token');
  if (token && !authStore.user) {
    try {
      const user = await fetchOrCreateUser(token);
      authStore.setUser(user);
    } catch (e) {
      return e;
    }
  }

  if (authStore.isAuthenticated && router.currentRoute.value.path === '/auth') {
    router.push('/map');
  }
};

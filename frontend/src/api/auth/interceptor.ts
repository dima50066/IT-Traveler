import { clientFetch } from '../clientFetch';
import { useAuthStore } from '../../stores/auth';

export const setupAuthInterceptor = () => {
  clientFetch.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.token || localStorage.getItem('token');

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  });
};

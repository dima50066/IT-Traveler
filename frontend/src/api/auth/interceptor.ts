import { clientFetch } from '../clientFetch';
import { useAuth0 } from '@auth0/auth0-vue';

export const setupAuthInterceptor = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  clientFetch.interceptors.request.use(async (config) => {
    try {
      if (isAuthenticated.value) {
        const token = await getAccessTokenSilently();
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.warn('⚠️ Token not attached:', error);
    }

    return config;
  });
};

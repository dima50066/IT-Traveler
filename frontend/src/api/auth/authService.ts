import { createAuth0 } from '@auth0/auth0-vue';
import { useAuthStore } from '../../stores/auth';
import { fetchOrCreateUser, fetchUserProfile } from '../user/index';
import { router } from '../../router';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
export const initAuth0 = () =>
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: 'openid profile email read:data'
    },
    onRedirectCallback: async (appState: { target?: string }) => {
      const authStore = useAuthStore();

      try {
        const user = await fetchOrCreateUser();
        authStore.setUser(user);
        console.log('✅ Authenticated and user stored:', user);
      } catch (e) {
        console.error('❌ Auth callback failed:', e);
      }

      router.push(appState?.target || '/map');
    }
  } as unknown as Parameters<typeof createAuth0>[0]);

export const initUser = async () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const authStore = useAuthStore();
  const router = useRouter();

  if (isAuthenticated.value && !authStore.user && !isLoading.value) {
    try {
      const user = await fetchUserProfile();
      authStore.setUser(user);
    } catch (e) {
      console.error('❌ Failed to fetch user on mount:', e);
    }
  }

  if (authStore.user && router.currentRoute.value.path === '/auth') {
    router.push('/map');
  }
};

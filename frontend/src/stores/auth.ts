import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | Record<string, any>
  }),

  actions: {
    async getToken(
      getAccessTokenSilently: () => Promise<string>,
      isAuthenticated: { value: boolean }
    ): Promise<string | null> {
      if (isAuthenticated.value) {
        return await getAccessTokenSilently();
      }
      return null;
    },
    setUser(userData: Record<string, any>) {
      this.user = userData;
    },

    clear() {
      this.user = null;
    }
  },

  persist: true
});

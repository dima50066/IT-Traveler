import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Record<string, any> | null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    setUser(userData: Record<string, any>) {
      this.user = userData;
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    clear() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
    }
  },

  persist: true
});

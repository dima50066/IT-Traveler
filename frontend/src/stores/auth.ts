import { defineStore } from 'pinia';
import { User } from '../types';
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    setUser(userData: User) {
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

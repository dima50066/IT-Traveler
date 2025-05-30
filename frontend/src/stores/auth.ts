import { defineStore } from 'pinia';
import { User } from '../types';
import { fetchAllUsers } from '../api/user/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    allUsers: [] as User[]
  }),

  getters: {
    userId: (state) => state.user?._id || null,
    userName: (state) => state.user?.name || null,
    isAuthenticated: (state) => !!state.user && !!state.token
  },

  actions: {
    setUser(userData: User) {
      this.user = userData;
    },
    setToken(token: string) {
      if (token) {
        this.token = token;
        localStorage.setItem('token', token);
      } else {
      }
    },
    clear() {
      this.user = null;
      this.token = '';
      this.allUsers = [];
      localStorage.removeItem('token');
    },
    async loadUsers() {
      if (!this.token) return;

      try {
        const users = await fetchAllUsers(this.token);
        this.allUsers = users;
      } catch (err) {
        return err;
      }
    }
  },

  persist: true
});

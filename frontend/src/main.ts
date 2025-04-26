import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';
import { router } from './router/index.js';
import { authService, TOKEN_KEY } from './api/authService';

const token = localStorage.getItem(TOKEN_KEY);

if (token) {
  authService.setToken(token);
}

const app = createApp(App);
app.use(createPinia());

app.use(router);
app.mount('#app');

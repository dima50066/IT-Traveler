import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { router } from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { initAuth0 } from './api/auth/authService';

const app = createApp(App);

app.use(initAuth0());

app.use(createPinia());

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);

app.use(router);

app.mount('#app');

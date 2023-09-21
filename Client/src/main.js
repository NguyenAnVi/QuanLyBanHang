
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./store";
import Toast from "vue-toastification";
import './assets/main.css';
import "vue-toastification/dist/index.css"; // Toast's Style
import ToastOptions from './config/ToastOptions';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App)

app
  .use(router)
  .use(store)
  .use(Toast, ToastOptions)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css';

createApp(App).use(createPinia()).use(router).mount("#app")

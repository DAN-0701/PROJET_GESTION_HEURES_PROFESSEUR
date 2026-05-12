import { createApp } from 'vue'
import "@fontsource/inter"; // Poids par défaut (400)
import "@fontsource/inter/300.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import App from './App.vue'
import router  from "./router/index.js";
// import de style
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'


createApp(App).use(router).mount('#app')

import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./routes"
document.title = import.meta.env.VITE_PAGE_TITLE


import "./assets/scss/index.scss"
import App from "@/App.vue"
const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .mount("#app")
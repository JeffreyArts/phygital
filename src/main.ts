import { ViteSSG } from "vite-ssg"
import App from "./App.vue"
import {routerOptions} from "@/routes"
import { createPinia } from "pinia"
import "./assets/scss/index.scss"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/dist/MorphSVGPlugin"
import { TextPlugin } from "gsap/dist/TextPlugin"
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin"
import BlurPlugin from "@/services/gsap-blur"

export const createApp = ViteSSG(
    App,
    routerOptions ,
    // function to have custom setups
    ({ app, router, routes, isClient, initialState }) => {
        const pinia = createPinia()
        app.use(pinia)
        if (typeof gsap.registerPlugin === "function") {
            gsap.registerPlugin(MorphSVGPlugin)
            gsap.registerPlugin(TextPlugin)
            gsap.registerPlugin(DrawSVGPlugin)
            gsap.registerPlugin(BlurPlugin)
        }
    },
)
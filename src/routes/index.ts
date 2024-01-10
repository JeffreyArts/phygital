import { createWebHistory, createRouter } from "vue-router"
import Home from "@/routes/home.vue"
import view3D from "@/routes/view-3d.vue"
import viewSections from "@/routes/view-surface.vue"

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        redirect: "/3D-view",
    },
    {
        path: "/3D-view",
        name: "3D View",
        component: view3D
    },
    {
        path: "/sections-view",
        name: "Sections View",
        component: viewSections,
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router


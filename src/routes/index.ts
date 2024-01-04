import { createWebHistory, createRouter } from "vue-router"
import Home from "@/routes/home.vue"
import view3D from "@/routes/view-3d.vue"
import viewSections from "@/routes/view-sections.vue"

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        redirect: "/3D-View",
    },
    {
        path: "/3D-View",
        name: "3D View",
        component: view3D
    },
    {
        path: "/Sections-View",
        name: "Sections View",
        component: viewSections,
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router


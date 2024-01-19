import { createWebHistory, createRouter } from "vue-router"
import About from "@/routes/about.vue"
import OtherProjects from "@/routes/other-projects.vue"
import Sculptures from "@/routes/sculptures.vue"
import view3D from "@/routes/view-3d.vue"
import viewSections from "@/routes/view-surface.vue"
import "@/services/gsap-blur.ts"

const routes = [
    {
        path: "/",
        redirect: "/3D-view",
    },
    {
        path: "/about",
        name: "About",
        component: About
        
    },
    {
        path: "/other-projects",
        name: "Other projects",
        component: OtherProjects
        
    },
    {
        path: "/sculptures",
        name: "Sculptures",
        component: Sculptures
        
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

<template >
    <dashboard-overlay v-if="!isDev"/>
    <div ref="main" class="dashboard-main">
        <router-view />
    </div>
    <dashboard-sidebar class="dashboard-sidebar-container" :data-grid="grid" ref="sidebar"/>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import App from "@/stores/app"
import _ from "lodash"

import DashboardOverlay from "@/components/dashboard-overlay.vue"
import DashboardSidebar from "@/components/dashboard-sidebar.vue"

export default defineComponent ({ 
    name: "appDashboard",
    components: {DashboardSidebar, DashboardOverlay},
    props: [],
    setup() {
        const app = App()

        return { app}
    },
		
    data: () => {
        return {
            cellSize:128,
            grid: "3x8"
        }
    },
    computed: {
        isDev() {
            return import.meta.env.DEV
        },
        activeView() {
            return this.app.activeView
        }
    },
    mounted() {
        this.updateDashboard()
        
        window.addEventListener("resize", this.updateDashboard)
    },
    unmounted() {
        window.removeEventListener("resize", this.updateDashboard)
    },
    methods: {
        async updateDashboard() {
            const container = this.$el.parentElement as HTMLElement
            if (!container)  return 
            window.innerHeight > window.innerWidth ? this.app.orientation = "portrait" : this.app.orientation = "landscape"
            const mainElement = this.$refs["main"] as HTMLElement
            const sidebarElement = container.querySelector(".dashboard-sidebar") as HTMLElement

            const body = document.body as HTMLElement
            body.classList.remove("__isLandscape")
            body.classList.remove("__isPortrait")
            body.classList.add(this.app.orientation === "landscape" ? "__isLandscape" : "__isPortrait")
            
            if (this.app.orientation == "portrait") {
                let size = sidebarElement.clientHeight
                mainElement.style.height = `${ window.innerHeight - size}px`
                await this.$router.isReady()
                if (this.$route.name != "3D View") {
                    const downloadSection = document.querySelector("#s-download") as HTMLElement
                    if (downloadSection) {
                        downloadSection.style.opacity = "0"
                    }
                }
            } else {
                mainElement.style.height = "auto"
                const downloadSection = document.querySelector("#s-download") as HTMLElement
                if (downloadSection.style.opacity == "0") {
                    downloadSection.style.opacity = "1"
                }
            }


        }
    }
})

</script>
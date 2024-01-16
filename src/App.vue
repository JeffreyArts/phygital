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
        updateDashboard() {
            const container = this.$el.parentElement as HTMLElement
            if (!container)  return 
            container.clientHeight > container.clientWidth ? this.app.orientation = "portrait" : this.app.orientation = "landscape"
            const mainElement = this.$refs["main"] as HTMLElement
            const sidebarElement = container.querySelector(".dashboard-sidebar") as HTMLElement
            const sidebarContainerElement = container.querySelector(".dashboard-sidebar-container") as HTMLElement
	
            if (!mainElement ) {
                console.error("Can't find mainElement", mainElement)
            } 
            
            if (!sidebarElement) {
                console.error("Can't find sidebarElement", sidebarElement)
                return
            }

            const style = window.getComputedStyle(container)
            const width = container.clientWidth
            const height = container.clientHeight
	

            if (_.isNaN(width) || _.isNaN(height)) {
                return
            }
            // Define grid and cell size
            if (this.app.orientation == "portrait") {
                this.grid = "8x2"

                if (window.innerWidth > 640) {
                    this.cellSize = Math.floor(width/3.6)
                } else {
                    this.cellSize = Math.floor(width/2.4)
                }
            } else if (this.app.orientation == "landscape") {
                this.grid = "3x8"
                this.cellSize = Math.floor(height/parseInt(this.grid.split("x")[1], 10))
            }
            
            
            if (this.app.orientation == "portrait") {
                const size = this.cellSize*2 > 240 ? 240 : this.cellSize*2
                mainElement.style.top = "0px"
                mainElement.style.left = "0px"
                mainElement.style.width = `${ width }px`
                mainElement.style.height = `${ height - size}px`
                
                sidebarContainerElement.style.width = "100%"
                sidebarContainerElement.style.top = `${ height- size}px`
                sidebarContainerElement.style.left = "0px"

                sidebarElement.style.height = `${ size }px`
                
                if (window.innerWidth > 420) {
                    sidebarElement.style.width = `${ this.cellSize * parseInt(this.grid.split("x")[0], 10) }px`
                } else if (window.innerWidth > 360) {
                    sidebarElement.style.width = `${ this.cellSize * parseInt(this.grid.split("x")[0], 10) *1.16}px`
                } else {
                    sidebarElement.style.width = `${ this.cellSize * parseInt(this.grid.split("x")[0], 10) *1.44}px`
                }
            } else {
                mainElement.style.top = "0px"
                mainElement.style.left = "0px"
                mainElement.style.width = `${width - this.cellSize * parseInt(this.grid.split("x")[0], 10)}px`
                mainElement.style.height = `${height}px`
                
                // sidebarContainerElement.style.width = "100%"
                // sidebarContainerElement.style.top = `${ height- size}px`

                sidebarElement.style.width = "100%"
                sidebarElement.style.height = "100%"
                
                sidebarContainerElement.style.top = "0px"
                sidebarContainerElement.style.left = `${width - this.cellSize * parseInt(this.grid.split("x")[0], 10)}px`
                sidebarContainerElement.style.width = `${this.cellSize * parseInt(this.grid.split("x")[0], 10)}px`
                sidebarContainerElement.style.height = `${height}px`
            }


        }
    }
})

</script>

<style src="./assets/scss/index.scss"></style>
<style lang="scss">

.dashboard-main {
    position: absolute;
}

</style>

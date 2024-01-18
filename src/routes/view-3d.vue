<template>
    <div class="view-3d">
        <vpg-3d />
        <!-- v-bind:datamodel="pattern3D" :model-changed="updatePattern" @active:camera="cameraUpdate" @mousedown="mouseDown = true" @mouseup="mouseDown = false" /> -->
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import {RouteLocationNormalized} from "vue-router"
import App from "@/stores/app"
import PhygitalStore from "@/stores/phygital"
import vpg3d from "@/components/vpg-3d.vue"
import gsap from "gsap"

export default defineComponent ({ 
    name: "view3D",
    components: {
        vpg3d
    },
    props: [],
    setup() {
        const app = App()
        const phygital = PhygitalStore()

        return { app, phygital}
    },
    data() {
        return {
            fadedOut: false
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
        document.title = "Phygital - 3D View" 
        this.app.activeView = "view-3d"

        this.$nextTick(()=> {
            this.fadeIn()
        })
        
        this.$router.beforeResolve(guard => {
            if (this.$router.currentRoute.value.name != "3D View" || this.fadedOut) {
                return
            }
            this.fadeOut(guard)
            return false
        })
    },
    methods: {
        fadeIn() {
            gsap.set(".view-3d canvas", {
                scale: .8,
                y: "+8",
                opacity: 0,
            })

            gsap.to(".view-3d canvas", {
                duration: .64,
                scale: 1,
                y: 0,
                ease: "power3.in",
                opacity: 1,
            })
            
        },
        fadeOut(newRoute: RouteLocationNormalized) {
            // section: Surface dimensions
            

            // Main
            gsap.to(".view-3d canvas", {
                duration: .4,
                scale: .8,
                y: "+8",
                ease: "power3.out",
                opacity: 0,
                onComplete: () => {
                    this.fadedOut = true
                    this.$router.replace(newRoute.fullPath)
                }
            })
        },
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.view-3d {
    width: 100%;
    height: 100%;
}


</style>
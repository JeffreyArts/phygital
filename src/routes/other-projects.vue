<template>
    <div class="other-projects">
        <h1>_ other projects</h1>

        <div class="other-projects-container">
            <iframe-container src="https://www.jeffreyarts.nl/projects" />
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import { RouteLocationNormalized } from "vue-router"
import App from "@/stores/app"
import IframeContainer from "@/components/iframe-container.vue"
import gsap from "@/services/gsap-wrapper"

export default defineComponent ({ 
    name: "other-projects",
    components: {
        IframeContainer
    },
    props: [],
    setup() {
        const app = App()

        return { app}
    },
    data() {
        return {
            fadedOut: false
        }
    },
    head: { 
        title: "Interphygital - Other projects",
        meta: [
            {
                name: "Other projects",
                content: "View other projects by Jeffrey Arts",
            },
        ],
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
        this.app.activeView = ""

        this.$nextTick(()=> {
            this.fadeIn()
        })

        this.$router.beforeResolve(guard => {
            if (this.$router.currentRoute.value.name != "Other projects" || this.fadedOut) {
                return
            }
            this.fadeOut(guard)
            return false
        })
    },
    methods: {
        fadeIn(){
            // Title
            const title = this.$el.querySelector("h1").innerText
            if (title) {
                gsap.set(".other-projects h1", {
                    text: "",
                    opacity: .2,
                })
                gsap.to(".other-projects h1", {
                    text: title,
                    opacity: 1,
                    ease: "none",
                    duration: .64,
                })
            }

            
            // Main
            gsap.set(".other-projects-container",{
                opacity: 0,
                y: 48,
            })

            gsap.to(".other-projects-container",{
                duration: .8,
                opacity: 1,
                y: 0,
                ease: "power4.out",
            })
        },
        fadeOut(newRoute: RouteLocationNormalized) {
            
            gsap.to(".other-projects h1", {
                text: "_",
                opacity: 0,
                ease: "none",
                duration: .64,
            })


            // Main
            gsap.to(".other-projects-container",{
                duration: 1.28,
                opacity: 0,
                y: 64,
                ease: "power4.out",
            })

            setTimeout(() => {
                this.fadedOut = true
                this.$router.replace(newRoute.fullPath)
            }, 1040)
        },
        
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.other-projects {
    width: 100%;
    height: 100%;
    overflow: visible;
    h1 {
        font-family: $accentFont;
        margin: 0;
        font-size: 48px;
    }
}

.other-projects-container {
    margin-top: 48px;
    height:calc(100% - 80px - 48px);
}


</style>
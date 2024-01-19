<template>
    <div class="sculptures">
        <h1>_ sculptures</h1>

        <div class="sculptures-container">
            <sculpture-thumbnail :src="sculpture.images[0]" :title="sculpture.name" v-for="(sculpture, i) in sculptures" :key="i"/>
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import { RouteLocationNormalized } from "vue-router"
import App from "@/stores/app"
import sculptureThumbnail from "@/components/sculpture-thumbnail.vue"
import { TextPlugin } from "gsap/TextPlugin"
import gsap from "gsap"

export default defineComponent ({ 
    name: "sculptures-overview",
    components: {
        sculptureThumbnail
    },
    props: [],
    setup() {
        const app = App()

        return { app}
    },
    data() {
        return {
            fadedOut: false,
            sculptures: [
                {
                    name: "PT-1128",
                    images: [
                        "/images/sculptures/PT-1128-squared-01.jpg",
                        "/images/sculptures/PT-1128-squared-02.jpg",
                        "/images/sculptures/PT-1128-squared-03.jpg",
                        "/images/sculptures/PT-1128-squared-04.jpg",
                        "/images/sculptures/PT-1128-squared-05.jpg",
                        "/images/sculptures/PT-1128-squared-06.jpg",
                        "/images/sculptures/PT-1128-squared-07.jpg",
                        "/images/sculptures/PT-1128-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-1876",
                    images: [
                        "/images/sculptures/PT-1876-squared-01.jpg",
                        "/images/sculptures/PT-1876-squared-02.jpg",
                        "/images/sculptures/PT-1876-squared-03.jpg",
                        "/images/sculptures/PT-1876-squared-04.jpg",
                        "/images/sculptures/PT-1876-squared-05.jpg",
                        "/images/sculptures/PT-1876-squared-06.jpg",
                        "/images/sculptures/PT-1876-squared-07.jpg",
                        "/images/sculptures/PT-1876-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2211",
                    images: [
                        "/images/sculptures/PT-2211-squared-01.jpg",
                        "/images/sculptures/PT-2211-squared-02.jpg",
                        "/images/sculptures/PT-2211-squared-03.jpg",
                        "/images/sculptures/PT-2211-squared-04.jpg",
                        "/images/sculptures/PT-2211-squared-05.jpg",
                        "/images/sculptures/PT-2211-squared-06.jpg",
                        "/images/sculptures/PT-2211-squared-07.jpg",
                        "/images/sculptures/PT-2211-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2227",
                    images: [
                        "/images/sculptures/PT-2227-squared-01.jpg",
                        "/images/sculptures/PT-2227-squared-02.jpg",
                        "/images/sculptures/PT-2227-squared-03.jpg",
                        "/images/sculptures/PT-2227-squared-04.jpg",
                        "/images/sculptures/PT-2227-squared-05.jpg",
                        "/images/sculptures/PT-2227-squared-06.jpg",
                        "/images/sculptures/PT-2227-squared-07.jpg",
                        "/images/sculptures/PT-2227-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2525",
                    images: [
                        "/images/sculptures/PT-2525-squared-01.jpg",
                        "/images/sculptures/PT-2525-squared-02.jpg",
                        "/images/sculptures/PT-2525-squared-03.jpg",
                        "/images/sculptures/PT-2525-squared-04.jpg",
                        "/images/sculptures/PT-2525-squared-05.jpg",
                        "/images/sculptures/PT-2525-squared-06.jpg",
                        "/images/sculptures/PT-2525-squared-07.jpg",
                        "/images/sculptures/PT-2525-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-2849",
                    images: [
                        "/images/sculptures/PT-2849-squared-01.jpg",
                        "/images/sculptures/PT-2849-squared-02.jpg",
                        "/images/sculptures/PT-2849-squared-03.jpg",
                        "/images/sculptures/PT-2849-squared-04.jpg",
                        "/images/sculptures/PT-2849-squared-05.jpg",
                        "/images/sculptures/PT-2849-squared-06.jpg",
                        "/images/sculptures/PT-2849-squared-07.jpg",
                        "/images/sculptures/PT-2849-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-3664",
                    images: [
                        "/images/sculptures/PT-3664-squared-01.jpg",
                        "/images/sculptures/PT-3664-squared-02.jpg",
                        "/images/sculptures/PT-3664-squared-03.jpg",
                        "/images/sculptures/PT-3664-squared-04.jpg",
                        "/images/sculptures/PT-3664-squared-05.jpg",
                        "/images/sculptures/PT-3664-squared-06.jpg",
                        "/images/sculptures/PT-3664-squared-07.jpg",
                        "/images/sculptures/PT-3664-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-4381",
                    images: [
                        "/images/sculptures/PT-4381-squared-01.jpg",
                        "/images/sculptures/PT-4381-squared-02.jpg",
                        "/images/sculptures/PT-4381-squared-03.jpg",
                        "/images/sculptures/PT-4381-squared-04.jpg",
                        "/images/sculptures/PT-4381-squared-05.jpg",
                        "/images/sculptures/PT-4381-squared-06.jpg",
                        "/images/sculptures/PT-4381-squared-07.jpg",
                        "/images/sculptures/PT-4381-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-4711",
                    images: [
                        "/images/sculptures/PT-4711-squared-01.jpg",
                        "/images/sculptures/PT-4711-squared-02.jpg",
                        "/images/sculptures/PT-4711-squared-03.jpg",
                        "/images/sculptures/PT-4711-squared-04.jpg",
                        "/images/sculptures/PT-4711-squared-05.jpg",
                        "/images/sculptures/PT-4711-squared-06.jpg",
                        "/images/sculptures/PT-4711-squared-07.jpg",
                        "/images/sculptures/PT-4711-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-4836",
                    images: [
                        "/images/sculptures/PT-4836-squared-01.jpg",
                        "/images/sculptures/PT-4836-squared-02.jpg",
                        "/images/sculptures/PT-4836-squared-03.jpg",
                        "/images/sculptures/PT-4836-squared-04.jpg",
                        "/images/sculptures/PT-4836-squared-05.jpg",
                        "/images/sculptures/PT-4836-squared-06.jpg",
                        "/images/sculptures/PT-4836-squared-07.jpg",
                        "/images/sculptures/PT-4836-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-5392",
                    images: [
                        "/images/sculptures/PT-5392-squared-01.jpg",
                        "/images/sculptures/PT-5392-squared-02.jpg",
                        "/images/sculptures/PT-5392-squared-03.jpg",
                        "/images/sculptures/PT-5392-squared-04.jpg",
                        "/images/sculptures/PT-5392-squared-05.jpg",
                        "/images/sculptures/PT-5392-squared-06.jpg",
                        "/images/sculptures/PT-5392-squared-07.jpg",
                        "/images/sculptures/PT-5392-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-5679",
                    images: [
                        "/images/sculptures/PT-5679-squared-01.jpg",
                        "/images/sculptures/PT-5679-squared-02.jpg",
                        "/images/sculptures/PT-5679-squared-03.jpg",
                        "/images/sculptures/PT-5679-squared-04.jpg",
                        "/images/sculptures/PT-5679-squared-05.jpg",
                        "/images/sculptures/PT-5679-squared-06.jpg",
                        "/images/sculptures/PT-5679-squared-07.jpg",
                        "/images/sculptures/PT-5679-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-6619",
                    images: [
                        "/images/sculptures/PT-6619-squared-01.jpg",
                        "/images/sculptures/PT-6619-squared-02.jpg",
                        "/images/sculptures/PT-6619-squared-03.jpg",
                        "/images/sculptures/PT-6619-squared-04.jpg",
                        "/images/sculptures/PT-6619-squared-05.jpg",
                        "/images/sculptures/PT-6619-squared-06.jpg",
                        "/images/sculptures/PT-6619-squared-07.jpg",
                        "/images/sculptures/PT-6619-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-7554",
                    images: [
                        "/images/sculptures/PT-7554-squared-01.jpg",
                        "/images/sculptures/PT-7554-squared-02.jpg",
                        "/images/sculptures/PT-7554-squared-03.jpg",
                        "/images/sculptures/PT-7554-squared-04.jpg",
                        "/images/sculptures/PT-7554-squared-05.jpg",
                        "/images/sculptures/PT-7554-squared-06.jpg",
                        "/images/sculptures/PT-7554-squared-07.jpg",
                        "/images/sculptures/PT-7554-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-7653",
                    images: [
                        "/images/sculptures/PT-7653-squared-01.jpg",
                        "/images/sculptures/PT-7653-squared-02.jpg",
                        "/images/sculptures/PT-7653-squared-03.jpg",
                        "/images/sculptures/PT-7653-squared-04.jpg",
                        "/images/sculptures/PT-7653-squared-05.jpg",
                        "/images/sculptures/PT-7653-squared-06.jpg",
                        "/images/sculptures/PT-7653-squared-07.jpg",
                        "/images/sculptures/PT-7653-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-8251",
                    images: [
                        "/images/sculptures/PT-8251-squared-01.jpg",
                        "/images/sculptures/PT-8251-squared-02.jpg",
                        "/images/sculptures/PT-8251-squared-03.jpg",
                        "/images/sculptures/PT-8251-squared-04.jpg",
                        "/images/sculptures/PT-8251-squared-05.jpg",
                        "/images/sculptures/PT-8251-squared-06.jpg",
                        "/images/sculptures/PT-8251-squared-07.jpg",
                        "/images/sculptures/PT-8251-squared-08.jpg",
                    ]
                },
                {
                    name: "PT-9124",
                    images: [
                        "/images/sculptures/PT-9124-squared-01.jpg",
                        "/images/sculptures/PT-9124-squared-02.jpg",
                        "/images/sculptures/PT-9124-squared-03.jpg",
                        "/images/sculptures/PT-9124-squared-04.jpg",
                        "/images/sculptures/PT-9124-squared-05.jpg",
                        "/images/sculptures/PT-9124-squared-06.jpg",
                        "/images/sculptures/PT-9124-squared-07.jpg",
                        "/images/sculptures/PT-9124-squared-08.jpg",
                    ]
                },
            ]
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
        document.title = "Phygital - Other projects" 
        this.app.activeView = ""
        gsap.registerPlugin(TextPlugin)

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
                gsap.set(".sculptures h1", {
                    text: "",
                    opacity: .2,
                })
                gsap.to(".sculptures h1", {
                    text: title,
                    opacity: 1,
                    ease: "none",
                    duration: .64,
                })
            }

            
            // Main
            gsap.set(".sculptures-container",{
                opacity: 0,
                y: 48,
            })

            gsap.to(".sculptures-container",{
                duration: .8,
                opacity: 1,
                y: 0,
                ease: "power4.out",
            })
        },
        fadeOut(newRoute: RouteLocationNormalized) {
            
            gsap.to(".sculptures h1", {
                text: "_",
                opacity: 0,
                ease: "none",
                duration: .64,
            })


            // Main
            gsap.to(".sculptures-container",{
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

.sculptures {
    width: 100%;
    height: 100%;
    overflow: auto;

    h1 {
        font-family: $accentFont;
        margin: 0;
        font-size: 32px;
        @media all and (min-width: 512px) {
            font-size: 40px;
        }
        @media all and (min-width: 720px) {
            font-size: 48px;
        }
    }
    
}

.sculptures-container {
    margin-top: 48px;
    height:calc(100% - 80px - 48px);
    width: calc(100% - 24px);
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    
    @media all and (min-width: 512px) {
        gap: 64px 32px;
        grid-template-columns: 1fr 1fr;
    }
    
    @media all and (min-width: 1040px) {
        gap: 128px 64px;
        // grid-template-columns: 1fr 1fr 1fr;
    }
}


</style>
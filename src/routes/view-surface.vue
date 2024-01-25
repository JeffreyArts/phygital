<template>
    <div class="view-section-container" ref="container">
        <vpg-svg-editable class="svg-container" />
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import {RouteLocationNormalized} from "vue-router"
import AppStore from "@/stores/app"
import vpgSvgEditable from "@/components/vpg-svg-editable.vue"
import gsap from "@/services/gsap-wrapper"

export default defineComponent ({ 
    name: "routeViewSection",
    components: {
        vpgSvgEditable
    },
    props: [],
    setup() {
        const app = AppStore()

        return { app}
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
        document.title = "Phygital - Surface editor" 
        this.app.activeView = "view-surfaces"

        this.$nextTick(()=> {
            this.fadeIn()
        })

        this.$router.beforeResolve(guard => {
            if (this.$router.currentRoute.value.name != "Sections View" || this.fadedOut) {
                return
            }
            this.fadeOut(guard)
            return false
        })
    },
    methods: {
        fadeOut(newRoute: RouteLocationNormalized) {
            // section: Edit options
            gsap.to("#s-edit-options", {
                duration: .64,
                opacity: 0,
                ease: "power3.out",
            })

            // section: Surface dimensions
            gsap.to(".surface-dimensions .aztech-input-number", {
                opacity: 0,
                duration: .64,
                stagger: {
                    from: "end",
                    each: .08,
                },
                ease: "power3.out"
            })

            // section: View edit button
            gsap.to(".view-edit-container svg", {
                opacity: 0,
                duration: .48,
                delay: .16,
                ease: "power3.out"
            })

            gsap.to(".view-edit-text-container", {
                opacity: 0,
                duration: .64,
                ease: "power3.out"
            })

            gsap.to(".vpg-svg-editable polyline", {
                duration: .8,
                strokeWidth: 24,
                ease: "power2.out",
            })

            gsap.to(".view-edit-section-tut", {
                duration: .4,
                opacity: 0,
                delay: .24,
                ease: "power2.out",
            })

            // Main
            gsap.to(".vpg-svg-editable", {
                duration: .96,
                opacity: 0,
                ease: "power3.out",
                onComplete: () => {
                    this.fadedOut = true
                    this.$router.replace(newRoute.fullPath)
                }
            })

            const body = document.body as HTMLElement
            if (body.classList.contains("__isPortrait")) {
                if (newRoute.name != "Sections View") {
                    gsap.to("#s-seed", {
                        duration: .64,
                        opacity: 0,
                        pointerEvents: "none",
                        ease: "power3.out",
                    })
                }
            }

        },
        fadeIn() {

            // section: Surface dimensions
            gsap.set(".surface-dimensions .aztech-input-number", {
                opacity: 0
            })
            gsap.to(".surface-dimensions .aztech-input-number", {
                opacity: 1,
                duration: .8,
                stagger: {
                    from: "start",
                    each: .16,
                },
                ease: "power3.in"
            })
            
            // section: View edit button
            gsap.fromTo(".view-edit-container svg", {
                opacity: 0,
                duration: .48,
                ease: "power3.in"
            },{
                opacity: 1,
            })
                
            gsap.fromTo(".view-edit-text-container", {
                opacity: 0,
                duration: .64,
                delay: .16,
                ease: "power3.in"
            },{
                opacity: 1,
            })

            if (this.app.showTips) {
                gsap.to(".view-edit-section-tut", {
                    duration: .4,
                    opacity: 1,
                    delay: .24,
                    ease: "power2.out",
                })
            }
            
            // MAIN
            gsap.set(".vpg-svg-editable svg", {
                opacity: 0,
                y: -8,
                scale: .8,
            })

            gsap.to(".vpg-svg-editable svg", {
                scale: 1,
                y: 0,
                ease: "power4.inOut",
                duration: .8,
                opacity: 1,
            })


            // Section: seed
            gsap.set("#s-seed", { pointerEvents: "all", opacity: 0 })
            gsap.to("#s-seed", {
                duration: .64,
                opacity: 1,
                ease: "power3.in",
            })
        }   
    }
})

</script>


<style lang="scss">
@import "@/assets/scss/variables.scss";

.view-section-container {
    height: 100%;
}

</style>
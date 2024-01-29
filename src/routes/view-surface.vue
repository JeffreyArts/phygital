<template>
    <div class="view-section-container" ref="container">
        <aztechInfoBox id="help-section" label="?" :visible="app.showTips">
            <header class="how-it-works-container">
                <h3>How it works</h3>
                <div class="how-it-works">
                    <svg class="dots-preview" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve">
                        <g id="dot1.1">
                            <circle class="outer-ring" cx="5" cy="5" r="4.5"></circle>
                        </g>
                        <g id="dot1.2">
                            <circle class="inner-ring" cx="25" cy="5" r="3"></circle>
                            <circle class="outer-ring" cx="25" cy="5" r="4.5"></circle>
                        </g>
                        <g id="dot1.3">
                            <circle class="outer-ring" cx="45" cy="5" r="4.5"></circle>
                        </g>


                        <g id="dot2.1">
                            <circle class="inner-ring" cx="5" cy="25" r="3"></circle>
                            <circle class="outer-ring" cx="5" cy="25" r="4.5"></circle>
                        </g>
                        <g id="dot2.2">
                            <circle class="inner-ring" cx="25" cy="25" r="3"></circle>
                            <circle class="outer-ring" cx="25" cy="25" r="4.5"></circle>
                        </g>
                        <g id="dot2.3">
                            <circle class="inner-ring" cx="45" cy="25" r="3"></circle>
                            <circle class="outer-ring" cx="45" cy="25" r="4.5"></circle>
                        </g>

                        <g id="dot3.1">
                            <circle class="outer-ring" cx="5" cy="45" r="4.5"></circle>
                        </g>
                        <g id="dot3.2">
                            <circle class="inner-ring" cx="25" cy="45" r="3"></circle>
                            <circle class="outer-ring" cx="25" cy="45" r="4.5"></circle>
                        </g>
                        <g id="dot3.3">
                            <circle class="outer-ring" cx="45" cy="45" r="4.5"></circle>
                        </g>

                    </svg>
                    
                    <ul>
                        <li>No diagonal lines</li>
                        <li>Adjacent dots only</li>
                        <li>Only dashed dots</li>
                    </ul>
                </div>
            </header>
            <section>
                <div>
                    <h4>Adding lines</h4>
                    <aztech-hr />
                    <p>
                        Add a new line by clicking on a dot with a dashed circle, then click one of the adjacent dashed dots next to it.
                    </p>
                </div>
                <div>
                    <h4>Removing lines</h4>
                    <aztech-hr />
                    <p>
                        Remove lines by clicking on them.
                    </p>
                </div>
                <div>
                    <h4>Mirror edit</h4>
                    <aztech-hr />
                    <p>
                        When enabled, lines that are being added or removed from the surface will also be removed or added from the opposite surface
                    </p>
                </div>
            </section>
        </aztechInfoBox>
        <vpg-svg-editable class="svg-container" />
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import {RouteLocationNormalized} from "vue-router"
import AppStore from "@/stores/app"
import vpgSvgEditable from "@/components/vpg-svg-editable.vue"
import aztechInfoBox from "@/components/aztech/info-box.vue"
import aztechHr from "@/components/aztech/line-1.vue"
import gsap from "@/services/gsap-wrapper"

export default defineComponent ({ 
    name: "routeViewSection",
    components: {
        vpgSvgEditable,
        aztechInfoBox,
        aztechHr
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
        gsap.set("#help-section", { opacity: 0}) 

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

            // Help section
            gsap.to("#help-section", {
                duration: .4,
                opacity: 0,
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

            if (this.app.editMode) {
                // Help section
                gsap.to("#help-section", {
                    duration: .4,
                    opacity: 1,
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

#help-section {
    top: 80px;

    h3 {
        margin: 0 0 8px;
        font-family: $accentFont;
        text-transform: lowercase;
    }

    h4 {
        margin: 0;
    }

    p  {
        margin-top: 4px;
        margin-bottom: 24px;
        font-size: 12px;
    }

    .aztech-info-box-text-container {
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        padding: 24px 16px;
    }
    .aztech-line-1 {
        width: calc(100% + 24px);
        margin-left: -24px;
        opacity: 0.48;
        margin-top: -4px;
    }
    
    .how-it-works-container {
        margin-bottom: 16px;
    }

    .how-it-works {
        display: flex;
        flex-flow: row;
            
        li {
            list-style-type: none;
            &:before {
                content: "*";
                padding-right: 4px;
            }
        }
        ul {
            margin: 0;
            padding: 0;
            display: inline-block;
            width: calc(100% - 64px);
            margin-left: 8px;
            line-height: 25px;
            font-size: 14px;
        }
    }

    .dots-preview {
        width: 64px;

        .outer-ring {
            fill: transparent;
            stroke: currentColor;
            stroke-width: 1px;
        }
        .inner-ring {
            fill: transparent;
            stroke: currentColor;
            stroke-width: .5px;
            stroke-dasharray: 1.6 0.6 0 0;
        }
    }
}
</style>
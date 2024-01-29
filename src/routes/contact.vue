<template>
    <div class="contact-page">
        <h1><span>_ </span>contact</h1>

        <div class="contact-page-container">
            <footer class="contact-page-footer">

                <section class="contact-page-footer-block" @mouseenter="hoverIn" @mouseleave="hoverOut">
                    <section class="contact-page-footer-text">
                        <div class="contact-page-footer-text-wrapper">
                            <h3 class="contact-page-footer-header">physical</h3>
                            <p>
                                Vinkenstraat 70 <br>
                                3036 XT, Rotterdam [NL]
                            </p>
                        </div>
                    </section>
                    <svg class="contact-page-footer-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 0 0"
                        xml:space="preserve">
                        <polyline class="line" points="44.8,1.5 12.8,1.5 5.3,8.5 "/>
                        <polygon class="block" points="0,8.5 1.96,6.5 7.05,6.5 7.25,7 5.25,9 0.25,9 "/>
                        <circle class="circle" cx="44.8" cy="1.5" r="1.5"/>
                    </svg>
                </section>
                
                <section class="contact-page-footer-block" @mouseenter="hoverIn" @mouseleave="hoverOut">
                    <section class="contact-page-footer-text">
                        <div class="contact-page-footer-text-wrapper">
                            <h3 class="contact-page-footer-header">digital</h3>
                            <p>
                                <a href="mailto:contact@jeffreyarts.nl">contact@jeffreyarts.nl</a> <br/>
                                <a href="https://www.instagram.com/jeffreyarts" target="_blank">Instagram</a>
                            </p>
                        </div>
                    </section>
                    <svg class="contact-page-footer-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 0 0"
                        xml:space="preserve">
                        <polyline class="line" points="44.8,1.5 12.8,1.5 5.3,8.5 "/>
                        <polygon class="block" points="0,8.5 1.96,6.5 7.05,6.5 7.25,7 5.25,9 0.25,9 "/>
                        <circle class="circle" cx="44.8" cy="1.5" r="1.5"/>
                    </svg>
                </section>

                <section class="contact-page-footer-block" @mouseenter="hoverIn" @mouseleave="hoverOut">
                    <section class="contact-page-footer-text">
                        <div class="contact-page-footer-text-wrapper">
                            <h3 class="contact-page-footer-header">online</h3>
                            <p>
                                <a href="https://www.jeffreyarts.nl" target="_blank">www.jeffreyarts.nl</a>
                            </p>
                        </div>
                    </section>
                    <svg class="contact-page-footer-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 0 0"
                        xml:space="preserve">
                        <polyline class="line" points="44.8,1.5 12.8,1.5 5.3,8.5 "/>
                        <polygon class="block" points="0,8.5 1.96,6.5 7.05,6.5 7.25,7 5.25,9 0.25,9 "/>
                        <circle class="circle" cx="44.8" cy="1.5" r="1.5"/>
                    </svg>
                </section>
            </footer>
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import { RouteLocationNormalized } from "vue-router"
import App from "@/stores/app"
import gsap from "@/services/gsap-wrapper"

export default defineComponent ({ 
    name: "contact-page",
    components: {
    },
    props: [],
    setup() {
        const app = App()

        return { app}
    },
    data() {
        return {
            fadedOut: false,
            textWidth: 0
        }
    },
    head: { 
        title: "Interphygital - Contact",
        meta: [
            {
                name: "Contact",
                content: "contact@jeffreyarts.nl | www.jeffreyarts.nl | Vinkenstraat 70, 3036 XT, Rotterdam (The Netherlands)",
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
            if (this.$router.currentRoute.value.name != "Contact" || this.fadedOut) {
                return
            }
            this.fadeOut(guard)
            return false
        })

        window.addEventListener("resize", this.onResizeEvent)
    },
    unmounted() {
        window.removeEventListener("resize", this.onResizeEvent)
    },
    methods: {
        onResizeEvent() {
            this.updateSVGLine()
        },
        hoverIn(e: MouseEvent) {
            this.updateSVGLine()
            const target = e.currentTarget as HTMLElement
            if (!target) {
                return
            }
            const svg = target.querySelector("svg")
            gsap.set(svg, {y:8})
            gsap.to(svg, {
                opacity: 1,
                y: 0,
                duration: .64,
                ease:"power3.out"
            })
            
        },
        hoverOut(e: MouseEvent) {
            const target = e.currentTarget as HTMLElement
            if (!target) {
                return
            }
            const svg = target.querySelector("svg")
            gsap.to(svg, {
                opacity: 0,
                y: 8,
                duration: .64,
                ease:"power3.out"
            })

        },
        updateSVGLine() {
            const svgs = this.$el.querySelectorAll(".contact-page-footer-svg") as Array<SVGAElement>
            if (!svgs) {
                return
            }

            svgs.forEach(element => {
                const line = element.querySelector(".line")
                const block = element.querySelector(".block")
                const circle = element.querySelector(".circle")
                const blockPadding = 16
                const linePadding = 16
                const textWrapper = element.parentNode?.querySelector(".contact-page-footer-text-wrapper")
                if (!textWrapper) {
                    console.warn("Text wrapper not found for element", element)
                    return
                }
                const width = textWrapper.clientWidth + blockPadding
                if (!width) {
                    return
                }
                const blockPoints = `
                    0, 8.5
                    2, 6.5
                    ${width}, 6.5
                    ${width + .25}, 7
                    ${width - 1.75}, 9
                    0.25, 9
                `

                const linePoints = `
                    ${width + linePadding - 3} , 1.5
                    ${width + 7},1.5
                    ${width - 1.75}, 8.5
                `
                element?.setAttribute("viewBox", `0 0 ${width + linePadding } 9`)
                block?.setAttribute("points", blockPoints)
                line?.setAttribute("points", linePoints )
                circle?.setAttribute("cx", `${width + linePadding - 3}`)
            })
        },
        fadeIn(){
            // Title
            const title = this.$el.querySelector("h1").innerText
            if (title) {
                gsap.set(".contact-page h1", {
                    text: "",
                    opacity: .2,
                })
                gsap.to(".contact-page h1", {
                    text: title,
                    opacity: 1,
                    ease: "none",
                    duration: .64,
                })
            }

            
            // Main
            gsap.set(".contact-page-footer-block",{
                opacity: 0,
                y: 48,
            })

            gsap.to(".contact-page-footer-block",{
                duration: .8,
                opacity: 1,
                y: 0,
                stagger: .16,
                ease: "power4.out",
            })
        },
        fadeOut(newRoute: RouteLocationNormalized) {
            
            gsap.to(".contact-page h1", {
                text: "_",
                opacity: 0,
                ease: "none",
                duration: .64,
            })


            // Main
            gsap.to(".contact-page-container",{
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
.contact-page {
    height: 100%;

    h1 {
        font-family: $accentFont;
        font-size: 32px;
        margin: 0;
        width: 100%;
        display: inline-block;
        line-height: 0.7;

        @media all and (min-width: 512px) {
            line-height: 1;
            font-size: 40px;
        }
        @media all and (min-width: 720px) {
            font-size: 48px;
        }
    }

    a {
        color: #091B3D;
        text-decoration: underline;
        transition: ease .5 all;
        user-select: all; // chrome and Opera
        -moz-user-select: all; // Firefox
        -webkit-text-select: all; // IOS Safari
        -webkit-user-select: all; // Safari
        display: inline-block;
        width: 100%;
        
        &:hover,
        &:focus {
            text-decoration: none;
            opacity: .5;
        }
    }
}

.contact-page-container {
    width: 100%;
    height: calc(100% - 64px);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

}

.contact-page-footer {
    width: 100%;
    max-width: 960px;
    display: flex;
    justify-content: space-between;
}



.contact-page-footer-header {
    font-size: 18px;
    margin: 0 0 8px;
    font-family: $accentFont;
}

.contact-page-footer-text-wrapper {
    display: inline-block;
}

.contact-page-footer-block {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    position: relative;

    &:first-child {
        .contact-page-footer-text {
            margin-bottom: 0;
        }
    }
    
    p {
        line-height: 1.4;
        margin: 0;
        -webkit-user-select: all; /* Safari */        
        -moz-user-select: all; /* Firefox */
        -ms-user-select: all; /* IE10+/Edge */
        user-select: all; /* Standard */
    }
}

.contact-page-footer-svg {
    height: 9px;
    position: absolute;
    left: -4px;
    bottom: -8px;
    opacity: 0;
    
    .block {
        fill: $black;
    }
    
    .line {
        fill: none;
        stroke: $black;
        stroke-width: 1;
    }
}

.__isPortrait {
    .contact-page { 
        h1 {

            margin-top: 34px;
            text-align: center;
            > span {
                display: none;
            }
        }
    }

    .contact-page-container {
        align-items: flex-end;
        justify-content: center;
    }
     
    .contact-page-footer-svg {
        opacity: 0!important;
    }   
        
    .contact-page-footer {
        flex-flow: column-reverse;
        width: 100%;
        padding-left: 56px;
        padding-top: 32px;
    }

    .contact-page-footer-text {
        margin-bottom: 40px;
    }
}
</style>
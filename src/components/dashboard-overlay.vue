<template>
    <div class="dashboard-overlay" ref="container" @click="fadeOut(true)" v-if="!isDev">
        <svg class="do-c" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 320 320" style="enable-background:new 0 0 320 320;" xml:space="preserve">
            <polyline points="288,32 288,288 160,288 32,288 32,32 160,32 "/>
            <line x1="160" y1="288" x2="160" y2="160"/>
        </svg>
        <svg class="do-c" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 320 320" xml:space="preserve">
            <polyline points="32,32 32,288 163,288 288,288 288,32 163,32 "/>
            <line x1="160" y1="288" x2="160" y2="160"/>
        </svg>
        <svg class="do-c" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 320 320" xml:space="preserve">
            <polyline points="288,32 288,288 160,288 32,288 32,32 160,32 "/>
            <line x1="160" y1="288" x2="160" y2="160"/>
        </svg>
        <svg class="do-c" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 320 320" xml:space="preserve">
            <polyline points="32,32 32,288 163,288 288,288 288,32 163,32 "/>
            <line x1="160" y1="288" x2="160" y2="160"/>
        </svg> 

        <section class="dashboard-overlay-container">
            <header class="dashboard-overlay-header">inter phygital</header>
            <svg version="1.1" class="dashboard-overlay-by" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 94.7 49.3" style="enable-background:new 0 0 94.7 49.3;" xml:space="preserve">
                <g>
                    <polygon points="36.7,21.1 31.3,21.1 31.3,23.2 34.6,23.2"/>
                    <polygon points="34.6,27.4 31.3,27.4 31.3,29.5 36.7,29.5"/>
                    <path d="M67.9,4.4H26.8L6.4,24.6l19.7,20.1h41.8l20.3-20.1L67.9,4.4z M43.9,21.1h-1.2l-4.2,4.2l4.2,4.2h1.2v4.2H27.1 V16.9h16.8V21.1z M67.6,23.2l-4.2,4.2h-2.1v2.1h6.3v4.2H50.8v-4.2h6.3v-2.1H55l-4.2-4.2v-6.3H55v4.6l1.7,1.7h4.9l1.7-1.7v-4.6h4.2 V23.2z"/>
                    <path d="M69.8-0.2H24.9L0,24.5l24.2,24.8h45.6l24.9-24.7L69.8-0.2z M68.7,46.7H25.3L3.6,24.5L25.9,2.4h42.8l22.3,22.1 L68.7,46.7z"/>
                </g>
            </svg>

            <a class="dashboard-overlay-footer" target="_blank" href="https://www.jeffreyarts.nl">Jeffrey Arts</a>
        </section>
    </div>
</template>


<script lang="ts"> 
import { defineComponent } from "vue"
import _ from "lodash"
import gsap from "gsap"

export default defineComponent({
    name: "dashboard-component",
    data: () => {
        return {
            fadedOut: false
        }
    },
    computed: {
        isDev() {
            return import.meta.env.DEV
        }
    },
    watch: {
    
    },
    mounted() {
        if (!this.isDev) {
            this.startAnimation()
        }
    },
    methods: {
        startAnimation() {
            gsap.set(".do-c", {
                opacity: 0
            })
            gsap.set(".dashboard-overlay-container", {
                scale: .96,
                opacity: 1
            })


            gsap.to(".do-c",{
                opacity: 1,
                duration: .24,
                ease: "linear"
            })
            
            gsap.fromTo(".dashboard-overlay-by",{
                scale: .3,
            },{
                scale: 1,
                duration: 1.08,
                // delay: .64,
            })

            const timeline = gsap.timeline({
                onComplete: () => {
                    setTimeout(() => {
                        if (this.fadedOut) return
                        this.fadeOut()
                    }, 800)
                }
            })

            timeline.to(".dashboard-overlay-container", {
                scale: 1,
                opacity: 1,
                duration: .32,
                ease: "linear"
            })
        },
        killAll() {
            gsap.killTweensOf(".do-c")
            gsap.killTweensOf(".do-c line")
            gsap.killTweensOf(".do-c polyline")
            gsap.killTweensOf(".dashboard-overlay-container")
            gsap.killTweensOf(".dashboard-overlay-header")
            gsap.killTweensOf(".dashboard-overlay-footer")
        },
        fadeOut(immediate=false) {
            this.killAll()
            this.fadedOut = true
            // let delay = 
            
            const timeline = gsap.timeline({
                onComplete: () => {
                    // this.fadeOut()
                }
            })

            if (!immediate) {
                timeline.to(".do-c line", {
                    duration: 1.08,
                    strokeDashoffset: 128,
                    delay: 1,
                    ease: "power2.out"
                })
                timeline.to(".do-c polyline", {
                    duration: 1.44,
                    delay: -1.08,
                    strokeDashoffset: 390,
                    ease: "power4.out"
                })
            } else {
                gsap.to(".do-c line", {
                    duration: 1.08,
                    strokeDashoffset: 128,
                    strokeWidth: 32,
                    ease: "power2.out"
                })
                gsap.to(".do-c polyline", {
                    duration: 1.44,
                    strokeDashoffset: 390,
                    strokeWidth: 32,
                    ease: "power4.out"
                })
            }


            gsap.to(".dashboard-overlay-by", {
                scale: 0.3,
                opacity: 0,
                duration: .96,
                delay: 2.28,
                ease: "power4.inOut"
            })

            timeline.to(".dashboard-overlay-container", {
                height: "100vh",
                delay: .16,
                duration: 1.28,
                fontSize: 16,
                paddingTop: 8,
                paddingBottom: 8,
                ease: "power2.out"
            })
            timeline.to(".dashboard-overlay-footer", {
                fontSize: 12,
                duration: 1.28,
                delay: -1.28,
                ease: "power2.out"
            })
            timeline.to(".do-c", {
                duration: 1.44,
                width: 64,
                height: 64,
                padding: 4,
                delay: -1.28,
                strokeDashoffset: 390,
                ease: "power4.out"
            })
            timeline.to(".do-c polyline, .do-c line", {
                duration: 1.44,
                strokeWidth: 24,
                delay: -1.28,
                ease: "power4.out"
            })

            if (this.$el.querySelector(".dashboard-overlay")) {
                timeline.to(".dashboard-overlay", {
                    duration: 0.8,
                    pointerEvents:"none",
                    backgroundColor: "transparent",
                    delay: -1.08,
                    strokeDashoffset: 390,
                    ease: "power4.out"
                })
            }
        }
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.dashboard-overlay {
    position: fixed;
    inset: 0 0 0 0;
    z-index: 2023;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $black;
    font-size: 48px;
}
.dashboard-overlay-by {
    fill: currentColor;
    height: 1em; 
    margin: .5em 0;
}

.do-c {
    position: absolute;
    transform-origin: center;
    width:calc(50vw - 128px);
    height:calc(50vw - 128px);
    opacity: 0;
    @media (orientation: landscape) {
        width:calc(50vh - 128px);
        height:calc(50vh - 128px);
    }
    // width:calc(2 * 32px);
    // height:calc(2 * 32px);
    // padding: 8px;
    padding: 0px;
    line,
    polyline {
        fill:none;
        stroke: $dark-grey;
        stroke-width: 64px;
        stroke-dasharray: 900;
        stroke-dashoffset: 0;
        stroke-linecap: square;
    }
    
    line {
        stroke-dasharray: 128;
    }

    &:nth-child(1) {
        top: 0;
        left: 0;
        transform: rotate(180deg);
    }
    &:nth-child(2) {
        top: 0;
        right: 0;
        transform: rotate(180deg);
    }
    &:nth-child(3) {
        bottom: 0;
        right: 0;
        transform: rotate(0deg);
    }
    &:nth-child(4) {
        bottom: 0;
        left: 0;
        transform: rotate(0deg);
    }
}

.dashboard-overlay-container {
    display: flex;
    text-align: center;
    justify-content: space-between;
    align-items: center;
    flex-flow: column nowrap;
}

.dashboard-overlay-header {
    font-family: $accentFont;
    display: inline-block;
    line-height:1;
}
.dashboard-overlay-footer {
    font-size: 24px;
    font-family: "Courier New", "Courier", $defaultFont;
    height:1em;
    display: inline-block;
    line-height:1;
    pointer-events: all;
    text-decoration: none;
    color: $black;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
}

</style>

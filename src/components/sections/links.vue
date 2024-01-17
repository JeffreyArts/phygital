<template>
    <div class="links-section-container" ref="container">
        <ul class="links-section">
            <li>
                <router-link to="/about" class="link" @mouseenter="mouseEnterEvent" @mouseleave="mouseLeaveEvent">
                    <svg class="list-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 118.7 180" style="enable-background:new 0 0 118.7 180;" xml:space="preserve">
                        <polygon class="icon"/>
                        <polygon class="icon-line" points="0,161.6 9.2,152.4 109.5,152.4 118.7,161.6 118.7,180 107.1,180 8.2,180 0,180"/>
                        <polygon class="icon-ball" points="24,70.7 33.2,61.5 85.5,61.5 94.7,70.7 94.7,123 85.5,132.2 33.2,132.2 24,123 "/>
                    </svg>
                    <span class="text">
                        About
                    </span>
                </router-link>
            </li>
            <li>
                <router-link to="/other-projects" class="link" @mouseenter="mouseEnterEvent" @mouseleave="mouseLeaveEvent">
                    <svg class="list-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 118.7 180" style="enable-background:new 0 0 118.7 180;" xml:space="preserve">
                        <polygon class="icon"/>
                        <polygon class="icon-line" points="0,161.6 9.2,152.4 109.5,152.4 118.7,161.6 118.7,180 107.1,180 8.2,180 0,180"/>
                        <polygon class="icon-ball" points="24,70.7 33.2,61.5 85.5,61.5 94.7,70.7 94.7,123 85.5,132.2 33.2,132.2 24,123 "/>
                    </svg>
                    <span class="text">
                        Other projects
                    </span>
                </router-link>
            </li>
            <li>
                <a href="mailto:contact@jeffreyarts.nl" class="link" @mouseenter="mouseEnterEvent" @mouseleave="mouseLeaveEvent">
                    <svg class="list-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 118.7 180" style="enable-background:new 0 0 118.7 180;" xml:space="preserve">
                        <polygon class="icon"/>
                        <polygon class="icon-line" points="0,161.6 9.2,152.4 109.5,152.4 118.7,161.6 118.7,180 107.1,180 8.2,180 0,180"/>
                        <polygon class="icon-ball" points="24,70.7 33.2,61.5 85.5,61.5 94.7,70.7 94.7,123 85.5,132.2 33.2,132.2 24,123 "/>
                    </svg>
                    <span class="text">
                        Contact<span class="vague">@jeffreyarts.nl</span>
                    </span>
                </a>
            </li>
        </ul>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import Phygital from "@/stores/phygital"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"

export default defineComponent({
    name: "links-section",
    props: {
        character: {
            type: String,
            required: false,
            default: "-"
        },
    },
    setup() {
        const phygital = Phygital()
        return {
            phygital
        }
    },
    mounted() {
        gsap.registerPlugin(MorphSVGPlugin)

        const icon = this.$el.querySelectorAll("svg .icon") as SVGPathElement
        const line = this.$el.querySelectorAll("svg .icon-line") as SVGPathElement
        gsap.set(icon, {morphSVG: line})
    },
    methods: {
        mouseLeaveEvent(e: MouseEvent) {
            const target = e.target as HTMLElement
            if (!target){
                return
            }
            const text = target.querySelector(".text") as HTMLElement
            const icon = target.querySelector("svg .icon") as SVGPathElement
            const line = target.querySelector("svg .icon-line") as SVGPathElement
            const ball = target.querySelector("svg .icon-ball") as SVGPathElement

            if (!line || !ball || !icon) {
                return
            }
            
            gsap.killTweensOf(icon)
            gsap.to(icon, {
                morphSVG: {
                    shape:line,
                }, 
                duration: 0.64,
                ease: "elastic.out(1, .8)"
            })

            if (text) {
                gsap.to(text, {x: 0, duration: .4, ease: "power4.out"})
            }
        },
        mouseEnterEvent(e: MouseEvent) {
            const target = e.target as HTMLElement
            if (!target){
                return
            }

            const text = target.querySelector(".text") as HTMLElement
            const icon = target.querySelector("svg .icon") as SVGPathElement
            const line = target.querySelector("svg .icon-line") as SVGPathElement
            const ball = target.querySelector("svg .icon-ball") as SVGPathElement

            if (!line || !ball) {
                return
            }
            
            gsap.killTweensOf(icon)
            gsap.to(icon, {
                morphSVG: {
                    shape:ball,
                }, 
                ease: "elastic.out(1, .2)",
                duration: 0.8
            })
            
            if (text) {
                gsap.to(text, {x: 2, duration: .32, ease: "power4.out"})
            }
        }
    }
})
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
.links-section-container {
    position: relative;
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: flex-end;
    text-align: left;
    width: 100%;
    height: 100%;
    margin: 0;
    container-type: size;
    container-name: links-section;
}

.links-section  {
    font-size: 11px;
    margin: 0;
    padding: 0;

    li {
        padding: 0;
        margin: 0;
        font-family: $defaultFont;
        list-style-type: none;
        line-height: 1.2;
    }

    .link {
        font-family: $defaultFont;
        text-transform: lowercase;
        font-size: inherit;
        text-decoration: none;
        color: $black;
        transition: .32s ease all;
        display: inline-block;
        cursor: pointer;

        .text {
            display: inline-block;
            padding-left: 4px;
        }

        cursor: pointer;
        .vague {
            opacity: 0;
            display: none;
        }
    }
}

.list-icon {
    width: .8em;
    translate: 0 2px;
    .icon-line, 
    .icon-ball {
        opacity: 0;
    }
}

@container links-section (min-height: 64px) {
    .links-section li {
        line-height: 1.4;
    }
}
@container links-section (min-height: 69px) {
    .links-section {
        font-size: 12px;
    }
}
@container links-section (min-height: 72px) {
    .links-section {
        font-size: 12px;
        li {
            line-height: 1.5;
        }
        .link {
            font-family: $accentFont;
        }
    }
}

@container links-section (min-height: 76px) {
    .links-section {
        li {
            font-family: $accentFont;
        }
    }
}
@container links-section (min-height: 78px) {
    .links-section {
        li {
            line-height: 1.6;
        }
    }
}
@container links-section (min-height: 85px) {
    .links-section {
        li {
            line-height: 1.8;
        }
    }
}
@container links-section (min-height: 96px) {
    .links-section {
        .link {
            // .vague {
            //     display: inline-block;
            //     opacity: .32;
            // }
        }
    }
}


</style>

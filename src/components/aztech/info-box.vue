<template>
    <div class="aztech-info-box">
        <section class="aztech-info-box-text-container">
            <slot />
        </section>
        <div class="aztech-info-pull" @click="onClick">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 43.52" style="enable-background:new 0 0 29 43.52;" xml:space="preserve">
                <g>
                    <polygon class="background" points="28.5,36 21.5,43 0,43 0,0.5 21.5,0.5 28.5,7.6"/>
                    <path class="outline" d="M0,42.5h21.5l6.81-6.79L28,7.79L21.5,1H0V0h21.62L29,7.38v28.76l-7.38,7.38H0V42.5z"/>
                </g>
            </svg>
            <div class="aztech-info-pull-icon" v-if="label">{{ label }}</div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import gsap from "@/services/gsap-wrapper"


export default defineComponent({
    name: "aztech-info-box",
    props: {
        label: {
            type: String,
            default: "?",
        },
        visible: {
            default: true
        }
    },
    data: () => {
        return {
            open: false,
            isOpening: false,
            isClosing: false
        }
    },
    watch: {
        visible: {
            handler() {
                if (this.visible) {
                    gsap.to(this.$el, {
                        opacity: 1,
                        pointerEvents: "all",
                        duration: .8,
                        ease: "power3.out"
                    })
                } else {
                    gsap.to(this.$el, {
                        opacity: 0,
                        pointerEvents: "none",
                        duration: .8,
                        ease: "power3.out"
                    })
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.closeBox(true)
    },
    methods: {
        onClick(event:MouseEvent) {
            if (this.isOpening || this.isClosing) {
                return
            }

            if (this.open) {
                this.closeBox()
            } else {
                this.openBox()
            }
        },
        outsideClickEvent(e: MouseEvent) {
            const target = e.target as HTMLElement
            let element = target
            if (target.classList.contains("aztech-info-box")) {
                return
            }
            while(element.parentElement) {
                if (element.classList.contains("aztech-info-box")) {
                    return
                }
                element = element.parentElement
            }
            
            window.removeEventListener("click", this.outsideClickEvent)
            this.closeBox()
        },
        closeBox(immediate = false) {
            const el = this.$el
            
            if (!el) {
                return
            }

            this.isClosing = true
            const textContainer = el.querySelector(".aztech-info-box-text-container") as HTMLElement
            
            
            if (!textContainer) {
                return
            }
            
            const width = textContainer.getBoundingClientRect().width

            gsap.to(el, {
                x: -width,
                ease: "power3.out",
                duration: immediate ? 0 : .8,
                onComplete: () => {
                    this.isClosing = false
                    this.open = false
                }
            })

        },
        openBox(immediate = false) {
            const el = this.$el
            if (!el) {
                return
            }
            this.isOpening = true

            gsap.to(el, {
                x: 0,
                ease: "power3.out",
                duration: immediate ? 0 : .8,
                onComplete: () => {
                    this.isOpening = false
                    this.open = true
                    window.addEventListener("click", this.outsideClickEvent)
                }
            })
        },
    }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.aztech-info-box {
    position: fixed;
    left: 0;
    width: calc(240px) + 40px;
    display: flex;
    z-index: 2023;
}

.aztech-info-pull {
    position: relative;
    width: 24px;
    height: 36px;
    svg {
        width: 100%;
        display: block;
        .background {
            fill: #fff;
        }
    }
    .aztech-info-pull-icon {
        font-family: $defaultFont;
        font-size: 22px;
        line-height: 22px;
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        translate: calc(-50% - 1px) -50%;

    }

    &:after {
        content: "";
        position: absolute;
        background-color: #fff;
        left: -1px;
        width: 1px;
        top: 1px;
        bottom: 1px;
    }
}

.aztech-info-box-text-container {
    width: calc(100% - 24px);
    border: 1px solid currentColor;
    background-color: #fff;
    border-left: 0 none transparent;
}
</style>
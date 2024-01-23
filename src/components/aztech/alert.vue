<template>
    <div class="aztech-alert">
        <figure class="aztech-alert-bg" @click="closeAlert"></figure>
        <div class="aztech-alert-dialog">
            <div class="aztech-alert-dialog-container" ref="dialogContainer">
                <figure class="aztech-alert-dialog-bg">
                    <svg :viewBox="`0 0 ${dialog.width} ${dialog.height}`" preserveAspectRatio="none">
                        <polygon :points="`
                            8,0
                            ${dialog.width},0
                            ${dialog.width},${dialog.height}
                            0,${dialog.height}
                            0,8
                            8,0
                            `" />
                    </svg>
                </figure>
                
                <div class="aztech-alert-icon-container">
                    <div class="aztech-alert-icon" v-html="icon" />
                </div>
                <div class="aztech-alert-content-container">
                    <div class="aztech-alert-content-title">Warning</div>
                    <div class="aztech-alert-content">
                        <slot />
                    </div>
                </div>
            </div>

            <div class="aztech-buttons">
                <aztech-button :class="[option.type=='primary' ? '__isPrimary' : '']" v-for="(option,k) in options" :key="k" @click="option.onClick">{{ option.label }}</aztech-button>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import gsap from "@/services/gsap-wrapper"
import AztechButton from "@/components/aztech/button.vue"
import warningIcon from  "@/assets/aztech/hand-explanation-mark.svg?raw"
import type {AztechAlertOption} from "@/types/aztech-alert"

export default defineComponent({
    name: "aztech-alert",
    components: {
        AztechButton,
        // warningIcon
    },
    props: {
        open: {
            type: Boolean,
            required: false,
            default: false
        },
        options: {
            type: Array as () => Array<AztechAlertOption> | Array<AztechAlertOption>,
            required: true,
            default: () => [
                {
                    label: "DEFAULT",
                    type: "primary", // Set the correct type value
                    onClick: () => {
                        console.warn("SPECIFY OPTIONS ATTRIBUTE")
                    },
                },
            ],
        },
    },
    data: () => {
        return {
            isOpen: false,
            icon: warningIcon,
            dialog: {
                width: 0,
                height: 0
            } as {
                width: number,
                height: number
            }
        }
    },
    watch: {
        "open": {
            handler() {
                if (this.open == this.isOpen) return
                if (!this.$el) return
                const dialog = this.$el.querySelectorAll(".aztech-alert-dialog-container")
                const buttons = this.$el.querySelectorAll(".aztech-button")

                gsap.killTweensOf(this.$el)
                gsap.killTweensOf(dialog)
                gsap.killTweensOf( buttons)

                if (this.open) {
                    this.openAlert()
                } else {
                    this.closeAlert()
                }
            },
        }
    },
    mounted() {
        this.updateSize()
        if (this.open) {
            this.isOpen = this.open
        }

        if (this.isOpen) {
            this.openAlert()
        } else {
            gsap.set(this.$el, { opacity: 0, pointerEvents: "none" })
        }

        window.addEventListener("resize", this.updateSize)    
    },
    unmounted() {
        window.removeEventListener("resize", this.updateSize)
    },
    methods: {
        closeAlert() {
            if (!this.isOpen ) {
                return
            }
            const $el = this.$el
            const dialog = $el.querySelectorAll(".aztech-alert-dialog-container")
            const buttons = $el.querySelectorAll(".aztech-button")
            this.$emit("close", true)
            this.isOpen = false
            
            gsap.to($el, { opacity: 0, duration: 0.8, onComplete: () => {
                gsap.set($el, { pointerEvents: "none" })
            }})

            gsap.fromTo(buttons,{
                opacity: 1,
            },{
                opacity: 0,
                duration: 0.64,
                stagger: 0.08,
                ease: "power2.out"
            })

            gsap.fromTo(dialog,{
                opacity: 1,
            },{
                opacity: 0,
                duration: 0.8,
                ease: "power4.out"
            })

        },
        openAlert() {
            const $el = this.$el
            const dialog = $el.querySelectorAll(".aztech-alert-dialog-container")
            const buttons = $el.querySelectorAll(".aztech-button")
            this.isOpen = true

            gsap.to($el, { opacity: 1, duration: 0.3, onComplete: () => {
                gsap.set($el, { pointerEvents: "all" })
            }})


            gsap.fromTo(buttons,{
                y: 16,
                opacity: 0,
            },{
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "power2.out"
            })

            gsap.fromTo(dialog,{
                y: -16,
                opacity: 0,
            },{
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power4.out"
            })

        },
        updateSize() {
            const dialogContainer = this.$refs.dialogContainer as HTMLElement
            if (!dialogContainer) return null
            this.dialog = {
                width: dialogContainer.clientWidth,
                height: dialogContainer.clientHeight
            }
        },
    }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.aztech-alert {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2023;
}

.aztech-alert-bg {
    background-color: #eee;
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0.96;
}
.aztech-alert-dialog {
    max-width: 480px;
    padding: 40px;
    display: flex;
    flex-flow: column nowrap;
    gap: 24px;
    align-items: center;
}

.aztech-alert-dialog-container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-flow: row nowrap;
}
.aztech-alert-icon-container {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.aztech-alert-content-container {
    width: calc(100% - 80px);
    padding: 24px 24px 24px 0;
}

.aztech-alert-icon {
    height: 64px;
    width: 32px;
}

.aztech-buttons {
    display: flex;
    flex-flow: row nowrap;
    gap: 16px;
}

.aztech-alert-content-title {
    font-family: $accentFont;
    font-size: 24px;
    margin: 0 0 8px;
    padding: 0;
}
.aztech-alert-content {
    font-weight: normal;
    font-family: $defaultFont;
}
.aztech-alert-dialog-bg {
    position: absolute;
    inset: 0;
    margin: 0;
    z-index: -1;

    svg {
        width: 100%;
        height: 100%;
        fill: #fff;
        stroke-width: 0.72px;
        stroke: $black;
    }
}
.aztech-label-svg {
    fill: $black;
    height: 32px;
}

@media (min-width: 512px) { 
    .aztech-alert-icon-container {
        width: 128px;
        padding: 40px;
        position: relative;

        &:after {
            content: "";
            width: 1px;
            background-color: $light-grey2;
            height: 64px;
            position: absolute;
            right: 0;
        }
    }

    .aztech-alert-dialog {
        max-width: 600px;
    }
    .aztech-alert-content-container {
        width: calc(100% - 128px);
        padding: 24px 40px;
    }
}
</style>
<template>
    <div class="aztech-modal">
        <figure class="aztech-modal-bg" @click="closeModal"></figure>
        <aztechMonitor ref="content" :open="open" update="resizeMonitor">
            <slot />
        </aztechMonitor>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import gsap from "gsap"
import aztechMonitor from "@/components/aztech/monitor.vue"
// import type {AztechModalOption} from "@/types/aztech-modal"

export default defineComponent({
    name: "aztech-modal",
    components: {
        aztechMonitor
    },
    props: {
        open: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    data: () => {
        return {
            resizeMonitor: 1,
            isOpen: false,
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
                this.updateSize()
                if (this.open == this.isOpen) return
                if (!this.$el) return
                const buttons = this.$el.querySelectorAll(".aztech-button")

                gsap.killTweensOf(this.$el)
                gsap.killTweensOf( buttons)

                if (this.open) {
                    this.openModal()
                } else {
                    this.closeModal()
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
            this.openModal()
        } else {
            gsap.set(this.$el, { opacity: 0, pointerEvents: "none" })
        }

        window.addEventListener("resize", this.updateSize)    
    },
    unmounted() {
        window.removeEventListener("resize", this.updateSize)
    },
    methods: {
        closeModal() {
            if (!this.isOpen ) {
                return
            }

            const $el = this.$el
            const contentContainer = this.$refs["content"]
            if (!contentContainer) return
            
            this.$emit("close", true)
            this.isOpen = false
            
            gsap.to($el, { opacity: 0, duration: 0.8, onComplete: () => {
                gsap.set($el, { pointerEvents: "none" })
            }})

            gsap.fromTo(contentContainer,{
                opacity: 1,
            },{
                opacity: 0,
                duration: 0.4,
                ease: "power4.out"
            })

        },
        openModal() {
            const $el = this.$el
            const contentContainer = this.$refs["content"]
            this.isOpen = true
            if (!contentContainer) return

            gsap.to($el, { opacity: 1, duration: 0.32, onComplete: () => {
                gsap.set($el, { pointerEvents: "all" })
            }})



            gsap.fromTo(contentContainer,{
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
            // this.resizeMonitor++
            const content = this.$refs.content as HTMLElement
            if (!content) return null
        },
    }
})
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";

.aztech-modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2023;
    padding: 64px 72px 80px;
    overflow: hidden;
    
    .aztech-monitor-bg {
        fill: #fafafa;
    }
    .aztech-monitor-content {
        padding-right: 32px;
        width: calc(100% - 8px);
    }
}

.aztech-modal-bg {
    background-color: #eee;
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0.96;
}

</style>
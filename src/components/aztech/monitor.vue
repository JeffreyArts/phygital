<template>
    <div class="aztech-monitor" :style="height > 32 ? `height:${height}px` : ``" ref="container">
        <svg class="aztech-monitor-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="`0 0 ${width} ${height}`" xml:space="preserve">
            <rect class="aztech-monitor-bg" x="0" y="8" :width="width" :height="height - 8 * 2"/>
            <polygon ref="left" :points="`
                0, ${height / 2 - 16 - 6 }
                6, ${height / 2 - 16}
                6, ${height / 2 + 16}
                0, ${height / 2 + 16 + 6}
            ` "/>

            <polygon ref="right" :points="`
                ${width}, ${height / 2 - 16 - 6 }
                ${width - 6}, ${height / 2 - 16}
                ${width - 6}, ${height / 2 + 16}
                ${width}, ${height / 2 + 16 + 6}
            ` "/>
        
            <g class="aztech-monitor-svg-top">
                <polygon ref="top" :points="
                    `0,20
                    0,8
                    8,0
                    ${width/2 - 16},0 
                    ${width/2 - 12},4
                    ${width/2 + 12},4
                    ${width/2 + 16},0
                    ${width - 8},0
                    ${width},8
                    ${width},20
                    ${width - 12},20
                    ${width - 16},16
                    16,16
                    12,20
                    4,20
                    `" />

                <circle cx="16" cy="8" r="3"/>
                <circle cx="24" cy="8" r="3"/>
                <circle cx="32" cy="8" r="3"/>
            </g>

            <g class="aztech-monitor-svg-bottom">
                <polygon ref="bottom" :points="
                    `
                    0, ${height - 20}
                    0, ${height - 8}
                    8, ${height}
                    ${width/2 - 16}, ${height}
                    ${width/2 - 12}, ${height - 4}
                    ${width/2 + 12}, ${height - 4}
                    ${width/2 + 16}, ${height}
                    ${width - 8}, ${height}
                    ${width}, ${height - 8}
                    ${width}, ${height - 20}
                    ${width - 12}, ${height - 20}
                    ${width - 16}, ${height - 16}
                    16, ${height - 16}
                    12, ${height - 20}
                    4, ${height - 20}
                    `"/>
                    
                <circle :cy="height - 8" :cx="width - 16" r="3"/>
                <circle :cy="height - 8" :cx="width - 24" r="3"/>
                <circle :cy="height - 8" :cx="width - 32" r="3"/>
            </g>
        </svg>
        
        <span class="aztech-monitor-content" ref="content" :style="height >= 32 ? `height:${height - 32}px` : ``">
            <slot />
        </span>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import gsap from "gsap"

export default defineComponent({
    name: "aztech-monitor",
    props: {
        open: {
            type: Boolean
        }
    },
    data: () => {
        return {
            width: 0,
            height: 0,
            finalHeight: 0,
        }
    },
    watch: {
        open() {
            if (this.open) {
                this.openMonitor()
            } else {
                this.closeMonitor()
            }

        },
    },
    mounted() {
        const container = this.$refs.container as HTMLElement
        this.height = container.clientHeight
        if (this.height > window.innerHeight - 320) {
            this.height = window.innerHeight - 320
        }
        this.finalHeight = this.height
        gsap.set(".aztech-monitor-content", {
            opacity: 0
        })
        this.$nextTick(() => {
            this.updateMonitor()
        })
        
        window.addEventListener("resize", this.updateMonitor)    
    },
    unmounted() {
        window.removeEventListener("resize", this.updateMonitor)
    },
    methods: {
        updateMonitor() {
            const container = this.$refs.container as HTMLElement
            const contentElement = this.$refs.content as HTMLElement
            const topSection = this.$refs.top as HTMLElement
            const bottomSection = this.$refs.bottom as HTMLElement
            const leftSection = this.$refs.left as HTMLElement
            const rightSection = this.$refs.right as HTMLElement
            
            if (!container || !contentElement || !topSection || !bottomSection || !leftSection || !rightSection) return null

            this.width = container.clientWidth
            this.height = container.clientHeight
        },
        closeMonitor() {
            gsap.killTweensOf(this)

            gsap.to(this, {
                height: 32,
                duration: 0.64,
                ease: "power2.out",
            })
            // gsap.to(this, {
            //     height: 32,,
            //     duration: 0.64,
            //     ease: "power2.out",
            // })
        },
        openMonitor() {
            // this.height = 32
            const contentElement = this.$refs.content as HTMLElement

            gsap.set(contentElement, {
                opacity: 0
            })
            gsap.fromTo(this, {
                height: 32,
            }, {
                height: this.finalHeight,
                duration: 0.64,
                ease: "power2.out",
            })

            gsap.to(contentElement, {
                opacity: 1,
                duration: .4,
                delay: .4,
                ease: "power2.out",
            })
        }
    },
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.aztech-monitor {
    display: inline-block;
    position: relative;
    overflow: hidden;
}

.aztech-monitor-content {
    padding: 0 24px;
    margin: 16px 0;
    display: block;
    position: relative;
    opacity: 0;
    overflow: auto;
}

.aztech-monitor-svg{
    pointer-events: none;
    position: absolute;
    inset: 0;
    
    rect {
        stroke: currentColor;
        stroke-width: 1px;
    }
    circle {
        fill: #eee;
    }
    fill: $dark-grey;
}
</style>
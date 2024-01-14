<template>
    <div class="aztech-line-1">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="`0 0 ${svgWidth} 6`" xml:space="preserve">
            <path class="aztech-line-1-start" d="M2,2C0.9,2,0,2.9,0,4c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2C4,2.9,3.1,2,2,2L2,2z"/>
            <line class="aztech-line-1-line" :x1="startX" y1="4" :x2="startX + lineWidth + 22" y2="4"/>
            <polygon class="aztech-line-1-end" :style="`translate: ${startX + lineWidth}px 0`" points="24,0 24,2.2 22.2,4 0.34,4 0,3.19  3.19,0 23.67,0 "/>
        </svg>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "aztech-line-1",
    data: () => {
        return {
            startX: 71.5,
            svgWidth: 0,
            lineWidth: 1.5,
        }
    },
    mounted() {
        setTimeout(() => {
            this.updateLine()
        })
        window.addEventListener("resize", this.updateLine)    
    },
    unmounted() {
        window.removeEventListener("resize", this.updateLine)
    },
    methods: {
        updateLine() {
            const el = this.$el as HTMLElement
            if (!el) return
            this.svgWidth = el.clientWidth
            const startSectionWidth = 4
            const endSectionWidth = 22
            this.startX = startSectionWidth/2
            this.lineWidth = el.clientWidth - startSectionWidth - endSectionWidth
        },
    }
})
</script>

<style lang="scss" scoped>
.aztech-line-1 {
    svg {
        width: 100%;
        height: 6px;
    }

}
.aztech-line-1-end-section {
    fill: currentColor;
    stroke-width: 0;
}   
.aztech-line-1-line {
    stroke-width: 1;
    stroke: currentColor;
}
</style>

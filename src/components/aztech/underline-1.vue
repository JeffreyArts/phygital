<template>
    <div class="aztech-underline-1">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :viewBox="`0 0 ${svgWidth} 8`" xml:space="preserve">
            <line class="aztech-underline-1-line" :x1="startX" y1="7.5" :x2="startX + lineWidth" y2="7.5"/>
            <g class="aztech-underline-1-start-section">
                <polygon class="aztech-underline-1-diagonal" :style="{translate: `${startX - 7}px 0`}" points="0,0.92 7.12,8 8,8 8,7.58 0.37,0 0,0 "/>
                <g class="aztech-underline-1-slots">
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 16" points="120.3,0.92 120.3,1.64 126.2,7.54 129.74,7.54 129.74,5.18 128.56,4 127.38,4 124.27,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 15" points="112.25,0.92 112.25,1.64 118.15,7.54 121.69,7.54 121.69,5.18 120.51,4 119.33,4 116.22,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 14" points="104.25,0.92 104.25,1.64 110.15,7.54 113.69,7.54 113.69,5.18 112.51,4 111.33,4 108.22,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 13" points="96.25,0.92 96.25,1.64 102.15,7.54 105.69,7.54 105.69,5.18 104.51,4 103.33,4 100.22,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 12" points="88.2,0.92 88.2,1.64 94.1,7.54 97.64,7.54 97.64,5.18 96.46,4 95.28,4 92.17,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 11" points="80.2,0.92 80.2,1.64 86.1,7.54 89.64,7.54 89.64,5.18 88.46,4 87.28,4 84.17,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 10" points="72.2,0.92 72.2,1.64 78.1,7.54 81.64,7.54 81.64,5.18 80.46,4 79.28,4 76.17,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 9" points="64.15,0.92 64.15,1.64 70.05,7.54 73.59,7.54 73.59,5.18 72.41,4 71.23,4 68.12,0.92 	"/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 8" points="56.15,0.92 56.15,1.64 62.05,7.54 65.59,7.54 65.59,5.18 64.41,4 63.23,4 60.12,0.92 "/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 7" points="48.1,0.92 48.1,1.64 54,7.54 57.54,7.54 57.54,5.18 56.36,4 55.18,4 52.07,0.92 "/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 6" points="40.1,0.92 40.1,1.64 46,7.54 49.54,7.54 49.54,5.18 48.36,4 47.18,4 44.07,0.92 "/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 5" points="32.1,0.92 32.1,1.64 38,7.54 41.54,7.54 41.54,5.18 40.36,4 39.18,4 36.07,0.92 "/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 4" points="24.05,0.92 24.05,1.64 29.95,7.54 33.49,7.54 33.49,5.18 32.31,4 31.13,4 28.02,0.92 "/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 3" points="16.05,0.92 16.05,1.64 21.95,7.54 25.49,7.54 25.49,5.18 24.31,4 23.13,4 20.02,0.92 "/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 2" points="8.05,0.92 8.05,1.64 13.95,7.54 17.49,7.54 17.49,5.18 16.31,4 15.13,4 12.02,0.92 "/>
                    <polygon class="aztech-underline-1-slot" v-if="slots >= 1" points="0,0.92 0,1.64 5.9,7.54 9.44,7.54 9.44,5.18 8.26,4 7.08,4 3.97,0.92 "/>
                </g>
                <line class="aztech-underline-1-line" x1="0" y1="0.5" :x2="startX - 7" y2="0.5"/>
            </g>
            <polygon class="aztech-underline-1-end-section" :style="{translate: `${startX + lineWidth -.5}px 0`}" points="8,0.5 4,0.5 4,3.7 0,7.7 0,8 1.11,8 4.61,4.5 8,4.5 "/>
        </svg>
        <span class="aztech-underline-1-text" >seed</span>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "aztech-underline-1",
    props: {
        label: {
            type: String,
            required: false,
            default: ""
        },
        slots: {
            type: Number,
            required: false,
            default: 2,
            max: 8,
            min: 0
        }
    },
    data: () => {
        return {
            startX: 71.5,
            svgWidth: 0,
            lineWidth: 1.5,
        }
    },
    watch: {
        slots() {
            this.updateLine()
        },
        label: {
            immediate: true,
            handler: "updateLine"
        }
    },
    mounted() {
        // Timeout is required because it first has to render the label. Only after that is being done, the correct width can be calculated
        
        this.$nextTick(() => {
            this.updateLine()
        })
        window.addEventListener("resize", this.updateLine)    
    },
    
    unmounted() {
        window.removeEventListener("resize", this.updateLine)
    },
    methods: {
        updateLine() {
            this.$nextTick(() => {
                
                let el = this.$el as HTMLElement
                if (!el) return

                this.startX = this.slots * 8 + 8
                this.svgWidth = el.clientWidth
                const startSectionWidth = this.slots * 8 + 2
                const endSectionWidth = 14
                this.lineWidth = el.clientWidth - startSectionWidth - endSectionWidth            
            })
        },
    }
})
</script>

<style lang="scss" scoped>
.aztech-underline-1 {
    height: 14px;
    position: relative;

    svg {
        width: 100%;
    }

}
.aztech-underline-1-start-section,
.aztech-underline-1-end-section {
    fill: currentColor;
    stroke-width: 0;
}   
    
.aztech-underline-1-text {
    position: absolute;
    right: 10px;
    bottom: 0px;
    font-family: Fixedsys, monospace;
    font-weight: normal;
    display: inline-block;
    font-size: 14px;
}
.aztech-underline-1-line {
    stroke-width: 1;
    stroke: currentColor;
}
</style>

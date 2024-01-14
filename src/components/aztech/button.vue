<template>
    <div class="aztech-button">
        <svg class="aztech-button-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="`0 0 ${width} 32`" xml:space="preserve">
            <polygon class="aztech-button-center-piece" :points="`
                0,32
                0,26
                2,24
                5.5,24
                29.5,0
                ${width},0
                ${width},6
                ${width - 2},8
                ${width - 5.5},8
                ${width - 29.5},32
                0,32
            `"/>
            <polygon class="aztech-button-start-piece" points="0,9.5 9.5,0 18,0 18,6 16,8 12.5,8 1.5,19 0,19 0,9.5 "/>
            <polygon class="aztech-button-end-piece" :style="{translate: `${width - 18}px 0`}" points="18,22.5 8.5,32 0,32 0,26 2,24 5.5,24 16.5,13 18,13 18,22.5 "/>
        </svg>

        <span class="aztech-button-content" ref="content">
            <slot />
        </span>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "aztech-button",
    data: () => {
        return {
            width: 0
        }
    },
    mounted() {
        this.updateSize()
        window.addEventListener("resize", this.updateSize)    
    },
    unmounted() {
        window.removeEventListener("resize", this.updateSize)
    },
    methods: {
        updateSize() {
            const contentElement = this.$refs.content as HTMLElement
            if (!contentElement) return null
            this.width = contentElement.clientWidth
        },
    }
})
</script>

<style lang="scss"  >
@import "@/assets/scss/variables.scss";

.aztech-button {
    display: inline-block;
    position: relative;
    z-index: 1;
    text-align: center;
    line-height: 16px;
    translate: 0 -1px;
    font-size: inherit;
    font-family: $defaultFont;
    font-size:14px;
    height: 32px;
    fill: $white;
    color: $dark-grey2;
    stroke: $light-grey2;
    stroke-width: 0.72;
    cursor: pointer;
    
    &.__isPrimary {
        color: $white;
        stroke-width: 0;
        fill: $dark-grey;
    }
}

.aztech-button-content {
    height: 32px;
    line-height: 16px;
    padding: 8px 32px;
    display: inline-block;
    position: relative;
}

.aztech-button-svg {
    position: absolute;
    height: 32px;
    overflow:visible;
}
</style>
<template>
    <div class="aztech-label">
        <svg class="aztech-label-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="`0 0 ${widthStartSection + width + widthEndSection} 16`" xml:space="preserve">
            <polygon :points="`
                   ${widthStartSection},16
                    0,8.62
                    0,7.38
                    ${widthStartSection},0
                    ${widthStartSection + width},0
                    ${widthStartSection + width + widthEndSection},7.38
                    ${widthStartSection + width + widthEndSection},8.62
                    ${widthStartSection + width },16 `"/>
        </svg>
        <span class="aztech-label-content-spacer" ref="content">
            <slot />
        </span>
        <span class="aztech-label-content">
            <slot />
        </span>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "aztech-label",
    data: () => {
        return {
            widthStartSection: 7.5,
            widthEndSection: 7.5,
            width: 0
        }
    },
    mounted() {
        this.updateLabel()
        window.addEventListener("resize", this.updateLabel)    
    },
    unmounted() {
        window.removeEventListener("resize", this.updateLabel)
    },
    methods: {
        updateLabel() {
            const contentElement = this.$refs.content as HTMLElement
            if (!contentElement) return null
            this.width = contentElement.clientWidth
        },
    }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.aztech-label-content {
    display: inline-block;
    z-index: 1;
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    line-height: 16px;
    translate: 0 -1px;
    padding: 0 4px;
    font-size: inherit;
}

.aztech-label {
    display: block;
    position: relative;
    height: 16px;
    font-size: 14px;
    color: #fff;
}
.aztech-label-content-spacer {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    font-size: inherit;
    padding: 0 4px;
}

.aztech-label-svg {
    fill: $black;
    height: 16px;
}
</style>
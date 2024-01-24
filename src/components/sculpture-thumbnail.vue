<template>
    <div class="sculpture-thumbnail"  ref="container">
        <!-- :style="height > 32 ? `height:${height}px` : ``" -->
        <svg ref="header" class="sculpture-thumbnail-header-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="`0 0 ${width} 11`" xml:space="preserve">
            <polygon :points="`
            4, 0
            ${width/2 - 4}, 0
            ${width/2 - 2}, 2
            ${width/2 + 2}, 2
            ${width/2 + 4}, 0
            ${width - 4}, 0
            ${width}, 4
            ${width}, 11
            ${width - 2}, 11
            ${width - 4}, 9
            4, 9
            2, 11
            0, 11
            0, 4
            `"/>
            <circle cx="12" cy="4.5" r="2" class="dot" />
            <circle cx="20" cy="4.5" r="2" class="dot" />
            <circle cx="28" cy="4.5" r="2" class="dot" />
        </svg>
        
        <div class="sculpture-thumbnail-image-container">
            <img ref="img" v-if="src" :src="src" class="sculpture-thumbnail-image" alt="Photograph of geometric sculpture made of concrete"/>
        </div>

        <footer class="sculpture-thumbnail-footer" v-if="title">
            <span class="sculpture-thumbnail-footer-text">{{ title }}</span>
            <svg ref="footer" class="sculpture-thumbnail-footer-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :viewBox="`0 0 ${width} ${footerHeight}`" xml:space="preserve">
                <polygon :points="`
                0, 0
                2, 0
                4, 2
                ${width - 4}, 2
                ${width - 2}, 0
                ${width}, 0
                ${width}, ${footerHeight - 4}
                ${width - 4}, ${footerHeight}
                4, ${footerHeight}
                0, ${footerHeight - 4}
                `"/>
                <circle :cx="`${width - 12}`" cy="8" r="2" class="dot" />
                <circle :cx="`${width - 20}`" cy="8" r="2" class="dot" />
                <circle :cx="`${width - 28}`" cy="8" r="2" class="dot" />
            </svg>

        </footer>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import gsap from "@/services/gsap-wrapper"
import _ from "lodash"

export default defineComponent({
    name: "sculpture-thumbnail",
    props: {
        src: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    data: () => {
        return {
            width: 0,
            height: 0,
            footerHeight: 0,
        }
    },
    watch: {
        
    },
    mounted() {
        const container = this.$refs.container as HTMLElement
        this.height = container.clientHeight

        this.$nextTick(() => {
            this.updateSVG()
        })
        
        window.addEventListener("resize", this.updateSVG)    
    },
    unmounted() {
        window.removeEventListener("resize", this.updateSVG)
    },
    methods: {
        updateSVG() {
            const container = this.$refs.container as HTMLElement
            const footer = this.$refs.container as HTMLElement
            
            if (!container || !footer) return null

            this.width = container.clientWidth
            this.height = container.clientHeight

            const footerText = this.$el.querySelector(".sculpture-thumbnail-footer-text")
            this.footerHeight = footerText.clientHeight
        },
    },
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.sculpture-thumbnail {
    display: inline-block;
    position: relative;
}

.sculpture-thumbnail-image-container {
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    aspect-ratio: 1/1;
    margin-top: -8px;
    border-left:1px solid $black;
    border-right:1px solid $black;
}

.sculpture-thumbnail-image {
    width: 100%;
    transform-origin: center;
}

.sculpture-thumbnail-header-svg {
    z-index: 1;
    position: relative;
    .dot {
        opacity: 0;
        fill: #eee;
    }
}

.sculpture-thumbnail-footer {
    width: 100%;
    position: relative;
    display: block;
    margin-top: -8px;
}
.sculpture-thumbnail-footer-svg {
    width: 100%;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    .dot {
        opacity: 0;
        fill: #eee;
    }
}

.sculpture-thumbnail-footer-text {
    display: inline-block;
    position: relative;
    color: #fff;
    z-index: 1;
    font-size: 18px;
    width: 100%;
    text-align: center;
    line-height: 1;
    padding: 8px 0;
}
</style>
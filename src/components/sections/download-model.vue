<template>
    <div class="download-model-section" ref="container">
        <div class="download-container" @click="downloadModel" @mouseenter="mouseEnterEvent" @mouseleave="mouseLeaveEvent">
            <icon class="download-icon" type="save"></icon>
            <label class="download-label">download model</label>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import icon from "@/components/icon.vue"
import PhygitalStore from "@/stores/phygital"
import AppStore from "@/stores/app"
import { SculptureGroup } from "@/stores/phygital"
import * as THREE from "three"

import gsap from "@/services/gsap-wrapper"

export default defineComponent({
    name: "download-model",
    components: {
        icon,
    },
    props: {
        character: {
            type: String,
            required: false,
            default: "-"
        },
    },
    setup() {
        const phygital = PhygitalStore()
        const app = AppStore()
        return {
            phygital, 
            app
        }
    },
    mounted() {
        //        
    },
    methods: {
        clickAnimation() {
            const el = this.$el as HTMLElement
            if (!el) {
                return
            }
            const svg = el.querySelector("svg")
            if (!svg) {
                return
            }

            const arrow = svg.querySelector(".icon-save-arrow") 
            gsap.timeline().to(arrow, {
                y: 2,
                // delay:.24,
                duration: .32,
                ease: "power2.in"
            }).to(arrow, {
                y: 0,
                duration: .24,
                ease: "linear"
            })
            const saveBox = svg.querySelector(".icon-save-box") 
            gsap.timeline().to(saveBox, {
                fill: "rgba(0,0,0,.4)",
                duration: .16,
                delay: .16,
                ease: "power2.out"
            }).to(saveBox, {
                fill: "#111",
                duration: .24,
                ease: "power2.in"
            })
        },
        downloadModel(e: Event) {
            let filename=  this.phygital.seed
            
            this.clickAnimation()
            const model = new THREE.Group() as SculptureGroup
            model.name = "sculpture"
            model.width = this.phygital.surfaces.top.width
            model.depth = this.phygital.surfaces.top.height
            model.height = this.phygital.surfaces.left.height
            
            this.phygital.update3DModel(model, "top")
            this.phygital.update3DModel(model, "bottom")
            this.phygital.update3DModel(model, "left")
            this.phygital.update3DModel(model, "right")
            this.phygital.update3DModel(model, "back")
            this.phygital.update3DModel(model, "front")
            this.phygital.downloadSTL(model, filename)
        },
        mouseEnterEvent() {
            const label = this.$el.querySelector(".download-label")
            gsap.to(label, {
                scale: 1.1,
                duration: .24,
                ease: "power3.out"
            })
        },
        mouseLeaveEvent() {
            const label = this.$el.querySelector(".download-label")
            gsap.to(label, {
                scale: 1,
                duration: .32,
                ease: "power3.out"
            })
        }
    }
})
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
.download-model-section {
    position: relative;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    container-type: size;
    container-name: download-model-section;
}


.download-container {
    width: 100%;
    display: flex;
    flex-flow: column;
    font-size: 14px;
    gap: 8px;
    justify-content: start;
    align-items: center;
    font-family: $accentFont;
    cursor: pointer;
    
    .icon {
        height: 32px;
    }

    .icon-save-arrow {
        transition: ease .24s all;
    }
}

.download-label {
    transform-origin: top center;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
}

.download-icon {
    align-items: normal;
}

@container download-model-section (min-width: 180px) {
    .download-container {
        flex-flow: row;
        text-align: left;

        .icon {
            height: 40px;
        }
        
        .download-label {
            font-size: 18px;
            padding-left: 4px;

            transform-origin: left center;
        }
    }
}

@container download-model-section (min-width: 480px) {
    .download-container {
        .download-label {
            font-size: 16px;
            // padding-left: 4px;
        }
    }
}
@container download-model-section (min-width: 560px) {
    .download-container {
        .icon {
            height: 48px;
        }
        .download-label {
            //     font-size: 18px;
            padding-left: 8px;
        }
    }
}
@container download-model-section (min-width: 640px) {
    .download-container {
        .download-label {
            font-size: 18px;
        }
    }
}

</style>

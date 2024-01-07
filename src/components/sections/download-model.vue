<template>
    <div class="download-model-section" ref="container">
        <div class="download-container" @click="downloadModel">
            <icon class="download-icon" type="save"></icon>
            <label class="download-label">download model</label>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import icon from "@/components/icon.vue"
import Phygital from "@/stores/phygital"
import gsap from "gsap"

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
        const phygital = Phygital()
        return {
            phygital
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
        downloadModel() {
            let filename=  this.phygital.seed + ""
            const seedDom = document.querySelector(".seed-value") as HTMLElement
            if (seedDom) {
                filename = seedDom.innerText
            }
            this.clickAnimation()

            // this.phygital.downloadSTL(filename)
        },
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
    
    &:hover {
        cursor: pointer;
        
        .icon-save-arrow {
            animation: hoverSaveIcon .4s ease infinite alternate;
        }
        .download-label {
            translate: 0 0;
            scale: 1.1;
        }
    }
    
    .icon {
        height: 32px;
    }


    .icon-save-arrow {
        transition: ease .24s all;
    }
}

.download-label {
    transition: ease .24s all;
    transform-origin: top center;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
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

<template>
    <div class="meta-dimensions-section" ref="container">
        <div class="meta-container">
            <span class="meta-blocksize">Sculpture size</span>
            <aztech-line />
            <div class="meta-container-dimensions">
                <aztech-input-number v-model="width" disabled label="width" unit="cm"/>
                <aztech-input-number v-model="height" disabled label="height" unit="cm" />
                <aztech-input-number v-model="depth" disabled label="depth" unit="cm" />
            </div>
            <div class="cube-size">
                <aztech-input-number v-model="phygital.blockSize"  label="Block size" unit="cm"  @increase="modifyBlockSize" @decrease="modifyBlockSize"/>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import Phygital from "@/stores/phygital"
import AztechLine from "@/components/aztech/line-1.vue"
import AztechInputNumber from "@/components/aztech/input-number.vue"

export default defineComponent({
    name: "cube-config",
    components: {
        AztechLine, AztechInputNumber
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
    computed: {
        width() {
            return (this.phygital.surfaces.top.width*2-1) * this.phygital.blockSize
        },
        height() {
            return (this.phygital.surfaces.left.height*2-1) * this.phygital.blockSize
        },
        depth() {
            return (this.phygital.surfaces.top.height*2-1) * this.phygital.blockSize
        }
    },
    mounted() {
        
        this.mountedAnimations()
        
    },
    methods: {
        mountedAnimations() {
            //
        },
        modifyBlockSize(newSize:number) {
            this.phygital.blockSize = newSize
        }
    }
})
</script>

<style lang="scss" >
@import "@/assets/scss/variables.scss";
.meta-dimensions-section {
    position: relative;
    display: flex;
    flex-flow: column;
    padding: 0;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    container-type: size;
    container-name: meta-dimensions-section;

    .aztech-line-1 {
        display: none;
    }
}

.meta-blocksize {
    font-family: $accentFont;
    font-size: 14px;
    display: none;
    line-height: 1;
}

.meta-container-dimensions {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items:flex-end;
    .aztech-input-number-text-value-container {
        font-size: 11px;
    }
}


// @container meta-dimensions-section (min-height: 48px) {
//     .meta-dimensions-section {
//     }
// }

@container meta-dimensions-section (min-height: 56px) {
    .meta-dimensions-section {
        // .aztech-line-1 {
        //     margin-bottom: 4px;
        // }
    }
}

@container meta-dimensions-section (min-height: 64px) {
    .meta-dimensions-section {
        // .aztech-line-1 {
        //     margin-bottom: 8px;
        // }
        .aztech-input-number-text-unit {
            margin-left: -4px;
        }
    }
}

@container meta-dimensions-section (min-height: 72px) {
    // .meta-dimensions-section {
        //     .aztech-line-1 {
            //         margin-bottom: 12px;
            //     }
            // }
            
}

@container meta-dimensions-section (min-height: 80px) {
    .meta-dimensions-section {
        .aztech-input-number-text-value-container {
            font-size: 12px;
        }
    }

    .meta-dimensions-section {
        .aztech-line-1 {
            display: block;
        }
    }
}

@container meta-dimensions-section (min-height: 88px) {
    .meta-dimensions-section {
        .aztech-input-number-text-value-container {
            font-size: 14px;
        }
    }

    .meta-blocksize {
        display: block;
    }

    .meta-dimensions-section {
        .aztech-line-1 {
            display: none;
        }
    }
}
@container meta-dimensions-section (min-height: 96px) {
    .meta-dimensions-section {
        .meta-blocksize {
            font-size: 16px;
        }

        .aztech-line-1 {
            display: block;
        }
    }
    
}

</style>

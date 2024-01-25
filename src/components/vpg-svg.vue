<!-- 
use the .vpg-svg-content for styling the content inside the box. Best way is to style it via the parent component/route that you put this element in.
 -->

<template>
    <figure class="vpg-svg" ref="vpgSVG" v-if="width >= 1 && height >= 1 ">
        <svg 
            :viewBox="`0,0, ${width - .5},  ${height - .5}`"
            :width="width - .5"
            :heigt="height - .5"
        >
            <polyline v-for="(polyline, p) in polylinePoints" :key="p" 
                :points="`${polyline[0].x} ${polyline[0].y}, ${polyline[1].x} ${polyline[1].y}`"
                fill="none"
                ref="polyline"
            />
        </svg>
    </figure>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import _ from "lodash"


export default defineComponent({
    name: "vpg-svg",
    props: {
        vpgPattern: {
            type: Object,
            required: true,
        },
    },
    data: () => {
        return {
            width: 0,
            height: 0,
            polylinePoints: [] as Array<Array<{x: number, y: number}>>,
        }
    },
    watch: {
        "vpgPattern.polylines": {
            handler() {
                this.updateSVG()
            },
            deep: true
        }
    },
    mounted() {
        this.updateSVG()
    },
    methods: {
        updateSVG() {
            this.width = this.vpgPattern.width
            this.height = this.vpgPattern.height
            this.polylinePoints = _.map(this.vpgPattern.polylines, p => {
                return _.map(p, cord => {
                    // This, plus enlarging viewbox prevents lines to be cut off from edges
                    return {
                        x: cord.x+.25,
                        y: cord.y+.25  
                    }
                    // return `${cord.x+1},${cord.y+1}`
                })
            })
        },
        
    }
})
</script>

<style lang="scss" >
@import "./../assets/scss/variables.scss";
.vpg-svg {
    margin: 0;
    display: block;
    
    svg {
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        display: block;
        
        polyline {
            stroke: $black;
            stroke-width: .5;
            stroke-type: solid;
            stroke-linecap: square;
        }
    }
}

</style>

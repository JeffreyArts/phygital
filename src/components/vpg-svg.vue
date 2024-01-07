<!-- 
use the .vpg-svg-content for styling the content inside the box. Best way is to style it via the parent component/route that you put this element in.
 -->

<template>
    <figure class="vpg-svg" ref="vpgSVG" />
</template>


<script lang="ts">
import { defineComponent } from "vue"
import { SVG } from "@svgdotjs/svg.js"
import _ from "lodash"


export default defineComponent({
    name: "vpg-svg",
    props: {
        vpgPattern: {
            type: Object,
            required: true,
        },
        // vpgWidth: {
        //     type: Number,
        //     required: true,
        // },
    },
    data: () => {
        return {
            svg: SVG(),
            width: 0,
            height: 0,
            observer: null as null | MutationObserver
        }
    },
    watch: {
        "vpgPattern.polylines": {
            handler() {
                this.width = this.vpgPattern.width
                this.height = this.vpgPattern.height
                this.updateSVG()
            },
            deep: true
        }
        
    },
    mounted() {
        this.width = this.vpgPattern.width
        this.height = this.vpgPattern.height
        this.updateSVG()
    },
    methods: {
        updateSVG() {
            var svgContainer = this.$refs["vpgSVG"] as HTMLElement
            this.svg = SVG()
            this.svg.viewbox(0,0,this.width - .5, this.height- .5)
            // this.svg.viewbox(0,0,this.width + 1, this.height+1) // 1 unit bigger than pattern size to create padding
            
            svgContainer.innerHTML = ""

            _.each(this.vpgPattern.polylines, p => {
                var polyline = _.map(p, cord => {
                    // This, plus enlarging viewbox prevents lines to be cut off from edges
                    return `${cord.x+.25},${cord.y+.25}`
                    // return `${cord.x+1},${cord.y+1}`
                }).join(" ")

                this.svg.polyline(polyline).attr({
                    fill:"none",
                })
            })

            this.svg.addTo(svgContainer)
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

<template>
    <div class="aztech-input-toggle" :class="[isDisabled ? '__isDisabled' : '']">
        <div class="aztec-input-toggle-text-container" @click="updateValue" @mouseenter="mouseEnterEvent" @mouseleave="mouseLeaveEvent">
            <svg class="aztech-input-toggle-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 24 24" xml:space="preserve">
                <circle class="point"  cx="12" cy="12" r="3"/>
                <g class="target">
                    <polygon/>
                    <polygon/>
                    <polygon/>
                    <polygon/>
                </g>
                <g class="unselected">
                    <polygon points="0,4 0,11.7 3.3,11.7 4,11 4,7.7 1.4,5.1 1.4,4.7 1.8,4.7 3.9,6.7 4.7,6.7 6.7,4.7 6.7,3.9 4.7,1.8 4.7,1.4 5.1,1.4 7.7,4 11,4 11.7,3.3 11.7,0 4,0 "/>
                    <polygon points="20,0 12.3,0 12.3,3.3 13,4 16.3,4 18.9,1.4 19.3,1.4 19.3,1.8 17.3,3.8 17.3,4.7 19.3,6.7 20.2,6.7 22.2,4.7 22.6,4.7 22.6,5.1 20,7.7 20,11 20.7,11.7 24,11.7 24,4 "/>
                    <polygon points="20,13 20,16.3 22.6,18.9 22.6,19.3 22.2,19.3 20.1,17.3 19.3,17.3 17.3,19.3 17.3,20.1 19.3,22.2 19.3,22.6 18.9,22.6 16.3,20 13,20 12.3,20.7 12.3,24 20,24 24,20 24,12.3 20.7,12.3 "/>
                    <polygon points="7.7,20 5.1,22.6 4.7,22.6 4.7,22.2 6.7,20.1 6.7,19.3 4.7,17.3 3.9,17.3 1.8,19.3 1.4,19.3 1.4,18.9 4,16.3 4,13 3.3,12.3 0,12.3 0,20 4,24 11.7,24 11.7,20.7 11,20 "/>
                </g>
                <g class="selected">
                    <polygon points="0,4 0,11.7 3.3,11.7 4,11 4,7.7 1.4,5.1 1.4,4.7 1.8,4.7 6.9,9.7 7.7,9.7 9.7,7.7 9.7,6.9 4.7,1.8 4.7,1.4 5.1,1.4 7.7,4 11,4 11.7,3.3 11.7,0 4,0 "/>
                    <polygon points="20,0 12.3,0 12.3,3.3 13,4 16.3,4 18.9,1.4 19.3,1.4 19.3,1.8 14.3,6.8 14.3,7.7 16.3,9.7 17.2,9.7 22.2,4.7 22.6,4.7 22.6,5.1 20,7.7 20,11 20.7,11.7 24,11.7 24,4 "/>
                    <polygon points="20,13 20,16.3 22.6,18.9 22.6,19.3 22.2,19.3 17.1,14.3 16.3,14.3 14.3,16.3 14.3,17.1 19.3,22.2 19.3,22.6 18.9,22.6 16.3,20 13,20 12.3,20.7 12.3,24 20,24 24,20 24,12.3 20.7,12.3 "/>
                    <polygon points="7.7,20 5.1,22.6 4.7,22.6 4.7,22.2 9.7,17.1 9.7,16.3 7.7,14.3 6.9,14.3 1.8,19.3 1.4,19.3 1.4,18.9 4,16.3 4,13 3.3,12.3 0,12.3 0,20 4,24 11.7,24 11.7,20.7 11,20 "/>
                </g>
            </svg>
            <label class="aztech-input-toggle-text-label" v-if="label">{{ label }}</label>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import gsap from "gsap"

export default defineComponent({
    name: "aztech-input-toggle",
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
            required: false,
        },
    },
    computed: {
        isDisabled() {
            return this.disabled
        },
    },
    watch: {
        modelValue:{
            handler() {
                if (this.modelValue) {
                    this.animateSelected()
                } else {
                    this.animateDeselected()
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.modelValue) {
                const polygons = this.$el.querySelectorAll(".aztech-input-toggle-svg .target polygon")
                let targetPolygons = this.$el.querySelectorAll(".aztech-input-toggle-svg .unselected polygon")
                if (this.modelValue) {
                    let targetPolygons = this.$el.querySelectorAll(".aztech-input-toggle-svg .selected polygon")
                }
                

                polygons.forEach((t:HTMLElement,i:number) => {
                    gsap.set(t, { morphSVG: targetPolygons[i] })
                })
                this.animateSelected()
            } else {
                this.animateDeselected()
            }
        })
    },
    methods: {
        updateValue() {
            this.$emit("update", !this.modelValue)
        },
        animateSelected() {
            if (!this.$el) {
                return
            }

            const point = this.$el.querySelector(".aztech-input-toggle-svg .point")
            const targetPolygons = this.$el.querySelectorAll(".aztech-input-toggle-svg .target polygon")
            const selectedPolygons = this.$el.querySelectorAll(".aztech-input-toggle-svg .selected polygon")
            
            gsap.to(point, {
                opacity: 0,
                duration: .16,
            })

            gsap.to(point, {
                opacity: 1,
                duration: .4,
                delay: .16,
            })

            targetPolygons.forEach((t:HTMLElement,i:number) => {
                console.log(t)
                gsap.to(t, {
                    morphSVG: selectedPolygons[i], 
                    duration: 0.8,
                    ease: "elastic.out(1,.64)"
                })
            })
        },
        animateDeselected() {
            if (!this.$el) {
                return
            }
            
            const point = this.$el.querySelector(".aztech-input-toggle-svg .point")
            const targetPolygons = this.$el.querySelectorAll(".aztech-input-toggle-svg .target polygon")
            const unselectedPolygons = this.$el.querySelectorAll(".aztech-input-toggle-svg .unselected polygon")
            
            gsap.to(point, {
                opacity: 0,
                duration: .4,
            })

            targetPolygons.forEach((t:HTMLElement,i:number) => {
                gsap.to(t, {
                    morphSVG: unselectedPolygons[i], 
                    duration: 0.8,
                    ease: "elastic.out(1,.64)"
                })
            })
        },
        mouseEnterEvent() {
            const point = this.$el.querySelector(".aztech-input-toggle-svg .point")

            if (!this.modelValue) {
                gsap.to(point, {
                    opacity: 1,
                    r: 3,
                    duration: .4,
                })
            }
        },
        mouseLeaveEvent() {
            const point = this.$el.querySelector(".aztech-input-toggle-svg .point")

            if (!this.modelValue) {
                gsap.to(point, {
                    opacity: 0,
                    duration: .4,
                })
            }
        }
    }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.aztech-input-toggle {
    display: flex;
    flex-flow: row;
    gap: 8px;
    position: relative;
    &.__isDisabled {
        padding-left: 0;
        .aztech-input-toggle-svg {
            display: none;
        }
    }
}

.aztech-input-toggle-svg {
    width: 24px;
    polygon {
        fill: $black;
    } 

    .selected,
    .unselected {
        opacity: 0;
    }
}

.aztec-input-toggle-text-container {
    display: flex;
    flex-flow: row;
    gap: 8px;
    font-family: $defaultFont;
    font-size: 14px;
    align-items: center;
}

.aztech-input-toggle-text-label {
    line-height: .96;
}

</style>